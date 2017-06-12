var node = {
  name: 'IF',
  conf: {truevalue: null, falsevalue: null},
  props: {
    'category': 'logic',
    'in': ['test', 'truevalue', 'falsevalue'],
    'out': ['result'],
    'configs':{
       truevalue: { type: 'number', defaultValue: 100},
       falsevalue: { type: 'number', defaultValue: 0},
    }    
  },
  run: function() {
    var that = this;
    var result;
    var inLinks;
    var needRun = false;

    var test = Number(that.in('test'));
    if (test > 0){
      inLinks = that.inNodes.truevalue;
      if (inLinks.length > 0){
        result = that.in('truevalue');
      } else{
        result = that.conf.truevalue;
        that.updateInput('truevalue', result, needRun);
      }    
    } else {
      inLinks = that.inNodes.falsevalue;
      if (inLinks.length > 0){
        result = that.in('falsevalue');
      } else{
        result = that.conf.falsevalue;
        that.updateInput('falsevalue', result, needRun);
      } 
    }

    this.out('result', result);
  },
  init: function() {

  }
};

module.exports = node;

