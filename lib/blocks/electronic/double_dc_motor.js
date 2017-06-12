/**
 * block type definition.
 */

var block = {
  name: 'MOTORS',
  type: 0x62,
  subtype: 0x02,
  commands: {
    SET_SPEED: {
      commandid: 0x01,
      datatype: ['byte','byte'] // port1_speed, port2_speed
    },
    SET_PORT1: {
      commandid: 0x02,
      datatype: ['byte'] // speed
    }, 
    SET_PORT2: {
      commandid: 0x03,
      datatype: ['byte'] // speed
    }     
  } 
};

module.exports = block;
