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
    input: 2,
    options: 'square',
    wantInId: 'FUNCTION@1',
    wantInPort: 'a',
    wantInValue: 2,
    wantOutId: 'FUNCTION@1',
    wantOutPort: 'b',
    wantOutValue: 4
 },
 {
    input: 9,
    options: 'sqrt',
    wantInId: 'FUNCTION@1',
    wantInPort: 'a',
    wantInValue: 9,
    wantOutId: 'FUNCTION@1',
    wantOutPort: 'b',
    wantOutValue: 3
 },
 {
    input: -1,
    options: 'abs',
    wantInId: 'FUNCTION@1',
    wantInPort: 'a',
    wantInValue: -1,
    wantOutId: 'FUNCTION@1',
    wantOutPort: 'b',
    wantOutValue: 1
 },
 {
    input: -2,
    options: '-',
    wantInId: 'FUNCTION@1',
    wantInPort: 'a',
    wantInValue: -2,
    wantOutId: 'FUNCTION@1',
    wantOutPort: 'b',
    wantOutValue: 2
 },
 {
    input: 9,
    options: 'sqrt',
    wantInId: 'FUNCTION@1',
    wantInPort: 'a',
    wantInValue: 9,
    wantOutId: 'FUNCTION@1',
    wantOutPort: 'b',
    wantOutValue: 3
 },
 {
    input: 2,
    options: 'ln',
    wantInId: 'FUNCTION@1',
    wantInPort: 'a',
    wantInValue: 2,
    wantOutId: 'FUNCTION@1',
    wantOutPort: 'b',
    wantOutValue: Math.log(2)
 },
 {
    input: -1,
    options: 'ln',
    wantInId: 'FUNCTION@1',
    wantInPort: 'a',
    wantInValue: -1,
    wantOutId: 'FUNCTION@1',
    wantOutPort: 'b',
    wantOutValue: Number.NaN
 },
 {
    input: 10,
    options: 'log10',
    wantInId: 'FUNCTION@1',
    wantInPort: 'a',
    wantInValue: 10,
    wantOutId: 'FUNCTION@1',
    wantOutPort: 'b',
    wantOutValue: Math.log(10)/Math.LN10
 },
 {
    input: -110,
    options: 'log10',
    wantInId: 'FUNCTION@1',
    wantInPort: 'a',
    wantInValue: -110,
    wantOutId: 'FUNCTION@1',
    wantOutPort: 'b',
    wantOutValue: Number.NaN
 },
 {
    input: 2,
    options: 'e^',
    wantInId: 'FUNCTION@1',
    wantInPort: 'a',
    wantInValue: 2,
    wantOutId: 'FUNCTION@1',
    wantOutPort: 'b',
    wantOutValue: Math.pow(Math.E, 2)
 },
 {
    input: 10,
    options: '10^',
    wantInId: 'FUNCTION@1',
    wantInPort: 'a',
    wantInValue: 10,
    wantOutId: 'FUNCTION@1',
    wantOutPort: 'b',
    wantOutValue: Math.pow(10, 10)
 },
 {
    input: 1.57,
    options: 'sin',
    wantInId: 'FUNCTION@1',
    wantInPort: 'a',
    wantInValue: 1.57,
    wantOutId: 'FUNCTION@1',
    wantOutPort: 'b',
    wantOutValue: Math.sin(1.57)
 },
 {
    input: 0,
    options: 'cos',
    wantInId: 'FUNCTION@1',
    wantInPort: 'a',
    wantInValue: 0,
    wantOutId: 'FUNCTION@1',
    wantOutPort: 'b',
    wantOutValue: Math.cos(0)
 },
 {
    input: 1,
    options: 'tan',
    wantInId: 'FUNCTION@1',
    wantInPort: 'a',
    wantInValue: 1,
    wantOutId: 'FUNCTION@1',
    wantOutPort: 'b',
    wantOutValue: Math.tan(1)
 },
 {
    input: 0.5,
    options: 'asin',
    wantInId: 'FUNCTION@1',
    wantInPort: 'a',
    wantInValue: 0.5,
    wantOutId: 'FUNCTION@1',
    wantOutPort: 'b',
    wantOutValue: Math.asin(0.5)
 },
 {
    input: 1,
    options: 'acos',
    wantInId: 'FUNCTION@1',
    wantInPort: 'a',
    wantInValue: 1,
    wantOutId: 'FUNCTION@1',
    wantOutPort: 'b',
    wantOutValue: Math.acos(1)
 },
 {
    input: 0.8,
    options: 'atan',
    wantInId: 'FUNCTION@1',
    wantInPort: 'a',
    wantInValue: 0.8,
    wantOutId: 'FUNCTION@1',
    wantOutPort: 'b',
    wantOutValue: Math.atan(0.8)
 }
];

describe('FUNCTION node', function(){
  var enine;
  var functionId;
  var _activeNodeCache;

  before(function() {
    engine = index.create(DEFAULT_CONF);
    functionId = engine.addNode("FUNCTION","FUNCTION@1");  
    engine.on(events.NODEOUTPUT, nodeOutputChanged);
    engine.on(events.NODEINPUT, nodeInputChanged);
    var defaultConfig = engine.getNodeConfigs(functionId);
    _activeNodeCache = engine.getActiveNodeCache();
    for (var conf in defaultConfig){
      if (defaultConfig[conf].hasOwnProperty('defaultValue')){
        engine.configNode(functionId,{'func':defaultConfig[conf].defaultValue});  
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
      _activeNodeCache[functionId].updateInput('a', testCases[i].input, true);
      engine.configNode(functionId,{'func':testCases[i].options});
      expect(inId).to.be.eql(testCases[i].wantInId);
      expect(inPort).to.be.eql(testCases[i].wantInPort); 
      expect(inValue).to.be.eql(testCases[i].wantInValue);
      expect(outId).to.be.eql(testCases[i].wantOutId);
      expect(outPort).to.be.eql(testCases[i].wantOutPort); 
      expect(outValue).to.be.eql(testCases[i].wantOutValue); 
    }
    // unknown option
    engine.configNode(functionId,{'func':'daf'});
  });
});


