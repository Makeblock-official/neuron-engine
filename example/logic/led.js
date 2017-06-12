/**
 * the example for Neuron led block.
 * when press button, we turn on the led, when button release, turn off the led 
 */

 /*
  * led api
  * engine.sendBlockCommand('LED','SET_COLOUR',[R,G,B],index);
  * @param [R,G,B] {array} value of R,G,B,from 0 to 255
  * @param index {integer} for example,if you connected two led,the first is 1;the second is 2
 */

var LEDOFF = [0,0,0];
var LEDON = [100,100,100]; //R,G,B

 var engine = require('../../lib/engine/logic').create({"driver": "serial", "loglevel": "WARN"});

function blockStatusChanges(type, idx, value) {
  console.log('blockStatusChanges: ' + type + ' ' + idx + ' ' + JSON.stringify(value));
  if (type === 'BUTTON'){
    if ('press' in value){
      var ledState = value.press[0]>0?LEDON:LEDOFF;
      engine.sendBlockCommand('LED','SET_COLOUR',ledState,1);
    }
  }
}

 engine.on("blockStatusChanges", blockStatusChanges);