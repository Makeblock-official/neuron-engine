/**
 * the example for Neuron line_follower block.
 */

  /*
  * how to get line_follower value
  * use event listener
  * engine.on("blockStatusChanges", callBack);

  * use api: getBlockSubStatus
  * engine.getBlockSubStatus('LINEFOLLOWER', 'state', index)
  * @param index {integer} for example,if you connected two line_follower,the first is 1;the second is 2
  * @return {array}           [the substatus]
 */

var engine = require('../../lib/engine/logic').create({"driver": "websocket", "serverIP": "192.168.3.119","loglevel": "WARN"});
engine.on("blockStatusChanges", blockStatusChanges);
engine.on("blockListChanges", blockListChanges);

function blockStatusChanges(type, idx, value) {
  if (type === 'LINEFOLLOWER'){
    if ('state' in value){
      var state = value.state[0];
      var left = state & 0x01;
      var right = (state >> 1) & 0x01;
      console.log('line_follower StatusChanges: ' + left + ' ' + right);
      
      var values  = engine.getBlockSubStatus('LINEFOLLOWER', 'state', 1);
      state = values[0];
      left = state & 0x01;
      right = (state >> 1) & 0x01; 
      console.log('get line_follower state: ' + left + ' ' + right);
    }
  }
}

function blockListChanges(list){
  console.log(JSON.stringify(list));
}
