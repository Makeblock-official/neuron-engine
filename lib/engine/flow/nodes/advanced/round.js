var logger = require('../../../../log/log4js').logger;
var node = {
  name: 'ROUND',
  conf: {round: null},
  props: {
    'category': 'advanced',
    'in': ['a'],
    'out': ['b'],
    'configs':{
       round: { type: 'options', options: ['round','floor','ceil'],defaultValue: 'round'}
    }   
  },
  run: function() {
    var that = this;
    var n = Number(that.in('a'));
    var conf = that.conf.round;
    switch (conf) {
      case 'floor':
        n = Math.floor(n);
        break;
      case 'ceil':
        n = Math.ceil(n);
        break;
      case 'round':
        n = Math.round(n);
        break;
      default: 
        return;     
    }
    that.out('b', n);
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
