var electronicblock = require('../../electronicblock');

var node = {
  name: 'TEMPERATURE',
  conf: {},
  props: {
    'category': 'electronic',
    'in': [],
    'out': ['temperature']
  },
  run: function() {
    var that = this;
    electronicblock.sendBlockCommand('TEMPERATURE','SET_REPORT_MODE',[1,0],that.idx);
  },
  init: function() {

  }
};

module.exports = node;
