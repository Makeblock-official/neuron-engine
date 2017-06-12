/**
 * block type definition.
 */

var block = {
  name: 'ULTRASONIC',
  type: 0x63,
  subtype: 0x03,
  status: {
    distance: {
      subid: 0x01,
      datatype: ['float'] // distance
    }
  },
  commands: {
    GET_DISTANCE: {
      commandid: 0x01
    },
    SET_REPORT_MODE: {
      commandid: 0x7F,
      datatype: ['BYTE','long'] //report mode; report period
    }
  } 
};

module.exports = block;
