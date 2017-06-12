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

actual_data = {'temperature' : {'id' : 0,'port' : null, 'value' : 0}, 
               'humidity' : {'id' : 0,'port' : null, 'value' : 0},};

function nodeOutputChanged(id, portName, value){
  console.log('--id--' + id);
  console.log('--portName--' + portName);
  console.log('--value--' + value);
  if(portName === 'temperature'){
    actual_data['temperature']['id'] = id;
    actual_data['temperature']['port'] = portName;
    actual_data['temperature']['value'] = value;
  }

  if(portName === 'humidity'){
    actual_data['humidity']['id'] = id;
    actual_data['humidity']['port'] = portName;
    actual_data['humidity']['value'] = value;
  }
}

describe('TEMPERATUREHUMIDITY node', function(){
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
        'BYTE': 0x07
      }]
    }));
    
    _activeNodeCache = engine.getActiveNodeCache();
    for (var ID in _activeNodeCache){
      if (_activeNodeCache[ID].type === "TEMPERATUREHUMIDITY"){
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
    actual_data['temperature']['id'] = 0;
    actual_data['temperature']['port'] = null;
    actual_data['temperature']['value'] = 0;
    actual_data['humidity']['id'] = 0;
    actual_data['humidity']['port'] = null;
    actual_data['humidity']['value'] = 0;
    //console.log(JSON.stringify(actual_data));
  });

  var datadriven = [
    {
  	  data : {
        no: 1, // block no1
        type: 0x63,
        subtype: 0x07,
        data: [{
          'BYTE': 0x01
        }, {
          'byte' : 4
        }, {
          'BYTE': 0x12
        }]
      }, 
      result : {
        temperature : {
          id: 'TEMPERATUREHUMIDITY@1',
          port: 'temperature',
          value: 4
        },
        humidity : {
          id: 'TEMPERATUREHUMIDITY@1',
          port: 'humidity',
          value: 18
        }
      }
    }];

  datadriven.forEach(function(data){
    it('When humidity and temperature changed, and it will trigger the humidity_temperature node nodeOutputChanged events', function() {
      
  	  driver._generate(protocol.serialize(data.data));
      
      console.log(JSON.stringify(actual_data));
      
      expect(actual_data["temperature"]["id"]).to.be.eql(data.result.temperature.id);
      console.log("temperature actual : " + actual_data['temperature']['value']);
      console.log("temperature expect : " + data.result.temperature.value);
      expect(actual_data['temperature']['value']).to.be.eql(data.result.temperature.value);
      expect(actual_data["temperature"]["port"]).to.be.eql(data.result.temperature.port);


      expect(actual_data["humidity"]["id"]).to.be.eql(data.result.humidity.id);
      console.log("humidity actual : " + actual_data['humidity']['value']);
      console.log("humidity expect : " + data.result.humidity.value);
      expect(actual_data['humidity']['value']).to.be.eql(data.result.humidity.value);
      expect(actual_data["humidity"]["port"]).to.be.eql(data.result.humidity.port);
    });
  });
});