var logger = require('../../../../log/log4js').logger;
var config = require('../../../../config/config');
var http = require('http');
var node = {
  name: 'TEXTTOSPEECH',
  conf: {text: null,test: null, file: null, lastTrigger: null, lastText: null},
  props: {
    'category': 'sound',
    'in': ['trigger'],
    'out': [],
    'configs':{
       text: {type: 'text',defaultValue: ''},
       test: {type: 'hidden'},
       file: {type: 'text',defaultValue: ''},
    }  
  },
  run: function() {
      var that = this;
      var post_data;
      var send  = false;
      var trigger = that.in('trigger');
      if (trigger > 0 && that.conf.lastTrigger <= 0){
        var file = that.id + '.wav';
        if (that.conf.text === null || that.conf.text === ''){
          logger.warn('text was null');
        } else {
          post_data = {command: 'playSound',speech: file,text: that.conf.text,fileName: that.id};
          send = true;
        }
      }
      that.conf.lastTrigger = trigger;
      if (send){
        var conf = config.getConfig();
        var serverIP = conf.serverIP;
        var options = {  
          hostname: serverIP,  
          port: 8083,  
          path: '/sound',  
          method: 'POST',  
          headers: {msg: 'sound'}   
        };  
        var req = http.request(options, function (res) { 
              var chunks = '';
              res.setEncoding('utf8');
              res.on('data', function(chunk) {
                 chunks += chunk;
              });
              res.on('end', function() {
                  var result;
                  try {
                    result = JSON.parse(chunks);
                    console.log("result:",result);  
                    if  (result.hasOwnProperty('fileName')){
                       that.conf.file = result.fileName;
                     } 
                  } catch (e) {
                    logger.warn(e); 
                  }       
              }); 
            });  
        req.write(JSON.stringify(post_data));  
        req.end();         
      }        
  },
  config: function(){
      var that = this;
      var post_data;
      var send = false;
      if (that.conf.lastText!== that.conf.text){
       if (that.conf.text === null || that.conf.text === ''){
          logger.warn('text was null');
        } else {
          post_data = {command: 'textToSpeech',text: that.conf.text,fileName: that.id};
          send =true;
        }
        that.conf.lastText= that.conf.text;
      }
      if (that.conf.test === true){
        var file = that.id + '.wav';
       if (that.conf.text === null || that.conf.text === ''){
          logger.warn('text was null');
        } else {
          post_data = {command: 'playSound',speech: file,text: that.conf.text,fileName: that.id};
          that.conf.test = false;
          send =true;
        }        
      }
      if (send){
        var conf = config.getConfig();
        var serverIP = conf.serverIP;
        var options = {  
          hostname: serverIP,  
          port: 8083,  
          path: '/sound',  
          method: 'POST',  
          headers: {msg: 'sound'}   
        };  
        var req = http.request(options, function (res) { 
              var chunks = '';
              res.setEncoding('utf8');
              res.on('data', function(chunk) {
                 chunks += chunk;
              });
              res.on('end', function() {
                  var result;
                  try {
                    result = JSON.parse(chunks);
                    console.log("result:",result);  
                    if  (result.hasOwnProperty('fileName')){
                       that.conf.file = result.fileName;
                     } 
                  } catch (e) {
                    logger.warn(e); 
                  }       
              }); 
            });  
        req.write(JSON.stringify(post_data));  
        req.end();                 
      }
  },
  stop: function(){
    var that = this;
    var file = that.id + '.wav';
    if (that.conf.file === file){
      var conf = config.getConfig();
      var serverIP = conf.serverIP;
      var post_data = {command: 'deleteSpeech',speech: that.conf.file};
      var options = {  
            hostname: serverIP,  
            port: 8083,  
            path: '/sound',  
            method: 'POST',  
            headers: {msg: 'sound'}   
        };  
        var req = http.request(options, function (res) { 
            var chunks = '';
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
               chunks += chunk;
            });
            res.on('end', function() {
                var result;
                try {
                  result = JSON.parse(chunks);
                  console.log("result:",result);  
                } catch (e) {
                   logger.warn(e); 
                }       
            }); 
      });  
      req.write(JSON.stringify(post_data));  
      req.end();        
    }
  },
  init: function() {
 
  }
};

module.exports = node;
