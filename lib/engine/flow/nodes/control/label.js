var logger = require('../../../../log/log4js').logger;
var iotClient = require('../../iotlib/index');

var node = {
  name: 'LABEL',
  conf: {name: null},
  props: {
    'category': 'control',
    'inPutType': 'text', //text or number
    'in': ['text'],
    'out': [],
    'configs':{ 
      name: { type: 'text',defaultValue: ''}
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
  initNode: function(){
    var that = this;
    var topic = that.id + '@' + 'text';
    that.topics = {};
    that.topics.text = topic;
  },
  init: function() {
    this.validValue.text = '';  
    this.client = iotClient.getClient();
    if (!this.client){
      logger.warn('client not register yet, register first');
      return -1;
    }
  }
};

module.exports = node;
