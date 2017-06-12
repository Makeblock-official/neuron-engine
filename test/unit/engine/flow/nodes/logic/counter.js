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

var inId,aPort,aValue,resetPort,resetValue,outId,bPort,bValue;

function nodeInputChanged(id, portName, value){
  inId = id;
  switch (portName){
    case 'a':
      aPort = portName;
      aValue = value;
      break;
    case 'reset':
      resetPort = portName;
      resetValue = value;
      break;
  }
}

function nodeOutputChanged(id, portName, value){
  outId = id;
  bPort = portName;
  bValue = value;
}

var inputCases = [
 {
    before: 0,
    after: 1,
    b:     1
 },
 {
    before: 0,
    after: 1,
    b:     2
 },
 {
    before: 1,
    after: 1,
    b:     2
 },
 {
    before: 0,
    after: 0,
    b:     2
 },
 {
    before: 0,
    after: 1,
    b:     3
 }
];

describe('COUNTER node', function(){
  var enine;
  var id,numberId;
  var _activeNodeCache;

  before(function() {
    engine = index.create(DEFAULT_CONF);
    id = engine.addNode("COUNTER"); 
    numberId = engine.addNode("NUMBER");
    engine.on(events.NODEOUTPUT, nodeOutputChanged);
    engine.on(events.NODEINPUT, nodeInputChanged);
    _activeNodeCache = engine.getActiveNodeCache();
  });

  after(function() {
    engine.removeNode(id);
    engine.removeNode(numberId);
    engine.removeListener(events.NODEOUTPUT, nodeOutputChanged);
    engine.removeListener(events.NODEINPUT, nodeInputChanged);
    engine.stop();
    engine = null;
  });

  it('When input a changed from <=0 to  > 0, should update outport', function() {
    for (var i = 0; i < inputCases.length; i++){
      _activeNodeCache[id].updateInput('a', inputCases[i].before, true);
      expect(inId).to.be.eql(id);
      expect(aPort).to.be.eql('a'); 
      expect(aValue).to.be.eql(inputCases[i].before); 

      _activeNodeCache[id].updateInput('a', inputCases[i].after, true);
      expect(inId).to.be.eql(id);
      expect(aPort).to.be.eql('a'); 
      expect(aValue).to.be.eql(inputCases[i].after); 

      expect(outId).to.be.eql(id);
      expect(bPort).to.be.eql('b'); 
      expect(bValue).to.be.eql(inputCases[i].b); 
    }
  });

  it('When config reset, should update outport to 0', function() {
    engine.configNode(id,{reset: 'reset'});
    expect(outId).to.be.eql(id);
    expect(bPort).to.be.eql('b'); 
    expect(bValue).to.be.eql(0);     
  });

  it('When input reset change from <=0 to >0, should update outport to 0', function() {
    engine.connect(numberId,'number',id,'reset');
    _activeNodeCache[id].updateInput('a', 0,true);
    _activeNodeCache[id].updateInput('a', 1,true);
    expect(bValue).to.be.eql(1); 

    engine.configNode(numberId,{'number': 0});  
    engine.configNode(numberId,{'number': 1}); 
    expect(bValue).to.be.eql(0);    
  });
});


