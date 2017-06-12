var electronicblock = require('../../electronicblock');

var node = {
  name: 'ULTRASONIC',
  conf: {},
  props: {
    'category': 'electronic',
    'in': [],
    'out': ['distance']
  },
  processStatus: function(value) {
    var that = this;
    if (('distance' in value) && (value.distance[0] !==null)){
      var distance = value.distance[0];
      distance = Number(distance.toFixed(1));
        that.out('distance',distance);
    }
  },  
  run: function() {
  },
  initNode: function(){
    var that = this;
    electronicblock.sendBlockCommand('ULTRASONIC','GET_DISTANCE',[],that.idx);
    electronicblock.updateBlockStatus('ULTRASONIC', that.idx);
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
