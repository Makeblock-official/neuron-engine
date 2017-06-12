var electronicblock = require('../../electronicblock');
var node = {
  name: 'SOIL_HUMIDITY',
  conf: {},
  props: {
    'category': 'electronic',
    'in': [],
    'out': ['humidity']
  },
  run: function() {

  },
  initNode: function(){
    var that = this;
    electronicblock.sendBlockCommand('SOIL_HUMIDITY','GET_STATE',[],that.idx);
    electronicblock.updateBlockStatus('SOIL_HUMIDITY', that.idx);
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
