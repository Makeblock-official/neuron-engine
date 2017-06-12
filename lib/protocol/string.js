/**
 * protocol data encoding and decoding for string type.
 * [{
 *   "string": "asdf"
 * }] 
 * the binary format of string follows TLV:tag(BYTE)+length(short)+value(bytes) pattern.
 */

var convert = require('./convert');
var utils = require('./utils');

var TAG_LEN = 1;
var LENGTH_LEN = 2;
var ASCII = 1;

// ArrayBuffer to ascii string
function _ab2asciiStr(buf) {
  'use strict';

  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

// ascii string to arraybuffer
function _asciiStr2ab(str) {
  'use strict';

  var buf = new ArrayBuffer(str.length);
  var bufView = new Uint8Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

/**
 * [readStringFromBuffer reads a string from buffer from index]
 * @param  {ArrayBuffer} buf [the source buffer]
 * @param  {integer} idx [the start index of buffer]
 * @param  {string} encoding [optional. default 'ascii'. will support 'utf-8', 'gbk' in the feature.]
 * @return {string}     [the string read. (including tag and length field)]
 */
function readStringFromBuffer(buf, idx, encoding) {
  'use strict';

  idx = idx || 0;
  var view = new DataView(buf, idx);
  var tag = view.getInt8(0, true);

  var temp = new Int8Array(buf, idx + TAG_LEN, LENGTH_LEN);
  var v = new Int8Array(LENGTH_LEN + 1);
  v[0] = temp[0];
  v[1] = temp[1];
  var lenView = new DataView(convert.convert7to8bit(v.buffer));
  var length = lenView.getInt16(0, true);

  var strStart = idx + TAG_LEN + LENGTH_LEN;
  if (tag === ASCII){
    return _ab2asciiStr(buf.slice(strStart));
  }
}

/**
 * [writeStringToBuffer description]
 * @param  {string} str [the string to write]
 * @param  {string} encoding [optional. default 'ascii'. will support 'utf-8', 'gbk' in the feature.]
 * @return {ArrayBuffer}        [the arraybuffer of bytes wrote. (including tag and length field)]
 */
function writeStringToBuffer(str, encoding) {
  'use strict';

  var bufLen = calcStringByteLen(str, encoding);
  var strLen = str.length;

  var buf = new ArrayBuffer(bufLen);

  var tagArray = new Int8Array([0x01]);
  utils.copyBuffer(tagArray.buffer, buf);

  var lenView = new DataView(new ArrayBuffer(LENGTH_LEN));
  lenView.setInt16(0, strLen, true);
  var lenArray = convert.convert8to7bit(lenView.buffer);
  utils.copyBuffer(lenArray, buf, TAG_LEN);

  utils.copyBuffer(_asciiStr2ab(str), buf, TAG_LEN + LENGTH_LEN);

  return buf;
}

/**
 * [calcStringByteLen calculates the length of encoded bytes of string]
 * @param  {string} str   [the string]
 * @param  {string} encoding [optional. default 'ascii'. will support 'utf-8', 'gbk' in the feature.]
 * @return {integer}          [the length of result buffer.]
 */
function calcStringByteLen(str, encoding) {
  'use strict';

  // ascii
  return TAG_LEN + LENGTH_LEN + str.length;
}

exports.readStringFromBuffer = readStringFromBuffer;
exports.calcStringByteLen = calcStringByteLen;
exports.writeStringToBuffer = writeStringToBuffer;
