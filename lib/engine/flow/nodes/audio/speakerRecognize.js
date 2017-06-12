var logger = require('../../../../log/log4js').logger;
var config = require('../../../../config/config');
var http = require('http');
var node = {
  name: 'SPEAKERRECOGNIZE',
  conf: {include: null},
  props: {
    'category': 'logic',
    'in': ['speech'],
    'out': ['recognition'],
     'configs':{
       include: { type: 'options', options: [' on','off','red','green','blue'],defaultValue:'on'},
    }    
  },
  run: function() {
      var that = this;
      var  post_data = that.in('speech');
      var include = that.conf.include;
      var conf = config.getConfig();
      var serverIP = conf.serverIP;
     if (post_data){
       var options = {  
        hostname: serverIP,  
        port: 8083,  
        path: '/speakerRecognize',  
        method: 'POST',  
        headers: {msg: 'speakerRecognize'}
      };     
      var req = http.request(options, function (res) { 
            var chunks = '';
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
              chunks += chunk;
            });
            res.on('end', function() {
                var error, result;
                try {
                  result = JSON.parse(chunks);
                  console.log("result:",result);  
                  if  ((result.speech.indexOf (include) >= 0)){
                    that.out('recognition', true);
                  }  else  {
                    that.out('recognition', false);
                  }     
                } catch (e) {
                   
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
