/**
 * block type definition.
 */

var block = {
  name: 'SELF_LOCK_SWITCH',
  type: 0x64,
  subtype: 0x06,
  status: {
    state: {
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
