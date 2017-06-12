/**
 * the example for Neuron temperature block.
 */

  /*
  * how to get temperature value
  * use event listener
  * engine.on("blockStatusChanges", callBack);

  * use api: getBlockSubStatus
  * engine.getBlockSubStatus('TEMPERATURE', 'temperature', index)
  * @param index {integer} for example,if you connected two temperature sensors,the first is 1;the second is 2
  * @return {array}           [the substatus]
 */

var engine = require('../../lib/engine/logic').create({"driver": "websocket", "serverIP": "192.168.3.119","loglevel": "WARN"});
engine.on("blockStatusChanges", blockStatusChanges);
engine.on("blockListChanges", blockListChanges);

function blockStatusChanges(type, idx, value) {
  if (type === 'TEMPERATURE'){
    if ('temperature' in value){
      var temperature = value.temperature[0];
      console.log('temperature StatusChanges: ' + temperature);
      var state  = engine.getBlockSubStatus('TEMPERATURE', 'temperature', 1);
      temperature = state[0];
      console.log('get temperature: ' + temperature);
    }
  }
}

function blockListChanges(list){
  console.log(JSON.stringify(list));
}
