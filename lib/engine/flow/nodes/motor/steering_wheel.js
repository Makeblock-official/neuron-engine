var algorithm = require('../algorithm');
var core = require('../../core');
var MIN = -100;
var MAX = 100;
var node = {
  name: 'STEERINGWHEEL',
  conf: {},
  props: {
    'category': 'MOTORS',
    'assistanceNode': true,
    'outPutType': 'object',
    'in': ['speed','direction'],
    'out': ['steering']
  },
  run: function() {
    var that = this;
    var output = { type: 'MOTORS',data:{port1: 0,port2:0}};
    var inLinks,speed,direction;
    inLinks = that.inNodes.speed;
    if (inLinks.length > 0){
      speed =  that.in('speed');
      speed = algorithm.threaholdNumber(speed,MIN,MAX);
    } else {
      speed = 0;
    }
    inLinks = that.inNodes.direction;
    if (inLinks.length > 0){
      direction =  that.in('direction');
    }   else{
      direction = 0;
    }
    output.data = algorithm.calcMotorspeed(output.data,speed,direction);
    that.out('steering', output);
  },
  initNode: function(){
    var that = this;  
    core.onNodeInputChanged(that.id, 'speed', 0);
    core.onNodeInputChanged(that.id, 'direction', 0);
    var output = { type: 'MOTORS',data:{port1: 0,port2:0}};
    that.out('steering', output);
  },    
  init: function() {

  }
};

module.exports = node;
