/**
 * [checksum implementation.]
 */
var utils = require('../protocol/utils');

var REC_BUF_LENGTH = 1024;
var recvBuf = new ArrayBuffer(REC_BUF_LENGTH);
var recvView = new Uint8Array(recvBuf);
var recvLength = 0;
var beginRecv = false;
var logger = require('../log/log4js').logger;
/**
 * [checksumRcvbuf checksum Rcvbuf]
 * @param  {array} data [the Rcvbuf to be checksum]
 * @param {Driver} driver [the driver instance,driver._on_data(buf) was uesed to process the checksumed buf]
 */
 function checksumRcvbuf(data,driver) {
  try {
    // parse buffer data
    for (var i = 0; i < data.length; i++) {
      if (data[i] === 0xf0) {
            // start flag
            recvLength = 0;
            beginRecv = true;
          } else if (data[i] === 0xf7) {
            // end flag
            beginRecv = false;
            var checksum = 0;
            for (var j = 0; j < recvLength - 1; j++) {
              checksum += recvView[j];
            }
            if ((checksum & 0x7f) === recvView[recvLength - 1]) {
              var buf = recvBuf.slice(0, recvLength - 1);
              logger.log("received new package:", utils.hexBuf(buf));
              if (driver._on_data) {
                driver._on_data(buf);
              } else {
                logger.warn("driver data callback not found!");
              }
            } else {
              logger.warn("buffer ignored because of checksum error: ", utils.hexBuf(recvBuf.slice(0, recvLength)));
              logger.warn("checksum is :", (checksum & 0x7f));
              logger.warn("recv checksum is :", recvView[recvLength - 1]);
            }
          } else {
            // normal
            if (beginRecv) {
              if (recvLength >= REC_BUF_LENGTH) {
                logger.warn("receive buffer overflow!");
              }
              recvView[recvLength++] = data[i];
            }
          }
        }
      } catch(e) {
        logger.warn("checksumRcvbuf error:" + e);
      }
    }

/**
 * [checksumSendbuf add checksum for Sendbuf]
 * @param  {array} buf [the buf to be add checksum]
 * @return {array} tempBuf [the buf after add checksum.]
 */
function checksumSendbuf(buf) {
    var view = new Uint8Array(buf);
    var tempBuf = new Buffer(buf.byteLength + 3);
    var idx = 0;

    tempBuf[idx++] = 0xf0;

    var checksum = 0;
    for (var i = 0; i < view.length; i++) {
      tempBuf[idx++] = view[i];
      checksum += view[i];
    }
    tempBuf[idx++] = checksum & 0x7f;
    tempBuf[idx++] = 0xf7;
    return tempBuf;
}

exports.checksumRcvbuf = checksumRcvbuf;
exports.checksumSendbuf = checksumSendbuf;

