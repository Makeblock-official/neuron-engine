var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);

var FlowEngine = require('../../../../lib/engine/flow/engine');
var core = require('../../../../lib/engine/flow/core');
var electronicblock = require('../../../../lib/engine/flow/electronicblock');
var node = require('../../../../lib/engine/flow/node');
var cloud = require('../../../../lib/engine/flow/cloud');
var iotClient = require('../../../../lib/engine/flow/iotlib/index');
var workflow = require('../../../../lib/engine/flow/flow');
var index = require('../../../../lib/engine/flow/index');
var log = require('../../../../lib/log/log4js');
var config = require('../../../../lib/config/config');
var protocol = require('../../../../lib/protocol');

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

var TEST_CONF = {
  driver: 'mock', 
  loglevel: 'WARN',
  serverIP: '192.168.100.2',
  socketServerPort: 8082,
  userKey: '',
  uuid: '',
  device: 'PC',
  runtime: 'node',
};

var addNodeCase = [
 {
   type: 'ADD'
 },
 {
   type: 'NUMBER',
   id:   'NUMBER@1'
 },

 {
   type: 'BUTTON'
 },

 {
   type: '1_KEY_BUTTON',
   id:   '1_KEY_BUTTON@1',
   idx:  1
 },
 {
   type: 'UNKNOWN'
 }
];

function foundNode(engine, type, id){
    var nodes = engine.getActiveNodes();
    var found = false;
    var j;
    if (id){
      for (j = 0; j < nodes.length; j++){
        if (nodes[j].type === type && nodes[j].id === id){
          found = true; 
          break;
        }
      }
    } else {
      for (j = 0; j < nodes.length; j++){
        if (nodes[j].type === type){
          found = true; 
          break;
       }
     }
   } 
   return found; 
}

describe('flow/engine', function() {
  var driver;
  var engine;
  var coreStub = {};
  var cloudSpy = {};
  var electronicSpy = {};
  var logSpy = {};

  beforeEach(function() {
    logSpy.warn = sinon.spy(log.logger, "warn");
    logSpy.error = sinon.spy(log.logger, "error");
  });
  afterEach(function() {
    logSpy.warn.restore();
    logSpy.error.restore();
  });

  before(function() {
    engine = index.create(DEFAULT_CONF);
    driver = engine.setDriver('mock');
    // some fake data
    driver._generate(protocol.serialize({
      no: 1, // block no
      type: 0x10,
      data: [{
        'BYTE': 0x64 // type, 1_KEY_BUTTON
      }, {
        'BYTE': 0x02
      }]
    }));
    // some fake data
    driver._generate(protocol.serialize({
      no: 2, // block no
      type: 0x10,
      data: [{
        'BYTE': 0x65 // type, 4_NUMERIC_DISPLAY
      }, {
        'BYTE': 0x01
      }]
    }));
  });

  describe('node interface', function() {
    before(function() {
      coreStub.addNode = sinon.spy(core, "addNode");
      coreStub.removeNode = sinon.spy(core, "removeNode");
      coreStub.initNode = sinon.spy(core, "initNode");
      coreStub.connect = sinon.spy(core, "connect");
      coreStub.disconnect = sinon.spy(core, "disconnect");
      coreStub.configNode = sinon.spy(core, "configNode");
      coreStub.getNodeConfigs = sinon.spy(core, "getNodeConfigs");
      coreStub.useNode = sinon.spy(core, "useNode");
      coreStub.unUseNode = sinon.spy(core, "unUseNode");
      coreStub.callMethod = sinon.spy(core, "callMethod");
      coreStub.getActiveNodes = sinon.spy(core, "getActiveNodes");
      cloudSpy.createIotClient =  sinon.spy(cloud, "createIotClient");
      cloudSpy.getActiveCloudNodes =  sinon.spy(cloud, "getActiveCloudNodes");
      electronicSpy.closeDriver =  sinon.spy(electronicblock, "closeDriver");
      electronicSpy.getActiveElectronicBlocks =  sinon.spy(electronicblock, "getActiveElectronicBlocks");
      electronicSpy.getActiveElectronicNodes =  sinon.spy(electronicblock, "getActiveElectronicNodes");
      electronicSpy.updateAllElectronicBlockStatus =  sinon.spy(electronicblock, "updateAllElectronicBlockStatus");
      electronicSpy.start =  sinon.spy(electronicblock, "start");
      electronicSpy.stop =  sinon.spy(electronicblock, "stop");
    });

    it('should setConfig', function() {
      engine.setConfig(TEST_CONF);
      var conf = config.getConfig();
      expect(conf).to.deep.equal(TEST_CONF); 
    });

    it('createIotClient interface', function() {
      // with userKey
      var client = engine.createIotClient(DEFAULT_CONF.userKey);
      expect(cloudSpy.createIotClient).to.have.been.called;
      var temp = engine.getIotClient();
      expect(temp).to.deep.equal(client); 
      cloudSpy.createIotClient.restore(); 

      // with userKey,uuid,have cloud node
      cloudSpy.createIotClient =  sinon.spy(cloud, "createIotClient");
      var button_id = engine.addNode('BUTTON'); 
      client = engine.createIotClient(DEFAULT_CONF.userKey, DEFAULT_CONF.uuid);
      expect(cloudSpy.createIotClient).to.have.been.called; 
      engine.removeNode(button_id);
    });

    it("getClientConnectResult interface", function(done) {
      engine.getClientConnectResult().then(function(result) {
        if (result === 1){

        } 
        done();
      }).done();
    }); 

    it('should getActiveCloudNodes', function() {
      var button_id = engine.addNode('BUTTON'); 
      var nodes = engine.getActiveCloudNodes();
      expect(nodes.length).to.deep.equal(1); 
 
      var drop_id = engine.addNode('DROPDOWN'); 
      nodes = engine.getActiveCloudNodes();
      expect(nodes.length).to.deep.equal(2); 

      engine.removeNode(button_id);
      engine.removeNode(drop_id);
    });

    it('should addNode', function() {
      var found;
      var nodeCache;
      for (var i = 0; i < addNodeCase.length; i++){
        if (addNodeCase[i].id && addNodeCase[i].idx){
          engine.addNode(addNodeCase[i].type, addNodeCase[i].id, addNodeCase[i].idx); 
          found = foundNode(engine, addNodeCase[i].type, addNodeCase[i].id);
          expect(found).to.deep.equal(true); 
        } else if (addNodeCase[i].id){
          engine.addNode(addNodeCase[i].type, addNodeCase[i].id); 
          found = foundNode(engine, addNodeCase[i].type, addNodeCase[i].id);
          expect(found).to.deep.equal(true);
          nodeCache  = engine.getActiveNodeCache(); 
          if (addNodeCase[i].id in nodeCache){
            found = true;
          } else {
            found = false;
          }
          expect(found).to.deep.equal(true);
        } else {
          addNodeCase[i].id = engine.addNode(addNodeCase[i].type); 
          found = foundNode(engine, addNodeCase[i].type);
          if (addNodeCase[i].type in (engine.getNodeTypes())){
            expect(found).to.deep.equal(true); 
          } else {
            expect(found).to.deep.equal(false); 
          }       
        }
      }
    });

    it('should initNode', function() {
      var nodes = engine.getActiveNodes();
      for (var j = 0; j < nodes.length; j++){
        engine.initNode(nodes[j].id);
        expect(coreStub.initNode).to.have.been.called; 
        coreStub.initNode.restore();
        coreStub.initNode = sinon.spy(core, "initNode");     
      }
    });

    it('should useNode', function() {
      var nodes = engine.getActiveNodes();
      for (var j = 0; j < nodes.length; j++){
        engine.useNode(nodes[j].id);
        expect(coreStub.useNode).to.have.been.called; 
        coreStub.useNode.restore();
        coreStub.useNode = sinon.spy(core, "useNode");     
      }
    });

    it('should unUseNode', function() {
      var nodes = engine.getActiveNodes();
      for (var j = 0; j < nodes.length; j++){
        engine.unUseNode(nodes[j].id);
        expect(coreStub.unUseNode).to.have.been.called; 
        coreStub.unUseNode.restore();
        coreStub.unUseNode = sinon.spy(core, "unUseNode");     
      }
    });

    it('should getNodeConfigs', function() {
      var nodes = engine.getActiveNodes();
      for (var j = 0; j < nodes.length; j++){
        engine.getNodeConfigs(nodes[j].id);
        expect(coreStub.getNodeConfigs).to.have.been.called; 
        coreStub.getNodeConfigs.restore();
        coreStub.getNodeConfigs = sinon.spy(core, "getNodeConfigs");     
      }
    });

    it('should configNode', function() {
      engine.configNode('NUMBER@1', {'number': 0});
      expect(coreStub.configNode).to.have.been.called; 
    });

    it('connect/disconnect node', function() {
      var number_id = engine.addNode('NUMBER'); 
      var add_id = engine.addNode('ADD');
      var display_id = engine.addNode('4_NUMERIC_DISPLAY','4_NUMERIC_DISPLAY@1', 1);
 
      engine.connect(number_id, 'number', add_id, 'a');
      expect(coreStub.connect).to.have.been.called;

      //duplicate connect case
      var ret = engine.connect(number_id, 'number', add_id, 'a');
      expect(ret).to.deep.equal(-1);

      engine.disconnect(number_id, 'number', add_id, 'a');
      coreStub.disconnect.restore();
      coreStub.disconnect = sinon.spy(core, "disconnect");
      engine.connect(number_id, 'number', display_id, 'display');
      engine.disconnect(number_id, 'number', display_id, 'display');
      expect(coreStub.disconnect).to.have.been.called;
      engine.removeNode(number_id); 
      engine.removeNode(add_id); 
      engine.removeNode(display_id); 
    });

    it('should callMethod', function() {
      var number_id = engine.addNode('NUMBER'); 
      engine.callMethod(number_id,'report', function (id,number){});
      expect(coreStub.callMethod).to.have.been.called;
      engine.callMethod(number_id,'undefine', function (id,number){});
      engine.removeNode(number_id); 
    });

    it('should getElectronicNodeIdx', function() {
      var idx = engine.getElectronicNodeIdx('1_KEY_BUTTON@1'); 
      expect(idx).to.deep.equal(1); 

      idx = engine.getElectronicNodeIdx('1_KEY_BUTTON@2'); 
      expect(idx).to.deep.equal(null); 
    });

    it('should getActiveElectronicBlocks', function() {
      var nodes = engine.getActiveElectronicBlocks(); 
      expect(electronicSpy.getActiveElectronicBlocks).to.have.been.called;
    });

    it('should getActiveElectronicNodes', function() {
      var nodes = engine.getActiveElectronicNodes(); 
      expect(electronicSpy.getActiveElectronicNodes).to.have.been.called;
    });

    it('should updateAllElectronicBlockStatus', function() {
      engine.updateAllElectronicBlockStatus(); 
      expect(electronicSpy.updateAllElectronicBlockStatus).to.have.been.called;
    });

    it('workflow interface ', function() {
      var flow = engine.exportFlow();
      engine.createWorkflow();
      var found = foundNode(engine, 'NUMBER');
      expect(found).to.deep.equal(false); 
      engine.loadFlow(flow);
      found = foundNode(engine, 'NUMBER');
      expect(found).to.deep.equal(true); 
    });
    
    it('should removeNode', function() {
      var found;
      for (var i = 0; i < addNodeCase.length; i++){
        engine.removeNode(addNodeCase[i].id); 
        found = foundNode(engine, addNodeCase[i].type);
        expect(found).to.deep.equal(false);      
      }
    });

    it('should unregisterNodeType', function() {
      engine.unregisterNodeType('VIRTUAL_1_KEY_BUTTON');
      var nodeType = engine.getNodeTypes();
      var found = false;
      if ('VIRTUAL_1_KEY_BUTTON' in nodeType){
        found = true;
      }
      expect(found).to.deep.equal(false); 
    });

    it('should get Driver ConnectResult', function(done) {
      engine.getDriverConnectResult().then(function(result) {
        expect(result).to.deep.equal(1); 
        done();
      }).done();
    });

    it('should close driver', function() {
      engine.closeDriver();
      expect(electronicSpy.closeDriver).to.have.been.called;
    });

    it('start/stop interface', function() {
      engine.stop();
      expect(electronicSpy.stop).to.have.been.called;
      engine.start();
      expect(electronicSpy.start).to.have.been.called;
    });

    after(function() {
      coreStub.addNode.restore();
      coreStub.removeNode.restore();
      coreStub.initNode.restore();
      coreStub.connect.restore();
      coreStub.disconnect.restore();
      coreStub.configNode.restore();
      coreStub.getNodeConfigs.restore();
      coreStub.useNode.restore();
      coreStub.unUseNode.restore();
      coreStub.callMethod.restore();
      coreStub.getActiveNodes.restore();
      cloudSpy.createIotClient.restore();
      cloudSpy.getActiveCloudNodes.restore();
      electronicSpy.closeDriver.restore();
      electronicSpy.getActiveElectronicBlocks.restore();
      electronicSpy.getActiveElectronicNodes.restore();
      electronicSpy.start.restore();
      electronicSpy.stop.restore();
      electronicSpy.updateAllElectronicBlockStatus.restore();
      engine.stop();
      engine = null;
    });
  });

});
