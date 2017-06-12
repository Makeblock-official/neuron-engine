/**
 * example block type definition.
 */

var example = {
  // the name of the block, must not be unique.
  name: 'example',
  // the typeid of block.
  type: 0x00,
  // subtypeid of block, optional.
  // subtype: 0x01,
  // available status' datatype.
  status: ['byte', 'BYTE', 'short', 'float']
};

module.exports = example;