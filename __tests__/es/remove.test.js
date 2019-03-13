import getRemover, { Remover } from './../../src/es/remove';
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
      search: jest.fn(),
      remove: jest.fn()
    }
  });

  it('checks index before sending delete', function() {
    client.checkIndex.mockReturnValueOnce(Promise.resolve(true));
    client.remove.mockReturnValueOnce(Promise.reject('Something went wrong'));

    let unit = new Remover(client);

    return unit.removeChannel('test-channel').then(function() {
      expect(client.checkIndex).toBeCalled();
    });
  });

  it('calls remove with delete query', function() {
    client.checkIndex.mockReturnValueOnce(Promise.resolve(true));
    client.remove.mockReturnValueOnce(Promise.resolve(true));
    let channel = 'channel-' + r(255, 999);

    let unit = new Remover(client);

    return unit.removeChannel(channel).then(function() {
      expect(client.remove.mock.calls).toEqual([[{
        query: { term: { channel } }
      }]]);
    });
  });

  it('resolves to true when delete resolves', function() {
    client.checkIndex.mockReturnValueOnce(Promise.resolve(true));
    client.remove.mockReturnValueOnce(Promise.resolve(true));
    let channel = 'channel-' + r(255, 999);

    let unit = new Remover(client);

    return expect(unit.removeChannel(channel)).resolves.toBe(true);
  });

  it('resolves to false when delete rejects', function() {
    client.checkIndex.mockReturnValueOnce(Promise.resolve(true));
    client.remove.mockReturnValueOnce(Promise.reject({}));
    let channel = 'channel-' + r(255, 999);

    let unit = new Remover(client);

    return expect(unit.removeChannel(channel)).resolves.toBe(false);
  });
});

describe('builder', function() {
  beforeEach(function() {
    mockElastic = mockElasticGen();
  });

  it('accepts no options', function() {
    let unit = getRemover({});

    expect(unit).toBeInstanceOf(Remover);
    expect(unit.client).toEqual(mockElastic);
  });

  it('accepts custom index', function() {
    let test = 'test-' + r(100, 999);
    expect(getRemover({ index: test }).client.index).toBe(test);
  });

  it('accepts custom type', function() {
    let test = 'test-' + r(100, 999);
    expect(getRemover({ type: test }).client.type).toBe(test);
  });
});