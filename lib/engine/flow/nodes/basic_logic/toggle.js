var logger = require('../../../../log/log4js').logger;

var node = {
  name: 'TOGGLE',
  conf: {lastValue: null},
  props: {
    'category': 'common',
    'in': ['input'],
    'out': ['output']
  },
  run: function() {
    var that = this;
    var input = that.in('input');
    if ((input > 0) && (that.conf.lastValue <= 0)) {
      var result  = !(that.outValues.output);
      that.out('output', result);
    }
    that.conf.lastValue = input;
  },
  initNode: function(){
    this.out('output',false);
  },   
  getInputPort: function(){
    return 'input';
  },   
  init: function() {

  }
};

module.exports = node;
