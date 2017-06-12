var electronicblock = require('../../electronicblock');

var node = {
  name: 'OLED_DISPLAY',
  conf: {blink: null,position: null},
  props: {
    'category': 'electronic',
    'inPutType': 'text', //text or number
    'in': ['display'],
    'out': [],
    'configs':{ 
      blink: {type: 'options', options: ['blink','no blink'],defaultValue: 'blink'},
      position: {type: 'options', options: ['up','center','down'],defaultValue: 'up'}
    }
  },
  run: function() {
    var that = this;
    var display = that.in('display');
    if (typeof display === 'string'){
      var position;
      switch (that.conf.position){
        case 'up':
          position = 1;
          break;
        case 'center':
          position = 2;
          break;
        case 'down':
          position = 3;
          break;
      }
      electronicblock.sendBlockCommand('OLED_DISPLAY','DISPLAY_STRING',[position,display],that.idx); 
    } else if (typeof display === 'number'){ 
      var blink = that.conf.blink;
      switch (that.conf.blink){
        case 'blink':
          blink = 1;
          break;
        case 'no blink':
          blink = 0;
          break;
      }
      electronicblock.sendBlockCommand('OLED_DISPLAY','DISPLAY_FACE',[display,blink],that.idx);
    }   
  },
  init: function() {

  }
};

module.exports = node;
