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

var configCases = [
 {
    config: 3,
    wantReportId: 'NUMBER@1',
    wantReportValue: 3,
    wantOutId: 'NUMBER@1',
    wantOutPort: 'number',
    wantOutValue: 3
 },
 {
    config: 4,
    wantReportId: 'NUMBER@1',
    wantReportValue: 4,
    wantOutId: 'NUMBER@1',
    wantOutPort: 'number',
    wantOutValue: 4
 },
 {
    config: 12,
    wantReportId: 'NUMBER@1',
    wantReportValue: 12,
    wantOutId: 'NUMBER@1',
    wantOutPort: 'number',
    wantOutValue: 12
 }
];

var inputCases = [
 {
    input: 1,
    wantInId: 'NUMBER@1',
    wantInPort: 'send',
    wantInValue: 1,
    wantOutId: 'NUMBER@1',
    wantOutPort: 'number',
    wantOutValue: 100
 },
 {
    input: 10,
    wantInId: 'NUMBER@1',
    wantInPort: 'send',
    wantInValue: 10,
    wantOutId: 'NUMBER@1',
    wantOutPort: 'number',
    wantOutValue: 100
 },
 {
    input: 100,
    wantInId: 'NUMBER@1',
    wantInPort: 'send',
    wantInValue: 100,
    wantOutId: 'NUMBER@1',
    wantOutPort: 'number',
    wantOutValue: 100
 }
];

describe('NUMBER node', function(){
  var enine;
  var numberId;
  var _activeNodeCache;

  before(function() {
    engine = index.create(DEFAULT_CONF);
    numberId = engine.addNode("NUMBER","NUMBER@1");  
    engine.callMethod(numberId,'report',report);
    engine.on(events.NODEOUTPUT, nodeOutputChanged);
    engine.on(events.NODEINPUT, nodeInputChanged);
    var defaultConfig = engine.getNodeConfigs(numberId);
    _activeNodeCache = engine.getActiveNodeCache();
    for (var conf in defaultConfig){
      if (defaultConfig[conf].hasOwnProperty('defaultValue')){
        engine.configNode(numberId,{'b':defaultConfig[conf].defaultValue});  
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
    for (var i = 0; i < configCases.length; i++){
      engine.configNode(numberId,{'number':configCases[i].config});
      expect(reportId).to.be.eql(configCases[i].wantReportId);   
      expect(reportValue).to.be.eql(configCases[i].wantReportValue); 
      expect(outId).to.be.eql(configCases[i].wantOutId);
      expect(outPort).to.be.eql(configCases[i].wantOutPort); 
      expect(outValue).to.be.eql(configCases[i].wantOutValue); 
    }
  });

  it('When input a changed, a and c should report to app', function() {
    engine.configNode(numberId,{'number':100});
    for (var i = 0; i < inputCases.length; i++){
      _activeNodeCache[numberId].updateInput('send', inputCases[i].input, true);
      expect(inId).to.be.eql(inputCases[i].wantInId);
      expect(inPort).to.be.eql(inputCases[i].wantInPort); 
      expect(inValue).to.be.eql(inputCases[i].wantInValue); 
      expect(outId).to.be.eql(inputCases[i].wantOutId);
      expect(outPort).to.be.eql(inputCases[i].wantOutPort); 
      expect(outValue).to.be.eql(inputCases[i].wantOutValue);
      _activeNodeCache[numberId].updateInput('send', 0, true); 
    }
  });
});


