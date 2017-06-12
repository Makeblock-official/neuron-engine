var logger = require('../../../../log/log4js').logger;
var config = require('../../../../config/config');
var http = require('http');
var node = {
  name: 'PLAYSOUND',
  methods: {reportRecordList: null},
  conf: {soundType: null, soundEffect: null, record: null,deleteRecord: null, getRecordList:null},
  props: {
    'category': 'sound',
    'in': ['trigger'],
    'out': [],
    'configs':{
       soundType: { type: 'hidden',defaultValue: 'effect'},
       soundEffect: {type: 'hidden',defaultValue: 'cat'},
       record: {type: 'hidden',defaultValue: ''}
    }    
  },
  run: function() {
      var that = this;
      var conf = config.getConfig();
      var serverIP = conf.serverIP;
      var post_data = {};
      var send = false;
      var inLinks = that.inNodes.trigger;
      if (inLinks.length > 0){     
        var trigger = that.in('trigger');  
        var datatype = (typeof trigger);
        switch (datatype){
          case 'boolean':
            if (trigger === true && that.lastTrigger ===false){
              if (that.conf.soundType === 'effect'){
                post_data = {command: 'playSound',sound: that.conf.soundEffect,loop: true};
              } else if(that.conf.soundType === 'record')  {
                post_data = {command: 'playSound',record: that.conf.record,loop: true};
              } 
              send = true;            
            } else if (trigger === false && that.lastTrigger ===true){
              post_data = {command: 'stopPlaySound'};
              send = true;
            }
            that.lastTrigger = trigger;    
            break;
          case 'number':
            if (trigger > 0){
              trigger = Math.round(trigger);
                if (that.conf.soundType === 'effect'){
                  post_data = {command: 'playSound',sound: that.conf.soundEffect,volume: trigger};
                } else if(that.conf.soundType === 'record')  {
                  post_data = {command: 'playSound',record: that.conf.record,volume: trigger};
                } 
                send = true;              
            }
            break;
          case 'object':
            if (trigger!==null){
              if ((trigger.hasOwnProperty('type')) && (trigger.type==='record')){
                post_data = {command: 'playSound',fileFullPath: trigger.file};
                send = true;
              }
              if (trigger.hasOwnProperty('notes')){
                post_data = {command: 'playNotes',notes: trigger.notes};
                send = true;
              }
            }
            break;
        }     
    } else {
      if (that.lastTrigger === true){
        that.lastTrigger = false;
        send = true;   
        post_data = {command: 'stopPlaySound'};
      }
    }
    if (send){
          var options = {  
            hostname: serverIP,  
            port: 8083,  
            path: '/sound',  
            method: 'POST',  
            headers: {msg: 'playSound'}   
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
config: function(){
    var that = this;
    var conf = config.getConfig();
    var serverIP = conf.serverIP;
    var post_data = {}; 
    var send = false;   
    if (!that.conf.deleteRecord && !that.conf.getRecordList){
        var volume = 30;
        var inLinks = that.inNodes.trigger;
        if (inLinks.length > 0){ 
          var trigger = that.in('trigger');  
          if ((typeof trigger) === 'number'){
            volume = trigger;
          } 
          if (((typeof trigger) === 'boolean') && (trigger === true)){
            post_data.loop = true;
          }                  
        }
        post_data.volume = volume;    
        post_data.command = 'playSound';
        if (that.conf.soundType === 'effect' && that.conf.soundEffect !==null){
            post_data.sound = that.conf.soundEffect;
        } else if(that.conf.soundType === 'record' && that.conf.record !==null)  {
            post_data.record = that.conf.record;
        }      
        send = true;
    }
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
            headers: {msg: 'playSound'}   
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
  init: function() {
    this.lastTrigger = false;
  }
};

module.exports = node;
