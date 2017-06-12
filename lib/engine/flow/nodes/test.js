var nodes = require('./index');

var testNode1 = nodes.create('temperature_humidity');
var testNode2 = nodes.create('dc_motor');

testNode1.connect('temperature', testNode2, 'motor1');
testNode1.connect('humidity', testNode2, 'motor2');

testNode1.startSession();
logger.warn('set humidity 40');
testNode1.out('humidity',40);
testNode1.startSession();
logger.warn('set temperature 20');
testNode1.out('temperature',20);
logger.warn('done');

