var electronicblock = require('../../electronicblock');

var node = {
  name: 'WIND_SPEED_SENSOR',
  conf: {},
  props: {
    'category': 'electronic',
    'in': [],
    'out': ['speed']
  },
  run: function() {
  },
  init: function() {

  }
};

module.exports = node;
