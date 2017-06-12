/**
 * the example for Neuron led_strip block.
 * when press button, we turn on the led_strip, when button release, turn off the led_strip 
 */

 /*
  * led_strip api
  * engine.sendBlockCommand('LEDSTRIP','DISPLAY_PATTERN',[mode,speed,ledNumber,led1_color,led2_color,...],index);
  * @param mode {integer} display mode,0:'static';1:'roll';2:'repeat';3:'marquee',4:'breathing'; 5:'gradient'
  * @param speed {integer} from 0 to 8, which means  slow to fast
  * @param ledNumber {integer} the count of leds you set 
  * @param led_color {integer} 0: black; 1: red; 2: orange; 3: yellow; 4: green; 5: cyan; 6: blue; 7:purple; 8: white
  * @param index {integer} for example,if you connected two led_strip,the first is 1;the second is 2
 */

var LEDOFF = [2,1,1,0];
var LEDON = [0,1,3,1,3,5]; 

var engine = require('../../lib/engine/logic').create({"driver": "websocket", "serverIP": "192.168.100.1","loglevel": "WARN"});
engine.on("blockStatusChanges", blockStatusChanges);
engine.on("blockListChanges", blockListChanges);

function blockStatusChanges(type, idx, value) {
  console.log('blockStatusChanges: ' + type + ' ' + idx + ' ' + JSON.stringify(value));
  if (type === 'BUTTON'){
    if ('press' in value){
      var ledState = value.press[0]>0?LEDON:LEDOFF;
      engine.sendBlockCommand('LEDSTRIP','DISPLAY_PATTERN',ledState,1);
    }
  }
}

function blockListChanges(list){
  console.log(JSON.stringify(list));
}
