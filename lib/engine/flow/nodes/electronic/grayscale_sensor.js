var electronicblock = require('../../electronicblock');

var node = {
  name: 'GRAYSCALE_SENSOR',
  conf: {},
  props: {
    'category': 'electronic',
    'in': [],
    'out': ['left', 'right']
  },
  run: function() {
    var that = this;
    electronicblock.sendBlockCommand('GRAYSCALE_SENSOR','SET_REPORT_MODE',[1,0],that.idx);
  },
  processStatus: function(values) {
    var that = this;
    if ('state' in values){
      var value = values.state[0];
      var left = value & 0x01;
      var right = (value >> 1) & 0x01;
      that.out('left', (Number(left) * 100));
      that.out('right', (Number(right) * 100));
    }
  },
  init: function() {

  }
};

module.exports = node;
