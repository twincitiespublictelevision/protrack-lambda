import { jest } from '@jest/globals';
import getAiringSearcher, { AiringSearcher } from './../../src/es/airingSearcher';
import { mapResults } from './../../src/es/mapResults';
import { r, mockAiring } from './helpers';
import moment from "moment-timezone";

process.env.ES_ENDPOINT = 'https://localhost:9200';

let mockElasticGen = function () {
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

jest.mock('./../../src/es/elastic', function () {
  return function (client, index, type) {
    mockElastic.client = client;
    mockElastic.index = index;
    mockElastic.type = type;
    return mockElastic;
  }
});

describe('searcher', function () {
  let client, unit, results, q;

  beforeEach(function () {
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

    unit = new AiringSearcher(client);

    console.log = jest.fn();
    console.warn = jest.fn()
  });

  it('starts with empty query', function () {
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

  it('clears all query fields on reset', function () {
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

  it('returns self on mutation', function () {
    expect(unit.byStartDate()).toEqual(unit);
    expect(unit.byEndDate()).toEqual(unit);
    expect(unit.byChannel()).toEqual(unit);
    expect(unit.byEpisode()).toEqual(unit);
    expect(unit.byShow()).toEqual(unit);
    expect(unit.forTerm()).toEqual(unit);
  });

  it('stores start date', function () {
    expect(unit.byStartDate('test-date').query.start).toEqual('test-date');
  });

  it('stores end date', function () {
    expect(unit.byEndDate('test-date').query.end).toEqual('test-date');
  });

  it('adds default (current day) timestamp to query', function () {
    let start = moment.tz(process.env.PROTRACK_TZ).startOf('day').unix();
    let end = moment.tz(process.env.PROTRACK_TZ).endOf('day').unix();

    let dateQ = {
      bool: {
        must: [
          { range: { date: { gte: 0, lte: end } } },
          { range: { end_date: { gte: start, lte: 9999999999 } } }
        ]
      }
    };

    expect(AiringSearcher.buildQuery(q).query.bool.filter).toEqual(
      expect.arrayContaining([dateQ])
    );
  });
  it('overwrites date query with start and end date', function () {
    let start = r(500, 999);
    let end = r(500, 999);
    let dateQ = {
      bool: {
        must: [
          { range: { date: { gte: 0, lte: end } } },
          { range: { end_date: { gte: start, lte: 9999999999 } } }
        ]
      }
    };
    q.start = start;
    q.end = end;

    expect(AiringSearcher.buildQuery(q).query.bool.filter).toEqual(
      expect.arrayContaining([dateQ])
    );
  });

  it('stores channel', function () {
    expect(unit.byChannel('test-channel').query.channel).toEqual('test-channel');
  });

  it('adds channel to query', function () {
    let channel = 'channel-' + r(500, 999);
    let channelQ = { term: { channel } };
    q.channel = channel;

    expect(AiringSearcher.buildQuery(q).query.bool.filter).toEqual(
      expect.arrayContaining([channelQ])
    );
  });

  it('stores episode', function () {
    let e_id = r(500, 999);
    expect(unit.byEpisode(e_id).query.episode).toEqual(e_id);
  });

  it('add episode to query', function () {
    let episode = r(500, 999) + "";
    let episodeQ = { terms: { 'episode.program.id': [parseInt(episode)] } };
    q.episode = [parseInt(episode)];

    expect(AiringSearcher.buildQuery(q).query.bool.filter).toEqual(
      expect.arrayContaining([episodeQ])
    );
  });

  xit('stores version only if episode', function () {
    let e_id = r(500, 999);
    let v_id = r(500, 999);

    expect(unit.byEpisode(null, v_id).query.version).toEqual(null);
    expect(unit.byEpisode(e_id, v_id).query.version).toEqual(v_id);
  });

  xit('adds version to query only if episode', function () {
    let episode = r(500, 999);
    let version = r(500, 999);
    let episodeQ = { terms: { 'episode.program.id': [episode] } };
    let versionQ = { terms: { 'episode.version.id': [version] } };
    q.version = version;

    expect(AiringSearcher.buildQuery(q).query.bool.filter).not.toEqual(
      expect.arrayContaining([versionQ])
    );

    q.episode = episode;

    expect(AiringSearcher.buildQuery(q).query.bool.filter).toEqual(
      expect.arrayContaining([episodeQ, versionQ])
    );
  });

  it('stores show', function () {
    let id = r(500, 999);
    expect(unit.byShow(id).query.show).toEqual(id);
  });

  it('adds show to query', function () {
    let show = r(500, 999) + "";
    let showQ = { terms: { 'show.id': [parseInt(show)] } };
    q.show = [parseInt(show)];

    expect(AiringSearcher.buildQuery(q).query.bool.filter).toEqual(
      expect.arrayContaining([showQ])
    );
  });

  it('stores term', function () {
    expect(unit.forTerm('test-term').query.term).toEqual('test-term');
  });

  it('add term to query', function () {
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

    expect(AiringSearcher.buildQuery(q).query.bool.must).toEqual(termQ);
  });

  it('sorts by date ascending without term', function () {
    expect(AiringSearcher.buildQuery(q).sort).toEqual([{ date: 'asc' }]);
  });

  it('sorts by elastic default with term', function () {
    let term = 'term-' + r(500, 999);
    q.term = term;

    expect(AiringSearcher.buildQuery(q).sort).toEqual(undefined);
  });

  it('passes query to client', function () {
    let term = 'term-' + r(500, 999);
    let start = r(255, 355);
    q.start = start;
    q.term = term;
    let query = AiringSearcher.buildQuery(q);
    client.search.mockReturnValueOnce(Promise.resolve(results));

    return unit.byStartDate(start).forTerm(term).run().then(function () {
      expect(client.search.mock.calls).toEqual([[query]]);
    });
  });

  it('transforms results from Elastic', function () {
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

  it('responds with empty list on failure', function () {
    client.search.mockReturnValueOnce(Promise.reject('Server Error'));
    return expect(unit.run()).resolves.toEqual([]);
  });
});

describe('builder', function () {
  beforeEach(function () {
    mockElastic = mockElasticGen();
  });

  it('accepts no options', function () {
    let unit = getAiringSearcher({});

    expect(unit).toBeInstanceOf(AiringSearcher);
    // expect(unit.client).toEqual(mockElastic);
  });

  it('accepts start', function () {
    let start = r(100, 999);
    expect(getAiringSearcher({ start }).query.start).toBe(start);
  });

  it('accepts end', function () {
    let end = r(100, 999);
    expect(getAiringSearcher({ end }).query.end).toBe(end);
  });

  it('accepts channel', function () {
    let channel = 'channel-' + r(100, 999);
    expect(getAiringSearcher({ channel }).query.channel).toBe(channel);
  });

  it('accepts episode', function () {
    let episode = r(100, 999) + "";
    expect(getAiringSearcher({ episode }).query.episode).toEqual([parseInt(episode)]);
  });

  xit('accepts version only if episode', function () {
    let episode = r(100, 999) + "";
    let version = r(100, 999) + "";
    expect(getAiringSearcher({ version }).query.version).toBe(null);
    expect(getAiringSearcher({ episode, version }).query.version).toBe([parseInt(version)]);
  });
});