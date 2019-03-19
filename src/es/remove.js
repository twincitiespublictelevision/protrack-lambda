// @flow

import Elastic from './elastic';

export class Remover<T> {
  client: Elastic<T>;

  constructor(client: Elastic<T>) {
    this.client = client;
  }

  removeChannel(channel: string): Promise<boolean> {
    return this.client.checkIndex()
      .then(status => {
        if (status === true) {
          return this.client.remove({ query: { term: { channel } } })
            .then(function() {
              return true;
            })
            .catch(function() {
              return false;
            });
        } else {
          return true;
        }
      });
  }

  removeMany(body: Array<Object>): Promise<boolean> {
    return this.client.checkIndex()
      .then(status => {
        if (status === true) {
          return this.client.removeAll(body).then(function() {
            return true;
          })
          .catch(function() {
            return false;
          });
        } else {
          return true;
        }
  });
  }
}

export type RemoveOptions = {
  index: string,
  type: string
};

export default function getRemover<T>(options: RemoveOptions): Remover<T> {
  return new Remover(new Elastic(null, options.index, options.type));
}