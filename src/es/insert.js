import Elastic from './elastic';

export class Indexer {
  client;
  mapping;

  constructor(client, mapping) {
    this.client = client;
    this.mapping = mapping;
  }

  prepareToIndex() {
    return this.client.checkIndex()
      .then((status) => {
        if (!status) {
          return this.client.createIndex(this.mapping)
            .then(function (status) {
              return true;
            })
            .catch(function (failure) {
              return false;
            });
        }

        return status;
      });
  }

  indexOne(airing) {
    return this.prepareToIndex()
      .then(() => {
        return this.client.store(airing);
      });
  }

  indexMany(airings) {
    return this.prepareToIndex()
      .then(() => {
        return this.client.storeAll(airings);
      });
  }
}

export default function getIndexer(options) {
  return new Indexer(new Elastic(null, options.index, options.type), options.mapping);
}