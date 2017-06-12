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
    text: 'lalalla',
    wantOutPort: 'text',
    wantOutValue: 'lalalla'
 },
 {
    text: 'dhfauhd',
    wantOutPort: 'text',
    wantOutValue: 'dhfauhd'
 },
 {
    text: 'hahaha',
    wantOutPort: 'text',
    wantOutValue: 'hahaha'
 }
];

describe('TEXT_INPUT node', function(){
  var enine;
  var textInputId;
  var _activeNodeCache;
  var client;

  before(function() {
    engine = index.create(DEFAULT_CONF);
    textInputId = engine.addNode("TEXT_INPUT");  
    engine.on(events.NODEOUTPUT, nodeOutputChanged);
    engine.on(events.NODEINPUT, nodeInputChanged);
    _activeNodeCache = engine.getActiveNodeCache();
    _activeNodeCache[textInputId].setup();
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

  it('When config state, should report text to app', function() {
    for (var i = 0; i < configCases.length; i++){
      engine.configNode(textInputId,{'text':configCases[i].text});
      expect(outId).to.be.eql(textInputId);
      expect(outPort).to.be.eql(configCases[i].wantOutPort); 
      expect(outValue).to.be.eql(configCases[i].wantOutValue); 
    }
  });

  it('When receive message from cloud, should report state to app', function() {
    var topic = textInputId + '@' + 'text';
    client.sendMessage(topic, 'afduh', function(err){
      if(err) {
        console.warn('sendMessage: ' + err); 
      }
    });
    // todo 
  });
});
