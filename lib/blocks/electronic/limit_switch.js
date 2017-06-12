/**
 * block type definition.
 */

var block = {
  name: 'LIMIT_SWITCH',
  type: 0x3f,
  status: {
    limit: {
      subid: 0x01,
      datatype: ['BYTE']
    }
  },
};

module.exports = block;
