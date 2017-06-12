/**
 * util functions
 */

var crc_table = new Uint32Array(256);
var tempCRC = new Uint32Array(1);
var isInitCRC_table = false;

function init_crc_table() {
  var i, j;
  for(i = 0; i < 256; ++i) {
    tempCRC[0] = i;
    for(j = 0; j < 8; ++j) {
      if(tempCRC[0] & 1) {
        tempCRC[0] = 0xedb88320 ^ (tempCRC[0] >>> 1);
      } else {
        tempCRC[0] = tempCRC[0] >>> 1;
      }
    }
    crc_table[i] = tempCRC[0];
  }
}

function crc32(crc, uint8arr, size) {
  if(!isInitCRC_table) {
    isInitCRC_table = true;
    init_crc_table();
  }
  tempCRC[0] = crc;
  for(var i = 0; i < size; ++i) {
    tempCRC[0] = crc_table[(tempCRC[0] ^ uint8arr[i]) & 0xff] ^ (tempCRC[0] >>> 8);
  }
  return tempCRC[0] ^ 0xffffffff;
}

/**
 * [hexBuf return hex string representation of an ArrayBuffer]
 * @param  {[buf]} buf  [the input buf]
 * @return {[string]}     [the hex string representation]
 */
function hexBuf(buf) {
  'use strict';

  var view = new Uint8Array(buf);
  var hex = '0x';
  var byte = '';

  for (var i = 0; i < view.length; i++) {
    byte = view[i].toString(16);
    if (byte.length < 2) {
      byte = '0' + byte;
    }
    hex += byte;
  }

  return hex;
}

/**
 * [bufferEqual return if two ArrayBuffer is deep equal]
 * @param  {[type]} buf1 [the first buf]
 * @param  {[type]} buf2 [the second buf]
 * @return {[type]}      [return true if two ArrayBuffer is equal, false if not.]
 */
function bufferEqual(buf1, buf2) {
  'use strict';

  if (!(buf1 instanceof(ArrayBuffer)) || !(buf2 instanceof(ArrayBuffer))) {
    return false;
  }

  if (buf1.byteLength != buf2.byteLength) {
    return false;
  }

  var view1 = new Uint8Array(buf1);
  var view2 = new Uint8Array(buf2);

  for (var i = 0; i < view1.length; i++) {
    if (view1[i] != view2[i]) {
      return false;
    }
  }

  return true;
}

/**
 * [copyBuffer copy the bytes in src to desc from 'start' index]
 * @param  {[ArrayBuffer]} src   [the source buffer]
 * @param  {[ArrayBuffer]} des   [the destination buffer]
 * @param  {[type]} start [if specified, will copy from start index of desc]
 * @return {[ArrayBuffer]}       [the desc array buffer]
 */
function copyBuffer(src, des, start) {
  'use strict';

  if (src === des) {
    return des;
  }

  var idx = start || 0;

  var srcView = new Int8Array(src);
  var desView = new Int8Array(des);

  for (var i = 0; i < srcView.length; i++) {
    if (idx + i >= desView.length) {
      break;
    }
    desView[idx + i] = srcView[i];
  }

  return des;
}

exports.hexBuf = hexBuf;
exports.bufferEqual = bufferEqual;
exports.copyBuffer = copyBuffer;
exports.crc32 = crc32;