// @flow

import Elastic from './elastic';
import type { ESResults } from './result';
import type { Airing } from './../airing';
import type { AiringResults } from './airingResult';
import { mapResults} from './airingResult';
import { inspect } from 'util';
import moment from "moment-timezone";

type Query = {
  start: ?number,
  end: ?number,
  channel: ?string,
  episode: ?number,
  version: ?number,
  show: ?number,
  term: string
};

const max_size = 10000;

export class Searcher {
  client: Elastic;
  query: Query;

  constructor(client: Elastic) {
    this.client = client;
    this.resetQuery();
  }

  resetQuery() {
    this.query = {
      start: null,
      end: null,
      channel: null,
      episode: null,
      version: null,
      show: null,
      term: ''
    };
  }

  byStartDate(start: number) {
    this.query.start = start;
    return this;
  }

  byEndDate(end: number) {
    this.query.end = end;
    return this;
  }

  byChannel(channel: string) {
    this.query.channel = channel;
    return this;
  }

  byEpisode(episode: number, version: ?number = null) {
    this.query.episode = episode;

    if (episode && version) {
      this.query.version = version;
    }

    return this;
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
    let filter = [], must;
    let start = moment.tz(process.env.PROTRACK_TZ).startOf('day').unix();
    let end = moment.tz(process.env.PROTRACK_TZ).endOf('day').unix();

    let dateMax = 9999999999;

    if (query.channel !== null) {
      filter.push({
        term: {
          channel: query.channel
        }
      });
    }

    if (query.episode !== null) {
      filter.push({
        term: {
          "episode.program.id": query.episode
        }
      });

      if (query.version !== null) {
        filter.push({
          term: {
            "episode.version.id": query.version
          }
        });
      }
    }

    if (query.show !== null) {
      filter.push({
        term: {
          "show.id": query.show
        }
      });
    }

    filter.push({
      bool: {
        must: [
          { 
            range: {
              date: {
                gte: 0,
                lte: query.end !== null ? query.end : end
              }
            }
          },
          { 
            range: {
              end_date: {
                gte: query.start !== null ? query.start : start,
                lte: dateMax
              }
            }
          }
        ]
      }
    });

    if (query.term) {
      must = {
        multi_match: {
          query: query.term,
          fields: [
            'episode.title',
            'episode.desc',
            'show.title',
            'show.desc'
          ]
        }
      };
    } else {
      must = {
        match_all: {}
      }
    }

    if (query.term) {
      return {
        from: 0,
        size: max_size,
        query: {
          bool: {
            must,
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
            must,
            filter
          }
        },
        sort: [{ date: 'asc' }]
      };
    }
  }

  run(): Promise<AiringResults> {
    let query = Searcher.buildQuery(this.query);
    console.log('Run query', inspect(query, { depth: null }));

    return this.client.search(query)
      .then(function(results: ESResults<Airing>) {
        let res = mapResults(results);
        return res;
      })
      .catch(function(err) {
        console.warn('Failed to run query', query, err);
        return [];
      });
  }
}

export type SearchOptions = {
  searcher?: Searcher,
  index?: string,
  type?: string,
  start?: number|string,
  end?: number|string,
  channel?: string,
  episode?: number|string,
  version?: number|string,
  show?: number|string,
  term?: string
};

export default function getSearcher(options: SearchOptions): Searcher {
  if (options.searcher instanceof Searcher) {
    return options.searcher;
  }

  let {
    index: index,
    type: type,
    start: start,
    end: end,
    channel: channel,
    episode: episode,
    version: version,
    show: show,
    term: term
  } = options;

  index = index || 'airings';
  type = type || 'airings';
  let searcher = new Searcher(new Elastic(null, index, type));

  if (typeof start !== 'undefined') {
    if (Number.isInteger(parseInt(start))) {
      searcher = searcher.byStartDate(parseInt(start));
    }
  }

  if (typeof end !== 'undefined') {
    if (Number.isInteger(parseInt(end))) {
      searcher = searcher.byEndDate(parseInt(end));
    }
  }

  if (typeof channel !== 'undefined') {
    searcher = searcher.byChannel(channel);
  }

  if (typeof episode !== 'undefined') {
    if (Number.isInteger(parseInt(episode))) {
      searcher = searcher.byEpisode(
        parseInt(episode),
        Number.isInteger(parseInt(version)) ? parseInt(version) : null
      );
    }
  }

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