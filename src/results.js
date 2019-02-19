import { normalize as normalizer, schema } from 'normalizr';

const show = new schema.Entity('show');
const episode = new schema.Entity('episode', {}, {
  idAttribute: function(episode) {
    return episode.id || parseInt(`${episode.program.id}${episode.version.id}`);
  }
});
const airing = new schema.Entity('airing', { show, episode });
const channel = new schema.Entity('channel', { airings: [airing] });

type SingleScheduleData = {
  entities: {
    show: Object,
    episode: Object,
    airing: Object,
  },
  result: Array<number>
}

type MultiScheduleData = {
  show: Object,
  episode: Object,
  airing: Object,
  channel: Object,
  result: Array<string>
}

export type ScheduleData = SingleScheduleData|MultiScheduleData;

export default function normalize(results) {
  return normalizer(results.map(r => r.data), [airing]);
}

export function normalizeSchedule(results: Array<Object>,
                                  singleChannel: boolean = false): ScheduleData {
  console.log(results);
  if (singleChannel) {
    return normalizer(results, [airing]);
  } else {
    return normalizer(results, [channel]);
  }
}