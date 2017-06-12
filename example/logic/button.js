/**
 * the example for Neuron button block.
 */

  /*
  * how to get button value
  * use event listener
  * engine.on("blockStatusChanges", callBack);

  * use api: getBlockSubStatus
  * engine.getBlockSubStatus('BUTTON', 'press', index)
  * @param index {integer} for example,if you connected two button,the first is 1;the second is 2
  * @return {array}           [the substatus]
 */

var engine = require('../../lib/engine/logic').create({"driver": "websocket", "serverIP": "192.168.3.119","loglevel": "WARN"});
engine.on("blockStatusChanges", blockStatusChanges);
engine.on("blockListChanges", blockListChanges);

function blockStatusChanges(type, idx, value) {
  if (type === 'BUTTON'){
    if ('press' in value){
      var state = value.press[0];
      console.log('button StatusChanges: ' + state);
      var press  = engine.getBlockSubStatus('BUTTON', 'press', 1);
      state = press[0];
      console.log('get button state: ' + state);
    }
  }
}

function blockListChanges(list){
  console.log(JSON.stringify(list));
}
