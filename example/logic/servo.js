/**
 * the example for Neuron servo block.
 * our servo driver can driver two servos, we use button to set servo angle
 */

   /*
  * servo api
  * engine.sendBlockCommand('SERVO','SET_SERVO1_ANGLE',[angle],index);
  * engine.sendBlockCommand('SERVO','SET_SERVO2_ANGLE',[angle],index);
  * @param [angle] {array} angle of servo,from 0 to 180
  * @param index {integer} for example,if you connected two servo driver,the first is 1;the second is 2
 */

 var RELEASE_ANGLE1 = 0;
 var PRESS_ANGLE1 = 180;
 var RELEASE_ANGLE2 = 0;
 var PRESS_ANGLE2 = 90;

 var engine = require('../../lib/engine/logic').create({"driver": "websocket", "serverIP": "192.168.100.1","loglevel": "WARN"});

 engine.on("blockStatusChanges", blockStatusChanges);

function blockStatusChanges(type, idx, value) {
  console.log('blockStatusChanges: ' + type + ' ' + idx + ' ' + JSON.stringify(value));
  if (type === 'BUTTON'){
    if ('press' in value){
      var angle1 = value.press[0]>0?PRESS_ANGLE1:RELEASE_ANGLE1;
      var angle2 = value.press[0]>0?PRESS_ANGLE2:RELEASE_ANGLE2;
      engine.sendBlockCommand('SERVO','SET_SERVO1_ANGLE',[angle1],1);
      engine.sendBlockCommand('SERVO','SET_SERVO2_ANGLE',[angle2],1);
    }
  }
}