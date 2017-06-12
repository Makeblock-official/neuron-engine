/**
 * block type definition.
 */

var block = {
  name: 'OLED_DISPLAY',
  type: 0x65,
  subtype: 0x05,
  commands: {
    DISPLAY_STRING: {
      commandid: 0x01,
      datatype: ['BYTE','string'] //display position; display content
    },
    DISPLAY_FACE: {
      commandid: 0x02,
      datatype: ['BYTE','BYTE'] //face no; 0: don't blink, 1: blink
    },
  }
};

module.exports = block;
