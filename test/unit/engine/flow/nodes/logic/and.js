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

var inId,aPort,aValue,bPort,bValue,outId,outPort,outValue;

function nodeInputChanged(id, portName, value){
  inId = id;
  switch (portName){
    case 'a':
      aPort = portName;
      aValue = value;
      break;
    case 'b':
      bPort = portName;
      bValue = value;
      break;
  }
}

function nodeOutputChanged(id, portName, value){
  outId = id;
  outPort = portName;
  outValue = value; 
}

var inputCases = [
 {
    a: 1,
    b: 1,
    wantOutValue: 100
 },
 {
    a: 1,
    b: 0,
    wantOutValue: 0
 },
 {
    a: 0,
    b: 1,
    wantOutValue: 0
 },
 {
    a: 0,
    b: 0,
    wantOutValue: 0
 }
];

describe('AND node', function(){
  var enine;
  var id;
  var _activeNodeCache;

  before(function() {
    engine = index.create(DEFAULT_CONF);
    id = engine.addNode("AND");  
    engine.on(events.NODEOUTPUT, nodeOutputChanged);
    engine.on(events.NODEINPUT, nodeInputChanged);
    _activeNodeCache = engine.getActiveNodeCache();
  });

  after(function() {
    engine.removeNode(id);
    engine.removeListener(events.NODEOUTPUT, nodeOutputChanged);
    engine.removeListener(events.NODEINPUT, nodeInputChanged);
    engine.stop();
    engine = null;
  });

  it('When input changed, should update outport', function() {
    for (var i = 0; i < inputCases.length; i++){
      _activeNodeCache[id].updateInput('a', inputCases[i].a, true);
      expect(inId).to.be.eql(id);
      expect(aPort).to.be.eql('a'); 
      expect(aValue).to.be.eql(inputCases[i].a); 

      _activeNodeCache[id].updateInput('b', inputCases[i].b, true);
      expect(inId).to.be.eql(id);
      expect(bPort).to.be.eql('b'); 
      expect(bValue).to.be.eql(inputCases[i].b); 

      expect(outId).to.be.eql(id);
      expect(outPort).to.be.eql('c'); 
      expect(outValue).to.be.eql(inputCases[i].wantOutValue); 
    }
  });
});


