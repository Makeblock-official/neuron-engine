var logger = require('../../../../log/log4js').logger;

var node = {
  name: 'HOLD',
  conf: {type: null, time: null, lastTime: null, amplitude:null},
  props: {
    'category': 'time',
    'in': ['a'],
    'out': ['b'],
    'configs':{ 
       type: { type: 'options', options: ['hold until change','hold for time','change slowly'],defaultValue: 'hold until change'},
       time: { type: 'number', defaultValue: 3},
       amplitude: {type: 'number', defaultValue: 50}
    }
  },
  run: function() {
    var that = this;
    var a = that.in('a');
    var b = that.outValues.b;
    var time = that.conf.time;
    var amplitude = Math.abs(that.conf.amplitude);
    var type = that.conf.type;
    switch (type) {
      case 'hold until change':
        that.stop();               
        if ((a !== false) && (a != b)){
          that.out('b', a); 
        }
        break;
      case 'hold for time':
        if (time != that.conf.lastTime){
          that.stop();
          if (a > 0){
            exec();         
          }
          that.conf.lastTime = time;
        }  else {
          if (that.timeout) {
            logger.warn('still hold,ingore input');
          } else {
            exec();
          }
        }
        break;
      case 'change slowly':
        that.stop();     
        if (a !=b){
           if (a === false){
             a = 0;
           }
           var datatype = (typeof a);
           if (datatype === 'number'){
             if ((typeof b) !== 'number'){
               b = 0;
             }
             that.interval = setInterval(updateOutput,200);
           } else {
             that.out('b',a); 
           }
        } 
    }

    function updateOutput(){
       var a = that.in('a');
       var b = that.outValues.b;    
       var temp;
       if (a > b){
         if ((a - b) >  amplitude){
           temp = b + amplitude;
         } else {
           temp = a;
         }
       } else if (a < b){
         if ((b - a) >  amplitude){
           temp = b - amplitude;
         } else {
           temp = a;
         }        
       } else {
         clearInterval(that.interval);
         that.interval = null;   
         temp = a;    
       }
       that.out('b',temp); 
    }

    function exec () {
      var input = that.in('a');
      that.out('b', input);
      if (input === 0 || input === false){

      } else {
        if (time > 0){
          that.timeout = setTimeout(clear, time * 1000);
        }
      }
    }
    function clear () {
      if (that.timeout){
        clearTimeout(that.timeout);
        that.timeout = null;
        var input = that.in('a');
        var output = that.outValues.b;
        if (input != output){
          that.out('b', input);
        }
      }
    }
  },
  stop: function() {
    var that = this;
    if (that.timeout){
      clearTimeout(that.timeout);
      that.timeout = null;
    }
    if (that.interval){
      clearInterval(that.interval);
      that.interval = null;
    }    
  },
  initNode: function(){
    this.run();
  },   
  getInputPort: function(){
    return 'a';
  },    
  init: function() {
    this.timeout = null;
    this.interval = null;
    this.validValue.a = 0;
  }
};

module.exports = node;
