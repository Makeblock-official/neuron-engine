var expect = require('chai').expect;
var assert = require('chai').assert;
var _ = require('underscore');
var utils = require('../../../lib/protocol/utils');
var data = require('../../../lib/protocol/data');

// test cases for data reader & writer
var cases2 = [{
  buffer: new Int8Array([0x7f, 0x01]).buffer,
  data: [{
    "byte": -1
  }]
}, {
  buffer: new Int8Array([0x7f]).buffer,
  data: [{
    "BYTE": 0x7f
  }]
}, {
  buffer: new Int8Array([0x7f, 0x01]).buffer,
  data: [{
    "BYTE": 0x7f
  }, {
    "BYTE": 0x01
  }]
}, {
  buffer: new Int8Array([0x01, 0x01]).buffer,
  data: [{
    "SHORT": 0x0081
  }]
}, {
  buffer: new Int8Array([0x01, 0x01, 0x01]).buffer,
  data: [{
    "short": 0x004081
  }]
}, {
  buffer: new Int8Array([0x01, 0x00, 0x00, 0x00, 0x00]).buffer,
  data: [{
    "long": 0x00000001
  }]
}, {
  buffer: new Int8Array([0x24, 0x61, 0x75, 0x7c, 0x03]).buffer,
  data: [{
    "float": 1.2300000190734863
  }]
}, {
  buffer: new Int8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x78, 0x3f, 0x00]).buffer,
  data: [{
    "double": 1.0
  }]
}, {
  buffer: new Int8Array([0x7f, 0x01, 0x00, 0x00, 0x00, 0x00]).buffer,
  data: [{
    "BYTE": 0x7f
  }, {
    "long": 0x00000001
  }]
},{
  buffer: new Int8Array([0x01,0x01, 0x05, 0x00, 0x68, 0x65, 0x6c, 0x6c, 0x6f]).buffer,
  data: [{
    'BYTE': 0x01
  }, {
    'string': 'hello'
  }]
}];

describe('data', function() {

  describe('readDataFromBuffer', function() {
    it('should return null if argument is not enough', function() {
      expect(data.readDataFromBuffer()).to.equal(null);
      expect(data.readDataFromBuffer(new ArrayBuffer(1))).to.equal(null);
    });

    it('should return null if there is not suported data type', function() {
      expect(data.readDataFromBuffer(new ArrayBuffer(1), [{
        "test": null
      }])).to.equal(null);
    });

    it('should return correct data array reading from array buffer', function() {
      var want, got;
      for (var i = 0; i < cases2.length; i++) {
        want = _.clone(cases2[i].data);
        // deep clone
        for (var j = 0; j < cases2[i].data.length; j++) {
          want[j] = _.clone(cases2[i].data[j]);
        }

        got = data.readDataFromBuffer(cases2[i].buffer, cases2[i].data);
        expect(got).to.deep.equal(want);
      }
    });
  });

  describe('writeDataToBuffer', function() {
    it('should return null if argument is not enough', function() {
      expect(data.writeDataToBuffer()).to.equal(null);
    });

    it('should return null if there is not suported data type', function() {
      expect(data.writeDataToBuffer([{
        "test": null
      }])).to.equal(null);
    });

    it('should return correct data array writting to array buffer', function() {
      var want, got;
      for (var i = 0; i < cases2.length; i++) {
        want = cases2[i].buffer;
        got = data.writeDataToBuffer(cases2[i].data);
        assert(utils.bufferEqual(got, want), 'want ' + utils.hexBuf(want) + ', but got ' + utils.hexBuf(got));
      }
    });
  });

  describe('calcBufferLength', function() {
    it('should return 0 if data object array is empty', function() {
      expect(data.calcBufferLength([])).to.equal(0);
    });

    it('should return correct buffer length', function() {
      var want, got;
      for (var i = 0; i < cases2.length; i++) {
        want = cases2[i].buffer.byteLength;
        got = data.calcBufferLength(cases2[i].data);
        expect(got).to.equal(want);
      }
    });
  });

});
