var logger = require('../../../../log/log4js').logger;
var iotClient = require('../../iotlib/index');

var node = {
  name: 'CONTROLTOGGLE',
  conf: {name: null,state: null},
  props: {
    'category': 'control',
    'in': [],
    'out': ['state'],
    'configs':{ 
      name: { type: 'text',defaultValue: ''},
      state: {type: 'hidden',defaultValue: false}
    } 
  },
  run: function() {
    var that = this;
    var state = that.conf.state;
    that.out('state',state);
  },
  initNode: function(){
    var that = this;
    that.out('state',that.conf.state);
    var topic = that.id + '@' + 'state';
    that.topics = {};
    that.topics.state = topic;
    if (that.client){
      that.client.onMessage(topic, function(data){
        that.conf.state = data;
        that.out('state', data);
      }); 
    }   
  },

  config: function(){
    this.run();
  },

  stop: function(){
    var that = this;
    var topic = that.id + '@' + 'state';
    if (that.client) {
      that.client.stopReceiveMessage(topic);
    }
  },
  init: function() {
    this.conf.state = false;
    this.client = iotClient.getClient();
    if (!this.client){
      logger.warn('client not register yet, register first');
      return -1;
    }
  }
};

module.exports = node;
