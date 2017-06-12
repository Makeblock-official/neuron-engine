var logger = require('../../../../log/log4js').logger;
var config = require('../../../../config/config');
var http = require('http');
var node = {
  name: 'FACEDETECT',
  conf: {gender: null},
  props: {
    'category': 'logic',
    'in': ['face'],
    'out': ['detect'],
     'configs':{
       gender: { type: 'options', options: [' male','female'],defaultValue:'male'},
    }    
  },
  run: function() {
      var that = this;
      var  post_data = that.in('face');
      var gender = that.conf.gender;
      var conf = config.getConfig();
      var serverIP = conf.serverIP;
     if (post_data){
       var options = {  
        hostname: serverIP,  
        port: 8083,  
        path: '/faceDetect',  
        method: 'POST',  
        headers: {msg: 'faceDetect'}
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
                  if  ((result.gender === gender)){
                    that.out('detect', true);
                  }  else  {
                    that.out('detect', false);
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
