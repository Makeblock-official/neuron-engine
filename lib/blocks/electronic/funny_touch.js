/**
 * block type definition.
 */

var block = {
  name: 'FUNNYTOUCH',
  type: 0x64,
  subtype: 0x04,
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
