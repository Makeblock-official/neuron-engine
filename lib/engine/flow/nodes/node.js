var core = require('../core');
var logger = require('../../../log/log4js').logger;
var algorithm = require('./algorithm');

var globalSessionId = 0;

var Node = function(id, option) {
  this.conf = algorithm.jsonClone(option.conf);
  this.name = option.name;
  this.sessionId = ++globalSessionId;
  this.nodeId = id;
  this.inValues = {};
  this.validValue = {};
  this.inNodes = {};
  this.outValues = {};
  this.outNodes = {};
  this.props = algorithm.jsonClone(option.props);
  this.blacklist = [];

  var props = this.props;
  var i;
  for (i = 0; i < props.in.length; i++) {
    if (this.props.hasOwnProperty('inputCombine') && this.props.inputCombine === true){
      this.inValues[props.in[i]] = [];
    } else {
      this.inValues[props.in[i]] = null;
    }
    this.validValue[props.in[i]] = null;
    this.inNodes[props.in[i]] = [];
  }
  for (i = 0; i < props.out.length; i++) {
    if (this.props.outPutType && this.props.outPutType === 'text'){
      this.outValues[props.out[i]] = '';
    } else{
      this.outValues[props.out[i]] = null;
    }
    this.outNodes[props.out[i]] = [];
  }

  if (option.methods){
    this.methods = {};
    for (var method in option.methods) {
      this.methods[method] = null;
    }
  }

  this.run = option.run;
  if (option.setup){
    this.setup = option.setup;
  }
  if (option.config){
    this.config = option.config;
  }  
  if (option.stop){
    this.stop = option.stop;
  }
  if (option.processStatus){
    this.processStatus = option.processStatus;
  }
  if (option.getInputPort){
    this.getInputPort = option.getInputPort;
  } 
  if (option.checkWhitelistInputport){
    this.checkWhitelistInputport = option.checkWhitelistInputport;
  } 
  if (option.initNode){
    this.initNode = option.initNode;
  }  
  this.init = option.init;
  if (this.init){
    this.init();
  }
  if(option.getBlockVersion) {
    this.getBlockVersion = option.getBlockVersion;
  }
  if(option.updateNeuronBlock) {
    this.updateNeuronBlock = option.updateNeuronBlock;
  }
};

Node.prototype.checkLoop = function(nodeId){
  var loop = false;
  var node;
  for (var i = 0; i < this.blacklist.length; i++){
    if (this.blacklist[i].nodeId === nodeId){
      loop = true;
      break;
    }
    node = this.blacklist[i].node;
    loop = node.checkLoop(nodeId);
  } 
  return  loop;  
};

Node.prototype.checkBlacklist = function(nodeId, portId){
  var connectable = true;
  var node;
  for (var i = 0; i < this.blacklist.length; i++){
    if (this.blacklist[i].nodeId === nodeId && this.blacklist[i].portId === portId){
      connectable = false;
      break;
    }
    node = this.blacklist[i].node;
    connectable = node.checkBlacklist(nodeId, portId);
  } 
  return  connectable;
};

Node.prototype.addBlacklist= function(node,nodeId,blacklistPort){
  var tmp = {node: node, nodeId: nodeId, portId: blacklistPort};
  this.blacklist.push(tmp);
};

Node.prototype.deleteBlacklist= function(nodeId,blacklistPort){
  for (var i = 0; i < this.blacklist.length; i++){
    if (this.blacklist[i].nodeId === nodeId && this.blacklist[i].portId === blacklistPort){
      this.blacklist.splice(i, 1);
      break;
    }
  }
};

Node.prototype.connect = function(port, targetNode, targetPort) {
  logger.warn('connect, sourceNode: ' + this.id + ' sourcePort: ' + port + ' targetNode: ' + targetNode.id + ' targetPort: ' + targetPort);
  if (this.outNodes[port]) {
    for (var i = 0; i < this.outNodes[port].length; i++) {
      if ((targetPort == this.outNodes[port][i].port)  && (targetNode.id == this.outNodes[port][i].id)){
        logger.warn('the port is already connected');
        return -1;
      }
    }
    this.outNodes[port].push({
      node: targetNode,
      port: targetPort,
      id: targetNode.id
    });

    targetNode.inNodes[targetPort].push({id: this.id, port: port});
    if (targetNode.props.hasOwnProperty('inputCombine') && targetNode.props.inputCombine === true){
      targetNode.inValues[targetPort].push({sourceNodeId: this.id, sourcePort: port,value: {current: null,isChanged:false}});
    }
  }
  return 0;
};

Node.prototype.disconnect = function(port, targetNode, targetPort) {
  logger.warn('disconnect, sourceNode: ' + this.id + ' sourcePort: ' + port + ' targetNode: ' + targetNode.id + ' targetPort: ' + targetPort);
    var outLinks = this.outNodes[port];
    for (var i = 0; i < outLinks.length; i++) {
      if (outLinks[i].id == targetNode.id && outLinks[i].port == targetPort) {
        outLinks.splice(i, 1);
      }
    }

    var inLinks ,j;
    inLinks = targetNode.inNodes[targetPort];
   for (j = 0; j < inLinks.length; j++) {
      if (inLinks[j].id == this.id && inLinks[j].port == port) {
        inLinks.splice(j, 1);
      }
    }
    if (targetNode.props.hasOwnProperty('inputCombine') && targetNode.props.inputCombine === true){
      inLinks = targetNode.inValues[targetPort];
      for (j = 0; j < inLinks.length; j++) {
        if (inLinks[j].sourceNodeId == this.id && inLinks[j].sourcePort == port) {
          inLinks.splice(j, 1);
        }
      }
    }
};

Node.prototype.getOutNodes = function() {
  var targetNodeId;
  var targetPortId;
  var outNodes = {};
  for (var port in this.outNodes) {
    outNodes[port] = [];
    for (var i = 0; i < this.outNodes[port].length; i++) {
      var nodeInfo = this.outNodes[port][i];
      targetNodeId = nodeInfo.id;
      targetPortId = nodeInfo.port;
      outNodes[port].push({targetNodeId: targetNodeId, targetPortId: targetPortId});
    }
  }
  return outNodes;
};

Node.prototype.updateInputFromSource = function(sourceNodeId, sourcePort, port, value, needRun) {
  if (this.props.hasOwnProperty('inPutType') && (this.props.inPutType === 'number')) {
    if (isNaN(value)){
      value = 0;
    }
  }
  if (this.props.hasOwnProperty('inputCombine') && this.props.inputCombine === true){
    for (var i = 0; i < this.inValues[port].length; i++){
      if (this.inValues[port][i].sourceNodeId === sourceNodeId && this.inValues[port][i].sourcePort  === sourcePort){
        if (needRun) {
          this.inValues[port][i].value.current  = value;
          this.inValues[port][i].value.isChanged  = true;
          // other sametype input isChanged update to false
          var datatype = (typeof value);
          for (var j = 0; j < this.inValues[port].length; j++){
            if ((j !== i) && (datatype === (typeof this.inValues[port][j].value.current)) && (this.inValues[port][j].value.current !== null)){
              if ((datatype === 'object') && (value !== null)){
                if (value.type === this.inValues[port][j].value.current.type){
                  this.inValues[port][j].value.isChanged  = false;
                }    
              } else {
                this.inValues[port][j].value.isChanged  = false;
              }
            }
          }
        }
        break;
      } 
    }
  }  else {
    if (needRun) {
      this.validValue[port] = value;
    }
  }
  if (needRun){
    if (this.props.inPutType && this.props.inPutType === 'object'){
      core.onNodeInputChanged(this.id, port, '{...}');
     } else {
       core.onNodeInputChanged(this.id, port, value);
     }
     this.run();
  }
};

Node.prototype.combineInput = function(port,type){
  var i;
  var boolBuf = [];
  var numberBuf = [];
  var objectBuf = [];
  var text = '';
  for (i = 0; i < this.inValues[port].length; i ++){
    var value = this.inValues[port][i].value;
    var current = value.current;
    if (current !== null){
      var datatype = (typeof current);
      switch (datatype){
        case 'boolean':
          boolBuf.push(current);
          break;
        case 'number':
          numberBuf.push(value);
          break;
        case 'string':
          text = text + current;
          break;
        case 'object':
          if (type === 'OLED_DISPLAY'){
            objectBuf.push(value);
          } else {
            if (current.hasOwnProperty('type') && (current.type === type)){
              objectBuf.push(value);
            } else {
              boolBuf.push(true);
            }       
          }
          break;
      }
    }
  }
  var object = algorithm.getLatestObject(objectBuf);
  var number = algorithm.getLatestNumber(numberBuf);
  var bool = algorithm.getBoolOrResult(boolBuf);
  var inValue;
  if(type === 'LED'){
    inValue = algorithm.combineInputLED(bool,number,object);
  } else if (type === 'OLED_DISPLAY'){
    inValue = algorithm.combineInputDisplay(bool,number,text,object);
  } else{
    inValue = algorithm.combineInput(bool,number,object);
  }
  return inValue;
};

Node.prototype.updateValidValue = function(port,value) {
  this.validValue[port] = value;
};

Node.prototype.in = function(port) {
  return this.validValue[port];
};

Node.prototype.out = function(port, value) {
  this.outValues[port] = value;
  core.onNodeOutputChanged(this.id, port, value);
  for (var i = 0; i < this.outNodes[port].length; i++) {
      var nodeInfo = this.outNodes[port][i];
      var needRun = true;
      nodeInfo.node.updateInputFromSource(this.id, port, nodeInfo.port, value, needRun);
  }
};

module.exports = Node;
