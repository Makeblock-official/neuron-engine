var electronicblock = require('../../electronicblock');

var node = {
  name: '1_KEY_BUTTON',
  conf: {},
  props: {
    'category': 'electronic',
    'in': [],
    'out': ['press']
  },
  run: function() {
    var that = this;
    electronicblock.sendBlockCommand('1_KEY_BUTTON','SET_REPORT_MODE',[1,0],that.idx);
  },
  processStatus: function(value) {
    var that = this;
    if ('press' in value){
      that.out('press', (Number(value.press[0]) * 100));
    }
  },
  init: function() {

  }
};

module.exports = node;
