/**
 * block type definition.
 */

var block = {
  name: 'USB_AUDIO',
  type: 0x66,
  subtype: 0x04,
  commands: {
    PLAY: {
      commandid: 0x01,
      datatype: ['BYTE']  // song no   
    },
    DELETE_SONG: {
      commandid: 0x02,
      datatype: ['BYTE']  // song no  
    },
    PLAY_PREVIOUS: {
      commandid: 0x03
    },
    PLAY_NEXT: {
      commandid: 0x04
    },
    PLAY_PAUSE: {
      commandid: 0x05
    },
    stop: {
      commandid: 0x06
    },
    PLAY_MODE: {
      commandid: 0x08,
      datatype: ['BYTE']  // mode
    },
  }
};

module.exports = block;
