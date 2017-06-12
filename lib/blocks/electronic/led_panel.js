/**
 * block type definition.
 */

var block = {
  name: 'LEDPANEL',
  type: 0x65,
  subtype: 0x04,
  commands: {
    DISPLAY_BITMAP: {
      commandid: 0x01,
      datatype: ['long','long','SHORT','SHORT','SHORT']  //8*4,8*4,R,G,B
    },
    DISPLAY_SINGLE_LED: {
      commandid: 0x02,
      datatype: ['BYTE','SHORT','SHORT','SHORT']  //LED NO, R,G,B
    },
    DISPLAY_IMAGE: {
      commandid: 0x03,
      variableParams: ['BYTE'] // [mode,led number,color1, color2...]
    },
    UPLOAD_IMAGE: {
      commandid: 0x04,
      variableParams: ['BYTE']  // [frame number,led number,color1, color2...]
    },
    DISPLAY_IMAGES: {
      commandid: 0x05,
      datatype: ['BYTE','BYTE'] // speed, mode
    }
  }
};

module.exports = block;
