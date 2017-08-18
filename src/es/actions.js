//@flow

import type { Airing } from './../airing';
import type { AiringResults } from './airingResult';
import type { SearchOptions } from './search';
import getSearcher from './search';
import type { InsertOptions } from './insert';
import getIndexer from './insert';
import type { RemoveOptions } from './remove';
import getRemover from './remove';

function search(options: ?SearchOptions): Promise<AiringResults> {
  return getSearcher(options || {}).run();
}

function insert(airings: Array<Airing>, options: ?InsertOptions): Promise<Object> {
  return getIndexer(options || {}).indexMany(airings);
}

function remove(channel: string, options: ?RemoveOptions): Promise<boolean> {
  return getRemover(options || {}).removeChannel(channel);
}

export default { search, insert, remove }