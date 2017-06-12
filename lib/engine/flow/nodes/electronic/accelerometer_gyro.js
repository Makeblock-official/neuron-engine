var electronicblock = require('../../electronicblock');
var logger = require('../../../../log/log4js').logger;

var node = {
  name: 'ACCELEROMETER_GYRO',
  conf: {type: null},
  props: {
    'category': 'electronic',
    'in': [],
    'out': ['X','Y','Z'],
    'configs':{type: {type: 'options', options: ['angle','speed','acceleration'],defaultValue: 'angle'}
    }
  },
  run: function() {
    var that = this;
    var type = that.conf.type;
    switch (type) {
      case 'angle':
        electronicblock.sendBlockCommand('ACCELEROMETER_GYRO','SET_OUTPUT_TYPE',[0x02],that.idx);
        break;
      case 'speed':
        electronicblock.sendBlockCommand('ACCELEROMETER_GYRO','SET_OUTPUT_TYPE',[0x01],that.idx);
        break;
      case 'acceleration':
        electronicblock.sendBlockCommand('ACCELEROMETER_GYRO','SET_OUTPUT_TYPE',[0x0],that.idx);
        break;
      default: 
        logger.warn('type not support: ', type);
        return; 
    }
  },
  processStatus: function(value) {
    var that = this;
    for (var port in value){
      if (value[port].length === 3){
        that.out('X', value[port][0]); 
        that.out('Y', value[port][1]);
        that.out('Z', value[port][2]);
      }
    }
  },
  init: function() {

  }
};

module.exports = node;
