var algorithm = require('../algorithm');
//var COLORMAP = {0:{},1:{R:0xd5, B:0x22},2:{R:0xf8,G:0xa4,B:0x43},3:{R:0xf8,G:0xe6,B:0x53},4:{R:0x77,G:0xd2,B:0x4b},5:{R:0x3c,G:0xe3,B:0xc4},6:{R:0x35,G:0x61,B:0x9d},7:{R:0x93,G:0x25,B:0xf3}};
var COLORMAP = {0:{R:0x64,G:0x64,B:0x64},1:{R:0x64},2:{R:0x64,G:0x34},3:{R:0x64,G:0x64},4:{G:0x64},5:{G:0x64,B:0x64},6:{B:0x64},7:{R:0xac,B:0xac}};
var COLORS = {0:{R:0xff,G:0xff,B:0xff},1:{R:0xff},2:{R:0xff,G:0x80},3:{R:0xff,G:0xff},4:{G:0xff},5:{G:0xff,B:0xff},6:{B:0xff},7:{R:0xff,B:0xff}};
var MIN = 0;
var MAX = 255;
var MAXIN = 100;

var node = {
  name: 'COLOR',
  methods: {report: null},
  conf: {color: null, lastColor: null, lastSend: null},
  props: {
    'category': 'LED',
    'assistanceNode': true,
    'inputCombine':  true,
    'in': ['send'],
    'out': ['color'],
    'configs':{
      color: { type: 'color',defaultValue: 1}
    }
  },
  run: function() {
    var that = this;
    var colorid = that.conf.color;
    var inLinks = that.inNodes.send;
    var color = { type: '',data:{}};
    if (colorid in COLORMAP){
      color.type = 'LED';
      color.data = COLORMAP[colorid];
      if (inLinks.length === 0){
       that.out('color', color);
      } else {
         var send = that.combineInput('send','COLOR');
         that.updateValidValue('send',send);
         var datatype = (typeof send);
         switch (datatype){
           case 'number':
             send = algorithm.threaholdNumber(send,MIN,MAX);
             color.data = COLORS[colorid];
             color.data = algorithm.combineBrightness(send,color.data );
             that.out('color', color);
             break;
           case 'boolean':
             if (send === true){
                that.out('color', color);
             } else {
                 that.out('color', false);
             }
             break;
         }
        that.conf.lastSend = send;
     }
   }
  },
  config: function(){
    this.run();
  },    
  init: function() {

  }
};

module.exports = node;
