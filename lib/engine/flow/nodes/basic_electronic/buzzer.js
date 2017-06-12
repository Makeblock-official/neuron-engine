var electronicblock = require('../../electronicblock');
var VOLUME = 50;
var LENGTH = 400;
var ToneHzTable = {
    "c2":65, "d2":73, "e2":82, "f2":87, "g2":98, "a2":110, "b2":123, "c3":131, "d3":147, "e3":165, "f3":175, "f3m":185, "g3":196, "g3m":208,"a3":220,"a3m":233, "b3":247, "c4":262, "c4m":277,"d4":294, "d4m":311,"e4":330, "f4":349,"f4m":369, "g4":392, "g4m":415,"a4":440, "a4m":466,"b4":494, "c5":523, "c5m": 554,"d5":587, "d5m":622,"e5":658, "f5":698, "g5":784, "a5":880, "b5":988, "c6":1047, "d6":1175, "e6":1319, "f6":1397, "g6":1568, "a6":1760, "b6":1976, "c7":2093, "d7":2349, "e7":2637, "f7":2794, "g7":3136, "a7":3520, "b7":3951, "c8":4186
};
var node = {
  name: 'BUZZER',
  conf: {},
  props: {
    'category': 'electronic',
    'hasassistanceNode': true,
    'in': ['input'],
    'out': []
  },
  run: function() { 
    var that = this;
    if (!that.playing){
      if (that.playTimeout){
        clearTimeout(that.playTimeout);
        that.playTimeout = null;
      }
      if (that.nextTimeout){
        clearTimeout(that.nextTimeout);
        that.nextTimeout = null;
      }    
      var playNext = function(){
        if (that.notes.length ===0){
            electronicblock.sendBlockCommand('BUZZER','DISPLAY',[100, 0],that.idx);
            that.playing = false;    
        } else {
           electronicblock.sendBlockCommand('BUZZER','DISPLAY',[100, 0],that.idx);
           that.playTimeout = setTimeout(function(){
             electronicblock.sendBlockCommand('BUZZER','DISPLAY',[ToneHzTable[that.notes[0].tune], VOLUME],that.idx);
             var length = LENGTH/Number(that.notes[0].length);
             that.nextTimeout = setTimeout(playNext,length);  
             that.notes.splice(0, 1);
           },150);     
        }
      };
      var inLinks = that.inNodes.input;
      if (inLinks.length > 0){
          var input = that.in('input');
          var datatype  = (typeof input);
          switch (datatype){
            case 'boolean':
              if (input){
                that.notes = [{tune: ToneHzTable.C3,length: 1}];
                that.playing = true;
                playNext();
              } else {
                electronicblock.sendBlockCommand('BUZZER','DISPLAY',[100, 0],that.idx);              
              }
            break;
            case 'object':
              if (input!==null && input.hasOwnProperty('musicNote')){
                if (input.hasOwnProperty('play')){
                  that.playing = false;
                } else {
                  that.playing = true;
                }
                that.notes = input.musicNote;
                playNext();
              }
            break;
            case 'number':
              if (!that.playing){
                var volume = input>0?VOLUME:0;
                var frequency = Math.round(input);
                electronicblock.sendBlockCommand('BUZZER','DISPLAY',[frequency, volume],that.idx);
              }
            break;
          }
      } else {
        electronicblock.sendBlockCommand('BUZZER','DISPLAY',[100, 0],that.idx);
      }
    }
  },
  init: function() {
    var that = this;
    that.playing = false;
    that.notes = [];
    that.playTimeout = null;
    that.nextTimeout = null;
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
