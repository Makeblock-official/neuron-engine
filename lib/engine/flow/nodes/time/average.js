var logger = require('../../../../log/log4js').logger;
var INTERVAL = 0.2;
var node = {
  name: 'AVERAGE',
  conf: {timeLength: null},
  props: {
    'category': 'time',
    'in': ['a'],
    'out': ['b'],
    'configs':{ 
       timeLength: { type: 'number', defaultValue: 10}
    }
  },
  run: function() {
    var that = this;
    var a = that.in('a');
    if (that.conf.timeLength <= INTERVAL){
      that.out('b',a);
      that.stop();    
    } else {
      if (!that.interval) {
        that.interval = setInterval(updateOutput,INTERVAL * 1000);
      }
    }

    function  updateOutput(){
      var inLinks = that.inNodes.a;
      if (inLinks.length > 0){
        a = that.in('a');
        if ((typeof a) === 'boolean'){
           a = (a === true?1:0);
        }
        var i,b;
        var sum = 0;
        var timeLength = that.conf.timeLength;
        var maxLength =  Math.floor(timeLength / INTERVAL);
        if ((typeof a) === 'number'){
          if (that.dataCache.length >= maxLength){
            for (i = 0; i < (that.dataCache.length -1); i++){
              that.dataCache[i] = that.dataCache[i+1];
            }
            that.dataCache[that.dataCache.length -1] = a;
            for (i = (that.dataCache.length -1); i >= (that.dataCache.length - maxLength); i--){
              sum = sum + that.dataCache[i];
            }
            b = sum / maxLength;
          } else {
            that.dataCache.push(a);
            for (i = 0; i < that.dataCache.length; i++){
              sum = sum + that.dataCache[i];
            }
             b = sum / that.dataCache.length;
          }
          that.out('b',b);
        }
      }
    }
  },
  stop: function(){
    var that = this;
    if (that.interval) {
      clearInterval(that.interval);
      that.interval = null;
    } 
  },
  initNode: function(){
    this.out('b',0);
  },
  getInputPort: function(){
    return 'a';
  },    
  init: function() {
    this.interval = null;
    this.dataCache = [];
    this.validValue.a = 0;
  }
};

module.exports = node;
