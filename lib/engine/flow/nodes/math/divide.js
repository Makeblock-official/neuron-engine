var logger = require('../../../../log/log4js').logger;
var node = {
  name: 'DIVIDE',
  methods: {report: null},
  conf: {b: null,lastB: null},
  props: {
    'category': 'math',
    'in': ['a'],
    'out': ['c'],
    'configs':{ 
      b: { type: 'number', defaultValue: 2}
    }
  },
  run: function() {
    var that = this;
    var a = this.in('a');
    a = Number(a);
    var b = that.conf.b;
    b = Number(b);
    if (b !== that.conf.lastB){
      if (that.methods.report){
        that.methods.report(that.id,b);
      }
      that.conf.lastB = b;
    }
    if (b === 0){
      this.out('c', Number.NaN);
      return;
    }
    var result = a / b;
    this.out('c', result);
  },
  init: function() {

  }
};

module.exports = node;
