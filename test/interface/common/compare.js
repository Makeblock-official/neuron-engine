var expect = require('chai').expect;
var sinon = require("sinon");
var engine = "";

var number_datadriven = [
  {'number1' : 5, 'operator' : '>', 'config_number' : 5, 'result' : false, 'portName' : 'result'},
  {'number1' : 5, 'operator' : '>', 'config_number' : -5, 'result' : true, 'portName' : 'result'},
  {'number1' : 5, 'operator' : '>=', 'config_number' : 5, 'result' : true, 'portName' : 'result'},
  {'number1' : 5, 'operator' : '>=', 'config_number' : -5, 'result' : true, 'portName' : 'result'},
  {'number1' : 5, 'operator' : '<', 'config_number' : 5, 'result' : false, 'portName' : 'result'},
  {'number1' : 5, 'operator' : '<', 'config_number' : -5, 'result' : false, 'portName' : 'result'},
  {'number1' : 5, 'operator' : '<=', 'config_number' : 5, 'result' : true, 'portName' : 'result'},
  {'number1' : 5, 'operator' : '<=', 'config_number' : -5, 'result' : false, 'portName' : 'result'},
  {'number1' : 5, 'operator' : '=', 'config_number' : 5, 'result' : true, 'portName' : 'result'},
  {'number1' : 5, 'operator' : '=', 'config_number' : -5, 'result' : false, 'portName' : 'result'},
  {'number1' : 5, 'operator' : '!=', 'config_number' : 5, 'result' : false, 'portName' : 'result'},
  {'number1' : 5, 'operator' : '!=', 'config_number' : -5, 'result' : true, 'portName' : 'result'}
]

var boolean_datadriven = [
  {'config_boolean' : 1, 'config_number' : 0, 'operator' : '>', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : 0, 'operator' : '>', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : 1, 'operator' : '>', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : 1, 'operator' : '>', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : 0, 'operator' : '>=', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : 0, 'operator' : '>=', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : 1, 'operator' : '>=', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : 1, 'operator' : '>=', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : 0, 'operator' : '<', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : 0, 'operator' : '<', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : 1, 'operator' : '<', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : 1, 'operator' : '<', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : 0, 'operator' : '<=', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : 0, 'operator' : '<=', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : 1, 'operator' : '<=', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : 1, 'operator' : '<=', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : 0, 'operator' : '=', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : 0, 'operator' : '=', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : 1, 'operator' : '=', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : 1, 'operator' : '=', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : 0, 'operator' : '!=', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : 0, 'operator' : '!=', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : 1, 'operator' : '!=', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : 1, 'operator' : '!=', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : 5, 'operator' : '<', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : 5, 'operator' : '<', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : 5, 'operator' : '<', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : 5, 'operator' : '<', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : 5, 'operator' : '<=', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : 5, 'operator' : '<=', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : 5, 'operator' : '<=', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : 5, 'operator' : '<=', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : 5, 'operator' : '>', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : 5, 'operator' : '>', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : 5, 'operator' : '>', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : 5, 'operator' : '>', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : 5, 'operator' : '>=', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : 5, 'operator' : '>=', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : 5, 'operator' : '>=', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : 5, 'operator' : '>=', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : 5, 'operator' : '=', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : 5, 'operator' : '=', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : 5, 'operator' : '=', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : 5, 'operator' : '=', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : 5, 'operator' : '!=', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : 5, 'operator' : '!=', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : 5, 'operator' : '!=', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : 5, 'operator' : '!=', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : -5, 'operator' : '<', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : -5, 'operator' : '<', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : -5, 'operator' : '<', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : -5, 'operator' : '<', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : -5, 'operator' : '<=', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : -5, 'operator' : '<=', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : -5, 'operator' : '<=', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : -5, 'operator' : '<=', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : -5, 'operator' : '>', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : -5, 'operator' : '>', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : -5, 'operator' : '>', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : -5, 'operator' : '>', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : -5, 'operator' : '>=', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : -5, 'operator' : '>=', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : -5, 'operator' : '>=', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : -5, 'operator' : '>=', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : -5, 'operator' : '=', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : -5, 'operator' : '=', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : -5, 'operator' : '=', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : -5, 'operator' : '=', 'result' : false, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : -5, 'operator' : '!=', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : -5, 'operator' : '!=', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 1, 'config_number' : -5, 'operator' : '!=', 'result' : true, 'portName' : 'result'},
  {'config_boolean' : 0, 'config_number' : -5, 'operator' : '!=', 'result' : true, 'portName' : 'result'}
]

var object_datadriven = [
  {'config_number' : 0, 'operator' : '<', 'result' : false, 'portName' : 'result'},
  {'config_number' : 1, 'operator' : '<', 'result' : false, 'portName' : 'result'},
  {'config_number' : -1, 'operator' : '<', 'result' : false, 'portName' : 'result'},
  {'config_number' : 0, 'operator' : '<=', 'result' : false, 'portName' : 'result'},
  {'config_number' : 1, 'operator' : '<=', 'result' : false, 'portName' : 'result'},
  {'config_number' : -1, 'operator' : '<=', 'result' : false, 'portName' : 'result'},
  {'config_number' : 0, 'operator' : '>', 'result' : false, 'portName' : 'result'},
  {'config_number' : 1, 'operator' : '>', 'result' : false, 'portName' : 'result'},
  {'config_number' : -1, 'operator' : '>', 'result' : false, 'portName' : 'result'},
  {'config_number' : 0, 'operator' : '>=', 'result' : false, 'portName' : 'result'},
  {'config_number' : 1, 'operator' : '>=', 'result' : false, 'portName' : 'result'},
  {'config_number' : -1, 'operator' : '>=', 'result' : false, 'portName' : 'result'},
  {'config_number' : 0, 'operator' : '=', 'result' : false, 'portName' : 'result'},
  {'config_number' : 1, 'operator' : '=', 'result' : false, 'portName' : 'result'},
  {'config_number' : -1, 'operator' : '=', 'result' : false, 'portName' : 'result'},
  {'config_number' : 0, 'operator' : '!=', 'result' : true, 'portName' : 'result'},
  {'config_number' : 1, 'operator' : '!=', 'result' : true, 'portName' : 'result'},
  {'config_number' : -1, 'operator' : '!=', 'result' : true, 'portName' : 'result'}
]

var output_change_data = {
  'id' : null,
  'portName' : null,
  'value' : null
}

function nodeInputCallback(id, portName, value){

}


function nodeOutputCallBack(id, portName, value){
  output_change_data['id'] = id;
  output_change_data['portName'] = portName;
  output_change_data['value'] = value;
}

describe('COMPARE node', function(){
  before(function() {
    engine = require('../../../lib/engine/flow').create({"driver": "serial", "loglevel": "WARN"});
    engine.on('NodeInputChanged', nodeInputCallback);
    engine.on('NodeOutputChanged', nodeOutputCallBack);
  });

  after(function() {
    engine.removeListener('NodeInputChanged', nodeInputCallback);
    engine.removeListener('NodeOutputChanged', nodeOutputCallBack);
    engine.stop();
    engine = null;
  });

  afterEach(function(){
    nodes = engine.getActiveNodes();
    for(var i = 0; i < nodes.length; i++){
      engine.removeNode(nodes[i].id);
    }
    output_change_data['id'] = null;
  	output_change_data['portName'] = null;
  	output_change_data['value'] = null;
  });

  number_datadriven.forEach(function(data){
  	it('compare_003 : number compare with number', function(){
  	  // add compare node and number node
  	  var compare_node_id = engine.addNode("COMPARE");
  	  var number_node_id = engine.addNode("NUMBER");
  	  // connect number node with compare node
  	  engine.connect(number_node_id, 'number', compare_node_id, 'a');

  	  engine.configNode(number_node_id, {'number' : data.number1});
  	  engine.configNode(compare_node_id, {'b' : data.config_number});
  	  engine.configNode(compare_node_id, {'operation' : data.operator});

  	  console.log("expect result: " + JSON.stringify(data));
  	  console.log("output_change_data : " + JSON.stringify(output_change_data));
  	  expect(compare_node_id).to.be.eql(output_change_data.id);
      expect(data.portName).to.be.eql(output_change_data.portName);
      expect(data.result).to.be.eql(output_change_data.value);
  	});
  });


  boolean_datadriven.forEach(function(data){
  	it('compare_004 : boolean compare with number',  function(){
  	  var compare_node_id = engine.addNode('COMPARE');
  	  var slider_node_id = engine.addNode('SLIDER');
  	  engine.connect(slider_node_id, 'state', compare_node_id, 'a');

  	  engine.configNode(slider_node_id, {'state' : data.config_boolean});
  	  engine.configNode(compare_node_id, {'b' : data.config_number});
  	  engine.configNode(compare_node_id, {'operation' : data.operator});

  	  console.log("expect result: " + JSON.stringify(data));
  	  console.log("output_change_data : " + JSON.stringify(output_change_data));

      expect(compare_node_id).to.be.eql(output_change_data.id);
      expect(data.portName).to.be.eql(output_change_data.portName);
      expect(data.result).to.be.eql(output_change_data.value);
  	});
  });

  object_datadriven.forEach(function(data){
    it('compare_005 : object compare with number', function(){
      var compare_node_id = engine.addNode('COMPARE');
      var color_picker_node_id = engine.addNode('COLOR');
      engine.connect(color_picker_node_id, 'color', compare_node_id, 'a');
      engine.configNode(color_picker_node_id, {'color' : 2});
      engine.configNode(compare_node_id, {'b' : data.config_numbe});
      engine.configNode(compare_node_id, {'operation' : data.operator});

      console.log("expect result: " + JSON.stringify(data));
      console.log("output_change_data : " + JSON.stringify(output_change_data));

      expect(compare_node_id).to.be.eql(output_change_data.id);
      expect(data.portName).to.be.eql(output_change_data.portName);
      expect(data.result).to.be.eql(output_change_data.value);
    });
  });
  
  
});