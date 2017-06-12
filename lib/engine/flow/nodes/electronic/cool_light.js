var electronicblock = require('../../electronicblock');

var node = {
  name: 'COOL_LIGHT',
  conf: {},
  props: {
    'category': 'electronic',
    'in': ['1','2','3','4'],
    'out': []
  },
  run: function() {
    var that = this;
    var display = 0;
    var light1 = that.in('1');
    if (light1 > 0){
      display = 1;
    }
    var light2 = that.in('2');
    if (light2 > 0){
      display = (display | 2);
    }
    var light3 = that.in('3');
    if (light3 > 0){
      display = (display | 4);
    }
    var light4 = that.in('4');
    if (light3 > 0){
      display = (display | 4);
    }
    electronicblock.sendBlockCommand('COOL_LIGHT','DISPLAY',[display],this.idx);
  },
  init: function() {

  }
};

module.exports = node;
