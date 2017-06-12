var node = {
  name: 'COUNTER',
  conf: {reset: null, lastValue: null, lastReset: null},
  props: {
    'category': 'logic',
    'in': ['a','reset'],
    'out': ['b'],
    'configs':{ 
       reset: { type: 'command', defaultValue: 'reset'}
    }    
  },
  run: function() {
    var that = this;
    var needRun = false;

    var reset;
    var inLinks = that.inNodes.reset;
    if (inLinks.length > 0){
      reset = that.in('reset');
    } else{
      if (that.conf.reset === 'reset') {
        that.out('b', 0);
        that.conf.reset = 0;
        that.updateInput('reset', 0, needRun); 
        return;
      }
      reset = 0;
    }
    if ((reset > 0) && (that.conf.lastReset <= 0)) {
      that.out('b', 0);
    }
    that.conf.lastReset = reset;

    var a = that.in('a');
    if ((a > 0) && (that.conf.lastValue <= 0)) {
      that.outValues.b++;
      that.out('b', that.outValues.b);
    }
    that.conf.lastValue = a;
  },
  init: function() {
  }
};

module.exports = node;
