var node = {
  name: 'THRESHOLD',
  conf: {from: null, to: null},
  props: {
    'category': 'math',
    'in': ['a'],
    'out': ['b'],
    'configs':{ 
       from: { type: 'number', defaultValue: 0},
       to: { type: 'number', defaultValue: 255}
    }    
  },
  run: function() {
    var that = this;
    var n = Number(that.in('a'));
    var from = Number(that.conf.from);
    var to = Number(that.conf.to);
    if (n >= from && n <= to){
      n = n;
    } else{
      n = 0;
    }
    that.out('b', n);
  },
  init: function() {
  }
};

module.exports = node;
