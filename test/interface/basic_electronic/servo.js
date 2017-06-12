var expect = require('chai').expect;
var sinon = require("sinon");
var electronicblock = require('../../../lib/engine/flow/electronicblock');
var assert = require('assert');
var engine = "";

var datadriven_number = [
  {'angle' : -10, 'result' : [ 0 ]},
  {'angle' : 0, 'result' : [ 0 ]},
  {'angle' : 10, 'result' : [ 10 ]},
  {'angle' : 180, 'result' : [ 180 ]},
  {'angle' : 190, 'result' : [ 180 ]}
]

var datadriven_boolean = [
  {'state' : true, 'result' : [ 100 ]},
  {'state' : false, 'result' : [ 0 ]}
]

describe('SERVO node', function(){
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
  	it('servo_004 set servo angle with number', function(){
  	  var servo_node_id = engine.addNode('SERVO');
  	  var number_node_id = engine.addNode('NUMBER');
  	  engine.connect(number_node_id, 'number', servo_node_id, 'angle');
  	  sinon.spy(electronicblock, 'sendBlockCommand');
  	  engine.configNode(number_node_id, {'number' : data.angle});
  	  
      console.log(electronicblock.sendBlockCommand.getCall(0).args[0]);
      console.log(electronicblock.sendBlockCommand.getCall(0).args[1]);
      console.log(electronicblock.sendBlockCommand.getCall(0).args[2]);

      expect(electronicblock.sendBlockCommand.getCall(0).args[0]).to.be.eql('SERVO');
      expect(electronicblock.sendBlockCommand.getCall(0).args[1]).to.be.eql('SET_ANGLE');
      expect(electronicblock.sendBlockCommand.getCall(0).args[2]).to.be.eql(data.result);
      electronicblock.sendBlockCommand.restore();
  	});
  });

  datadriven_boolean.forEach(function(data){
    it('servo_005 use boolean input to control servo', function(){
      var servo_node_id = engine.addNode('SERVO');
      var controlbutton_node_id = engine.addNode('CONTROLBUTTON');
  	  engine.connect(controlbutton_node_id, 'state', servo_node_id, 'angle');
  	  sinon.spy(electronicblock, 'sendBlockCommand');
  	  engine.configNode(controlbutton_node_id, {'state' : data.state});
  	  console.log(electronicblock.sendBlockCommand.getCall(0));
      console.log(electronicblock.sendBlockCommand.getCall(0).args[0]);
      console.log(electronicblock.sendBlockCommand.getCall(0).args[1]);
      console.log(electronicblock.sendBlockCommand.getCall(0).args[2]);

      expect(electronicblock.sendBlockCommand.getCall(0).args[0]).to.be.eql('SERVO');
      expect(electronicblock.sendBlockCommand.getCall(0).args[1]).to.be.eql('SET_ANGLE');
      expect(electronicblock.sendBlockCommand.getCall(0).args[2]).to.be.eql(data.result);
      electronicblock.sendBlockCommand.restore();
    });
  });

});