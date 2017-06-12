var log = require('../../../lib/log/log4js');

describe('log', function() {
  describe('setLogLevel', function() {
    it('should set log print level to error', function() {
      log.setLoglevel('ERROR');
      log.logger.trace('no print');
    });
  })
});