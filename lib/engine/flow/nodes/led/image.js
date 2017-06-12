var node = {
  name: 'IMAGE',
  conf: {image: null,selected:null, editImage:null},
  props: {
    'category': 'LEDPANEL',
    'assistanceNode': true,
    'inputCombine':  true,
    'outPutType': 'object',
    'in': ['send'],
    'out': ['image'],
    'configs':{ 
      image: {type: 'image'},
      selected: {type: 'hidden',defaultValue: 0},
      editImage: {type: 'hidden',defaultValue: []}
    }
  },
  run: function() {
    var that = this;
    var inLinks = that.inNodes.send;
    var image = { type: 'LEDPANEL',matrix:[]};
    if (that.conf.image !== null){
      image.matrix = that.conf.image.matrix;
      that.conf.selected = that.conf.image.selected;
   }
    if (that.conf.selected === 4){
      that.conf.editImage = that.conf.image.matrix;
    }    
    if (inLinks.length === 0){
       that.out('image', image);
     } else {
         var send = that.combineInput('send','IMAGE');
         that.updateValidValue('send',send);
         var datatype = (typeof send);
         switch (datatype){
           case 'number':
             if (send > 0){
               that.out('image', image);
             } else {
                that.out('image', false);
             }
             break;
           case 'boolean':
             if (send === true){
                 that.out('image', image);
             } else {
                 that.out('image', false);
             }
             break;         
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
