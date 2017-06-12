var SerialPort = require("serialport").SerialPort;
var serialPort = new SerialPort("/dev/ttyUSB0", {
  baudrate: 115200
});

function writeCB(err, results) {
  console.log('err ' + err);
  console.log('write ' + results);
}

serialPort.on("open", function() {
  serialPort.on('data', function(data) {
    console.log('data received: ' + data);
  });


  console.log('open');

  setInterval(function() {
    serialPort.write(new Buffer([0xf0, 0xff, 0x10, 0x00, 0x01, 0xf7]), writeCB);
  }, 1);
});
