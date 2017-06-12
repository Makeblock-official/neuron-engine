var server = require("./server");
var router=require("./router");
var requestHandlers=require("./requestHandlers");

var handle = {};
handle["/openCamera"] = requestHandlers.openCamera;
handle["/closeCamera"] = requestHandlers.closeCamera;
handle["/setAudio"] = requestHandlers.setAudio;

function start(){
  server.start(router.route,handle);
}

function stop(){
  server.stop();
}

exports.start = start;
exports.stop = stop;
