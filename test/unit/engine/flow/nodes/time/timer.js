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

var valueCases = [
 {
    value: 2,
    wantInPort: 'value',
    wantInValue: 2,
    wantOutValue: 2
 },
 {
    value: 3,
    wantInPort: 'value',
    wantInValue: 3,
    wantOutValue: 3
 },
 {
    value: -1,
    wantInPort: 'value',
    wantInValue: -1,
    wantOutValue: -1
 }
];

var intervalCases = [
 {
    interval: 2,
    wantInPort: 'interval',
    wantInValue: 2
 },
 {
    interval: 3,
    wantInPort: 'interval',
    wantInValue: 3
 },
 {
    interval: 4,
    wantInPort: 'interval',
    wantInValue: 4
 }
];

var dutyCases = [
 {
    duty: 0.7
 },
 {
    duty: 2
 },
 {
    duty: -4
 }
];

describe('TIMER node', function(){
  var enine;
  var id;
  var numberId;
  var _activeNodeCache;
  var clock;

  before(function() {
    clock = sinon.useFakeTimers();
    engine = index.create(DEFAULT_CONF);
    id = engine.addNode("TIMER");
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

  it('When config value changed, should report to app', function() {
    engine.configNode(id,{'interval':1}); 
    engine.configNode(id,{'duty':0.5}); 
    for (var i = 0; i < valueCases.length; i++){
      engine.configNode(id,{'value':valueCases[i].value}); 
      expect(inId).to.be.eql(id);
      expect(inPort).to.be.eql(valueCases[i].wantInPort); 
      expect(inValue).to.be.eql(valueCases[i].wantInValue); 
      expect(outId).to.be.eql(id);
      expect(outPort).to.be.eql('output'); 
      expect(outValue).to.be.eql(valueCases[i].wantOutValue);
      clock.tick((1-0.5) * 1 * 1000 + 10);
      expect(outValue).to.be.eql(0);
    }
  });

  it('When input value changed, should report to app', function() {
    engine.connect(numberId,'number', id, 'value');
    engine.configNode(id,{'interval':1}); 
    engine.configNode(id,{'duty':0.6}); 
    for (var i = 0; i < valueCases.length; i++){
      engine.configNode(numberId,{'number':valueCases[i].value}); 
      expect(inId).to.be.eql(id);
      expect(inPort).to.be.eql(valueCases[i].wantInPort); 
      expect(inValue).to.be.eql(valueCases[i].wantInValue); 
      expect(outId).to.be.eql(id);
      expect(outPort).to.be.eql('output'); 
      expect(outValue).to.be.eql(valueCases[i].wantOutValue);
      clock.tick((1-0.6) * 1 * 1000 + 10);
      expect(outValue).to.be.eql(0);
    }
    engine.disconnect(numberId,'number', id, 'value');
  });

  it('When config interval changed, should report to app', function() {
    engine.configNode(id,{'value':4});
    engine.configNode(id,{'duty':0.5}); 
    for (var i = 0; i < intervalCases.length; i++){
      engine.configNode(id,{'interval':intervalCases[i].interval}); 
      expect(inId).to.be.eql(id);
      expect(inPort).to.be.eql(intervalCases[i].wantInPort); 
      expect(inValue).to.be.eql(intervalCases[i].wantInValue); 
      expect(outId).to.be.eql(id);
      expect(outPort).to.be.eql('output'); 
      expect(outValue).to.be.eql(4);
      clock.tick((1-0.5) * intervalCases[i].interval * 1000 + 10);
      expect(outValue).to.be.eql(0);
    }
  });

  it('When input interval changed, should report to app', function() {
    engine.connect(numberId,'number', id, 'interval');
    engine.configNode(id,{'value':4});
    engine.configNode(id,{'duty':0.4}); 
    for (var i = 0; i < intervalCases.length; i++){
      engine.configNode(numberId,{'number':intervalCases[i].interval}); 
      expect(inId).to.be.eql(id);
      expect(inPort).to.be.eql(intervalCases[i].wantInPort); 
      expect(inValue).to.be.eql(intervalCases[i].wantInValue); 
      expect(outId).to.be.eql(id);
      expect(outPort).to.be.eql('output'); 
      expect(outValue).to.be.eql(4);
      clock.tick((1-0.4) * intervalCases[i].interval * 1000 + 10);
      expect(outValue).to.be.eql(0);
    }
    engine.disconnect(numberId,'number', id, 'interval');
  });

  it('When config duty changed, should report to app', function() {
    engine.configNode(id,{'value':8});
    engine.configNode(id,{'interval':1}); 
    for (var i = 0; i < dutyCases.length; i++){
      engine.configNode(id,{'duty':dutyCases[i].duty}); 
      expect(outId).to.be.eql(id);
      expect(outPort).to.be.eql('output'); 
      if (dutyCases[i].duty >= 1){
        expect(outValue).to.be.eql(0);
      } else if (dutyCases[i].duty <= 0){
         expect(outValue).to.be.eql(8);    
      } else {
        expect(outValue).to.be.eql(8);
        clock.tick((1-dutyCases[i].duty) * 1 * 1000 + 10);
        expect(outValue).to.be.eql(0);
      }
    }
  });

});


