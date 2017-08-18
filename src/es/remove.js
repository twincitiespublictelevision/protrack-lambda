// @flow

import Elastic from './elastic';

export class Remover {
  client: Elastic;

  constructor(client: Elastic) {
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
}

export type RemoveOptions = {
  remover?: Remover,
  index?: string
};

export default function getRemover(options: RemoveOptions): Remover {
  let index = options && options.index || 'airings';
  return options && options.remover || new Remover(new Elastic(null, index, 'airing'));
}