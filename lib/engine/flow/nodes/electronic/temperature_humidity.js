var node = {
  name: 'TEMPERATURE_HUMIDITY',
  conf: {},
  props: {
    'category': 'electronic',
    'in': [],
    'out': ['temperature', 'humidity']
  },
  run: function() {

  },
  processStatus: function(value) {
    var that = this;
    if ('temperature_humidity' in value){
      that.out('temperature', value.temperature_humidity[0]);
      that.out('humidity', value.temperature_humidity[1]);
    }
  },
  init: function() {

  }
};

module.exports = node;
