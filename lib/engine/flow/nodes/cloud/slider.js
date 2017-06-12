var logger = require('../../../../log/log4js').logger;
var iotClient = require('../../iotlib/index');

var node = {
  name: 'SLIDER',
  conf: {name: null,state: null},
  props: {
    'category': 'cloud',
    'in': [],
    'out': ['state'],
    'configs':{ 
      name: { type: 'text'},
      state: {type: 'hidden'}
    } 
  },
  run: function() {
    var that = this;
    var state = that.conf.state;
    that.out('state',(Number(state) * 100));
  },
  setup: function(){
    var that = this;
    var topic = that.id + '@' + 'state';
    that.topics = {};
    that.topics.state = topic;
    if (that.client){
      that.client.onMessage(topic, function(data){
        that.out('state', (Number(data) * 100));
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
    this.client = iotClient.getClient();
    if (!this.client){
      logger.warn('client not register yet, register first');
      return -1;
    }
  }
};

module.exports = node;
