var expect = require('chai').expect;
var sinon = require("sinon");
var engine = "";
var cb_in_node_id = "";
var cb_in_name = "";
var cb_in_value = 0;
var cb_out_node_id = "";
var cb_out_name = "";
var cb_out_value = 0;

var boolean_datadriven = [
  {'number1' : 0, 'number2' : 0, 'result' : true, 'portName' : 'result' },   // true true => true
  {'number1' : -1, 'number2' : 20, 'result' : false, 'portName' : 'result'},   // true false => false
  {'number1' : 8, 'number2' : 0, 'result' : false, 'portName' : 'result'},   // false true => false
  {'number1' : 9, 'number2' : 1, 'result' : false, 'portName' : 'result'}   // false false => false
];

var number_datadriven = [
  {'number1' : 0, 'number2' : 0, 'result' : false, 'portName' : 'result' },   // false false => false
  {'number1' : -1, 'number2' : 20, 'result' : false, 'portName' : 'result'},   // false true => false
  {'number1' : 8, 'number2' : 0, 'result' : false, 'portName' : 'result'},   // true false => false
  {'number1' : 9, 'number2' : 1, 'result' : true, 'portName' : 'result'}   // true true => true
];

// NOTES: data range will effect the final result.
// because when input port is not changed, it will not excute computing!
var multiple_datadriven = [
  {'number1' : 0, 'number2' : 0, 'result' : false, 'portName' : 'result' },   // negtive true => false
  {'number1' : 8, 'number2' : 7, 'result' : false, 'portName' : 'result'},   // positive false => false
  {'number1' : 3, 'number2' : -9, 'result' : true, 'portName' : 'result'},   // positive true => true
  {'number1' : -6, 'number2' : 1, 'result' : false, 'portName' : 'result'}   // negtive false => false
];

function nodeInputCallback(id, portName, value){
  cb_in_node_id = id;
  cb_in_name = portName;
  cb_in_value = value;
}


function nodeOutputCallBack(id, portName, value){
  cb_out_node_id = id;
  cb_out_name = portName;
  cb_out_value = value;
}

describe('AND node', function(){
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
  });
  

  boolean_datadriven.forEach(function(data){
    it('and_003 : boolean inputs computing with and', function(){
      var clock = sinon.useFakeTimers();
      and_node_id = engine.addNode("AND");
      clock.tick(500);
      not1_node_id = engine.addNode("NOT");
      clock.tick(500);
      not2_node_id = engine.addNode("NOT");
      clock.tick(500);
      number1_node_id = engine.addNode("NUMBER");
      clock.tick(500);
      number2_node_id = engine.addNode("NUMBER");

      engine.connect(number1_node_id, 'number', not1_node_id, 'a');
      clock.tick(10);
      engine.connect(number2_node_id, 'number', not2_node_id, 'a');
      clock.tick(10);
      engine.connect(not1_node_id, 'c', and_node_id, 'a');
      clock.tick(10);
      engine.connect(not2_node_id, 'c', and_node_id, 'a');

      engine.configNode(number1_node_id,{'number' : data.number1});
      clock.tick(10);
      engine.configNode(number2_node_id,{'number' : data.number2});
      clock.tick(10);
      expect(cb_out_value).to.be.eql(data.result);
      expect(cb_out_node_id).to.be.eql(and_node_id);
      expect(cb_out_name).to.be.eql(data.portName);
      clock.restore();

    });
  });

  number_datadriven.forEach(function(data){
    it('and_004 : number inputs computing with and', function(){
      var clock = sinon.useFakeTimers();
      and_node_id = engine.addNode("AND");
      clock.tick(500);
      number1_node_id = engine.addNode("NUMBER");
      engine.configNode(number1_node_id,{'number' : 0});
      clock.tick(500);
      number2_node_id = engine.addNode("NUMBER");
      engine.configNode(number2_node_id,{'number' : 0});

      engine.connect(number1_node_id, 'number', and_node_id, 'a');
      clock.tick(10);
      engine.connect(number2_node_id, 'number', and_node_id, 'a');
      engine.configNode(number1_node_id,{'number' : data.number1});
      clock.tick(10);
      engine.configNode(number2_node_id,{'number' : data.number2});
      clock.tick(10);
      expect(cb_out_value).to.be.eql(data.result);
      expect(cb_out_node_id).to.be.eql(and_node_id);
      expect(cb_out_name).to.be.eql(data.portName);
      clock.restore();
    });
  });


  multiple_datadriven.forEach(function(data){
    it('and_005 1: multiple inputs computing with and', function(){
      var clock = sinon.useFakeTimers();
      and_node_id = engine.addNode("AND");
      clock.tick(500);
      number1_node_id = engine.addNode("NUMBER");
      engine.configNode(number1_node_id,{'number' : 0});
      clock.tick(500);
      number2_node_id = engine.addNode("NUMBER");
      engine.configNode(number2_node_id,{'number' : 0});
      clock.tick(500);
      not2_node_id = engine.addNode("NOT");
      clock.tick(500);
      led_color_picker = engine.addNode("COLOR");
      engine.configNode(led_color_picker,{'color' : 0});

      engine.connect(number1_node_id, 'number', and_node_id, 'a');
      clock.tick(10);
      engine.connect(number2_node_id, 'number', not2_node_id, 'a');
      clock.tick(10);
      engine.connect(not2_node_id, 'c', and_node_id, 'a');
      clock.tick(10);
      engine.connect(led_color_picker, 'color', and_node_id, 'a');

      engine.configNode(number2_node_id,{'number' : data.number2});
      clock.tick(500);
      engine.configNode(number1_node_id,{'number' : data.number1});
      clock.tick(500);
      var json = {'cb_out_node_id' :  cb_out_node_id, 'cb_out_name' : cb_out_name, 'cb_out_value' : cb_out_value};
      expect(cb_out_value).to.be.eql(data.result);
      expect(cb_out_node_id).to.be.eql(and_node_id);
      expect(cb_out_name).to.be.eql(data.portName);
    });
  });

  multiple_datadriven.forEach(function(data){
    it('and_005 2: multiple inputs computing with and', function(){
      
      var clock = sinon.useFakeTimers();
      and_node_id = engine.addNode("AND");
      clock.tick(500);
      number1_node_id = engine.addNode("NUMBER");
      engine.configNode(number1_node_id,{'number' : 0});
      clock.tick(500);
      number2_node_id = engine.addNode("NUMBER");
      engine.configNode(number2_node_id,{'number' : 0});
      clock.tick(500);
      not2_node_id = engine.addNode("NOT");
      clock.tick(500);
      led_color_picker = engine.addNode("COLOR");
      engine.configNode(led_color_picker,{'color' : 0});

      engine.connect(number1_node_id, 'number', and_node_id, 'a');
      clock.tick(10);
      engine.connect(number2_node_id, 'number', not2_node_id, 'a');
      clock.tick(10);
      engine.connect(not2_node_id, 'c', and_node_id, 'a');
      clock.tick(10);
      engine.connect(led_color_picker, 'color', and_node_id, 'a');

      engine.configNode(number1_node_id,{'number' : data.number1});
      clock.tick(500);
      engine.configNode(number2_node_id,{'number' : data.number2});
      clock.tick(500);
      var json = {'cb_out_node_id' :  cb_out_node_id, 'cb_out_name' : cb_out_name, 'cb_out_value' : cb_out_value};
      expect(cb_out_value).to.be.eql(data.result);
      expect(cb_out_node_id).to.be.eql(and_node_id);
      expect(cb_out_name).to.be.eql(data.portName);
      clock.restore();
    });
  });
});