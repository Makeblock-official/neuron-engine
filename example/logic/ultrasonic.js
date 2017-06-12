/**
 * the example for Neuron ultrasonic block.
 */

  /*
  * how to get ultrasonic value
  * use event listener
  * engine.on("blockStatusChanges", callBack);

  * use api: getBlockSubStatus
  * engine.getBlockSubStatus('ULTRASONIC', 'distance', index)
  * @param index {integer} for example,if you connected two ultrasonic,the first is 1;the second is 2
  * @return {array}           [the substatus]
 */

var engine = require('../../lib/engine/logic').create({"driver": "websocket", "serverIP": "192.168.3.119","loglevel": "WARN"});
engine.on("blockStatusChanges", blockStatusChanges);
engine.on("blockListChanges", blockListChanges);

function blockStatusChanges(type, idx, value) {
  if (type === 'ULTRASONIC'){
    if ('distance' in value){
      var distance = value.distance[0];
      console.log('ultrasonic StatusChanges: ' + distance);
      var state  = engine.getBlockSubStatus('ULTRASONIC', 'distance', 1);
      distance = state[0];
      console.log('get ultrasonic distance: ' + distance);
    }
  }
}

function blockListChanges(list){
  console.log(JSON.stringify(list));
}
