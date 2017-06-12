var node = {
  name: 'FILTER',
  conf: {from: null, to: null},
  props: {
    'category': 'advanced',
    'in': ['a'],
    'out': ['b'],
    'configs':{ 
       from: { type: 'number', defaultValue: 0},
       to: { type: 'number', defaultValue: 255}
    }    
  },
  config: function(){
    this.run();
  },  
  run: function() {
    var that = this;
    var n = Number(that.in('a'));
    var from = Number(that.conf.from);
    var to = Number(that.conf.to);
    if (n < from || n > to){
      n = false;
    } 
    that.out('b', n);
  },
  getInputPort: function(){
    return 'a';
  },    
  init: function() {
  }
};

module.exports = node;
