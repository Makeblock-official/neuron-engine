var electronicblock = require('../../electronicblock');

var node = {
  name: 'LIGHTSENSOR',
  conf: {},
  props: {
    'category': 'electronic',
    'in': [],
    'out': ['light']
  },
  run: function() {

  },
  initNode: function(){
    var that = this;
    electronicblock.sendBlockCommand('LIGHTSENSOR','GET_INTENSITY',[],that.idx);
    electronicblock.updateBlockStatus('LIGHTSENSOR', that.idx);
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
