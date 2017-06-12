var logger = require('../../log/log4js').logger;
var event = require('../../event/event');
var events = require('./events');
var core = require('./core');
var node = require('./node');

var _logicEngine = null;
var _soundState = 'disconnected';
var _cameraState = 'disconnected';

var _nodeTypes = node.getNodeTypes();
var _activeNodeCache = node.getActiveNodeCache();

/**
 * setlogicEngine set logicEngine and it's event.
 * @param {object}  [the logicEngine instance]
 */
function setlogicEngine(engine) {
  _logicEngine = engine;
  event.on("blockStatusChanges", blockStatusChanges);
  event.on("blockListChanges", blockListChanges);
  event.on("blockConnectionStatusChanges", blockConnectionStatusChanges);
  event.on("sameTypeBlockCountChanges", sameTypeBlockCountChanges);
  event.on("blockVersionResult", blockVersionResult);
  event.on("setFirmWareByTypeAndSubtype", setFirmWareByTypeAndSubtype);
  event.on("blockUpdateResult", blockUpdateResult);
  event.on("avblockChanges", avblockChanges);
  event.on("resetavstate", resetavblockState);
  event.on('initiativeDisconnect', initiativeDisconnect);
  event.on('disconnBLockReconnect', disconnBLockReconnect);
}

/**
 * [getActiveElectronicBlocks get all active ElectronicBlocks and their values]
 * @return {object} [blocks oject]
 */
function getActiveElectronicBlocks() {
   return _logicEngine.getActiveBlocks();
}

/**
 * [getElectronicNodeIdx] get ElectronicNode Idx
 * @param {string} the id of the ElectronicNode
 * @return {integer} idx the ElectronicBlock idx
 */
function getElectronicNodeIdx(id){
  if (_activeNodeCache[id]){
    if (_activeNodeCache[id].idx){
      return _activeNodeCache[id].idx;
    }
  }
  return null;
}

/**
 * [getElectronicNodeId] get ElectronicNode Id
 * @param {string} the type of the ElectronicBlock
 * @param {integer} idx the ElectronicBlock idx
 * @return {string} the id of the ElectronicNode
 */
function getElectronicNodeId(type, idx){
  for (var id in _activeNodeCache){
    if (_activeNodeCache[id].idx){
      if ((type == _activeNodeCache[id].type) && (idx == _activeNodeCache[id].idx)){
        return id;
      } 
    }
  }
  return null;
}

/**
 * [getavblockState]
 * @return {object} {sound: state, camera: state}
*/
function getavblockState(){
  return {sound: _soundState, camera: _cameraState};
} 

/**
 * [resetavblockState]
*/
function resetavblockState(){
  var categoryChange = {};
  if (_soundState === 'connected'){
    categoryChange.category = 'sound';
    _soundState = 'disconnected';
    categoryChange.state = 'disconnected';
    event.emit(events.CATEGORYCHANGE,categoryChange);
  }
  if (_cameraState === 'connected'){
    categoryChange.category = 'camera';
    _cameraState = 'disconnected';
    categoryChange.state = 'disconnected';
    event.emit(events.CATEGORYCHANGE,categoryChange);
  }  
} 

/**
 * [avblockChanges] the callback function when receiving avblock conect state report
 * @param {object} {device:  '', state: ''}
 */
function avblockChanges(block){
  var categoryChange = {};
  if (block.device === 'audio'){
    categoryChange.category = 'sound';
    if (_soundState !== block.state){
      _soundState = block.state;
      categoryChange.state = block.state;    
      logger.warn('categoryChange: ', JSON.stringify(categoryChange));
      event.emit(events.CATEGORYCHANGE,categoryChange);
    }
  } else if (block.device === 'video'){
    categoryChange.category = 'camera';
     if (_cameraState !== block.state){
      _cameraState = block.state;
      categoryChange.state = block.state;    
      logger.warn('categoryChange: ', JSON.stringify(categoryChange));
      event.emit(events.CATEGORYCHANGE,categoryChange);
    }   
  }
}

/**
 * [blockListChanges] the callback function when receiving a ElectronicBlock list report
 * @param {object} [blocks oject]
 */
function blockListChanges(blocks) {
  var i;
  var idx;
  var id;
  for (var name in blocks) {
    if ((name === 'SMARTSERVO') && (blocks[name].length >1)){
       logger.warn('SMARTSERVO node had already  add');
    } else {
      if (name in _nodeTypes) {
        for (i = 0; i < blocks[name].length; i++) {
          idx = i+1;
          id = getElectronicNodeId(name, idx);
          if (!id){
            id = name + '@' + idx;
            core.addNode(name,id,idx);
          } else {
            if (_activeNodeCache[id].initNode){
                 _activeNodeCache[id].initNode();
            }
          }
        }
      } else {
        logger.warn('block not register to node: ', name);
      }
    }
  }
  onNodeListChanged(); 
}

/**
 * [blockListChanges] the callback function when receiving a ElectronicBlock status report
 * @param {string}  name   [the name of the block type]
 * @param {integer} idx   [the idx of the block]
 * @param {object}   value eg: {state: []}
 */
function blockStatusChanges(type, idx, value) {
  //logger.warn('blockStatusChanges: ' + type + ' ' + idx + ' ' + JSON.stringify(value));
  
  var id = getElectronicNodeId(type, idx);
  if (id){
    if (_activeNodeCache[id].processStatus){
      _activeNodeCache[id].processStatus(value);
    } else {
      for (var port in value){
        if (port in _activeNodeCache[id].outValues){
          var newvalue = value[port][0]!==null?value[port][0]:0;
          _activeNodeCache[id].out(port,newvalue);
        }
      }
    }
  }
}

/**
 * [blockConnectionStatusChanges] the callback function when receiving a ElectronicBlock connection status report
 * @param {object}  status   [the connection status of the block type]
 */
function blockConnectionStatusChanges(status) {
  var type = status.name;
  var idx = status.idx;
  var state = status.state; 
  var id = getElectronicNodeId(type, idx);
  event.emit(events.NODECONNECTION,{id: id, state: state});
  if (state === 'connected'){
    _activeNodeCache[id].run();
  }
}

/**
 * [sameTypeBlockCountChanges] the callback function when receiving a same type block count report
 * @param {object}  blockCount   {type: '', count: ''}
 */
function sameTypeBlockCountChanges(blockCount) {
  event.emit(events.NODECOUNT,blockCount);
}

/**
 * [blockVersionResult] the callback function when receiving a block version report
 * @param {object}  versionRet   [the block version result of the block type]
 */
function blockVersionResult(versionRet) {
  var name = versionRet.name;
  var idx = versionRet.idx;
  var id = getElectronicNodeId(name, idx);
  event.emit(events.NODEVERSION, {id: id, update: versionRet.update});
}

function initiativeDisconnect() {
  event.emit(events.NODEINITIATIVEDISCONNECT);
}

function disconnBLockReconnect() {
  event.emit(events.NODEDISCONNRECONNECT);
}

function blockUpdateResult(updateRet) {
  event.emit(events.NODEUPDATERESULT, {result: updateRet.result});
}

function setFirmWareByTypeAndSubtype(typeObj) {
  event.emit(events.NODESETFIRMWARE, {type: typeObj.type, subtype: typeObj.subtype});
}

function getBlockVersionById(id) {
  if (_activeNodeCache[id] && _activeNodeCache[id].getBlockVersion) {
    _activeNodeCache[id].getBlockVersion();
  }
}

function getTypeAndSubtypeById(id) {
  if (_activeNodeCache[id]) {
    return _logicEngine.getTypeAndSubtypeByName(_activeNodeCache[id].type);
  }
}

function updateBlockISP(id, type, subtype, firmwarebuf) {
  logger.warn('[updateBlockISP] ', _activeNodeCache);
  if (_activeNodeCache[id] && _activeNodeCache[id].updateNeuronBlock) {
    _logicEngine.setBlockFirmware(type, subtype, firmwarebuf);
    _activeNodeCache[id].updateNeuronBlock();
  }
}

function setNeuronFirmware(type, subtype, firmwarebuf) {
  _logicEngine.setBlockFirmware(type, subtype, firmwarebuf);
}

/**
 * updateElectronicBlockCount update a ElectronicBlock's count to app.
 * @param {string}  name   [the name of the block type]
 */
function updateElectronicBlockCount(name) {
  var blocks = getActiveElectronicBlocks();
  if (name in blocks) {
    event.emit(events.NODECOUNT,{type: name, count: blocks[name].length}); 
  }
}

/**
 * updateElectronicBlockConnectionStatus update a ElectronicBlock's connection status to app.
 * @param {string} the id of the Node
 */
function updateElectronicBlockConnectionStatus(id) {
  var nodes = getActiveElectronicNodes();
  var isConnect;
  var state;
  if (_activeNodeCache[id]){
    if (_activeNodeCache[id].idx){
      isConnect = false;
      for (var i = 0; i < nodes.length; i++){
        if (id === nodes[i].id){
          isConnect = true;
          break;
        }
      }
      if (isConnect) {
        state = 'connected';
      } else{
        state = 'disconnected';
      }
      event.emit(events.NODECONNECTION,{id: id, state: state});
    }
  }
}

/**
 * updateBlockStatus update a Block's status to app.
 * @param {string} name   [the name of the block type]
 * @param {integer} idx    [optional, if set, will set status of the {idx}th block of specified type(idx begins from 1 and defaults to 1)]
 */
function updateBlockStatus(name, idx) {
  _logicEngine.updateBlockStatus(name, idx);
}

/**
 * updateAllElectronicBlockStatus update all ElectronicBlock's status to app.
 */
function updateAllElectronicBlockStatus() {
  _logicEngine.updateAllBlockStatus();
}

/**
 * [getActiveElectronicNodes get all active electronic nodes]
 * @return {Array} [{id: '11', type: 'SomeType'}, {id: '12', type: 'AnotherType'}]
 */
function getActiveElectronicNodes() {
  'use strict';
  var nodes = [];
  var id;
  var idx;

  var blocks = getActiveElectronicBlocks();
  for (var name in blocks) {
    for (var i = 0; i < blocks[name].length; i++) {
      idx = i + 1;
      id = getElectronicNodeId(name, idx);
      if (id){
        nodes.push({id: id, type: name});
      }
    }
  }
  return nodes;
}

/**
 * [onNodeListChanged report NodeListChange if the callback function was set,]
 * nodes: [{id: '11', type: 'SomeType'}, {id: '12', type: 'AnotherType'}]
 */
function onNodeListChanged() {
  'use strict';
  var nodes = getActiveElectronicNodes();
  event.emit(events.NODELIST,nodes);
  _logicEngine.resetFirmwareUpdateState(nodes.length);
}

/**
 * setBlockStatus sets a block's status.
 * @param {string} name   [the name of the block type]
 * @param {Array} value [the status to set]
 * @param {integer} idx    [optional, if set, will set status of the {idx}th block of specified type(idx begins from 1 and defaults to 1)]
 */
function setBlockStatus(name, value, idx) {
  _logicEngine.setBlockStatus(name, value, idx);
}

/**
 * send block command sends a command to block name.
 * @param {string} name   [the name of the block type]
 * @param {string} command   [the name of the block command]
 * @param {object} params [the params of the block command]
 * @param {integer} idx    [optional, if set, will set status of the {idx}th block of specified type(idx begins from 1 and defaults to 1)]
 */
function sendBlockCommand(name, command, params, idx) {
  _logicEngine.sendBlockCommand(name, command, params, idx);
}

/**
 * getBlockVersion get a block's version.
 * @param {string} name   [the name of the block type]
 * @param {integer} idx    [optional, if set, will get block version of the {idx}th block of specified type(idx begins from 1 and defaults to 1)]
 */
function getBlockVersion(name, idx) {
  _logicEngine.getBlockVersion(name, idx);
}

function updateBlockFirmware(name, idx) {
  _logicEngine.updateBlockFirmware(name, idx);
}

function setUpdatingFalse() {
  _logicEngine.setUpdatingFalse();
}

/**
 * [setDriver sets driver]
 * @param {string} type [the type of driver.]
 */
function setDriver(type) {
  return _logicEngine.setDriver(type);
}

/**
 * [getDriverConnectResult return the current driver ConnectResult]
 * @return {integer}      [1: success; 0:fail]
 */
function getDriverConnectResult(){
  return _logicEngine.getDriverConnectResult();
}

/**
 * [closeDriver close driver]
 */
function closeDriver() {
  _logicEngine.closeDriver();
  resetavblockState();
}

/**
 * start interface
 */
function start() {
  _logicEngine.start();
  event.on("blockStatusChanges", blockStatusChanges);
  event.on("blockListChanges", blockListChanges);
  event.on("blockConnectionStatusChanges", blockConnectionStatusChanges);
  event.on("sameTypeBlockCountChanges", sameTypeBlockCountChanges);
  event.on("blockVersionResult", blockVersionResult);
  event.on("setFirmWareByTypeAndSubtype", setFirmWareByTypeAndSubtype);
  event.on("blockUpdateResult", blockUpdateResult);
  event.on("avblockChanges", avblockChanges);
  event.on("resetavstate", resetavblockState);  
  event.on('initiativeDisconnect', initiativeDisconnect);
  event.on('disconnBLockReconnect', disconnBLockReconnect);
}

/**
 * stop interface
 */
function stop() {
  event.removeListener("blockStatusChanges", blockStatusChanges);
  event.removeListener("blockListChanges", blockListChanges);
  event.removeListener("blockConnectionStatusChanges", blockConnectionStatusChanges);
  event.removeListener("sameTypeBlockCountChanges", sameTypeBlockCountChanges);
  event.removeListener("blockVersionResult", blockVersionResult);
  event.removeListener("setFirmWareByTypeAndSubtype", setFirmWareByTypeAndSubtype);
  event.removeListener("blockUpdateResult", blockUpdateResult);
  event.removeListener("avblockChanges", avblockChanges);
  event.removeListener("resetavstate", resetavblockState);
  event.removeListener('initiativeDisconnect', initiativeDisconnect);
  event.removeListener('disconnBLockReconnect', disconnBLockReconnect);
  _logicEngine.stop(); 
}

function sendHeartbeatPkg(){
  _logicEngine.sendHeartbeatPkg();
}

function stopHeartbeatPkg(){
  _logicEngine.stopHeartbeatPkg();
}

exports.setlogicEngine = setlogicEngine;
exports.setBlockStatus = setBlockStatus;
exports.sendBlockCommand = sendBlockCommand;
exports.getBlockVersion = getBlockVersion;
exports.setUpdatingFalse = setUpdatingFalse;
exports.getTypeAndSubtypeById = getTypeAndSubtypeById;
exports.getBlockVersionById = getBlockVersionById;
exports.updateBlockISP = updateBlockISP;
exports.setNeuronFirmware = setNeuronFirmware;
exports.updateBlockFirmware = updateBlockFirmware;
exports.updateBlockStatus = updateBlockStatus;
exports.updateElectronicBlockCount = updateElectronicBlockCount;
exports.updateElectronicBlockConnectionStatus = updateElectronicBlockConnectionStatus;
exports.updateAllElectronicBlockStatus = updateAllElectronicBlockStatus;
exports.getElectronicNodeIdx = getElectronicNodeIdx;
exports.getActiveElectronicNodes = getActiveElectronicNodes;
exports.getActiveElectronicBlocks = getActiveElectronicBlocks;
exports.getavblockState = getavblockState;
exports.resetavblockState = resetavblockState;
exports.setDriver = setDriver;
exports.getDriverConnectResult = getDriverConnectResult;
exports.closeDriver = closeDriver;
exports.start = start;
exports.stop = stop;
exports.sendHeartbeatPkg = sendHeartbeatPkg;
exports.stopHeartbeatPkg = stopHeartbeatPkg;
