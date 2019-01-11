import { normalize as normalizer, schema } from 'normalizr';

let show = new schema.Entity('show');
let episode = new schema.Entity('episode', {}, {
  idAttribute: function(episode) {
    return `${episode.program.id}${episode.version.id}`;
  }
});
let airing = new schema.Entity('airing', { show, episode }, {
  idAttribute: function(airing) {
    return `${airing.channel}.${airing.date}`;
  }
});

export default function normalize(results) {
  return normalizer(results.map(r => r.data), [airing]);
}