var http = require('http');
var config = require('../../../../config/config');
var logger = require('../../../../log/log4js').logger;

var node = {
  name: 'USB_AUDIO',
  methods: {reportState: null},
  conf: {record: null},
  props: {
    'category': 'electronic',
    'in': [],
    'out': ['record'],
    'configs':{record: {type: 'hidden'}}
  },
  run: function() {
    var that = this;
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
    if (that.conf.record === 'record') {
      post_data = {command: 'record'};  
       that.conf.record = 0;
    }
    if (post_data){
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
                   if (result.errCode !== 0){
                    logger.warn("errCode: " + result.errCode + " errMsg: " + result.errMsg);
                   } else {
                    var state = result.state;
                      if (state === 'recording'){
                         // to to 
                         logger.warn('recording');
                      } else if (state === 'record stop'){
                        that.out('record',result.file);
                      }
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
  },

  getBlockVersion: function() {
    var that = this;
    electronicblock.getBlockVersion(that.name, that.idx);
  },
  updateNeuronBlock: function() {
    var that = this;
    electronicblock.updateBlockFirmware(that.name, that.idx);
  }
};

module.exports = node;
