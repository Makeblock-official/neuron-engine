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
    func: 'sin',
    wavelength: 3,
    amplitude: 255,
 },
 {
    func: 'square',
    wavelength: 2,
    amplitude: 100,
 },
 {
    func: 'triangle',
    wavelength: 1,
    amplitude: 50,
 },
 {
    func: 'unknown',
    wavelength: 1,
    amplitude: 50,
 }
];

describe('GENERATOR node', function(){
  var enine;
  var id;
  var _activeNodeCache;
  var clock;

  before(function() {
    clock = sinon.useFakeTimers();
    engine = index.create(DEFAULT_CONF);
    id = engine.addNode("GENERATOR"); 
    engine.on(events.NODEOUTPUT, nodeOutputChanged);
    engine.on(events.NODEINPUT, nodeInputChanged);
    var defaultConfig = engine.getNodeConfigs(id);
    _activeNodeCache = engine.getActiveNodeCache();
  });

  after(function() {
    clock.restore();
    engine.removeNode(id);
    engine.removeListener(events.NODEOUTPUT, nodeOutputChanged);
    engine.removeListener(events.NODEINPUT, nodeInputChanged);
    engine.stop();
    engine = null;
  });

  it('config function', function() {
    for (var i = 0; i < configCases.length; i++){
      engine.configNode(id,{'func':configCases[i].func}); 
      engine.configNode(id,{'wavelength':configCases[i].wavelength});
      engine.configNode(id,{'amplitude':configCases[i].amplitude});

      clock.tick(510);
    }
  });
});


