// @flow

import type { Airing, Show, Channel } from './types';
import type { Result } from './es/mapResults';

import { normalize as normalizer, schema } from 'normalizr';

const show = new schema.Entity('show');
const episode = new schema.Entity('episode', {}, {
  idAttribute: function(episode) {
    return episode.id || parseInt(`${episode.program.id}${episode.version.id}`);
  }
});
const airing = new schema.Entity('airing', { show, episode });
const channel = new schema.Entity('channel', { airings: [airing] });

type ShowData = {
  entities: {
    show: Object
  },
  result: Array<number>
}

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

export function normalize(results: Array<Result<Airing>>) {
  return normalizer(results.map(r => r.data), [airing]);
}

export function normalizeShows(results: Array<Result<Show>>): ShowData {
  return normalizer(results.map(r => r.data), [show]);
}

export function normalizeAirings(airings: Array<Airing>): SingleScheduleData {
  return normalizer(airings, [airing]);
}

export function normalizeChannels(channels: Array<Channel>): MultiScheduleData {
  return normalizer(channels, [channel]);
}