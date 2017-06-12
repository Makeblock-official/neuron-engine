var http = require('http');
var config = require('../../../../config/config');
var logger = require('../../../../log/log4js').logger;

var node = {
  name: 'USB_AUDIO',
  methods: {reportState: null},
  conf: {loop: null,lastPlay:null,lastStop:null,lastPrev:null,lastNext:null,lastvolumeUp:null,lastvolumeDown:null,lastNLoop:null,lastRecord:null},
  props: {
    'category': 'electronic',
    'in': ['play','stop','prev','next','volumeUp','volumeDown','record'],
    'out': [],
    'configs':{loop: {type: 'options', options: ['none','one','all','random'],defaultValue: 'none'}}
  },
  run: function() {
    var that = this;
    var play = that.in('play');
    var stop = that.in('stop');
    var prev = that.in('prev');
    var next = that.in('next');
    var volumeUp = that.in('volumeUp');
    var volumeDown = that.in('volumeDown');
    var record = that.in('record');
    var loop = that.conf.loop;
    var conf = config.getConfig();
    var serverIP = conf.serverIP;
    var options = {  
      hostname: serverIP,  
      port: 8083,  
      path: '/setAudio',  
      method: 'POST',  
      headers: {msg: 'setAudio'}
    };
    var post_data;
    if ((play > 0) && (that.conf.lastPlay <= 0)){
      post_data = {command: 'play'};      
    }
    if ((stop > 0) && (that.conf.lastStop <= 0)){
      post_data = {command: 'stop'};  
    }
    if ((prev > 0) && (that.conf.lastPrev <= 0)){
      post_data = {command: 'b'};
    }
    if ((next > 0) && (that.conf.lastNext <= 0)){
      post_data = {command: 'f'}; 
    }
    if ((volumeUp > 0) && (that.conf.lastvolumeUp <= 0)){
      post_data = {command: '+'};
    }
    if ((volumeDown > 0) && (that.conf.lastvolumeDown <= 0)){
      post_data = {command: '-'}; 
    }
     if ((record > 0) && (that.conf.lastRecord <= 0)){
      post_data = {command: 'record'};  
    }   
/*
    if (number !== that.conf.lastNumber){
      
    }
    if (loop !== that.conf.lastNLoop){
      var mode = {'none': 0, 'one': 1,'all': 2, 'random': 3};
      if (loop in mode){
        
      }
    }
*/
    that.conf.lastPlay = play;
    that.conf.lastStop = stop;
    that.conf.lastPrev = prev;
    that.conf.lastNext = next;
    that.conf.lastvolumeUp = volumeUp;
    that.conf.lastvolumeDown = volumeDown;
    that.conf.lastRecord = record;
/*
    that.conf.lastNumber = number;
    that.conf.lastNLoop = loop;
*/
    if (post_data){
      var req = http.request(options, function (serverFeedback) { 
            if (serverFeedback.statusCode != 200) {  
                logger.warn(err || new Error('error http response code ' + serverFeedback.statusCode));
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
      req.write(JSON.stringify(post_data));  
      req.end();
    }
  },
  init: function() {

  }
};

module.exports = node;
