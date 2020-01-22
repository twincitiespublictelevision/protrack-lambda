// @flow

import type {Airing, Episode, Show} from './types';
import type {ScheduleData} from './results';

const showStore: Map<number, Show> = new Map();
const episodeStore: Map<number, Episode> = new Map();
const airingStore: Map<number, Airing> = new Map();
const viewStore: Map<string, Set<number>> = new Map(); // map of channels to airing IDs

function addToStore(o: Object, s: Object): void {
  for (let id in o) {
    if (o.hasOwnProperty(id)) {
      s.set(parseInt(id), o[id]);
    }
  }
}

function addView(channel: string, id: number): void {
  let airings = viewStore.get(channel) || new Set();
  airings.add(id);
  viewStore.set(channel, airings);
}

function getChannelFromAirings(airings: Object):? string {
  let airing = airings[Object.keys(airings)[0]];
  return airing.channel || null;
}

function getEpisodeKey(episode: Episode): number {
  return episode.id || parseInt(`${episode.program.id}${episode.version.id}`);
}

export function receive(scheduleData: ScheduleData, singleChannel: boolean = false): void {

  if (!scheduleData.entities) {
    return;
  }

  let entities = scheduleData.entities;

  if (singleChannel) {
    let channel = null; // we don't know the channel yet. it will be in airing data.

    if (entities.show) {
      addToStore(entities.show, showStore);
    }
    if (entities.episode) {
      addToStore(entities.episode, episodeStore);
    }
    if (entities.airing) {
      addToStore(entities.airing, airingStore);
      channel = getChannelFromAirings(entities.airing);
    }

    if (channel) {
      let airingIds = scheduleData.result;
      for (let i=0; i<airingIds.length; i++) {
        addView(channel, airingIds[i]);
      }
    }
  } else { // multiple channels

    if (entities.hasOwnProperty('airing')) {
      for (let id in entities.show) {
        showStore.set(parseInt(id), entities.show[id]);
      }
      for (let id in entities.airing) {
        airingStore.set(parseInt(id), entities.airing[id]);
      }
      for (let id in entities.episode) {
        episodeStore.set(parseInt(id), entities.episode[id]);
      }

      for (let channelName in entities.channel) {
        if (entities.channel.hasOwnProperty(channelName)) {
          entities.channel[channelName].airings.forEach(id => addView(channelName, id));
        }
      }
    }
  }
}

export function getShow(id: number): ?Show {
  return showStore.get(id) || null;
}

export function getEpisode(id: number): ?Episode {
  return episodeStore.get(id) || null;
}

export function getAiring(id: number): ?Airing {
  return airingStore.get(id) || null;
}

export function getViews(channel: string):? Array<number> {
  let airings = viewStore.get(channel);
  return airings ? [...airings] : null;
}