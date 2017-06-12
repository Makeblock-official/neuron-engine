var node = {
  name: 'SWITCH',
  conf: {},
  props: {
    'category': 'electronic',
    'in': [],
    'out': ['switch']
  },
  run: function() {

  },
  processStatus: function(value) {
    var that = this;
    if ('switch' in value){
      that.out('switch', (Number(value.switch[0]) * 100));
    }
  },
  init: function() {

  }
};

module.exports = node;
