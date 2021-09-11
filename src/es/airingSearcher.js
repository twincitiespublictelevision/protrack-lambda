import Elastic from './elastic';
import { mapResults } from './mapResults';
import { inspect } from 'util';
import moment from "moment-timezone";

const max_size = 10000;

export class AiringSearcher {
  client;
  query;

  constructor(client) {
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

  byStartDate(start) {
    this.query.start = start;
    return this;
  }

  byEndDate(end) {
    this.query.end = end;
    return this;
  }

  byChannel(channel) {
    this.query.channel = channel;
    return this;
  }

  byEpisode(episode, version = null) {
    this.query.episode = episode;

    if (episode && version) {
      this.query.version = version;
    }

    return this;
  }

  byShow(show) {
    this.query.show = show;
    return this;
  }

  forTerm(term) {
    this.query.term = term;
    return this;
  }

  static buildQuery(query) {
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
        terms: {
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
        terms: {
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

  run() {
    let query = AiringSearcher.buildQuery(this.query);
    console.log('Run query', inspect(query, { depth: null }));

    return this.client.search(query)
      .then(function (results) {
        return mapResults(results);
      })
      .catch(function (err) {
        console.warn('Failed to run query', query, err);
        return [];
      });
  }
}

export default function getAiringSearcher(options) {
  let {
    start: start,
    end: end,
    channel: channel,
    episode: episode,
    version: version,
    show: show,
    term: term
  } = options;

  let searcher = new AiringSearcher(new Elastic(null, 'airings', 'airing'));

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
    episode = episode.split(",").filter(e => Number.isInteger(parseInt(e)));

    if (episode.length > 0) {
      searcher = searcher.byEpisode(
        episode.map(e => parseInt(e)),
        null
      );
    }
  }

  if (typeof show !== 'undefined') {
    show = show.split(",").filter(s => Number.isInteger(parseInt(s)));

    if (show.length > 0) {
      searcher = searcher.byShow(show.map(s => parseInt(s)));
    }
  }

  if (typeof term !== 'undefined') {
    searcher = searcher.forTerm(term);
  }

  return searcher;
}