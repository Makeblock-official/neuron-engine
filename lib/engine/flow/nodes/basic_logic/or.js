var logger = require('../../../../log/log4js').logger;
var algorithm = require('../algorithm');
var node = {
  name: 'OR',
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
      result = algorithm.getOrResult(inLinks);
    }
    that.out('result', result);
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
