var http = require('http');
var config = require('../../../../config/config');
var logger = require('../../../../log/log4js').logger;

var node = {
  name: 'USB_CAMERA',
  methods: {reportState: null},
  conf: {takepicture: null},
  props: {
    'category': 'electronic',
    'in': [],
    'out': ['picture'],
     'configs':{takepicture: {type: 'hidden'}}
  },
  run: function() {
    var that = this;
    var conf = config.getConfig();
    var serverIP = conf.serverIP;
    if (that.conf.takepicture === 'takepicture') {
       that.conf.takepicture = 0;
       var options = {  
          hostname: serverIP,  
          port: 8079,  
          path: '/0/action/snapshot',  
          method: 'GET',  
          headers: {msg: 'snapshot'}
        };        
       http.get(options, function(res) {
          var resData = "";
          res.on("data",function(data){
              resData += data;
          });
          res.on("end", function() {
              that.out('picture','snapshot.jpg');
          });
        });       
    }
  },
  setup: function(){
    logger.warn('camera setup');
    var options;
   var post_data = {command: 'open'}; 
    var conf = config.getConfig();
    var serverIP = conf.serverIP;   
    options = {  
            hostname: serverIP,  
            port: 8083,  
            path: '/setCamera',  
            method: 'POST',  
            headers: {msg: 'setCamera'}
    };   
    var req = http.request(options, function (serverFeedback) { 
            if (serverFeedback.statusCode != 200) {  
                logger.warn('error http response code ' + serverFeedback.statusCode);
            }  

            serverFeedback.on('data', function (feedback) {
              feedback = JSON.parse(feedback);
              if (feedback.errCode !== 0){
                logger.warn("errCode: " + feedback.errCode + " errMsg: " + feedback.errMsg);
              }
            }); 
      });  
      req.write(JSON.stringify(post_data));  
      req.end();   
  },  
   stop: function(){
    var options;
    var post_data = {command: 'close'};      
    var conf = config.getConfig();
    var serverIP = conf.serverIP;   
    options = {  
            hostname: serverIP,  
            port: 8083,  
            path: '/setCamera',  
            method: 'POST',  
            headers: {msg: 'setCamera'}
    };   
    var req = http.request(options, function (serverFeedback) { 
            if (serverFeedback.statusCode != 200) {  
                logger.warn('error http response code ' + serverFeedback.statusCode);
            }  

            serverFeedback.on('data', function (feedback) {
              feedback = JSON.parse(feedback);
              if (feedback.errCode !== 0){
                logger.warn("errCode: " + feedback.errCode + " errMsg: " + feedback.errMsg);
              }
            }); 
      });  
      req.write(JSON.stringify(post_data));  
      req.end();   
  }, 
  init: function() {
  },

  getBlockVersion: function() {
    var that = this;
    electronicblock.getBlockVersion(that.name, that.idx);
  },
  updateNeuronBlock: function() {
    var that = this;
    electronicblock.updateBlockFirmware(that.name, that.idx);
  }
};

module.exports = node;
