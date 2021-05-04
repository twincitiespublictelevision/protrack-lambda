import AiringMapping from './airings.json';
import ShowMapping from './shows.json';
import getAiringSearcher from './airingSearcher';
import getShowSearcher from './showSearcher';
import getIndexer from './insert';
import getRemover from './remove';

function searchAirings(options) {
  return getAiringSearcher(options || {}).run();
}

function searchShows(options) {
  return getShowSearcher(options || {}).run();
}

function insertAirings(airings, options) {
  options = options || { index: 'airings', type: 'airing', mapping: AiringMapping };
  return getIndexer(options).indexMany(airings);
}

function insertShows(shows, options) {
  options = options || { index: 'shows', type: 'show', mapping: ShowMapping };
  return getIndexer(options).indexMany(shows);
}

function removeChannel(channel, options) {
  return getRemover(options).removeChannel(channel);
}

function removeAirings(airings, options) {
  options = options || { index: 'airings', type: 'airing' };
  return getRemover(options).removeMany(airings);
}

export default { searchAirings, searchShows, insertAirings, insertShows, removeChannel, removeAirings }