var WebSocketServer = require('ws').Server;
var protocol = require('../../../lib/protocol');
var checksum = require('../../../lib/driver/checksum');
var blockPkg = protocol.serialize({no: 0x01,
                                   type: 0x10,
                                   data: [{'BYTE': 0x64,'BYTE': 0x01}]
                                 });  

/**
 * [buffer2string converts array buffer to string format]
 * @param  {ArrayBuffer} buf [the input array buffer]
 * @return {String}     [the output string]
 */
function buffer2string(buf) {
  var buffer = new Uint8Array(buf);
  return Array.prototype.join.call(buffer, " ");
}

var WebsocketServer = function () {
  var self = this;

  var wss = new WebSocketServer({ port: 8082});

  wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
      // send to client, I'm online
      var postMessage = {type: 'ping'};
      postMessage = JSON.stringify(postMessage);
      try { ws.send(postMessage); }
      catch (err) { console.warn(err);} 

      var tempBuf = checksum.checksumSendbuf(blockPkg);
      tempBuf = buffer2string(tempBuf);
      var post = {type: 'block',data:tempBuf};
      post = JSON.stringify(post);
      try { ws.send(post); }
      catch (err) { console.warn(err);}
  
    });

    ws.on('close', function close() {
      console.warn('socket close');
    });  
 
  });

  return wss;

}

exports.WebsocketServer = WebsocketServer;
