/**
 * block type definition.
 */

var block = {
  name: 'SWITCH',
  type: 0x40,
  status: {
    switch: {
      subid: 0x01,
      datatype: ['BYTE']
    }
  },
};

module.exports = block;
