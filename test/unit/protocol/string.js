var string = require('../../../lib/protocol/string');
var utils = require('../../../lib/protocol/utils');
var expect = require('chai').expect;
var assert = require('chai').assert;

var cases = [{
  buffer: new Int8Array([0x01, 0x05, 0x00, 0x68, 0x65, 0x6c, 0x6c, 0x6f]).buffer,
  str: 'hello'
}, {
  buffer: new Int8Array([0x01, 0x00, 0x00]).buffer,
  str: ''
}];


describe('string', function() {
  describe('writeStringToBuffer', function() {
    it('should write string to buffer', function() {
      var got, want;
      for (var i = 0; i < cases.length; i++) {
        got =  string.writeStringToBuffer(cases[i].str);
        want = cases[i].buffer;
        assert(utils.bufferEqual(got, want), 'want ' + utils.hexBuf(want) + ', but got ' + utils.hexBuf(got));
      }
    });
  });

  describe('readStringFromBuffer', function() {
    it('should read string from buffer', function() {
      for (var i = 0; i < cases.length; i++) {
        expect(string.readStringFromBuffer(cases[i].buffer)).to.equal(cases[i].str);
      }
    });
  });

  describe('calcStringByteLen', function() {
    it('should calc the right buffer length of converted string', function() {
      for (var i = 0; i < cases.length; i++) {
        expect(string.calcStringByteLen(cases[i].str)).to.equal(cases[i].buffer.byteLength);
      }
    });
  });
})
