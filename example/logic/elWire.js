/**
 * the example for Neuron eiWires block.
 * our elWires have 4 ports,we use funny touch(4 keys) to control it  
 */

 /*
  * eiWires api
  * engine.sendBlockCommand('ELWIRES','DISPLAY',[display],index);
  * @param [display] {integer} bit0~bit3 map port1~port4;1: light on; 0: light off
  * @param index {integer} for example,if you connected two eiWires,the first is 1;the second is 2
 */

var engine = require('../../lib/engine/logic').create({"driver": "websocket", "serverIP": "192.168.100.1","loglevel": "WARN"});
engine.on("blockStatusChanges", blockStatusChanges);
engine.on("blockListChanges", blockListChanges);

function blockStatusChanges(type, idx, value) {
  console.log('blockStatusChanges: ' + type + ' ' + idx + ' ' + JSON.stringify(value));
  if (type === 'FUNNYTOUCH'){
    if ('state' in value){
      var key = value.state[0];
      var display = 0;
      var key1 = key & 0x01;
      display = key1>0?1:0;
      var key2 = (key >> 1) & 0x01;
      display = key2>0?(display | 2):display;
      var key3 = (key >> 2)  & 0x01;
      display = key3>0?(display | 4):display;
      var key4 = (key >> 3) & 0x01;
      display = key4>0?(display | 8):display;
      engine.sendBlockCommand('ELWIRES','DISPLAY',[display],1);
    }
  }
}

function blockListChanges(list){
  console.log(JSON.stringify(list));
}