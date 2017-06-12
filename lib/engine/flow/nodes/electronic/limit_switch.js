var node = {
  name: 'LIMIT_SWITCH',
  conf: {},
  props: {
    'category': 'electronic',
    'in': [],
    'out': ['limit']
  },
  run: function() {

  },
  processStatus: function(value) {
    var that = this;
    if ('limit' in value){
      that.out('limit', (Number(value.limit[0]) * 100));
    }
  },
  init: function() {

  }
};

module.exports = node;
