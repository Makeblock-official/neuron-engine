/**
 * block type definition.
 */

var block = {
  name: 'LEDSTRIP',
  type: 0x65,
  subtype: 0x03,
  commands: {
    SET_SINGLE_LED: {
      commandid: 0x01,
      datatype: ['BYTE','SHORT','SHORT','SHORT']  //  led no,R,G,B
    },
    DISPLAY_PATTERN: {
      commandid: 0x02,
      variableParams: ['BYTE']  //datatype of params    
    }
  }
};

module.exports = block;
