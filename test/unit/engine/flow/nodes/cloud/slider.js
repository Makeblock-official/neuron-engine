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
    state: 0,
    wantOutPort: 'state',
    wantOutValue: 0
 },
 {
    state: 1,
    wantOutPort: 'state',
    wantOutValue: 100
 },
 {
    state: 0,
    wantOutPort: 'state',
    wantOutValue: 0
 }
];

describe('SLIDER node', function(){
  var enine;
  var sliderId;
  var _activeNodeCache;
  var client;

  before(function() {
    engine = index.create(DEFAULT_CONF);
    sliderId = engine.addNode("SLIDER");  
    engine.on(events.NODEOUTPUT, nodeOutputChanged);
    engine.on(events.NODEINPUT, nodeInputChanged);
    _activeNodeCache = engine.getActiveNodeCache();
    _activeNodeCache[sliderId].setup();
    client = engine.getIotClient();
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

  it('When config state, should report state to app', function() {
    for (var i = 0; i < configCases.length; i++){
      engine.configNode(sliderId,{'state':configCases[i].state});
      expect(outId).to.be.eql(sliderId);
      expect(outPort).to.be.eql(configCases[i].wantOutPort); 
      expect(outValue).to.be.eql(configCases[i].wantOutValue); 
    }
  });

  it('When receive message from cloud, should report state to app', function() {
    var topic = sliderId + '@' + 'state';
    client.sendMessage(topic, 1, function(err){
      if(err) {
        console.warn('sendMessage: ' + err); 
      }
    });
    // todo 
  });
});
