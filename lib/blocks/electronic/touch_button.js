/**
 * block type definition.
 */

var block = {
  name: 'TOUCH_BUTTON',
  type: 0x64,
  subtype: 0x08,
  status: {
    press: {
      subid: 0x01,
      datatype: ['BYTE']
    }
  },
  commands: {
    GET_STATE: {
      commandid: 0x01
    },
    SET_LED: {
      commandid: 0x02,
      datatype: ['SHORT'] //12 LED, a bit set a led,eg: set led1 and led2: 0x03;all led: 0xfff
    },    
    SET_REPORT_MODE: {
      commandid: 0x7F,
      datatype: ['BYTE','long'] //report mode; report period
    }
  } 
};

module.exports = block;
