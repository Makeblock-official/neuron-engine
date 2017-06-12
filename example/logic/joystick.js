/**
 * the example for Neuron joystick block.
 */

  /*
  * how to get joystick value
  * use event listener
  * engine.on("blockStatusChanges", callBack);

  * use api: getBlockSubStatus
  * engine.getBlockSubStatus('JOYSTICK', 'state', index)
  * @param index {integer} for example,if you connected two led,the first is 1;the second is 2
  * @return {array}           [the substatus]
 */

var engine = require('../../lib/engine/logic').create({"driver": "websocket", "serverIP": "192.168.3.119","loglevel": "WARN"});
engine.on("blockStatusChanges", blockStatusChanges);
engine.on("blockListChanges", blockListChanges);

function blockStatusChanges(type, idx, value) {
  if (type === 'JOYSTICK'){
    if ('state' in value){
      var x  = value.state[0];
      var y = value.state[1];
      console.log('JOYSTICK StatusChanges '+ 'X: ' + x + ' Y: ' + y);
      var state = engine.getBlockSubStatus('JOYSTICK', 'state', 1);
      x = state[0];
      y = state[1];
      console.log('get JOYSTICK Status    '+ 'X: ' + x + ' Y: ' + y);
    }
  }
}

function blockListChanges(list){
  console.log(JSON.stringify(list));
}
