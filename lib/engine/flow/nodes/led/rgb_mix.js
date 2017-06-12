var core = require('../../core');
var node = {
  name: 'RGBMIX',
  conf: {},
  props: {
    'category': 'LED',
    'assistanceNode': true,
    'outPutType': 'object',
    'in': ['R','G','B'],
    'out': ['color']
  },
  run: function() {
    var that = this;
    var r = Number(that.inNodes.R.length===0?0:(that.in('R')));
    var g = Number(that.inNodes.G.length===0?0:(that.in('G')));
    var b = Number(that.inNodes.B.length===0?0:(that.in('B')));
    var color = { type: 'LED',data:{R:r,G:g,B:b}};
    that.out('color', color);
  },
  initNode: function(){
    var that = this;
    var r = Number(that.inNodes.R.length===0?0:(that.in('R')));
    var g = Number(that.inNodes.G.length===0?0:(that.in('G')));
    var b = Number(that.inNodes.B.length===0?0:(that.in('B')));    
    var color = { type: 'LED',data:{R:r,G:g,B:b}};
    that.out('color', color);    
    core.onNodeInputChanged(that.id, 'R', r);
    core.onNodeInputChanged(that.id, 'G', g);
    core.onNodeInputChanged(that.id, 'B', b);
  },
  init: function() {
  }
};

module.exports = node;
