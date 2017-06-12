/**
 * block type definition.
 */

var block = {
  name: 'LED',
  type: 0x65,
  subtype: 0x02,
  commands: {
    SET_COLOUR: {
      commandid: 0x01,
      datatype: ['SHORT','SHORT','SHORT'] // r,g,b
    }
  } 
};

module.exports = block;
