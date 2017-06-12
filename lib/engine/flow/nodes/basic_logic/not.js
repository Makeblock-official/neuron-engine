var algorithm = require('../algorithm');

var node = {
  name: 'NOT',
  conf: {},
  props: {
    'category': 'common',
    'inputCombine':  true,
    'in': ['a'],
    'out': ['c']
  },
  run: function() {
    var that = this;
    var result = true;
    var inLinks = that.inValues.a;
    if (inLinks.length > 0) {
      result = algorithm.getNotResult(inLinks);
    } 
    this.out('c', result);
  },
  initNode: function(){
    var that = this;
    that.run();
  },
  getInputPort: function(){
    return 'a';
  },  
  init: function() {
 
  }
};

module.exports = node;
