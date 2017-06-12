var electronicblock = require('../../electronicblock');
var node = {
  name: 'LIGHT_CHAIN',
  conf: {},
  props: {
    'category': 'electronic',
    'inPutType': 'object',
    'in': ['pattern'],
    'out': []
  },
  run: function() {
    var that = this;
    var pattern = that.in('pattern');
    var out = [];
    var mode,speed;
    if ((pattern !==null) && (typeof(pattern) === 'object'))
    {
      if ('mode' in pattern){
        var playMode  = {'static': 0,'roll': 1,'repeat': 2,'marquee': 3};
        out.push(playMode[pattern.mode]);
        if ('speed' in pattern){
          var playSpeed = {'slow':0,'middle':1,'fast':2};
          out.push(playSpeed[pattern.speed]);
          if ('colors' in pattern){
            if (pattern.colors instanceof Array){
              out.push(pattern.colors.length);
              for (var i = 0; i < pattern.colors.length; i++){
                out.push(pattern.colors[i]);
              }
              electronicblock.sendBlockCommand('LIGHT_CHAIN','DISPLAY_PATTERN',out,that.idx);
            }
          }
        }
      }
    }
  },
  init: function() {

  }
};

module.exports = node;
