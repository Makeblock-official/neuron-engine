/**
 * the example for Neuron sound_sensor block.
 */

  /*
  * how to get sound_sensor value
  * use event listener
  * engine.on("blockStatusChanges", callBack);

  * use api: getBlockSubStatus
  * engine.getBlockSubStatus('SOUNDSENSOR', 'volume', index)
  * @param index {integer} for example,if you connected two sound sensors,the first is 1;the second is 2
  * @return {array}           [the substatus]
 */

var engine = require('../../lib/engine/logic').create({"driver": "websocket", "serverIP": "192.168.3.119","loglevel": "WARN"});
engine.on("blockStatusChanges", blockStatusChanges);
engine.on("blockListChanges", blockListChanges);

function blockStatusChanges(type, idx, value) {
  if (type === 'SOUNDSENSOR'){
    if ('volume' in value){
      var volume = value.volume[0];
      console.log('sound_sensor StatusChanges: ' + volume);
      var state  = engine.getBlockSubStatus('SOUNDSENSOR', 'volume', 1);
      volume = state[0];
      console.log('get sound_sensor: ' + volume);
    }
  }
}

function blockListChanges(list){
  console.log(JSON.stringify(list));
}
