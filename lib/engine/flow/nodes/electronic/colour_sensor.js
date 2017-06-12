var electronicblock = require('../../electronicblock');

var node = {
  name: 'COLOUR_SENSOR',
  conf: {},
  props: {
    'category': 'electronic',
    'in': [],
    'out': ['R','G','B']
  },
  run: function() {
    var that = this;
    electronicblock.sendBlockCommand('COLOUR_SENSOR','SET_REPORT_MODE',[1,0],that.idx);
  },
  processStatus: function(values) {
    var that = this;
    if ('colour' in values){
      var R = values.colour[0];
      var G = values.colour[1];
      var B = values.colour[2];
      that.out('R', R);
      that.out('G', G);
      that.out('B', B);
    }
  },
  init: function() {

  }
};

module.exports = node;
