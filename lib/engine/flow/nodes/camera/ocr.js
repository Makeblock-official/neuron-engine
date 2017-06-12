var logger = require('../../../../log/log4js').logger;
var config = require('../../../../config/config');
var http = require('http');
var node = {
  name: 'OCR',
  conf: {apiKey: null},
  props: {
    'category': 'SNAPSHOT',
    'assistanceNode': true,
    'hasassistanceNode': true,
    'in': ['snapshot'],
    'out': ['text'],
    'configs':{
       apiKey: { type: 'apiKey'}
    }  
  },
  run: function() {
      var that = this;
      if (!that.timeout){
        var snapshot = that.in('snapshot');
        if ((typeof snapshot === 'object') && (snapshot !== null)){
          if ((snapshot.hasOwnProperty('type')) && (snapshot.type==='snapshot')){
             that.timeout = setTimeout(function() {
               that.timeout = null; 
             }, 10000);            
             var conf = config.getConfig();
             var serverIP = conf.serverIP;         
             var post_data = {command: 'ocrDetect',fileName: snapshot.file};
             var options = {  
              hostname: serverIP,  
              port: 8083,  
              path: '/camera',  
              method: 'POST',  
              headers: {msg: 'camera'}   
            };  
            var req = http.request(options, function (res) { 
                  var chunks = '';
                  res.setEncoding('utf8');
                  res.on('data', function(chunk) {
                     chunks += chunk;
                  });
                  res.on('end', function() {
                      clearTimeout(that.timeout);
                      that.timeout = null;                    
                      var result;
                      try {
                        result = JSON.parse(chunks);
                        console.log("result:",result);  
                        if  (result.hasOwnProperty('recognition')){
                           that.out('text', result.recognition);
                         } 
                      } catch (e) {
                        logger.warn(e); 
                      }       
                  }); 
                });  
            req.write(JSON.stringify(post_data));  
            req.end();              
          }       
        }
      }             
  },
  initNode: function(){
    this.out('text', '');
  },   
  init: function() {
    this.timeout = null;
  }
};

module.exports = node;
