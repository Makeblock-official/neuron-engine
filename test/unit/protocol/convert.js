var expect = require('chai').expect;
var assert = require('chai').assert;
var _ = require('underscore');
var utils = require('../../../lib/protocol/utils');
var convert = require('../../../lib/protocol/convert');

// test cases for 7bit/8bit converts.
var cases1 = [{
  bit7: new Uint8Array([0x00, 0x00]).buffer,
  bit8: new Uint8Array([0x00]).buffer
}, {
  bit7: new Uint8Array([0x7f, 0x00]).buffer,
  bit8: new Uint8Array([0x7f]).buffer
}, {
  bit7: new Uint8Array([0x7f, 0x01]).buffer,
  bit8: new Uint8Array([0xff]).buffer
}, {
  bit7: new Uint8Array([0x7f, 0x7f, 0x03]).buffer,
  bit8: new Uint8Array([0xff, 0xff]).buffer
}, {
  bit7: new Uint8Array([0x7f, 0x7f, 0x7f, 0x07]).buffer,
  bit8: new Uint8Array([0xff, 0xff, 0xff]).buffer
}, {
  bit7: new Uint8Array([0x7f, 0x7e, 0x03]).buffer,
  bit8: new Uint8Array([0x7f, 0xff]).buffer
}, {
  bit7: new Uint8Array([0x7f, 0x7f, 0x7d, 0x07]).buffer,
  bit8: new Uint8Array([0xff, 0x7f, 0xff]).buffer
}, {
  bit7: new Uint8Array([0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f]).buffer,
  bit8: new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]).buffer
}, {
  bit7: new Uint8Array([0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x03]).buffer,
  bit8: new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]).buffer
}, {
  bit7: new Uint8Array([0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7d, 0x03]).buffer,
  bit8: new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xfe]).buffer
}];

describe('convert', function() {
  describe('convert7to8bit', function() {

    it('should return null if argument is not an ArrayBuffer', function() {
      expect(convert.convert7to8bit(1)).to.equal(null);
      expect(convert.convert7to8bit('test')).to.equal(null);
      expect(convert.convert7to8bit([1, 2, 3])).to.equal(null);
    });

    it('should return empty ArrayBuffer if argument is an empty ArrayBuffer', function() {
      expect(utils.bufferEqual(convert.convert7to8bit(new ArrayBuffer(0)), convert.convert7to8bit(new ArrayBuffer(0)))).to.be.true;

    });

    it('should return correct 7bit ArrayBuffer', function() {
      for (var i = 0; i < cases1.length; i++) {
        got = convert.convert7to8bit(cases1[i].bit7);
        want = cases1[i].bit8;
        assert(utils.bufferEqual(got, want), 'want ' + utils.hexBuf(want) + ', but got ' + utils.hexBuf(got));
      }
    });

    it('should return correct 7bit ArrayBuffer with offset args', function() {
      for (var i = 0; i < cases1.length; i++) {
        got = convert.convert7to8bit(cases1[i].bit7, 0);
        want = cases1[i].bit8;
        assert(utils.bufferEqual(got, want), 'want ' + utils.hexBuf(want) + ', but got ' + utils.hexBuf(got));
      }
    });

    it('should return correct 7bit ArrayBuffer with offset and length args', function() {
      for (var i = 0; i < cases1.length; i++) {
        got = convert.convert7to8bit(cases1[i].bit7, 0, cases1[i].bit7.byteLength);
        want = cases1[i].bit8;
        assert(utils.bufferEqual(got, want), 'want ' + utils.hexBuf(want) + ', but got ' + utils.hexBuf(got));
      }
    });

  });

  describe('convert8to7bit', function() {

    it('should return null if argument is not an ArrayBuffer', function() {
      expect(convert.convert8to7bit(1)).to.equal(null);
      expect(convert.convert8to7bit('test')).to.equal(null);
      expect(convert.convert8to7bit([1, 2, 3])).to.equal(null);
    });

    it('should return empty ArrayBuffer if argument is an empty ArrayBuffer', function() {
      expect(utils.bufferEqual(convert.convert8to7bit(new ArrayBuffer(0)), convert.convert8to7bit(new ArrayBuffer(0)))).to.be.true;

    });

    it('should return correct 8bit ArrayBuffer', function() {
      var got, want;
      for (var i = 0; i < cases1.length; i++) {
        got = convert.convert8to7bit(cases1[i].bit8);
        want = cases1[i].bit7;
        assert(utils.bufferEqual(got, want), 'want ' + utils.hexBuf(want) + ', but got ' + utils.hexBuf(got));
      }
    });

    it('should return correct 8bit ArrayBuffer with offset args', function() {
      var got, want;
      for (var i = 0; i < cases1.length; i++) {
        got = convert.convert8to7bit(cases1[i].bit8, 0);
        want = cases1[i].bit7;
        assert(utils.bufferEqual(got, want), 'want ' + utils.hexBuf(want) + ', but got ' + utils.hexBuf(got));
      }
    });

    it('should return correct 8bit ArrayBuffer with offset and length args', function() {
      var got, want;
      for (var i = 0; i < cases1.length; i++) {
        got = convert.convert8to7bit(cases1[i].bit8, 0, cases1[i].bit8.byteLength);
        want = cases1[i].bit7;
        assert(utils.bufferEqual(got, want), 'want ' + utils.hexBuf(want) + ', but got ' + utils.hexBuf(got));
      }
    });

  });
});