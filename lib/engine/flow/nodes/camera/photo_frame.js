var http = require('http');
var config = require('../../../../config/config');
var logger = require('../../../../log/log4js').logger;
var iotClient = require('../../iotlib/index');

var node = {
  name: 'PHOTO_FRAME',
  conf: {},
  props: {
    'category': 'SNAPSHOT,control',
    'assistanceNode': true,
    'in': ['snapshot'],
    'out': [],
    'configs':{picture: {type: 'hidden'}}
  },
  run: function() {
      var that = this;
      var snapshot = that.in('snapshot');
      if ((typeof snapshot === 'object') && (snapshot !== null)){
        if ((snapshot.hasOwnProperty('type')) && (snapshot.type==='snapshot')){
           var conf = config.getConfig();
           var serverIP = conf.serverIP;         
           var options = {  
            hostname: serverIP,  
            port: 8083,  
            path: '/getPhoto?&filename=' + snapshot.file,
            method: 'GET',  
            headers: {msg: 'getPhoto'}   
          };  
          http.get(options, function(res) {
              var resData = "";
              res.on("data",function(data){
                  resData += data;
              });
              res.on("end", function() {
                            resData = JSON.parse(resData);
                             if  (resData.hasOwnProperty('photodata')){
                                 var topic = that.id + '@' + 'snapshot';
                                 that.client.sendMessage(topic, resData.photodata, function(err){
                                  if(err) {
                                    return logger.warn(err);
                                  }
                                }); 
                             }  
              });
          });              
        }       
      } 
  },
  initNode: function(){
    var that = this;
    var topic = that.id + '@' + 'snapshot';
    that.topics = {};
    that.topics.snapshot = topic;
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