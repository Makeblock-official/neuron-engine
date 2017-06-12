var node = {
  name: 'RANDOM',
  conf: {from: null, to: null, trigger: null, lastTrigger: null},
  props: {
    'category': 'advanced',
    'in': ['trigger'],
    'out': ['b'],
    'configs':{ 
       from: { type: 'number', defaultValue: 0},
       to: { type: 'number', defaultValue: 100},
       trigger: { type: 'hidden'}
    }    
  },
  run: function() {
    var that = this;    

    if (that.conf.trigger === 'trigger') {
      exec();
      that.conf.trigger = 0;
      return;
   }    
   var trigger = that.in('trigger');
    if ((trigger > 0) && (that.conf.lastTrigger <= 0)) {        
      exec();
    }
    that.conf.lastTrigger = trigger;

    function exec(){
      var from = Number(that.conf.from);
      var to = Number(that.conf.to);
      var number = Math.round(Math.random()*(to-from)+from);
      that.out('b', number);
    }
  },
  config: function(){
    this.run();
  },  
  initNode: function(){
    this.out('b',0);
  },    
  init: function() {
  }
};

module.exports = node;
