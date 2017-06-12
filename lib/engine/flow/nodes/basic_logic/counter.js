var logger = require('../../../../log/log4js').logger;
var node = {
  name: 'COUNTER',
  conf: {reset: null, resetAfter: null, lastValue: null, lastReset: null},
  props: {
    'category': 'common',
    'in': ['input','reset'],
    'out': ['output'],
    'configs':{
       reset: { type: 'hidden', defaultValue: 'reset'},
       resetAfter: { type: 'number', defaultValue: 999}
    }
  },
  run: function() {
    var that = this;
     var reset = that.in('reset');
    if ((reset > 0) && (that.conf.lastReset <= 0)) {
      that.conf.lastReset = reset;
      that.out('output', 0);   
      return;
    }
    that.conf.lastReset = reset;   
    var input = that.in('input');
    if ((input > 0) && (that.conf.lastValue <= 0)) {
      that.conf.lastValue = input;
      that.outValues.output++;
      if (that.outValues.output > that.conf.resetAfter){
        that.out('output',0);
      } else {
        that.out('output', that.outValues.output);
      }
    }
    that.conf.lastValue = input;
  },
  initNode: function(){
    var that = this;
    that.out('output',0);
  },    
  getInputPort: function(){
    return 'input';
  }, 
  checkWhitelistInputport: function(port){
    return port==='reset'?true:false;
  },
  config: function(){
    var that = this;
    if (that.conf.reset === 'reset') {
        that.out('output', 0);
        that.conf.reset = 0;
    }
    if (that.outValues.output > that.conf.resetAfter){
      that.out('output',0);
    }    
  },     
  init: function() {
  }
};

module.exports = node;
