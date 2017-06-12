var engine = require('../lib/engine/logic').create();

var COUNT = 10000;

var begin = new Date().getTime();

for (var i = 0; i < COUNT; i++) {
  engine.setBlockStatus('example', [2, 3, 456, 3.4]);
}

var end = new Date().getTime();

console.log('==========================================');
console.log('setBlockStatus speed:',  Math.ceil(1000 * COUNT/(end-begin)) + '/S');