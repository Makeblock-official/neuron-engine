var node = {
  name: 'PATTERN',
  conf: {pattern: null,selected:null, editPattern:null},
  props: {
    'category': 'LEDSTRIP',
    'assistanceNode': true,
    'inputCombine':  true,
    'outPutType': 'object',   
    'in': ['send'],
    'out': ['pattern'],
    'configs':{
       pattern: { type: 'pattern'},
       selected: {type: 'hidden',defaultValue: 0},
       editPattern: {type: 'hidden',defaultValue: {mode: 'static', colors: [1,1,1]}}      
    }   
  },
  run: function() {
    var that = this;
   //save selected and editPattern
    if (that.conf.pattern !== null){
      that.conf.selected = that.conf.pattern.selected;
      if (that.conf.selected === 4){
        that.conf.editPattern = that.conf.pattern.pattern;
      }
      var inLinks = that.inNodes.send;
      var output = { type: 'LEDSTRIP',pattern:{}};
      output.pattern = that.conf.pattern.pattern;
      if (inLinks.length === 0){
         that.out('pattern', output);
       } else {
           var send = that.combineInput('send','PATTERN');
           that.updateValidValue('send',send);
           var datatype = (typeof send);
           switch (datatype){
             case 'number':
               if (send > 0){
                 that.out('pattern', output);
               } else {
                 that.out('pattern', false);
               }
               break;
             case 'boolean':
               if (send === true){
                  that.out('pattern', output);
               } else {
                   that.out('pattern', false);
               }
               break;         
           }
       }     
    }    
  },
   config: function(){
    this.run();
  }, 
  init: function() {

  }
};

module.exports = node;
