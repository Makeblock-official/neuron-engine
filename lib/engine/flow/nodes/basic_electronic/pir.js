var electronicblock = require('../../electronicblock');

var node = {
  name: 'PIR',
  conf: {},
  props: {
    'category': 'electronic',
    'in': [],
    'out': ['state']
  },
  run: function() {
  },
  processStatus: function(value) {
    var that = this;
    if ('state' in value){
      var state = (value.state[0] > 0?true:false);
      that.out('state',state);
    }
  },  
  initNode: function(){
    var that = this;
    electronicblock.sendBlockCommand('PIR','GET_STATE',[],that.idx);
    electronicblock.updateBlockStatus('PIR', that.idx);
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
