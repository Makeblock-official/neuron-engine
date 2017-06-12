var logger = require('../../../../log/log4js').logger;
var algorithm = require('../algorithm');
var node = {
  name: 'AND',
  conf: {},
  props: {
    'category': 'common',
    'inputCombine':  true,
    'in': ['a'],
    'out': ['result']
  },
  run: function() {
    var result = false;
    var that = this;
    var inLinks = that.inValues.a;
    if (inLinks.length > 0) {
      result = algorithm.getAndResult(inLinks);
    } 
    that.out('result', result);
  },
  stop: function(){
    this.out('result',false);
  },
  initNode: function(){
    this.run();
  }, 
  getInputPort: function(){
    return 'a';
  },
  init: function() {

  }
};

module.exports = node;
