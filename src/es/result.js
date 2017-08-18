// @flow

export type ESResults<T> = {
  hits: {
    total: number,
    max_score: number,
    hits: Array<ESResult<T>>
  },
  timed_out: boolean,
  took: number,
  _shards: {
    failed: number,
    successful: number,
    total: number
  }
};

export type ESResult<T> = {
  _id: string,
  _index: string,
  _score: number,
  _source: T,
  _type: string
};