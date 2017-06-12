var logger = require('../../../../log/log4js').logger;
var node = {
  name: 'MATCHTEXT',
  conf: {text: null},
  props: {
    'category': 'SPEAKERRECOGNIZE,OCR',
    'assistanceNode': true,
    'in': ['text'],
    'out': ['result'],
    'configs':{
       text: {type: 'text',defaultValue: ''}
    }  
  },
  run: function() {
      var that = this;
      var text = that.in('text');
      var matchText = that.conf.text;
      if (((typeof text) === 'string') && ((typeof matchText) === 'string')){
        text = text.toLowerCase();
        if (text.indexOf (matchText.toLowerCase()) >= 0){
          that.out('result', true);
        } else {
          that.out('result', false);
        }
      } else {
        that.out('result', false);
      }            
  },
 config: function(){
    this.run();
  },  
  init: function() {
 
  }
};

module.exports = node;
