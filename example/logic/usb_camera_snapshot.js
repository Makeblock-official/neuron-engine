/**
 * the example for Neuron USB camera block.
 * takes a snapshot from the usb camera and serving the image on a website
 * (You can also see the image directly by enter this url 
 * http://192.168.100.1:8329/snap?filename=test.jpg in a web browser)
 * 
 * NOTE: For this example you need a Wifi block and a usb camera block
 */

var http = require('http');
var fs = require('fs');

http.createServer(function(req, res) {
  take_snapshot((data)=>{
    res.writeHead(200,{'content-type':'image/jpg'});
    res.end(data);
  });
}).listen(3000);
console.log('Server running at 3000');
console.log('Open http://localhost:3000 in your web browser to see snapshot.');
console.log('Refresh your web browser to take a new snapshot.');
console.log('--------------------------------------------------------');

function take_snapshot(callback) {
    var file = 'image.jpg';
    var serverIP = "192.168.100.1";
    var self = this;
    var resData = "";

    console.log("Trying to take a snapshot");

    if (true){
       var options = {  
          hostname: serverIP,  
          port: 8329,  
          path: '/snap?filename=' + file,  
          method: 'GET',  
          headers: {msg: 'snapshot'}
        };        
       http.get(options, function(res) {
          res.setEncoding('binary');
          let chunks = [];
          res.on("data",function(chunk){
              chunks.push(Buffer.from(chunk, 'binary'));
          });
          res.on("end", function() {  
              let buffer = Buffer.concat(chunks);
              console.log("New snapshot taken");

              if(callback) callback(buffer);
          });
        });       
    }
}

