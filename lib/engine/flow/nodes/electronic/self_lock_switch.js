var electronicblock = require('../../electronicblock');

var node = {
  name: 'SELF_LOCK_SWITCH',
  conf: {},
  props: {
    'category': 'electronic',
    'in': [],
    'out': ['state']
  },
  run: function() {
  },
  processStatus: function(value) {
    var that = this;
    if ('state' in value){
      that.out('state', (Number(value.state[0]) * 100));
    }
  },
  init: function() {

  }
};

module.exports = node;
