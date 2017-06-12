var node = {
  name: 'JOYSTICK',
  conf: {},
  props: {
    'category': 'electronic',
    'in': [],
    'out': ['X', 'Y']
  },
  run: function() {

  },
  processStatus: function(value) {
    var that = this;
    if ('state' in value){
      that.out('X', value.state[0]);
      that.out('Y', value.state[1]);
    }
  },
  init: function() {

  }
};

module.exports = node;
