/**
 * block type definition.
 */

var block = {
  name: 'USB_CAMERA',
  type: 0x67,
  subtype: 0x01,
  commands: {
    PLAY: {
      commandid: 0x01
    },
    stop: {
      commandid: 0x06
    }
  }
};

module.exports = block;
