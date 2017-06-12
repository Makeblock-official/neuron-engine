var expect = require('chai').expect;
var sinon = require("sinon");
var engine = "";
var cb_in_node_id = "";
var cb_in_name = "";
var cb_in_value = 0;
var cb_out_node_id = "";
var cb_out_name = "";
var cb_out_value = 0;

var inputPortPkgs = [
  {
    input_port : "a",
    value : 11
  }
];

var substract_config = {
  config_name : "b",
  default_value : 1
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

describe('SUBSTRACT node', function(){

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


  it('Should be with default value 1 of input b',function() {
    subtract_node_id = engine.addNode("SUBTRACT");
    default_config = engine.getNodeConfigs(subtract_node_id);
    expect(default_config[substract_config.config_name]['defaultValue']).to.be.eql(substract_config.default_value);
  });

  it('When config b changed, the minus callback should be called', function() {
    subtract_node_id = engine.addNode("SUBTRACT");
    // Verify b input changed
    engine.configNode(subtract_node_id,{'b':9.1});
    //Verify c output changed
    expect(cb_out_node_id).to.be.eql(subtract_node_id);
    expect(cb_out_name).to.be.eql('c');
    expect(cb_out_value).to.be.eql(-9.1);
  });

  it('Input ports can be changed by external input', function(){
    for (var i = 0; i < inputPortPkgs.length; i++) {
      subtract_node_id = engine.addNode("SUBTRACT");
      number_node_id = engine.addNode("NUMBER");
      engine.configNode(number_node_id,{'number' : inputPortPkgs[i].value});
      engine.connect(number_node_id,'number',subtract_node_id,inputPortPkgs[i].input_port);
      // verify in port xxx value changed
      expect(cb_in_node_id).to.be.eql(subtract_node_id);
      expect(cb_in_name).to.be.eql(inputPortPkgs[i].input_port);
      expect(cb_in_value).to.be.eql(inputPortPkgs[i].value);
    }
  });

  it('Output c can be exported to other node', function(){
    var clock = sinon.useFakeTimers();
    subtract_node_id = engine.addNode("SUBTRACT");
    clock.tick(500);
    number_a_id = engine.addNode("NUMBER");
    clock.tick(2);
    //number_b_id = engine.addNode("NUMBER");
    //clock.tick(2);
    add2_node_id = engine.addNode("ADD");

    engine.configNode(number_a_id,{'number' : 2.5});
    resetParams(cb_out_node_id,cb_out_name,cb_out_value);
    engine.connect(number_a_id,'number',subtract_node_id,'a');
    resetParams(cb_in_node_id,cb_in_name,cb_in_value);
    engine.configNode(subtract_node_id,{'b':7});

    expect(cb_out_node_id).to.be.eql(subtract_node_id);
    expect(cb_out_name).to.be.eql('c');
    expect(cb_out_value).to.be.eql(-4.5);

    engine.connect(subtract_node_id,'c',add2_node_id,'a');
    expect(cb_in_node_id).to.be.eql(add2_node_id);
    expect(cb_in_name).to.be.eql('a');
    expect(cb_in_value).to.be.eql(-4.5);
    clock.restore();
  });

  it('Remove an substract node', function(){
    sub_node_id = engine.addNode("SUBTRACT");
    node = engine.getActiveNodeCache();
    expect(node).to.include.keys(sub_node_id);
    // console.log("AAA: " + JSON.stringify(node));
    engine.removeNode(sub_node_id);
    node = engine.getActiveNodeCache();
    expect(node).to.be.empty
  });

});


