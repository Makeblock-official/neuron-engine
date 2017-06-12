var electronicblock = require('../../electronicblock');
var node = {
  name: 'SOUNDSENSOR',
  conf: {},
  props: {
    'category': 'electronic',
    'in': [],
    'out': ['volume']
  },
  run: function() {

  },
  initNode: function(){
    var that = this;
    electronicblock.sendBlockCommand('SOUNDSENSOR','GET_STATE',[],that.idx);
    electronicblock.updateBlockStatus('SOUNDSENSOR', that.idx);
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
