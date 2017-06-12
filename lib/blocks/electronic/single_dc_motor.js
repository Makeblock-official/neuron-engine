/**
 * block type definition.
 */

var block = {
  name: 'SINGLE_DC_MOTOR',
  type: 0x62,
  subtype: 0x01,
  commands: {
    SET_SPEED: {
      commandid: 0x01,
      datatype: ['byte'] // speed
    }
  } 
};

module.exports = block;
