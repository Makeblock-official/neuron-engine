var logger = require('../../../../log/log4js').logger;
var iotClient = require('../../iotlib/index');
var querystring = require('querystring');

var node = {
  name: 'DROPDOWN',
  methods: {selected: null, report: null},
  conf: {name: null,options: null,lastOptions: null},
  props: {
    'category': 'cloud',
    'outPutType': 'text', //text or number
    'in': [],
    'out': ['selected'],
    'configs':{ 
      name: { type: 'text'},
      options: {type: 'textarea'}
    } 
  },
  run: function() {
    var that = this;

    var str = that.conf.options;
    if (str != that.conf.lastOptions){
      that.conf.lastOptions = str;
      str = str.replace(/[\r\n]/g,"@");
      var result = querystring.parse(str,'@');
      var data = [];
      for (var value in result){
        data.push(value);
      }
      if (that.methods.report){
        that.methods.report(that.id,data);
      }
      return;
    }
 
    if (that.methods.selected){
      that.out('selected',that.methods.selected);
    }
  },
  setup: function(){
    var that = this;
    var topic = that.id + '@' + 'selected';
    that.topics = {};
    that.topics.selected = topic;
    if (that.client){
      that.client.onMessage(topic, function(data){
        that.out('selected', data);
      }); 
    }   
  },
  stop: function(){
    var that = this;
    var topic = that.id + '@' + 'selected';
    if (that.client) {
      that.client.stopReceiveMessage(topic);
    }
  },
  init: function() {
    this.client = iotClient.getClient();
    if (!this.client){
      logger.warn('client not register yet, register first');
      return -1;
    }
  }
};

module.exports = node;
