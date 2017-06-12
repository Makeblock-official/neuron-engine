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
    input: '1',
    wantInPort: 'text',
    wantInValue: '1'
 },
 {
    input: 'lalalla',
    wantInPort: 'text',
    wantInValue: 'lalalla'
 },
 {
    input: '123',
    wantInPort: 'text',
    wantInValue: '123'
 }
];

describe('LABEL node', function(){
  var enine;
  var labelId;
  var _activeNodeCache;

  before(function() {
    engine = index.create(DEFAULT_CONF);
    labelId = engine.addNode("LABEL");  
    engine.on(events.NODEOUTPUT, nodeOutputChanged);
    engine.on(events.NODEINPUT, nodeInputChanged);
    _activeNodeCache = engine.getActiveNodeCache();
    _activeNodeCache[labelId].setup();
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

  it('When input changed, should report to app and send to cloud', function() {
    for (var i = 0; i < configCases.length; i++){
      _activeNodeCache[labelId].updateInput('text',configCases[i].input,true);
      expect(inId).to.be.eql(labelId);
      expect(inPort).to.be.eql(configCases[i].wantInPort); 
      expect(inValue).to.be.eql(configCases[i].wantInValue); 
    }
  });
});
