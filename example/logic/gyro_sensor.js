/**
 * the example for Neuron gyro_sensor block.
 */

/**
 * before get gyro_sensor value,we shoule send command to subscribe 
 *  we can subscribe shake/angle/acceleration,see below function subscribe
 */

/**
  * how to get gyro_sensor value
  * use event listener
  * engine.on("blockStatusChanges", callBack);

  * use api: getBlockSubStatus
  * engine.getBlockSubStatus('ACCELEROMETER_GYRO', type, index)
  * @param type {string} the gyro_sensor value you subscribe,see below
  * @param index {integer} for example,if you connected two gyro_sensor,the first is 1;the second is 2
  * @return {array}           [the substatus]
 */

var SUBSCRIBE = 'SHAKE';  

var engine = require('../../lib/engine/logic').create({"driver": "websocket", "serverIP": "192.168.3.119","loglevel": "WARN"});
engine.on("blockStatusChanges", blockStatusChanges);
engine.on("blockListChanges", blockListChanges);

function subscribe(type){
    SUBSCRIBE = type;
    switch (type) {
      case 'SHAKE':
        engine.sendBlockCommand('ACCELEROMETER_GYRO','SUBSCRIBE',[0x01,0x01,100],1);
        break;
      case 'X_ANGLE':
        engine.sendBlockCommand('ACCELEROMETER_GYRO','SUBSCRIBE',[0x01,0x08,40],1);
        break;
       case 'Y_ANGLE':
        engine.sendBlockCommand('ACCELEROMETER_GYRO','SUBSCRIBE',[0x01,0x09,40],1);
        break;   
      case 'Z_ANGLE':
        engine.sendBlockCommand('ACCELEROMETER_GYRO','SUBSCRIBE',[0x01,0x0a,40],1);
        break;                       
      case 'X_ACCELERATION':
        engine.sendBlockCommand('ACCELEROMETER_GYRO','SUBSCRIBE',[0x01,0x02,40],1);
        break;
      case 'Y_ACCELERATION':
        engine.sendBlockCommand('ACCELEROMETER_GYRO','SUBSCRIBE',[0x01,0x03,40],1);
        break;   
      case 'Z_ACCELERATION':
        engine.sendBlockCommand('ACCELEROMETER_GYRO','SUBSCRIBE',[0x01,0x04,40],1);
        break;                       
      default: 
        console.warn('type not support: ', type);
        break; 
    }
}

function cancleSubscribe(type){
    switch (type){
      case 'SHAKE':
        engine.sendBlockCommand('ACCELEROMETER_GYRO','CANCLE_SUBSCRIBE',[0x01],1);
        break;
      case 'X_ANGLE':
        engine.sendBlockCommand('ACCELEROMETER_GYRO','CANCLE_SUBSCRIBE',[0x08],1);
        break;     
      case 'Y_ANGLE':
        engine.sendBlockCommand('ACCELEROMETER_GYRO','CANCLE_SUBSCRIBE',[0x09],1);
        break;       
      case 'Z_ANGLE':
        engine.sendBlockCommand('ACCELEROMETER_GYRO','CANCLE_SUBSCRIBE',[0x0a],1);
        break;
       case 'X_ACCELERATION':
        engine.sendBlockCommand('ACCELEROMETER_GYRO','CANCLE_SUBSCRIBE',[0x02],1);
        break;     
      case 'Y_ACCELERATION':
        engine.sendBlockCommand('ACCELEROMETER_GYRO','CANCLE_SUBSCRIBE',[0x03],1);
        break;       
      case 'Z_ACCELERATION':
        engine.sendBlockCommand('ACCELEROMETER_GYRO','CANCLE_SUBSCRIBE',[0x04],1);
        break;        
    }  
}

function blockStatusChanges(type, idx, value) {
  console.log(type + ' ' + 'idx ' + JSON.stringify(value));
  if (type === 'ACCELEROMETER_GYRO'){
    var state;
    switch (SUBSCRIBE){
      case 'SHAKE':
        var shake = value.shake[0];
        console.log('gyro_sensor shake StatusChanges: ' + shake);
        state = engine.getBlockSubStatus('ACCELEROMETER_GYRO', 'shake', 1);
        shake = state[0];
        console.log('get gyro_sensor shake: ' + shake);
        break;
      case 'X_ANGLE':
        var x_angle = value.x_angle[0];
        console.log('gyro_sensor x_angle StatusChanges: ' + x_angle);
        state = engine.getBlockSubStatus('ACCELEROMETER_GYRO', 'x_angle', 1);
        x_angle = state[0];
        console.log('get gyro_sensor x_angle: ' + x_angle);      
        break;     
      case 'Y_ANGLE':
         var y_angle = value.y_angle[0];
        console.log('gyro_sensor y_angle StatusChanges: ' + y_angle);
        state = engine.getBlockSubStatus('ACCELEROMETER_GYRO', 'y_angle', 1);
        y_angle = state[0];
        console.log('get gyro_sensor y_angle: ' + y_angle);      
        break;       
      case 'Z_ANGLE':
        var z_angle = value.z_angle[0];
        console.log('gyro_sensor z_angle StatusChanges: ' + z_angle);
        state = engine.getBlockSubStatus('ACCELEROMETER_GYRO', 'z_angle', 1);
        z_angle = state[0];
        console.log('get gyro_sensor z_angle: ' + z_angle);      
        break;
       case 'X_ACCELERATION':
        var x_acceleration = value.x_acceleration[0];
        console.log('gyro_sensor x_acceleration StatusChanges: ' + x_acceleration);
        state = engine.getBlockSubStatus('ACCELEROMETER_GYRO', 'x_acceleration', 1);
        x_acceleration = state[0];
        console.log('get gyro_sensor x_acceleration: ' + x_acceleration);        
        break;     
      case 'Y_ACCELERATION':
        var y_acceleration = value.y_acceleration[0];
        console.log('gyro_sensor y_acceleration StatusChanges: ' + y_acceleration);
        state = engine.getBlockSubStatus('ACCELEROMETER_GYRO', 'y_acceleration', 1);
        y_acceleration = state[0];
        console.log('get gyro_sensor y_acceleration: ' + y_acceleration); 
        break;       
      case 'Z_ACCELERATION':
        var z_acceleration = value.z_acceleration[0];
        console.log('gyro_sensor z_acceleration StatusChanges: ' + z_acceleration);
        state = engine.getBlockSubStatus('ACCELEROMETER_GYRO', 'z_acceleration', 1);
        z_acceleration = state[0];
        console.log('get gyro_sensor z_acceleration: ' + z_acceleration); 
        break;        
    }
  }
}

function blockListChanges(list){
  console.log(JSON.stringify(list));
  if ('ACCELEROMETER_GYRO' in list){
    cancleSubscribe(SUBSCRIBE);
    subscribe('X_ANGLE');
  }
}
