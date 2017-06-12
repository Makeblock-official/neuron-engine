/**
 * example block type definition.(with block commands)
 */

var example3 = {
  // the name of the block, must not be unique.
  name: 'example3',
  // the typeid of block.
  type: 0x01,
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
  },
  // block's commands
  commands: {
    'command1': {
      'commandid': 0x01,
      'datatype': ['float']
    }, 
    'command2' : {
      'commandid': 0x02, 
      'datatype' : ['byte', 'BYTE', 'short', 'float']
    }
  }
};

module.exports = example3;