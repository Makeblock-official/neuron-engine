var node = require('./node');
var iotClient = require('./iotlib/index');
var logger = require('../../log/log4js').logger;
var config = require('../../config/config');

var _activeNodeCache = node.getActiveNodeCache();

/**
 * [createIotClient] create iot client
 * @param {string} userKey  [the userkey. (check it out from http://iot.makeblock.com/console#/settings)]
 */
function createIotClient(userKey,uuid){
  var conf = config.getConfig();
  if (!uuid){
    uuid = conf.uuid;
  }
  var device = conf.device;
  var runtime = conf.runtime;
  var option = {"userKey": userKey, "uuid": uuid, "device": device,"runtime": runtime};
  config.setConfig(option);
  var client = iotClient.create(option);
  if (client){
    var nodes =  getActiveIotNodes();
    var id;
    for (var i = 0; i < nodes.length; i++){
      id = nodes[i];
      _activeNodeCache[id].client = client;
      if (_activeNodeCache[id].initNode) {
        _activeNodeCache[id].initNode();
      }
    }
  }
  return client;
}

/**
 * [getActiveCloudNodes get all active cloud nodes]
 * @return {Array} [{id: id, type: type, conf: conf, topics: {port1: topic1, port2: topic2}},{...}]
 */
function getActiveCloudNodes() {
  'use strict';
  var nodes = [];
  var type;
  var conf = {};
  var topics = {};
  var category;

  for (var id in _activeNodeCache){
    if (_activeNodeCache[id]) {
      category = _activeNodeCache[id].props.category;
      if (category.indexOf ('control') >= 0){
        type = _activeNodeCache[id].type;
        conf = _activeNodeCache[id].conf;
        topics = _activeNodeCache[id].topics;
        nodes.push({id: id, type: type, conf: conf, topics: topics});
      }
    }
  }
  return nodes;
}

/**
 * [getActiveIotNodes get all active iot nodes]
 * @return {Array} [id1,id2]
 */
function getActiveIotNodes() {
  'use strict';
  var nodes = [];
  var type;
  var category;

  for (var id in _activeNodeCache){
    if (_activeNodeCache[id]) {
      type  = _activeNodeCache[id].type;
      if ((type === 'RECV_MESSAGE') || (type === 'SEND_MESSAGE')){
        nodes.push(id); 
      } else{
        category = _activeNodeCache[id].props.category;
        if (category.indexOf ('control') >= 0){
          nodes.push(id);  
        }
      }
    }
  }
  return nodes;
}

exports.getActiveCloudNodes = getActiveCloudNodes;
exports.createIotClient = createIotClient;
