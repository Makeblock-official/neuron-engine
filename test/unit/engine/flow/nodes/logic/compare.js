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

var reportId,reportValue,inId,aPort,aValue,bPort,bValue,outId,resultPort,resulttValue,elsePort,elseValue;

function report (id,value){
  reportId = id;
  reportValue = value;
}


function nodeInputChanged(id, portName, value){
  inId = id;
  switch (portName){
    case 'a':
      aPort = portName;
      aValue = value;
      break;
    case 'b':
      bPort = portName;
      bValue = value;
      break;
  }
}

function nodeOutputChanged(id, portName, value){
  outId = id;
  switch (portName){
    case 'result':
      resultPort = portName;
      resulttValue = value;
      break;
    case 'else':
      elsePort = portName;
      elseValue = value;
      break;
  } 
}

var operation = ['>','>=','<','<=','=','!='];

var inputCases = [
 {
    a: 1,
    b: 1,
    result: [0,1,0,1,1,0],
    else:   [1,0,1,0,0,1]
 },
 {
    a: 1,
    b: 0,
    result: [1,1,0,0,0,1],
    else:   [0,0,1,1,1,0]
 },
 {
    a: 0,
    b: 1,
    result: [0,0,0,0,0,0],
    else:   [0,0,0,0,0,0]
 },
 {
    a: 0,
    b: 0,
    result: [0,0,0,0,0,0],
    else:   [0,0,0,0,0,0]
 }
];

describe('COMPARE node', function(){
  var enine;
  var id,numberId;
  var _activeNodeCache;

  before(function() {
    engine = index.create(DEFAULT_CONF);
    id = engine.addNode("COMPARE"); 
    numberId = engine.addNode("NUMBER");
    engine.callMethod(id,'report',report); 
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

  it('When input a and config b changed, should update outport', function() {
    for (var i = 0; i < inputCases.length; i++){
      _activeNodeCache[id].updateInput('a', inputCases[i].a, true);
      expect(inId).to.be.eql(id);
      expect(aPort).to.be.eql('a'); 
      expect(aValue).to.be.eql(inputCases[i].a); 

      engine.configNode(id,{'b':inputCases[i].b});
      expect(reportId).to.be.eql(id);   
      expect(reportValue).to.be.eql(inputCases[i].b); 
      expect(inId).to.be.eql(id);
      expect(bPort).to.be.eql('b'); 
      expect(bValue).to.be.eql(inputCases[i].b); 

      for (var j = 0; j < operation.length; j++){
        engine.configNode(id,{'operation':operation[j]});
        expect(outId).to.be.eql(id);
        expect(resultPort).to.be.eql('result'); 
        expect(resulttValue).to.be.eql(inputCases[i].result[j]); 
        expect(elsePort).to.be.eql('else'); 
        expect(elseValue).to.be.eql(inputCases[i].else[j]);     
      }
    }
  });

  it('When input a and input b changed, should update outport', function() {
    engine.connect(numberId,'number',id,'b');
    for (var i = 0; i < inputCases.length; i++){
      _activeNodeCache[id].updateInput('a', inputCases[i].a, true);
      expect(inId).to.be.eql(id);
      expect(aPort).to.be.eql('a'); 
      expect(aValue).to.be.eql(inputCases[i].a); 

      engine.configNode(numberId,{'number':inputCases[i].b});
      expect(reportId).to.be.eql(id);   
      expect(reportValue).to.be.eql(inputCases[i].b); 
      expect(inId).to.be.eql(id);
      expect(bPort).to.be.eql('b'); 
      expect(bValue).to.be.eql(inputCases[i].b); 

      for (var j = 0; j < operation.length; j++){
        engine.configNode(id,{'operation':operation[j]});
        expect(outId).to.be.eql(id);
        expect(resultPort).to.be.eql('result'); 
        expect(resulttValue).to.be.eql(inputCases[i].result[j]); 
        expect(elsePort).to.be.eql('else'); 
        expect(elseValue).to.be.eql(inputCases[i].else[j]);     
      }
    }
  });
});


