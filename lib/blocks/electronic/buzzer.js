/**
 * block type definition.
 */

var block = {
  name: 'BUZZER',
  type: 0x66,
  subtype: 0x02,
  commands: {
    DISPLAY: {
      commandid: 0x01,
      datatype: ['short','BYTE'] //frequency, volume: 0--100
    }
  }
};

module.exports = block;
