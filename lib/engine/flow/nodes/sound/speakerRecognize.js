var logger = require('../../../../log/log4js').logger;
var config = require('../../../../config/config');
var http = require('http');
var node = {
  name: 'SPEAKERRECOGNIZE',
  conf: {apiKey: null},
  props: {
    'category': 'RECORD',
    'assistanceNode': true,
    'hasassistanceNode': true,
    'in': ['record'],
    'out': ['recognition'],
    'configs':{
       apiKey: { type: 'apiKey'}
    }  
  },
  run: function() {
      var that = this;
      if (!that.timeout){
        var record = that.in('record');
        if ((typeof record === 'object') && (record !== null)){
          if ((record.hasOwnProperty('type')) && (record.type==='record')){
             that.timeout = setTimeout(function() {
               that.timeout = null; 
             }, 10000);
             var conf = config.getConfig();
             var serverIP = conf.serverIP;         
             var post_data = {command: 'speakerRecognize',fileName: record.file};
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
                      clearTimeout(that.timeout);
                      that.timeout = null;
                      var result;
                      try {
                        result = JSON.parse(chunks);
                        if  (result.hasOwnProperty('recognition')){
                           that.out('recognition', result.recognition);
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
    this.out('recognition', '');
  }, 
  init: function() {
     this.timeout = null;
  }
};

module.exports = node;
