var logger = require('../../../../log/log4js').logger;

var node = {
  name: 'TIMER',
  conf: {value: null, interval: null, duty: null},
  props: {
    'category': 'time',
    'in': ['value','interval'],
    'out': ['output'],
    'configs':{ 
       value: { type: 'number', defaultValue: 1},
       interval: { type: 'number', defaultValue: 1},
       duty: { type: 'number', defaultValue: 0.5},
    }
  },
  run: function() {
    var that = this;
    var inLinks;
    if (that.timer) {
      logger.warn('clear timer first');
      clearTimeout(that.timer);
    }

    var value;
    var needRun = false;
    inLinks = that.inNodes.value;
    if (inLinks.length > 0){
      value = that.in('value');
    } else{
      value = that.conf.value;
      that.updateInput('value',value,needRun);
    }

    var interval;
    inLinks = that.inNodes.interval;
    if (inLinks.length > 0){
      interval = that.in('interval');
    } else{
      interval = that.conf.interval;
      that.updateInput('interval',interval,needRun);
    }
    interval = interval * 1000; 

    var duty = that.conf.duty;

    function exec () {
      if (duty >= 1){
        that.out('output', 0);
      } else if (duty <= 0){
         that.out('output', that.in('value'));      
      } else {
        that.out('output', that.in('value')); 
        that.timer = setTimeout(clear, (1-duty)*interval);
      }
    }
    function clear () {
      that.out('output', 0);
      that.timer = setTimeout(exec, duty*interval);
    }

    exec();
  },
  stop: function() {
    var that = this;
    if (that.timer) {
      clearTimeout(that.timer);
    }    
  },
  init: function() {
    this.timer = null;
  }
};

module.exports = node;
