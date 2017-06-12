var driver = require('../lib/driver');
var utils = require('../lib/protocol/utils');

var mock = driver.create('serial');
var COUNT = 10;

var begin = new Date().getTime();

for (var i = 0; i < COUNT; i++) {
  mock.send(new Uint8Array([0xf0, 0xff, 0x10, 0x00, 0x01, 0xf7]).buffer);
}

mock.on("data", function(data){
  console.log(data);
});

setTimeout(function() {
  mock.send(new Uint8Array([0xf0, 0xff, 0x10, 0x00, 0x01, 0xf7]).buffer);
}, 5000);

setInterval(function() {
  mock.send(new Uint8Array([0xf0, 0xff, 0x01, 0x00, 0x01, 0xf7]).buffer);
}, 1);

var end = new Date().getTime();


console.log('==========================================');
console.log(COUNT + ' buffers are sent in ' + (end - begin) + ' ms');

mock.on('data', function(buf) {

  console.log('received buffer: ', utils.hexBuf(buf));
});

process.stdin.resume();