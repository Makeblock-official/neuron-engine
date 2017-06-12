var electronicblock = require('../../electronicblock');

var node = {
  name: 'TEMPERATURE',
  conf: {},
  props: {
    'category': 'electronic',
    'in': [],
    'out': ['temperature']
  },
  processStatus: function(value) {
    var that = this;
    if (('temperature' in value) && (value.temperature[0] !==null)){
      var temperature = value.temperature[0];
      temperature = Number(temperature.toFixed(1));
      that.out('temperature',temperature);
    }
  },  
  run: function() {

  },
  initNode: function(){
    var that = this;
    electronicblock.sendBlockCommand('TEMPERATURE','GET_TEMPERATURE',[],that.idx);
    electronicblock.updateBlockStatus('TEMPERATURE', that.idx);
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
