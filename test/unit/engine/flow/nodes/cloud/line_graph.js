var expect = require('chai').expect;
var sinon = require("sinon");

var index = require('../../../../../../lib/engine/flow/index');
var events = require('../../../../../../lib/engine/flow/events');
var node = require('../../../../../../lib/engine/flow/node');

var DEFAULT_CONF = {
  driver: 'mock', 
  loglevel: 'WARN',
  serverIP: '192.168.100.1',
  socketServerPort: 8082,
  userKey: 'a2a9705fc33071cc212af979ad9e52d75bc096936fb28fe18d0a6b56067a6bf8',
  uuid: '76FA49A9-78D8-4AE5-82A3-EC960138E908',
  device: '',
  runtime: 'node',
};

var inId,inPort,inValue, outId,outPort,outValue;

function nodeOutputChanged(id, portName, value){
  outId = id;
  outPort = portName;
  outValue = value; 
}

function nodeInputChanged(id, portName, value){
  inId = id;
  inPort = portName;
  inValue = value; 
}

var configCases = [
 {
    input: 1,
    sampleinterval: 0.001
 },
 {
    input: 2,
    sampleinterval: 0.002
 },
];

describe('LINE_GRAPH node', function(){
  var enine;
  var lineGraphId;
  var _activeNodeCache;

  before(function() {
    engine = index.create(DEFAULT_CONF);
    lineGraphId = engine.addNode("LINE_GRAPH");  
    engine.on(events.NODEOUTPUT, nodeOutputChanged);
    engine.on(events.NODEINPUT, nodeInputChanged);
    _activeNodeCache = engine.getActiveNodeCache();
    _activeNodeCache[lineGraphId].setup();
  });

  after(function() {
/*
    nodes = engine.getActiveNodes();
    for(var i = 0; i < nodes.length; i++){
      engine.removeNode(nodes[i].id);
    }
*/
    engine.removeListener(events.NODEOUTPUT, nodeOutputChanged);
    engine.removeListener(events.NODEINPUT, nodeInputChanged);
    engine.stop();
    engine = null;
  });

  it('start sampling', function() {
    for (var i = 0; i < configCases.length; i++){
      engine.configNode(lineGraphId,{'sampleinterval':configCases[i].sampleinterval});
      _activeNodeCache[lineGraphId].updateInput('input',configCases[i].input,true);
    }
  });
});
