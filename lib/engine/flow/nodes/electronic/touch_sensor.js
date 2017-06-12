var node = {
  name: 'TOUCH_SENSOR',
  conf: {},
  props: {
    'category': 'electronic',
    'in': [],
    'out': ['touch']
  },
  run: function() {

  },
  processStatus: function(value) {
    var that = this;
    if ('touch' in value){
      that.out('touch', (Number(value.touch[0]) * 100));
    }
  },
  init: function() {

  }
};

module.exports = node;
