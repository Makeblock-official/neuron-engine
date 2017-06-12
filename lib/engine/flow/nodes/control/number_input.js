var logger = require('../../../../log/log4js').logger;
var iotClient = require('../../iotlib/index');

var node = {
  name: 'NUMBER_INPUT',
  conf: {name: null,number: null},
  props: {
    'category': 'control',
    'in': [],
    'out': ['number'],
    'configs':{ 
      name: { type: 'text',defaultValue: ''},
      number: {type: 'hidden',defaultValue: 0}
    } 
  },
  run: function() {
    var that = this;
    var number = Number(that.conf.number);
    that.out('number',number);
  },

  config: function(){
    this.run();
  },

  initNode: function(){
    var that = this;
    var topic = that.id + '@' + 'number';
    that.topics = {};
    that.topics.number = topic;
    if (that.client){
      that.client.onMessage(topic, function(data){
        that.conf.number = data;
        that.out('number', data);
      }); 
    }   
  },
  stop: function(){
    var that = this;
    var topic = that.id + '@' + 'number';
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
