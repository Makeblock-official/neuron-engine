var node = {
  name: 'AND',
  conf: {},
  props: {
    'category': 'logic',
    'in': ['a', 'b'],
    'out': ['c']
  },
  run: function() {
    var result;
    if ((this.in('a') > 0) && (this.in('b') > 0))
    {
      result = 100;
    } else{
      result = 0;
    }
    this.out('c', result);
  },
  init: function() {

  }
};

module.exports = node;
