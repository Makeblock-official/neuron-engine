/**
 * block type definition.
 */

var block = {
  name: 'STEPPER_MOTOR',
  type: 0x3A,
  status: ['long'], // position
  commands: {
    SET_POS: {
      commandid: 0x01,
      datatype: ['SHORT', 'long'] // speed, position
    }
  }
};

module.exports = block;
