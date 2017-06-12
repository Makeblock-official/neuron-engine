/**
 * block type definition.
 */

var block = {
  name: 'SEGDISPLAY',
  type: 0x65,
  subtype: 0x01,
  commands: {
    DISPLAY: {
      commandid: 0x01,
      datatype: ['float'] 
    }
  }
};

module.exports = block;
