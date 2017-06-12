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
    pattern: {mode: 'static', speed: 'slow', colors: [1,2]}
 },
 {
    pattern: {mode: 'roll', speed: 'middle', colors: [1,2,5]}
 },
 {
    pattern: {mode: 'repeat', speed: 'slow', colors: [1,2,3,4]}
 }
];

var inputCases = [
 {
    before: 0,
    after: 1,
    wantInValue: 1
 },
 {
    before: 0,
    after: 10,
    wantInValue: 10
 },
 {
    before: -1,
    after: 100,
    wantInValue: 100
 },
 {
    before: 1,
    after: 100,
    wantInValue: 100
 }
];

describe('PATTERN node', function(){
  var enine;
  var id;
  var _activeNodeCache;

  before(function() {
    engine = index.create(DEFAULT_CONF);
    id = engine.addNode("PATTERN");  
    engine.callMethod(id,'report',report);
    engine.on(events.NODEOUTPUT, nodeOutputChanged);
    engine.on(events.NODEINPUT, nodeInputChanged);
    var defaultConfig = engine.getNodeConfigs(id);
    _activeNodeCache = engine.getActiveNodeCache();
  });

  after(function() {
    engine.removeNode(id);
    engine.removeListener(events.NODEOUTPUT, nodeOutputChanged);
    engine.removeListener(events.NODEINPUT, nodeInputChanged);
    engine.stop();
    engine = null;
  });

  it('When config pattern changed, pattern should update to outport', function() {
    for (var i = 0; i < configCases.length; i++){
      engine.configNode(id,{'pattern':configCases[i].pattern});
      expect(reportId).to.be.eql(id);   
      expect(reportValue).to.be.eql(configCases[i].pattern.colors); 
      expect(outId).to.be.eql(id);
      expect(outPort).to.be.eql('pattern'); 
      expect(outValue).to.be.eql('{...}'); 
    }
  });

  it('When input send changed from <= 0 to > 0, pattern should update to outport', function() {
    engine.configNode(id,{'pattern':configCases[0].pattern});
    for (var i = 0; i < inputCases.length; i++){
      _activeNodeCache[id].updateInput('send', inputCases[i].before, true);
      _activeNodeCache[id].updateInput('send', inputCases[i].after, true);
      expect(inId).to.be.eql(id);
      expect(inPort).to.be.eql('send'); 
      expect(inValue).to.be.eql(inputCases[i].wantInValue); 
      expect(outId).to.be.eql(id);
      expect(outPort).to.be.eql('pattern'); 
      expect(outValue).to.be.eql('{...}');
    }
  });
});


