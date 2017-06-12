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

var inputCases = [
 {
    R: 255,
    G: 0,
    B: 0,
    wantReportValue: [255,0,0]
 },
 {
    R: 0,
    G: 255,
    B: 0,
    wantReportValue: [0,255,0]
 },
 {
    R: 0,
    G: 0,
    B: 255,
    wantReportValue: [0,0,255]
 },
 {
    R: 50,
    G: 100,
    B: 255,
    wantReportValue: [50,100,255]
 }
];

describe('COLOR_MIX node', function(){
  var enine;
  var id;
  var _activeNodeCache;

  before(function() {
    engine = index.create(DEFAULT_CONF);
    id = engine.addNode("COLOR_MIX");  
    engine.callMethod(id,'report',report);
    engine.on(events.NODEOUTPUT, nodeOutputChanged);
    engine.on(events.NODEINPUT, nodeInputChanged);
    _activeNodeCache = engine.getActiveNodeCache();
  });

  after(function() {
    engine.removeNode(id);
    engine.removeListener(events.NODEOUTPUT, nodeOutputChanged);
    engine.removeListener(events.NODEINPUT, nodeInputChanged);
    engine.stop();
    engine = null;
  });

  it('When input changed , color should update to outport', function() {
    for (var i = 0; i < inputCases.length; i++){
      _activeNodeCache[id].updateInput('R', inputCases[i].R, true);
      _activeNodeCache[id].updateInput('G', inputCases[i].G, true);
      _activeNodeCache[id].updateInput('B', inputCases[i].B, true);
      expect(reportId).to.be.eql(id);
      expect(reportValue).to.be.eql(inputCases[i].wantReportValue); 
    }
  });
});


