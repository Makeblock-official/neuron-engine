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

var reportId,reportValue,inId,inPort,inValue, outId,outPort,outValue;

function report (id,value){
  reportId = id;
  reportValue = value;
}

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
    options: 'sheng\nhuo\nwang',
    wantReportValue: ['sheng','huo','wang'],
    selected: 'sheng',
    wantOutPort: 'selected',
    wantOutValue: 'sheng'    
 },
 {
    options: 'sheng\n1\n6',
    wantReportValue: ['1','6','sheng'],
    selected: '6',
    wantOutPort: 'selected',
    wantOutValue: '6'    
 }
];

describe('DROPDOWN node', function(){
  var enine;
  var dropdrownId;
  var _activeNodeCache;
  var client;

  before(function() {
    engine = index.create(DEFAULT_CONF);
    dropdrownId = engine.addNode("DROPDOWN"); 
    engine.callMethod(dropdrownId,'report',report); 
    engine.on(events.NODEOUTPUT, nodeOutputChanged);
    engine.on(events.NODEINPUT, nodeInputChanged);
    _activeNodeCache = engine.getActiveNodeCache();
    _activeNodeCache[dropdrownId].setup();
    client = engine.getIotClient();
  });

  after(function() {
    nodes = engine.getActiveNodes();
    for(var i = 0; i < nodes.length; i++){
      //engine.removeNode(nodes[i].id);
    }
    engine.removeListener(events.NODEOUTPUT, nodeOutputChanged);
    engine.removeListener(events.NODEINPUT, nodeInputChanged);
    engine.stop();
    engine = null;
  });

  it('When config state, should report state to app', function() {
    for (var i = 0; i < configCases.length; i++){
      engine.configNode(dropdrownId,{'options':configCases[i].options});
      engine.callMethod(dropdrownId,'selected',configCases[i].selected); 
      expect(reportId).to.be.eql(dropdrownId);
      expect(reportValue).to.be.eql(configCases[i].wantReportValue); 
      expect(outId).to.be.eql(dropdrownId);
      expect(outPort).to.be.eql(configCases[i].wantOutPort); 
      expect(outValue).to.be.eql(configCases[i].wantOutValue); 
    }
  });

  it('When receive message from cloud, should report state to app', function() {
    var topic = dropdrownId + '@' + 'selected';
    client.sendMessage(topic, 'huo', function(err){
      if(err) {
        console.warn('sendMessage: ' + err); 
      }
    });
    // todo 
  });
});
