var logger = require('../../../../log/log4js').logger;
var config = require('../../../../config/config');
var event = require('../../../../event/event');
var algorithm = require('../algorithm');
var http = require('http');
var node = {
  name: 'EMOTION_TEST',
  conf: {emotion: null,recognition: []},
  props: {
    'category': 'SNAPSHOT',
    'assistanceNode': true,
    'in': ['snapshot'],
    'out': ['result'],
    'configs':{
       emotion: {type: 'options', options: ['happiness','anger','sadness','fear','surprise'],defaultValue: 'happiness'}
    }  
  },
  run: function() {
      var that = this;
      var snapshot = that.in('snapshot');

      function processRecognition(result){
        var found = false;
        if  (result.hasOwnProperty('recognition')){
          that.conf.recognition = result.recognition;
          for (var i = 0; i < result.recognition.length; i ++){
            if (that.conf.emotion === result.recognition[i]){
              found = true;
              break;
            }
          }
        }
        if (found){
          that.out('result', true);
        } else {
          that.out('result', false);
        }   
      }

      function emotionRecognition(file, recognition){
        if (file === snapshot.file){
            clearTimeout(that.timeout);
            that.timeout = null;   
            processRecognition(recognition); 
            event.removeListener('emotionRecognition', emotionRecognition);
        }
      }  
           
      if (!that.timeout){
        var inLinks = that.inNodes.snapshot;
        if (inLinks.length > 0){
          if ((typeof snapshot === 'object') && (snapshot !== null)){
            if ((snapshot.hasOwnProperty('type')) && (snapshot.type==='snapshot')){
              that.timeout = setTimeout(function() {
                 that.timeout = null; 
                 if (that.listen){
                   event.removeListener('emotionRecognition', emotionRecognition);
                   that.listen = false;
                 }
               }, 10000); 
               var testIng = algorithm.checkEmotionTest(snapshot.file);
               if (testIng){              
                 event.on("emotionRecognition", emotionRecognition);
                 that.listen = true;
               } else {
                   algorithm.pushEmotionTesting(snapshot.file);
                   var conf = config.getConfig();
                   var serverIP = conf.serverIP;         
                   var post_data = {command: 'emotionRecognize',fileName: snapshot.file};
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
                            algorithm.deleteEmotionTesting(snapshot.file);               
                            var result;
                            try {
                              result = JSON.parse(chunks);   
                              processRecognition(result);  
                              event.emit('emotionRecognition',snapshot.file,result);               
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
        }
      }             
  },
  config: function(){
    var that = this;
    var found = false;
    for (var i = 0; i < that.conf.recognition.length; i ++){
       if (that.conf.emotion === that.conf.recognition[i]){
             found = true;
             break;
        }
    }
    if (found){
       that.out('result', true);
     } else {
       that.out('result', false);
     }
  }, 
  initNode: function(){
    this.out('result', false);
  }, 
  init: function() {
    this.timeout = null;
    this.listen = false;
  }
};

module.exports = node;
