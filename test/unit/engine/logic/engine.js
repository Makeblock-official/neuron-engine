var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);

var LogicEngine = require('../../../../lib/engine/logic/engine');
var core = require('../../../../lib/engine/logic/core');
var block = require('../../../../lib/engine/logic/block');
var blocks = require('../../../../lib/blocks/electronic');
var log = require('../../../../lib/log/log4js');
var config = require('../../../../lib/config/config');

var DEFAULT_CONF = {
  driver: 'mock', 
  loglevel: 'WARN',
  serverIP: '192.168.100.1',
  socketServerPort: 8082,
  userKey: '',
  uuid: '',
  device: '',
  runtime: '',
};

var testConfig = {
  driver: 'aaaaa', 
  loglevel: 'WARN',
  serverIP: '192.168.2.1',
  socketServerPort: 1234,
  userKey: 'ffff',
  uuid: '111',
  device: 'fff',
  runtime: 'ffff',
};

describe('logic/engine', function() {
  var engine;
  var coreStub = {};
  var blockStub = {};
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
    engine = new LogicEngine(DEFAULT_CONF);
  });

  describe('setconfig interface', function() {
    it('should set config to given options', function() {
      engine.setConfig(testConfig);
      expect(config.getConfig()).to.deep.equal(testConfig);
    });
  });

  describe('driver interface', function() {
    before(function() {
      coreStub.setDriver = sinon.spy(core, "setDriver");
      coreStub.closeDriver = sinon.spy(core, "closeDriver");
    });

    it('should set setDriver', function() {
      engine.setDriver('mock');
      expect(coreStub.setDriver).to.have.been.called;
    });

    it("should closeDriver", function() {
      engine.closeDriver();
      expect(coreStub.closeDriver).to.have.been.called;
    });
    
    after(function() {
      coreStub.setDriver.restore();
      coreStub.closeDriver.restore();
    });
  });

  describe('registerBlockType interface', function() {
    before(function() {
      blockStub.register = sinon.spy(block, "registerBlockType");
      blockStub.unregister = sinon.spy(block, "unregisterBlockType");
    });

    it("should registerBlockType", function() {
      for (var i = 0; i < blocks.length; i++) {
        engine.registerBlockType(blocks[i]);
        expect(blockStub.register).to.have.been.calledWithExactly(blocks[i]);
      }
    });

    it("should unregisterBlockType", function() {
      for (var i = 0; i < blocks.length; i++) {
        engine.unregisterBlockType(blocks[i].name);
        expect(blockStub.unregister).to.have.been.calledWithExactly(blocks[i].name);
      }
    });

    after(function() {
      blockStub.register.restore();
      blockStub.unregister.restore();
    });
  });

  describe('block interface', function() {
    before(function() {
      coreStub.setBlockStatus = sinon.spy(core, "setBlockStatus");
      coreStub.updateAllBlockStatus = sinon.spy(core, "updateAllBlockStatus");
      coreStub.getBlockStatus = sinon.spy(core, "getBlockStatus");
      coreStub.getBlockSubStatus = sinon.spy(core, "getBlockSubStatus");
      coreStub.getActiveBlocks = sinon.spy(core, "getActiveBlocks");
      coreStub.sendBlockCommand = sinon.spy(core, "sendBlockCommand");
      coreStub.setBlockCommonCommand = sinon.spy(core, "setBlockCommonCommand");
    });

    it('should setBlockStatus', function() {
      engine.setBlockStatus('BUZZER',[1,10],1);
      expect(coreStub.setBlockStatus).to.have.been.calledWithExactly('BUZZER',[1,10],1);
    });
    
    it('should updateAllBlockStatus', function() {
      engine.updateAllBlockStatus();
      expect(coreStub.updateAllBlockStatus).to.have.been.called;
    });

    it('should getBlockStatus', function() {
      engine.getBlockStatus('BUZZER',1);
      expect(coreStub.getBlockStatus).to.have.been.calledWithExactly('BUZZER',1);
    });

    it('should getBlockSubStatus', function() {
      engine.getBlockSubStatus('1_KEY_BUTTON','press',1);
      expect(coreStub.getBlockSubStatus).to.have.been.calledWithExactly('1_KEY_BUTTON','press',1);
    });
    
    it('should getActiveBlocks', function() {
      engine.getActiveBlocks();
      expect(coreStub.getActiveBlocks).to.have.been.called;
    });

    it('should sendBlockCommand', function() {
      engine.sendBlockCommand('4_NUMERIC_DISPLAY','DISPLAY',[8888],1);
      expect(coreStub.sendBlockCommand).to.have.been.calledWithExactly('4_NUMERIC_DISPLAY','DISPLAY',[8888],1);
    });

    it('should setBlockCommonCommand', function() {
      engine.setBlockCommonCommand('4_NUMERIC_DISPLAY','RGB',[0,255,0],1);
      expect(coreStub.setBlockCommonCommand).to.have.been.calledWithExactly('4_NUMERIC_DISPLAY','RGB',[0,255,0],1);
    });

    after(function() {
      coreStub.setBlockStatus.restore();
      coreStub.updateAllBlockStatus.restore();
      coreStub.getBlockStatus.restore();
      coreStub.getBlockSubStatus.restore();
      coreStub.getActiveBlocks.restore();
      coreStub.sendBlockCommand.restore();
      coreStub.setBlockCommonCommand.restore();
    });
  });

  describe('start/heartbeat interface', function() {
    before(function() {
      coreStub.start = sinon.spy(core, "start");
      coreStub.stop = sinon.spy(core, "stop");
      coreStub.sendHeartbeatPkg = sinon.spy(core, "sendHeartbeatPkg");
      coreStub.stopHeartbeatPkg = sinon.spy(core, "stopHeartbeatPkg");
    });

    it('should start', function() {
      engine.start();
      expect(coreStub.start).to.have.been.called;
    });

    it("should stop", function() {
      engine.stop();
      expect(coreStub.stop).to.have.been.called;
    });

    it('should sendHeartbeatPkg', function() {
      engine.sendHeartbeatPkg();
      expect(coreStub.sendHeartbeatPkg).to.have.been.called;
    });

    it("should stopHeartbeatPkg", function() {
      engine.stopHeartbeatPkg();
      expect(coreStub.stopHeartbeatPkg).to.have.been.called;
    });
    
    after(function() {
      coreStub.start.restore();
      coreStub.stop.restore();
      coreStub.sendHeartbeatPkg.restore();
      coreStub.stopHeartbeatPkg.restore();
    });
  });
});
