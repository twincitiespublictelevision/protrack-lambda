// @flow

import { toBucket, toData, backup, remove } from './src/parse/s3';
import type { Airing } from './src/airing';
import parse from './src/parse/parser';
import mapToAirings from './src/parse/protrack';
import actions from './src/es/actions';
import normalize from './src/results';

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
        // body: JSON.stringify(result),
        headers: {
          'Content-Type': 'application/json',
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
            .then(function(airings): Promise<Array<Airing>> {

              console.log('Parsed airings list', airings.length);

              // Grab the first result and read the channel
              if (airings.length > 0) {
                let sample = airings[0];
                return actions.remove(sample.channel)
                  .then(function() {
                    return airings;
                  });
              } else {
                return Promise.resolve(airings);
              }
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