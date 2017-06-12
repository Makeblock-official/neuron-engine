var node = {
  name: 'RANDOM',
  conf: {from: null, to: null, trigger: null, lastTrigger: null},
  props: {
    'category': 'math',
    'in': ['trigger'],
    'out': ['b'],
    'configs':{ 
       from: { type: 'number', defaultValue: 0},
       to: { type: 'number', defaultValue: 100},
       trigger: { type: 'command', defaultValue: 0}
    }    
  },
  run: function() {
    var that = this;
    var needRun = false;       

    var trigger;
    var inLinks = that.inNodes.trigger;
    if (inLinks.length > 0){
      trigger = that.in('trigger');
    } else{
      if (that.conf.trigger === 'trigger') {
        exec();
        that.conf.trigger = 0;
        that.updateInput('trigger', 0, needRun); 
        return;
      } 
      trigger = 0;
    }
    if ((trigger > 0) && (that.conf.lastTrigger <= 0)) {        
      exec();
    }
    that.conf.lastTrigger = trigger;

    function exec(){
      var from = Number(that.conf.from);
      var to = Number(that.conf.to);
      var n = parseInt(Math.random()*(to-from)+from,10);
      that.out('b', n);
    }
  },
  init: function() {
  }
};

module.exports = node;
