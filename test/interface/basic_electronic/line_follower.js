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

var actual_data = {'left' : {'id' : 0,'port' : null, 'value' : 0}, 
               'right' : {'id' : 0,'port' : null, 'value' : 0},};

function nodeOutputChanged(id, portName, value){
  console.log('id : ' + id);
  console.log('portName : ' + portName);
  console.log('value : ' + value);
  if(portName === 'left'){
    actual_data['left']['id'] = id;
    actual_data['left']['port'] = portName;
    actual_data['left']['value'] = value;
  }

  if(portName === 'right'){
    actual_data['right']['id'] = id;
    actual_data['right']['port'] = portName;
    actual_data['right']['value'] = value;
  }
}

describe('LINEFOLLOWER node', function(){
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
        'BYTE': 0x04
      }]
    }));
    
    _activeNodeCache = engine.getActiveNodeCache();
    for (var ID in _activeNodeCache){
      if (_activeNodeCache[ID].type === "LINEFOLLOWER"){
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
    actual_data['left']['id'] = 0;
    actual_data['left']['port'] = null;
    actual_data['left']['value'] = 0;
    actual_data['right']['id'] = 0;
    actual_data['right']['port'] = null;
    actual_data['right']['value'] = 0;
    console.log(JSON.stringify(actual_data));
  });

  var datadriven = [
    {
  	  data : {
        no: 1, // block no1
        type: 0x63,
        subtype: 0x04,
        data: [{
          'BYTE': 0x01 
        }, {
          'long': 0
        }]
      }, 
      result : {
        left : {
          id: 'LINEFOLLOWER@1',
          port: 'left',
          value: false
        },
        right : {
          id: 'LINEFOLLOWER@1',
          port: 'right',
          value: false
        }
      }
    },
    {
      data : {
        no: 1, // block no
        type: 0x63,
        subtype: 0x04,
        data: [{
          'BYTE': 0x01 
        }, {
          'long': 1
        }]
      }, 
      result : {
        left : {
          id: 'LINEFOLLOWER@1',
          port: 'left',
          value: true
        },
        right : {
          id: 'LINEFOLLOWER@1',
          port: 'right',
          value: false
        }
      }
    },
    {
      data : {
        no: 1, // block no
        type: 0x63,
        subtype: 0x04,
        data: [{
          'BYTE': 0x01 
        }, {
          'long': 2
        }]
      }, 
      result : {
        left : {
          id: 'LINEFOLLOWER@1',
          port: 'left',
          value: false
        },
        right : {
          id: 'LINEFOLLOWER@1',
          port: 'right',
          value: true
        }
      }
    },
    {
      data : {
        no: 1, // block no
        type: 0x63,
        subtype: 0x04,
        data: [{
          'BYTE': 0x01 
        }, {
          'long': 3
        }]
      }, 
      result : {
        left : {
          id: 'LINEFOLLOWER@1',
          port: 'left',
          value: true
        },
        right : {
          id: 'LINEFOLLOWER@1',
          port: 'right',
          value: true
        }
      }
    }];

  datadriven.forEach(function(data){
    it('Test four status of linefollower, and it will trigger different output combination', function() {
      
  	  driver._generate(protocol.serialize(data.data));
      console.log(JSON.stringify(actual_data));
      expect(actual_data["left"]["id"]).to.be.eql(data.result.left.id);
      console.log("left actual : " + actual_data['left']['value']);
      console.log("left expect : " + data.result.left.value);
      expect(actual_data['left']['value']).to.be.eql(data.result.left.value);
      expect(actual_data["left"]["port"]).to.be.eql(data.result.left.port);


      expect(actual_data["right"]["id"]).to.be.eql(data.result.right.id);
      console.log("right actual : " + actual_data['right']['value']);
      console.log("right expect : " + data.result.right.value);
      expect(actual_data['right']['value']).to.be.eql(data.result.right.value);
      expect(actual_data["right"]["port"]).to.be.eql(data.result.right.port);
    });
  });
});