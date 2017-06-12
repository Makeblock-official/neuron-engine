var electronicblock = require('../../electronicblock');
var node = {
  name: 'JOYSTICK',
  conf: {},
  props: {
    'category': 'electronic',
    'in': [],
    'out': ['X', 'Y']
  },
  run: function() {

  },
  processStatus: function(value) {
    var that = this;
    if ('state' in value){
      that.out('X', value.state[0]);
      that.out('Y', value.state[1]);
    }
  },
  initNode: function(){
    var that = this;
    electronicblock.sendBlockCommand('JOYSTICK','GET_STATE',[],that.idx);
    electronicblock.updateBlockStatus('JOYSTICK', that.idx);
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
