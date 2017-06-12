/**
 * protocol data encoding and decoding.
 * the data is represented as follow (Object Array):
 * [{   
 *     "byte": 0xf1 // 7bit/byte byte
 *   }, {
 *     "BYTE": 0x01 // 8bit/byte byte (only use when the byte < 128)
 *   },{
 *     "short": 0x019f // 7bit/byte short
 *   },{
 *     "SHORT": 0x019f // 7bit/byte short, but ignore most significant byte (only use when the MSB is 0x00)
 *   }, {
 *     "long": 0x11111111 // 7bit/byte long
 *   }, {
 *     "float": 9.88  // 7bit/byte float
 *   }, {
 *     "double": 0.99998 // 7bit/byte double
 *   }, {
 *     "string": "test" // byte array of TLV format (see string.js)
 *   }] 
 */
var _ = require('underscore');
var utils = require('./utils');
var string = require('./string');
var convert = require('./convert');

/**
 * [DATA_TYPE describes the info of each data type]
 * @type {Object} 
 */
var DATA_TYPE = {
  "byte": {
    "origByteLength": 1,
    "codecByteLength": 2,
    "readFunc": "getInt8",
    "setFunc": "setInt8"
  },
  "BYTE": {
    "origByteLength": 1,
    "codecByteLength": 1,
    "readFunc": "getInt8",
    "setFunc": "setInt8"
  },
  "short": {
    "origByteLength": 2,
    "codecByteLength": 3,
    "readFunc": "getInt16",
    "setFunc": "setInt16"
  },
  "SHORT": {
    "origByteLength": 2,
    "codecByteLength": 2,
    "readFunc": "getInt16",
    "setFunc": "setInt16"
  },
  "long": {
    "origByteLength": 4,
    "codecByteLength": 5,
    "readFunc": "getInt32",
    "setFunc": "setInt32"
  },
  "float": {
    "origByteLength": 4,
    "codecByteLength": 5,
    "readFunc": "getFloat32",
    "setFunc": "setFloat32"
  },
  "double": {
    "origByteLength": 8,
    "codecByteLength": 10,
    "readFunc": "getFloat64",
    "setFunc": "setFloat64"
  }
};

/**
 * [calcBufferLength calcs the codec buffer length of data]
 * @param  {[Object Array]} data [the data array to describe the data]
 * @return {[Integer]}      [the codec buffer length]
 */
function calcBufferLength(data) {
  'use strict';

  var buflen = 0;
  var type;
  // calc buffer length
  for (var i = 0; i < data.length; i++) {
    type = _.keys(data[i])[0];

    if (type == 'string') {
      buflen += string.calcStringByteLen(data[i][type]);
    } else {
      if (DATA_TYPE[type]) {
        buflen += DATA_TYPE[type].codecByteLength;
      }
    }
  }
  return buflen;
}

/**
 * [readDataFromBuffer read typed data from array buffer]
 * @param  {[ArrayBuffer]} buf  [the srouce array buffer]
 * @param  {[Object Array]} data [the data array to describe the data ]
 * @return {[Object Array]}      [the data array filled with read data]
 */
function readDataFromBuffer(buf, data) {
  'use strict';

  if ((typeof(buf) === 'undefined') || (typeof(data) === 'undefined')) {
    return null;
  }

  var idx = 0;
  var raw;
  var type;
  var view;

  for (var i = 0; i < data.length; i++) {
    type = _.keys(data[i])[0];
    if (type == 'string') {
      var str = string.readStringFromBuffer(buf, idx);
      idx += string.calcStringByteLen(str);
      data[i][type] = str;
    } else {
      switch (type) {
        case 'byte':
        case 'short':
        case 'long':
        case 'float':
        case 'double':
          raw = convert.convert7to8bit(buf, idx, DATA_TYPE[type].codecByteLength);
          break;
        case 'BYTE':
          raw = buf.slice(idx, idx + 1);
          break;
        case 'SHORT':
          var temp = new Int8Array(buf, idx, DATA_TYPE[type].codecByteLength);
          var v = new Int8Array(DATA_TYPE[type].codecByteLength + 1);
          v[0] = temp[0];
          v[1] = temp[1];
          raw = convert.convert7to8bit(v.buffer);
          break;
        default:
          // type not supported
          return null;
      }
      view = new DataView(raw);
      data[i][type] = view[DATA_TYPE[type].readFunc](0, true);
      idx += DATA_TYPE[type].codecByteLength;
    }
  }

  return data;
}

/**
 * [writeDataToBuffer write typed data to array buffer]
 * @param  {[Object Array]} data [the data array]
 * @return {[ArrayBuffer]}      [the serialized binary array buffer]
 */
function writeDataToBuffer(data) {
  'use strict';

  if (typeof(data) === 'undefined') {
    return null;
  }

  var idx = 0;
  var buflen = 0;
  var type;
  var raw;
  var temp;

  buflen = calcBufferLength(data);

  var buf = new ArrayBuffer(buflen);
  var view = new DataView(buf);

  for (var i = 0; i < data.length; i++) {
    type = _.keys(data[i])[0];
    if (type == 'string') {
      utils.copyBuffer(string.writeStringToBuffer(data[i][type]), buf, idx);
      idx += string.calcStringByteLen(data[i][type]);
    } else {
      switch (type) {
        case 'byte':
        case 'short':
        case 'long':
        case 'float':
        case 'double':
          temp = new ArrayBuffer(DATA_TYPE[type].origByteLength);
          view = new DataView(temp);
          view[DATA_TYPE[type].setFunc](0, data[i][type], true);

          raw = convert.convert8to7bit(temp);

          break;
        case 'BYTE':
          raw = (new Int8Array([data[i][type]])).buffer;
          break;
        case 'SHORT':
          temp = new ArrayBuffer(DATA_TYPE[type].origByteLength);
          view = new DataView(temp);
          view[DATA_TYPE[type].setFunc](0, data[i][type], true);

          raw = convert.convert8to7bit(temp).slice(0, DATA_TYPE[type].codecByteLength);
          break;
        default:
          // type not supported
          return null;
      }

      utils.copyBuffer(raw, buf, idx);
      idx += DATA_TYPE[type].codecByteLength;
    }

  }

  return buf;
}

exports.calcBufferLength = calcBufferLength;
exports.readDataFromBuffer = readDataFromBuffer;
exports.writeDataToBuffer = writeDataToBuffer;