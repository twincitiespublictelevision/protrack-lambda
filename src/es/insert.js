// @flow

import Elastic from './elastic';
import type { Airing } from './../airing';
import AiringMapping from './airings.json';

export class Indexer {
  client: Elastic;

  constructor(client: Elastic) {
    this.client = client;
  }

  prepareToIndex(): Promise<boolean> {
    return this.client.checkIndex()
      .then((status: boolean) => {
        if (!status) {
          return this.client.createIndex(AiringMapping)
            .then(function(status) {
              return true;
            })
            .catch(function(failure) {
              return false;
            });
        }

        return status;
      });
  }

  indexOne(airing: Airing): Promise<Object> {
    return this.prepareToIndex()
      .then(() => {
        return this.client.store(airing);
      });
  }

  indexMany(airings: Array<Airing>): Promise<Object> {
    return this.prepareToIndex()
      .then(() => {
        return this.client.storeAll(airings);
      });
  }
}

export type InsertOptions = {
  indexer?: Indexer,
  index?: string,
  type?: string
};

export default function getIndexer(options: InsertOptions): Indexer {
  let index = options.index || 'airings';
  let type = options.type || 'airing';
  return options.indexer || new Indexer(new Elastic(null, index, type));
}