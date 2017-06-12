var _ = require('underscore');

var config = null;

var DEFAULT_CONF = {
  driver: 'mock', 
  loglevel: 'ERROR',
  serverIP: '192.168.100.1',
  tcpsocketPort: 8082,
  websocketPort: 8084,
  localTcpsocketPort: 8085,
  userKey: '',
  uuid: '',
  device: '',
  runtime: '',
};

function setConfig (conf) {
  if (config === null) {
    config = _.extend(DEFAULT_CONF, conf || {});
  } else {
    config = _.extend(config, conf || {});
  }
}

function getConfig () {
  return config;
}


exports.setConfig = setConfig;
exports.getConfig = getConfig;
