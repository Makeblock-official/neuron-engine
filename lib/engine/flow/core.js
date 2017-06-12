/**
 * the core library for flow engine.
 */

var _ = require('underscore');
var nodes = require('./nodes/index');
var logger = require('../../log/log4js').logger;
var config = require('../../config/config');
var event = require('../../event/event');
var events = require('./events');
var electronicblock = require('./electronicblock');
var node = require('./node');

var _nodeTypes = node.getNodeTypes();
var _activeNodeCache = node.getActiveNodeCache();
var _nodeCache = node.getnodeCache();
var algorithm = require('./nodes/algorithm');


/**
 * [addNode] add one node
 * @param {string} type  the type name of the node
 * @param {integer} id  [optional,if set, will set id for the node]
 * @param {integer} idx  [optional,for electronic nodes, if set, will set idx for the node]
 * @return {string} the id of the added node
 */
function addNode(type,id,idx) {
  if (type in _nodeTypes) {
    if (!id){
      var currentTime = new Date().getTime();
      var category = _nodeTypes[type].props.category;
      if (category === 'cloud'){
        var conf = config.getConfig();
        var uuid = conf.uuid;
        id = uuid + '@' + type + '@' + currentTime;
      } else{      
        id = type + '@' + currentTime;
      }
    }
    _activeNodeCache[id] = nodes.create(type,_nodeTypes[type]);
    _activeNodeCache[id].id = id;
    _activeNodeCache[id].type = type;
    if (idx){
      _activeNodeCache[id].idx = idx;
    }
    logger.warn('addnode,type: ' + type + ' id: ' + id);
    return id;  
  } else {
    logger.warn('node not register: ', type);
    return -1;
  }
}

/**
 * [removeNode] remove one node
 * @param {string} the id of the added node
 */
function removeNode(id) {
  console.warn('removeNode: ' + id);
  if (id in _activeNodeCache) {
    //disconnect all connection
    disconnectAll(id);

    if (_activeNodeCache[id].stop){
      var cmd = 'clear';
      _activeNodeCache[id].stop(cmd);  
    }  

    delete _activeNodeCache[id];           
  }       
}

/**
 * [initNode] init node
 * @param {string} the id of the node
 */
function initNode(id) {
  if (id in _activeNodeCache) {
    if (_activeNodeCache[id].initNode) {
      _activeNodeCache[id].initNode();
    }
  }
}

/**
 * [connect] connect to a targetPort
 * @param  {string} sourceNodeId 
 * @param  {string} sourcePortId 
 * @param  {string} targetNodeId 
 * @param  {string} targetPortId 
 */
function connect(sourceNodeId, sourcePortId, targetNodeId, targetPortId) {
  var connectable = _activeNodeCache[sourceNodeId].checkBlacklist(targetNodeId, targetPortId);
  if (connectable){
    if (_activeNodeCache[sourceNodeId] && _activeNodeCache[targetNodeId]){ 
      var ret = _activeNodeCache[sourceNodeId].connect(sourcePortId, _activeNodeCache[targetNodeId], targetPortId);
      if (ret < 0) {
        logger.warn('conect failed');
        return -1;
      }
      var outvalue = _activeNodeCache[sourceNodeId].outValues[sourcePortId];
      _activeNodeCache[sourceNodeId].out(sourcePortId,outvalue);
      // addBlacklist
      var loop = _activeNodeCache[sourceNodeId].checkLoop(targetNodeId);
      if (!loop){
         var whitelist = false;
         if (_activeNodeCache[targetNodeId].checkWhitelistInputport){
           whitelist = _activeNodeCache[targetNodeId].checkWhitelistInputport(targetPortId);
         }
         if (!whitelist){
           if (_activeNodeCache[sourceNodeId].getInputPort){
           var blacklistPort = _activeNodeCache[sourceNodeId].getInputPort();
           _activeNodeCache[targetNodeId].addBlacklist(_activeNodeCache[sourceNodeId],sourceNodeId,blacklistPort);
           }  
         }     
      }
    }
  } else {
    logger.warn('closed-loop,not connectable');
  }
}

/**
 * [disconnect] disconnect from a targetPort
 * @param  {string} sourceNodeId
 * @param  {string} sourcePortId
 * @param  {string} targetNodeId
 * @param  {string} targetPortId
 */
function disconnect(sourceNodeId, sourcePortId, targetNodeId, targetPortId) {
  if (_activeNodeCache[sourceNodeId] && _activeNodeCache[targetNodeId]){ 
    _activeNodeCache[sourceNodeId].disconnect(sourcePortId, _activeNodeCache[targetNodeId], targetPortId);
    if (_activeNodeCache[sourceNodeId].getInputPort){
      var blacklistPort = _activeNodeCache[sourceNodeId].getInputPort();
      _activeNodeCache[targetNodeId].deleteBlacklist(sourceNodeId,blacklistPort);
    }
   var inLinks = _activeNodeCache[targetNodeId].inNodes[targetPortId];
   _activeNodeCache[targetNodeId].run(); 
  }  
}

/**
 * [disconnectAll] disconnect a node's all connection
 * @param  {string} node's id 
 */
function disconnectAll(id){
  var i,sourceNodeId, sourcePortId,targetNodeId, targetPortId,port,outId,outNode;

  //disconnect outNodes connection
  for (port in _activeNodeCache[id].outNodes) {
      for (i = _activeNodeCache[id].outNodes[port].length - 1; i >= 0; i--) {
        outNode = _activeNodeCache[id].outNodes[port][i];
        targetNodeId = outNode.node.id;
        targetPortId = outNode.port;
        disconnect(id, port, targetNodeId, targetPortId);
      }    
  }

  //disconnect inNodes connection
  for (port in _activeNodeCache[id].inNodes) {
    for (i = _activeNodeCache[id].inNodes[port].length - 1; i >= 0; i--) {
      sourceNodeId = _activeNodeCache[id].inNodes[port][i].id;  
      sourcePortId = _activeNodeCache[id].inNodes[port][i].port; 
      disconnect(sourceNodeId, sourcePortId, id, port);
    }    
  }
}

/**
 * [configNode] config node's key/value
 * @param {string} the id of the node
 * @param {object} the config key/value object, eg: {operator:'>', value: 60}
 * @param {boolen} the flag to play
 */
function configNode(id, config, play) { 
  logger.warn('configNode,id: ' + id + ' config: ' + JSON.stringify(config) + ' play: ' + play);
  if (id in _activeNodeCache){ 
    for (var name in config) {
      if (name in _activeNodeCache[id].conf) {
         _activeNodeCache[id].conf[name] = config[name];
       var needRun = algorithm.checKIfNeedRun(name);
       if (needRun === true){
          if ( _activeNodeCache[id].config){
            if (play || ('undefined' === (typeof play))){
              _activeNodeCache[id].config();
            }
          } 
       }                 
      }
    }    
  }
}

/**
 * [getNodeConfigs] get node's default configs
 * @param {string} the id of the node
 * @return {object} the configs object, eg: {number: { type: 'number', defaultValue: 0},{...}}
 */
function getNodeConfigs(id) { 
  var configs = null;
  if (id in _activeNodeCache){
    if (_activeNodeCache[id].props.hasOwnProperty('configs')){
      configs = _activeNodeCache[id].props.configs;
    }
  }
  return configs;
}

/**
 * [getNodeCurrentConfig] get node's current config
 * @param {string} the id of the node
 * @param {string} the key of the config
 * @return {object} the config }
 */
function getNodeCurrentConfig(id,key){
  var config = null;
  if (id in _activeNodeCache){
    if (key in _activeNodeCache[id].conf){
      config = _activeNodeCache[id].conf[key];
    }
  }
  return config;  
}

/**
 * [getNodeInputValue] get node's input value
 * @param {string} the id of the node
 * @param {string} the port of the node
 * @return {text or number} the value }
 */
function getNodeInputValue(id,port){
  if (id in _activeNodeCache){
    return _activeNodeCache[id].in(port);
  }
  else {
    return null;
  }
}

/**
 * [useNode] use Node
 * @param {string} the id of the Node
 */
function useNode(id){ 
  if (id in _activeNodeCache){
     // update ConnectionStatus/BlockCount
     if (_activeNodeCache[id].idx){
       electronicblock.updateElectronicBlockConnectionStatus(id);
       electronicblock.updateElectronicBlockCount(_activeNodeCache[id].type);
     }

   if (_activeNodeCache[id].setup){
      _activeNodeCache[id].setup();
    }  
  }
}

/**
 * [unUseNode] unUse Node
 * @param {string} the id of the Node
 */
function unUseNode(id){
  if (id in _activeNodeCache){
    // disconnect all conection
    disconnectAll(id);

    if (_activeNodeCache[id].stop){
       _activeNodeCache[id].stop();
    }  
  }
}

/**
 * [getActiveNodes get all active nodes]
 * @return {Array} [{id: '11', type: 'SomeType'}, {id: '12', type: 'AnotherType'}]
 */
function getActiveNodes() {
  'use strict';
  var nodes = [];
  var type;

  for (var id in _activeNodeCache){
    type = _activeNodeCache[id].type;
    nodes.push({id: id, type: type});
  }

  return nodes;
}

/**
 * [onNodeInputChanged report NodeInputChange if the callback function was set,]
 * @param {string} id    [node id]
 * @param {string} port  [the changed port name]
 * @param {Array}  value [the new value]
 */
function onNodeInputChanged(id, port, value) {
  event.emit(events.NODEINPUT,id,port,value);
}

/**
 * [onNodeOutputChanged report NodeOutputChange if the callback function was set,]
 * @param {string} id    [node id]
 * @param {string} port  [the changed port name]
 * @param {Array}  value [the new value]
 */
function onNodeOutputChanged(id, port, value) {
  event.emit(events.NODEOUTPUT,id,port,value);
}

/**
 * [callMethod ]
 * @param {string} id    [node id]
 * @param {string} method    [method to be call]
 * @param {} args    [could be callBackFunction or other params set to node]
 */
function callMethod (id, method, args){
  if (_activeNodeCache[id] && _activeNodeCache[id].methods){
    if  (method in _activeNodeCache[id].methods){
      _activeNodeCache[id].methods[method] = args;
    }
  }
}

exports.getActiveNodes = getActiveNodes;
exports.addNode = addNode;
exports.removeNode = removeNode;
exports.initNode = initNode;
exports.connect = connect;
exports.disconnect = disconnect;
exports.configNode = configNode;
exports.getNodeConfigs = getNodeConfigs;
exports.getNodeCurrentConfig = getNodeCurrentConfig;
exports.getNodeInputValue = getNodeInputValue;
exports.onNodeOutputChanged = onNodeOutputChanged;
exports.onNodeInputChanged = onNodeInputChanged;
exports.useNode = useNode;
exports.unUseNode = unUseNode;
exports.callMethod = callMethod;
exports.disconnectAll = disconnectAll;


