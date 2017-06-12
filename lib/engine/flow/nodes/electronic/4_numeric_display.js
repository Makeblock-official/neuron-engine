var electronicblock = require('../../electronicblock');

var node = {
  name: '4_NUMERIC_DISPLAY',
  conf: {},
  props: {
    'category': 'electronic',
    'in': ['display'],
    'out': []
  },
  run: function() {
    var display = this.in('display');
    if (display < -999){
      display = -999;
    }
    if (display > 9999){
      display = 9999;
    }
    electronicblock.sendBlockCommand('4_NUMERIC_DISPLAY','DISPLAY',[display],this.idx);
  },
  init: function() {

  }
};

module.exports = node;
