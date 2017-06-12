/**
 * block type definition.
 */

var block = {
  name: 'SERVO',
  type: 0x62,
  subtype: 0x03,
  commands: {
    SET_ALL_ANGLE: {
      commandid: 0x01,
      datatype: ['SHORT'] // servo angle
    },
    SET_SERVO1_ANGLE: {
      commandid: 0x02,
      datatype: ['SHORT'] // servo angle
    }, 
    SET_SERVO2_ANGLE: {
      commandid: 0x03,
      datatype: ['SHORT'] // servo angle
    }, 
    CLOSE_ALL_SERVO: {
      commandid: 0x04
    },       
  } 
};

module.exports = block;
