/**
 * [PACKAGES defines package format by receiving type]
 * @type {Array}
 */
var UP = [];
var UPDATE = [];
var DOWN = {};
// answer of block number arranging.
UP[0x10] = {
  withSubtype: {
    no: 0, // will be overwrite to source block no
    type: 0x10,
    data: [{
      'BYTE': 0 // type
    }, {
      'BYTE': 0 // subtype
    }]
  },
  withoutSubtype: {
    no: 0, // will be overwrite to source block no
    type: 0x10,
    data: [{
      'BYTE': 0 // type
    }]
  }
};

////////////////////////////////////// update block ////////////////////////////////////
// answer of block version query.
UP[0x12] = {
  no: 0, // will be overwrite to source block no
  type: 0x12,
  data: [{
    'BYTE': 0 // type, must be 0x15, means neuron block
  }, {
    'BYTE': 0 // subtype, must be 0x01, means support neuron protocol
  }, {
    'SHORT': 0 //means neuron block version
  }]
};

UP[0x61] = {
  no: 0,
  type: 0x61
};

UPDATE[0x06] = {
  no: 0,
  type: 0x61,
  subtype: 0x06,
  data: [{
    'short': 0
  }, {
    'short': 0
  }]
};

UPDATE[0x07] = {
  no: 0,
  type: 0x61,
  subtype: 0x07,
  data: [{
    'SHORT': 0
  },{
    'BYTE': 0
  }]
};

UPDATE[0x08] = {
  no: 0,
  type: 0x61,
  subtype: 0x08,
  data: [{
    'BYTE': 0
  }]
};

////////////////////////////////////// end update block ////////////////////////////////////

// handshake from block
UP[0x20] = {
  no: 0, // will be overwrite to source block no
  type: 0x20
};
// errorcode from block
UP[0x15] = {
  no: 0, // will be overwrite to source block no
  type: 0x15,
    data: [{
      'BYTE': 0 // errorcode
    }]
};


// ask for block number arranging.
DOWN.ARANGE = {
  no: 0xff,
  type: 0x10,
  data: [{
    'BYTE': 0
  }]
};
// reset block
DOWN.RESET = {
  no: 0, // must be overwrite to target block no.
  type: 0x11
};
// set baudrate
DOWN.BAUDRATE = {
  no:0, // must be overwrite to target block no.
  type: 0x13,
  data: [{
    'BYTE': 0 // must be overwrite. 0 for 115200, 1 for 921600
  }]
};
// set report behavior
DOWN.BEHAVIOR = {
  no: 0, // must be overwrite to target block no.
  type: 0x1e,
  data: [{
    'BYTE': 0 // must be overwrite. 0 for report when query, 1 for report when status changes, 2 for report periodically.
  }, {
    'long': 0 // must be overwrite. the report period,if not report periodically,set 0
  }]
};
// query for block status
DOWN.QUERY = {
  no: 0, // must be overwrite to target block no.
  type: 0x1f
};

// send FEEDBACKENABLE to block
DOWN.FEEDBACKENABLE = {
  no: 0, // must be overwrite to target block no.
  type: 0x61,
  subtype: 0x01,
  data: [{
    'BYTE': 0 // must be overwrite. 0 for disable, 1 for enable
  }]
};

// send handshake to block
DOWN.HANDSHAKE = {
  no: 0, // must be overwrite to target block no.
  type: 0x61,
  subtype: 0x03
};

// send rgb to block
DOWN.RGB = {
  no: 0, // must be overwrite to target block no.
  type: 0x61,
  subtype: 0x02,
  data: [{
    'SHORT': 0 // R, must be overwrite.
  }, {
    'SHORT': 0 // G, must be overwrite.
  }, {
    'SHORT': 0 // B, must be overwrite.
  }]
};

// get block version
DOWN.GETVERSION = {
  no: 0, // must be overwrite to target block no.
  type: 0x12
};

DOWN.UPDATEBLOCK = {
  no: 0, // must be overwrite to target block no.
  type: 0x61,
  subtype: 0x05,
  data: [{
    'BYTE': 0 // type, must be overwrite
  }, {
    'BYTE': 0 // subtype, must be overwrite
  }]
};

DOWN.QUERYBLOCKID = {
  no: 0,
  type: 0x61,
  subtype: 0x06
};

DOWN.SENDFIRMWAREFILEINFO = {
  no: 0,  // must be overwrite to target block no.
  type: 0x61,
  subtype: 0x07,
  data: [{
    'SHORT': 0x00
  }, {
    'long': 0x00
  }, {
    'long': 0x00
  }]
};

DOWN.SENDFIRMWAREFILEDATA = {
  no: 0xff,
  type: 0x61,
  subtype: 0x07,
  data: [{
    'SHORT': 0x00
  }, {
    'SHORT': 0x80
  }]
};

DOWN.QUERYUPDATERESULT = {
  no: 0,
  type: 0x61,
  subtype: 0x08
};

exports.UP = UP;
exports.UPDATE = UPDATE;
exports.DOWN = DOWN;
