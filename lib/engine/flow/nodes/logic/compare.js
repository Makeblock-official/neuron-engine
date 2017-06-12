var logger = require('../../../../log/log4js').logger;

var node = {
  name: 'COMPARE',
  methods: {report: null},
  conf: {operation: null, b: null, lastB: null},
  props: {
    'category': 'logic',
    'in': ['a', 'b'],
    'out': ['result','else'],
    'configs':{
       operation: { type: 'options', options: ['>','>=','<','<=','=','!='],defaultValue: '>'},
       b: { type: 'number', defaultValue: 0}
    }    
  },
  run: function() {
    var that = this;
    var result;
    var operation = that.conf.operation;
    var a = Number(this.in('a'));
    var b;
    var inLinks = that.inNodes.b;
    if (inLinks.length > 0){
      b = Number(that.in('b'));
    } else{
      b = Number(that.conf.b);
      var needRun = false;
      that.updateInput('b',b,needRun);
    }
    if (b !== that.conf.lastB){
      if (that.methods.report){
        that.methods.report(that.id,b);
      }
      that.conf.lastB = b;
    }
    switch (operation) {
      case '>':
        if (a > b) {
          result = a;
        } else {
          result = 0;
        }
        break;
      case '>=':
        if (a >= b) {
          result = a;
        } else {
          result = 0;
        }
        break;
      case '<':
        if (a < b) {
          result = a;
        } else {
          result = 0;
        }
        break;
      case '<=':
        if (a <= b) {
          result = a;
        } else {
          result = 0;
        }
        break;
      case '=':
        if (a === b) {
          result = a;
        } else {
          result = 0;
        }
        break;
      case '!=':
        if (a != b) {
          result = a;
        } else {
          result = 0;
        }
        break;
      default: 
        logger.warn('operation not support: ', operation);
        return;     
    }
    this.out('result', result);
    if (result === a){
      this.out('else', 0);
    } else {
      this.out('else',a);
    }
  },
  init: function() {

  }
};

module.exports = node;

