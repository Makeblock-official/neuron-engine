var electronicblock = require('../../electronicblock');

var node = {
  name: 'ULTRASONIC_SENSOR',
  conf: {},
  props: {
    'category': 'electronic',
    'in': [],
    'out': ['distance']
  },
  run: function() {
    var that = this;
    electronicblock.sendBlockCommand('ULTRASONIC_SENSOR','SET_REPORT_MODE',[1,0],that.idx);
  },
  init: function() {

  }
};

module.exports = node;
