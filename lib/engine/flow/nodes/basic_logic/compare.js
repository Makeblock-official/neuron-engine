var logger = require('../../../../log/log4js').logger;

var node = {
  name: 'COMPARE',
  conf: {operation: null, b: null},
  props: {
    'category': 'common',
    'in': ['a'],
    'out': ['result'],
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
    var b = Number(that.conf.b);
    switch (operation) {
      case '>':
        if (a > b) {
          result = true;
        } else {
          result = false;
        }
        break;
      case '>=':
        if (a >= b) {
          result = true;
        } else {
          result = false;
        }
        break;
      case '<':
        if (a < b) {
          result = true;
        } else {
          result = false;
        }
        break;
      case '<=':
        if (a <= b) {
          result = true;
        } else {
          result = false;
        }
        break;
      case '=':
        if (a === b) {
          result = true;
        } else {
          result = false;
        }
        break;
      case '!=':
        if (a != b) {
          result = true;
        } else {
          result = false;
        }
        break;
      default: 
        logger.warn('operation not support: ', operation);
        return;     
    }
    this.out('result', result);
  },
  getInputPort: function(){
    return 'a';
  },  

  config: function(){
    this.run();
  },

  init: function() {

  }
};

module.exports = node;

