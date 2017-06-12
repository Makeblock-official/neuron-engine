/**
 * the example for Neuron pir block.
 */

  /*
  * how to get pir value
  * use event listener
  * engine.on("blockStatusChanges", callBack);

  * use api: getBlockSubStatus
  * engine.getBlockSubStatus('PIR', 'state', index)
  * @param index {integer} for example,if you connected two pir,the first is 1;the second is 2
  * @return {array}           [the substatus]
 */

var engine = require('../../lib/engine/logic').create({"driver": "websocket", "serverIP": "192.168.3.119","loglevel": "WARN"});
engine.on("blockStatusChanges", blockStatusChanges);
engine.on("blockListChanges", blockListChanges);

function blockStatusChanges(type, idx, value) {
  if (type === 'PIR'){
    if ('state' in value){
      var pir = value.state[0];
      console.log('pir StatusChanges: ' + pir);
      var state  = engine.getBlockSubStatus('PIR', 'state', 1);
      pir = state[0];
      console.log('get pir: ' + pir);
    }
  }
}

function blockListChanges(list){
  console.log(JSON.stringify(list));
}
