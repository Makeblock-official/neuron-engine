var electronicblock = require('../../electronicblock');

var node = {
  name: 'SMART_SERVO',
  conf: {},
  props: {
    'category': 'electronic',
    'in': ['position', 'speed'],
    'out': []
  },
  run: function() {
    var position = this.in('position');
    var speed =  this.in('speed'); 
    if (position > 3800){
      position = 3800;
    }
    if (position < 300){
      position = 300;
    }
    if ((speed > 50) || (speed < 1)){
      speed = 30;
    }
    electronicblock.sendBlockCommand('SMART_SERVO','SET_ABSOLUTE_POS',[position,speed],this.idx);
  },
  init: function() {

  }
};

module.exports = node;
