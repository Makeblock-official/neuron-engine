var expect = require('chai').expect;
var sinon = require("sinon");

var index = require('../../../lib/engine/flow/index');
var events = require('../../../lib/engine/flow/events');
var node = require('../../../lib/engine/flow/node');
var protocol = require('../../../lib/protocol');

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

describe('ULTRASONIC node', function(){
  var enine;
  var driver;
  var id;
  var _activeNodeCache;
  var client;

  before(function() {
    engine = index.create(DEFAULT_CONF);
    driver = engine.setDriver('mock'); 
    engine.on(events.NODEOUTPUT, nodeOutputChanged);
    driver._generate(protocol.serialize({
      no: 1, // block no
      type: 0x10,
      data: [{
        'BYTE': 0x63
      }, {
        'BYTE': 0x03
      }]
    }));
    
    _activeNodeCache = engine.getActiveNodeCache();
    for (var ID in _activeNodeCache){
      if (_activeNodeCache[ID].type === "ULTRASONIC"){
        id = ID;
      }
    }
  });

  after(function() {
    engine.removeListener(events.NODEOUTPUT, nodeOutputChanged);
    engine.stop();
    engine = null;
  });

  var datadriven = [
    {
  	  data : {
        no: 1, // block no
        type: 0x63,
        subtype: 0x03,
        data: [{
          'BYTE': 0x01 
        }, {
          'float': 30.0
        }]
      }, 
      result : {
      	id: 'ULTRASONIC@1',
      	port: 'distance',
      	value: 30
      }
    }]

  datadriven.forEach(function(data){
    it('When the ultrasonic sensor status changed, it should report to app and send to ultrasonic block', function() {
  	  driver._generate(protocol.serialize(data.data));
  	  console.log('outId: ' + outId);
  	  console.log('outPort: ' + outPort);
  	  console.log('outValue: ' + outValue);
      
	    expect(outId).to.be.eql(data.result.id);
	    expect(outPort).to.be.eql(data.result.port);
      expect(outValue).to.be.eql(data.result.value);
    });

  });
});