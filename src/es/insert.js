// @flow

import Elastic from './elastic';

export class Indexer<T> {
  client: Elastic<T>;
  mapping: Object;

  constructor(client: Elastic<T>, mapping: Object) {
    this.client = client;
    this.mapping = mapping;
  }

  prepareToIndex(): Promise<boolean> {
    return this.client.checkIndex()
      .then((status: boolean) => {
        if (!status) {
          return this.client.createIndex(this.mapping)
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

  indexOne(airing: T): Promise<Object> {
    return this.prepareToIndex()
      .then(() => {
        return this.client.store(airing);
      });
  }

  indexMany(airings: Array<T>): Promise<Object> {
    return this.prepareToIndex()
      .then(() => {
        return this.client.storeAll(airings);
      });
  }
}

export type InsertOptions = {
  index: string,
  type: string,
  mapping: Object
};

export default function getIndexer<T>(options: InsertOptions): Indexer<T> {
  return new Indexer(new Elastic(null, options.index, options.type), options.mapping);
}