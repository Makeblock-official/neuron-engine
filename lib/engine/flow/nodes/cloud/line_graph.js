var logger = require('../../../../log/log4js').logger;
var iotClient = require('../../iotlib/index');
var core = require('../../core');

var node = {
  name: 'LINE_GRAPH',
  conf: {name: null, sampleinterval: null, lastInterval: null, cache: null},
  props: {
    'category': 'cloud',
    'in': ['input'],
    'out': [],
    'configs':{ 
      name: { type: 'text'},
      sampleinterval: {type: 'number', defaultValue: 0.5}
    }    
  },
  run: function() {
    var that = this;

    var sampleinterval = that.conf.sampleinterval;
    if (sampleinterval != that.conf.lastInterval){
      if (that.interval){
        clearInterval(that.interval);
        that.interval = null;
      }
      that.interval = setInterval(report,sampleinterval*1000);  
      that.conf.lastInterval = sampleinterval; 
    }  

    function report(){
      var input = Number(that.in('input'));
      for (var i = 0; i < 29; i++){
        that.conf.cache[i] = that.conf.cache[i+1]; 
      }
      that.conf.cache[29] = input;
      core.onNodeOutputChanged(that.id, 'data', that.conf.cache);
      if (that.client){
        var topic = that.id + '@' + 'input';
        that.client.sendMessage(topic, input, function(err){
          if(err) {
            return logger.warn(err);
          }
        });
      }
    }
  },
  setup: function() {
    var that = this;
    that.conf.cache = [];
    for (var i = 0; i < 30; i++){
      that.conf.cache[i] = null;   
    }
    var topic = that.id + '@' + 'input';
    that.topics = {};
    that.topics.input = topic;
  },
  stop: function(){
    var that = this;
    if (that.interval){
      clearInterval(that.interval);
    }
  },
  init: function() {
    this.interval = null;
    this.client = iotClient.getClient();
    if (!this.client){
      logger.warn('client not register yet, register first');
      return -1;
    }
  }
};

module.exports = node;
