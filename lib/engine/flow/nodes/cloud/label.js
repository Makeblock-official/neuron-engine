var logger = require('../../../../log/log4js').logger;
var iotClient = require('../../iotlib/index');

var node = {
  name: 'LABEL',
  conf: {name: null},
  props: {
    'category': 'cloud',
    'inPutType': 'text', //text or number
    'in': ['text'],
    'out': [],
    'configs':{ 
      name: { type: 'text'}
    } 
  },
  run: function() {
    var that = this;
    if (that.client){
      var topic = that.id+ '@' + 'text';
      var data = that.in('text');
      if (data !== null){
        that.client.sendMessage(topic, data, function(err){
          if(err) {
            return logger.warn(err);
          }
        });
      }
    } 
  },
  setup: function(){
    var that = this;
    var topic = that.id + '@' + 'text';
    that.topics = {};
    that.topics.text = topic;
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
