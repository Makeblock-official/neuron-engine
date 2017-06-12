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
    wantReportId: 'SUBTRACT@1',
    wantReportValue: 3,
    wantOutId: 'SUBTRACT@1',
    wantOutPort: 'c',
    wantOutValue: 7
 },
 {
    config: 4,
    wantReportId: 'SUBTRACT@1',
    wantReportValue: 4,
    wantOutId: 'SUBTRACT@1',
    wantOutPort: 'c',
    wantOutValue: 6
 },
 {
    config: 12,
    wantReportId: 'SUBTRACT@1',
    wantReportValue: 12,
    wantOutId: 'SUBTRACT@1',
    wantOutPort: 'c',
    wantOutValue: -2
 }
];

var inputAPortCases = [
 {
    input: 1,
    wantInId: 'SUBTRACT@1',
    wantInPort: 'a',
    wantInValue: 1,
    wantOutId: 'SUBTRACT@1',
    wantOutPort: 'c',
    wantOutValue: -7
 },
 {
    input: 10,
    wantInId: 'SUBTRACT@1',
    wantInPort: 'a',
    wantInValue: 10,
    wantOutId: 'SUBTRACT@1',
    wantOutPort: 'c',
    wantOutValue: 2
 },
 {
    input: 100,
    wantInId: 'SUBTRACT@1',
    wantInPort: 'a',
    wantInValue: 100,
    wantOutId: 'SUBTRACT@1',
    wantOutPort: 'c',
    wantOutValue: 92
 }
];

describe('SUBTRACT node', function(){
  var enine;
  var SUBTRACTId;
  var _activeNodeCache;

  before(function() {
    engine = index.create(DEFAULT_CONF);
    SUBTRACTId = engine.addNode("SUBTRACT","SUBTRACT@1");  
    engine.callMethod(SUBTRACTId,'report',report);
    engine.on(events.NODEOUTPUT, nodeOutputChanged);
    engine.on(events.NODEINPUT, nodeInputChanged);
    var defaultConfig = engine.getNodeConfigs(SUBTRACTId);
    _activeNodeCache = engine.getActiveNodeCache();
    for (var conf in defaultConfig){
      if (defaultConfig[conf].hasOwnProperty('defaultValue')){
        engine.configNode(SUBTRACTId,{'b':defaultConfig[conf].defaultValue});  
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
    _activeNodeCache[SUBTRACTId].updateInput('a', 10, true);
    for (var i = 0; i < configBPortCases.length; i++){
      engine.configNode(SUBTRACTId,{'b':configBPortCases[i].config});
      expect(reportId).to.be.eql(configBPortCases[i].wantReportId);   
      expect(reportValue).to.be.eql(configBPortCases[i].wantReportValue); 
      expect(outId).to.be.eql(configBPortCases[i].wantOutId);
      expect(outPort).to.be.eql(configBPortCases[i].wantOutPort); 
      expect(outValue).to.be.eql(configBPortCases[i].wantOutValue); 
    }
  });

  it('When input a changed, a and c should report to app', function() {
    engine.configNode(SUBTRACTId,{'b':8});
    for (var i = 0; i < inputAPortCases.length; i++){
      _activeNodeCache[SUBTRACTId].updateInput('a', inputAPortCases[i].input, true);
      expect(inId).to.be.eql(inputAPortCases[i].wantInId);
      expect(inPort).to.be.eql(inputAPortCases[i].wantInPort); 
      expect(inValue).to.be.eql(inputAPortCases[i].wantInValue); 
      expect(outId).to.be.eql(inputAPortCases[i].wantOutId);
      expect(outPort).to.be.eql(inputAPortCases[i].wantOutPort); 
      expect(outValue).to.be.eql(inputAPortCases[i].wantOutValue); 
    }
  });
});


