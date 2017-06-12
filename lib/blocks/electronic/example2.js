/**
 * example block type definition.(with sub status)
 */

var example2 = {
  // the name of the block, must not be unique.
  name: 'example2',
  // the typeid of block.
  type: 0x00,
  // subtypeid of block, optional.
  // subtype: 0x01,
  // available sub status' datatype.
  status: {
    'sub1' : {
      'subid': 0x01,
      'datatype': ['float']
    },
    'sub2' : {
      'subid': 0x02, 
      'datatype' : ['byte', 'BYTE', 'short', 'float']
    }
  }
};

module.exports = example2;