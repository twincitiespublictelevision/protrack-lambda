import getSearcher, { Searcher } from './../../src/es/search';
import { mapResults} from './../../src/es/airingResult';
import { r, mockAiring } from './helpers';
import moment from "moment-timezone";

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

describe('searcher', function() {
  let client, unit, results, q;

  beforeEach(function() {
    q = {
      start: null,
      end: null,
      channel: null,
      episode: null,
      version: null,
      show: null,
      term: ''
    };

    client = {
      index: 'airings',
      type: 'airing',
      checkIndex: jest.fn(),
      createIndex: jest.fn(),
      store: jest.fn(),
      storeAll: jest.fn(),
      search: jest.fn()
    };

    results = {
      hits: { total: 0, max_score: 0, hits: [] },
      timed_out: false,
      took: 0,
      _shards: { failed: 0, successful: 0, total: 0 }
    };

    unit = new Searcher(client);
  });

  it('starts with empty query', function() {
    expect(unit.query).toEqual({
      start: null,
      end: null,
      channel: null,
      episode: null,
      version: null,
      show: null,
      term: ''
    });
  });

  it('clears all query fields on reset', function() {
    unit.start = 'f';
    unit.end = 'a';
    unit.channel = 'k';
    unit.episode = 'e';
    unit.version = 's';
    unit.show = 't';
    unit.term = '!';

    expect(unit.query).toEqual({
      start: null,
      end: null,
      channel: null,
      episode: null,
      version: null,
      show: null,
      term: ''
    });
  });

  it('returns self on mutation', function() {
    expect(unit.byStartDate()).toEqual(unit);
    expect(unit.byEndDate()).toEqual(unit);
    expect(unit.byChannel()).toEqual(unit);
    expect(unit.byEpisode()).toEqual(unit);
    expect(unit.byShow()).toEqual(unit);
    expect(unit.forTerm()).toEqual(unit);
  });

  it('stores start date', function() {
    expect(unit.byStartDate('test-date').query.start).toEqual('test-date');
  });

  it('stores end date', function() {
    expect(unit.byEndDate('test-date').query.end).toEqual('test-date');
  });

  it('adds default (current day) timestamp to query', function() {
    let start = moment.tz(process.env.PROTRACK_TZ).startOf('day').unix();
    let end = moment.tz(process.env.PROTRACK_TZ).endOf('day').unix();

    let dateQ = { range: { date: { gte: start, lte: end } } };

    expect(Searcher.buildQuery(q).query.bool.filter).toEqual(
      expect.arrayContaining([dateQ])
    );
  });

  it('overwrites date query with start and end date', function() {
    let start = r(500, 999);
    let end = r(500, 999);
    let dateQ = { range: { date: { gte: start, lte: end } } };
    q.start = start;
    q.end = end;

    expect(Searcher.buildQuery(q).query.bool.filter).toEqual(
      expect.arrayContaining([dateQ])
    );
  });

  it('stores channel', function() {
    expect(unit.byChannel('test-channel').query.channel).toEqual('test-channel');
  });

  it('adds channel to query', function() {
    let channel = 'channel-' + r(500, 999);
    let channelQ = { term: { channel } };
    q.channel = channel;

    expect(Searcher.buildQuery(q).query.bool.filter).toEqual(
      expect.arrayContaining([channelQ])
    );
  });

  it('stores episode', function() {
    let e_id = r(500, 999);
    expect(unit.byEpisode(e_id).query.episode).toEqual(e_id);
  });

  it('add episode to query', function() {
    let episode = r(500, 999);
    let episodeQ = { term: { 'episode.program.id': episode } };
    q.episode = episode;

    expect(Searcher.buildQuery(q).query.bool.filter).toEqual(
      expect.arrayContaining([episodeQ])
    );
  });

  it('stores version only if episode', function() {
    let e_id = r(500, 999);
    let v_id = r(500, 999);

    expect(unit.byEpisode(null, v_id).query.version).toEqual(null);
    expect(unit.byEpisode(e_id, v_id).query.version).toEqual(v_id);
  });

  it('adds version to query only if episode', function() {
    let episode = r(500, 999);
    let version = r(500, 999);
    let episodeQ = { term: { 'episode.program.id': episode } };
    let versionQ = { term: { 'episode.version.id': version } };
    q.version = version;

    expect(Searcher.buildQuery(q).query.bool.filter).not.toEqual(
      expect.arrayContaining([versionQ])
    );

    q.episode = episode;

    expect(Searcher.buildQuery(q).query.bool.filter).toEqual(
      expect.arrayContaining([episodeQ, versionQ])
    );
  });

  it('stores show', function() {
    let id = r(500, 999);
    expect(unit.byShow(id).query.show).toEqual(id);
  });

  it('adds show to query', function() {
    let show = r(500, 999);
    let showQ = { term: { 'show.id': show } };
    q.show = show;

    expect(Searcher.buildQuery(q).query.bool.filter).toEqual(
      expect.arrayContaining([showQ])
    );
  });

  it('stores term', function() {
    expect(unit.forTerm('test-term').query.term).toEqual('test-term');
  });

  it('add term to query', function() {
    let term = 'term-' + r(500, 999);
    let termQ = {
      multi_match: {
        query: term,
        fields: [
          'episode.title',
          'episode.desc',
          'show.title',
          'show.desc'
        ]
      }
    };
    q.term = term;

    expect(Searcher.buildQuery(q).query.bool.must).toEqual(termQ);
  });

  it('sorts by date ascending without term', function() {
    expect(Searcher.buildQuery(q).sort).toEqual([{ date: 'asc' }]);
  });

  it('sorts by elastic default with term', function() {
    let term = 'term-' + r(500, 999);
    q.term = term;

    expect(Searcher.buildQuery(q).sort).toEqual(undefined);
  });

  it('passes query to client', function() {
    let term = 'term-' + r(500, 999);
    let start = r(255, 355);
    q.start = start;
    q.term = term;
    let query = Searcher.buildQuery(q);
    client.search.mockReturnValueOnce(Promise.resolve(results));

    return unit.byStartDate(start).forTerm(term).run().then(function() {
      expect(client.search.mock.calls).toEqual([[query]]);
    });
  });

  it('transforms results from Elastic', function() {
    let airing = mockAiring();
    results.hits.hits.push({
      _id: 'id-' + r(100, 255),
      _index: 'airings',
      _score: 123,
      _source: airing,
      _type: 'airing'
    });
    client.search.mockReturnValueOnce(Promise.resolve(results));
    let airingResult = mapResults(results);

    return expect(unit.run()).resolves.toEqual(airingResult);
  });

  it('responds with empty list on failure', function() {
    client.search.mockReturnValueOnce(Promise.reject('Server Error'));
    return expect(unit.run()).resolves.toEqual([]);
  });
});

describe('builder', function() {
  beforeEach(function() {
    mockElastic = mockElasticGen();
  });

  it('accepts no options', function() {
    let unit = getSearcher({});

    expect(unit).toBeInstanceOf(Searcher);
    expect(unit.client).toEqual(mockElastic);
  });

  it('accepts custom searcher', function() {
    let searcher = new Searcher();
    expect(getSearcher({ searcher })).toEqual(searcher);
  });

  it('accepts custom index', function() {
    let test = 'test-' + r(100, 999);
    expect(getSearcher({ index: test }).client.index).toBe(test);
  });

  it('accepts custom type', function() {
    let test = 'test-' + r(100, 999);
    expect(getSearcher({ type: test }).client.type).toBe(test);
  });

  it('accepts custom index and type', function() {
    let testI = 'test-' + r(100, 999);
    let testT = 'test-' + r(100, 999);
    let searcher = getSearcher({ index: testI, type: testT });

    expect(searcher.client.index).toBe(testI);
    expect(searcher.client.type).toBe(testT);
  });

  it('accepts start', function() {
    let start = r(100, 999);
    expect(getSearcher({ start }).query.start).toBe(start);
  });

  it('accepts end', function() {
    let end = r(100, 999);
    expect(getSearcher({ end }).query.end).toBe(end);
  });

  it('accepts channel', function() {
    let channel = 'channel-' + r(100, 999);
    expect(getSearcher({ channel }).query.channel).toBe(channel);
  });

  it('accepts episode', function() {
    let episode = r(100, 999);
    expect(getSearcher({ episode }).query.episode).toBe(episode);
  });

  it('accepts version only if episode', function() {
    let episode = r(100, 999);
    let version = r(100, 999);
    expect(getSearcher({ version }).query.version).toBe(null);
    expect(getSearcher({ episode, version }).query.version).toBe(version);
  });

  it('prefers custom searcher to custom settings', function() {
    let testI = 'test-' + r(100, 999);
    let testT = 'test-' + r(100, 999);

    let testSearcher = new Searcher(mockElastic);
    testSearcher.hiddenValue = 'hidden-' + r(100, 999);

    let searcher = getSearcher({ searcher: testSearcher, index: testI, type: testT });
    expect(searcher.hiddenValue).toEqual(testSearcher.hiddenValue);
  });
});