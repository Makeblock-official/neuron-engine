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
    input: 2.2,
    round: 'round',
    wantInId: 'ROUND@1',
    wantInPort: 'a',
    wantInValue: 2.2,
    wantOutId: 'ROUND@1',
    wantOutPort: 'b',
    wantOutValue: 2
 },
 {
    input: 2.8,
    round: 'round',
    wantInId: 'ROUND@1',
    wantInPort: 'a',
    wantInValue: 2.8,
    wantOutId: 'ROUND@1',
    wantOutPort: 'b',
    wantOutValue: 3
 },
 {
    input: 3.2,
    round: 'floor',
    wantInId: 'ROUND@1',
    wantInPort: 'a',
    wantInValue: 3.2,
    wantOutId: 'ROUND@1',
    wantOutPort: 'b',
    wantOutValue: 3
 },
 {
    input: 4.2,
    round: 'ceil',
    wantInId: 'ROUND@1',
    wantInPort: 'a',
    wantInValue: 4.2,
    wantOutId: 'ROUND@1',
    wantOutPort: 'b',
    wantOutValue: 5
 }
];

describe('FUNCTION node', function(){
  var enine;
  var roundId;
  var _activeNodeCache;

  before(function() {
    engine = index.create(DEFAULT_CONF);
    roundId = engine.addNode("ROUND","ROUND@1");  
    engine.on(events.NODEOUTPUT, nodeOutputChanged);
    engine.on(events.NODEINPUT, nodeInputChanged);
    var defaultConfig = engine.getNodeConfigs(roundId);
    _activeNodeCache = engine.getActiveNodeCache();
    for (var conf in defaultConfig){
      if (defaultConfig[conf].hasOwnProperty('defaultValue')){
        engine.configNode(roundId,{'round':defaultConfig[conf].defaultValue});  
      }
    }
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
      _activeNodeCache[roundId].updateInput('a', testCases[i].input, true);
      engine.configNode(roundId,{'round':testCases[i].round});
      expect(inId).to.be.eql(testCases[i].wantInId);
      expect(inPort).to.be.eql(testCases[i].wantInPort); 
      expect(inValue).to.be.eql(testCases[i].wantInValue);
      expect(outId).to.be.eql(testCases[i].wantOutId);
      expect(outPort).to.be.eql(testCases[i].wantOutPort); 
      expect(outValue).to.be.eql(testCases[i].wantOutValue); 
    }
    // unknown option
    engine.configNode(roundId,{'round':'daf'});
  });
});


