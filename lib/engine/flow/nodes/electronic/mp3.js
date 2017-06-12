var electronicblock = require('../../electronicblock');

var node = {
  name: 'MP3',
  conf: {loop: null,lastPlayPause:null,lastPrev:null,lastNext:null,lastNumber:null,lastNLoop:null},
  props: {
    'category': 'electronic',
    'in': ['play/pause','prev','next','playSong#'],
    'out': [],
    'configs':{loop: {type: 'options', options: ['none','one','all','random'],defaultValue: 'none'}}
  },
  run: function() {
    var that = this;
    var playPause = that.in('play/pause');
    var prev = that.in('prev');
    var next = that.in('next');
    var number = that.in('playSong#');
    var loop = that.conf.loop;
    if ((playPause > 0) && (that.conf.lastPlayPause <= 0)){
      electronicblock.sendBlockCommand('MP3','PLAY_PAUSE',[],that.idx);
    }
    if ((prev > 0) && (that.conf.lastPrev <= 0)){
      electronicblock.sendBlockCommand('MP3','PLAY_PREVIOUS',[],that.idx);
    }
    if ((next > 0) && (that.conf.lastNext <= 0)){
      electronicblock.sendBlockCommand('MP3','PLAY_NEXT',[],that.idx);
    }
    if (number !== that.conf.lastNumber){
      electronicblock.sendBlockCommand('MP3','PLAY',[number],that.idx);
    }
    if (loop !== that.conf.lastNLoop){
      var mode = {'none': 0, 'one': 1,'all': 2, 'random': 3};
      if (loop in mode){
        electronicblock.sendBlockCommand('MP3','PLAY_MODE',[mode[loop]],that.idx);
      }
    }
    that.conf.lastPlayPause = playPause;
    that.conf.lastPrev = prev;
    that.conf.lastNext = next;
    that.conf.lastNumber = number;
    that.conf.lastNLoop = loop;
  },
  init: function() {

  }
};

module.exports = node;
