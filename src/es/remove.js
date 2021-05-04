import Elastic from './elastic';

export class Remover {
  client;

  constructor(client) {
    this.client = client;
  }

  removeChannel(channel) {
    return this.client.checkIndex()
      .then(status => {
        if (status === true) {
          return this.client.remove({ query: { term: { channel } } })
            .then(function () {
              return true;
            })
            .catch(function () {
              return false;
            });
        } else {
          return true;
        }
      });
  }

  removeMany(body) {
    return this.client.checkIndex()
      .then(status => {
        if (status === true) {
          return this.client.removeAll(body).then(function () {
            return true;
          })
            .catch(function () {
              return false;
            });
        } else {
          return true;
        }
      });
  }
}

export default function getRemover(options) {
  return new Remover(new Elastic(null, options.index, options.type));
}