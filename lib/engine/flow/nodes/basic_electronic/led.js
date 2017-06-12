var electronicblock = require('../../electronicblock');
var algorithm = require('../algorithm');
var DEFAULICOLOR = [50,50,50];
var LEDOFF = [0,0,0];
var MIN = 0;
var MAX = 255;
var MAXIN = 100;
//var COLORMAP = {0:[0,0,0],1:[0xd5,0,0x22],2:[0xf8,0xa4,0x43],3:[0xf8,0xe6,0x53],4:[0x77,0xd2,0x48],5:[0x3c,0xe3,0xc4],6:[0x35,0x61,0x9d],7:[0x93,0x25,0xf3]};
var COLORMAP = {0:[0x64,0x64,0x64],1:[0x64,0,0],2:[0x64,0x34,0],3:[0x64,0x64,0],4:[0,0x64,0],5:[0,0x64,0x64],6:[0,0,0x64],7:[0xac,0,0xac]};
var COLORS = {0:[0xff,0xff,0xff],1:[0xff,0,0],2:[0xff,0x80,0],3:[0xff,0xff,0],4:[0,0xff,0],5:[0,0xff,0xff],6:[0,0,0xff],7:[0xff,0,0xff]};
var node = {
  name: 'LED',
 conf: {color: null, lastColor: null},
  props: {
    'category': 'electronic',
    'hasassistanceNode': true,
    'inputCombine':  true,
    'in': ['color'],
    'out': [],
    'configs':{
       color: { type: 'color',defaultValue: 0}
    }
  },
  run: function() {
    var that = this;
    var R, G, B;
    var colorid = that.conf.color;
    that.conf.lastColor = colorid;
    var inLinks = that.inNodes.color;
    if (inLinks.length === 0){
      if (colorid in COLORMAP){
        electronicblock.sendBlockCommand('LED','SET_COLOUR',COLORMAP[colorid],that.idx);
      }  else {
      }
    }  else{
      var input = that.combineInput('color','LED');
      that.updateValidValue('color',input);
      if (input !==null){
        var datatype = (typeof input);
        switch (datatype){
          case 'boolean':
            if (input === true){
              if (colorid !== null){
                if (colorid in COLORMAP){
                  electronicblock.sendBlockCommand('LED','SET_COLOUR',COLORMAP[colorid],that.idx);
                }
              } else {
                electronicblock.sendBlockCommand('LED','SET_COLOUR',DEFAULICOLOR,that.idx);
              }
            } else {
              electronicblock.sendBlockCommand('LED','SET_COLOUR',LEDOFF,that.idx);
            }
            break;
          case 'number':
            var array = [];
            var ratio;
            if (colorid in COLORMAP){
              input = algorithm.threaholdNumber(input,MIN,MAXIN);      
              ratio = input / MAXIN;
              R = COLORS[colorid][0] * ratio;
              G = COLORS[colorid][1] * ratio;
              B = COLORS[colorid][2] * ratio;
              array = [R,G,B];
            } else{
              input = algorithm.threaholdNumber(input,MIN,MAXIN);
              ratio = input / MAXIN;
              R = COLORS[0][0] * ratio;
              G = COLORS[0][1] * ratio;
              B = COLORS[0][2] * ratio;
              array = [R,G,B];
            }
            electronicblock.sendBlockCommand('LED','SET_COLOUR',array,that.idx);
            break;
          case 'object':
            if (input.hasOwnProperty('type') && (input.type === 'LED')){
              if (input.data.hasOwnProperty('R')){
                R = input.data.R;
                R = algorithm.threaholdNumber(R,MIN,MAX);
              } else{
                R = 0;
              }
              if (input.data.hasOwnProperty('G')){
                G = input.data.G;
                G = algorithm.threaholdNumber(G,MIN,MAX);
              } else{
                G = 0;
              }
              if (input.data.hasOwnProperty('B')){
                B = input.data.B;
                B = algorithm.threaholdNumber(B,MIN,MAX);
              } else{
                B = 0;
              }
              electronicblock.sendBlockCommand('LED','SET_COLOUR',[R,G,B],that.idx);
              }
            break;
          }
       } else {
          electronicblock.sendBlockCommand('LED','SET_COLOUR',LEDOFF,that.idx);
       }
    }
  },
  config: function(){
    this.run();
  },  
  stop: function(){
    var that = this;
    electronicblock.sendBlockCommand('LED','SET_COLOUR',LEDOFF,that.idx);
     //reset defaultValue
    that.props.configs.color.defaultValue = 0;    
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
