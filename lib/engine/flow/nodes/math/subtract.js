var node = {
  name: 'SUBTRACT',
  methods: {report: null},
  conf: {b: null,lastB: null},
  props: {
    'category': 'math',
    'in': ['a'],
    'out': ['c'],
    'configs':{ 
      b: { type: 'number', defaultValue: 1}
    }
  },
  run: function() {
    var that = this;
    var a = this.in('a');
    a = Number(a);
    var b = that.conf.b;
    if (b !== that.conf.lastB){
      if (that.methods.report){
        that.methods.report(that.id,b);
      }
      that.conf.lastB = b;
    }
    var result = a - b;
    this.out('c', result);
  },
  init: function() {

  }
};

module.exports = node;
