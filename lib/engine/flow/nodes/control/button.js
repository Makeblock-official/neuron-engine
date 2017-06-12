var logger = require('../../../../log/log4js').logger;
var iotClient = require('../../iotlib/index');

var node = {
  name: 'CONTROLBUTTON',
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

  config: function(){
    this.run();
  },
  
  initNode: function(){
    this.out('state',this.conf.state);    
    var that = this;
    var topic = that.id + '@' + 'state';
    that.topics = {};
    that.topics.state = topic;
    if (that.client){
      that.client.onMessage(topic, function(data){
        that.out('state', data);
      }); 
    }   
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
