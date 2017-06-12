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

var testCases = [
 {
    input: 50,
    from: 10,
    to: 100,
    wantInId: 'THRESHOLD@1',
    wantInPort: 'a',
    wantInValue: 50,
    wantOutId: 'THRESHOLD@1',
    wantOutPort: 'b',
    wantOutValue: 50
 },
 {
    input: 10,
    from: 10,
    to: 100,
    wantInId: 'THRESHOLD@1',
    wantInPort: 'a',
    wantInValue: 10,
    wantOutId: 'THRESHOLD@1',
    wantOutPort: 'b',
    wantOutValue: 10
 },
 {
    input: 100,
    from: 10,
    to: 100,
    wantInId: 'THRESHOLD@1',
    wantInPort: 'a',
    wantInValue: 100,
    wantOutId: 'THRESHOLD@1',
    wantOutPort: 'b',
    wantOutValue: 100
 },
 {
    input: 0,
    from: 10,
    to: 100,
    wantInId: 'THRESHOLD@1',
    wantInPort: 'a',
    wantInValue: 0,
    wantOutId: 'THRESHOLD@1',
    wantOutPort: 'b',
    wantOutValue: 0
 },
 {
    input: 1000,
    from: 10,
    to: 100,
    wantInId: 'THRESHOLD@1',
    wantInPort: 'a',
    wantInValue: 1000,
    wantOutId: 'THRESHOLD@1',
    wantOutPort: 'b',
    wantOutValue: 0
 }
];

describe('THRESHOLD node', function(){
  var enine;
  var thresholdId;
  var _activeNodeCache;

  before(function() {
    engine = index.create(DEFAULT_CONF);
    thresholdId = engine.addNode("THRESHOLD","THRESHOLD@1");  
    engine.on(events.NODEOUTPUT, nodeOutputChanged);
    engine.on(events.NODEINPUT, nodeInputChanged);
    _activeNodeCache = engine.getActiveNodeCache();
  });

  after(function() {
    nodes = engine.getActiveNodes();
    for(var i = 0; i < nodes.length; i++){
      engine.removeNode(nodes[i].id);
    }
    engine.removeListener(events.NODEOUTPUT, nodeOutputChanged);
    engine.removeListener(events.NODEINPUT, nodeInputChanged);
    engine.stop();
    engine = null;
  });

  it('When config or input changed, should report to app', function() {
    for (var i = 0; i < testCases.length; i++){
      engine.configNode(thresholdId,{'from':testCases[i].from});
      engine.configNode(thresholdId,{'to':testCases[i].to});
      _activeNodeCache[thresholdId].updateInput('a', testCases[i].input, true);
      expect(inId).to.be.eql(testCases[i].wantInId);
      expect(inPort).to.be.eql(testCases[i].wantInPort); 
      expect(inValue).to.be.eql(testCases[i].wantInValue);
      expect(outId).to.be.eql(testCases[i].wantOutId);
      expect(outPort).to.be.eql(testCases[i].wantOutPort); 
      expect(outValue).to.be.eql(testCases[i].wantOutValue); 
    }
  });
});


