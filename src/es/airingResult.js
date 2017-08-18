// @flow

import type { ESResult, ESResults } from './result';
import type { Airing } from './../airing';

export type AiringResults = Array<AiringResult>;

export type AiringResult = {
  score: number,
  data: Airing
}

export function mapResults(results: ESResults<Airing>): AiringResults {
  let { hits: { hits: data } } = results;
  return data.map(function(res: ESResult<Airing>): AiringResult {
    return {
      score: res._score,
      data: res._source
    }
  });
}