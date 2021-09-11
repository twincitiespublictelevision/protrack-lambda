// const xml2js = require('xml2js');
import xml2js from 'xml2js';

const parser = new xml2js.Parser({
  ignoreAttrs: true,
  includeWhiteChars: true,
  explicitArray: false,
  emptyTag: null,
  valueProcessors: [
    function parseNumbers(str) {
      if (!isNaN(str)) {
        str = str % 1 === 0 ? parseInt(str, 10) : parseFloat(str);
      }
      return str;
    },
    function parseYesNo(value) {
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

export default function parse({ Body: content }) {
  return new Promise(function (resolve, reject) {
    parser.parseString(content, function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data);
      }
    });
  });
}