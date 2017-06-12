var logger = require('../../../../log/log4js').logger;
var iotClient = require('../../iotlib/index');

var node = {
  name: 'TEXT_INPUT',
  conf: {name: null,text: null,lastSend: null},
  props: {
    'category': 'cloud',
    'outPutType': 'text', //text or number
    'in': ['send'],
    'out': ['text'],
    'configs':{ 
      name: { type: 'text'},
      text: {type: 'hidden'}
    } 
  },
  run: function() {
    var that = this;
    var text = that.conf.text;
    var inLinks = that.inNodes.send;
    if (text !== null){
      if (inLinks.length === 0){
        that.out('text',text);
      } else {
        var send = that.in('send');
        if ((send > 0) && (that.conf.lastSend <= 0)){
          that.out('text',text);
        }
        that.conf.lastSend = send;   
      }
    }
  },
  setup: function(){
    var that = this;
    var topic = that.id + '@' + 'text';
    that.topics = {};
    that.topics.text = topic;
    if (that.client){
      that.client.onMessage(topic, function(data){
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
