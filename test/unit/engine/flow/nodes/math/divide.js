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
    wantReportId: 'DIVIDE@1',
    wantReportValue: 3,
    wantOutId: 'DIVIDE@1',
    wantOutPort: 'c',
    wantOutValue: 4
 },
 {
    config: 4,
    wantReportId: 'DIVIDE@1',
    wantReportValue: 4,
    wantOutId: 'DIVIDE@1',
    wantOutPort: 'c',
    wantOutValue: 3
 },
 {
    config: 12,
    wantReportId: 'DIVIDE@1',
    wantReportValue: 12,
    wantOutId: 'DIVIDE@1',
    wantOutPort: 'c',
    wantOutValue: 1
 }
];

var inputAPortCases = [
 {
    input: 1,
    wantInId: 'DIVIDE@1',
    wantInPort: 'a',
    wantInValue: 1,
    wantOutId: 'DIVIDE@1',
    wantOutPort: 'c',
    wantOutValue: 0.5
 },
 {
    input: 10,
    wantInId: 'DIVIDE@1',
    wantInPort: 'a',
    wantInValue: 10,
    wantOutId: 'DIVIDE@1',
    wantOutPort: 'c',
    wantOutValue: 5
 },
 {
    input: 100,
    wantInId: 'DIVIDE@1',
    wantInPort: 'a',
    wantInValue: 100,
    wantOutId: 'DIVIDE@1',
    wantOutPort: 'c',
    wantOutValue: 50
 }
];

describe('DIVIDE node', function(){
  var enine;
  var divideId;
  var _activeNodeCache;

  before(function() {
    engine = index.create(DEFAULT_CONF);
    divideId = engine.addNode("DIVIDE","DIVIDE@1");  
    engine.callMethod(divideId,'report',report);
    engine.on(events.NODEOUTPUT, nodeOutputChanged);
    engine.on(events.NODEINPUT, nodeInputChanged);
    var defaultConfig = engine.getNodeConfigs(divideId);
    _activeNodeCache = engine.getActiveNodeCache();
    for (var conf in defaultConfig){
      if (defaultConfig[conf].hasOwnProperty('defaultValue')){
        engine.configNode(divideId,{'b':defaultConfig[conf].defaultValue});  
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
    _activeNodeCache[divideId].updateInput('a', 12, true);
    for (var i = 0; i < configBPortCases.length; i++){
      engine.configNode(divideId,{'b':configBPortCases[i].config});
      expect(reportId).to.be.eql(configBPortCases[i].wantReportId);   
      expect(reportValue).to.be.eql(configBPortCases[i].wantReportValue); 
      expect(outId).to.be.eql(configBPortCases[i].wantOutId);
      expect(outPort).to.be.eql(configBPortCases[i].wantOutPort); 
      expect(outValue).to.be.eql(configBPortCases[i].wantOutValue); 
    }
  });

  it('When input a changed, a and c should report to app', function() {
    engine.configNode(divideId,{'b':2});
    for (var i = 0; i < inputAPortCases.length; i++){
      _activeNodeCache[divideId].updateInput('a', inputAPortCases[i].input, true);
      expect(inId).to.be.eql(inputAPortCases[i].wantInId);
      expect(inPort).to.be.eql(inputAPortCases[i].wantInPort); 
      expect(inValue).to.be.eql(inputAPortCases[i].wantInValue); 
      expect(outId).to.be.eql(inputAPortCases[i].wantOutId);
      expect(outPort).to.be.eql(inputAPortCases[i].wantOutPort); 
      expect(outValue).to.be.eql(inputAPortCases[i].wantOutValue); 
    }
  });
});


