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

var ble = function () {
  var self = this;

  self.connectedDeviceID = null;
  self.dataCB = null;

  this.startNotification = function(connectedDeviceID, commServiceID, readCharacteristicID, callback,errCB){
    if (connectedDeviceID) {
      errCB('data not ready');
      callback(blockPkg);
    } else {
      console.log('ble not connected');
    }
  };

  this.writeWithoutResponse = function(connectedDeviceID, commServiceID,writeCharacteristicID, tempBuf,checkConnectCB,errCB){
    checkConnectCB();
    if (connectedDeviceID != 'ffff'){
      errCB('connect lost');
    }
  };

  this.stopNotification = function(connectedDeviceID, commServiceID, readCharacteristicID){

  };
}

module.exports = ble;
