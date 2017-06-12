/**
 * block type definition.
 */

var block = {
  name: 'TOUCH_SENSOR',
  type: 0x43,
  status: {
    touch: {
      subid: 0x01,
      datatype: ['BYTE']
    }
  },
};

module.exports = block;
