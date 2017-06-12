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
    wantReportId: 'MULTIPLY@1',
    wantReportValue: 3,
    wantOutId: 'MULTIPLY@1',
    wantOutPort: 'c',
    wantOutValue: 6
 },
 {
    config: 4,
    wantReportId: 'MULTIPLY@1',
    wantReportValue: 4,
    wantOutId: 'MULTIPLY@1',
    wantOutPort: 'c',
    wantOutValue: 8
 },
 {
    config: 5,
    wantReportId: 'MULTIPLY@1',
    wantReportValue: 5,
    wantOutId: 'MULTIPLY@1',
    wantOutPort: 'c',
    wantOutValue: 10
 }
];

var inputAPortCases = [
 {
    input: 1,
    wantInId: 'MULTIPLY@1',
    wantInPort: 'a',
    wantInValue: 1,
    wantOutId: 'MULTIPLY@1',
    wantOutPort: 'c',
    wantOutValue: 4
 },
 {
    input: 10,
    wantInId: 'MULTIPLY@1',
    wantInPort: 'a',
    wantInValue: 10,
    wantOutId: 'MULTIPLY@1',
    wantOutPort: 'c',
    wantOutValue: 40
 },
 {
    input: 100,
    wantInId: 'MULTIPLY@1',
    wantInPort: 'a',
    wantInValue: 100,
    wantOutId: 'MULTIPLY@1',
    wantOutPort: 'c',
    wantOutValue: 400
 }
];

describe('MULTIPLY node', function(){
  var enine;
  var MULTIPLYId;
  var _activeNodeCache;

  before(function() {
    engine = index.create(DEFAULT_CONF);
    MULTIPLYId = engine.addNode("MULTIPLY","MULTIPLY@1");  
    engine.callMethod(MULTIPLYId,'report',report);
    engine.on(events.NODEOUTPUT, nodeOutputChanged);
    engine.on(events.NODEINPUT, nodeInputChanged);
    var defaultConfig = engine.getNodeConfigs(MULTIPLYId);
    _activeNodeCache = engine.getActiveNodeCache();
    for (var conf in defaultConfig){
      if (defaultConfig[conf].hasOwnProperty('defaultValue')){
        engine.configNode(MULTIPLYId,{'b':defaultConfig[conf].defaultValue});  
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
    _activeNodeCache[MULTIPLYId].updateInput('a', 2, true);
    for (var i = 0; i < configBPortCases.length; i++){
      engine.configNode(MULTIPLYId,{'b':configBPortCases[i].config});
      expect(reportId).to.be.eql(configBPortCases[i].wantReportId);   
      expect(reportValue).to.be.eql(configBPortCases[i].wantReportValue); 
      expect(outId).to.be.eql(configBPortCases[i].wantOutId);
      expect(outPort).to.be.eql(configBPortCases[i].wantOutPort); 
      expect(outValue).to.be.eql(configBPortCases[i].wantOutValue); 
    }
  });

  it('When input a changed, a and c should report to app', function() {
    engine.configNode(MULTIPLYId,{'b':4});
    for (var i = 0; i < inputAPortCases.length; i++){
      _activeNodeCache[MULTIPLYId].updateInput('a', inputAPortCases[i].input, true);
      expect(inId).to.be.eql(inputAPortCases[i].wantInId);
      expect(inPort).to.be.eql(inputAPortCases[i].wantInPort); 
      expect(inValue).to.be.eql(inputAPortCases[i].wantInValue); 
      expect(outId).to.be.eql(inputAPortCases[i].wantOutId);
      expect(outPort).to.be.eql(inputAPortCases[i].wantOutPort); 
      expect(outValue).to.be.eql(inputAPortCases[i].wantOutValue); 
    }
  });
});


