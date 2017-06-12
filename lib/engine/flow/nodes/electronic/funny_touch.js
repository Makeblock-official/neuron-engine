var electronicblock = require('../../electronicblock');

var node = {
  name: 'FUNNY_TOUCH',
  conf: {},
  props: {
    'category': 'electronic',
    'in': [],
    'out': ['1','2','3','4']
  },
  run: function() {
  },
  processStatus: function(values) {
    var that = this;
    if ('state' in values){
      var value = values.state[0];
      var key1 = value & 0x01;
      that.out('1', key1);
      var key2 = (value >> 1) & 0x01;
      that.out('2', key2);
      var key3 = (value >> 2)  & 0x01;
      that.out('3', key3);
      var key4 = (value >> 3) & 0x01;
      that.out('4', key4);
    }
  },
  init: function() {

  }
};

module.exports = node;
