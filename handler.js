// @flow

import type { Airing } from './src/airing';
import type { ScheduleData } from './src/results';
import type { AiringResults } from "./src/es/airingResult";
import { toBucket, toData, backup, remove } from './src/parse/s3';
import actions from './src/es/actions';
import buildSchedule from './src/es/schedule';
import parse from './src/parse/parser';
import mapToAirings from './src/parse/protrack';
import { normalize, normalizeAirings, normalizeChannels } from './src/results';
import { receive, getShow, getEpisode, getAiring, getViews } from './src/scheduleData';
import moment from "moment-timezone";

function p(event: Object, key: string): string {
  return event && event.pathParameters && event.pathParameters[key] || '';
}

function q(event: Object, key: string): string {
  return event && event.queryStringParameters && event.queryStringParameters[key] || '';
}

function attachCallback(p: Promise<any>, context: Object) {
  return p
    .then(function(result) {
      return {
        statusCode: 200,
        body: JSON.stringify(normalize(result)),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin' : '*'
        }
      };
    })
    .then(function(resp) {
      console.log('Success');
      context.succeed(resp);
    })
    .catch(function(err) {
      console.warn('failed to compress response');
      context.fail(err);
    });
}

export function all(event: Object, context: Object) {
  attachCallback(
    actions.search({
      start: q(event, 'start'),
      end: q(event, 'end')
    }),
    context
  );
}

export function channel(event: Object, context: Object) {
  attachCallback(
    actions.search({
      channel: p(event, 'channel'),
      start: q(event, 'start'),
      end: q(event, 'end')
    }),
    context
  );
}

export function show(event: Object, context: Object) {
  attachCallback(
    actions.search({
      show: p(event, 'show'),
      start: q(event, 'start'),
      end: q(event, 'end')
    }),
    context
  );
}

export function episode(event: Object, context: Object) {
  attachCallback(
    actions.search({
      episode: p(event, 'episode'),
      start: q(event, 'start'),
      end: q(event, 'end')
    }),
    context
  );
}

export function version(event: Object, context: Object) {
  attachCallback(
    actions.search({
      episode: p(event, 'episode'),
      version: p(event, 'version'),
      start: q(event, 'start'),
      end: q(event, 'end')
    }),
    context
  );
}

export function search(event: Object, context: Object) {
  attachCallback(
    actions.search({
      term: p(event, 'term'),
      start: q(event, 'start') || 0,
      end: q(event, 'end') || Number.MAX_SAFE_INTEGER
    }),
    context
  );
}

export function schedule(event: Object, context: Object) {
  let start = moment()
    .tz(process.env.PROTRACK_TZ)
    .year(parseInt(p(event,'year')))
    .month(parseInt(p(event,'month')) - 1)
    .date(p(event,'day'))
    .startOf('day')
    .unix();

  let end = moment()
    .tz(process.env.PROTRACK_TZ)
    .year(parseInt(p(event,'year')))
    .month(parseInt(p(event,'month')) - 1)
    .date(p(event,'day'))
    .endOf('day')
    .unix();

  console.log(
    'Fetching schedule for: ',
    moment()
      .tz(process.env.PROTRACK_TZ)
      .year(parseInt(p(event,'year')))
      .month(parseInt(p(event,'month')) - 1)
      .date(p(event,'day'))
      .unix()
  );

  console.log(
    'Start: ',
    parseInt(p(event,'year')),
    parseInt(p(event,'month')) - 1,
    p(event,'day'),
    process.env.PROTRACK_TZ,
    moment()
    .tz(process.env.PROTRACK_TZ)
    .year(parseInt(p(event,'year')))
    .month(parseInt(p(event,'month')) - 1)
    .date(p(event,'day'))
    .startOf('day'),
    start
  );

  console.log(
    'End: ',
    parseInt(p(event,'year')),
    parseInt(p(event,'month')) - 1,
    p(event,'day'),
    process.env.PROTRACK_TZ,
    moment()
    .tz(process.env.PROTRACK_TZ)
    .year(parseInt(p(event,'year')))
    .month(parseInt(p(event,'month')) - 1)
    .date(p(event,'day'))
    .endOf('day'),
    end
  );

  let options = {
    start: start,
    end: end
  };

  actions.search(options).then(function(result: AiringResults) {
    let channels = buildSchedule(result, parseInt(p(event,'granularity')), start, end);
    return {
      statusCode: 200,
      body: JSON.stringify(normalizeChannels(channels)),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin' : '*'
      }
    }
  })
    .then(function(resp) {
      console.log('Success');
      context.succeed(resp);
    })
    .catch(function(err) {
      console.warn('failed to compress response');
      context.fail(err);
    });
}

export function schedule_channel(event: Object, context: Object) {
  let start = moment()
    .tz(process.env.PROTRACK_TZ)
    .year(parseInt(p(event,'year')))
    .month(parseInt(p(event,'month')) - 1)
    .date(p(event,'day'))
    .startOf('day')
    .unix();

  let end = moment()
    .tz(process.env.PROTRACK_TZ)
    .year(parseInt(p(event,'year')))
    .month(parseInt(p(event,'month')) - 1)
    .date(p(event,'day'))
    .endOf('day')
    .unix();

    let options = {};
    options.start = start;
    options.end = end;

    if (p(event, 'channel')) {
      options.channel = p(event, 'channel');
    }

    actions.search(options).then(function(result: AiringResults) {
      let channels = buildSchedule(result, parseInt(p(event,'granularity')), start, end)
        .filter(channel => channel.id === options.channel);

      return {
        statusCode: 200,
        body: JSON.stringify(normalizeChannels(channels, true)),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin' : '*'
        }
      }
    })
    .then(function(resp) {
      console.log('Success');
      context.succeed(resp);
    })
    .catch(function(err) {
      console.warn('failed to compress response');
      context.fail(err);
    });
}

export function ingesttest(event: Object, context: Object) {
  var fs = require('fs');
  let bucket = '';

  fs.readFile('ingesttest.json', 'utf8', function(err, contents) {
    contents = JSON.parse(contents);
    ingest(contents, context);
  });
}

export function ingest({ Records: records }: Object, context: Object) {
  if (records.length > 0) {

    let record = records[0];

    console.log('Preparing ingest request', records[0]);

    let bucket = toBucket(record);
    let data = toData(bucket, record);

    attachCallback(
      data
        .then(function(raw) {
          return parse(raw)
            .then(mapToAirings)
            .then(function(airings) {
              console.log('Parsed airings list', airings.length);

              let airingIds = {};

              airings.forEach(function(a: Airing) {
                if (airingIds[a.channel] === 'undefined') {
                  airingIds[a.channel] = {
                    channel: a.channel,
                    startTime: 0,
                    endTime: 0,
                    airings: []
                  };
                }

                airingIds[a.channel].airings.push(a.id);
                if (a.date > airingIds[a.channel].startTime) { airingIds[a.channel].startTime = a.date; }
                if (airingIds[a.channel].endTime === 0 || a.end_date < airingIds[a.channel].endTime) { airingIds[a.channel].endTime = a.date; }
              });

              airingIds.forEach(function(a: Object) {
                actions.search({
                  channel: a.channel,
                  start: a.startTime,
                  end: a.endTime
                })
              });

              console.log(airingIds);
              return airings;
            })
            .then(actions.insert)
            .then(function(res) {
              console.log('Insert completed', JSON.stringify(res));
              return backup(bucket, record)
                .then(function() {
                  console.log('done backup');
                  return res;
                });
            }).then(function(res) {
              return remove(bucket, record)
                .then(function() {
                  console.log('done delete');
                  return res;
                })
            })
        }),
      context
    ).catch(function(fail) {
      console.log('ingest failed');
      console.log(fail);
    });
  } else {
    context.fail('Invalid record set');
  }
}

export function health() {
}