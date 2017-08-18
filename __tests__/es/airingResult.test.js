import { mapResults } from './../../src/es/airingResult';
import { mockResult } from './helpers';

it('maps each element', function() {
  let results = {
    hits: {
      hits: Array.from({length: 10}, () => {
        return mockResult();
      })
    }
  };

  expect(mapResults(results).length).toBe(results.hits.hits.length);
});

it('maintains order of results', function() {
  let results = {
    hits: {
      hits: Array.from({length: 10}, () => {
        return mockResult();
      })
    }
  };

  let ids = results.hits.hits.map(hit => hit._source.title);

  expect(mapResults(results).map(res => res.data.title)).toEqual(ids);
});