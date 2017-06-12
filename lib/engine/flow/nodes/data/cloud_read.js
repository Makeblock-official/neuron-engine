var logger = require('../../../../log/log4js').logger;
var iotClient = require('../../iotlib/index');
var config = require('../../../../config/config');

var node = {
  name: 'CLOUDREAD',
  conf: {bucket: null,currentBucket: null},
  props: {
    'category': 'data',
    'in': [],
    'out': ['data'],
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
    var conf = config.getConfig();
    var userKey = conf.userKey;
    var topic;
    if (that.conf.currentBucket) {
      topic = userKey + '/'+ that.conf.currentBucket;
      that.client.stopReceiveMessage(topic);
    }
    that.conf.currentBucket = that.conf.bucket;
    topic = userKey + '/'+ that.conf.bucket;
    that.client.onMessage(topic, function(data){
      that.out('data', data);
    });
  },
  setup: function(){
    var that = this;
    if (that.client){
      var conf = config.getConfig();
      var userKey = conf.userKey;
      that.conf.currentBucket = that.conf.bucket;
      topic = userKey + '/'+ that.conf.bucket;
      that.client.onMessage(topic, function(data){
        that.out('data', data);
      });
    }    
  },
  stop: function(){
    var that = this;
    var conf = config.getConfig();
    var userKey = conf.userKey;
    var topic;
    if (that.conf.currentBucket) {
      topic = userKey + '/'+ that.conf.currentBucket;
      that.client.stopReceiveMessage(topic);
    }
  },
  init: function() {
    this.client = iotClient.getClient();
  }
};

module.exports = node;
