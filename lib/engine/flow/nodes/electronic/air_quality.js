var electronicblock = require('../../electronicblock');
var logger = require('../../../../log/log4js').logger;

var node = {
  name: 'AIR_QUALITY',
  conf: {type: null},
  props: {
    'category': 'electronic',
    'in': [],
    'out': ['air_quality'],
    'configs':{type: {type: 'options', options: ['PM2.5','PM1.0','PM10'],defaultValue: 'PM2.5'}
    }
  },
  run: function() {
    var that = this;
    var type = that.conf.type;
    switch (type) {
      case 'PM2.5':
        electronicblock.sendBlockCommand('AIR_QUALITY','SET_OUTPUT_TYPE',[0x01],that.idx);
        break;
      case 'PM1.0':
        electronicblock.sendBlockCommand('AIR_QUALITY','SET_OUTPUT_TYPE',[0x02],that.idx);
        break;
      case 'PM10':
        electronicblock.sendBlockCommand('AIR_QUALITY','SET_OUTPUT_TYPE',[0x03],that.idx);
        break;
      default: 
        logger.warn('type not support: ', type);
        return; 
    }
  },
  processStatus: function(value) {
    var that = this;
    for (var port in value){ 
      that.out('air_quality', value[port][0]); 
    }
  },
  init: function() {

  }
};

module.exports = node;
