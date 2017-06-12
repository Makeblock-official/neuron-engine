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

var window = function (){
  var self = this;
  this.receiveBluetoothData = null;
};

var TellNative = function (){
  var self = this;
  this.sendViaBluetooth = function(tempBuf){

 };
};

var mkeblockHD = function () {
  var self = this;

  self.window = new window();
  self.tellNative = new TellNative();

  function _doInterval(){
    if (self.window.receiveBluetoothData){
      self.window.receiveBluetoothData(buffer2string(blockPkg)); 
    } 
  }

  setInterval(_doInterval, 5);
};

module.exports = mkeblockHD;
