var electronicblock = require('../../electronicblock');
var DEFAULTMODE = 0;
var DEFAULTSPEED = 2;  //'slow':0,'middle':1,'fast':2
var LEDOFF = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];                                          

var node = {
  name: 'LEDPANEL',
  conf: {image: null,selected:null, editImage:null},
  props: {
    'category': 'electronic',
    'hasassistanceNode': true,
    'inputCombine':  true,
    'in': ['image'],
    'out': [],
    'configs':{
       image: { type: 'image'},
       selected: {type: 'hidden',defaultValue: 0},
       editImage: {type: 'hidden',defaultValue: []}
    }
  },
  run: function() {
    var that = this;
    var matrix = [];
    var out;
    var number;
    //save selected and editImage
    if (that.conf.image !== null){
      that.conf.selected = that.conf.image.selected;
      if (that.conf.selected === 4){
        that.conf.editImage = that.conf.image.matrix;
      }
    }   
    var inLinks = that.inNodes.image;
    if (inLinks.length === 0){
        if (that.conf.image !== null){
          matrix = that.conf.image.matrix;
        }
    } else {
      var input = that.combineInput('image','LEDPANEL');
      that.updateValidValue('image',input);
      var datatype = (typeof input);
      switch (datatype){
        case 'boolean':
          if (input === true){
            matrix = that.conf.image.matrix;      
          } else {
            matrix[0] = LEDOFF;
          }
          break;
        case 'number':  
          if (input > 0){
            matrix = that.conf.image.matrix;          
          } else {
            matrix[0] = LEDOFF;
          }        
          break;
        case 'object':
           if (input){
            if (input.hasOwnProperty('type') && (input.type === 'LEDPANEL')){    
                matrix = input.matrix;  
            }   
          } 
          break;
      }
    }
    if (matrix){
        if (matrix.length > 1){
          for (var i = 0; i < matrix.length; i++){
            out = [];
            out.push(i);  // frame number
            for (var j = (matrix[i].length - 1); j >= 0; j--){
              if (matrix[i][j] > 0){
                number = j + 1;
                break;
              }
            }
            out.push(number); // led number
            for (var k = 0; k < number; k++){
              out.push(matrix[i][k]);
            }
            electronicblock.sendBlockCommand('LEDPANEL','UPLOAD_IMAGE',out,that.idx);
          }
          electronicblock.sendBlockCommand('LEDPANEL','DISPLAY_IMAGES',[DEFAULTSPEED,DEFAULTMODE],that.idx);
        } else if (matrix.length === 1){
          out = [];
          out.push(DEFAULTMODE);
          for (var l = (matrix[0].length - 1); l >= 0; l--){
            if (matrix[0][l] > 0){
              number = l + 1;
              break;
            }
          }
          out.push(number); // led number
          for (var m = 0; m < number; m++){
            out.push(matrix[0][m]);
          }
          electronicblock.sendBlockCommand('LEDPANEL','DISPLAY_IMAGE',out,that.idx);
        }
      }
  },
  config: function(){
    this.run();
  }, 
  stop: function(){
    var that = this;
    // turnoff ledpanel,mode: 0; number: 0
    var out = [0,0];
    electronicblock.sendBlockCommand('LEDPANEL','DISPLAY_IMAGE',out,that.idx);
     //reset defaultValue
    that.props.configs.selected.defaultValue = 0;
    that.props.configs.editImage.defaultValue = [];   
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
