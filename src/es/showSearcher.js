// @flow

import Elastic from './elastic';
import type { ESResults } from './result';
import type { Show } from './../types';
import type { Result } from './mapResults';
import { mapResults } from './mapResults';
import { inspect } from 'util';

type Query = {
  show: ?number,
  term: string
};

const max_size = 10000;

export class ShowSearcher {
  client: Elastic<Show>;
  query: Query;

  constructor(client: Elastic<Show>) {
    this.client = client;
    this.resetQuery();
  }

  resetQuery() {
    this.query = {
      show: null,
      term: ''
    };
  }

  byShow(show: number) {
    this.query.show = show;
    return this;
  }

  forTerm(term: string) {
    this.query.term = term;
    return this;
  }

  static buildQuery(query: Query): Object {
    let filter = [];

    if (query.show !== null) {
      filter.push({
        term: {
          "id": query.show
        }
      });
    }

    if (query.term) {
      return {
        from: 0,
        size: max_size,
        query: {
          bool: {
            must: {
              multi_match: {
                query: query.term,
                fields: [
                  'title',
                  'desc'
                ]
              }
            },
            filter
          }
        }
      };
    } else {
      return {
        from: 0,
        size: max_size,
        query: {
          bool: {
            must: {
              match_all: {}
            },
            filter
          }
        }
      };
    }
  }

  run(): Promise<Array<Result<Show>>> {
    let query = ShowSearcher.buildQuery(this.query);
    console.log('Run query', inspect(query, { depth: null }));

    return this.client.search(query)
      .then(function(results: ESResults<Show>) {
        return mapResults(results);
      })
      .catch(function(err) {
        console.warn('Failed to run query', query, err);
        return [];
      });
  }
}

export type ShowSearchOptions = {
  show?: number|string,
  term?: string
};

export default function getShowSearcher(options: ShowSearchOptions): ShowSearcher {
  let {
    show: show,
    term: term
  } = options;

  let searcher = new ShowSearcher(new Elastic(null, 'shows', 'show'));

  if (typeof show !== 'undefined') {
    if (Number.isInteger(parseInt(show))) {
      searcher = searcher.byShow(parseInt(show));
    }
  }

  if (typeof term !== 'undefined') {
    searcher = searcher.forTerm(term);
  }

  return searcher;
}