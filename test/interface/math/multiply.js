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

var mult_config = {
  config_name : "b",
  default_value : 2
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

describe('MULTIPLY node', function(){

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


  it('Config parameters initial checking',function() {
    mult_node_id = engine.addNode("MULTIPLY");
    default_config = engine.getNodeConfigs(mult_node_id);
    expect(default_config[mult_config.config_name]['defaultValue']).to.be.eql(mult_config.default_value);
    expect(default_config[mult_config.config_name]['defaultValue']).to.be.eql(mult_config.default_value);
  });

  it('When config b changed, the multiply run should be called', function() {
    mult_node_id = engine.addNode("MULTIPLY");
    engine.configNode(mult_node_id,{'b':3});
    expect(cb_out_node_id).to.be.eql(mult_node_id);
    expect(cb_out_name).to.be.eql('c');
    expect(cb_out_value).to.be.eql(0);
  });

  it('Input ports can be changed by external input', function(){
    for (var i = 0; i < inputPortPkgs.length; i++) {
      mult_node_id = engine.addNode("MULTIPLY");
      number_node_id = engine.addNode("NUMBER");
      engine.configNode(number_node_id,{'number' : inputPortPkgs[i].value});
      engine.connect(number_node_id,'number',mult_node_id,inputPortPkgs[i].input_port);
      // verify in port xxx value changed
      expect(cb_in_node_id).to.be.eql(mult_node_id);
      expect(cb_in_name).to.be.eql(inputPortPkgs[i].input_port);
      expect(cb_in_value).to.be.eql(inputPortPkgs[i].value);
    }
  });

  it('Output c can be exported to other node', function(){
    var clock = sinon.useFakeTimers();
    mult_node_id = engine.addNode("MULTIPLY");
    clock.tick(500);
    number_a_id = engine.addNode("NUMBER");
    clock.tick(2);
    //number_b_id = engine.addNode("NUMBER");
    //clock.tick(2);
    add2_node_id = engine.addNode("ADD");

    engine.configNode(number_a_id,{'number' : 3});
    resetParams(cb_out_node_id,cb_out_name,cb_out_value);
    engine.connect(number_a_id,'number',mult_node_id,'a');
    resetParams(cb_in_node_id,cb_in_name,cb_in_value);
    engine.configNode(mult_node_id,{'b':6});

    expect(cb_out_node_id).to.be.eql(mult_node_id);
    expect(cb_out_name).to.be.eql('c');
    expect(cb_out_value).to.be.eql(18);

    engine.connect(mult_node_id,'c',add2_node_id,'a');
    expect(cb_in_node_id).to.be.eql(add2_node_id);
    expect(cb_in_name).to.be.eql('a');
    expect(cb_in_value).to.be.eql(18);
    clock.restore();
  });

  it('Remove an multiply node', function(){
    mul_node_id = engine.addNode("MULTIPLY");
    node = engine.getActiveNodeCache();
    expect(node).to.include.keys(mul_node_id);
    // console.log("AAA: " + JSON.stringify(node));
    engine.removeNode(mul_node_id);
    node = engine.getActiveNodeCache();
    expect(node).to.be.empty
  });
});


