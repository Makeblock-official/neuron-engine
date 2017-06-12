var electronicblock = require('../../electronicblock');
var node = {
  name: 'DOUBLE_DC_MOTOR',
  conf: {},
  props: {
    'category': 'electronic',
    'in': ['motor1', 'motor2'],
    'out': []
  },
  run: function() {
    var motor1 = this.in('motor1');
    if (motor1 < -100){
      motor1 = -100;
    }
    if (motor1 > 100){
      motor1 = 100;
    }

    var motor2 = this.in('motor2');
    if (motor2 < -100){
      motor2 = -100;
    }
    if (motor2 > 100){
      motor2 = 100;
    }
    
    electronicblock.sendBlockCommand('DOUBLE_DC_MOTOR','SET_SPEED',[motor1, motor2],this.idx);
  },
  init: function() {

  }
};

module.exports = node;
