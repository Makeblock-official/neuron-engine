var expect = require('chai').expect;
var sinon = require("sinon");

var index = require('../../../../../../lib/engine/flow/index');
var events = require('../../../../../../lib/engine/flow/events');
var node = require('../../../../../../lib/engine/flow/node');
var protocol = require('../../../../../../lib/protocol');

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

var stringCases = [
 {
    display: 'hi',
    position: 'up'
 },
 {
    display: 'hello',
    position: 'center'
 },
 {
    display: 'Hi',
    position: 'down'
 }
];

var faseCases = [
 {
    display: 1,
    blink: 'blink'
 },
 {
    display: 2,
    blink: 'no blink'
 },
 {
    display: 3,
    blink: 'blink'
 }
];

describe('OLED_DISPLAY node', function(){
  var enine;
  var driver;
  var id;
  var _activeNodeCache;
  var client;

  before(function() {
    engine = index.create(DEFAULT_CONF);
    driver = engine.setDriver('mock'); 
    engine.on(events.NODEOUTPUT, nodeOutputChanged);
    engine.on(events.NODEINPUT, nodeInputChanged);
    driver._generate(protocol.serialize({
      no: 1, // block no
      type: 0x10,
      data: [{
        'BYTE': 0x65
      }, {
        'BYTE': 0x05
      }]
    }));
    _activeNodeCache = engine.getActiveNodeCache();
    for (var ID in _activeNodeCache){
      if (_activeNodeCache[ID].type === "OLED_DISPLAY"){
        id = ID;
      }
    }
  });

  after(function() {
    engine.removeNode(id);
    engine.removeListener(events.NODEOUTPUT, nodeOutputChanged);
    engine.removeListener(events.NODEINPUT, nodeInputChanged);
    engine.stop();
    engine = null;
  });

  it('should display string', function() {
    for (var i = 0; i < stringCases.length; i++){
      _activeNodeCache[id].config({'position':stringCases[i].position});
      _activeNodeCache[id].updateInput('display',stringCases[i].display,true);
      expect(inId).to.be.eql(id);
      expect(inPort).to.be.eql('display'); 
      expect(inValue).to.be.eql(stringCases[i].display); 
    }
  });

  it('should display face', function() {
    for (var i = 0; i < faseCases.length; i++){
      _activeNodeCache[id].config({'blink':faseCases[i].blink});
      _activeNodeCache[id].updateInput('display',faseCases[i].display,true);
      expect(inId).to.be.eql(id);
      expect(inPort).to.be.eql('display'); 
      expect(inValue).to.be.eql(faseCases[i].display); 
    }
  });
});
