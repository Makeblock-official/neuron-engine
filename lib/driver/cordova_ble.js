/**
 * driver for makeblockHD APP(cordova ble bridge)
 */

var Driver = require('./driver');
var checksum = require('./checksum');
var logger = require('../log/log4js').logger;

var MAX_LENGTH = 20;

var bufferToArrayBuffer = function(buffer) {
  var ab = new ArrayBuffer(buffer.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return ab;
};

var driver = new Driver();

function CordovaBle() {
  'use strict';

  var self = this;
  var isConnected = false;
  var commServiceID = 'FFE1';
  var writeCharacteristicID = 'FFE3';
  var readCharacteristicID = 'FFE2';

  this._init = function() {
    if (ble && ble.connectedDeviceID) {
      ble.startNotification(ble.connectedDeviceID, commServiceID, readCharacteristicID, function(data) {
        // read success
        checksum.checksumRcvbuf(new Uint8Array(data), driver);
      }, function(err) {
        // read failure
        logger.warn('read error, ', err);
      });
    } else {
      // connection may lost
    }
  };

  this._bleWrite = function(buffer){
    ble.writeWithoutResponse(ble.connectedDeviceID, commServiceID,writeCharacteristicID, buffer,
      function() {
        if(!isConnected) {
          self._init();
        }
        isConnected = true;
      },
      function(err) {
        logger.warn('write error, ', err);
        ble.stopNotification(ble.connectedDeviceID, commServiceID, readCharacteristicID);
        isConnected = false;
      }
    );
  };

  /**
   * [_send sends array buffer to driver]
   * @param  {[ArrayBuffer]} buf [the buffer to send]
   * @return {[integer]}     [the actual byte length sent. -1 if send fails.]
   */
  this._send = function(buf) {
    var tempBuf = new Buffer(buf.byteLength + 3);
    tempBuf = checksum.checksumSendbuf(buf);

    if (ble && ble.connectedDeviceID) {
      var sendBuffer = bufferToArrayBuffer(tempBuf); 
      var byteLength = sendBuffer.byteLength; 
      // apple ble can only send 20 bytes once  
      if (byteLength > MAX_LENGTH){
        var newBuffer;
        var start,end;
        var leftLength = byteLength;
        var count = Math.ceil(byteLength/MAX_LENGTH);
        for (var i=0; i < count; i++){
          start = MAX_LENGTH*i;
          if (leftLength > MAX_LENGTH){
            end = MAX_LENGTH*i + MAX_LENGTH;
          } else {
            end = MAX_LENGTH*i + leftLength +1;
          }
          newBuffer = sendBuffer.slice(start,end);
          self._bleWrite(newBuffer);
          leftLength = leftLength - MAX_LENGTH;
        }
      } else {
        self._bleWrite(sendBuffer);
      }
    } else{
      isConnected = false;
    }
    return tempBuf.length;
  };

  /**
   * [close interface]
   */
  this._close = function() {
    if (ble && ble.connectedDeviceID) {
      ble.stopNotification(ble.connectedDeviceID, commServiceID, readCharacteristicID);
      ble.connectedDeviceID = null;
      isConnected = false;
    }
  };
}

CordovaBle.prototype = driver;

module.exports = CordovaBle;
