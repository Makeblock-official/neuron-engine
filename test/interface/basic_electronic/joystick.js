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


var actual_data = {'X' : {'id' : 0,'port' : null, 'value' : 0}, 
               'Y' : {'id' : 0,'port' : null, 'value' : 0}};

function nodeOutputChanged(id, portName, value){
  if(portName === 'X'){
    actual_data['X']['id'] = id;
    actual_data['X']['port'] = portName;
    actual_data['X']['value'] = value;
  }

  if(portName === 'Y'){
    actual_data['Y']['id'] = id;
    actual_data['Y']['port'] = portName;
    actual_data['Y']['value'] = value;
  }
}

describe('JOYSTICK node', function(){
  var enine;
  var driver;
  var id;
  var _activeNodeCache;
  var client;

  before(function() {
    engine = index.create(DEFAULT_CONF);
    driver = engine.setDriver('mock'); 
    engine.on(events.NODEOUTPUT, nodeOutputChanged);
    //fake joystick
    driver._generate(protocol.serialize({
      no: 1, // block no
      type: 0x10,
      data: [{
        'BYTE': 0x64
      }, {
        'BYTE': 0x07
      }]
    }));
    
    _activeNodeCache = engine.getActiveNodeCache();
    for (var ID in _activeNodeCache){
      if (_activeNodeCache[ID].type === "JOYSTICK"){
        id = ID;
      }
    }
  });

  after(function() {
    engine.removeListener(events.NODEOUTPUT, nodeOutputChanged);
    engine.stop();
    engine = null;
  });

  afterEach(function(){
    actual_data['X']['id'] = 0;
    actual_data['X']['port'] = null;
    actual_data['X']['value'] = 0;
    actual_data['Y']['id'] = 0;
    actual_data['Y']['port'] = null;
    actual_data['Y']['value'] = 0;
    console.log("after each : " + JSON.stringify(actual_data));
  });


  var datadriven = [
    {
      data : {
        no: 1, // block no
        type: 0x64,
        subtype: 0x07,
        data: [{
          'BYTE': 0x01 
        }, {
          'float': 100
        },{
          'float': 50
        }]
      }, 
      result : {
        portx : {
          id: 'JOYSTICK@1',
          port: 'X',
          value: 100
        },
      	porty : {
          id: 'JOYSTICK@1',
          port: 'Y',
          value: 50
        }
      }
    }]

    var datadriven1 = [
    {
      data : {
        no: 1, // block no
        type: 0x64,
        subtype: 0x07,
        data: [{
          'BYTE': 0x01 
        }, {
          'byte': -50
        },{
          'byte': 70
        }]
      }, 
      result : {
        portx : {
          id: 'JOYSTICK@1',
          port: 'X',
          value: -50
        },
        porty : {
          id: 'JOYSTICK@1',
          port: 'Y',
          value: 70
        }
      }
    }]

  datadriven1.forEach(function(data){
    it('When shake the joystick, it should report to app and send to joystick block', function() { 
  	  driver._generate(protocol.serialize(data.data));
      console.log(JSON.stringify(actual_data));
      expect(actual_data["X"]["id"]).to.be.eql(data.result.portx.id);
      console.log("X actual : " + actual_data['X']['value']);
      console.log("X expect : " + data.result.portx.value);
      expect(actual_data['X']['value']).to.be.eql(data.result.portx.value);
      expect(actual_data["X"]["port"]).to.be.eql(data.result.portx.port);


      expect(actual_data["Y"]["id"]).to.be.eql(data.result.porty.id);
      console.log("Y actual : " + actual_data['Y']['value']);
      console.log("Y expect : " + data.result.porty.value);
      expect(actual_data['Y']['value']).to.be.eql(data.result.porty.value);
      expect(actual_data['Y']['port']).to.be.eql(data.result.porty.port);
    });
  });
});