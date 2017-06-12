/**
 * block type definition.
 */

var block = {
  name: 'LED_MATRIX_8*16',
  type: 0x4A,
  commands: {
    DISPLAY_BITMAP: {
      commandid: 0x01,
      datatype: ['long','long','long','long']  
    },
    DISPLAY_STRING: {
      commandid: 0x02,
      datatype: ['string']  
    },
    DISPLAY_TIME: {
      commandid: 0x03,
      datatype: ['BYTE','BYTE'] //hour, minute
    },

  }
};

module.exports = block;
