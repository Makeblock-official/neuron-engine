/**
 * block type definition.
 */

var block = {
  name: 'COLORSENSOR',
  type: 0x63,
  subtype: 0x05,
  status: {
    color: {
      subid: 0x01,
      datatype: ['SHORT','SHORT','SHORT'] // R,G,B
    }
  },
  commands: {
    GET_COLOR: {
      commandid: 0x01
    },
    SET_REPORT_MODE: {
      commandid: 0x7F,
      datatype: ['BYTE','long'] //report mode; report period
    }
  } 
};

module.exports = block;
