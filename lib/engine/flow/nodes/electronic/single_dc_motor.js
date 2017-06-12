var electronicblock = require('../../electronicblock');
var node = {
  name: 'SINGLE_DC_MOTOR',
  conf: {},
  props: {
    'category': 'electronic',
    'in': ['motor'],
    'out': []
  },
  run: function() {
    var motor = this.in('motor');
    if (motor < -100){
      motor = -100;
    }
    if (motor > 100){
      motor = 100;
    }

    electronicblock.sendBlockCommand('SINGLE_DC_MOTOR','SET_SPEED',[motor],this.idx);
  },
  init: function() {

  }
};

module.exports = node;
