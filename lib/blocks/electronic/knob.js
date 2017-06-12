/**
 * block type definition.
 */

var block = {
  name: 'KNOB',
  type: 0x64,
  subtype: 0x01,
  status: {
    potentio: {
      subid: 0x01,
      datatype: ['BYTE']
    }
  },
  commands: {
    GET_STATE: {
      commandid: 0x01
    },
    SET_REPORT_MODE: {
      commandid: 0x7F,
      datatype: ['BYTE','long'] //report mode; report period
    }
  } 
};

module.exports = block;
