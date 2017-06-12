/**
 * block type definition.
 */

var block = {
  name: 'VOISERECOGNITION',
  type: 0x66,
  subtype: 0x03,
  status: {
    recognition: {
      subid: 0x01,
      datatype: ['BYTE']
    }
  },  
};

module.exports = block;
