var electronicblock = require('../../electronicblock');

var node = {
  name: 'FUNNYTOUCH',
  conf: {},
  props: {
    'category': 'electronic',
    'in': [],
    'out': ['1','2','3','4']
  },
  run: function() {
  },
  processStatus: function(values) {
    var that = this;
    if ('state' in values){
      var value = values.state[0];
      var key1 = value & 0x01;
      key1 = key1 > 0?true:false;
      that.out('1', key1);
      var key2 = (value >> 1) & 0x01;
      key2 = key2 > 0?true:false;
      that.out('2', key2);
      var key3 = (value >> 2)  & 0x01;
      key3 = key3 > 0?true:false;
      that.out('3', key3);
      var key4 = (value >> 3) & 0x01;
      key4 = key4 > 0?true:false;
      that.out('4', key4);
    }
  },
  initNode: function(){
    var that = this;
    electronicblock.sendBlockCommand('FUNNYTOUCH','GET_STATE',[],that.idx);
    electronicblock.updateBlockStatus('FUNNYTOUCH', that.idx);
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
