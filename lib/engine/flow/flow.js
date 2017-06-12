var node = require('./node');
var core = require('./core');
var electronicblock = require('./electronicblock');
var logger = require('../../log/log4js').logger;

var _activeNodeCache = node.getActiveNodeCache();
var _nodeCache = node.getnodeCache();

/**
 * [reinitNodeCache] reinit NodeCache
 */
function reinitNodeCache() {
  for (var id in _activeNodeCache) {
    if (_activeNodeCache[id]) {
      // do not remove electronicNode 
      if (_activeNodeCache[id].idx){
        core.unUseNode(id);
      } else {
        core.removeNode(id);
      }
    }
  }
}

/**
 * [createWorkflow] init node status
 * disconnect nodes which connected
 */
function createWorkflow() {
  reinitNodeCache();
}

/**
 * [exportWorkflow export flow]
 * @return {Array} flow [{id: '11', type: 'SomeType', outNodes: {port:[{targerId: '21', targetPort: 'a'}]} }, {id: '12', type: 'AnotherType', outNodes: {}} ]
 */
function exportFlow() {
  var flow  = [];
  var id;
  var type;
  var idx;
  var outNodes = {};
  var conf = {};
  var nodes = core.getActiveNodes();
  for (var i = 0; i < nodes.length; i++) {
    id = nodes[i].id;
    type = nodes[i].type;
    conf = _activeNodeCache[id].conf;
    outNodes = _activeNodeCache[id].getOutNodes();
    if (_activeNodeCache[id].idx){
      idx = _activeNodeCache[id].idx;
      flow.push({id: id, type: type, idx: idx, conf: conf, outNodes: outNodes}); 
    } else{
      flow.push({id: id, type: type, conf: conf, outNodes: outNodes}); 
    }
  }
  return flow;
}

/**
 * [parseNodes parse nodes and addNode according to flow]
 * @param {Array} [{id: '11', type: 'SomeType', outNodes: {port:[{targerId: '21', targetPort: 'a'}]} }, {id: '12', type: 'AnotherType', outNodes: {}} ]
 */
function parseNodes(flow) {
  var id;
  var type;
  var idx;
  for (var i = 0; i< flow.length; i++) {
    id = flow[i].id;
    type = flow[i].type;
    _nodeCache[id] = {};
    _nodeCache[id].conf = flow[i].conf;
    if (flow[i].idx) {
      idx = flow[i].idx;
      if (!(id in _activeNodeCache)){
        core.addNode(type,id,idx);
      }
    } else {
      core.addNode(type,id);
    }
    // update conf to defaultValue
    for (var name in _nodeCache[id].conf) {
      if (_activeNodeCache[id].props.hasOwnProperty('configs')){
        if ((name in _activeNodeCache[id].props.configs) && (_activeNodeCache[id].props.configs[name].hasOwnProperty('defaultValue'))) {
          _activeNodeCache[id].props.configs[name].defaultValue = _nodeCache[id].conf[name]; 
        }
      }
    }
    delete _nodeCache[id];  
  }
}

/**
 * [parseOutNodes parse OutNodes and connect according to flow]
 * @param {Array} [{id: '11', type: 'SomeType', outNodes: {port:[{targerId: '21', targetPort: 'a'}]} }, {id: '12', type: 'AnotherType', outNodes: {}} ]
 */
function parseOutNodes (flow) {
  var sourceNodeId;
  var targetNodeId;
  var targetPortId;
  var outNodes = {};
  for (var i = 0; i< flow.length; i++) {
    sourceNodeId = flow[i].id;
    outNodes = flow[i].outNodes;
    for (var port in outNodes) {
      for (var j = 0; j < outNodes[port].length; j++) {
        targetNodeId = outNodes[port][j].targetNodeId;
        targetPortId = outNodes[port][j].targetPortId;
        core.connect(sourceNodeId, port, targetNodeId, targetPortId);
      }
    }
  }
}

/**
 * [loadFlow load flow]
 * @param {Array} [{id: '11', type: 'SomeType', outNodes: {port:[{targerId: '21', targetPort: 'a'}]} }, {id: '12', type: 'AnotherType', outNodes: {}} ]
 */
function loadFlow(flow) {
  createWorkflow();
  parseNodes(flow);
  parseOutNodes(flow);
  electronicblock.updateAllElectronicBlockStatus();
}

exports.createWorkflow = createWorkflow;
exports.exportFlow = exportFlow;
exports.loadFlow = loadFlow;
