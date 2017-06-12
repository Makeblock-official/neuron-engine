var electronicblock = require('../../electronicblock');
var algorithm = require('../algorithm');
var MIN = -100;
var MAX = 100;
var node = {
  name: 'MOTORS',
  conf: {},
  props: {
    'category': 'electronic',
    'hasassistanceNode': true,
    'inputCombine':  true,
    'in': ['speed'],
    'out': []
  },
  run: function() {
    var that = this;
    var inLinks = that.inNodes.speed;
    if (inLinks.length > 0){
      var input = that.combineInput('speed','MOTORS');
      that.updateValidValue('speed',input);
      var indata = null;
      var port1,port2;
      var datatype = (typeof input);
      switch (datatype){
        case 'boolean':
        case 'number':
          indata = {data: input};
          break;
        case 'object':
          indata = input;
          break;
      }
      if(indata){
        if(indata.hasOwnProperty('type') && indata.type === 'MOTORS') {
          port1 = indata.data.port1;
          port2 = indata.data.port2;
        }else {
          if(indata.hasOwnProperty('data')){
            if((typeof indata.data) === 'boolean') {
              if(indata.data === true){
                port1 = MAX;
                port2 = MAX;
              } else {
                port1 = 0;
                port2 = 0;
              }
            }else if((typeof indata.data) === 'number') {
              var speed = indata.data;
              speed = algorithm.threaholdNumber(speed,MIN,MAX);
              port1 = speed;
              port2 = speed;        
            }
          }
        }
        electronicblock.sendBlockCommand('MOTORS','SET_SPEED',[port1,port2],that.idx);
      }
    } else {
      electronicblock.sendBlockCommand('MOTORS','SET_SPEED',[0,0],that.idx);
    }
  },
  stop: function(){
    var that = this;
    electronicblock.sendBlockCommand('MOTORS','SET_SPEED',[0,0],that.idx);
  }, 
  init: function() {
  },

  getBlockVersion: function() {
    var that = this;
    electronicblock.getBlockVersion(that.name, that.idx);
  },
  updateNeuronBlock: function() {
    var that = this;
    electronicblock.updateBlockFirmware(that.name, that.idx);
  }
};

module.exports = node;
