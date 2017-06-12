var node = require('../../node');
var _activeNodeCache = node.getActiveNodeCache();
var algorithm = require('../algorithm');

var node = {
  name: 'COLORCHECK',
  conf: {sampleColor: null, tolerance: null},
  props: {
    'category': 'COLORSENSOR',
    'assistanceNode': true,
    'in': ['color'],
    'out': ['result'],
    'configs':{
      sampleColor: {type: 'hidden',defaultValue: null},
      tolerance: { type: 'hidden',defaultValue: 20}
    }
  },
  run: function() {
    var that = this;
    var sampleColor = that.conf.sampleColor;
    var tolerance = that.conf.tolerance;
    var color = that.in('color');
    if ((typeof(sampleColor) === 'object') && (sampleColor !== null)){
      if ((typeof(color) === 'object') && (color !== null)){
        var R = color.hasOwnProperty('R')?color.R:null;
        var G = color.hasOwnProperty('G')?color.G:null;
        var B = color.hasOwnProperty('B')?color.B:null;
        var r_tolerance = Math.abs(R - sampleColor.R);
        var g_tolerance = Math.abs(G - sampleColor.G);
        var b_tolerance = Math.abs(B - sampleColor.B);
        if ((r_tolerance <= tolerance) && (g_tolerance <= tolerance) && (b_tolerance <= tolerance)){
          that.out('result', true);
        } else {
          that.out('result', false);
        }
      }
    }
  },
  config: function(){
    this.run();
  },    
  init: function() {
    var that = this;
    var inLinks = that.inNodes.color;
    if ((inLinks.length === 0) && (that.props.configs.sampleColor.defaultValue === null)){
      var id = 'COLORSENSOR@1';
      if (id in _activeNodeCache){
        that.validValue.color = _activeNodeCache[id].outValues.color;
      }
    } 
  }
};

module.exports = node;
