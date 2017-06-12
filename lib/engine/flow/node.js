var _nodeTypes = {};
var _activeNodeCache = {};
var _nodeCache = {};

/**
 * @return {map[name][nodeType]} the list of available node types
 */
function getNodeTypes() {
  return _nodeTypes;
}

/**
 * @return {{id: {conf: $conf}...}} 
 */
function getnodeCache(){
 return _nodeCache;
}

/**
 * [getActiveNodeCache get Active NodeCache]
 * @return {object}
 */
function getActiveNodeCache() {
  //logger.warn(JSON.stringify(_activeNodeCache));
  return _activeNodeCache;
}


/**
 * registernodeType adds a new type of node to the engine.
 * @param {object} option [node configuration and implementation.]
 */
function registerNodeType(option) {
  _nodeTypes[option.name] = option;
}

/**
 * unregisterNodeType remove node type by name.
 * @param {string} type [the name of the node type]
 */
function unregisterNodeType(name) {
   delete _nodeTypes[name];
}

exports.getNodeTypes = getNodeTypes;
exports.getnodeCache = getnodeCache;
exports.getActiveNodeCache = getActiveNodeCache;
exports.registerNodeType = registerNodeType;
exports.unregisterNodeType = unregisterNodeType;
