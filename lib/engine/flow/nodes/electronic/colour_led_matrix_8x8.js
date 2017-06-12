var electronicblock = require('../../electronicblock');

var node = {
  name: 'COLOUR_LED_MATRIX_8*8',
  conf: {},
  props: {
    'category': 'electronic',
    'inPutType': 'object',
    'in': ['image'],
    'out': []
  },
  run: function() {
    var that = this;
    var image = that.in('image');
    var out;
    var mode,speed,number;
    if ((image !==null) && (typeof(image) === 'object'))
    {
      if (('matrix' in image) && (image.matrix instanceof Array)){  
        var playMode  = {'appear': 0,'erase': 1,'left': 2,'right': 3}; 
        mode = playMode[image.mode];
        if (image.matrix.length > 1){
          for (var i = 0; i < image.matrix.length; i++){
            out = [];
            out.push(i);  // frame number
            for (var j = (image.matrix[i].length - 1); j >= 0; j--){
              if (image.matrix[i][j] > 0){
                number = j + 1;
                break;
              }
            }
            out.push(number); // led number
            for (var k = 0; k < number; k++){
              out.push(image.matrix[i][k]);
            }
            electronicblock.sendBlockCommand('COLOUR_LED_MATRIX_8*8','UPLOAD_IMAGE',out,that.idx);
          }
          var playSpeed = {'slow':0,'middle':1,'fast':2};
          speed = playSpeed[image.speed];
          electronicblock.sendBlockCommand('COLOUR_LED_MATRIX_8*8','DISPLAY_IMAGES',[speed,mode],that.idx);
        } else if (image.matrix.length === 1){
          out = [];
          out.push(mode);
          for (var l = (image.matrix[0].length - 1); l >= 0; l--){
            if (image.matrix[0][l] > 0){
              number = l + 1;
              break;
            }
          }
          out.push(number); // led number
          for (var m = 0; m < number; m++){
            out.push(image.matrix[0][m]);
          }
          electronicblock.sendBlockCommand('COLOUR_LED_MATRIX_8*8','DISPLAY_IMAGE',out,that.idx);
        }
      }
    }
  },
  init: function() {

  }
};

module.exports = node;
