var logger = require('../../../../log/log4js').logger;

var node = {
  name: 'TOGGLE',
  conf: {lastValue: null},
  props: {
    'category': 'logic',
    'in': ['a'],
    'out': ['b']
  },
  run: function() {
    var that = this;
    var a = that.in('a');
    if ((a > 0) && (that.conf.lastValue <= 0)) {
      var result  = !(that.outValues.b);
      var output;
      if (result) {
        output = 100;
      } else {
        output =0;
      }
      that.out('b', output);
    }
    that.conf.lastValue = a;
  },
  init: function() {

  }
};

module.exports = node;
