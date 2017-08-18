import Elastic from './../../src/es/elastic';
import { mockAiring } from './helpers';

let client;

beforeEach(function() {
  client = {
    indices: {
      create: jest.fn(),
      exists: function() {
        return Promise.resolve(true);
      }
    },
    index: jest.fn(),
    bulk: jest.fn(),
    search: jest.fn()
  }
});

it('returns false when index check throws', function() {
  client.indices.exists = jest.fn();
  client.indices.exists.mockImplementationOnce(() => Promise.reject('Some failure'));

  let unit = new Elastic(client, 'airings', 'airing');

  return expect(unit.checkIndex()).resolves.toBe(false);
});

it('returns value when index check does not throw', function() {
  client.indices.exists = jest.fn();
  client.indices.exists.mockImplementationOnce(() => Promise.resolve(true));

  let unit = new Elastic(client, 'airings', 'airing');

  return expect(unit.checkIndex()).resolves.toBe(true);
});

it('attempts to create index from mapping', function() {
  let body = require('./mapping.json');
  client.indices.create.mockReturnValueOnce(Promise.resolve());

  let unit = new Elastic(client, 'airings', 'airing');

  return unit.createIndex(body).then(function() {
    expect(client.indices.create.mock.calls).toEqual([[{ index: 'airings', body }]]);
  });
});


it('formats single document request', function() {
  let doc = mockAiring();
  client.index.mockReturnValueOnce(Promise.resolve());

  let unit = new Elastic(client, 'airings', 'airing');

  return unit.store(doc).then(function() {
    expect(client.index.mock.calls).toEqual([[{ index: 'airings', type: 'airing', body: doc }]]);
  });
});

it('submits properly formatted bulk request', function() {
  let data = Array.from({length: 10}, () => {
    return mockAiring();
  });

  let body = data.reduce(
    function(exp, d) {
      exp.push({ index: { _index: 'airings', _type: 'airing' } });
      exp.push(d);
      return exp;
    },
    []
  );

  client.bulk.mockReturnValueOnce(Promise.resolve());

  let unit = new Elastic(client, 'airings', 'airing');

  return unit.storeAll(data).then(function() {
    expect(client.bulk.mock.calls).toEqual([
      [{ body }]
    ])
  });
});

it('passes search query', function() {
  let body = { match: { field: 'value' } };
  client.search.mockReturnValueOnce(Promise.resolve());

  let unit = new Elastic(client, 'airings', 'airing');

  return unit.search(body).then(function() {
    expect(client.search.mock.calls).toEqual([[{ index: 'airings', body }]]);
  })
});