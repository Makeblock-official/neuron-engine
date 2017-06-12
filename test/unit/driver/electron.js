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

var ipc = function (){
  var self = this;
  this.on = function(event, callback) {
    switch (event) {
      case 'serial-data':
        callback(blockPkg);
        break;
      default:
        console.warn('event not supported: ', event);
        break;
    }
  };
  this.send = function(event, tempBuf){

  };
};

var electron = function () {
  var self = this;

  this.ipcRenderer = new ipc();
};

module.exports = electron;
