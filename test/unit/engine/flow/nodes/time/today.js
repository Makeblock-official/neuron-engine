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

var inId,inPort,inValue, outId,outYear,outMonth,outDay,outWeek;

function nodeOutputChanged(id, portName, value){
  outId = id;
  switch (portName){
    case 'year':
      outYear = value;
      break;
    case 'month':
      outMonth = value;
      break;
    case 'day':
      outDay = value;
      break;
    case 'week':
      outWeek = value;
      break;
  } 
}

function nodeInputChanged(id, portName, value){
  inId = id;
  inPort = portName;
  inValue = value; 
}

describe('TODAY node', function(){
  var enine;
  var id;
  var _activeNodeCache;

  before(function() {
    engine = index.create(DEFAULT_CONF);
    id = engine.addNode("TODAY");  
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
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1;
    var day =  myDate.getDate();
    var week = myDate.getDay();
    if (week === 0){
      week = 7;
    }
    expect(outId).to.be.eql(id);
    expect(outYear).to.be.eql(year);
    expect(outMonth).to.be.eql(month);
    expect(outDay).to.be.eql(day);
    expect(outWeek).to.be.eql(week);
  });
});


