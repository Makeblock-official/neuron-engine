/**
 * package driver implements a variety of communicate drivers, eg serial, bluetooth ...
 */
var Serial = require('./serial');
var Mock = require('./mock');
var MakeBlockHD = require('./makeblock_hd');
var CordovaBle = require('./cordova_ble');
var Electron = require('./electron');
var Websocket = require('./websocket');
var TcpSocket = require('./tcpsocket');
var CordovaTcp = require('./cordova_tcp');
var Transport = require('./transport');
var logger = require('../log/log4js').logger;
/**
 * [create the the driver factory method]
 * @param  {[string]} connection [the driver type, 'serial', 'bluetooth', 'mock', Object] ('mock is only used for test')
 * @return {[driver object]}      [the driver object]
 */
function create(connection) {
  'use strict';

  var driver = null;
  var type = connection;

  if(typeof connection == "object") {
    type = "transport";
  }

  switch (type) {
    case 'transport':
      driver = new Transport(connection);
      break;
    case 'mock':
      driver = new Mock();
      break;
    case 'serial':
      driver = new Serial();
      break;
    case 'makeblockhd':
      driver = new MakeBlockHD();
      break;
    case 'cordovable':
      driver = new CordovaBle();
      break;
    case 'electron':
      driver = new Electron();
      break;
    case 'websocket':
      driver = new Websocket();
      break;
     case 'tcpsocket':
      driver = new TcpSocket();
      break;
    case 'cordovatcp':
      driver = new CordovaTcp();
      break;
    default:
      logger.warn('unsupported driver: ', type);
      logger.warn('used mock driver');
      driver = new Mock();
      break;
  }
  if (driver._init) {
    driver._init();
  }

  return driver;
}

exports.create = create;
