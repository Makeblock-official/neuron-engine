var electronicblock = require('../../electronicblock');
var node = {
  name: 'KNOB',
  conf: {},
  props: {
    'category': 'electronic',
    'in': [],
    'out': ['potentio']
  },
  run: function() {

  },
  initNode: function(){
    var that = this;
    electronicblock.sendBlockCommand('KNOB','GET_STATE',[],that.idx);
    electronicblock.updateBlockStatus('KNOB', that.idx);
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
