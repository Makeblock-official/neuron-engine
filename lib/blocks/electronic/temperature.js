/**
 * block type definition.
 */

var block = {
  name: 'TEMPERATURE',
  type: 0x63,
  subtype: 0x01,
  status: {
    temperature: {
      subid: 0x01,
      datatype: ['float']
    }
  },
  commands: {
    GET_TEMPERATURE: {
      commandid: 0x01
    },
    SET_REPORT_MODE: {
      commandid: 0x7F,
      datatype: ['BYTE','long'] //report mode; report period
    }
  } 
};

module.exports = block;
