import getIndexer, { Indexer } from './../../src/es/insert';
import { r, mockAiring } from './helpers';

let mockElasticGen = function() {
  return new (class Elastic {
    constructor(client, index, type) {
      this.client = client;
      this.index = index;
      this.type = type;
    }
    checkIndex() { return Promise.resolve(true); }
    createIndex() { return Promise.resolve({}); }
    store() { return Promise.resolve(this); }
    storeAll() { return Promise.resolve(this); }
    search() { return Promise.resolve({}); }
  })();
};

let mockElastic;

jest.mock('./../../src/es/elastic', function() {
  return function(client, index, type) {
    mockElastic.client = client;
    mockElastic.index = index;
    mockElastic.type = type;
    return mockElastic;
  }
});

describe('indexer', function() {
  let client;

  beforeEach(function() {
    client = {
      index: 'airings',
      type: 'airing',
      checkIndex: jest.fn(),
      createIndex: jest.fn(),
      store: jest.fn(),
      storeAll: jest.fn(),
      search: jest.fn()
    }
  });

  it('does not create index if it already exists', function() {
    client.checkIndex.mockReturnValueOnce(Promise.resolve(true));

    let unit = new Indexer(client);

    return unit.prepareToIndex().then(function() {
      expect(client.checkIndex).toBeCalled();
      expect(client.createIndex.mock.calls.length).toBe(0);
    });
  });

  it('attempts to create index if one does not exist', function() {
    client.checkIndex.mockReturnValueOnce(Promise.resolve(false));
    client.createIndex.mockReturnValueOnce(Promise.resolve({}));

    let unit = new Indexer(client);

    return unit.prepareToIndex().then(function() {
      expect(client.checkIndex).toBeCalled();
      expect(client.createIndex.mock.calls.length).toBe(1);
    });
  });

  it('resolves to true when index creation resolves', function() {
    client.checkIndex.mockReturnValueOnce(Promise.resolve(false));
    client.createIndex.mockReturnValueOnce(Promise.resolve({}));

    let unit = new Indexer(client);

    return unit.prepareToIndex().then(function(result) {
      expect(client.checkIndex).toBeCalled();
      expect(client.createIndex.mock.calls.length).toBe(1);
      expect(result).toBe(true);
    });
  });

  it('resolves to false when index creation rejects', function() {
    client.checkIndex.mockReturnValueOnce(Promise.resolve(false));
    client.createIndex.mockReturnValueOnce(Promise.reject('failure'));

    let unit = new Indexer(client);

    return unit.prepareToIndex().then(function(result) {
      expect(client.checkIndex).toBeCalled();
      expect(client.createIndex.mock.calls.length).toBe(1);
      expect(result).toBe(false);
    });
  });

  it('passes single doc to single storage', function() {
    let doc = mockAiring();
    client.checkIndex.mockReturnValueOnce(Promise.resolve(true));
    client.store.mockReturnValueOnce(Promise.resolve());

    let unit = new Indexer(client);

    return unit.indexOne(doc).then(function() {
      expect(client.store.mock.calls).toEqual([[doc]]);
    });
  });

  it('passes single doc to single storage', function() {
    let data = Array.from({length: 10}, () => {
      return mockAiring();
    });
    client.checkIndex.mockReturnValueOnce(Promise.resolve(true));
    client.storeAll.mockReturnValueOnce(Promise.resolve());

    let unit = new Indexer(client);

    return unit.indexMany(data).then(function() {
      expect(client.storeAll.mock.calls).toEqual([[data]]);
    });
  });
});

describe('builder', function() {
  beforeEach(function() {
    mockElastic = mockElasticGen();
  });

  it('accepts no options', function() {
    let unit = getIndexer({});

    expect(unit).toBeInstanceOf(Indexer);
    expect(unit.client).toEqual(mockElastic);
  });

  it('accepts custom index', function() {
    let test = 'test-' + r(100, 999);
    expect(getIndexer({ index: test }).client.index).toBe(test);
  });

  it('accepts custom type', function() {
    let test = 'test-' + r(100, 999);
    expect(getIndexer({ type: test }).client.type).toBe(test);
  });

  it('accepts custom index and type', function() {
    let testI = 'test-' + r(100, 999);
    let testT = 'test-' + r(100, 999);
    let indexer = getIndexer({ index: testI, type: testT });

    expect(indexer.client.index).toBe(testI);
    expect(indexer.client.type).toBe(testT);
  });
});