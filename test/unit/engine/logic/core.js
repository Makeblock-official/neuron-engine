var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);

var core = require('../../../../lib/engine/logic/core');
var block = require('../../../../lib/engine/logic/block');
var system = require('../../../../lib/engine/logic/system');
var protocol = require('../../../../lib/protocol');
var log = require('../../../../lib/log/log4js');
var blocks = require('../../../../lib/blocks/electronic');
var event = require('../../../../lib/event/event');
var events = require('../../../../lib/engine/logic/events');

var bufferToArrayBuffer = function(buffer) {
  var ab = new ArrayBuffer(buffer.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return ab;
};

describe('logic/core', function() {
  var driver;
  var driverStub = {};
  var logSpy = {};
  beforeEach(function() {
    //clock = sinon.useFakeTimers();
    driverStub.send = sinon.stub(driver, "send");
    driverStub.close = sinon.stub(driver, "close");
    logSpy.warn = sinon.spy(log.logger, "warn");
    logSpy.error = sinon.spy(log.logger, "error");
  });
  afterEach(function() {
    //clock.restore();
    driverStub.send.restore();
    driverStub.close.restore();
    logSpy.warn.restore();
    logSpy.error.restore();
  });
  before(function() {
    log.setLoglevel('WARN');
    for (var i = 0; i < blocks.length; i++) {
      block.registerBlockType(blocks[i]);
    }
    driver = core.setDriver('mock');

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
      no: 3, // block no
      type: 0x10,
      data: [{
        'BYTE': 0x64 // type, 1_KEY_BUTTON
      },{
        'BYTE': 0x02
      }]
    }));

    // some fake data
    driver._generate(protocol.serialize({
      no: 2, // block no
      type: 0x10,
      data: [{
        'BYTE': 0x66 // type, BUZZER
      },{
        'BYTE': 0x02
      }]
    }));

    // some fake data
    driver._generate(protocol.serialize({
      no: 4, // block no
      type: 0x10,
      data: [{
        'BYTE': 0x65 // type, 4_NUMERIC_DISPLAY
      },{
        'BYTE': 0x01
      }]
    }));

    // some fake data
    driver._generate(protocol.serialize({
      no: 1, // block no
      type: 0x20 //handshake
    }));

    // some fake data
    driver._generate(protocol.serialize({
      no: 1, // block no
      type: 0x15, 
      data: [{
        'BYTE': 0x0f
      }]
    }));

    // some fake data
    driver._generate(protocol.serialize({
      no: 1, // block no
      type: 0x15, 
      data: [{
        'BYTE': 0x10
      }]
    }));

    // some fake data
    driver._generate(protocol.serialize({
      no: 1, // block no
      type: 0x15, 
      data: [{
        'BYTE': 0x11
      }]
    }));

    // some fake data
    driver._generate(protocol.serialize({
      no: 1, // block no
      type: 0x15, 
      data: [{
        'BYTE': 0x12
      }]
    }));
  });

  describe('start', function() {
    var clock = sinon.useFakeTimers();
    it("should start sending data", function() {
      core.start();
      driver = core.getDriver();
      clock.tick(510);
      //expect(driverStub.send).to.have.been.calledWithExactly(heartbeartPkg);
      expect(logSpy.error).to.have.not.been.called;
    });
    clock.restore();
  });

  var heartbeartPkg = protocol.serialize(system.DOWN.ARANGE);

  describe('heartbeat', function() {
    var clock;
    before(function() {
      clock = sinon.useFakeTimers();
    });
    after(function() {
      clock.restore();
    });

    it("should not send heartbeat package to driver when stopHeartbeatPkg", function() {
      core.stopHeartbeatPkg();
      clock.tick(510);
      expect(driverStub.send).to.have.not.been.called;
    });

    it("should send heartbeat package to driver when sendHeartbeatPkg", function() {
      core.sendHeartbeatPkg();
      clock.tick(510);
      expect(driverStub.send).to.have.been.calledWithExactly(heartbeartPkg);
      core.stopHeartbeatPkg();
    });
  });

  describe('getActiveBlocks', function() {
    it('should get active blocks', function() {
      expect(core.getActiveBlocks()).to.deep.equal({ 
        '1_KEY_BUTTON': [ 
          { press: [null] }, 
          { press: [null] } 
        ],
        'BUZZER': [null], 
        '4_NUMERIC_DISPLAY': [null] }
      );
    })
  });

  describe('getBlockIdx', function() {
    it('should get correct block index', function() {
      expect(core.getBlockIdx('1_KEY_BUTTON', 1)).to.equals(1);
      expect(core.getBlockIdx('1_KEY_BUTTON', 3)).to.equals(2);
      expect(core.getBlockIdx('1_KEY_BUTTON', 1)).to.equals(1);
    })
  });

  describe('getBlockNo', function() {
    it('should get correct block no', function() {
      expect(core.getBlockNo('1_KEY_BUTTON', 1)).to.equals(1);
      expect(core.getBlockNo('1_KEY_BUTTON', 2)).to.equals(3);
      expect(core.getBlockNo('BUZZER', 1)).to.equals(2);
    })
  });

  describe('getSameTypeBlockCount', function() {
    it('should get count of same type block', function() {
      expect(core.getSameTypeBlockCount('1_KEY_BUTTON')).to.equals(2);
      expect(core.getSameTypeBlockCount('BUZZER')).to.equals(1);
      expect(core.getSameTypeBlockCount('AAAAAA')).to.equals(0);
    })
  });

  describe('setBlockStatus', function() {
    it('should sets a block status', function() {
      core.setBlockStatus('AAAAAA');
      expect(logSpy.warn).to.have.been.called;

      core.setBlockStatus('BUZZER',[1],1);
      expect(logSpy.warn).to.have.been.called;

      core.setBlockStatus('BUZZER',[1,10],1);
      expect(driverStub.send).to.have.been.called;
    })
  });

  describe('sendBlockCommand', function() {
    it('should sends a command to block', function() {
      core.sendBlockCommand('AAAAAA');
      expect(logSpy.warn).to.have.been.called;

      core.sendBlockCommand('4_NUMERIC_DISPLAY','DISPLAY',[1,2],1);
      expect(logSpy.warn).to.have.been.called;

      core.sendBlockCommand('4_NUMERIC_DISPLAY','DISPLAY',[8888],1);
      expect(driverStub.send).to.have.been.called;
    })
  });

  describe('setBlockCommonCommand', function() {
    it('should sends a common command to block', function() {
      // undifine block
      core.sendBlockCommand('AAAAAA');
      expect(logSpy.warn).to.have.been.called;

      // unknow command
      core.sendBlockCommand('4_NUMERIC_DISPLAY','UNKNOW',[],1);
      expect(logSpy.warn).to.have.been.called;

      core.setBlockCommonCommand('4_NUMERIC_DISPLAY','RESET',[],1);
      expect(driverStub.send).to.have.been.called;

      core.setBlockCommonCommand('4_NUMERIC_DISPLAY','BAUDRATE',[0],1);
      expect(driverStub.send).to.have.been.called;

      core.setBlockCommonCommand('4_NUMERIC_DISPLAY','FEEDBACKENABLE',[0],1);
      expect(driverStub.send).to.have.been.called;

      core.setBlockCommonCommand('4_NUMERIC_DISPLAY','HANDSHAKE',[0],1);
      expect(driverStub.send).to.have.been.called;

      core.setBlockCommonCommand('4_NUMERIC_DISPLAY','RGB',[0,255,0],1);
      expect(driverStub.send).to.have.been.called;
    })
  });

  describe('updateAllBlockStatus', function() {
    it('should update all block status', function() {
      var blocks = {};
      event.on(events.BLOCKSTATUS,function(name, idx, values) {
        if (!blocks.hasOwnProperty(name)) {
          blocks[name] = [];
        }
        blocks[name].push({idx: idx, values: values});
      });
      core.updateAllBlockStatus();
      expect(blocks).to.deep.equal({ 
        '1_KEY_BUTTON': [ 
          { idx: 1, values: {press: [null]} }, 
          { idx: 2, values: {press: [null]} } 
        ],
        'BUZZER': [{idx:1, values: [ 1, 10 ]} ], 
        '4_NUMERIC_DISPLAY': [{idx:1, values: null}] 
      });
    })
  });

  describe('getBlockStatus', function() {
    it('should get a block status', function() {
      var status;
      //undefine block
      status = core.getBlockStatus('AAAAAA',1);
      expect(status).to.deep.equal(null);

      //block offline
      status = core.getBlockStatus('BUZZER',3);
      expect(status).to.deep.equal(null);

      status = core.getBlockStatus('BUZZER',1);
      expect(status).to.deep.equal([ 1, 10 ]);
    })
  });

  describe('getBlockSubStatus', function() {
    it('should get a block substatus', function() {
      var status;
      //undefine block
      status = core.getBlockSubStatus('AAAAAA','state',1);
      expect(status).to.deep.equal(null);

      //no this substate
      status = core.getBlockSubStatus('1_KEY_BUTTON','state',1);
      expect(status).to.deep.equal(null);

      //block offline
      status = core.getBlockSubStatus('1_KEY_BUTTON','press',5);
      expect(status).to.deep.equal(null);

      // some fake data
      driver._generate(protocol.serialize({
        no: 1, // block no
        type: 0x64,
        subtype: 0x02,
        data: [{
          'BYTE': 0x01 
        }, {
          'BYTE': 0x01
        }]
      }));
      // some fake data
      driver._generate(protocol.serialize({
        no: 5, // block no
        type: 0x10,
        data: [{
          'BYTE': 0x63 // type, TEMPERATURE
        },{
          'BYTE': 0x01
        }]
      }));
      // some fake data
      driver._generate(protocol.serialize({
        no: 5, // block no
        type: 0x63,  //temperature
        subtype: 0x01,
        data: [{
          'BYTE': 0x01 
        }, {
          'float': 30
        }]
      }));
      status = core.getBlockSubStatus('1_KEY_BUTTON','press',1);
      expect(status).to.deep.equal([1]);
    })
  });

  describe('stop', function() {
    var clock = sinon.useFakeTimers();
    it("should stop sending data", function() {
      core.stop();
      expect(driverStub.close).to.have.been.called;
      clock.tick(510);
      expect(driverStub.send).to.have.not.been.called;
    });
    clock.restore();
  });

  describe('driver', function() {
    it("should setDriver", function() {
      var _driver = core.setDriver('mock');
      expect(_driver.state).to.deep.equal('OPENED');
    });

    it("should getDriver", function() {
      var _driver = core.getDriver();
      expect(_driver.state).to.deep.equal('OPENED');
    });

    it("should closeDriver", function() {
      core.closeDriver();
      var _driver = core.getDriver();
      expect(_driver).to.deep.equal(null);
    });
  });

});
