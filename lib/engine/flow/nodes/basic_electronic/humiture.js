var electronicblock = require('../../electronicblock');
var node = {
  name: 'HUMITURE',
  conf: {},
  props: {
    'category': 'electronic',
    'in': [],
    'out': ['temperature', 'humidity']
  },
  run: function() {

  },
  processStatus: function(value) {
    var that = this;
    if ('temperature_humidity' in value){
      that.out('temperature', value.temperature_humidity[0]);
      that.out('humidity', value.temperature_humidity[1]);
    }
  },
  initNode: function(){
    var that = this;
    electronicblock.sendBlockCommand('HUMITURE','GET_STATE',[],that.idx);
    electronicblock.updateBlockStatus('HUMITURE', that.idx);
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
