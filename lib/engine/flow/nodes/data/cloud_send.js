var logger = require('../../../../log/log4js').logger;
var iotClient = require('../../iotlib/index');
var config = require('../../../../config/config');

var node = {
  name: 'CLOUDSEND',
  conf: {bucket: null},
  props: {
    'category': 'data',
    'type': 'text',
    'in': ['data'],
    'out': [],
    'configs':{ 
       bucket: { type: 'text', defaultValue: ''}
    }
  },
  run: function() {
    var that = this;
    if (!that.client){
      that.client = iotClient.getClient();
      if (!that.client){
        logger.warn('client not register yet, register first');
        return -1;
      }
    }
    var bucket = this.conf.bucket;
    var conf = config.getConfig();
    var userKey = conf.userKey;
    var topic = userKey + '/'+ bucket;
    var data = this.in('data');
    this.client.sendMessage(topic, data, function(err){
      if(err) {
        return logger.warn(err);
      }
    });
  },
  init: function() {

  }
};

module.exports = node;
