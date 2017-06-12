var algorithm = require('../algorithm');
var core = require('../../core');
var MIN = -100;
var MAX = 100;
var node = {
  name: 'MOTORSPEED',
  conf: {},
  props: {
    'category': 'MOTORS',
    'assistanceNode': true,
    'outPutType': 'object',
    'in': ['port1','port2'],
    'out': ['speed']
  },
  run: function() {
    var that = this;
    var speed = { type: 'MOTORS',data:{port1: 0,port2:0}};
    var inLinks,port1,port2;
    inLinks = that.inNodes.port1;
    if (inLinks.length > 0){
      port1 =  that.in('port1');
      port1 = algorithm.threaholdNumber(port1,MIN,MAX);
      speed.data.port1  =Math.round(port1);
    }
    inLinks = that.inNodes.port2;
    if (inLinks.length > 0){
      port2 =  that.in('port2');
      port2 = algorithm.threaholdNumber(port2,MIN,MAX);
      speed.data.port2  =Math.round(port2);
    }  
    that.out('speed', speed);
  },
  initNode: function(){
    var that = this;  
    core.onNodeInputChanged(that.id, 'port1', 0);
    core.onNodeInputChanged(that.id, 'port2', 0);
    var speed = { type: 'MOTORS',data:{port1: 0,port2:0}};
    that.out('speed', speed);
  },  
  init: function() {

  }
};

module.exports = node;
