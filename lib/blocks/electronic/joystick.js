/**
 * block type definition.
 */

var block = {
  name:'JOYSTICK',
  type: 0x64,
  subtype: 0x07,
  status: {
    state: {
      subid: 0x01,
      datatype: ['byte','byte']
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
