/**
 * the example for Neuron funny_touch block.
 */

  /*
  * how to get funny_touch value
  * use event listener
  * engine.on("blockStatusChanges", callBack);

  * use api: getBlockSubStatus
  * engine.getBlockSubStatus('FUNNYTOUCH', 'state', index)
  * @param index {integer} for example,if you connected two funny_touch,the first is 1;the second is 2
  * @return {array}           [the substatus]
 */

var engine = require('../../lib/engine/logic').create({"driver": "websocket", "serverIP": "192.168.3.119","loglevel": "WARN"});
engine.on("blockStatusChanges", blockStatusChanges);
engine.on("blockListChanges", blockListChanges);

function blockStatusChanges(type, idx, value) {
  if (type === 'FUNNYTOUCH'){
    if ('state' in value){
      var key = value.state[0];
      var key1 = key & 0x01;
      var key2 = (key >> 1) & 0x01;
      var key3 = (key >> 2)  & 0x01;
      var key4 = (key >> 3) & 0x01;
      console.log('funny_touch StatusChanges: ' + key1 + ' ' + key2 + ' ' + key3 + ' ' + key4);
      
      var state  = engine.getBlockSubStatus('FUNNYTOUCH', 'state', 1);
      key = state[0];
      key1 = key & 0x01;
      key2 = (key >> 1) & 0x01;
      key3 = (key >> 2)  & 0x01;
      key4 = (key >> 3) & 0x01;     
      console.log('get funny_touch state: ' + key1 + ' ' + key2 + ' ' + key3 + ' ' + key4);
    }
  }
}

function blockListChanges(list){
  console.log(JSON.stringify(list));
}
