var node = {
  name: 'VIRTUAL_COLOUR_LED',
  conf: {R: null, G: null, B: null},
  props: {
    'category': 'virtual',
    'in': ['R','G','B'],
    'out': [],
    'configs':{ 
      R: { type: 'number', defaultValue: 0},
      G: { type: 'number', defaultValue: 0},
      B: { type: 'number', defaultValue: 0}
    }
  },
  run: function() {
  
  },
  init: function() {

  }
};

module.exports = node;
