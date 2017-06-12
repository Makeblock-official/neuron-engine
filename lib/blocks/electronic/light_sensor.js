/**
 * block type definition.
 */

var block = {
  name: 'LIGHTSENSOR',
  type: 0x63,
  subtype: 0x02,
  status: {
    light: {
      subid: 0x01,
      datatype: ['BYTE']
    }
  },
  commands: {
    GET_INTENSITY: {
      commandid: 0x01
    },
    SET_REPORT_MODE: {
      commandid: 0x7F,
      datatype: ['BYTE','long'] //report mode; report period
    }
  }  
};

module.exports = block;
