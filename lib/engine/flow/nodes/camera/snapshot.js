var http = require('http');
var config = require('../../../../config/config');
var logger = require('../../../../log/log4js').logger;

var node = {
  name: 'SNAPSHOT',
  methods: {reportSnapshot: null},
  conf: {snapshot: null, lastTrigger: null},
  props: {
    'category': 'camera',
    'hasassistanceNode': true,
    'in': ['trigger'],
    'out': ['fileName'],
     'configs':{picture: {type: 'hidden'}, snapshot: {type: 'hidden'}}
  },
  run: function() {
    var that = this;
    var file = that.id + '.jpg';
    var conf = config.getConfig();
    var serverIP = conf.serverIP;
    var trigger = that.in('trigger');
    if (((trigger > 0) && (that.conf.lastTrigger <= 0)) || (that.conf.snapshot === true)){
      that.conf.snapshot = false;
       var options = {  
          hostname: serverIP,  
          port: 8329,  
          path: '/snap?filename=' + file,  
          method: 'GET',  
          headers: {msg: 'snapshot'}
        };        
       http.get(options, function(res) {
          var resData = "";
          res.on("data",function(data){
              resData += data;
          });
          res.on("end", function() {  
              if (that.methods.reportSnapshot){
                that.methods.reportSnapshot();
              }                     
              that.out('fileName', {type: 'snapshot',file: file});
          });
        });       
    }
    that.conf.lastTrigger = trigger;
  },
  stop: function(){
    var that = this;
    var file = that.id + '.jpg';
    var conf = config.getConfig();
    var serverIP = conf.serverIP;
    var post_data = {command: 'deletePhoto',photo: file};
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
  },
  config: function(){
    this.run();
  }, 
  initNode: function(){
    this.out('fileName', false);
  },    
  init: function() {

  }
};

module.exports = node;