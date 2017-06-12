/**
 * the example for Neuron light_sensor block.
 */

  /*
  * how to get light_sensor value
  * use event listener
  * engine.on("blockStatusChanges", callBack);

  * use api: getBlockSubStatus
  * engine.getBlockSubStatus('LIGHTSENSOR', 'light', index)
  * @param index {integer} for example,if you connected two button,the first is 1;the second is 2
  * @return {array}           [the substatus]
 */

var engine = require('../../lib/engine/logic').create({"driver": "websocket", "serverIP": "192.168.3.119","loglevel": "WARN"});
engine.on("blockStatusChanges", blockStatusChanges);
engine.on("blockListChanges", blockListChanges);

function blockStatusChanges(type, idx, value) {
  if (type === 'LIGHTSENSOR'){
    if ('light' in value){
      var light = value.light[0];
      console.log('light_sensor StatusChanges: ' + light);
      var state  = engine.getBlockSubStatus('LIGHTSENSOR', 'light', 1);
      light = state[0];
      console.log('get light_sensor light: ' + light);
    }
  }
}

function blockListChanges(list){
  console.log(JSON.stringify(list));
}
