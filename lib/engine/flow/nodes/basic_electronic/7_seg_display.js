var electronicblock = require('../../electronicblock');
var algorithm = require('../algorithm');
var MIN = -999;
var MAX = 9999;
var node = {
  name: 'SEGDISPLAY',
  conf: {},
  props: {
    'category': 'electronic',
    'in': ['display'],
    'out': []
  },
  run: function() {
    var display = this.in('display');
    if (display !== null){
      var datatype = (typeof display);   
      switch (datatype){
          case 'boolean':   
            if (display === true){
              display  = 1;
            } else{
              display  = 0;
            }
            break;
        case 'number':
          display = algorithm.threaholdNumber(display,MIN,MAX);
          break;
        case 'object':
          display  = 1;
          break;
      }
      electronicblock.sendBlockCommand('SEGDISPLAY','DISPLAY',[display],this.idx);
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
