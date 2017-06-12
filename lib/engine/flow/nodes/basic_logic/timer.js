var logger = require('../../../../log/log4js').logger;

var node = {
  name: 'TIMER',
  conf: {interval: null},
  props: {
    'category': 'common',
    'in': ['trigger'],
    'out': ['output'],
    'configs':{ 
       interval: {type: 'number', defaultValue: 1}
    }
  },
  run: function() {
    var that = this;
    var interval = that.conf.interval;
    interval = interval * 1000; 

    function exec () {
      that.out('output', true);  
      if (interval >= 100){
        that.timer = setTimeout(clear, interval);
      }
    }
    function clear () {
      that.out('output', false);
      that.timer = setTimeout(exec, interval);
    }

    if (that.timer) {
        logger.warn('clear timer first');
        clearTimeout(that.timer);
        that.timer = null;
    } 

    var inLinks = that.inNodes.trigger;
    if (inLinks.length === 0){
      exec();
    } else {
      var trigger = that.in('trigger');
      if ( trigger > 0 ){
          exec();
      } else {
        that.out('output', false);
      }
    }
  },

  config: function(){
    this.run();
  },

  stop: function() {
    var that = this;
    if (that.timer) {
      clearTimeout(that.timer);
      that.timer = null;
    }    
  },
  init: function() {
    this.timer = null;
  }
};

module.exports = node;
