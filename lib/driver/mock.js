/**
 * mock communication driver implementation. used only for test.
 */
utils = require('../../lib/protocol/utils');
Driver = require('./driver');
var driver = new Driver();
var logger = require('../log/log4js').logger;
/**
 * [Mock driver constructor.]
 */
function Mock() {
  'use strict';

  var self = this;

  /**
   * [_send sends array buffer to driver]
   * @param  {[ArrayBuffer]} buf [the buffer to send]
   * @return {[integer]}     [the actual byte length sent. -1 if send fails.]
   */
  this._send = function(buf) {
    var view = new Uint8Array(buf);
    var tempBuf = new ArrayBuffer(buf.byteLength + 3);
    var idx = 0;
    var checksum = 0;
    var tempView = new Uint8Array(tempBuf);
    tempView[idx++] = 0xf0;
    for (var i = 0; i < view.length; i++) {
      tempView[idx++] = view[i];
      checksum += view[i];
    }
    tempView[idx++] = checksum & 0x7f;
    tempView[idx++] = 0xf7;

    //logger.debug('sending buffer: ' + utils.hexBuf(tempBuf));
    return tempBuf.byteLength;
  };

  /**
   * [_generate generate mock received buffer]
   * @param  {[ArrayBuffer]} buf [the buffer received]
   */
  this._generate = function (buf) {
    self._on_data(buf);
  };

}

Mock.prototype = driver;

module.exports = Mock;
