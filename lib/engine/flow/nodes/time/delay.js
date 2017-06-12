var logger = require('../../../../log/log4js').logger;
var node = {
  name: 'DELAY',
  conf: {delay: null},
  props: {
    'category': 'time',
    'in': ['a'],
    'out': ['b'],
    'configs':{ 
       delay: { type: 'number', defaultValue: 1}
    }
  },
  run: function() {
    var that = this;
    if (that.timeout) {
      logger.warn('clear timeout first');
      clearTimeout(that.timeout);
    }
    var delay = that.conf.delay;
    if (delay > 0){
      delay = delay * 1000;
      that.timeout = setTimeout(exec, delay);
    } else {
      that.out('b', that.in('a'));
    }
    function exec () {
       that.out('b', that.in('a'));
    }
    
  },
  stop: function(){
    var that = this;
    if (that.timeout) {
      clearTimeout(that.timeout);
    }
  },
  initNode: function(){
    this.validValue.a = 0;
    this.out('b', 0);
  },  
  getInputPort: function(){
    return 'a';
  },     
  init: function() {
    this.timeout = null;
  }
};

module.exports = node;
