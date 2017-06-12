var node = {
  name: 'NUMBER',
  methods: {report: null},
  conf: {number: null,lastNumber: null},
  props: {
    'category': 'common',
    'in': ['send'],
    'out': ['number'],
    'configs':{ 
       number: { type: 'number', defaultValue: 0}
    }
  },
  run: function() {
    var that = this;
    var number = that.conf.number;
    number = Number(number);
    var inLinks = that.inNodes.send;
    if (inLinks.length === 0){
         that.out('number', number);
    } else {
      var send = that.in('send');
      if (send > 0){
        that.out('number', number);
      } else {    
        that.out('number', false);
      }
    }
  },

  config: function(){
    this.run();
  },

  getInputPort: function(){
    return 'send';
  },   
  init: function() {

  }
};

module.exports = node;
