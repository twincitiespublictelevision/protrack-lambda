//@flow

import type { Result } from './mapResults';

import type { Airing, Show } from './../types';
import AiringMapping from './airings.json';
import ShowMapping from './shows.json';
import type { AiringSearchOptions } from './airingSearcher';
import getAiringSearcher from './airingSearcher';
import type { ShowSearchOptions } from './showSearcher';
import getShowSearcher from './showSearcher';
import type { InsertOptions } from './insert';
import getIndexer from './insert';
import type { RemoveOptions } from './remove';
import getRemover from './remove';

function searchAirings(options: ?AiringSearchOptions): Promise<Array<Result<Airing>>> {
  return getAiringSearcher(options || {}).run();
}

function searchShows(options: ?ShowSearchOptions): Promise<Array<Result<Show>>> {
  return getShowSearcher(options || {}).run();
}

function insertAirings(airings: Array<Airing>, options: ?InsertOptions): Promise<Object> {
  options = options || { index: 'airings', type: 'airing', mapping: AiringMapping };
  return getIndexer(options).indexMany(airings);
}

function insertShows(shows: Array<Show>, options: ?InsertOptions): Promise<Object> {
  options = options || { index: 'shows', type: 'show', mapping: ShowMapping };
  return getIndexer(options).indexMany(shows);
}

function removeChannel(channel: string, options: RemoveOptions): Promise<boolean> {
  return getRemover(options).removeChannel(channel);
}

function removeAirings(airings: Array, options: ?RemoveOptions): Promise<boolean> {
  options = options || { index: 'airings', type: 'airing' };
  return getRemover(options).removeMany(airings);
}

export default { searchAirings, searchShows, insertAirings, insertShows, removeChannel, removeAirings }