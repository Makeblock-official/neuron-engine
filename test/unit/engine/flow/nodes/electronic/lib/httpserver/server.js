var http = require("http");
var url=require("url");

var server;

function start(route,handle) {
  function onRequest(request, response) {
    var postData="";
    var pathname=url.parse(request.url).pathname;
	  
    request.setEncoding("utf8");
	  
    request.addListener("data", function(postDataChunk) {
      postData += postDataChunk;
    });

    request.addListener("end", function() {
      route(handle, pathname, response, postData);
    });
  }

  server = http.createServer(onRequest).listen(8083,'127.0.0.1');
}

function stop(){
  server.close();
}

exports.start = start;
exports.stop = stop;
