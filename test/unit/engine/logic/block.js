var expect = require('chai').expect;
var block = require('../../../../lib/engine/logic/block');
var blocks = require('../../../../lib/blocks/electronic');

var getBlockOptionCases = [
{
  type: '1_KEY_BUTTON',
  subtype: null,
  want: {
    name: '1_KEY_BUTTON',
    type: 0x64,
    subtype: 0x02,
    status: {
      press: {
        subid: 0x01,
        datatype: ['BYTE']
      }
    },
    commands: {
      GET_STATE: {
        commandid: 0x01
      },
      SET_REPORT_MODE: {
        commandid: 0x7F,
        datatype: ['BYTE','long'] //report mode; report period
      }
    } 
  }
},
{
  type: 0x64,
  subtype: 0x02,
  want: {
    name: '1_KEY_BUTTON',
    type: 0x64,
    subtype: 0x02,
    status: {
      press: {
        subid: 0x01,
        datatype: ['BYTE']
      }
    },
    commands: {
      GET_STATE: {
        commandid: 0x01
      },
      SET_REPORT_MODE: {
        commandid: 0x7F,
        datatype: ['BYTE','long'] //report mode; report period
      }
    } 
  }
}
];

var checkSubStatusCases = [
{
  type: 'example',
  want: false
},
{
  type: 'example2',
  want: true
}
];

var checkStatusParamsCases = [
{
  type: 'example',
  data: [-1,0,1024,12.3],
  want: 0
},
{
  type: 'example',
  data: [-1,0,1024],
  want: -1
}
];

var checkCommandParamsCases = [
{
  type: 'example3',
  command: 'command1',
  data:[1],
  want: 0
},
{
  type: 'example3',
  command: 'command2',
  data:[1,2],
  want: -1
},
{
  type: 'example3',
  command: 'command3',
  data:[1,2,3],
  want: -2
}
];

var createStatusPackageCases = [
{
  type: 'example',
  values: [-128,127,1024,12.3],
  want: {
    type: 0x00,
    data: [{'byte': -128}, {'BYTE': 127}, {'short': 1024},{'float': 12.3}]
  }
}
];

var createSubStatusPackageCases = [
{
  type: 'example2',
  subid: 0x01,
  want: {
    type: 0x00,
    data: [{'BYTE': 1}, {'float': null}]
  }
},
{
  type: 'example2',
  subid: 0x02,
  values: [1, 2, 3, 4.56],
  want: {
    type: 0x00,
    data: [{'BYTE': 0x02}, {'byte': 1}, {'BYTE':2}, {'short':3}, {'float':4.56}]
  }
}
];

var createCommandPackageCases = [
{
  type: 'example3',
  command: 'command1',
  want: {
    type: 0x01,
    data: [{'BYTE': 0x01}, {'float': null}]
  }
}, {
  type: 'example3',
  command: 'command2',
  values: [1, 2, 3, 4.56],
  want: {
    type: 0x01,
    data: [{'BYTE': 0x02}, {'byte': 1}, {'BYTE':2}, {'short':3}, {'float':4.56}]
  }
}
];

var createBlockValuesCases = [{
  type: 'example',
  data: [{'byte': -128}, {'BYTE': 127}, {'short': 1024},{'float': 12.3}],
  want: [-128,127,1024,12.3]
}, {
  type: 'example2',
  data: [{'BYTE': 0x01}, {'float': 1.23}],
  want: {'sub1': [1.23]}
}, {
  type: 'example2',
  data: [{'BYTE': 0x02}, {'byte': 1}, {'BYTE':2}, {'short':3}, {'float':4.56}],
  want: {'sub2': [1, 2, 3, 4.56]}
}];

describe('block', function() {
  before(function() {
    for (var i = 0; i < blocks.length; i++) {
      block.registerBlockType(blocks[i]);
    }
    block.registerBlockType(require('../../../../lib/blocks/electronic/example'));
    block.registerBlockType(require('../../../../lib/blocks/electronic/example2'));
    block.registerBlockType(require('../../../../lib/blocks/electronic/example3'));
  });

  after(function() {
    for (var i = 0; i < blocks.length; i++) {
      block.unregisterBlockType(blocks[i].name);
    }
    block.unregisterBlockType(require('../../../../lib/blocks/electronic/example').name);
    block.unregisterBlockType(require('../../../../lib/blocks/electronic/example2').name);
    block.unregisterBlockType(require('../../../../lib/blocks/electronic/example3').name);
  });

  describe('getBlockOption', function() {
    it('should get block type definition in _blockTypes', function() {
      for (var i = 0; i < getBlockOptionCases.length; i++) {
        expect(block.getBlockOption(getBlockOptionCases[i].type, getBlockOptionCases[i].subtype)).to.deep.equal(getBlockOptionCases[i].want);
      }
    });
  });

  describe('checkSubStatus', function() {
    it('should return true if block has sub status', function() {
      for (var i = 0; i < checkSubStatusCases.length; i++) {
        expect(block.checkSubStatus(block.getBlockOption(checkSubStatusCases[i].type))).to.deep.equal(checkSubStatusCases[i].want);
      }
    });
  });

  describe('checkStatusParams', function() {
    it('should return 0 if statusParam number is correct', function() {
      for (var i = 0; i < checkStatusParamsCases.length; i++) {
        expect(block.checkStatusParams(block.getBlockOption(checkStatusParamsCases[i].type),checkStatusParamsCases[i].data)).to.deep.equal(checkStatusParamsCases[i].want);
      }
    });
  });

  describe('checkCommandParams', function() {
    it('should return 0 if commandParams number is correct', function() {
      var option;
      for (var i = 0; i < checkCommandParamsCases.length; i++) {
        option = block.getBlockOption(checkCommandParamsCases[i].type);
        expect(block.checkCommandParams(option,checkCommandParamsCases[i].command,checkCommandParamsCases[i].data)).to.deep.equal(checkCommandParamsCases[i].want);
      }
    });
  });
  
  describe('createStatusPackage', function() {
    it('should create valid block status package with type', function() {
      for (var i = 0; i < createStatusPackageCases.length; i++) {
        expect(block.createStatusPackage(createStatusPackageCases[i].type, createStatusPackageCases[i].values)).to.deep.equal(createStatusPackageCases[i].want);
      }
    });
  });

  describe('createBlockValues', function() {
    it('should create valid block package with type', function() {
      for (var i = 0; i < createBlockValuesCases.length; i++) {
        expect(block.createBlockValues(createBlockValuesCases[i].type, createBlockValuesCases[i].data)).to.deep.equal(createBlockValuesCases[i].want);
      }
    });
  });

  describe('createCommandPackage', function() {
    it('should create valid block command package with command', function() {
      for (var i = 0; i < createCommandPackageCases.length; i++) {
        expect(block.createCommandPackage(createCommandPackageCases[i].type, createCommandPackageCases[i].command, createCommandPackageCases[i].values)).to.deep.equal(createCommandPackageCases[i].want);
      }
    });
  });

  describe('createSubStatusPackage', function() {
    it('should create valid block command package with command', function() {
      for (var i = 0; i < createSubStatusPackageCases.length; i++) {
        expect(block.createSubStatusPackage(createSubStatusPackageCases[i].type, createSubStatusPackageCases[i].subid, createSubStatusPackageCases[i].values)).to.deep.equal(createSubStatusPackageCases[i].want);
      }
    });
  });
});
