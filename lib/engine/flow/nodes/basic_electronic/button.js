var electronicblock = require('../../electronicblock');

var node = {
  name: 'BUTTON',
  conf: {},
  props: {
    'category': 'electronic',
    'in': [],
    'out': ['press']
  },
  run: function() {
  },
  processStatus: function(value) {
    var that = this;
    if ('press' in value){
      var state = value.press[0]>0?true:false;
      that.out('press',state);
    }
  },
  initNode: function(){
    var that = this;
    electronicblock.sendBlockCommand('BUTTON','GET_STATE',[],that.idx);
    electronicblock.updateBlockStatus('BUTTON', that.idx);
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
