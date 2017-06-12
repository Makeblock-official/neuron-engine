/**
 * the example for Neuron knob block.
 */

  /*
  * how to get knob value
  * use event listener
  * engine.on("blockStatusChanges", callBack);

  * use api: getBlockSubStatus
  * engine.getBlockSubStatus('KNOB', 'potentio', index)
  * @param index {integer} for example,if you connected two button,the first is 1;the second is 2
  * @return {array}           [the substatus]
 */

var engine = require('../../lib/engine/logic').create({"driver": "websocket", "serverIP": "192.168.3.119","loglevel": "WARN"});
engine.on("blockStatusChanges", blockStatusChanges);
engine.on("blockListChanges", blockListChanges);

function blockStatusChanges(type, idx, value) {
  if (type === 'KNOB'){
    if ('potentio' in value){
      var potentio = value.potentio[0];
      console.log('knob StatusChanges: ' + potentio);
      var state  = engine.getBlockSubStatus('KNOB', 'potentio', 1);
      potentio = state[0];
      console.log('get knob potentio: ' + potentio);
    }
  }
}

function blockListChanges(list){
  console.log(JSON.stringify(list));
}
