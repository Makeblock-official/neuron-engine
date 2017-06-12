/**
 * [convert7to8bit converts an array buffer of 7bit/byte format to 8bit/byte format.]
 * @param  {[ArrayBuffer]} inbuf  [the source array buffer]
 * @param  {[int]} offset [the byte offset of buffer]
 * @param  {[int]} length [the length from offset]
 * @return {[ArrayBuffer]}        [the converted array buffer]
 */
function convert7to8bit(inbuf, offset, length) {
  'use strict';

  var out = null;

  if (!(inbuf instanceof(ArrayBuffer))) {
    return out;
  }

  if (inbuf.byteLength === 0) {
    out = new ArrayBuffer(0);
    return out;
  }

  offset = offset || 0;
  length = length || inbuf.byteLength;

  var inputView = new Uint8Array(inbuf, offset, length);

  var inlen = inputView.length;
  var outlen = inlen - Math.ceil(inlen / 8);
  out = new ArrayBuffer(outlen);

  var outView = new Uint8Array(out);

  var mask = [0x01, 0x03, 0x07, 0x0f, 0x1f, 0x3f, 0x7f];
  var counter = 0;
  var i, j = 0;
  var temp = 0;
  for (i = 0; i < inlen - 1; i++) {
    outView[j++] = (inputView[i] >> counter) | ((inputView[i + 1] & mask[counter]) << (7 - counter));
    counter++;
    if (0 === (counter % 7)) {
      counter = 0;
      i++;
    }
  }

  return out;
}

/**
 * [convert8to8bit converts an array buffer of 8bit/byte format to 7bit/byte format.]
 * @param  {[ArrayBuffer]} inbuf [the source array buffer]
 * @return {[ArrayBuffer]}       [the converted array buffer]
 */
function convert8to7bit(inbuf) {
  'use strict';

  var out = null;

  if (!(inbuf instanceof(ArrayBuffer))) {
    return out;
  }

  if (inbuf.byteLength === 0) {
    out = new ArrayBuffer(0);
    return out;
  }

  var inputView = new Uint8Array(inbuf);

  var inlen = inputView.length;
  var outlen = Math.ceil(inlen / 7) + inlen;
  out = new ArrayBuffer(outlen);

  var outView = new Uint8Array(out);

  var mask = [0x80, 0xc0, 0xe0, 0xf0, 0xf8, 0xfc, 0xfe];
  var counter = 0;
  var temp = 0x00;
  var i, j = 0;
  for (i = 0; i < inlen; i++) {
    outView[j++] = ((inputView[i] << counter) | temp) & 0x7f;

    temp = (((mask[counter] & inputView[i]) >> (7 - counter)));

    counter++;
    if (0 === (counter % 7)) {
      outView[j++] = temp;

      temp = 0x00;
      counter = 0;
    }
  }
  if (0 !== (counter % 7)) {
    outView[j++] = temp;
  }

  return out;
}

exports.convert7to8bit = convert7to8bit;
exports.convert8to7bit = convert8to7bit;
