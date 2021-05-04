import { toBucket, toData, backup, remove } from './src/parse/s3';
import actions from './src/es/actions';
import buildSchedule from './src/es/schedule';
import parse from './src/parse/parser';
import mapToAirings from './src/parse/protrack';
import { normalize, normalizeShows, normalizeChannels } from './src/results';
import moment from "moment-timezone";
import { applyOverlay } from './src/overlay';

function p(event, key) {
  return event && event.pathParameters && event.pathParameters[key] || '';
}

function q(event, key) {
  return event && event.queryStringParameters && event.queryStringParameters[key] || '';
}

function attachCallback(p, context) {
  return p
    .then(function (result) {
      return {
        statusCode: 200,
        body: JSON.stringify(normalize(result)),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    })
    .then(function (resp) {
      console.log('Success');
      context.succeed(resp);
    })
    .catch(function (err) {
      console.warn('failed to compress response');
      context.fail(err);
    });
}

export function all(event, context) {
  attachCallback(
    actions.searchAirings({
      start: q(event, 'start'),
      end: q(event, 'end')
    }),
    context
  );
}

export function channel(event, context) {
  attachCallback(
    actions.searchAirings({
      channel: p(event, 'channel'),
      start: q(event, 'start'),
      end: q(event, 'end')
    }),
    context
  );
}

export function show(event, context) {
  attachCallback(
    actions.searchAirings({
      show: p(event, 'show'),
      start: q(event, 'start'),
      end: q(event, 'end')
    }),
    context
  );
}

export function shows(event, context) {
  actions.searchShows()
    .then(function (result) {
      let normal = normalizeShows(result);
      normal.result.sort((a, b) => parseInt(a) - parseInt(b));
      return {
        statusCode: 200,
        body: JSON.stringify(normal),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    })
    .then(function (resp) {
      console.log('Success');
      context.succeed(resp);
    })
    .catch(function (err) {
      console.warn('failed to compress response');
      context.fail(err);
    });
}

export function episode(event, context) {
  attachCallback(
    actions.searchAirings({
      episode: p(event, 'episode'),
      start: q(event, 'start'),
      end: q(event, 'end')
    }),
    context
  );
}

export function version(event, context) {
  attachCallback(
    actions.searchAirings({
      episode: p(event, 'episode'),
      version: p(event, 'version'),
      start: q(event, 'start'),
      end: q(event, 'end')
    }),
    context
  );
}

export function search(event, context) {
  attachCallback(
    actions.searchAirings({
      term: p(event, 'term'),
      start: q(event, 'start') || 0,
      end: q(event, 'end') || Number.MAX_SAFE_INTEGER
    }),
    context
  );
}

export function schedule(event, context) {
  let start = moment()
    .tz(process.env.PROTRACK_TZ)
    .year(parseInt(p(event, 'year')))
    .month(parseInt(p(event, 'month')) - 1)
    .date(p(event, 'day'))
    .startOf('day')
    .unix();

  let end = moment()
    .tz(process.env.PROTRACK_TZ)
    .year(parseInt(p(event, 'year')))
    .month(parseInt(p(event, 'month')) - 1)
    .date(p(event, 'day'))
    .endOf('day')
    .unix();

  console.log(
    'Fetching schedule for: ',
    moment()
      .tz(process.env.PROTRACK_TZ)
      .year(parseInt(p(event, 'year')))
      .month(parseInt(p(event, 'month')) - 1)
      .date(p(event, 'day'))
      .unix()
  );

  console.log(
    'Start: ',
    parseInt(p(event, 'year')),
    parseInt(p(event, 'month')) - 1,
    p(event, 'day'),
    process.env.PROTRACK_TZ,
    moment()
      .tz(process.env.PROTRACK_TZ)
      .year(parseInt(p(event, 'year')))
      .month(parseInt(p(event, 'month')) - 1)
      .date(p(event, 'day'))
      .startOf('day'),
    start
  );

  console.log(
    'End: ',
    parseInt(p(event, 'year')),
    parseInt(p(event, 'month')) - 1,
    p(event, 'day'),
    process.env.PROTRACK_TZ,
    moment()
      .tz(process.env.PROTRACK_TZ)
      .year(parseInt(p(event, 'year')))
      .month(parseInt(p(event, 'month')) - 1)
      .date(p(event, 'day'))
      .endOf('day'),
    end
  );

  let options = {
    start: start,
    end: end
  };

  actions.searchAirings(options).then(function (result) {
    let channels = buildSchedule(result, parseInt(p(event, 'granularity')), start, end);
    return {
      statusCode: 200,
      body: JSON.stringify(normalizeChannels(channels)),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  })
    .then(function (resp) {
      console.log('Success');
      context.succeed(resp);
    })
    .catch(function (err) {
      console.warn('failed to compress response');
      context.fail(err);
    });
}

export function schedule_channel(event, context) {
  let start = moment()
    .tz(process.env.PROTRACK_TZ)
    .year(parseInt(p(event, 'year')))
    .month(parseInt(p(event, 'month')) - 1)
    .date(p(event, 'day'))
    .startOf('day')
    .unix();

  let end = moment()
    .tz(process.env.PROTRACK_TZ)
    .year(parseInt(p(event, 'year')))
    .month(parseInt(p(event, 'month')) - 1)
    .date(p(event, 'day'))
    .endOf('day')
    .unix();

  let options = {};
  options.start = start;
  options.end = end;

  if (p(event, 'channel')) {
    options.channel = p(event, 'channel');
  }

  actions.searchAirings(options).then(function (result) {
    let channels = buildSchedule(result, parseInt(p(event, 'granularity')), start, end)
      .filter(channel => channel.id === options.channel);

    return {
      statusCode: 200,
      body: JSON.stringify(normalizeChannels(channels)),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  })
    .then(function (resp) {
      console.log('Success');
      context.succeed(resp);
    })
    .catch(function (err) {
      console.warn('failed to compress response');
      context.fail(err);
    });
}

function getOverlayAirings(bucket, channel) {
  let fixedOverlayRecord = {
    s3: {
      bucket,
      object: {
        key: `${channel}-overlay.xml`
      }
    }
  };

  return toData(
    toBucket(fixedOverlayRecord),
    fixedOverlayRecord
  ).then(raw => {
    return parse(raw).then(mapToAirings);
  }).catch(err => {
    console.error(err);
    console.error(`Failed to get overlay for ${channel}`);
    return [];
  });
}

export function ingest({ Records: records }, context) {
  // Filter out any special overlay records
  let overlayCheck = /overlay\.xml$/;

  records = records.filter(record => {
    return !overlayCheck.test(record.s3.object.key);
  });

  if (records.length > 0) {

    let record = records[0];

    console.log('Preparing ingest request', records[0]);

    let bucket = toBucket(record);
    let data = toData(bucket, record);

    attachCallback(
      data
        .then(function (raw) {
          return parse(raw)
            .then(mapToAirings)
            .then(function (airings) {
              let channel = airings[0].channel;
              return getOverlayAirings(record.s3.bucket, channel).then(
                overlayAirings => {
                  return applyOverlay(airings, overlayAirings);
                }
              )
            })
            .then(function (airings) {
              console.log('Parsed airings list', airings.length);

              let airingIds = airings.map(airing => airing.id);
              let removeAiringPromise = Promise.resolve();

              let searchPromise = actions.searchAirings({
                channel: airings[0].channel,
                start: 0,
                end: Number.MAX_SAFE_INTEGER
              });

              searchPromise.then(function (channelAirings) {
                let diff = channelAirings.filter((airing) => {
                  return !airingIds.includes(airing.data.id);
                });

                if (diff.length) {
                  removeAiringPromise = actions.removeAirings(diff.map(a => a.data));
                }
              });

              return removeAiringPromise.then(() => {
                let p1 = actions.insertAirings(airings);
                let p2 = actions.insertShows(airings.map(a => a.show));
                return Promise.all([p1, p2]);
              });
            })
            .then(function (res) {
              console.log('Insert completed', JSON.stringify(res));
              return backup(bucket, record)
                .then(function () {
                  console.log('done backup');
                  return res;
                });
            }).then(function (res) {
              return remove(bucket, record)
                .then(function () {
                  console.log('done delete');
                  return res;
                })
            })
        }),
      context
    ).catch(function (fail) {
      console.log('ingest failed');
      console.log(fail);
    });
  } else {
    context.fail('Invalid record set');
  }
}

export function health() {
}