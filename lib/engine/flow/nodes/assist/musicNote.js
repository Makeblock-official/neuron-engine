var logger = require('../../../../log/log4js').logger;
var config = require('../../../../config/config');
var node = {
  name: 'MUSICNOTE',
  conf: {tune: null, length: null},
  props: {
    'category': 'BUZZER',
    'assistanceNode': true,
    'in': ['input'],
    'out': ['note'],
    'configs':{
       tune: { type: 'hidden',defaultValue: 'c4'},
       length: {type: 'hidden',defaultValue: '4'}
    }    
  },
  run: function() {
    var that = this;
    var inLinks = that.inNodes.input;
    if (inLinks.length > 0){
      var input = that.in('input');
      var tune = that.conf.tune!==null?that.conf.tune:'c4';
      var length = that.conf.length!==null?that.conf.length:4;
      var note = {type: 'BUZZER', musicNote: [{tune: tune,length: length}]};      
      if (input !== null){
          if ((typeof input) === 'object' && input.hasOwnProperty('musicNote')){
            if (input.hasOwnProperty('play')){
              that.out('note',input);
            } else {          
              input.musicNote.push(note.musicNote[0]);
              that.out('note',input);
            }
          } else {
            if (input > 0 ){
              that.out('note',note);
            } else {
              that.out('note',false);
            }
          }
      }      
    }       
  },

  config: function(){
    var that = this;
    var tune = that.conf.tune!==null?that.conf.tune:'c4';
    var length = that.conf.length!==null?that.conf.length:4;
    var note = {type: 'BUZZER', musicNote: [{tune: tune,length: length}], play: true};
    that.out('note',note);
  },
  init: function() {
 
  }
};

module.exports = node;
