/**
 * driver for tcp socket( with plugin cordova-plugin-chrome-apps-sockets-tcp )
 */

var Driver = require('./driver');
var checksum = require('./checksum');
var net = require('net');
var config = require('../config/config');
var logger = require('../log/log4js').logger;
var avblock = require('../engine/logic/avblock');
var SPtcp = require('./sptcp/sptcp').SPtcp;

var driver = new Driver();

var socketId = 0;
var isConnect = false;
var connectFlag = false;
var checkInterval = null;

var bufferToArrayBuffer = function(buffer) {
  var ab = new ArrayBuffer(buffer.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return ab;
};

var arrayBufferToBuffer = function (ab) {
    var buffer = new Buffer(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }
    return buffer;
  };

/**
 * [buffer2string converts array buffer to string format]
 * @param  {ArrayBuffer} buf [the input array buffer]
 * @return {String}     [the output string]
 */
function buffer2string(buf) {
  var buffer = new Uint8Array(buf);
  return Array.prototype.join.call(buffer, " ");
}

/**
 * [string2buffer converts string to array buffer format]
 * @param  {String} str [the input string]
 * @return {Uint8Array}     [the output uint8 array buffer]
 */
function string2buffer(str) {
  var buffer = new Uint8Array(str.split(" "));
  return buffer;
}

function checkConnect() {
  if (connectFlag === true) {
    connectFlag = false;
  } else {
    logger.warn('disconnect, closeSocket');
    closeSocket();
    if (driver._on_disconnect) {
      driver._on_disconnect('tcpsocket');
    }
    avblock.resetAVState();   
  }
}

function closeSocket() {
    chrome.sockets.tcp.close(socketId);
    socketId = 0;
    isConnect = false;
    if (checkInterval) {
      clearInterval(checkInterval);
      checkInterval = null;
    }
}

function initSocket() {
  var _config = config.getConfig();
  var serverIP = _config.serverIP;
  var port = _config.tcpsocketPort;
  var socketClient = {remoteAddress: serverIP + port};

  chrome.sockets.tcp.create({}, function (sockInfo) {
    var socket = sockInfo.socketId;
    chrome.sockets.tcp.connect(socket, serverIP, port, function () {
      logger.warn('CONNECTED TO: ' + serverIP + ':' + port);
      logger.warn("client connected");
      isConnect = true;
      connectFlag = true;
      if (driver._on_connectResult) {
        driver._on_connectResult({ result: 'success', errMsg: '' });
      }
      checkConnect();
      checkInterval = setInterval(checkConnect, 6000);
      socketId = socket;
      SPtcp.call(socketClient, socketClient);

      chrome.sockets.tcp.onReceive.addListener(function (info) {
        if (info.socketId == socketId && info.data) {
          socketClient.spReceiveData(arrayBufferToBuffer(info.data), function (message) {
            if (message.type === 'block') {
              var buffer = string2buffer(message.data);
              checksum.checksumRcvbuf(buffer, driver);
            } else if (message.type === 'ping') {
              connectFlag = true;
            } else if (message.type === 'avblock') {
              avblock.processConnectState(message.device, message.state);
            }
          });
        }
      });

      chrome.sockets.tcp.onReceiveError.addListener(function (info) {
        logger.warn('onReceiveError :' + JSON.stringify(info));
        if (isConnect) {
          if (driver._on_disconnect) {
            driver._on_disconnect('tcp');
          }
          chrome.sockets.tcp.close(socketId);
          avblock.resetAVState();   
          isConnect = false;
          socketId = 0;
          if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
          }
        }
      });      
    });
  });
}

function CordovaTcp() {
  'use strict';

  var self = this;

  this._init = function () {
    initSocket();
  };

  /**
   * [_send sends array buffer to driver]
   * @param  {[ArrayBuffer]} buf [the buffer to send]
   * @return {[integer]}     [the actual byte length sent. -1 if send fails.]
   */
  this._send = function (buf) {
    try {
      var tempBuf = new Buffer(buf.byteLength + 3);
      tempBuf = checksum.checksumSendbuf(buf);

      if (socketId) {
        chrome.sockets.tcp.send(socketId, bufferToArrayBuffer(tempBuf), function(){

        });
      }
    } catch (e) {
      logger.error('TcpSocket._send error:' + e);
    }

  };

  /**
   * [close interface]
   */
  this._close = function () {
    closeSocket();
  };
}

CordovaTcp.prototype = driver;

module.exports = CordovaTcp;
