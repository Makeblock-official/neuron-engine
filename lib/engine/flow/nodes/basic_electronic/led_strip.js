var electronicblock = require('../../electronicblock');
var DEFAULTSPEED = 1;  //0--8, slow to fast
var GRADIENTSPEED =  8; //0--8, slow to fast
var PLAYMODE =  {'static': 0,'roll': 1,'repeat': 2,'marquee': 3,'breathing':4,'gradient':5};
var LEDOFF = {mode: 'repeat', colors: [0]};
var DEFAULTPATTERN = {mode: 'static', colors: [1,2,4]};
var node = {
  name: 'LEDSTRIP',
  conf: {pattern: null,selected:null, editPattern:null},
  props: {
    'category': 'electronic',
    'hasassistanceNode': true,
    'inputCombine':  true,
    'inPutType': 'object',
    'in': ['pattern'],
    'out': [],
    'configs':{
       pattern: { type: 'pattern'},
       selected: {type: 'hidden',defaultValue: 0},
       editPattern: {type: 'hidden',defaultValue: {mode: 'static', colors: [1,1,1]}}     
    }  
  },
  run: function() {
    var that = this;
    var mode,speed,pattern;
    var inLinks = that.inNodes.pattern;
     //save selected and editPattern
    if (that.conf.pattern !== null){
      that.conf.selected = that.conf.pattern.selected;
      if (that.conf.selected === 4){
        that.conf.editPattern = that.conf.pattern.pattern;
      }
    }    
    if (inLinks.length === 0){
      if (that.conf.pattern !== null){
        pattern = that.conf.pattern.pattern;
      }
    }   else {
       var input = that.combineInput('pattern','LEDSTRIP');
       that.updateValidValue('pattern',input);
      var datatype = (typeof input);
      switch (datatype){
        case 'boolean':
          if (input === true){
            pattern = that.conf.pattern!==null?that.conf.pattern.pattern:LEDOFF;  
          } else {
            pattern = LEDOFF;
          }
          break;
        case 'number':  
          if (input > 0){
             pattern = that.conf.pattern!==null?that.conf.pattern.pattern:LEDOFF;           
          } else {
             pattern = LEDOFF;
          }        
          break;
        case 'object':
           if (input){
            if (input.hasOwnProperty('type') && (input.type === 'LEDSTRIP')){    
                pattern = input.pattern;  
            }   
          } 
          break;
      }
      if (pattern === null){
        pattern = DEFAULTPATTERN;
      }     
    }
    if (pattern)
    {
      if ('mode' in pattern){
        var out = [];
        out.push(PLAYMODE[pattern.mode]);
        if (pattern.mode === 'gradient'){
          out.push(GRADIENTSPEED);
        } else{
          out.push(DEFAULTSPEED);
        }
        if ('colors' in pattern){
          if (pattern.colors instanceof Array){
              if (pattern.colors.length > 0){
                out.push(pattern.colors.length);
                for (var i = 0; i < pattern.colors.length; i++){
                  out.push(pattern.colors[i]);
                }
              } else {
                out = [2,1,1,0];
              }
              electronicblock.sendBlockCommand('LEDSTRIP','DISPLAY_PATTERN',out,that.idx);
          }
        }
      }
    }
  },
  config: function(){
    this.run();
  },  
  stop: function(){
    var that = this;
    // turnoff ledstrip
    // model: repeat(2);speed:middle(1);led number: 1; color: 0(off)
    var out = [2,1,1,0];
    electronicblock.sendBlockCommand('LEDSTRIP','DISPLAY_PATTERN',out,that.idx);
    //reset defaultValue
    that.props.configs.selected.defaultValue = 0;
    that.props.configs.editPattern.defaultValue = {mode: 'static', colors: [1,1,1]};
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
