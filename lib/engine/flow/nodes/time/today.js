var logger = require('../../../../log/log4js').logger;

var node = {
  name: 'TODAY',
  conf: {},
  props: {
    'category': 'time',
    'in': [],
    'out': ['day','month','week']
  },
  run: function() {
    var that = this;
    updateDate();
    that.interval = setInterval(updateDate,50000);
    function updateDate(){
      var myDate=new Date();
      var month = myDate.getMonth() + 1;
      var day =  myDate.getDate();
      var week = myDate.getDay();
      if (week === 0){
        week = 7;
      }
      that.out('month', month);
      that.out('day', day);
      that.out('week', week);
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
