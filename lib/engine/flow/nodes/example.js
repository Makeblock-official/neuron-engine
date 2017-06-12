module.exports = {
  conf: {},
  props: {
    'category': 'logic',
    'in': ['a', 'b'],
    'out': ['c'],
    'icon': 'example.svg'
  },
  run: function() {
    logger.debug(this.in('a') , this.in('b'));
    this.out('c', this.in('a') + this.in('b'));
  },
  init: function() {

  }
};