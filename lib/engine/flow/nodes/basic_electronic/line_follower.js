var electronicblock = require('../../electronicblock');

var node = {
  name: 'LINEFOLLOWER',
  conf: {},
  props: {
    'category': 'electronic',
    'in': [],
    'out': ['left', 'right']
  },
  run: function() {

  },
  processStatus: function(values) {
    var that = this;
    if ('state' in values){
      var value = values.state[0];
      var left = value & 0x01;
      var right = (value >> 1) & 0x01;
      if (left > 0){
        that.out('left', true);
      } else {
        that.out('left', false);
      }
      if (right > 0){
        that.out('right', true);
      } else {
        that.out('right', false);
      }
    }
  },
  initNode: function(){
    var that = this;
    electronicblock.sendBlockCommand('LINEFOLLOWER','GET_STATE',[],that.idx);
    electronicblock.updateBlockStatus('LINEFOLLOWER', that.idx);
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
