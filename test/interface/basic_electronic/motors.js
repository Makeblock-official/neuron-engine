var expect = require('chai').expect;
var sinon = require("sinon");
var electronicblock = require('../../../lib/engine/flow/electronicblock');
var assert = require('assert');
var engine = "";

var datadriven_number = [
  {'speed' : 0, 'result' : [0, 0]},
  {'speed' : -100, 'result' : [-100, -100]},
  {'speed' : -99, 'result' : [-99, -99]},
  {'speed' : -101, 'result' : [-100, -100]},
  {'speed' : 100, 'result' : [100, 100]},
  {'speed' : 99, 'result' : [99, 99]},
  {'speed' : 101, 'result' : [100, 100]}
]

var datadriven_motor_speed = [
  {'left' : -100, 'right' : 100, 'speed' : [-100, 100]},
  {'left' : -99, 'right' : 99, 'speed' : [-99, 99]},
  {'left' : -101, 'right' : 101, 'speed' : [-100, 100]},
  {'left' : 101, 'right' : -101, 'speed' : [100, -100]}
]

describe('MOTORS node', function(){
  before(function() {
    engine = require('../../../lib/engine/flow').create({"driver": "serial", "loglevel": "WARN"});
    
  });

  after(function() {
    engine.stop();
    engine = "";
  });

  afterEach(function(){
    nodes = engine.getActiveNodes();
    for(var i = 0; i < nodes.length; i++){
      engine.removeNode(nodes[i].id);
    }
    try{
      electronicblock.sendBlockCommand.restore();
    }catch(e){

    }
    try{
      clock.restore();
    }catch(e){

    }
  });

  datadriven_number.forEach(function(data){
  	it('motors_006 set motors speed with number', function(){
  	  var motors_node_id = engine.addNode('MOTORS');
  	  var number_node_id = engine.addNode('NUMBER');
  	  engine.connect(number_node_id, 'number', motors_node_id, 'speed');
  	  sinon.spy(electronicblock, 'sendBlockCommand');
  	  engine.configNode(number_node_id, {'number' : data.speed});
  	  
      expect(electronicblock.sendBlockCommand.getCall(0).args[0]).to.be.eql('MOTORS');
      expect(electronicblock.sendBlockCommand.getCall(0).args[1]).to.be.eql('SET_SPEED');
      expect(electronicblock.sendBlockCommand.getCall(0).args[2]).to.be.eql(data.result);
      console.log(electronicblock.sendBlockCommand.getCall(0).args[0]);
      console.log(electronicblock.sendBlockCommand.getCall(0).args[1]);
      console.log(electronicblock.sendBlockCommand.getCall(0).args[2]);
      electronicblock.sendBlockCommand.restore();
  	});
  });

  datadriven_motor_speed.forEach(function(data){
  	it('motors_007 set motors speed with motor_speed node', function(){
  	  var clock = sinon.useFakeTimers();
  	  var motors_node_id = engine.addNode('MOTORS');
  	  var motors_speed_node_id = engine.addNode('MOTORSPEED');
  	  var number_left_node_id = engine.addNode('NUMBER');
  	  clock.tick(100);
  	  var number_right_node_id = engine.addNode('NUMBER');
  	  clock.tick(100);
  	  engine.connect(number_left_node_id, 'number', motors_speed_node_id, 'port1');
  	  engine.connect(number_right_node_id, 'number', motors_speed_node_id, 'port2');
  	  engine.connect(motors_speed_node_id, 'speed', motors_node_id, 'speed');
  	  sinon.spy(electronicblock, 'sendBlockCommand');
  	  engine.configNode(number_left_node_id, {'number' : data.left});
  	  engine.configNode(number_right_node_id, {'number' : data.right});
      console.log(electronicblock.sendBlockCommand.getCall(0).args[0]);
      console.log(electronicblock.sendBlockCommand.getCall(0).args[1]);
      console.log(electronicblock.sendBlockCommand.getCall(0).args[2]);
      electronicblock.sendBlockCommand.restore();
  	});
  });
});