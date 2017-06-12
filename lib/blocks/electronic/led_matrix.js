/**
 * block type definition.
 */

var block = {
  name: 'LED_MATRIX',
  type: 0x48,
  status: ['long', 'long'] // 8*4, 8*4 MATRIX
};

module.exports = block;
