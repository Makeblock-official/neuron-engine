var electronicblock = require('../../electronicblock');

var node = {
  name: 'LIGHT_SENSOR',
  conf: {},
  props: {
    'category': 'electronic',
    'in': [],
    'out': ['light']
  },
  run: function() {
    var that = this;
    electronicblock.sendBlockCommand('LIGHT_SENSOR','SET_REPORT_MODE',[1,0],that.idx);
  },
  init: function() {

  }
};

module.exports = node;
