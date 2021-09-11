const showStore = new Map();
const episodeStore = new Map();
const airingStore = new Map();
const viewStore = new Map(); // map of channels to airing IDs

function addToStore(o, s) {
  for (let id in o) {
    if (o.hasOwnProperty(id)) {
      s.set(parseInt(id), o[id]);
    }
  }
}

function addView(channel, id) {
  let airings = viewStore.get(channel) || new Set();
  airings.add(id);
  viewStore.set(channel, airings);
}

function getChannelFromAirings(airings) {
  let airing = airings[Object.keys(airings)[0]];
  return airing.channel || null;
}

function getEpisodeKey(episode) {
  return episode.id || parseInt(`${episode.program.id}${episode.version.id}`);
}

export function receive(scheduleData, singleChannel = false) {

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
      for (let i = 0; i < airingIds.length; i++) {
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

export function getShow(id) {
  return showStore.get(id) || null;
}

export function getEpisode(id) {
  return episodeStore.get(id) || null;
}

export function getAiring(id) {
  return airingStore.get(id) || null;
}

export function getViews(channel) {
  let airings = viewStore.get(channel);
  return airings ? [...airings] : null;
}