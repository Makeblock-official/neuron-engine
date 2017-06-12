/**
 * package serialzer and parser.
 * the package object format:
 *
 * {
 *   "no": 1, // the block number, required
 *   "type": 0x11, // the package type, required
 *   "subtype": 0x01, // the sub type, optional
 *   "data": [{   // the data, optional
 *     "byte": 0xf1 // 7bit/byte byte
 *   }, {
 *     "BYTE": 0x01 // 8bit/byte byte (obly use when the byte < 128)
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
 *     "string": "test"
 *   }] 
 * }
 */

var data = require('./data');
var utils = require('./utils');

/**
 * [parse parses bytes in array buffer to package object]
 * @param  {[type]} buf [input buffer]
 * @param  {[type]} pkg [pkg description]
 * @return {[type]}     [the parsed package]
 */
function parse(buf, pkg) {
  'use strict';

  if (typeof(buf) === 'undefined') {
    return null;
  }

  if (!(buf instanceof ArrayBuffer)) {
    return null;
  }

  if (buf.byteLength === 0) {
    return null;
  }

  var idx = 0;
  var view = new DataView(buf);


  pkg.no = view.getUint8(idx++, true);
  pkg.type = view.getUint8(idx++, true);
  if (pkg.hasOwnProperty('subtype')) {
    pkg.subtype = view.getUint8(idx++, true);
  }
  if (pkg.hasOwnProperty('code')) {
    pkg.code = view.getUint8(idx++, true);
  }  

  data.readDataFromBuffer(buf.slice(idx), pkg.data);

  return pkg;
}

/**
 * [serialize read package object and write its binary to array buffer]
 * @param  {[type]} pkg [the package to be serialized]
 * @return {[type]}     [the serialized array buffer]
 */
function serialize(pkg) {
  'use strict';

  if (typeof(pkg) === 'undefined') {
    return null;
  }

  if (!pkg.hasOwnProperty('no') || !pkg.hasOwnProperty('type')) {
    return null;
  }

  var buflen = 2;
  if (pkg.hasOwnProperty('subtype')) {
    buflen += 1;
  }
  if (pkg.hasOwnProperty('code')) {
    buflen += 1;
  }  
  if (pkg.hasOwnProperty('data')) {
    buflen += data.calcBufferLength(pkg.data);
  }

  var buf = new ArrayBuffer(buflen);
  var view = new DataView(buf);

  var idx = 0;
  view.setUint8(idx++, pkg.no, true);
  view.setUint8(idx++, pkg.type, true);
  if (pkg.hasOwnProperty('subtype')) {
    view.setUint8(idx++, pkg.subtype, true);
  }
  if (pkg.hasOwnProperty('code')) {
    view.setUint8(idx++, pkg.code, true);
  }  
  if (pkg.hasOwnProperty('data')) {
    var tempbuf = data.writeDataToBuffer(pkg.data);

    utils.copyBuffer(tempbuf, buf, idx);
  }

  return buf;
}

exports.parse = parse;
exports.serialize = serialize;
