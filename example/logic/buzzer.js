/**
 * the example for Neuron buzzer block.
 */

 /*
  * buzzer api
  * engine.sendBlockCommand('BUZZER','DISPLAY',[frequency, volume],index);   
  * @param frequency {integer} 
  * @param volume {integer} from 0 to 100; when set 0 ,turn off
  * @param index {integer} for example,if you connected two buzzers,the first is 1;the second is 2
 */

var VOLUME = 50;
var ToneHzTable = {
    "c2":65, "d2":73, "e2":82, "f2":87, "g2":98, "a2":110, "b2":123, "c3":131, "d3":147, "e3":165, "f3":175, "f3m":185, "g3":196, "g3m":208,"a3":220,"a3m":233, "b3":247, "c4":262, "c4m":277,"d4":294, "d4m":311,"e4":330, "f4":349,"f4m":369, "g4":392, "g4m":415,"a4":440, "a4m":466,"b4":494, "c5":523, "c5m": 554,"d5":587, "d5m":622,"e5":658, "f5":698, "g5":784, "a5":880, "b5":988, "c6":1047, "d6":1175, "e6":1319, "f6":1397, "g6":1568, "a6":1760, "b6":1976, "c7":2093, "d7":2349, "e7":2637, "f7":2794, "g7":3136, "a7":3520, "b7":3951, "c8":4186
};
var ON = [ToneHzTable.c3,VOLUME];
var OFF = [ToneHzTable.c3,0];

var engine = require('../../lib/engine/logic').create({"driver": "websocket", "serverIP": "192.168.100.1","loglevel": "WARN"});
engine.on("blockStatusChanges", blockStatusChanges);
engine.on("blockListChanges", blockListChanges);

function blockStatusChanges(type, idx, value) {
  console.log('blockStatusChanges: ' + type + ' ' + idx + ' ' + JSON.stringify(value));
  if (type === 'BUTTON'){
    if ('press' in value){
      var buzzerState = value.press[0]>0?ON:OFF;
      engine.sendBlockCommand('BUZZER','DISPLAY',buzzerState,1);
    }
  }
}

function blockListChanges(list){
  console.log(JSON.stringify(list));
}