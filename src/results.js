import { normalize as normalizer, schema } from 'normalizr';

const show = new schema.Entity('show');
const episode = new schema.Entity('episode', {}, {
  idAttribute: function (episode) {
    return episode.id || parseInt(`${episode.program.id}${episode.version.id}`);
  }
});
const airing = new schema.Entity('airing', { show, episode });
const channel = new schema.Entity('channel', { airings: [airing] });

export function normalize(results) {
  return normalizer(results.map(r => r.data), [airing]);
}

export function normalizeShows(results) {
  return normalizer(results.map(r => r.data), [show]);
}

export function normalizeAirings(airings) {
  return normalizer(airings, [airing]);
}

export function normalizeChannels(channels) {
  return normalizer(channels, [channel]);
}