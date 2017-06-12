/**
 * flow engine
 */
var core = require('./core');
var _ = require('underscore');
var LogicEngine = require('../logic');
var logger = require('../../log/log4js').logger;
var config = require('../../config/config');
var iotClient = require('./iotlib/index');
var event = require('../../event/event');
var electronicblock = require('./electronicblock');
var node = require('./node');
var cloud = require('./cloud');
var workflow = require('./flow');
var crypto = require('crypto');

var FlowEngine = function(conf) {
  var self = this;

  /**
   * createSign create a signer.
   * @param {string} algorithm 
   * @param {string} key 
   * @param {buffer} data [binary data]
   */
  this.createSign = function(algorithm,key,data) {
    var sign = crypto.createSign(algorithm);
    sign.update(data);
    var sig = sign.sign(key, 'hex');
    return sig;
  };

  /**
   * @return {array[nodeType]} the list of available node types
   */
  this.getNodeTypes = function() {
    return node.getNodeTypes();
  };

  /**
   * registerNodeType adds a new type of node to the engine.
   * @param {object} option [node configuration and implementation.]
   */
  this.registerNodeType = function(option) {
    return node.registerNodeType(option);
  };

  /**
   * unregisterNodeType remove node type by name.
   * @param {string} type [the name of the node type]
   */
  this.unregisterNodeType = function(name) {
    node.unregisterNodeType(name);
  };

/**
 * [getActiveNodeCache get Active NodeCache]
 * @return {object}
 */
  this.getActiveNodeCache = function() {
    return node.getActiveNodeCache();
  };

  /**
   * [getActiveNodes get all active nodes]
   * @return {object} [nodes oject]
   */
  this.getActiveNodes = function() {
    return core.getActiveNodes();
  };

  /**
   * [getActiveCloudNodes get all active cloud nodes]
   * @return {Array} [{id: id, type: type, conf: conf, topics: {port1: topic1, port2: topic2}},{...}]
  */
  this.getActiveCloudNodes = function() {
    return cloud.getActiveCloudNodes();
  };

  /**
   * [getIotClient] get iot client
   */
  this.getIotClient = function() {
    return iotClient.getClient();
  };

  /**
   * [createIotClient] create iot client
   * @param {string} userKey  [the userkey. (check it out from http://iot.makeblock.com/console#/settings)]
   */
  this.createIotClient = function(userKey,uuid) {
    return cloud.createIotClient(userKey,uuid);
  };

 /**
  * [getClientConnectResult return the client ConnectResult]
  * @return {integer}      [1: success; 0:fail]
  */
  this.getClientConnectResult = function() {
    return iotClient.getClientConnectResult();
  };

  /**
  * @param {string} type  the type name of the node
  * @param {integer} id  [optional,if set, will set id for the node]
  * @param {integer} idx  [optional,for electronic nodes, if set, will set idx for the node,]
  * @return {string} the id of the added node
  */
  this.addNode = function(type,id,idx) {
    return core.addNode(type,id,idx);
  };

  /**
  * @param {string} the id of the added node
  */
  this.removeNode = function(id) {
    return core.removeNode(id);
  };

  /**
  * @param {string} the id of the node
  */
  this.initNode = function(id) {
    return core.initNode(id);
  };

/**
 * @param  {string} sourceNodeId 
 * @param  {string} sourcePortId 
 * @param  {string} targetNodeId 
 * @param  {string} targetPortId 
 */
  this.connect = function(sourceNodeId, sourcePortId, targetNodeId, targetPortId) {
    return core.connect(sourceNodeId, sourcePortId, targetNodeId, targetPortId);
  };

/**
 * @param  {string} sourceNodeId 
 * @param  {string} sourcePortId 
 * @param  {string} targetNodeId 
 * @param  {string} targetPortId 
 */
  this.disconnect = function(sourceNodeId, sourcePortId, targetNodeId, targetPortId) {
    return core.disconnect(sourceNodeId, sourcePortId, targetNodeId, targetPortId);
  };

/**
 * @param {string} the id of the node
 * @param {object} the config key/value object, eg: {operator:'>', value: 60}
 * @param {boolen} the flag to play
 */
  this.configNode = function(id, config, play) {
    return core.configNode(id, config, play);
  };

/**
 * [getNodeConfigs] get node's configs
 * @param {string} the id of the node
 * @return {object} the configs object, eg: {number: { type: 'number', defaultValue: 0},{...}}
 */
  this.getNodeConfigs = function(id) {
    return core.getNodeConfigs(id);
  };

  /**
 * [getNodeCurrentConfig] get node's current config
 * @param {string} the id of the node
 * @param {string} the key of the config
 * @return {object} the config }
 */
   this.getNodeCurrentConfig = function(id,key) {
    return core.getNodeCurrentConfig(id,key);
  };

/**
 * [getNodeInputValue] get node's input value
 * @param {string} the id of the node
 * @param {string} the port of the node
 * @return {text or number} the value }
 */
   this.getNodeInputValue = function(id,port) {
    return core.getNodeInputValue(id,port);
  }; 

  /**
   * [useNode] use Node
   * @param {string} the id of the Node
   */
  this.useNode = function(id){
    core.useNode(id);
  };

  /**
   * [unUseNode] unUse Node
   * @param {string} the id of the Node
   */
  this.unUseNode = function(id){
    core.unUseNode(id);
  };

  /**
   * [setConfig sets config]
   * @param {object} conf [configuration]
   */
  this.callMethod = function(id, method, args) {
    core.callMethod(id, method, args);
  };

  this.logicEngine = LogicEngine.create(conf); 
  electronicblock.setlogicEngine(this.logicEngine); 

  /**
   * [setDriver sets driver]
   * @param {string} type [the type of driver.]
   */
  this.setDriver = function(type) {
    return electronicblock.setDriver(type);
  };

  /**
   * [getDriverConnectResult return the current driver ConnectResult]
   * @return {integer}      [1: success; 0:fail]
  */
  this.getDriverConnectResult = function() {
    return electronicblock.getDriverConnectResult();
  };

  /**
   * [closeDriver closde driver]
   */
  this.closeDriver = function() {
    electronicblock.closeDriver();
  };

  /**
   * updateAllElectronicBlockStatus update all ElectronicBlock's status to app.
   */
  this.updateAllElectronicBlockStatus = function() {
    return electronicblock.updateAllElectronicBlockStatus();
  };

  /**
   * [getElectronicNodeIdx] get ElectronicNode Idx
   * @param {string} the id of the ElectronicNode
   * @return {integer} idx the ElectronicBlock idx
   */
  this.getElectronicNodeIdx = function(id) {
    return electronicblock.getElectronicNodeIdx(id);
  };

  /**
   * [getActiveElectronicBlocks get all active electronic blocks and their values]
   * @return {object} [electronic blocks oject]
   */
  this.getActiveElectronicBlocks = function() {
    return electronicblock.getActiveElectronicBlocks();
  };

/**
 * [getActiveElectronicNodes get all active electronic nodes]
 * @return {Array} [{id: '11', type: 'SomeType'}, {id: '12', type: 'AnotherType'}]
 */
  this.getActiveElectronicNodes = function() {
    return electronicblock.getActiveElectronicNodes();
  };

  /**
 * [getavblockState]
 * @return {object} {sound: state, camera: state}
 */
  this.getavblockState = function() {
    return electronicblock.getavblockState();
  };

/**
 * [createWorkflow,init node status]
 * disconnect nodes which connected
 */
  this.createWorkflow = function() {
    return workflow.createWorkflow();
  };

/**
 * [exportFlow export flow]
 * @return {Array} [{id: '11', type: 'SomeType', outNodes: {port:[{targerId: '21', targetPort: 'a'}]} }, {id: '12', type: 'AnotherType', outNodes: {}} ]
 */
  this.exportFlow = function() {
    return workflow.exportFlow();
  };

/**
 * [parseFlow load flow]
 * @param {Array} [{id: '11', type: 'SomeType', outNodes: {port:[{targerId: '21', targetPort: 'a'}]} }, {id: '12', type: 'AnotherType', outNodes: {}} ]
 */
  this.loadFlow = function(flow) {
    return workflow.loadFlow(flow);
  };

  /**
   * [setConfig sets config]
   * @param {object} conf [configuration]
   */
  this.setConfig = function(conf) {
    config.setConfig(conf);
  };

    /**
   * [getWifiServerIp]
   * &return ip
   */
  this.getWifiServerIp = function() {
      var _config = config.getConfig();
      return _config.serverIP;
  };

  this.getBlockVersionById = function(id) {
    return electronicblock.getBlockVersionById(id);
  };

  this.getTypeAndSubtypeById = function(id) {
    return electronicblock.getTypeAndSubtypeById(id);
  };

  /**
   * firmwarebuf uint8 type
   */
  this.updateBlockISP = function(id, type, subtype, firmwarebuf) {
    return electronicblock.updateBlockISP(id, type, subtype, firmwarebuf);
  };

  this.setNeuronFirmware = function(type, subtype, firmwarebuf) {
    return electronicblock.setNeuronFirmware(type, subtype, firmwarebuf);
  };

  this.setUpdatingFalse = function() {
    return electronicblock.setUpdatingFalse();
  };

  /**
   * start interface
   */
  this.start = function() {
    return electronicblock.start();
  };

  /**
   * stop interface
   */
  this.stop = function() {
    return electronicblock.stop();
  };

  this.sendHeartbeatPkg = function() {
    electronicblock.sendHeartbeatPkg();
  }; 

  this.stopHeartbeatPkg = function() {
    electronicblock.stopHeartbeatPkg();
  };  

  this.event = event;

  /**
   * on registers an event handler to engine.
   * @param  {string}   event    [the event name]
   * @param  {Function} callback [callback funtion when event triggers]
   */
  this.on = function(event, callback) {
    this.event.on(event, callback);
  };

  /**
   * remove an event handler.
   * @param  {string}   event    [the event name]
   * @param  {Function} callback [callback funtion when event triggers]
   */
  this.removeListener = function(event, callback) {
    this.event.removeListener(event, callback);
  };

};

module.exports = FlowEngine;
