var http = require('http');
var config = require('../../../../config/config');
var logger = require('../../../../log/log4js').logger;

var node = {
  name: 'USB_CAMERA',
  methods: {reportState: null},
  conf: {command: null},
  props: {
    'category': 'electronic',
    'in': [],
    'out': [],
    'configs': {command: {type: 'options', options: ['open','close','snapshot']}}
  },
  run: function() {
    var that = this;
    var options;
    var body = 'camera operation'; 
    var conf = config.getConfig();
    var serverIP = conf.serverIP;
    if (that.conf.command){
      switch (that.conf.command) {
        case 'open':
          options = {  
            hostname: serverIP,  
            port: 8083,  
            path: '/openCamera',  
            method: 'POST',  
            headers: {msg: 'openCamera'}
          }; 
          break;
        case 'close':
          options = {  
            hostname: serverIP,  
            port: 8083,  
            path: '/closeCamera',  
            method: 'POST',  
            headers: {msg: 'closeCamera'}
          }; 
          break; 
      case 'snapshot':
           options = {  
            hostname: serverIP,  
            port: 8079,  
            path: '/0/action/snapshot',  
            method: 'GET',  
            headers: {msg: 'snapshot'}
          };       
          break;        
      }    
      if (options.method === 'POST'){
        var req = http.request(options, function (serverFeedback) { 
            if (serverFeedback.statusCode != 200) {  
                logger.warn('error http response code ' + serverFeedback.statusCode);
            }  

            serverFeedback.on('data', function (feedback) {
              feedback = JSON.parse(feedback);
              if (feedback.errCode !== 0){
                logger.warn("errCode: " + feedback.errCode + " errMsg: " + feedback.errMsg);
              }
              if (that.methods.reportState){
                that.methods.reportState(that.id,feedback.state);  
              } 
            }); 
        });  
        req.write(body);  
        req.end();
      } else if (options.method === 'GET') {
           http.get(options, function(res) {
              var resData = "";
              res.on("data",function(data){
                  resData += data;
              });
              res.on("end", function() {
                  console.log(resData);
              });
          });  
      }
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

  }
};

module.exports = node;
