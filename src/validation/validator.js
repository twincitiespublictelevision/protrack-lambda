import { S3, SNS } from 'aws-sdk';
import { XMLParser } from 'fast-xml-parser';
import moment from 'moment-timezone';

const s3 = new S3();
const parser = new XMLParser({
    ignoreAttributes: false,
    parseAttributeValue: true,
    parseTagValue: true
});
const sns = new SNS();

class ScheduleValidator {
    async validateXML(content) {
        try {
            parser.parse(content);
            return [true, null];
        } catch (error) {
            const errorMsg = error.message;
            return [false, `XML Validation Error:\n${errorMsg}`];
        }
    }

    extractScheduleDates(data) {
        const dates = [];
        const series = Array.isArray(data.schedule_data?.series)
            ? data.schedule_data.series
            : [data.schedule_data?.series];

        series.forEach(series => {
            const episodes = Array.isArray(series?.episode)
                ? series.episode
                : [series?.episode];

            episodes.forEach(episode => {
                const schedules = Array.isArray(episode?.schedule)
                    ? episode.schedule
                    : [episode?.schedule];

                schedules.forEach(schedule => {
                    if (schedule?.schedule_date) {
                        dates.push(schedule.schedule_date);
                    }
                });
            });
        });

        return dates;
    }

    async checkScheduleDates(content, daysToCheck = 7) {
        try {
            const data = parser.parse(content);
            const results = {
                totalCount: 0,
                daysCounts: {},
                missingDays: []
            };

            const schedules = this.extractScheduleDates(data);

            for (let i = 0; i < daysToCheck; i++) {
                const checkDate = moment().add(i, 'days').format('YYYY-MM-DD');
                const count = schedules.filter(date => date.startsWith(checkDate)).length;

                results.daysCounts[checkDate] = count;
                results.totalCount += count;

                if (count < 10) {
                    results.missingDays.push({
                        date: checkDate,
                        count: count
                    });
                }
            }

            return [results.missingDays.length === 0, results];
        } catch (error) {
            return [false, { error: error.message }];
        }
    }

    generateReport(filename, xmlValidation, scheduleValidation) {
        const today = moment().format('YYYY-MM-DD');
        let report = `Schedule Validation Report - ${today}\n`;
        report += `File: ${filename}\n`;
        report += '='.repeat(50) + '\n\n';

        // XML Validation Results
        const [isValid, errorMessage] = xmlValidation;
        if (isValid) {
            report += '✅ XML is well-formed\n\n';
        } else {
            report += `❌ XML validation failed:\n${errorMessage}\n\n`;
        }

        // Schedule Validation Results
        if (isValid) {
            const [sufficient, results] = scheduleValidation;
            if (sufficient) {
                report += '✅ Schedule validation passed\n\n';
                report += 'Schedule entries per day:\n';
                Object.entries(results.daysCounts).forEach(([date, count]) => {
                    report += `${date}: ${count} entries\n`;
                });
            } else {
                report += '❌ Schedule validation failed\n\n';
                if (results.missingDays) {
                    report += 'Days with insufficient entries:\n';
                    results.missingDays.forEach(day => {
                        report += `${day.date}: Only ${day.count} entries (minimum 10 required)\n`;
                    });
                }
                if (results.error) {
                    report += `Error: ${results.error}\n`;
                }
            }
        }

        return report;
    }

    async sendAlert(filename, issues) {
        const message = {
            default: JSON.stringify(issues), // for email/http/https endpoints
            sms: `ProTrack Alert: ${filename} has validation issues:\n${issues.summary}`, // for SMS
        };

        try {
            await sns.publish({
                TopicArn: process.env.ALERT_TOPIC_ARN,
                Message: JSON.stringify(message),
                MessageStructure: 'json',
                Subject: `ProTrack Validation Alert - ${filename}`
            }).promise();
        } catch (error) {
            console.error('Error sending SNS alert:', error);
        }
    }
}

export async function validate(event, context) {
    const validator = new ScheduleValidator();

    for (const record of event.Records) {
        const bucket = record.s3.bucket.name;
        const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

        try {
            // Get the XML file from S3
            const { Body: content } = await s3.getObject({
                Bucket: bucket,
                Key: key
            }).promise();

            // Validate XML and check schedule
            const xmlValidation = await validator.validateXML(content);
            const scheduleValidation = xmlValidation[0]
                ? await validator.checkScheduleDates(content)
                : [false, { error: 'Skipped due to XML validation failure' }];

            // Generate report
            const report = validator.generateReport(key, xmlValidation, scheduleValidation);

            // Save report to validation bucket
            const reportKey = `reports/${moment().format('YYYY-MM-DD')}/${key.replace('.xml', '_validation.txt')}`;
            await s3.putObject({
                Bucket: process.env.VALIDATION_BUCKET,
                Key: reportKey,
                Body: report,
                ContentType: 'text/plain'
            }).promise();

            // If there are issues, send an alert
            if (!xmlValidation[0] || !scheduleValidation[0]) {
                const issues = {
                    filename: key,
                    summary: `Issues found: ${!xmlValidation[0] ? 'Invalid XML' : ''} ${!scheduleValidation[0] ? 'Missing schedule data' : ''}`.trim(),
                    xmlError: xmlValidation[1],
                    scheduleIssues: scheduleValidation[1].missingDays || []
                };

                await validator.sendAlert(key, issues);
            }

        } catch (error) {
            // Send alert for critical errors
            await validator.sendAlert(key, {
                filename: key,
                summary: 'Critical error during validation',
                error: error.message
            });
        }
    }
}
