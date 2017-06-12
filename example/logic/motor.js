/**
 * the example for Neuron motor block.
 * our motor driver can driver two motors, we use joystick to control motors
 */

  /*
  * motor api
  * engine.sendBlockCommand('MOTORS','SET_SPEED',[port1,port2],index)
  * @param [port1,port2] {array} speed of motor,from -100 to 100
  * @param index {integer} for example,if you connected two motor driver,the first is 1;the second is 2
 */
 var engine = require('../../lib/engine/logic').create({"driver": "serial", "loglevel": "WARN"});

 engine.on("blockStatusChanges", blockStatusChanges);

function calcMotorspeed(speed,direction){
  var motor = {port1: 0,port2:0}
  if (direction < 0){  // turn left
    motor.port2 = -speed;
    if (direction <= -100){
     motor.port1 = -speed;       
    } else {
      motor.port1 = speed* (1 + direction/100);
    }
  } else if (direction === 0){  // forward or backward
    motor.port1 = speed;
    motor.port2 = -speed;   
  } else {  // turn right
    motor.port1 = speed;
    if (direction >= 100){ 
      motor.port2 = speed;
    } else {
      motor.port2 = -speed* (1 - direction/100);
    }    
  }
  return motor;
}

function blockStatusChanges(type, idx, value) {
  console.log('blockStatusChanges: ' + type + ' ' + idx + ' ' + JSON.stringify(value));
  if (type === 'JOYSTICK'){
    if ('state' in value){
      var x  = value.state[0];
      var y = value.state[1];
      var speed = y;
      var direction = x;
      var motor = calcMotorspeed(speed,direction);
      engine.sendBlockCommand('MOTORS','SET_SPEED',[motor.port1,motor.port2],1);
    }
  }
}