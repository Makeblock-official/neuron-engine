var electronicblock = require('../../electronicblock');
var node = {
  name: 'SERVO',
  conf: {},
  props: {
    'category': 'electronic',
    'hasassistanceNode': true,
    'inputCombine':  true,
    'in': ['angle'],
    'out': []
  },
  run: function() {
    var that = this;
    var input = that.combineInput('angle','SERVO');
    that.updateValidValue('angle',input);
    var indata = null;
    var angle;
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
      if(indata.hasOwnProperty('type') && indata.type === 'SERVO') {
        if (indata.data.hasOwnProperty('servo1')){
          electronicblock.sendBlockCommand('SERVO','SET_SERVO1_ANGLE',[indata.data.servo1],this.idx);
        }
        if (indata.data.hasOwnProperty('servo2')){
          electronicblock.sendBlockCommand('SERVO','SET_SERVO2_ANGLE',[indata.data.servo2],this.idx);
        }
      }else {
        if(indata.hasOwnProperty('data')){
          if((typeof indata.data) === 'boolean') {
            if(indata.data === true){
              angle = 100;
            } else {
              angle = 0;
            }
          }else if((typeof indata.data) === 'number') {
            angle = indata.data;
            if(indata.data < 0) {
              angle = 0;
            }
            if(indata.data > 180) {
              angle = 180;
            }
          }
          electronicblock.sendBlockCommand('SERVO','SET_ALL_ANGLE',[angle],this.idx);
        }
      }
    }
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
