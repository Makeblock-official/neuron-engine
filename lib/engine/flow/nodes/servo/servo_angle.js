var algorithm = require('../algorithm');
var core = require('../../core');
var MIN = 0;
var MAX = 180;
var node = {
  name: 'SERVOANGLE',
  conf: {},
  props: {
    'category': 'SERVO',
    'assistanceNode': true,
    'outPutType': 'object',
    'in': ['port1','port2'],
    'out': ['angle']
  },
  run: function() {
    var that = this;
    var angle = { type: 'SERVO',data:{}};
    if (that.inNodes.port1.length > 0){
      var servo1 = that.in('port1');
      servo1 = algorithm.threaholdNumber(servo1,MIN,MAX);
      angle.data.servo1  =servo1;     
    }
    if (that.inNodes.port2.length > 0){
      var servo2 = that.in('port2');
      servo2 = algorithm.threaholdNumber(servo2,MIN,MAX);
      angle.data.servo2  =servo2;     
    }
    that.out('angle', angle);
  },
  initNode: function(){
    var that = this;  
    core.onNodeInputChanged(that.id, 'port1', 0);
    core.onNodeInputChanged(that.id, 'port2', 0);
    var angle = { type: 'SERVO',data:{servo1:0,servo2:0}};
    that.out('angle', angle);
  },    
  init: function() {

  }
};

module.exports = node;
