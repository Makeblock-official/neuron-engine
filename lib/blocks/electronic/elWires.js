/**
 * block type definition.
 */

var block = {
  name: 'ELWIRES',
  type: 0x65,
  subtype: 0x06,
  commands: {
    DISPLAY: {
      commandid: 0x01,
      datatype: ['BYTE'] 
    }
  }
};

module.exports = block;
