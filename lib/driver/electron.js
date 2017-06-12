/**
 * driver for makeblockHD APP(cordova ble bridge)
 */

var Driver = require('./driver');
var checksum = require('./checksum');

var driver = new Driver();

function Electron() {

  this._init = function() {
    if(electron){
      electron.ipcRenderer.on('serial-data', function(event, arg) {
        checksum.checksumRcvbuf(arg,driver);
      });
    }
  };

  /**
   * [_send sends array buffer to driver]
   * @param  {[ArrayBuffer]} buf [the buffer to send]
   * @return {[integer]}     [the actual byte length sent. -1 if send fails.]
   */
  this._send = function(buf) {
    var tempBuf = new Buffer(buf.byteLength + 3);
    tempBuf = checksum.checksumSendbuf(buf);

    if(electron){
      electron.ipcRenderer.send('serial-send', tempBuf);
    }
    return tempBuf.length;
  };

  /**
   * [_close close driver]
   */
  this._close = function(buf) {
    if(electron){
      electron.ipcRenderer.send('serial-close');
    }
  };

}

Electron.prototype = driver;

module.exports = Electron;
