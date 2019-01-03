// @flow

import type { S3EventRecord } from './s3';
// import { eventToBucket, recordToData } from './s3';
const xml2js = require('xml2js');

const parser = new xml2js.Parser({
  ignoreAttrs: true,
  includeWhiteChars: true,
  explicitArray: false,
  emptyTag: null,
  valueProcessors: [
    function parseNumbers(str: *): number {
      if (!isNaN(str)) {
        str = str % 1 === 0 ? parseInt(str, 10) : parseFloat(str);
      }
      return str;
    },
    function parseYesNo(value: *): boolean {
      if (value && value.toLowerCase) {
        if (value.toLowerCase() === 'yes') {
          return true;
        } else if (value.toLowerCase() === 'no') {
          return false;
        }
      }

      return value;
    }
  ]
});

export default function parse({Body: content}: Object): Promise<*> {
  return new Promise(function(resolve, reject) {
    parser.parseString(content, function(err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data);
      }
    });
  });
}