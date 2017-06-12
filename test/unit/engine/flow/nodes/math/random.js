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
    from: 0,
    to: 50,
    trigger: 'trigger',
    wantInId: 'RANDOM@1',
    wantInPort: 'trigger',
    wantInValue: 0,
    wantOutId: 'RANDOM@1',
    wantOutPort: 'b'
 },
 {
    from: 50,
    to: 500,
    trigger: 'trigger',
    wantInId: 'RANDOM@1',
    wantInPort: 'trigger',
    wantInValue: 0,
    wantOutId: 'RANDOM@1',
    wantOutPort: 'b'
 },
 {
    from: 0,
    to: 100,
    trigger: 'trigger',
    wantInId: 'RANDOM@1',
    wantInPort: 'trigger',
    wantInValue: 0,
    wantOutId: 'RANDOM@1',
    wantOutPort: 'b'
 }
];

describe('RANDOM node', function(){
  var enine;
  var randomId;
  var _activeNodeCache;

  before(function() {
    engine = index.create(DEFAULT_CONF);
    randomId = engine.addNode("RANDOM","RANDOM@1");  
    engine.on(events.NODEOUTPUT, nodeOutputChanged);
    engine.on(events.NODEINPUT, nodeInputChanged);
    _activeNodeCache = engine.getActiveNodeCache();
    var defaultConfig = engine.getNodeConfigs(randomId);
    for (var conf in defaultConfig){
      if (defaultConfig[conf].hasOwnProperty('defaultValue')){
        engine.configNode(randomId,{'b':defaultConfig[conf].defaultValue});  
      }
    }
  });

  after(function() {
    nodes = engine.getActiveNodes();
    for(var i = 0; i < nodes.length; i++){
      engine.removeNode(nodes[i].id);
    }
    engine.removeListener(events.NODEOUTPUT, nodeOutputChanged);
    engine.removeListener(events.NODEINPUT, nodeInputChanged);
    engine.stop();
    engine = null;
  });

  it('When config trigger, should trigger a random and report to app', function() {
    var ret;
    for (var i = 0; i < configCases.length; i++){
      engine.configNode(randomId,{'from':configCases[i].from});
      engine.configNode(randomId,{'to':configCases[i].to});
      engine.configNode(randomId,{'trigger':configCases[i].trigger});
      expect(inId).to.be.eql(configCases[i].wantInId);
      expect(inPort).to.be.eql(configCases[i].wantInPort); 
      expect(inValue).to.be.eql(configCases[i].wantInValue);  
      expect(outId).to.be.eql(configCases[i].wantOutId);
      expect(outPort).to.be.eql(configCases[i].wantOutPort); 
      if ((outValue > configCases[i].from) && (outValue < configCases[i].to)){
        ret = true;
      } else {
        console.warn('outValue: ' + outValue + ' i: ' + i + ' from: ' + configCases[i].from + ' to: ' + configCases[i].to);
        ret = false;
      }
      expect(ret).to.be.eql(true); 
    }
  });

  it('When input trigger, should trigger a random and report to app', function() {
    var ret;
    engine.configNode(randomId,{'from':0});
    engine.configNode(randomId,{'to':100});
    var numberId = engine.addNode("NUMBER"); 
    engine.configNode(numberId,{'number':0});
    engine.connect(numberId,'number',randomId,'trigger'); 
    engine.configNode(numberId,{'number':1});
    expect(inId).to.be.eql(randomId);
    expect(inPort).to.be.eql('trigger'); 
    expect(inValue).to.be.eql(1); 
    expect(outId).to.be.eql(randomId);
    expect(outPort).to.be.eql('b'); 
    if ((outValue > 0) && (outValue < 100)){
      ret = true;
    } else {
      console.warn('outValue: ' + outValue);
      ret = false;
    }
    expect(ret).to.be.eql(true);
  });
});


