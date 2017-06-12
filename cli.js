var blessed = require('blessed');
var fs = require('fs');
var Log = require('log');

var log = new Log('debug', fs.createWriteStream('cli.log'));

var engine = require('./lib/engine/logic').create({"driver": "serial", "loglevel": "WARN","serverIP": "192.168.100.1"});

var blocksTableColumns = ['{bold}Name{/bold}', '{bold}Values{/bold}', '{bold}Index{/bold}'];

// Create a screen object.
var screen = blessed.screen({
  smartCSR: true,
  title: 'neuron cloud block'
});

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'C-c'], function(ch, key) {
  return process.exit(0);
});

// Create a box perfectly centered horizontally and vertically.
var blocksTable = blessed.listtable({
  parent: screen,
  shadow: true,
  top: 0,
  left: 0,
  width: '50%',
  height: '60%',
  rows: [blocksTableColumns],
  border: 'line',
  tags: true,
  style: {
    header: {
      bg: 'white',
      fg: 'black'
    }
  },
  label: 'blocks'
});

// Create a box perfectly centered horizontally and vertically.
var consoleBox = blessed.log({
  parent: screen,
  shadow: true,
  top: 0,
  right: 0,
  width: '50%',
  height: '60%',
  border: 'line',
  tags: true,
  label: 'console'
});

var codeBox = blessed.textarea({
  parent: screen,
  shadow: true,
  height: '40%',
  width: '100%',
  top: '60%',
  border: 'line',
  left: 0,
  tags: true,
  label: 'code'
});

codeBox.key('C-r', function() {
  var code = codeBox.getValue();
  consoleBox.add('{white-fg}' + code + '{/white-fg}');
  try {
    eval(code);
  } catch (err) {
    consoleBox.add('{red-fg}' + err + '{/red-fg}');
  }
  codeBox.clearValue();
});

console.info = function() {
  //consoleBox.add('{green-fg}' + Array.prototype.join.call(arguments, ' ') + '{/green-fg}');
  log.info(Array.prototype.join.call(arguments, ' '));
};

console.log = function() {
  //consoleBox.add('{white-fg}' + Array.prototype.join.call(arguments, ' ') + '{/white-fg}');
  log.debug(Array.prototype.join.call(arguments, ' '));
};

console.warn = function() {
  consoleBox.add('{red-fg}' + Array.prototype.join.call(arguments, ' ') + '{/red-fg}');
};

var COLORS = ['red', 'green', 'blue', 'white', 'yellow'];
setInterval(function() {
  var blocks = engine.getActiveBlocks();
  var rows = [blocksTableColumns, ['<----->', '<----->', '<----->']];
  var colorIdx = 0;
  var i=0;
  var color=null;
  for (var name in blocks) {
    for (i = 0; i < blocks[name].length; i++) {
      color = COLORS[(colorIdx++) % COLORS.length];
      rows.push(['{' + color + '-fg}{bold}' + name + '{/bold}{/' + color + '-fg}',
        '{' + color + '-fg}{bold}' + JSON.stringify(blocks[name][i]) + '{/bold}{/' + color + '-fg}',
        '{' + color + '-fg}{bold}' + i + '{/bold}{/' + color + '-fg}'
      ]);
    }
  }

  blocksTable.setRows(rows);
}, 100);

// Focus our element.
codeBox.focus();

// Render the screen.
screen.render();

codeBox.readInput(function() {});
