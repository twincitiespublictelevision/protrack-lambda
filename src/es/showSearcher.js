import Elastic from './elastic';
import { mapResults } from './mapResults';
import { inspect } from 'util';

const max_size = 10000;

export class ShowSearcher {
  client;
  query;

  constructor(client) {
    this.client = client;
    this.resetQuery();
  }

  resetQuery() {
    this.query = {
      show: null,
      term: ''
    };
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

  run() {
    let query = ShowSearcher.buildQuery(this.query);
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

export default function getShowSearcher(options) {
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