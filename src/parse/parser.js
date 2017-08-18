// @flow

import type { S3EventRecord } from './s3';
import { recordToData } from './s3';
const xml2js = require('xml2js');

const parser = new xml2js.Parser({
  ignoreAttrs: true,
  includeWhiteChars: true,
  explicitArray: false,
  emptyTag: null,
  valueProcessors: [
    function parseNumbers (str) {
      if (!isNaN(str)) {
        str = str % 1 === 0 ? parseInt(str, 10) : parseFloat(str);
      }
      return str;
    }]
});

export default function parse(record: S3EventRecord) {
  return recordToData(record)
    .then(function({Body: content}) {
      return new Promise(function(resolve, reject) {
        parser.parseString(content, function(err, data) {
          if (err) {
            reject(err)
          } else {
            resolve(data);
          }
        });
      });
    });
}