var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);

var core = require('../../../lib/engine/logic/core');
var checksum = require('../../../lib/driver/checksum');
var protocol = require('../../../lib/protocol');
var log = require('../../../lib/log/log4js');

var checksumSendbufCases = [
  {
    buf: {no: 0xff,
          type: 0x10,
          data: [{
                'BYTE': 0
          }]},
    want: [0xf0, 0xff, 0x10, 0x00, 0x0f, 0xf7]
  },
  {
    buf: {no: 0x01,
          type: 0x11
          },
    want: [0xf0, 0x01, 0x11, 0x12, 0xf7]
  },
  {
    buf: {no: 0x02,
          type: 0x65,
          subtype: 0x01,
          data: [{
                'float': 8888
          }]},
    want: [0xf0, 0x02, 0x65, 0x01, 0x00,0x40,0x2b,0x30,0x4, 0x7, 0xf7]
  }
];

var checksumRcvbufCases = [
  {
    buf:  [0xf0, 0xff, 0x10, 0x00, 0x0f, 0xf7],
    want: [0xff, 0x10, 0x00]
  },
  {
    buf:  [0xf0, 0x01, 0x11, 0x12, 0xf7],
    want: [0x01, 0x11]
  },
  {
    buf:  [0xf0, 0x02, 0x65, 0x01, 0x00,0x40,0x2b,0x30,0x4, 0x7, 0xf7],
    want: [0x02, 0x65, 0x01, 0x00,0x40,0x2b,0x30,0x4]
  }
];

var checksumRcvbufErrorCases = [
  {
    buf:  [0xf0, 0xff, 0x10, 0x00, 0x07, 0xf7]
  },
  {
    buf:  [0xf0, 0x01, 0x11, 0x10, 0xf7]
  },
  {
    buf:  [0xf0, 0x02, 0x65, 0x01, 0x00,0x40,0x2b,0x30,0x4, 0xf, 0xf7]
  }
];

function arrayFromArrayBuffer(buffer) {
    var dataView = new Uint8Array(buffer);
    var result = [];
    for (var i = 0; i < dataView.length; i++) {
      result.push(dataView[i]);
    }
    return result;
}

var bufferToArrayBuffer = function(buffer) {
  var result = new ArrayBuffer(buffer.length);
  var view = new Uint8Array(result);
  for (var i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return result;
};

describe('driver/checksum', function() {
  var driver;
  var driverStub = {};
  var logSpy = {};
  var heartbeartPkg = protocol.serialize({no: 0xff,
                                         type: 0x10,
                                         data: [{'BYTE': 0}]
                                        });
  before(function() {
    driver = core.setDriver('mock');
    driverStub._on_data = sinon.spy(driver, "_on_data"); 
    logSpy.warn = sinon.spy(log.logger, "warn");
    logSpy.error = sinon.spy(log.logger, "error");
  });

  it("should checksumSendbuf", function() {
    var buf;
    var tempBuf;
    var view;
    var j,length;
    for (var i = 0; i < checksumSendbufCases.length; i++) {
      tempBuf = checksum.checksumSendbuf(protocol.serialize(checksumSendbufCases[i].buf)); 
      tempBuf = arrayFromArrayBuffer(tempBuf);
      expect(tempBuf).to.deep.equal(checksumSendbufCases[i].want);
    }
  });

  it("should checksumRcvbuf", function() {
    var buf;
    var tempBuf;
    var i;
    for (i = 0; i < checksumRcvbufCases.length; i++) {
      buf = checksumRcvbufCases[i].buf;
      checksum.checksumRcvbuf(buf,driver); 
      tempBuf = bufferToArrayBuffer(checksumRcvbufCases[i].want);
      expect(driverStub._on_data).to.have.been.calledWithExactly(tempBuf);
    } 
    driverStub._on_data.restore(); 
    driverStub._on_data = sinon.spy(driver, "_on_data");
    for (i = 0; i < checksumRcvbufErrorCases.length; i++) {
      buf = checksumRcvbufErrorCases[i].buf;
      checksum.checksumRcvbuf(buf,driver); 
      expect(driverStub._on_data).to.have.not.been.called;
      expect(logSpy.warn).to.have.been.called;
      logSpy.warn.restore();
      logSpy.warn = sinon.spy(log.logger, "warn");
    }  
  });

  after(function() {
    driverStub._on_data.restore(); 
    logSpy.warn.restore();
    logSpy.error.restore();
    core.closeDriver();
  }); 
});


