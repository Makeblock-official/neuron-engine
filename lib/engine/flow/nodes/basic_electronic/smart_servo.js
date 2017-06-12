var electronicblock = require('../../electronicblock');

var node = {
  name: 'SMARTSERVO',
  conf: {},
  props: {
    'category': 'electronic',
    'hasassistanceNode': true,   
    'in': ['input'],
    'out': []
  },
  run: function() {
    var that = this;
    var input = this.in('input');
    var takeNextaction = function(){
       if (that.actions.length > 0){
         var no = that.actions[0].no;
         var angle = that.actions[0].angle;
         var speed =  that.actions[0].speed;
         var delay = that.actions[0].delay * 1000;
         var moveType = that.actions[0].moveType;
         switch (moveType){
           case 'move to':
              electronicblock.sendBlockCommand('SMARTSERVO','SET_ABSOLUTE_SHORT_ANGLE',[angle,speed],no);
             break;
            case 'move by':
              electronicblock.sendBlockCommand('SMARTSERVO','SET_RELATIVE_SHORT_ANGLE',[angle,speed],no);
              break;
            case 'keep moving':
             electronicblock.sendBlockCommand('SMARTSERVO','SET_PWM',[speed],no);
             break;
         }
         that.actions.splice(0, 1);
         if (delay > 0){
           that.nextTimeout = setTimeout(takeNextaction,delay);  
         } else {
          takeNextaction();
         }
       }
    };
    if (input !== null){
      if ((typeof input) === 'object' && input.hasOwnProperty('actions')){
        if (that.nextTimeout){
          clearTimeout(that.nextTimeout);
          that.nextTimeout = null;
        }
        that.actions = input.actions; 
        takeNextaction();
      }
    }
  },
  init: function() {
    this.actions = [];
    this.nextTimeout = null;
  }
};

module.exports = node;
