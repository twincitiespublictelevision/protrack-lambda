import { normalize as normalizer, schema } from 'normalizr';

const show = new schema.Entity('show');
const episode = new schema.Entity('episode', {}, {
  idAttribute: function(episode) {
    return episode.id || parseInt(`${episode.program.id}${episode.version.id}`);
  }
});
const airing = new schema.Entity('airing', { show, episode }, {
  idAttribute: function(airing) {
    return `${airing.channel}.${airing.date}`;
  }
});
const channel = new schema.Entity('channel', { airings: [airing] });

export default function normalize(results) {
  return normalizer(results.map(r => r.data), [airing]);
}

export function normalizeSchedule(results, singleChannel = false) {
  if (singleChannel) {
    return results;
    return normalizer(results, [airing]);
  } else {
    return normalizer(results, [channel]);
  }
}