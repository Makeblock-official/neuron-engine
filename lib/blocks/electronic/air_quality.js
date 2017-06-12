/**
 * block type definition.
 */

var block = {
  name: 'AIR_QUALITY',
  type: 0x63,
  subtype: 0x0b,
  status: {
    "PM2.5": {
      subid: 0x01,
      datatype: ['SHORT']
    },
    "PM1.0": {
      subid: 0x02,
      datatype: ['SHORT']
    },
    "PM10": {
      subid: 0x03,
      datatype: ['SHORT']
    }
  },
  commands: {
    "GET_PM2.5": {
      commandid: 0x01
    },
    "GET_PM1.0": {
      commandid: 0x02
    },
    "GET_PM10": {
      commandid: 0x03
    },
    "SET_OUTPUT_TYPE": {
      commandid: 0x04,
      datatype: ['BYTE']
    },
    "SET_REPORT_MODE": {
      commandid: 0x7F,
      datatype: ['BYTE','long'] //report mode; report period
    }
  }
};

module.exports = block;
