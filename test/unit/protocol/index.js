var expect = require('chai').expect;
var assert = require('chai').assert;
var utils = require('../../../lib/protocol/utils');
var protocol = require('../../../lib/protocol');
var _ = require('underscore');

var cases = [{
  buffer: new Uint8Array([0x02, 0x21, 0x00, 0x00]).buffer,
  package: {
    'no': 2,
    'type': 0x21,
    'data': [{
      "byte": 0
    }]
  }
}, {
  buffer: new Uint8Array([0xff, 0x10, 0x01, 0x01]).buffer,
  package: {
    'no': 0xff,
    'type': 0x10,
    'data': [{
      "BYTE": 0x01
    }, {
      "BYTE": 0x01
    }]
  }
}, {
  buffer: new Uint8Array([0x03, 0x61, 0x01, 0x01, 0x01]).buffer,
  package: {
    'no': 3,
    'type': 0x61,
    'subtype': 0x01,
    'data': [{
      "SHORT": 0x0101
    }]
  }
}, {
  buffer: new Uint8Array([0x02, 0x71, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x78, 0x3f, 0x00]).buffer,
  package: {
    'no': 2,
    'type': 0x71,
    'subtype': 0x02,
    'data': [{
      "double": 1.0
    }]
  }
}]

describe('protocol', function() {
  describe('parse', function() {
    it('should return null if buf is not array buffer', function() {
      expect(protocol.parse()).to.equal(null);
      expect(protocol.parse([123])).to.equal(null);
    });

    it('should return empty null if buf is empty array', function() {
      expect(protocol.parse(new Uint8Array([]).buffer)).to.equal(null);
    });

    it('should return parsed package object', function() {
      var want, got;
      for (var i = 0; i < cases.length; i++) {
        // deep clone
        want = _.clone(cases[i].package);
        for (var j = 0; j < cases[i].package.data.length; j++) {
          want.data[j] = _.clone(cases[i].package.data[j]);
        }
        got = protocol.parse(cases[i].buffer, cases[i].package);
        expect(got).to.deep.equal(want);
      }
    });

  });

  describe('serialize', function() {
    it('should return null if package is invalid', function() {
      expect(protocol.serialize()).to.equal(null);
      expect(protocol.serialize({})).to.equal(null);
    });

    it('should return serialized buffer', function() {
      var got, want;
      for (var i = 0; i < cases.length; i++) {
        got = protocol.serialize(cases[i].package);
        want = cases[i].buffer;
        assert(utils.bufferEqual(got, want), 'want ' + utils.hexBuf(want) + ', but got ' + utils.hexBuf(got));
      }
    });
  });
});