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
    hue: 0,
    saturation: 0,
    lightness: 0.6
 },
 {
    hue: 0.2,
    saturation: 0.5,
    lightness: 0.3
 },
 {
    hue: 0.4,
    saturation: 0.6,
    lightness: 0.8
 }
];

describe('HSL_MIX node', function(){
  var enine;
  var id;
  var _activeNodeCache;

  before(function() {
    engine = index.create(DEFAULT_CONF);
    id = engine.addNode("HSL_MIX");  
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
      _activeNodeCache[id].updateInput('hue', inputCases[i].hue, true);
      _activeNodeCache[id].updateInput('saturation', inputCases[i].saturation, true);
      _activeNodeCache[id].updateInput('lightness', inputCases[i].lightness, true);
    }
  });
});


