var logger = require('../../../../log/log4js').logger;
var config = require('../../../../config/config');
var http = require('http');
var node = {
  name: 'PLAYNOTES',
  conf: {tune: null, length: null,lastInput: null},
  props: {
    'category': 'sound',
    'in': ['input'],
    'out': ['notes'],
    'configs':{
       tune: { type: 'hidden',defaultValue: 'c4'},
       length: {type: 'hidden',defaultValue: '4'}
    }    
  },
  run: function() {
      var that = this;
      var send = false;
      var note = that.conf.tune+that.conf.length;
      var notesList = [];
      var inLinks = that.inNodes.input;
      if (inLinks.length > 0){        
        var input = that.in('input');
        if (input !== null){
            if ((typeof input) === 'object'){
              if (input.hasOwnProperty('notes')){
                notesList = input.notes;
                send = true;
              }
            } else {
              if (input > 0 && that.conf.lastInput <= 0){
                send = true;
              }
              that.conf.lastInput = input;
            }
        }
        if (send){
         notesList.push(note);
         var outLinks = that.outNodes.notes;
         if (outLinks.length === 0){
            var conf = config.getConfig();
            var serverIP = conf.serverIP;
            var post_data = {command: 'playNotes',notes: notesList};
            var options = {  
              hostname: serverIP,  
              port: 8083,  
              path: '/sound',  
              method: 'POST',  
              headers: {msg: 'playNotes'}   
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
         }  else {
            that.out('notes',{notes: notesList});
         }
      }
    }     
  },

  config: function(){
    var that = this;
    //if (play){
      var note = that.conf.tune+that.conf.length;
      var notesList = [];
      notesList.push(note);
      var conf = config.getConfig();
      var serverIP = conf.serverIP;
      var post_data = {command: 'playNotes',notes: notesList};
      var options = {  
         hostname: serverIP,  
         port: 8083,  
         path: '/sound',  
         method: 'POST',  
         headers: {msg: 'playNotes'}   
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
   // }
  },
  init: function() {
 
  }
};

module.exports = node;
