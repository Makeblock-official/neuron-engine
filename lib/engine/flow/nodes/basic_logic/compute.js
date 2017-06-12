var logger = require('../../../../log/log4js').logger;
var algorithm = require('../algorithm');
var node = {
  name: 'COMPUTE',
  conf: {operation: null, b: null},
  props: {
    'category': 'common',
    'in': ['a'],
    'out': ['result'],
    'configs':{
       operation: { type: 'options', options: ['+','-','*','/','%'],defaultValue: '+'},
       b: { type: 'number', defaultValue: 1}
    }    
  },
  run: function() {
    var that = this;
    var result;
    var operation = that.conf.operation;
    var a = Number(this.in('a'));
    var b = Number(that.conf.b);
    switch (operation) {
      case '+':
        result = algorithm.add(a,b);
        break;
      case '-':
        result = algorithm.sub(a,b);
        break;
      case '*':
        result = algorithm.mul(a,b);
        break;
      case '/':
        if (b === 0){
          result = Number.NaN;
        } else {
          result = algorithm.div(a,b);
        }
        break;
      case '%':
        if (b === 0){
          result = Number.NaN;
        } else {
          result = a % b;
        }
        break;
      default: 
        logger.warn('operation not support: ', operation);
        return;     
    }
    this.out('result', result);
  },

  config: function(){
    this.run();
  },

  getInputPort: function(){
    return 'a';
  },    
  init: function() {

  }
};

module.exports = node;

