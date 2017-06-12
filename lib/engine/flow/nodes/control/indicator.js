var logger = require('../../../../log/log4js').logger;
var iotClient = require('../../iotlib/index');

var node = {
  name: 'INDICATOR',
  conf: {name: null},
  props: {
    'category': 'control',
    'in': ['input'],
    'out': [],
    'configs':{ 
      name: { type: 'text',defaultValue: ''}
    } 
  },
  run: function() {
    var that = this;
    if (that.client){
      var topic = that.id + '@' + 'input';
      var data = that.in('input');
      if (data !== null){
        that.client.sendMessage(topic, data, function(err){
          if(err) {
            return logger.warn(err);
          }
        });
      }
    } 
  },
  initNode: function(){
    var that = this;
    var topic = that.id + '@' + 'input';
    that.topics = {};
    that.topics.input = topic;
  },
  init: function() {
    this.client = iotClient.getClient();
    if (!this.client){
      logger.warn('client not register yet, register first');
      return -1;
    }
  }
};

module.exports = node;
