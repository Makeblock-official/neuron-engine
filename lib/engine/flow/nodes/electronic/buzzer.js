var electronicblock = require('../../electronicblock');

var node = {
  name: 'BUZZER',
  conf: {},
  props: {
    'category': 'electronic',
    'in': ['frequence', 'volume'],
    'out': []
  },
  run: function() {
    electronicblock.sendBlockCommand('BUZZER','DISPLAY',[this.in('frequence'), this.in('volume')],this.idx);
  },
  init: function() {

  }
};

module.exports = node;
