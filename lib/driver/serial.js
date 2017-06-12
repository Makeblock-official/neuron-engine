/**
 * [Serial Driver implementation. ONLY works in NodeJS]
 */
var Driver = require('./driver');
var SerialPort = require("serialport").SerialPort;
var utils = require('../protocol/utils');
var checksum = require('./checksum');
var os=require('os');
var driver = new Driver();
var logger = require('../log/log4js').logger;
var BAUDRATE = 115200;
var serialName = '';

var serialPort = null;

function checkConnection(err) {
  logger.debug(err.message);
  if (err && (err.message.indexOf('not open') > 0)) {
    logger.warn('serial connection lost.');
    serialName = '';
    serialPort = null;
    initSerial();
  }
}

function initSerial() {
  if (serialName === '') {
    // find serial available serial port
    require("serialport").list(function(err, ports) {
      var hostname=os.hostname();
      if(hostname == 'makeblock_linkit'){
        //for linkit7688 by makeblock
        serialName = '/dev/ttyS1';
      }else{
        //for PC and raspberry pi
        ports.forEach(function(port) {
          var name = port.comName;
          var NAME = name.toUpperCase();
          if (NAME.indexOf('USB') > 0 || NAME.indexOf('AMA') > 0 || NAME.indexOf('ACM') > 0) {
            logger.debug('serial port found:', name);
            serialName = name;
            return;
          }
        });
      }

      if (serialPort === null && serialName !== '') {

        serialPort = new SerialPort(serialName, {
          baudrate: BAUDRATE
        });

        serialPort.on('open', function() {
          logger.warn('serial opened: ', serialName);
          if (driver._on_connectResult) {
            driver._on_connectResult({result: 'success', errMsg: ''});
          }

          if (serialPort && serialPort.isOpen() ) {
            serialPort.on('data', function(data) {
              logger.debug('serial data received: ' + data.length);
              // parse buffer data
              checksum.checksumRcvbuf(data,driver);

            });

            serialPort.on('error', function(err) {
              logger.warn('serial port error ' + err);
              if (driver._on_error) driver._on_error(err);
              checkConnection(err);
            });
          }
        });
      }
    });
  }

}

function Serial() {
  'use strict';

  var self = this;

  this._init = function() {
    initSerial();
  };

  /**
   * [_send sends array buffer to driver]
   * @param  {[ArrayBuffer]} buf [the buffer to send]
   * @return {[integer]}     [the actual byte length sent. -1 if send fails.]
   */
  this._send = function(buf) {
    logger.debug('try sending buffer: ', utils.hexBuf(buf));

    if (serialPort && serialPort.isOpen() ) {
      var tempBuf = new Buffer(buf.byteLength + 3);
      tempBuf = checksum.checksumSendbuf(buf);

      serialPort.write(tempBuf, function(err, results) {
        if (err) {
          logger.warn(err);
          if (driver._on_error) driver._on_error(err);
          checkConnection(err);
          return -1;
        }
        logger.debug('serial write buffer: ', tempBuf, results, err);
      });
      return buf.byteLength + 3;
    } else {
      initSerial();
      return -1;
    }
  };

  /**
   * [close interface]
   */
  this._close = function() {
    if (serialPort && serialPort.isOpen() ) {
      serialPort.close();
    }
    serialName = '';
    serialPort = null;
  };

}

Serial.prototype = driver;

module.exports = Serial;
