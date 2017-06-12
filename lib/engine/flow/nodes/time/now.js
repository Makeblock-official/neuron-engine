var logger = require('../../../../log/log4js').logger;

var node = {
  name: 'NOW',
  conf: {},
  props: {
    'category': 'time',
    'in': [],
    'out': ['hour','minute','second']
  },
  run: function() {
    var that = this;
    updateTime();
    that.interval = setInterval(updateTime,1000);
    function updateTime(){
      var myDate=new Date();
      var hour = myDate.getHours();
      var minute = myDate.getMinutes();
      var second =  myDate.getSeconds();
      that.out('hour', hour);
      that.out('minute', minute);
      that.out('second', second);
    }
  },
  initNode: function(){
    var that = this;
    that.run();
  },
  stop: function(){
    var that = this;
    if (that.interval){
      clearInterval(that.interval);
    }
  },
  init: function() {
    this.interval = null;
  }
};

module.exports = node;
