// @flow

import { backup, remove } from './src/parse/s3';
import type { Airing } from './src/airing';
import parse from './src/parse/parser';
import mapToAirings from './src/parse/protrack';
import actions from './src/es/actions';
import zlib from 'zlib';

function p(event: Object, key: string): string {
  return event && event.pathParameters && event.pathParameters[key] || '';
}

function q(event: Object, key: string): string {
  return event && event.queryStringParameters && event.queryStringParameters[key] || '';
}

function attachCallback(p: Promise<any>, context: Object) {
  return p
    .then(function(result) {
      return new Promise((resolve, reject) => {
        zlib.gzip(JSON.stringify(result), function(error, gzBody) {
          if (error) {
            reject(error);
          }

          resolve({
            statusCode: 200,
            body: gzBody.toString('base64'),
            isBase64Encoded: true,
            headers: {
              'Accept-Encoding': '*',
              'Content-Type': 'application/json',
              'Content-Encoding': 'gzip'
            }
          });
        });
      });
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

    let record = records[0]

    attachCallback(
      parse(record)
        .then(mapToAirings)
        .then(function(airings): Promise<Array<Airing>> {

          // Grab the first result and read the channel
          if (airings.length > 0) {
            let sample = airings[0];
            return actions.remove(sample.channel)
              .then(function() {
                return airings;
              });
          } else {
            return airings;
          }
        })
        .then(actions.insert)
        .then(function(res) {
          return backup(record)
            .then(function() {
              console.log('done backup');
              return res;
            });
        }).then(function(res) {
          return remove(record)
            .then(function() {
              console.log('done delete');
              return res;
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
  // Noop for now. Implement for file generation monitoring
}