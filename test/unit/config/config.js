var config = require('../../../lib/config/config');
var expect = require('chai').expect;

var testConfig = {
  driver: 'mock', 
  loglevel: 'WARN',
  serverIP: '192.168.2.1',
  socketServerPort: 1234,
  userKey: 'ffff',
  uuid: '111',
  device: 'fff',
  runtime: 'ffff',
};

describe('config', function() {
  describe('setConfig', function() {
    it('should set config to given options', function() {
      config.setConfig({});
      config.setConfig(testConfig);
    });
  });

  describe('getConfig', function() {
    it('should get correct config', function() {
      expect(config.getConfig()).to.deep.equal(testConfig);
    });
  });
});
