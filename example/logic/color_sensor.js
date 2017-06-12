/**
 * the example for Neuron color_sensor block.
 */

  /*
  * how to get color_sensor value
  * use event listener
  * engine.on("blockStatusChanges", callBack);

  * use api: getBlockSubStatus
  * engine.getBlockSubStatus('COLORSENSOR', 'color', index)
  * @param index {integer} for example,if you connected two color_sensor,the first is 1;the second is 2
  * @return {array}           [the substatus]
 */

var engine = require('../../lib/engine/logic').create({"driver": "websocket", "serverIP": "192.168.3.119","loglevel": "WARN"});
engine.on("blockStatusChanges", blockStatusChanges);
engine.on("blockListChanges", blockListChanges);

function blockStatusChanges(type, idx, value) {
  if (type === 'COLORSENSOR'){
    if ('color' in value){
      var R = value.color[0];
      var G = value.color[1];
      var B = value.color[2];
      console.log('color_sensor StatusChanges: ' + 'R: ' + R + ' G: ' + G + ' B: ' + B);
      var color  = engine.getBlockSubStatus('COLORSENSOR', 'color', 1);
      R = color[0];
      G = color[1];
      B = color[2];
      console.log('get color_sensor color: ' + 'R: ' + R + ' G: ' + G + ' B: ' + B);
    }
  }
}

function blockListChanges(list){
  console.log(JSON.stringify(list));
}
