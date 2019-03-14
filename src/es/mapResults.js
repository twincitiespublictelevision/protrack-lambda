// @flow

import type { ESResult, ESResults } from './result';

export type Result<T> = {
  score: number,
  data: T
}

export function mapResults<T>(results: ESResults<T>): Array<Result<T>> {
  let { hits: { hits: data } } = results;
  return data.map(function(res: ESResult<T>): Result<T> {
    return {
      score: res._score,
      data: res._source
    }
  });
}