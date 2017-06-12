var child_process = require('child_process');

var mjpg_streamer = null;

function openCamera(response,postData) {
  console.warn('postData: ' + postData);
  response.writeHead(200, {"Content-Type": "text/plain"});
  var feedBack = JSON.stringify({errCode: 0,errMsg: 'ok',state: 'opened'});  
  response.write(feedBack);
  response.end(); 
}

function closeCamera(response,postData) {
  var feedBack;
  response.writeHead(200, {"Content-Type": "text/plain"});
  feedBack = JSON.stringify({errCode: 0,errMsg: 'ok',state: 'closed'});
  response.write(feedBack);
  response.end();
}

function setAudio(response,postData) {
  postData = JSON.parse(postData);
  var feedBack;
  response.writeHead(200, {"Content-Type": "text/plain"});
  var command = postData.command; 
  switch (command){
    case 'play':
      feedBack = JSON.stringify({errCode: 0,errMsg: 'ok',state: 'playing'});   
      break;
    case 'stop':
      feedBack = JSON.stringify({errCode: 0,errMsg: 'ok',state: 'stop'}); 
      break;  
  }
  response.write(feedBack);
  response.end();
}

exports.openCamera = openCamera;
exports.closeCamera = closeCamera;
exports.setAudio = setAudio;
