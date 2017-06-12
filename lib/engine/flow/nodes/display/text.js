var IMAGEID = {'none':'','air':'/ue801','checkmark':'/ue802','cloud':'/ue803','heart': '/ue804','moon':'/ue805','rain':'/ue806','rotate':'/ue807','ruler':'/ue808','running':'/ue809','smile':'/ue810','snow':'/ue811','sun':'/ue812','temperature':'/ue813','water':'/ue814'};
var node = {
  name: 'TEXT',
  conf: {text:null, image: null},
  props: {
    'category': 'OLED_DISPLAY',
    'assistanceNode': true,
    'in': ['send'],
    'out': ['text'],
     'configs':{ 
      image: {type: 'options', options: ['none','air','checkmark','cloud','heart','moon','rain','rotate','ruler','running','smile','snow','sun','temperature','water'],defaultValue: 'none'},
      text: {type: 'text',defaultValue: ''}
    }   
  },
  run: function() {
    var that = this;
    if (that.conf.image || that.conf.text){
      var image = (IMAGEID.hasOwnProperty(that.conf.image)?IMAGEID[that.conf.image]:'');
      var text = (that.conf.text!==null?(image + that.conf.text):image); 
      var output  = {type: 'OLED_DISPLAY',text: text};   
      var inLinks = that.inNodes.send;
      if (inLinks.length === 0){
         that.out('text', output);
       } else {
         var send = that.in('send');
         var datatype = (typeof send);
         switch (datatype){
           case 'number':
             if (send > 0){
               that.out('text', output);
             } else {
               that.out('text', false);
             }
             break;
           case 'boolean':
             if (send === true){
                 that.out('text', output);
             } else {
                 that.out('text', false);
             }
             break;    
           case 'string': 
             output.text = send + text;
             that.out('text', output);
             break;
           case 'object': 
             if ((send!==null) && (send.hasOwnProperty('text'))){
               output.text = send.text + text;
               that.out('text', output);
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
