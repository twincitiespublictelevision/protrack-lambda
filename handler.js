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
    .year(parseInt(p(event,'year')))
    .month(parseInt(p(event,'month')) - 1)
    .date(p(event,'day'))
    .tz(process.env.PROTRACK_TZ)
    .startOf('day')
    .unix();

  let end = moment()
    .year(parseInt(p(event,'year')))
    .month(parseInt(p(event,'month')) - 1)
    .date(p(event,'day'))
    .tz(process.env.PROTRACK_TZ)
    .endOf('day')
    .unix();

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
    .year(parseInt(p(event,'year')))
    .month(parseInt(p(event,'month')) - 1)
    .date(p(event,'day'))
    .tz(process.env.PROTRACK_TZ)
    .startOf('day')
    .unix();

  let end = moment()
    .year(parseInt(p(event,'year')))
    .month(parseInt(p(event,'month')) - 1)
    .date(p(event,'day'))
    .tz(process.env.PROTRACK_TZ)
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