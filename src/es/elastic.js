// @flow

import AWS from 'aws-sdk';
import type { ESResults } from './result';
import type { Airing } from './../airing';
let ES = require('elasticsearch');
let Connector = require('http-aws-es');

export default class Elastic {
  client: ES.Client;
  index: string;
  type: string;

  constructor(client: ?ES.Client, index: string, type: string) {
    AWS.config.update({region: process.env.AWS_REGION});
    this.client = client || ES.Client({
        hosts: [process.env.ES_ENDPOINT],
        connectionClass: Connector
    });

    this.index = index;
    this.type = type;
  }

  checkIndex(): Promise<boolean> {
    return this.client.indices.exists({ index: this.index })
      .catch(function() {
        return false;
      });
  }

  createIndex(body: {}): Promise<{}> {
    return this.client.indices.create({ index: this.index, body });
  }

  store(body: {}): Promise<{}> {
    return this.client.index({ index: this.index, type: this.type, body });
  }

  storeAll(body: Array<Object>): Promise<Object> {
    let expanded = body.reduce(
      function(list: Array<{}>, body: {}): Array<{}> {
        list.push({ index:  { _index: this.index, _type: this.type } });
        list.push(body);
        return list;
      }.bind(this),
      []
    );

    return this.client.bulk({ body: expanded });
  }

  remove(body: Object): Promise<Object> {
    return this.client.deleteByQuery({ index: this.index, body });
  }

  search(body: Object): Promise<ESResults<Airing>> {
    return this.client.search({ index: this.index, body });
  }
}