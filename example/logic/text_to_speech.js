/**
 * the example for Neuron Mic & Speaker Block.
 * 
 * NOTE: For this example you need a Wifi block and a Mic & Speaker Block
 */

var http = require('http');

function textToSpeech(text, id, callback){
  var serverIP = "192.168.100.1";
  var post_data;
  var send  = false;
  var file = id + '.wav';
  if (text === null || text === ''){
    logger.warn('text was null');
  } else {
    post_data = {command: 'playSound',speech: file,text: text,fileName: id};
    send = true;
  }
  if(send){
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
                    console.log("(A sound file was created on the device, file name/id:"+result.fileName+")");
                    if(callback) callback();
                  } 
              } catch (e) {
                logger.warn(e); 
              }       
          }); 
        });  
    req.write(JSON.stringify(post_data));  
    req.end();  
  }
}

/* Sending speech "Hello world" */

console.log("Starting to speech 'Hello world' ...");
textToSpeech("Hello world", 1, ()=>{
  textToSpeech("Seams to work good.", 1, ()=>{
    textToSpeech("Nice weather to day.", 1, ()=>{
      textToSpeech("Hope this has been a good example for you.", 1);
    });
  });
});
console.log("Done.");





        