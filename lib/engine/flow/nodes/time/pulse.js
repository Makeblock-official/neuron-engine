var logger = require('../../../../log/log4js').logger;
var node = {
  name: 'PULSE',
  conf: {func: null,wavelength: null,amplitude: null},
  props: {
    'category': 'time',
    'in': [],
    'out': ['output'],
    'configs':{
       func: { 
        type: 'options',
        options: ['sin','square','triangle'],
        defaultValue: 'sin'
      },
      wavelength: {type: 'number', defaultValue: 3},
      amplitude: {type: 'number', defaultValue: 255}
    }    
  },
  run: function() {
    var that = this;
    var result;
    var rate = 0.5;
    var wavelength = that.conf.wavelength;
    var amplitude = that.conf.amplitude; 
    var func = that.conf.func;
    var x;
    if (that.interval){
      clearInterval(that.interval);
      that.interval = null;
    }
    if (wavelength <= 0){
      that.out('output',  0);
      return;
    }    
    switch (func) {
      case 'sin':
        x = 0;
        that.interval = setInterval(sin,rate*1000);
        break;
      case 'square':
        x = 0;
        that.interval = setInterval(square,rate*1000);   
        break;
      case 'triangle':
        x = 0;
        that.interval = setInterval(triangle,rate*1000);
        break;
      default: 
        return;     
    }
    function sin (){
      var radian = getRadian();
      result = Number(amplitude * Math.sin(radian));
      that.out('output', result);
      x++;
    }
    function square (){
      var radian = getRadian();
      result = Number(amplitude * Math.sin(radian));
      if (result > 0){
        result = amplitude;
      } else {
        result = -amplitude;
      }
      that.out('output', result);
      x++;    
    }
    function triangle (){
      var radian = getRadian();
      var k = 2 * amplitude / Math.PI;
      if ((radian >= 0) && (radian < (Math.PI/2))){
        result = k * radian; 
      } else if ((radian >= (Math.PI/2)) && (radian < (Math.PI * 1.5))){
        result = (-k) * radian + (2 * amplitude);
      } else if ((radian >= (Math.PI * 1.5)) && (radian <= (Math.PI * 2))){
        result = k * radian - (4 * amplitude);
      }
      that.out('output', result);
      x++;
    }
    function getRadian (){
      var angle;
      switch (func) {
        case 'sin':
          angle = (2 * Math.PI  * x) / (0.1375 * wavelength);
          break;
        case 'square':
          angle = (2 * Math.PI  * x * 12) / wavelength; 
          break;
        case 'triangle':
          angle = (2 * Math.PI  * x * 10) / wavelength;
          break;
        default: 
          return;     
      }
      angle = angle % 360;
      var radian = 2 * Math.PI * angle / 360;
      return radian;
    }
  },
  config: function(){
    this.run();
  },
  stop: function(){
    var that = this;
    if (that.interval){
      clearInterval(that.interval);
    }
  },
  init: function() {
     this.interval = null;
  }
};

module.exports = node;

