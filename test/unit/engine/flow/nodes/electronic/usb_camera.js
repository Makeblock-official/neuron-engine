var expect = require('chai').expect;
var sinon = require("sinon");

var index = require('../../../../../../lib/engine/flow/index');
var events = require('../../../../../../lib/engine/flow/events');
var node = require('../../../../../../lib/engine/flow/node');
var protocol = require('../../../../../../lib/protocol');
var httpServer = require('./lib/httpserver/index');

var DEFAULT_CONF = {
  driver: 'mock', 
  loglevel: 'WARN',
  serverIP: '127.0.0.1',
  socketServerPort: 8082,
  userKey: 'a2a9705fc33071cc212af979ad9e52d75bc096936fb28fe18d0a6b56067a6bf8',
  uuid: '76FA49A9-78D8-4AE5-82A3-EC960138E908',
  device: '',
  runtime: 'node',
};

var reportId,camerastate,inId,inPort,inValue, outId,outPort,outValue;

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

function reportState(id, state){
  reportId  = id;
  camerastate = state;
}

describe('USB_CAMERA node', function(){
  var enine;
  var driver;
  var id;
  var _activeNodeCache;
  var client;

  before(function() {
    httpServer.start();
    engine = index.create(DEFAULT_CONF);
    driver = engine.setDriver('mock'); 
    engine.on(events.NODEOUTPUT, nodeOutputChanged);
    engine.on(events.NODEINPUT, nodeInputChanged);
    driver._generate(protocol.serialize({
      no: 0, // block no
      type: 0x10,
      data: [{
        'BYTE': 0x66
      }, {
        'BYTE': 0x03
      }]
    }));
    _activeNodeCache = engine.getActiveNodeCache();
    for (var ID in _activeNodeCache){
      if (_activeNodeCache[ID].type === "USB_CAMERA"){
        id = ID;
      }
    }
    engine.callMethod(id,'reportState',reportState);
  });

  after(function() {
    engine.removeNode(id);
    engine.removeListener(events.NODEOUTPUT, nodeOutputChanged);
    engine.removeListener(events.NODEINPUT, nodeInputChanged);
    engine.stop();
    engine = null;
    httpServer.stop();
  });

  it('should open camera', function() { 
     engine.configNode('USB_CAMERA@1',{command: 'open'}); 
     //expect(reportId).to.be.eql(id);
     //expect(camerastate).to.be.eql('opened');
  });

  it('should close camera', function() { 
     engine.configNode('USB_CAMERA@1',{command: 'close'}); 
     //expect(reportId).to.be.eql(id);
     //expect(camerastate).to.be.eql('closed');
  });
});
