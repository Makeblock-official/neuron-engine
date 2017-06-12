var electronicblock = require('../../electronicblock');
var algorithm = require('../algorithm');
var FACEID = {'angry':1,'drowsy':2,'enlarged':3,'fixed':4,'happy':5,'mini':6,'normal':7,'sad':8};
var BLINK = {'blink':1,'not blink':2};

var node = {
  name: 'OLED_DISPLAY',
  conf: {},
  props: {
    'category': 'electronic',
    'hasassistanceNode': true,
    'inputCombine':  true,
    'in': ['display'],
    'out': []
  },
  run: function() {
    var that = this;
    var faceId;
    var display = that.combineInput('display','OLED_DISPLAY');
    that.updateValidValue('display',display);
    if (display !== null){
      var datatype = (typeof display);  
      switch (datatype){
        case 'string':
        case 'number':
          display = '' + display;
          electronicblock.sendBlockCommand('OLED_DISPLAY','DISPLAY_STRING',[1,display],that.idx); 
          break;
        case 'boolean':
          faceId = (display===true?5:7);
          electronicblock.sendBlockCommand('OLED_DISPLAY','DISPLAY_FACE',[faceId,1],that.idx);
          break;
        case 'object':
          if (display.hasOwnProperty('type') && (display.type === 'OLED_DISPLAY')){
            if (display.hasOwnProperty('face') && display.face.hasOwnProperty('faceId')){
              faceId = FACEID[display.face.faceId];
              var blink = BLINK[display.face.blink];
              electronicblock.sendBlockCommand('OLED_DISPLAY','DISPLAY_FACE',[faceId,blink],that.idx);
            } 
            if (display.hasOwnProperty('text')){
              electronicblock.sendBlockCommand('OLED_DISPLAY','DISPLAY_STRING',[1,display.text],that.idx); 
            }
          } else {
            display = JSON.stringify(display);
            electronicblock.sendBlockCommand('OLED_DISPLAY','DISPLAY_STRING',[1,display],that.idx); 
          }
      } 
    } 
  },   
  setup: function(){
    electronicblock.sendBlockCommand('OLED_DISPLAY','DISPLAY_FACE',[7,1],this.idx);
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
