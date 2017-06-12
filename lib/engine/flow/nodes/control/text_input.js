var logger = require('../../../../log/log4js').logger;
var iotClient = require('../../iotlib/index');

var node = {
  name: 'TEXT_INPUT',
  conf: {name: null,text: null},
  props: {
    'category': 'control',
    'outPutType': 'text', //text or number
    'in': [],
    'out': ['text'],
    'configs':{ 
      name: { type: 'text',defaultValue: ''},
      text: {type: 'hidden',defaultValue: ''}
    } 
  },
  run: function() {
    var that = this;
    var text = that.conf.text;
    if (text !== null){
      that.out('text',text);
    }
  },

  config: function(){
    this.run();
  },

  initNode: function(){
    var that = this;
    var topic = that.id + '@' + 'text';
    that.topics = {};
    that.topics.text = topic;
    if (that.client){
      that.client.onMessage(topic, function(data){
        that.conf.text = data;
        that.out('text', data);
      }); 
    }   
  },
  stop: function(){
    var that = this;
    var topic = that.id + '@' + 'text';
    if (that.client) {
      that.client.stopReceiveMessage(topic);
    }
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
