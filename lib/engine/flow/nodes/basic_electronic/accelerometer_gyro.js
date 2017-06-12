var electronicblock = require('../../electronicblock');
var logger = require('../../../../log/log4js').logger;

var node = {
  name: 'ACCELEROMETER_GYRO',
  conf: {type: null,axis: null},
  props: {
    'category': 'electronic',
    'in': [],
    'out': ['data'],
    'configs':{
      type: {type: 'options', options: ['shake','angle','acceleration'],defaultValue: 'shake'},
      axis: {type: 'text',defaultValue: 'X'}
    }
  },
  run: function() {
    var that = this;
    // cancle last Subscribe
    switch (that.subscribe){
      case 'SHAKE':
        electronicblock.sendBlockCommand('ACCELEROMETER_GYRO','CANCLE_SUBSCRIBE',[0x01],that.idx);
        break;
      case 'X_ANGLE':
        electronicblock.sendBlockCommand('ACCELEROMETER_GYRO','CANCLE_SUBSCRIBE',[0x08],that.idx);
        break;     
      case 'Y_ANGLE':
        electronicblock.sendBlockCommand('ACCELEROMETER_GYRO','CANCLE_SUBSCRIBE',[0x09],that.idx);
        break;       
      case 'Z_ANGLE':
        electronicblock.sendBlockCommand('ACCELEROMETER_GYRO','CANCLE_SUBSCRIBE',[0x0a],that.idx);
        break;
       case 'X_ACCELERATION':
        electronicblock.sendBlockCommand('ACCELEROMETER_GYRO','CANCLE_SUBSCRIBE',[0x02],that.idx);
        break;     
      case 'Y_ACCELERATION':
        electronicblock.sendBlockCommand('ACCELEROMETER_GYRO','CANCLE_SUBSCRIBE',[0x03],that.idx);
        break;       
      case 'Z_ACCELERATION':
        electronicblock.sendBlockCommand('ACCELEROMETER_GYRO','CANCLE_SUBSCRIBE',[0x04],that.idx);
        break;        
    }
    // Subscribe
    var type = that.conf.type;
    var axis = that.conf.axis;
    switch (type) {
      case 'shake':
        that.subscribe = 'SHAKE';
        electronicblock.sendBlockCommand('ACCELEROMETER_GYRO','SUBSCRIBE',[0x01,0x01,100],that.idx);
        break;
      case 'angle':
        switch (axis) {
          case 'X':
            that.subscribe = 'X_ANGLE';
            electronicblock.sendBlockCommand('ACCELEROMETER_GYRO','SUBSCRIBE',[0x01,0x08,40],that.idx);
            break;
          case 'Y':
            that.subscribe = 'Y_ANGLE';
            electronicblock.sendBlockCommand('ACCELEROMETER_GYRO','SUBSCRIBE',[0x01,0x09,40],that.idx);
            break;   
          case 'Z':
            that.subscribe = 'Z_ANGLE';
            electronicblock.sendBlockCommand('ACCELEROMETER_GYRO','SUBSCRIBE',[0x01,0x0a,40],that.idx);
            break;                       
        }
        break;
      case 'acceleration':
         switch (axis) {
          case 'X':
            that.subscribe = 'X_ACCELERATION';
            electronicblock.sendBlockCommand('ACCELEROMETER_GYRO','SUBSCRIBE',[0x01,0x02,40],that.idx);
            break;
          case 'Y':
            that.subscribe = 'Y_ACCELERATION';
            electronicblock.sendBlockCommand('ACCELEROMETER_GYRO','SUBSCRIBE',[0x01,0x03,40],that.idx);
            break;   
          case 'Z':
            that.subscribe = 'Z_ACCELERATION';
            electronicblock.sendBlockCommand('ACCELEROMETER_GYRO','SUBSCRIBE',[0x01,0x04,40],that.idx);
            break;                       
        }     
        break;
      default: 
        logger.warn('type not support: ', type);
        return; 
    }
  },
  processStatus: function(value) {
    var that = this;
    var data;
    switch (that.subscribe){
      case 'SHAKE':
        var shake = value.shake[0] > 0?true:false;
        that.out('data', shake); 
        break;
      case 'X_ANGLE':
        that.out('data', value.x_angle[0]); 
        break;     
      case 'Y_ANGLE':
        that.out('data', value.y_angle[0]); 
        break;       
      case 'Z_ANGLE':
        that.out('data', value.z_angle[0]); 
        break;
       case 'X_ACCELERATION':
        data = value.x_acceleration[0]===null?0:value.x_acceleration[0];
        that.out('data', Number(data.toFixed(2))); 
        break;     
      case 'Y_ACCELERATION':
        data = value.y_acceleration[0]===null?0:value.y_acceleration[0];
        that.out('data', Number(data.toFixed(2)));
        break;       
      case 'Z_ACCELERATION':
        data = value.z_acceleration[0]===null?0:value.z_acceleration[0];
        that.out('data', Number(data.toFixed(2)));
        break;        
    }
  },
  config: function(){
    this.run();
  },
  initNode: function(){
    var that = this;
    var type = that.conf.type;
    var axis = that.conf.axis;
    var acc;
    switch (type) {
      case 'shake':
         acc  = 1;
        break;
      case 'angle':
        switch (axis) {
          case 'X':
            acc = 0x08;
            break;
          case 'Y':
            acc = 0x09;
            break;   
          case 'Z':
            acc = 0x0a;
            break;                       
        }
        break;
      case 'acceleration':
         switch (axis) {
          case 'X':
            acc = 0x02;
            break;
          case 'Y':
            acc = 0x03;
            break;   
          case 'Z':
            acc = 0x04;
            break;                       
        }     
        break;
      default: 
        logger.warn('type not support: ', type);
        return; 
    }    
    electronicblock.sendBlockCommand('ACCELEROMETER_GYRO','GET_STATE',[0,acc],that.idx);
    electronicblock.updateBlockStatus('ACCELEROMETER_GYRO', that.idx);
  },   
  init: function() {
    this.subscribe = 'SHAKE';
  },
  stop: function(){
    var that = this;
    that.props.configs.type.defaultValue = 'shake';
    that.props.configs.axis.defaultValue = 'X';    
  },
  getBlockVersion: function() {
    var that = this;
    electronicblock.getBlockVersion(that.name, that.idx);
  },
  updateNeuronBlock: function() {
    var that = this;
    electronicblock.updateBlockFirmware(that.name, that.idx);
  }
};

module.exports = node;
