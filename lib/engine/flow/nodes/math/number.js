var node = {
  name: 'NUMBER',
  methods: {report: null},
  conf: {number: null,lastNumber: null, lastSend: null},
  props: {
    'category': 'math',
    'in': ['send'],
    'out': ['number'],
    'configs':{ 
       number: { type: 'number', defaultValue: 0}
    }
  },
  run: function() {
    var that = this;
    var send = that.in('send');
    var number = that.conf.number;
    number = Number(number);
    if (number !== that.conf.lastNumber){
      if (that.methods.report){
        that.methods.report(that.id,number);
      }
      that.out('number', number);
      that.conf.lastNumber = number;
      return;
    }
    if ((send > 0) && (that.conf.lastSend <= 0)){
      that.out('number', number);
    }
    that.conf.lastSend = send;
  },
  init: function() {

  }
};

module.exports = node;
