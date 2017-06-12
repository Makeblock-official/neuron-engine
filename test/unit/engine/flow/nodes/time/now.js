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

var inId,inPort,inValue, outId,outHour,outMinute,outSecond;

function nodeOutputChanged(id, portName, value){
  outId = id;
  switch (portName){
    case 'hour':
      outHour = value;
      break;
    case 'minute':
      outMinute = value;
      break;
    case 'second':
      outSecond = value;
      break;
  } 
}

function nodeInputChanged(id, portName, value){
  inId = id;
  inPort = portName;
  inValue = value; 
}

describe('NOW node', function(){
  var enine;
  var id;
  var _activeNodeCache;

  before(function() {
    engine = index.create(DEFAULT_CONF);
    id = engine.addNode("NOW");  
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

  it('When setup, update now time', function() {
    _activeNodeCache[id].setup();
    var myDate=new Date();
    var hour = myDate.getHours();
    var minute = myDate.getMinutes();
    var second =  myDate.getSeconds();
    expect(outId).to.be.eql(id);
    expect(outHour).to.be.eql(hour);
    expect(outMinute).to.be.eql(minute);
    expect(outSecond).to.be.eql(second);
  });
});


