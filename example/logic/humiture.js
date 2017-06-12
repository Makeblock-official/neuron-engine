/**
 * the example for Neuron humiture block.
 */

  /*
  * how to get humiture value
  * use event listener
  * engine.on("blockStatusChanges", callBack);

  * use api: getBlockSubStatus
  * engine.getBlockSubStatus('HUMITURE', 'temperature_humidity', index)
  * @param index {integer} for example,if you connected two humiture sensors,the first is 1;the second is 2
  * @return {array}           [the substatus]
 */

var engine = require('../../lib/engine/logic').create({"driver": "websocket", "serverIP": "192.168.3.119","loglevel": "WARN"});
engine.on("blockStatusChanges", blockStatusChanges);
engine.on("blockListChanges", blockListChanges);

function blockStatusChanges(type, idx, value) {
  if (type === 'HUMITURE'){
    if ('temperature_humidity' in value){
      var temperature = value.temperature_humidity[0];
      var humidity = value.temperature_humidity[1];
      console.log('humiture StatusChanges: ' + 'temperature: ' + temperature +  ' humidity: ' + humidity);
      var state  = engine.getBlockSubStatus('HUMITURE', 'temperature_humidity', 1);
      temperature = state[0];
      humidity = state[1];
      console.log('get humiture: ' + 'temperature: ' + temperature +  ' humidity: ' + humidity);
    }
  }
}

function blockListChanges(list){
  console.log(JSON.stringify(list));
}
