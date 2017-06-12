var logger = require('../../../../log/log4js').logger;
var node = {
  name: 'MAP',
  conf: {minin: null, maxin: null, minout: null, maxout: null},
  props: {
    'category': 'math',
    'in': ['a'],
    'out': ['b'],
    'configs':{ 
       minin: { type: 'number', defaultValue: 0},
       maxin: { type: 'number', defaultValue: 100},
       minout: { type: 'number', defaultValue: 0},
       maxout: { type: 'number', defaultValue: 255},
    }    
  },
  run: function() {
    var that = this;
    var n = Number(that.in('a'));
    var minin = Number(that.conf.minin);
    var maxin = Number(that.conf.maxin);
    var minout = Number(that.conf.minout);
    var maxout = Number(that.conf.maxout);
    if (((maxin - minin) === 0) || ((maxout - minout) ===0)){
      this.out('b', Number.NaN);
      return;
    }
    var result= ((n - minin) / (maxin - minin) * (maxout - minout)) + minout;
    that.out('b', result);
  },
  init: function() {
  }
};

module.exports = node;
