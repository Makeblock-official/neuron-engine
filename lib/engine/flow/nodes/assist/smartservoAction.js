var logger = require('../../../../log/log4js').logger;
var config = require('../../../../config/config');
var event = require('../../../../event/event');
var electronicblock = require('../../electronicblock');
var node = {
  name: 'SMARTSERVOACTION',
  methods: {reportServolist: null},
  conf: {no: null, setZero: null,moveType:null,angle:null,lock: null,speed:null,delay:null},
  props: {
    'category': 'SMARTSERVO',
    'assistanceNode': true,
    'in': ['input'],
    'out': ['action'],
    'configs':{
       no: { type: 'hidden',defaultValue: null},
       setZero: {type: 'hidden'},
       moveType: { type: 'options', options: ['move to','move by','keep moving'],defaultValue: 'move to'},
       angle: { type: 'hidden',defaultValue: 90},
       lock: { type: 'hidden',defaultValue: 'lock'},
       speed: { type: 'hidden',defaultValue: 40},
       delay: { type: 'hidden',defaultValue: 0},
    }    
  },
  run: function() {
    var that = this;
    var inLinks = that.inNodes.input;
    if (inLinks.length > 0){
      var input = that.in('input');
      var no = that.conf.no!==null?that.conf.no:1;
      var moveType = that.conf.moveType!==null?that.conf.moveType:'move to';
      var angle = that.conf.angle!==null?that.conf.angle:90;
      var speed = that.conf.speed!==null?that.conf.speed:40;
      var delay = that.conf.delay!==null?that.conf.delay:0;
      var action = {type: 'SMARTSERVO', actions: [{no: no,moveType: moveType,angle: angle,speed:speed,delay:delay}]};      
      if (input !== null){
          if ((typeof input) === 'object' && input.hasOwnProperty('actions')){        
              input.actions.push(action.actions[0]);
              that.out('action',input);
          } else {
            if (input > 0 ){
              that.out('action',action);
            } 
          }
      }      
    }       
  },

  config: function(){
    var that = this;
    var no = that.conf.no!==null?that.conf.no:1;
    if (that.conf.setZero === true){
      that.conf.setZero = false;
      electronicblock.sendBlockCommand('SMARTSERVO','SET_ANGLE_AS_ZERO',[],no);
    }
    if (that.conf.lock === 'lock'){
       electronicblock.sendBlockCommand('SMARTSERVO','SET_BREAK',[0],no);
    } else if (that.conf.lock === 'unlock'){
      electronicblock.sendBlockCommand('SMARTSERVO','SET_BREAK',[1],no);
    }
  },

  stop: function(){
    var that = this;
    event.removeListener("sameTypeBlockCountChanges", that.listener);
  },

  initNode: function(){
    var that = this;
    that.listener = function(blockCount){
       if (blockCount.type === 'SMARTSERVO'){
         if (that.methods.reportServolist !== null){
           var list = [];
           for (var i = 0; i < blockCount.count; i++){
             list.push(i+1);
           }
           that.methods.reportServolist(list);
         }
       }
    };
    event.on("sameTypeBlockCountChanges", that.listener);
    electronicblock.updateElectronicBlockCount('SMARTSERVO');
  }, 
  init: function() {
 
  }
};

module.exports = node;
