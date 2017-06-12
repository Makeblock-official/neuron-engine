var expect = require('chai').expect;
var sinon = require("sinon");
var engine = "";
var cb_in_node_id = "";
var cb_in_name = "";
var cb_in_value = 0;
var cb_out_node_id = "";
var cb_out_name = "";
var cb_out_value = 0;

var number_config = {
  config_name : "number",
  default_value : 0
};


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

describe('NUMBER node', function(){

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

  it('Should be with default value 0 of config value',function() {
    number_node_id = engine.addNode("NUMBER");
    default_config = engine.getNodeConfigs(number_node_id);
    expect(default_config[number_config.config_name]['defaultValue']).to.be.eql(number_config.default_value);
  });

  it('Config value to number node', function() {
    number_node_id = engine.addNode("NUMBER");
    engine.configNode(number_node_id,{'number':-22});
    expect(cb_out_node_id).to.be.eql(number_node_id);
    expect(cb_out_name).to.be.eql('number');
    expect(cb_out_value).to.be.eql(-22);
  });

  it('Output number can be exported to other node', function(){
    number_node_id = engine.addNode("NUMBER");
    engine.configNode(number_node_id,{'number':-22});
    add_node_id = engine.addNode("ADD");
    engine.connect(number_node_id,'number',add_node_id,'a');
    expect(cb_in_node_id).to.be.eql(add_node_id);
    expect(cb_in_name).to.be.eql('a');
    expect(cb_in_value).to.be.eql(-22);
  });

  it('When port sent is triggered, the number will be export to next node', function(){
    var clock = sinon.useFakeTimers();
    number_node1_id = engine.addNode("NUMBER");
    clock.tick(100);
    number_node2_id = engine.addNode("NUMBER");
    clock.tick(101);
    number_nodeSend_id = engine.addNode("NUMBER");
    clock.tick(101);
    add_node_id = engine.addNode("ADD");
    console.log("number_node1_id: " + number_node1_id);
    console.log("number_node2_id: " + number_node2_id);
    console.log("number_nodeSend_id: " + number_nodeSend_id);
    console.log("add_node_id: " + add_node_id);
    engine.configNode(number_node1_id,{'number':6});
    engine.configNode(number_node2_id,{'number':-2});
    engine.connect(number_node1_id,'number',add_node_id,'a');
    console.log("cb_in_node_id: " + cb_in_node_id);
    console.log("cb_in_name: " + cb_in_name);
    console.log("cb_in_value: " + cb_in_value);
    clock.tick(1000);
    engine.connect(number_node2_id,'number',add_node_id,'a');
    console.log("cb_in_node_id: " + cb_in_node_id);
    console.log("cb_in_name: " + cb_in_name);
    console.log("cb_in_value: " + cb_in_value);
    expect(cb_in_node_id).to.be.eql(add_node_id);
    expect(cb_in_name).to.be.eql('a');
    expect(cb_in_value).to.be.eql(-2);
    engine.connect(number_nodeSend_id,'number',number_node1_id,'send');
    engine.configNode(number_nodeSend_id,{'number':2});
    expect(cb_in_node_id).to.be.eql(add_node_id);
    expect(cb_in_name).to.be.eql('a');
    expect(cb_in_value).to.be.eql(6);
    clock.restore();
  });

  it('Number a scale node', function(){
    number_node_id = engine.addNode("NUMBER");
    node = engine.getActiveNodeCache();
    expect(node).to.include.keys(number_node_id);
    // console.log("AAA: " + JSON.stringify(node));
    engine.removeNode(number_node_id);
    node = engine.getActiveNodeCache();
    expect(node).to.be.empty
  });

});


