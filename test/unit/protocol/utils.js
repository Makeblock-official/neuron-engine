var expect = require('chai').expect;
var assert = require('chai').assert;
var utils = require('../../../lib/protocol/utils');

describe('utils', function() {
  describe('hexBuf', function() {
    it('should return hex format of ArrayBuffer', function() {
      expect(utils.hexBuf(new Uint8Array([0x00, 0x4f]).buffer)).to.equal('0x004f');
      expect(utils.hexBuf(new Uint8Array([0xff, 0x4f, 0x5e]).buffer)).to.equal('0xff4f5e');
    });
  });

  describe('bufferEqual', function() {
    it('should return false if any argument is not an ArrayBuffer', function() {
      expect(utils.bufferEqual(new Uint8Array([]).buffer, [])).to.be.false;
    });

    it('should return false if two ArrayBuffer is not equal', function() {
      expect(utils.bufferEqual(new Uint8Array([1]).buffer, new Uint8Array([]).buffer)).to.be.false;
      expect(utils.bufferEqual(new Uint8Array([1]).buffer, new Uint8Array([1, 2]).buffer)).to.be.false;
      expect(utils.bufferEqual(new Uint8Array([1, 2, 3, 4]).buffer, new Uint8Array([2, 3, 4, 5]).buffer)).to.be.false;
    });

    it('should return true if two ArrayBuffer is equal', function() {
      expect(utils.bufferEqual(new Uint8Array([]).buffer, new Uint8Array([]).buffer)).to.be.true;
      expect(utils.bufferEqual(new Uint8Array([1]).buffer, new Uint8Array([1]).buffer)).to.be.true;
      expect(utils.bufferEqual(new Uint8Array([1, 3, 4]).buffer, new Uint8Array([1, 3, 4]).buffer)).to.be.true;
    });
  });

  describe('copyBuffer', function() {
    it('should not copy if two buffer is the same', function() {
      var buf = new ArrayBuffer(1);
      expect(utils.copyBuffer(buf, buf)).equal(buf);
    });

    it('should copy from begin with no start index', function() {
      var src = new Uint8Array([1, 2, 3]).buffer;
      var des = new ArrayBuffer(3);
      assert(utils.bufferEqual(src, utils.copyBuffer(src, des)),
        'want :' + utils.hexBuf(src) + ' , des: ' + utils.hexBuf(des));
    });

    it('should copy from index with start index', function() {
      var src = new Uint8Array([1, 2, 3]).buffer;
      var des = new ArrayBuffer(5);
      var want = new Uint8Array([0, 1, 2, 3, 0]).buffer;
      assert(utils.bufferEqual(want, utils.copyBuffer(src, des, 1)),
        'want :' + utils.hexBuf(want) + ' , des: ' + utils.hexBuf(des));
    });

  });
});