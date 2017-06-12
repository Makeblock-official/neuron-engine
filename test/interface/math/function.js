var expect = require('chai').expect;
var sinon = require("sinon");
var engine = "";
var cb_in_node_id = "";
var cb_in_name = "";
var cb_in_value = 0;
var cb_out_node_id = "";
var cb_out_name = "";
var cb_out_value = 0;

var function_config = {
  config_name : 'func',
  default_value : 'square',
  type : 'options',
  options : ['square','sqrt','abs','-','ln','log10','e^','10^','sin','cos','tan','asin','acos','atan']
};

var func_data = [
  {'func_name' : 'square', 'result' : 0},
  {'func_name' : 'sqrt', 'result' : 0},
  {'func_name' : 'abs', 'result' : 0},
  {'func_name' : '-', 'result' : 0},
  {'func_name' : 'ln', 'result' : NaN},
  {'func_name' : 'log10', 'result' : NaN},
  {'func_name' : 'e^', 'result' : 1},
  {'func_name' : '10^', 'result' : 1},
  {'func_name' : 'sin', 'result' : 0},
  {'func_name' : 'cos', 'result' : 1},
  {'func_name' : 'tan', 'result' : 0},
  {'func_name' : 'tan', 'result' : 0},
  {'func_name' : 'asin', 'result' : 0},
  {'func_name' : 'acos', 'result' : 1.5707963267948966},
  {'func_name' : 'atan', 'result' : 0}
];

var datadriven = [
  {'func_name' : 'square', 'data' : -2, 'result' : 4},
  {'func_name' : 'sqrt', 'data' : 4, 'result' : 2},
  {'func_name' : 'sqrt', 'data' : -4, 'result' : NaN},
  {'func_name' : 'abs', 'data' : -6, 'result' : 6},
  {'func_name' : 'abs', 'data' : 2, 'result' : 2},
  {'func_name' : '-', 'data' : -4, 'result' : 4},
  {'func_name' : '-', 'data' : 4, 'result' : -4},
  {'func_name' : '-', 'data' : 0, 'result' : -0},
  {'func_name' : 'ln', 'data' : 4, 'result' : 1.3862943611198906},
  {'func_name' : 'ln', 'data' : 0, 'result' : NaN},
  {'func_name' : 'ln', 'data' : -4, 'result' : NaN},
  {'func_name' : 'log10', 'data' : 101, 'result' : 2.0043213737826426},
  {'func_name' : 'log10', 'data' : 0, 'result' : NaN},
  {'func_name' : 'log10', 'data' : -101, 'result' : NaN},
  {'func_name' : 'e^', 'data' : 4, 'result' : 54.59815003314423},
  {'func_name' : 'e^', 'data' : 0, 'result' : 1},
  {'func_name' : 'e^', 'data' : -2, 'result' : 0.1353352832366127},
  {'func_name' : '10^', 'data' : 2, 'result' : 100},
  {'func_name' : '10^', 'data' : 0, 'result' : 1},
  {'func_name' : '10^', 'data' : -2, 'result' : 0.01},
  {'func_name' : 'sin', 'data' : 2, 'result' : 0.9092974268256817},
  {'func_name' : 'sin', 'data' : 6, 'result' : -0.27941549819892586},
  {'func_name' : 'sin', 'data' : 0, 'result' : 0},
  {'func_name' : 'cos', 'data' : -1, 'result' : 0.5403023058681398},
  {'func_name' : 'cos', 'data' : 2, 'result' : -0.4161468365471424},
  {'func_name' : 'cos', 'data' : 0, 'result' : 1},
  {'func_name' : 'tan', 'data' : 0.2, 'result' : 0.2027100355086725},
  {'func_name' : 'tan', 'data' : -0.1, 'result' : -0.10033467208545055},
  {'func_name' : 'tan', 'data' : 0, 'result' : 0},
  {'func_name' : 'asin', 'data' : 0.5, 'result' : 0.5235987755982989},
  {'func_name' : 'asin', 'data' : -0.5, 'result' : -0.5235987755982989},
  {'func_name' : 'asin', 'data' : 2, 'result' : NaN},
  {'func_name' : 'acos', 'data' : -2, 'result' : NaN},
  {'func_name' : 'acos', 'data' : 1, 'result' : 0}
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

function resetParams(id,portname,value){
  id = "";
  portname = "";
  value = 0;
}

describe('FUNCTION node', function(){

  before(function() {
    engine = require('../../../lib/engine/flow').create({"driver": "serial", "loglevel": "WARN"});
    // register call back
    engine.on('NodeInputChanged', nodeInputCallback);
    engine.on('NodeOutputChanged', nodeOutputCallBack);
  });

  after(function() {
    // clear up engine
    engine.stop();
    engine = "";
  });

  afterEach(function(){
    nodes = engine.getActiveNodes();
    console.log("node length: " + nodes.length);
    for(var i = 0; i < nodes.length; i++){
      engine.removeNode(nodes[i].id);
    }
    resetParams(cb_in_node_id,cb_in_name,cb_in_value);
    resetParams(cb_out_node_id,cb_out_name,cb_out_value);
  });


  it('Config parameters initial checking', function() {
    function_node_id = engine.addNode("FUNCTION");
    default_config = engine.getNodeConfigs(function_node_id);
    expect(default_config[function_config.config_name]['defaultValue']).to.be.eql(function_config.default_value);
    expect(default_config[function_config.config_name]['options']).to.be.eql(function_config.options);
  });

  it('When port a changed, the function run should be called', function(){
    function_node_id = engine.addNode("FUNCTION");
    number_node_id =  engine.addNode("NUMBER");
    default_configs = engine.getNodeConfigs(function_node_id);
    engine.configNode(function_node_id, {'func' : default_configs['func']['defaultValue']});
    engine.connect(number_node_id, 'number', function_node_id, 'a');
    engine.configNode(number_node_id, {'number' : 2});
    expect(cb_in_node_id).to.be.eql(function_node_id);
    expect(cb_in_name).to.be.eql('a');
    expect(cb_in_value).to.be.eql(2);
    expect(cb_out_node_id).to.be.eql(function_node_id);
    expect(cb_out_name).to.be.eql('b');
    expect(cb_out_value).to.be.eql(4);
  });

  it('When config func changed, the function run should be called', function(){
    function_node_id = engine.addNode('FUNCTION');
    for(var i = 0; i < func_data.length; i++){
      engine.configNode(function_node_id, {'func' : func_data[i].func_name});
      expect(cb_out_node_id).to.be.eql(function_node_id);
      expect(cb_out_name).to.be.eql('b');
      expect(cb_out_value).to.be.eql(func_data[i]['result']);
    }
  });

  it('Data driven to verify the function operation', function(){
    function_node_id = engine.addNode('FUNCTION');
    number_node_id =  engine.addNode("NUMBER");
    engine.connect(number_node_id, 'number', function_node_id, 'a');
    for(var i=0; i < datadriven.length; i++){
      console.log(datadriven[i].func_name + " " + datadriven[i].data);
      engine.configNode(number_node_id, {'number' : datadriven[i].data});
      engine.configNode(function_node_id, {'func' : datadriven[i].func_name});
      expect(cb_out_node_id).to.be.eql(function_node_id);
      expect(cb_out_name).to.be.eql('b');
      expect(cb_out_value).to.be.eql(datadriven[i].result);
    }
  });

  it('Output b can be exported to other node', function(){
    function_node_id = engine.addNode("FUNCTION");
    number_node_id =  engine.addNode("NUMBER");
    default_configs = engine.getNodeConfigs(function_node_id);
    engine.configNode(function_node_id, {'func' : default_configs['func']['defaultValue']});
    engine.connect(number_node_id, 'number', function_node_id, 'a');
    engine.configNode(number_node_id, {'number' : 2});
    expect(cb_in_node_id).to.be.eql(function_node_id);
    expect(cb_in_name).to.be.eql('a');
    expect(cb_in_value).to.be.eql(2);
    expect(cb_out_node_id).to.be.eql(function_node_id);
    expect(cb_out_name).to.be.eql('b');
    expect(cb_out_value).to.be.eql(4);

    add_node_id = engine.addNode('ADD');
    engine.connect(function_node_id, 'b', add_node_id, 'a');
    expect(cb_in_node_id).to.be.eql(add_node_id);
    expect(cb_in_name).to.be.eql('a');
    expect(cb_in_value).to.be.eql(4);
  });

  it('Delete a function node', function(){
    function_node_id = engine.addNode("FUNCTION");
    node = engine.getActiveNodeCache();
    expect(node).to.include.keys(function_node_id);
    // console.log("AAA: " + JSON.stringify(node));
    engine.removeNode(function_node_id);
    node = engine.getActiveNodeCache();
    expect(node).to.be.empty
  });
});


