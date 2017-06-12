var electronicblock = require('../../electronicblock');

var node = {
  name: 'ELWIRES',
  conf: {},
  props: {
    'category': 'electronic',
    'in': ['port1','port2','port3','port4'],
    'out': []
  },
  run: function() {
    var that = this;
    var inLinks;
    var display = 0;
    inLinks = that.inNodes.port1;
    if (inLinks.length > 0){
      var light1 = that.in('port1');
      if (light1 > 0){
        display = 1;
      }
    }
    inLinks = that.inNodes.port2;
    if (inLinks.length > 0){
      var light2 = that.in('port2');
      if (light2 > 0){
        display = (display | 2);
      }
    }  
    inLinks = that.inNodes.port3;
    if (inLinks.length > 0){
      var light3 = that.in('port3');
      if (light3 > 0){
        display = (display | 4);
      }
    }  
    inLinks = that.inNodes.port4;
    if (inLinks.length > 0){
      var light4 = that.in('port4');
      if (light4 > 0){
        display = (display | 8);
      }
    }        
    electronicblock.sendBlockCommand('ELWIRES','DISPLAY',[display],this.idx);
  },
  setup: function(){
    this.validValue[1] = 0;
    this.validValue[2] = 0;
    this.validValue[3] = 0;
    this.validValue[4] = 0;  
    electronicblock.sendBlockCommand('ELWIRES','DISPLAY',[0],this.idx); 
  },
  stop: function(){
    electronicblock.sendBlockCommand('ELWIRES','DISPLAY',[0],this.idx);
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
