/**
 * driver for Websocket APP( js bridge)
 */

var Driver = require('./driver');
var checksum = require('./checksum');
var WebSocket = require('ws');
var config = require('../config/config');
var logger = require('../log/log4js').logger;
var avblock = require('../engine/logic/avblock');

var driver = new Driver();

var socketClient = null;
var isConnect = false;
var SOCKETOPEN = 1;
var connectFlag = false;
var checkInterval = null;

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

function checkConnect(){
  if (connectFlag === true){
    connectFlag = false;
  } else {
    logger.warn('disconnect, closeSocket');
    closeSocket();
    if (driver._on_disconnect) {
      driver._on_disconnect('websocket');
    } 
    avblock.resetAVState();
  }
}

function closeSocket(){
  if (isConnect) {
    socketClient.close();
    socketClient = null;
    isConnect = false;
    if (checkInterval){
      clearInterval(checkInterval);
      checkInterval = null;
    } 
  } 
}

function initSocket() {
  var _config = config.getConfig();
  var serverIP = _config.serverIP;
  var port = _config.websocketPort;
  var socketConf = "ws://" + serverIP + ":" + port + "/";

  socketClient = new WebSocket(socketConf);

  if(socketClient) {
    socketClient.onopen = function() {
     logger.debug("socketClient Opened");
     isConnect = true;
     connectFlag = true;
     if (driver._on_connectResult) {
       driver._on_connectResult({result: 'success', errMsg: ''});
     }
     checkConnect();
     checkInterval = setInterval(checkConnect, 6000);     
    };

    socketClient.onmessage = function (evt) {
      try {
        var message = evt.data;
        message = JSON.parse(message);
        if (message.type === 'block'){
          var data = string2buffer(message.data);
          checksum.checksumRcvbuf(data,driver);
        } else if (message.type === 'ping'){
          connectFlag = true; 
        } else if  (message.type === 'avblock'){
          avblock.processConnectState(message.device,message.state);
        }
      } catch(e) {
        logger.error('socketClient.onmessage error:' + e);
      }
    };

    socketClient.onclose = function() {
      logger.warn("socket closed");
      if (isConnect){
        if (driver._on_disconnect) {
          driver._on_disconnect('websocket');
        }    
        avblock.resetAVState();    
        isConnect = false;
        if (checkInterval){
          clearInterval(checkInterval);
          checkInterval = null;
        }
      }
    };  

    socketClient.onerror = function(err) {
     logger.warn("Error: " + err);
    };

  }
}

function Websocket() {
  'use strict';

  var self = this;

  this._init = function() {
    initSocket();
  };

  /**
   * [_send sends array buffer to driver]
   * @param  {[ArrayBuffer]} buf [the buffer to send]
   * @return {[integer]}     [the actual byte length sent. -1 if send fails.]
   */
  this._send = function(buf) {
    try {
      var tempBuf = new Buffer(buf.byteLength + 3);
      tempBuf = checksum.checksumSendbuf(buf);

      if (socketClient && (socketClient.readyState === SOCKETOPEN)) {
         return socketClient.send(buffer2string(tempBuf));
      } 
    } catch(e) {
      logger.error('Websocket._send error:' + e);
    }
    
  };

  /**
   * [close interface]
   */
  this._close = function() {
    closeSocket();
  };
}

Websocket.prototype = driver;

module.exports = Websocket;
