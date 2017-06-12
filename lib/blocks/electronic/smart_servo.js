/**
 * block type definition.
 */

var block = {
  name: 'SMARTSERVO',
  type: 0x60,
  status: {
    ANGLE: {
      subid: 0x36,
      datatype: ['long']
    },
    POS: {
      subid: 0x22,
      datatype: ['SHORT']
    },
    SPEED: {
      subid: 0x23,
      datatype: ['float']
    },
    TEMPERATURE: {
      subid: 0x25,
      datatype: ['float']
    },
    CURRENT: {
      subid: 0x26,
      datatype: ['float']
    },
    VOLTAGE: {
      subid: 0x27,
      datatype: ['float']
    }
  },
  commands: {
    GET_CUR_POS: {
      commandid: 0x22,
      datatype: ['BYTE']
    },
    GET_CUR_SPEED: {
      commandid: 0x23,
      datatype: ['BYTE']
    },
    GET_TEMPERATURE: {
      commandid: 0x25,
      datatype: ['BYTE']
    },
    GET_CURRENT: {
      commandid: 0x26,
      datatype: ['BYTE']
    },
    GET_VOLTAGE: {
      commandid: 0x27,
      datatype: ['BYTE']
    },
    SET_ABSOLUTE_POS: {
      commandid: 0x11,
      datatype: ['SHORT', 'SHORT']  // POS,SPEED
    },
    SET_RELATIVE_POS : {
      commandid: 0x12,
      datatype: ['SHORT', 'SHORT']  // POS,SPEED
    },
    SET_RGB_LED: {
      commandid: 0x17,
      datatype: ['SHORT','SHORT','SHORT']  //  R,G,B
    },
    SET_BREAK: {
      commandid: 0x16,
      datatype: ['BYTE']  // 1 : release; 0 : lock    
    },
    SET_HAND_SHAKE: {
      commandid: 0x18
    },
    SET_ANGLE_AS_ZERO: {
      commandid: 0x30
    },
    SET_ABSOLUTE_SHORT_ANGLE: {
      commandid: 0x31,
      datatype: ['short', 'SHORT']  // ANGLE,SPEED
    },
    SET_RELATIVE_SHORT_ANGLE: {
      commandid: 0x32,
      datatype: ['short', 'SHORT']  // ANGLE,SPEED
    },
    SET_ABSOLUTE_LONG_ANGLE: {
      commandid: 0x33,
      datatype: ['long', 'SHORT']  // ANGLE,SPEED
    },
    SET_RELATIVE_LONG_ANGLE: {
      commandid: 0x34,
      datatype: ['long', 'SHORT']  // ANGLE,SPEED
    },
    SET_PWM: {
      commandid: 0x35,  //move like DC MOTOER
      datatype: ['short'] //PWM
    },
    GET_CUR_ANGLE: {
      commandid: 0x36,
      datatype: ['BYTE']
    },
    SET_BACKTO_INITIAL_POS: {
      commandid: 0x37,
      datatype: ['BYTE','SHORT'] //BACK MODE(0: RELATIVE POS, 1: ABSOLUTE POS), SPEED
    }
  }
};

module.exports = block;
