var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);

var core = require('../../../lib/engine/logic/core');
var protocol = require('../../../lib/protocol');
var log = require('../../../lib/log/log4js');
var core = require('../../../lib/engine/logic/core');
var config = require('../../../lib/config/config');
var event = require('../../../lib/event/event');
var events = require('../../../lib/engine/logic/events');
var WebsocketServer = require('./websocketserver').WebsocketServer;
var Ble = require('./cordova_ble');
var Electron = require('./electron');
var MakeblockHD = require('./makeblock_hd');

var wss = new WebsocketServer();

function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}

describe('driver/index', function() {
  var driver;
  var driverStub = {};
  var logSpy = {};
  var heartbeatPkg = protocol.serialize({no: 0xff,
                                         type: 0x10,
                                         data: [{'BYTE': 0}]
                                        });
  var blockPkg = protocol.serialize({no: 0x01,
                                     type: 0x10,
                                     data: [{'BYTE': 0x64,'BYTE': 0x01}]
                                   });  
  beforeEach(function() {
    logSpy.warn = sinon.spy(log.logger, "warn");
    logSpy.error = sinon.spy(log.logger, "error");
    driverStub._send = sinon.spy(driver, "_send");
    driverStub.close = sinon.spy(driver, "close");
  });
  afterEach(function() {
    logSpy.warn.restore();
    logSpy.error.restore();
    driverStub._send.restore();
    driverStub.close.restore();
  });
  before(function() {
    log.setLoglevel('WARN');
  });

  describe('mock driver', function() {
    before(function() {
      driver = core.setDriver('mock');
    });

    it("should call send interface", function() {
      driver.send(heartbeatPkg);
      expect(driverStub._send).to.have.been.called;
    }); 

    it("should call close interface", function() {
      driver.close();
      expect(driverStub.close).to.have.been.called;
      expect(driver.state).to.deep.equal('CLOSED');
    }); 
  });

  describe('websocket driver', function() {
    before(function() {
      config.setConfig({serverIP: '127.0.0.1',socketServerPort: 8082});
      driver = core.setDriver('websocket');
    });
    
    it("should call send interface", function(done) {
      core.getDriverConnectResult().then(function(result) {
        if (result === 1){
          driver.send(heartbeatPkg);
          expect(driverStub._send).to.have.been.called;
          driver.send(heartbeatPkg);
        } 
        done();
      }).done();
    }); 

    it("should call close interface", function() {
      core.closeDriver();
      expect(driverStub.close).to.have.been.called;
    }); 
  });

  describe('CordovaBle driver', function() {
    before(function() {
      global.ble = new Ble();
      driver = core.setDriver('cordovable');
    });

    it("not connected, send failed", function() {
      driver.send(heartbeatPkg);
    }); 
    
    it("should call send interface", function() {
      ble.connectedDeviceID = 'dafd';
      driver.send(heartbeatPkg);
      ble.connectedDeviceID = 'ffff';
      driver.send(heartbeatPkg);
      expect(driverStub._send).to.have.been.called;
    }); 

    it("should call close interface", function() {
      core.closeDriver();
      expect(driverStub.close).to.have.been.called;
    }); 
  });

  describe('electron driver', function() {
    before(function() {
      global.electron = new Electron();
      driver = core.setDriver('electron');
    });

    it("should call send interface", function() {
      driver.send(heartbeatPkg);
      expect(driverStub._send).to.have.been.called;
    }); 

    it("should call close interface", function() {
      driver.close();
      expect(driverStub.close).to.have.been.called;
    }); 
  });

  describe('MakeblockHD driver', function() {
    before(function() {
      var makeblockHD = new MakeblockHD();
      global.window = makeblockHD.window;
      global.TellNative = makeblockHD.tellNative;
      driver = core.setDriver('makeblockhd');
    });

    it("should call send interface", function() {
      driver.send(heartbeatPkg);
      expect(driverStub._send).to.have.been.called;
    }); 

    it("should call close interface", function() {
      driver.close();
      expect(driverStub.close).to.have.been.called;
    }); 
  });

  describe('serial driver', function() {
    before(function() {
      driver = core.setDriver('serial');
    });

    it("should call send interface", function() {
 /*     core.getDriverConnectResult().then(function(result) {
        if (result === 1){
          driver.send(heartbeatPkg);
          expect(driverStub._send).to.have.been.called;
        } else {
          driver.send(heartbeatPkg);
        }
        done();
      }).done();
*/
    }); 

    it("should call close interface", function() {
      driver.close();
      expect(driverStub.close).to.have.been.called;
    });
  });
});
