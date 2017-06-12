var node = {
  name: 'MERGETEXT',
  conf: {},
  props: {
    'category': 'OLED_DISPLAY',
    'assistanceNode': true,
    'in': ['A','B'],
    'out': ['text'] 
  },
  run: function() {
    var that = this;
    var a = that.inNodes.A.length===0?'':(that.in('A'));
    var b = that.inNodes.B.length===0?'':(that.in('B'));
    var textA,textB;
    if ((typeof a) === 'object' && (a !== null)){
      if (a.hasOwnProperty('text')){
        textA = a.text;
      } else {
        textA = JSON.stringify(a);
      }
    } else {
      textA = ((typeof a)==='string'?a: JSON.stringify(a));
    }
    if ((typeof b) === 'object' && (b !== null)){
      if (b.hasOwnProperty('text')){
        textB = b.text;
      } else {
        textB = JSON.stringify(b);
      }
    } else {
      textB = ((typeof b)==='string'?b: JSON.stringify(b));
    }    

    var text = textA + textB;
    var output  = {type: 'OLED_DISPLAY',text: text};
    that.out('text',output);
  },
  init: function() {

  }
};

module.exports = node;
