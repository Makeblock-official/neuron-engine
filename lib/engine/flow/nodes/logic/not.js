var node = {
  name: 'NOT',
  conf: {},
  props: {
    'category': 'logic',
    'in': ['a'],
    'out': ['c']
  },
  run: function() {
    var result;
    if (this.in('a') <= 0) {
      result = 100;
    } else {
      result = 0;
    }
    this.out('c', result);
  },
  setup: function(){
    var that = this;
    that.run();
  },
  init: function() {
 
  }
};

module.exports = node;
