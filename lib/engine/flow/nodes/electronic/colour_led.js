var electronicblock = require('../../electronicblock');

var node = {
  name: 'COLOUR_LED',
  conf: {},
  props: {
    'category': 'electronic',
    'in': ['color'],
    'out': []
  },
  run: function() {
    var that = this;
    var R, G, B;
    var color = that.in('color');
    if ((color instanceof Array) && (color.length === 3)){
      R = color[0];
      G = color[1];
      B = color[2];
      if (R > 255){
        R = 255;
      }
      if (R < 0){
        R = 0;
      }
      if (G > 255){
        G = 255;
      }
      if (G < 0){
        G = 0;
      }
      if (B > 255){
        B = 255;
      }
      if (B < 0){
        B = 0;
      }
      electronicblock.sendBlockCommand('COLOUR_LED','SET_COLOUR',[R,G,B],that.idx);
    } else {
      var colorid = Number(color);
      var colorMap = {0:[0,0,0],1:[0xff,0,0],2:[0xff,0xaf,0],3:[0xff,0xff,0],4:[0,0xff,0],5:[0,0xff,0xff],6:[0,0,0xff],7:[0xd4,0,0xff],
                      8:[0xff,0xff,0xff]};
      if (colorid in colorMap){
        electronicblock.sendBlockCommand('COLOUR_LED','SET_COLOUR',colorMap[colorid],that.idx);
      }
    }
  },
  init: function() {

  }
};

module.exports = node;
