var Node = require('./node');

var curNodeId = 0;

exports.create = function(name,option) {
  someNode = new Node(curNodeId++, option);
  return someNode;
};
