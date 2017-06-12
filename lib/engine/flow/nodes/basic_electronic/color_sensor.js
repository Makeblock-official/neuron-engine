var electronicblock = require('../../electronicblock');

var node = {
  name: 'COLORSENSOR',
  conf: {},
  props: {
    'category': 'electronic',
    'hasassistanceNode': true,
    'in': [],
    'out': ['color']
  },
  run: function() {

  },
  processStatus: function(values) {
    var that = this;
    if ('color' in values){
      var R = values.color[0];
      var G = values.color[1];
      var B = values.color[2];
      that.out('color',{R: R, G:G, B:B});
    }
  },
   initNode: function(){
    var that = this;
    electronicblock.sendBlockCommand('COLORSENSOR','GET_COLOR',[],that.idx);
    electronicblock.updateBlockStatus('COLORSENSOR', that.idx);
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
