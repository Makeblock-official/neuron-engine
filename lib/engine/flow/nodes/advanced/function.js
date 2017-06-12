var node = {
  name: 'FUNCTION',
  conf: {func: null},
  props: {
    'category': 'advanced',
    'in': ['a'],
    'out': ['b'],
    'configs':{
       func: { 
        type: 'options',
        options: ['square','sqrt','abs','-','ln','log10','e^','10^','sin','cos','tan','asin','acos','atan'],
        defaultValue: 'square'
      }
    }    
  },
  run: function() {
    var result;
    var a = Number(this.in('a'));
    var mathFunction = this.conf.func;
    switch (mathFunction) {
      case 'square':
        result = a * a;
        break;
      case 'sqrt':
        result = Math.sqrt(a);
        break;
      case 'abs':
        result = Math.abs(a);
        break;
      case '-':
        result = -a;
        break;
      case 'ln':
        if (a <= 0){
          this.out('b', Number.NaN);
          return;
         }        
        result = Math.log(a);
        break;
      case 'log10':
        if (a <= 0){
          this.out('b', Number.NaN);
          return;
         }
        result = Math.log(a)/Math.LN10;
        break;
      case 'e^':
        result = Math.pow(Math.E, a);
        break;
      case '10^':
        result = Math.pow(10, a);
        break;
      case 'sin':
        result = Math.sin(a);
        break;
      case 'cos':
        result = Math.cos(a);
        break;
      case 'tan':
        result = Math.tan(a);
        break;
      case 'asin':
        result = Math.asin(a);
        break;
      case 'acos':
        result = Math.acos(a);
        break;
      case 'atan':
        result = Math.atan(a);
        break;
      default: 
        return;     
    }
    this.out('b', result);
  },
  config: function(){
    this.run();
  },   
  getInputPort: function(){
    return 'a';
  },   
  init: function() {

  }
};

module.exports = node;

