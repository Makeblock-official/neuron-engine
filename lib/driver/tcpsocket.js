/**
 * driver for Websocket APP( js bridge)
 */

var Driver = require('./driver');
var checksum = require('./checksum');
var net = require('net');
var config = require('../config/config');
var logger = require('../log/log4js').logger;
var avblock = require('../engine/logic/avblock');
var SPtcp = require('./sptcp/sptcp').SPtcp; 

var driver = new Driver();

var socketClient = null;
var isConnect = false;
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
    socketClient.destroy();
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
  var port = _config.localTcpsocketPort;

  var client = new net.Socket(); 
  client.connect(port, serverIP, function() {
    logger.warn('CONNECTED TO: ' + serverIP + ':' + port);
     logger.warn("client connected"); 
     isConnect = true;
     connectFlag = true;
     if (driver._on_connectResult) {
       driver._on_connectResult({result: 'success', errMsg: ''});
     }
     checkConnect();
     checkInterval = setInterval(checkConnect, 6000); 
     socketClient = client;
     SPtcp.call(socketClient, socketClient);
  });

  client.on('data', function(data) {
        client.spReceiveData(data, function (message){
            if (message.type === 'block'){
              var buffer = string2buffer(message.data);
              checksum.checksumRcvbuf(buffer,driver);
            } else if (message.type === 'ping'){
              connectFlag = true; 
            } else if  (message.type === 'avblock'){
              avblock.processConnectState(message.device,message.state);
            }            
        });    
  });

  client.on('close', function() {
      logger.warn("socket closed");
      if (isConnect){
        client.destroy();
        client.spDestroy();  
        if (driver._on_disconnect) {
          driver._on_disconnect('tcp');
        }  
        avblock.resetAVState();         
        isConnect = false;
        if (checkInterval){
          clearInterval(checkInterval);
          checkInterval = null;
        }
      }
  });
}

function TcpSocket() {
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

      if (socketClient) {
         //socketClient.spSendData({data: tempBuf});
         return socketClient.write(tempBuf);
      } 
    } catch(e) {
      logger.error('TcpSocket._send error:' + e);
    }
    
  };

  /**
   * [close interface]
   */
  this._close = function() {
    closeSocket();
  };
}

TcpSocket.prototype = driver;

module.exports = TcpSocket;
