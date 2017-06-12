/**
 * the example for Neuron soil_moisturel block.
 */

  /*
  * how to get soil_moisturel value
  * use event listener
  * engine.on("blockStatusChanges", callBack);

  * use api: getBlockSubStatus
  * engine.getBlockSubStatus('SOIL_HUMIDITY', 'humidity', index)
  * @param index {integer} for example,if you connected two soil_moisturel sensors,the first is 1;the second is 2
  * @return {array}           [the substatus]
 */

var engine = require('../../lib/engine/logic').create({"driver": "websocket", "serverIP": "192.168.3.119","loglevel": "WARN"});
engine.on("blockStatusChanges", blockStatusChanges);
engine.on("blockListChanges", blockListChanges);

function blockStatusChanges(type, idx, value) {
  if (type === 'SOIL_HUMIDITY'){
    if ('humidity' in value){
      var humidity = value.humidity[0];
      console.log('soil_moisturel StatusChanges: ' + humidity);
      var state  = engine.getBlockSubStatus('SOIL_HUMIDITY', 'humidity', 1);
      humidity = state[0];
      console.log('get soil_moisturel: ' + humidity);
    }
  }
}

function blockListChanges(list){
  console.log(JSON.stringify(list));
}
