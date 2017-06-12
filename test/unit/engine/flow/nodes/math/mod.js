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

var reportId,reportValue,inId,inPort,inValue, outId,outPort,outValue;

function report (id,value){
  reportId = id;
  reportValue = value;
}

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

var configBPortCases = [
 {
    config: 3,
    wantReportId: 'MOD@1',
    wantReportValue: 3,
    wantOutId: 'MOD@1',
    wantOutPort: 'c',
    wantOutValue: 1
 },
 {
    config: 4,
    wantReportId: 'MOD@1',
    wantReportValue: 4,
    wantOutId: 'MOD@1',
    wantOutPort: 'c',
    wantOutValue: 2
 },
 {
    config: 5,
    wantReportId: 'MOD@1',
    wantReportValue: 5,
    wantOutId: 'MOD@1',
    wantOutPort: 'c',
    wantOutValue: 0
 },
 {
    config: 0,
    wantReportId: 'MOD@1',
    wantReportValue: 0,
    wantOutId: 'MOD@1',
    wantOutPort: 'c',
    wantOutValue: Number.NaN
 }
];

var inputAPortCases = [
 {
    input: 1,
    wantInId: 'MOD@1',
    wantInPort: 'a',
    wantInValue: 1,
    wantOutId: 'MOD@1',
    wantOutPort: 'c',
    wantOutValue: 1
 },
 {
    input: 8,
    wantInId: 'MOD@1',
    wantInPort: 'a',
    wantInValue: 8,
    wantOutId: 'MOD@1',
    wantOutPort: 'c',
    wantOutValue: 2
 },
 {
    input: 10,
    wantInId: 'MOD@1',
    wantInPort: 'a',
    wantInValue: 10,
    wantOutId: 'MOD@1',
    wantOutPort: 'c',
    wantOutValue: 1
 }
];

describe('MOD node', function(){
  var enine;
  var MODId;
  var _activeNodeCache;

  before(function() {
    engine = index.create(DEFAULT_CONF);
    MODId = engine.addNode("MOD","MOD@1");  
    engine.callMethod(MODId,'report',report);
    engine.on(events.NODEOUTPUT, nodeOutputChanged);
    engine.on(events.NODEINPUT, nodeInputChanged);
    var defaultConfig = engine.getNodeConfigs(MODId);
    _activeNodeCache = engine.getActiveNodeCache();
    for (var conf in defaultConfig){
      if (defaultConfig[conf].hasOwnProperty('defaultValue')){
        engine.configNode(MODId,{'b':defaultConfig[conf].defaultValue});  
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

  it('When config b changed, b and c should report to app', function() {
    _activeNodeCache[MODId].updateInput('a', 10, true);
    for (var i = 0; i < configBPortCases.length; i++){
      engine.configNode(MODId,{'b':configBPortCases[i].config});
      expect(reportId).to.be.eql(configBPortCases[i].wantReportId);   
      expect(reportValue).to.be.eql(configBPortCases[i].wantReportValue); 
      expect(outId).to.be.eql(configBPortCases[i].wantOutId);
      expect(outPort).to.be.eql(configBPortCases[i].wantOutPort); 
      expect(outValue).to.be.eql(configBPortCases[i].wantOutValue); 
    }
  });

  it('When input a changed, a and c should report to app', function() {
    engine.configNode(MODId,{'b':3});
    for (var i = 0; i < inputAPortCases.length; i++){
      _activeNodeCache[MODId].updateInput('a', inputAPortCases[i].input, true);
      expect(inId).to.be.eql(inputAPortCases[i].wantInId);
      expect(inPort).to.be.eql(inputAPortCases[i].wantInPort); 
      expect(inValue).to.be.eql(inputAPortCases[i].wantInValue); 
      expect(outId).to.be.eql(inputAPortCases[i].wantOutId);
      expect(outPort).to.be.eql(inputAPortCases[i].wantOutPort); 
      expect(outValue).to.be.eql(inputAPortCases[i].wantOutValue); 
    }
  });
});


