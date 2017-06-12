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

var configCases = [
 {
    loop: 'one'
 },
 {
    loop: 'all'
 }
];

var inputCases = [
 {
    input: 'play/pause',
    value: 0,
    wantInPort: 'play/pause',
    wantInValue: 0
 },
 {
    input: 'play/pause',
    value: 1,
    wantInPort: 'play/pause',
    wantInValue: 1
 },
 {
    input: 'prev',
    value: 0,
    wantInPort: 'prev',
    wantInValue: 0
 },
 {
    input: 'prev',
    value: 1,
    wantInPort: 'prev',
    wantInValue: 1
 },
 {
    input: 'next',
    value: 0,
    wantInPort: 'next',
    wantInValue: 0
 },
 {
    input: 'next',
    value: 1,
    wantInPort: 'next',
    wantInValue: 1
 },
 {
    input: 'playSong#',
    value: 1,
    wantInPort: 'playSong#',
    wantInValue: 1
 },
 {
    input: 'playSong#',
    value: 2,
    wantInPort: 'playSong#',
    wantInValue: 2
 }
];


describe('MP3 node', function(){
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
        'BYTE': 0x66
      }, {
        'BYTE': 0x01
      }]
    }));
    _activeNodeCache = engine.getActiveNodeCache();
    for (var ID in _activeNodeCache){
      if (_activeNodeCache[ID].type === "MP3"){
        id = ID;
      }
    }
  });

  after(function() {
/*
    nodes = engine.getActiveNodes();
    for(var i = 0; i < nodes.length; i++){
      engine.removeNode(nodes[i].id);
    }
*/
    engine.removeListener(events.NODEOUTPUT, nodeOutputChanged);
    engine.removeListener(events.NODEINPUT, nodeInputChanged);
    engine.stop();
    engine = null;
  });

  it('When display changed, should report to app and send to block', function() {
    for (var i = 0; i < configCases.length; i++){
      engine.configNode(id,{loop: configCases[i]}.loop);
    }
    for (var j = 0; j < inputCases.length; j++){
      _activeNodeCache[id].updateInput(inputCases[j].input,inputCases[j].value,true);
      expect(inId).to.be.eql(id);
      expect(inPort).to.be.eql(inputCases[j].wantInPort); 
      expect(inValue).to.be.eql(inputCases[j].wantInValue); 
    }
  });
});
