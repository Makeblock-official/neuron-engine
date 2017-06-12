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
    config: 2,
    wantReportId: 'ADD@1',
    wantReportValue: 2,
    wantOutId: 'ADD@1',
    wantOutPort: 'c',
    wantOutValue: 2
 },
 {
    config: 4,
    wantReportId: 'ADD@1',
    wantReportValue: 4,
    wantOutId: 'ADD@1',
    wantOutPort: 'c',
    wantOutValue: 4
 },
 {
    config: 8,
    wantReportId: 'ADD@1',
    wantReportValue: 8,
    wantOutId: 'ADD@1',
    wantOutPort: 'c',
    wantOutValue: 8
 }
];

var inputAPortCases = [
 {
    input: 1,
    wantInId: 'ADD@1',
    wantInPort: 'a',
    wantInValue: 1,
    wantOutId: 'ADD@1',
    wantOutPort: 'c',
    wantOutValue: 2
 },
 {
    input: 10,
    wantInId: 'ADD@1',
    wantInPort: 'a',
    wantInValue: 10,
    wantOutId: 'ADD@1',
    wantOutPort: 'c',
    wantOutValue: 11
 },
 {
    input: 100,
    wantInId: 'ADD@1',
    wantInPort: 'a',
    wantInValue: 100,
    wantOutId: 'ADD@1',
    wantOutPort: 'c',
    wantOutValue: 101
 }
];

describe('ADD node', function(){
  var enine;
  var addId;
  var _activeNodeCache;

  before(function() {
    engine = index.create(DEFAULT_CONF);
    addId = engine.addNode("ADD","ADD@1");  
    engine.callMethod(addId,'report',report);
    engine.on(events.NODEOUTPUT, nodeOutputChanged);
    engine.on(events.NODEINPUT, nodeInputChanged);
    var defaultConfig = engine.getNodeConfigs(addId);
    _activeNodeCache = engine.getActiveNodeCache();
    for (var conf in defaultConfig){
      if (defaultConfig[conf].hasOwnProperty('defaultValue')){
        engine.configNode(addId,{'b':defaultConfig[conf].defaultValue});  
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
    for (var i = 0; i < configBPortCases.length; i++){
      engine.configNode(addId,{'b':configBPortCases[i].config});
      expect(reportId).to.be.eql(configBPortCases[i].wantReportId);   
      expect(reportValue).to.be.eql(configBPortCases[i].wantReportValue); 
      expect(outId).to.be.eql(configBPortCases[i].wantOutId);
      expect(outPort).to.be.eql(configBPortCases[i].wantOutPort); 
      expect(outValue).to.be.eql(configBPortCases[i].wantOutValue); 
    }
  });

  it('When input a changed, a and c should report to app', function() {
    engine.configNode(addId,{'b':1});
    for (var i = 0; i < inputAPortCases.length; i++){
      _activeNodeCache[addId].updateInput('a', inputAPortCases[i].input, true);
      expect(inId).to.be.eql(inputAPortCases[i].wantInId);
      expect(inPort).to.be.eql(inputAPortCases[i].wantInPort); 
      expect(inValue).to.be.eql(inputAPortCases[i].wantInValue); 
      expect(outId).to.be.eql(inputAPortCases[i].wantOutId);
      expect(outPort).to.be.eql(inputAPortCases[i].wantOutPort); 
      expect(outValue).to.be.eql(inputAPortCases[i].wantOutValue); 
    }
  });
});


