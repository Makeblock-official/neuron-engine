var node = {
  name: 'FACE',
  conf: {faceId:null, blink: null},
  props: {
    'category': 'OLED_DISPLAY',
    'assistanceNode': true,
    'inputCombine':  true,
    'in': ['send'],
    'out': ['face'],
     'configs':{ 
      faceId: {type: 'options', options: ['angry','drowsy','enlarged','fixed','happy','mini','normal','sad'],defaultValue: 'normal'},
      blink: {type: 'text',defaultValue: 'blink'}
    }   
  },
  run: function() {
    var that = this;
    if (that.conf.faceId && that.conf.blink){
      var face = { type: 'OLED_DISPLAY',face:{faceId: that.conf.faceId, blink: that.conf.blink}};
      var inLinks = that.inNodes.send;
      if (inLinks.length === 0){
         that.out('face', face);
       } else {
         var send = that.combineInput('send','OLED_DISPLAY');
         that.updateValidValue('send',send);
         var datatype = (typeof send);
         switch (datatype){
           case 'number':
             if (send > 0){
               that.out('face', face);
             } else {
               that.out('face', false);
             }
             break;
           case 'boolean':
             if (send === true){
                 that.out('face', face);
             } else {
                 that.out('face', false);
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
