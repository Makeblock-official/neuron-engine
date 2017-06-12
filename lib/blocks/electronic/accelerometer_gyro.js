/**
 * block type definition.
 */

var block = {
  name: 'ACCELEROMETER_GYRO',
  type: 0x63,
  subtype: 0x06,
  status: {
    shake: {
      subid: 0x01,
      datatype: ['BYTE']
    },
    x_acceleration: {
      subid: 0x02,
      datatype: ['float']
    },
    y_acceleration: {
      subid: 0x03,
      datatype: ['float']
    },
    z_acceleration: {
      subid: 0x04,
      datatype: ['float']
    },    
     x_angle: {
      subid: 0x08,
      datatype: ['short']
    },
    y_angle: {
      subid: 0x09,
      datatype: ['short']
    },
    z_angle: {
      subid: 0x0a,
      datatype: ['short']
    },   
  },
  commands: {
    SUBSCRIBE: {
      commandid: 0x01,
      datatype: ['BYTE','BYTE','long']
    }, 
    GET_STATE: {
      commandid: 0x01,
      datatype: ['BYTE','BYTE']
    },     
    CANCLE_SUBSCRIBE: {
      commandid: 0x02,
      datatype: ['BYTE']
    }
  }
};

module.exports = block;
