var protocol = require('../../protocol');
var utils = require('../../protocol/utils');
var system = require('./system');
var block = require('./block');
var core = require('./core');
var logger = require('../../log/log4js').logger;
var event = require('../../event/event');
var events = require('./events');
var update = require('./update');
var blockversion = require('./blockversion');

var _activeBlocksCache = [];

/**
 * [_processArrange process number arrange answer from block]
 * @param  {object} pkg [the arrange answer package]
 */
function _processArrange(pkg) {
    'use strict';

    var type = pkg.data[0].BYTE;
    var subtype = null;
    if (pkg.data.length > 1) {
      subtype = pkg.data[1].BYTE;
    }

    var opt = block.getBlockOption(type, subtype);

    if (opt === null) {
      logger.warn('block type not registered, pkg:', pkg);
      return;
    }

    if ((pkg.no in _activeBlocksCache) && (opt.name == _activeBlocksCache[pkg.no].name) && (_activeBlocksCache[pkg.no].online)) {
      _activeBlocksCache[pkg.no].flag = true;
      _activeBlocksCache[pkg.no].offlinecount = 0;   
    } else {
      var idx,count;
      // replace by another block,report to app
      if ((pkg.no in _activeBlocksCache) && (opt.name != _activeBlocksCache[pkg.no].name) && (_activeBlocksCache[pkg.no].online)) {
      _activeBlocksCache[pkg.no].online = false;
        var name = _activeBlocksCache[pkg.no].name;
        idx = core.getBlockIdx(name,pkg.no);
        count = core.getSameTypeBlockCount(name);
        event.emit(events.BLOCKCONNECTION,{name: name, idx: idx, state: 'disconnected'});
        event.emit(events.BLOCKCONUT,{type: name, count: count});
      }
      // create cache
      var cache = {};
      cache.name = opt.name;
      cache.flag = true;
      cache.offlinecount = 0;
      cache.online = true;
      cache.values = block.createBlockValues(opt.name);
      _activeBlocksCache[pkg.no] = cache;
      event.emit(events.BLOCKLIST,core.getActiveBlocks());
      idx = core.getBlockIdx(cache.name,pkg.no);
      var state = 'connected';
      event.emit(events.BLOCKCONNECTION,{name: cache.name, idx: idx, state: state});
      count = core.getSameTypeBlockCount(cache.name);
      event.emit(events.BLOCKCONUT,{type: cache.name, count: count});    
    }
}

/**
 * [_processBlockVersion process block version answer from block]
 * @param  {object} pkg [the block version answer package]
 */
function _processBlockVersion(pkg) {
  'use strict';
  if ((pkg.no in _activeBlocksCache) && pkg.data.length >= 3) {
    var name = _activeBlocksCache[pkg.no].name;
    var idx = core.getBlockIdx(name, pkg.no);
    var version = pkg.data[2].SHORT;
    var opt = block.getBlockOption(name);
    if (opt === null) {
      logger.warn('block type not registered, block name:', name);
      return;
    }
    var latestVersion = blockversion.getBlockLatestVersion(name);
    var update = false;
    if(latestVersion != -1 && latestVersion > version) {
      update = true;
    }
    event.emit(events.BLOCKVERSION,{name: name, idx: idx, update: update});
  } else {
    logger.warn('[_processBlockVersion]cannot find pkg in _activeBlocksCache pkg.no:', pkg.no);
  }
}

/**
 * [_processErrorcode process errorcode from block]
 * @param  {object} pkg [the errorcode package]
 */
function _processErrorcode(pkg) {
  'use strict';

  var errorCode = pkg.data[0].BYTE;
  switch (errorCode) {
    case 0x0f:
      logger.debug('data pkg correct');
      break;
    case 0x10:
      logger.warn('system busy, block no:' + pkg.no);
      break;
    case 0x11:
      logger.warn('data pkg block type error, block no:' + pkg.no);
      break;
    case 0x12:
      logger.warn('data pkg checksum error, block no:' + pkg.no);
      break;
  }
}

/**
 * [_processHandShake process handshake from block]
 * @param  {object} pkg [the handshake package]
 */
function _processHandShake(pkg) {
  'use strict';

  if ((_activeBlocksCache[pkg.no]) && (_activeBlocksCache[pkg.no].online)){
    var name = _activeBlocksCache[pkg.no].name; 
    var idx = 0;
    for (var i = 1; i <= pkg.no; i++){
      if (name == _activeBlocksCache[i].name){
        idx++;
      }  
    }
    event.emit(events.HANDSHAKE,name,idx);
    return;    
  }
}

function _processStatus(name, pkg) {
  'use strict';

  //  logger.warn(JSON.stringify(pkg.data));

  var values = block.createBlockValues(name, pkg.data);
  var withSubStatus = !(values instanceof Array);

  var j;
  if ((_activeBlocksCache[pkg.no]) && (name == _activeBlocksCache[pkg.no].name)){
    var idx = 0;
    for (var i = 1; i <= pkg.no; i++){
      if (name == _activeBlocksCache[i].name){
        idx++;
      }  
    }
    
    if (withSubStatus) {
      for (var subname in values) {
        if (subname in _activeBlocksCache[pkg.no].values) {
          for (j = 0; j < values[subname].length; j++) {
            if (_activeBlocksCache[pkg.no].values[subname][j] != values[subname][j]) {
              _activeBlocksCache[pkg.no].values[subname] = values[subname];
              break;
            }
          }
        }
      }
    } else {
      for (j = 0; j < values.length; j++) {
        if (_activeBlocksCache[pkg.no].values[j] != values[j]) {
          _activeBlocksCache[pkg.no].values = values;
          break;
        }
      }
    }
    event.emit(events.BLOCKSTATUS,name, idx, values);
  }  
}

/**
 * [processBuffer processes buffers receiving from the driver]
 * @param  {ArrayBuffer} buffer [the buffer]
 */
 function processBuffer(buffer) {
  'use strict';
  try {
    var bufIdx = 1;
    var view = new Uint8Array(buffer);
    var type = view[bufIdx++];
    var pkg = null;

    if (type >= 0x00 && type <= 0x0f) {
      // reserved
    } else if (type >= 0x10 && type <= 0x20) {
      // system package
      if (type in system.UP) {

        switch (type) {
          case 0x10:
          var blocktype = view[bufIdx++];
          if (blocktype >= 0x61 && blocktype <= 0x7f) {
            pkg = protocol.parse(buffer, system.UP[type].withSubtype);
          } else {
            pkg = protocol.parse(buffer, system.UP[type].withoutSubtype);
          }
          if(blocktype !== 0) {
            _processArrange(pkg);
          } else {
            update.handleBootloadBlock(pkg);
          }
          break;
          case 0x12:
          pkg = protocol.parse(buffer, system.UP[type]);
          _processBlockVersion(pkg);
          break;
          case 0x20:
          pkg = protocol.parse(buffer, system.UP[type]);
          _processHandShake(pkg);
          break;
          case 0x15:
          pkg = protocol.parse(buffer, system.UP[type]);
          _processErrorcode(pkg);
          break;
          default:
          break;
        }
      } else {
        logger.warn('system package type not supported: ', type);
      }
    } else if(type == 0x61) {
      var subtype = view[bufIdx];
      logger.warn('type:0x61 subtype:' + subtype);
      switch(subtype) {
        case 0x06:
          pkg = protocol.parse(buffer, system.UPDATE[subtype]);
          update.handleHardwareID(pkg);
          break;
        case 0x07:
          pkg = protocol.parse(buffer, system.UPDATE[subtype]);
          update.handleUpdateFirmwareFileRes(pkg);
          break;
        case 0x08:
          pkg = protocol.parse(buffer, system.UPDATE[subtype]);
          logger.warn('pkg:' + JSON.stringify(pkg));
          update.handleQueryFirmwareFileRes(pkg);
          break;
        default:
          break;
      }
    } else if (type >= 0x21 && type <= 0x7f) {
      // block data
      var subtype = null;
      if (type >= 0x61) {
        subtype = view[bufIdx++];
      }
      var opt = null;
      opt = block.getBlockOption(type, subtype);
      if (opt) {
        var withSubStatus = block.checkSubStatus(opt);
        if (withSubStatus) {
          pkg = block.createSubStatusPackage(opt.name, view[bufIdx++]);
        } else {
          pkg = block.createStatusPackage(opt.name);
        }

        pkg = protocol.parse(buffer, pkg);
        _processStatus(opt.name, pkg);
      }
    } else {
      // invalid
      logger.warn('invalid package type: ', type);
    }
  } catch(e) {
    logger.warn('_process error: ' + e + ' buffer: ' + utils.hexBuf(buffer));
  }
}

function getBlocksCache() {
  'use strict';
   return _activeBlocksCache;
}

exports.processBuffer = processBuffer;
exports.getBlocksCache = getBlocksCache;
