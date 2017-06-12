var logger = require('../../../../log/log4js').logger;
var config = require('../../../../config/config');
var http = require('http');
var node = {
  name: 'RECORD',
  methods: {reportRecordList: null},
  conf: {saveRecord: null, name: null, deleteRecord: null, getRecordList:null, lastTrigger: null},
  props: {
    'category': 'sound',
    'hasassistanceNode': true,
    'in': ['trigger'],
    'out': ['fileName'],
    'configs':{
       saveRecord: { type: 'hidden',defaultValue: false},
       name: {type: 'hidden',defaultValue: ''}
    }  
  },
  run: function() {
      var that = this;
      var trigger = that.in('trigger');
      var conf = config.getConfig();
      var serverIP = conf.serverIP;
      var post_data;
      var send = false;
      if  ((trigger > 0) && (that.conf.lastTrigger <= 0)){
        if (that.conf.saveRecord === true){
          var fileName = that.conf.name!==''?that.conf.name:'RECORD';
          post_data = {command: 'startRecord',fileName: fileName};
        } else {
          post_data = {command: 'startRecord'};
        }
        send = true;
      }
      if  ((trigger <= 0) && (that.conf.lastTrigger > 0)){  
        post_data = {command: 'stopRecord'};
        send = true;
      }
      that.conf.lastTrigger = trigger;
      if (send){
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
                        that.out('fileName', {type: 'record',file: result.fileName});
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
      var conf = config.getConfig();
      var serverIP = conf.serverIP;
      var post_data;
      var send = false;
      if (that.conf.deleteRecord){
        post_data = {command: 'deleteRecod',record: that.conf.deleteRecord};
        send = true;
        that.conf.deleteRecord = 0;
      }
      if (that.conf.getRecordList === true){
        post_data = {command: 'getRecordList'};
        send = true;
        that.conf.getRecordList = false;      
      }  
       if (send){
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
                      if (result.hasOwnProperty('recordList')){
                        if (that.methods.reportRecordList){
                          that.methods.reportRecordList(that.id,result.recordList);
                        }
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
  initNode: function(){
    this.out('fileName', false);
  },     
  init: function() {
 
  }
};

module.exports = node;
