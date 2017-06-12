var electronicblock = require('../../electronicblock');

var node = {
  name: 'VOISERECOGNITION',
  conf: {},
  props: {
    'category': 'electronic',
    'hasassistanceNode': true,
    'in': [],
    'out': ['voice']
  },
  run: function() {

  },
  processStatus: function(value) {
    var that = this;
    if ('recognition' in value){
      that.out('voice',{voiceRecognition: value.recognition[0]});
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
