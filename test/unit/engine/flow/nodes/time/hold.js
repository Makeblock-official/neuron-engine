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
    config: 2,
    wantInPort: 'hold',
    wantInValue: 2,
 },
 {
    config: -1,
    wantInPort: 'hold',
    wantInValue: -1,
 },
 {
    config: 0,
    wantInPort: 'hold',
    wantInValue: 0,
 }
];

var inputAPortCases = [
 {
    input: 1,
    wantInPort: 'a',
    wantInValue: 1,
    wantOutPort: 'b',
    wantOutValue: 1
 },
 {
    input: 10,
    wantInPort: 'a',
    wantInValue: 10,
    wantOutPort: 'b',
    wantOutValue: 10
 },
 {
    input: 100,
    wantInPort: 'a',
    wantInValue: 100,
    wantOutPort: 'b',
    wantOutValue: 100
 }
];

var inputDelayCases = [
 {
    input: 1,
    wantInPort: 'delay',
    wantInValue: 1
 },
 {
    input: 0,
    wantInPort: 'delay',
    wantInValue: 0
 },
 {
    input: -2,
    wantInPort: 'delay',
    wantInValue: -2
 }
];

describe('HOLD node', function(){
  var enine;
  var id;
  var numberId;
  var _activeNodeCache;
  var clock;

  before(function() {
    clock = sinon.useFakeTimers();
    engine = index.create(DEFAULT_CONF);
    id = engine.addNode("HOLD");
    numberId = engine.addNode("NUMBER");  
    engine.on(events.NODEOUTPUT, nodeOutputChanged);
    engine.on(events.NODEINPUT, nodeInputChanged);
    var defaultConfig = engine.getNodeConfigs(id);
    _activeNodeCache = engine.getActiveNodeCache();
  });

  after(function() {
    clock.restore();
    engine.removeNode(id);
    engine.removeNode(numberId);
    engine.removeListener(events.NODEOUTPUT, nodeOutputChanged);
    engine.removeListener(events.NODEINPUT, nodeInputChanged);
    engine.stop();
    engine = null;
  });

  it('When config hold changed during hold, update b port', function() {
    for (var i = 0; i < configCases.length; i++){
      _activeNodeCache[id].updateInput('a', inputAPortCases[i].input, true);
      expect(inId).to.be.eql(id);
      expect(inPort).to.be.eql(inputAPortCases[i].wantInPort); 
      expect(inValue).to.be.eql(inputAPortCases[i].wantInValue);
      engine.configNode(id,{'hold':configCases[i].config}); 
      expect(inId).to.be.eql(id);
      expect(inPort).to.be.eql(configCases[i].wantInPort); 
      expect(inValue).to.be.eql(configCases[i].wantInValue);
      expect(outId).to.be.eql(id);
      expect(outPort).to.be.eql(inputAPortCases[i].wantOutPort); 
      expect(outValue).to.be.eql(inputAPortCases[i].wantOutValue);
    }
  });

  it('When input changed and hold is 0, update b port', function() {
    engine.connect(numberId,'number', id, 'hold');
    engine.configNode(numberId,{'number':0});
    expect(inId).to.be.eql(id);
    expect(inPort).to.be.eql('hold'); 
    expect(inValue).to.be.eql(0);
    for (var i = 0; i < inputAPortCases.length; i++){
      _activeNodeCache[id].updateInput('a', inputAPortCases[i].input, true);
      expect(outPort).to.be.eql(inputAPortCases[i].wantOutPort); 
      expect(outValue).to.be.eql(inputAPortCases[i].wantOutValue);
      expect(inId).to.be.eql(id);
      expect(inPort).to.be.eql(inputAPortCases[i].wantInPort); 
      expect(inValue).to.be.eql(inputAPortCases[i].wantInValue); 
    }  
  });

  it('When input changed and hold is negative, update b port', function() {
    engine.configNode(numberId,{'number':-4});
    expect(inId).to.be.eql(id);
    expect(inPort).to.be.eql('hold'); 
    expect(inValue).to.be.eql(-4);
    for (var i = 0; i < inputAPortCases.length; i++){
      _activeNodeCache[id].updateInput('a', inputAPortCases[i].input, true);
      expect(outPort).to.be.eql(inputAPortCases[i].wantOutPort); 
      expect(outValue).to.be.eql(inputAPortCases[i].wantOutValue);
      expect(inId).to.be.eql(id);
      expect(inPort).to.be.eql(inputAPortCases[i].wantInPort); 
      expect(inValue).to.be.eql(inputAPortCases[i].wantInValue); 
    }  
  });

  it('When input changed during hold, ingnore', function() {
    engine.configNode(numberId,{'number':3});
    expect(inId).to.be.eql(id);
    expect(inPort).to.be.eql('hold'); 
    expect(inValue).to.be.eql(3);
    clock.tick(3010);     
    for (var i = 0; i < inputAPortCases.length; i++){
      if ((i > 0) && (_activeNodeCache[id].hold !== null)){
        _activeNodeCache[id].updateInput('a', inputAPortCases[i].input, true);
        expect(outPort).to.be.eql(inputAPortCases[i-1].wantOutPort); 
        expect(outValue).to.be.eql(inputAPortCases[i-1].wantOutValue);
        clock.tick(3100); 
        expect(outPort).to.be.eql(inputAPortCases[i].wantOutPort); 
        expect(outValue).to.be.eql(inputAPortCases[i].wantOutValue);
      } else {
        _activeNodeCache[id].updateInput('a', inputAPortCases[i].input, true);
        expect(outPort).to.be.eql(inputAPortCases[i].wantOutPort); 
        expect(outValue).to.be.eql(inputAPortCases[i].wantOutValue);
      }
      expect(inId).to.be.eql(id);
      expect(inPort).to.be.eql(inputAPortCases[i].wantInPort); 
      expect(inValue).to.be.eql(inputAPortCases[i].wantInValue); 
    }
  });
});


