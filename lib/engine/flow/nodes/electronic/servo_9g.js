var electronicblock = require('../../electronicblock');
var node = {
  name: 'SERVO_9G',
  conf: {},
  props: {
    'category': 'electronic',
    'in': ['angle'],
    'out': []
  },
  run: function() {
    var angle = this.in('angle');
    if (angle < 0){
      angle = 0;
    }
    if (angle > 180){
      angle = 180;
    }
    electronicblock.sendBlockCommand('SERVO_9G','SET_ANGLE',[angle],this.idx);
  },
  init: function() {

  }
};

module.exports = node;
