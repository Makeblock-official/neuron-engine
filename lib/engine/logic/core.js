/**
 * the core library for logic engine.
 */
var driver = require('../../driver');
var protocol = require('../../protocol');
var system = require('./system');
var block = require('./block');
var _ = require('underscore');
var logger = require('../../log/log4js').logger;
var config = require('../../config/config');
var event = require('../../event/event');
var process = require('./process');
var events = require('./events');
var async = require('async');
var when = require('when');
var utils = require('../../protocol/utils');

var OFFLINECOUNT = 6;
var isRunning = null;
var stopInterval = null;
var _driver = null;
var _activeBlocksCache = process.getBlocksCache();

/**
 * [_gcBlocksCache delete the inactive blocks in cache and reset the active flag]
 */
function _gcBlocksCache() {
  'use strict';

  logger.info('cache info: ', JSON.stringify(_activeBlocksCache));
  for (var no = 0; no < _activeBlocksCache.length; no++){
    if (_activeBlocksCache[no] && (_activeBlocksCache[no].online === true)){
      if (_activeBlocksCache[no].flag === false) {
        _activeBlocksCache[no].offlinecount++;
        if (_activeBlocksCache[no].offlinecount >= OFFLINECOUNT){
          _activeBlocksCache[no].online = false;
          event.emit(events.BLOCKLIST,getActiveBlocks());
          var name = _activeBlocksCache[no].name;
          var idx = getBlockIdx(name,no);
          var state = 'disconnected';
          var count = getSameTypeBlockCount(name);
          event.emit(events.BLOCKCONNECTION,{name: name, idx: idx, state: state});
          event.emit(events.BLOCKCONUT,{type: name, count: count});
        }
      } else {
        _activeBlocksCache[no].flag = false;
      }
    }
  }
}

/**
 * [setDriver sets driver]
 * @param {string} type [the type of driver.]
 */
function setDriver(type) {
  'use strict';
  try {
    if (_driver) {
      closeDriver();
    }

    _driver = driver.create(type);
    _driver.state = 'OPENING';

    _driver.on('data', function(buffer) {
      process.processBuffer(buffer);
    });

    _driver.on('error', function(err) {
      logger.warn(err);
    });

    if ((type === 'serial') || (type === 'websocket') || (type === 'cordovatcp')) {
      _driver.on('connectResult', function(result) {
        event.emit(events.DRIVERCONNECT,result);
        sendHeartbeatPkg();
        _driver.state = 'OPENED';
      });
    } else {
      sendHeartbeatPkg();
      _driver.state = 'OPENED';
    }

    _driver.on('disconnect', function(type) {
      event.emit(events.DRIVERDISCONNECT,type);
    });
  } catch(e) {
    logger.error('setDriver error:' + e);
  }

  return _driver;

}

/**
 * [getDriver return the current driver instance]
 * @return {Object}      [the driver instance if inited.]
 */
function getDriver() {
  'use strict';

  return _driver;
}

/**
 * [getDriverConnectResult return the current driver ConnectResult]
 * @return {integer}      [1: success; 0:fail]
 */
function getDriverConnectResult(){
  var count = 0;
  return when.promise(function(resolve) {
     async.whilst(
       function() { return (_driver.state != 'OPENED'); },
       function(callback) {
         if(count > 18) {
           callback('timeout');
         } else {
           count++;
           setTimeout(callback, 100);
         }
       },
       function (err, count) {
         if (err){
           logger.warn(err);
           if (_driver.state === 'OPENED'){
             return resolve(1);
           } else {
             return resolve(0);
           }
         } else{
           return resolve(1);
         }
       }
     );
  });
}

/**
 * [closeDriver close driver]
 */
function closeDriver() {
  'use strict';

  if (_driver) {
    _driver.close();
    _driver = null;
  }
}

/**
 * getBlockNo get a block's no.
 * @param {string} name   [the name of the block type]
 * @param {integer} idx   [optional, if set, will set status of the {idx}th block of specified type(idx begins from 1 and defaults to 1)]
 * @return {integer} no   [block no]
 */
function getBlockNo(name,idx){
  var count = 0;
  for (var no = 0; no < _activeBlocksCache.length; no++){
    if (_activeBlocksCache[no]){
      if (_activeBlocksCache[no].name == name){
        count++;
      }
      if (count == idx){
        if (_activeBlocksCache[no].online){
          return no;
        } else {
          logger.warn('block offline!' + name + idx);
          return -1;
        }
      }
    }
  }
  logger.warn('block not found!' + name + idx);
  return 0;
}

/**
 * getBlockNo get a block's idx.
 * @param {string} name   [the name of the block type]
 * @param {integer} no   [block no]
 * @return {integer} idx   [the {idx}th of th block]
 */
function getBlockIdx(name,no){
  var idx = 0;
  for (var i = 0; i < _activeBlocksCache.length; i++){
    if (_activeBlocksCache[i]){
      if (_activeBlocksCache[i].name == name){
        idx++;
      }
      if (i == no){
        return idx;
      }
    }
  }
  logger.warn('block not found!' + name + no);
  return 0;
}

/**
 * getSameTypeBlockCount get same type block's count.
 * @param {string} name   [the name of the block type]
 * @return {integer} count   [the count of the block]
 */
function getSameTypeBlockCount(name){
  'use strict';

  var blocks = getActiveBlocks();
  if (name in blocks){
    return blocks[name].length;
  } else {
    return 0;
  }
}

/**
 * getVoiceCommand.
 * @return {object} {command1: id1;command2: id2;......}
 */
function getVoiceCommand(){
  'use strict';
  var command = {'Turn on the light': 3, 'Turn Red': 4, 'Turn Blue': 5, 'Turn Green': 6,'Turn White':7,'More light':8,'Less light':9,'Lights off':10,'Motor Forward':11,'Motor Backward':12,'Speed Up':13,'Speed Down':14,'Love':15,'Smile':16,'Angry':17,'Sad':18,'Rock and roll':19,'Fire Fire':20,'Game start':21,'Winter is coming':22,'Start':23,'Shut down':24};
  return command;
}

/**
 * setBlockStatus sets a block's status.
 * @param {string} name   [the name of the block type]
 * @param {Array} status [the status to set]
 * @param {integer} idx    [optional, if set, will set status of the {idx}th block of specified type(idx begins from 1 and defaults to 1)]
 */
function setBlockStatus(name, status, idx) {
  'use strict';

  if (!idx){
    idx = idx | 1;
  }
  var opt = block.getBlockOption(name);
  if (!opt) {
    return logger.warn('unknown block name: ', name);
  }

  var ret = block.checkStatusParams(opt, status);
  if (ret < 0) {
    return logger.warn('Number-of-params not correct: ', name);
  }

  var pkg = block.createStatusPackage(name, status);

  //if idx was 255,means broadcast,send to all block of this type
  if (idx === 255){
    pkg.no = 255;
  } else {
    pkg.no = getBlockNo(name,idx);
    if (pkg.no <= 0) {
      return null;
    }
  }

  _activeBlocksCache[pkg.no].values = status;

  var buf = protocol.serialize(pkg);

  if (_driver) {
    _driver.send(buf);
  }
}


/**
 * send block command sends a command to block name.
 * @param {string} name   [the name of the block type]
 * @param {string} command   [the name of the block command]
 * @param {object} params [the params of the block command]
 * @param {integer} idx    [optional, if set, will set status of the {idx}th block of specified type(idx begins from 1 and defaults to 1)]
 */
function sendBlockCommand(name, command, params, idx) {
  'use strict';

  if (!idx){
    idx = idx | 1;
  }
  var opt = block.getBlockOption(name);
  if (!opt) {
    return logger.warn('unknown block name: ', name);
  }

  var ret = block.checkCommandParams(opt, command, params);
  if (ret < 0) {
    return logger.warn('Number-of-params not correct: ', name);
  }

  var pkg = block.createCommandPackage(name, command, params);

  //if idx was 255,means broadcast,send to all block of this type
  if (idx === 255){
    pkg.no = 255;
  } else {
    pkg.no = getBlockNo(name,idx);
    if (pkg.no <= 0) {
      return null;
    }
  }

  var buf = protocol.serialize(pkg);

  if (_driver) {
    _driver.send(buf);
  }
}


/**
   * send get block version command to block name.
   * @param {string} name   [the name of the block type]
   * @param {integer} idx    [optional, if set, will get block version of the {idx}th block of specified type(idx begins from 1 and defaults to 1)]
*/
function getBlockVersion(name, idx) {
  'use strict';
  if (!idx){
    idx = idx | 1;
  }

  if(idx === 255) {
    return null;
  }

  var pkg = system.DOWN.GETVERSION;
  pkg.no = getBlockNo(name, idx);
  if (pkg.no <= 0) {
    return null;
  }

  var buf = protocol.serialize(pkg);
  if (_driver) {
    _driver.send(buf);
  }
}

function getTypeAndSubtypeByName(name) {
    'use strict';
    var typeObj = {type:-1, subtype:-1};
    var opt = block.getBlockOption(name);
    if (opt) {
      typeObj.type = opt.type;
      typeObj.subtype = opt.subtype;
    } else {
      logger.warn('[getTypeAndSubtypeByName]unknown block name: ', name);
    }
    return typeObj;
}

/**
 *
 * @param {string} name   [the name of the block type]
 * @param {string} command   [the name of the block command]
 * @param {object} params [the params of the block command]
 * @param {integer} idx    [optional, if set, will set status of the {idx}th block of specified type(idx begins from 1 and defaults to 1)]
 */
function setBlockCommonCommand(name, command, params, idx) {
  'use strict';

  if (!idx){
    idx = idx | 1;
  }
  var opt = block.getBlockOption(name);
  if (!opt) {
    return logger.warn('unknown block name: ', name);
  }

  var pkg;
  switch (command) {
    case 'RESET':
      pkg = system.DOWN.RESET;
      break;
    case 'BAUDRATE':
      pkg = system.DOWN.BAUDRATE;
      break;
    case 'FEEDBACKENABLE':
      pkg = system.DOWN.FEEDBACKENABLE;
      break;
    case 'HANDSHAKE':
      pkg = system.DOWN.HANDSHAKE;
      break;
    case 'RGB':
      pkg = system.DOWN.RGB;
      break;
    default:
      return logger.warn('unknown command');
  }
  if (pkg.hasOwnProperty('data')) {
    if (pkg.data.length != params.length){
        logger.warn('the needed Number-of-params is: ', pkg.data.length);
        logger.warn('but your Number-of-params is: ', params.length);
        return -1;
    }
    for (var j = 0; j < pkg.data.length; j++) {
      var type = _.keys(pkg.data[j])[0];
      pkg.data[j][type] = params[j];
    }
  }

  //if idx was 255,means broadcast,send to all block of this type
  if (idx === 255){
    pkg.no = 255;
  } else {
    pkg.no = getBlockNo(name,idx);
    if (pkg.no <= 0) {
      return null;
    }
  }

  var buf = protocol.serialize(pkg);
  if (_driver) {
    _driver.send(buf);
  }
}

/**
 * updateBlockStatus update a Block's status to app.
 * @param {string} name   [the name of the block type]
 * @param {integer} idx    [optional, if set, will set status of the {idx}th block of specified type(idx begins from 1 and defaults to 1)]
 */
function updateBlockStatus(name, idx) {
  'use strict';
  if (!idx){
    idx = idx | 1;
  }
  var no = getBlockNo(name,idx);
  if (no <= 0){
    return null;
  } else {
    var values = _activeBlocksCache[no].values;
    event.emit(events.BLOCKSTATUS,name, idx, values);
  }
}

/**
 * updateAllBlockStatus update all Block's status to app.
 */
function updateAllBlockStatus() {
  'use strict';

  var name;
  var idx;
  var values;
  for (var no = 0; no < _activeBlocksCache.length; no++){
    if (_activeBlocksCache[no] && (_activeBlocksCache[no].online)){
      name = _activeBlocksCache[no].name;
      idx = getBlockIdx(name,no);
      values = _activeBlocksCache[no].values;
      event.emit(events.BLOCKSTATUS,name, idx, values);
    }
  }
}

/**
 * getBlockStatus queries a block's status.
 * @param  {string}   name     [the name of the block type]
 * @param  {integer}   idx      [optional, if set, will get status of the {idx}th block of specified name(idx begins from 1 and defaults 1)]
 * @return {Promise}            [the status]
 */
function getBlockStatus(name, idx) {
  'use strict';

  if (!idx){
    idx = idx | 1;
  }
  var opt = block.getBlockOption(name);
  if (!opt) {
    logger.warn('unknown block name: ', name);
    return null;
  }

  var no = getBlockNo(name,idx);
  if (no <= 0) {
    return null;
  }

  return _activeBlocksCache[no].values;
}

/**
 * getBlockSubStatus queries a block's substatus.
 * @param  {string}   name     [the name of the block type]
 * @param  {string}   subname  [the name of the block substate]
 * @param  {integer}   idx     [optional, if set, will get status of the {idx}th block of specified name(idx begins from 1 and defaults 1)]
 * @return {Promise}           [the substatus]
 */
function getBlockSubStatus(name, subname, idx) {
  'use strict';

  if (!idx){
    idx = idx | 1;
  }
  var opt = block.getBlockOption(name);
  if (!opt) {
    logger.warn('unknown block name: ', name);
    return null;
  }

  var withSubStatus = block.checkSubStatus(opt);
  if (withSubStatus) {
    var no = getBlockNo(name,idx);
    if (no <= 0) {
      return null;
    }
    if (subname in _activeBlocksCache[no].values) {
      return _activeBlocksCache[no].values[subname];
    }
  }
  return null;
}

/**
 * [getActiveBlocks get all active blocks and their values]
 * @return {object} [blocks oject]
 */
function getActiveBlocks() {
  'use strict';
  var blocks = {};
  var name;
  for (var no = 0; no < _activeBlocksCache.length; no++){
    if (_activeBlocksCache[no] && (_activeBlocksCache[no].online)){
      name = _activeBlocksCache[no].name;
      if (!blocks.hasOwnProperty(name)) {
        blocks[name] = [];
      }
      blocks[name].push(_activeBlocksCache[no].values);
    }
  }
  return blocks;
}

/** send block number arraging request every one second. */
function _doInterval() {
  _gcBlocksCache();

  if (_driver) {
    var pkg = system.DOWN.ARANGE;
    _driver.send(protocol.serialize(pkg));
  }
}

/**
 * start interface
 */
function start() {
  if (_driver) {
    logger.warn('driver already set');
    sendHeartbeatPkg();
  } else
  {
    var conf = config.getConfig();
    setDriver(conf.driver);
  }
}

/**
 * stop interface
 */
function stop() {
  if (_driver && (_driver.state === 'OPENED')){
    stopHeartbeatPkg();
    closeDriver();
    if (stopInterval){
      clearInterval(stopInterval);
      stopInterval = null;
    }
  } else if (_driver && (_driver.state === 'OPENING')){
    if (!stopInterval){
      stopInterval = setInterval(stop, 500);
    }
  }
}

/**
 * send HeartbeatPkg interface
 */
function sendHeartbeatPkg(){
  if (isRunning){
    logger.warn('HeartbeatPkg already running');
  } else {
    isRunning = setInterval(_doInterval, 500);
  }
}

/**
 * stop HeartbeatPkg interface
 */
function stopHeartbeatPkg(){
  if (isRunning){
    clearInterval(isRunning);
    isRunning = null;
  }
}

exports.setDriver = setDriver;
exports.closeDriver = closeDriver;
exports.getDriver = getDriver;
exports.getDriverConnectResult = getDriverConnectResult;
exports.setBlockStatus = setBlockStatus;
exports.updateBlockStatus = updateBlockStatus;
exports.updateAllBlockStatus = updateAllBlockStatus;
exports.getSameTypeBlockCount = getSameTypeBlockCount;
exports.getBlockStatus = getBlockStatus;
exports.getBlockSubStatus = getBlockSubStatus;
exports.sendBlockCommand = sendBlockCommand;
exports.getBlockVersion = getBlockVersion;
exports.getTypeAndSubtypeByName = getTypeAndSubtypeByName;
exports.setBlockCommonCommand = setBlockCommonCommand;
exports.getActiveBlocks = getActiveBlocks;
exports.getBlockIdx = getBlockIdx;
exports.getBlockNo = getBlockNo;
exports.getVoiceCommand = getVoiceCommand;

exports.start = start;
exports.stop = stop;
exports.sendHeartbeatPkg = sendHeartbeatPkg;
exports.stopHeartbeatPkg = stopHeartbeatPkg;
