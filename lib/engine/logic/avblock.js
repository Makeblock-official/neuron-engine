var event = require('../../event/event');
var events = require('./events');

/**
 * [processConnectState]
 * @param  {string} device  
 * @param  {string} state 
 */
function processConnectState(device,state){
  event.emit(events.AVBLOCKCHANGE,{device: device, state: state});
}

function resetAVState(){
  event.emit(events.RESETAVSTATE);
}

exports.processConnectState = processConnectState;
exports.resetAVState = resetAVState;