import AWS from 'aws-sdk';
// let ES = require('elasticsearch');
import ES from 'elasticsearch';
// let Connector = require('http-aws-es');
import Connector from 'http-aws-es';

export default class Elastic {
  client;
  index;
  type;

  constructor(client, index, type) {
    AWS.config.update({ region: process.env.AWS_REGION });
    this.client = client || ES.Client({
      hosts: [process.env.ES_ENDPOINT],
      connectionClass: Connector
    });

    this.index = index;
    this.type = type;
  }

  checkIndex() {
    return this.client.indices.exists({ index: this.index })
      .catch(function () {
        return false;
      });
  }

  createIndex(body) {
    return this.client.indices.create({ index: this.index, body });
  }

  store(body) {
    if (typeof body.id !== 'undefined') {
      return this.client.index({ index: this.index, type: this.type, _id: body.id, body });
    } else {
      return this.client.index({ index: this.index, type: this.type, body });
    }
  }

  storeAll(body) {
    let expanded = body.reduce(
      (list, body) => {
        if (typeof body.id !== 'undefined') {
          list.push({ index: { _index: this.index, _type: this.type, _id: body.id } });
        } else {
          list.push({ index: { _index: this.index, _type: this.type } });
        }

        list.push(body);
        return list;
      },
      []
    );

    return this.client.bulk({ body: expanded });
  }

  removeAll(body) {
    let expanded = body.reduce(
      (list, body) => {
        list.push({ delete: { _index: this.index, _type: this.type, _id: body.id } });
        return list;
      },
      []
    );

    return this.client.bulk({ body: expanded });
  }

  remove(body) {
    return this.client.deleteByQuery({ index: this.index, body });
  }

  search(body) {
    return this.client.search({ index: this.index, body });
  }
}