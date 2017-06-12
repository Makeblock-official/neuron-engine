/**
 * driver for makeblockHD APP( js bridge)
 */

var Driver = require('./driver');
var parse = require('./checksum');

var driver = new Driver();

function Transport(connection) {
  'use strict';

  var self = this;
  this.connection = connection;

  this._init = function() {
    // 注册接收数据的接口
    this.connection && this.connection.onReceived(parse, driver);
  };

  /**
   * [_send sends array buffer to driver]
   * @param  {[ArrayBuffer]} buf [the buffer to send]
   * @return {[integer]}     [the actual byte length sent. -1 if send fails.]
   */
  this._send = function(buf) {
    var tempBuf = new Buffer(buf.byteLength + 3);
    tempBuf = parse.checksumSendbuf(buf);
    this.connection && this.connection.send(tempBuf);
  };
}

Transport.prototype = driver;

module.exports = Transport;
