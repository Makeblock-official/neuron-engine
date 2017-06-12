var expect = require('chai').expect;
var sinon = require("sinon");
var engine = "";
var cb_in_node_id = "";
var cb_in_name = "";
var cb_in_value = 0;
var cb_out_node_id = "";
var cb_out_name = "";
var cb_out_value = 0;

var inputPortPkgs = [/*
  {
    input_port : "b",
    value : -7
  },*/
  {
    input_port : "a",
    value : 11
  }
];

var add_config = {
  b : 1
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
  value = -1;
}

describe('ADD node', function(){

  before(function() {
    engine = require('../../../lib/engine/flow').create({"driver": "serial", "loglevel": "WARN"});
    engine.on('NodeInputChanged', nodeInputCallback);
    engine.on('NodeOutputChanged', nodeOutputCallBack);
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
    resetParams(cb_in_node_id,cb_in_name,cb_in_value);
    resetParams(cb_out_node_id,cb_out_name,cb_out_value);
  });

  it('Should be with default value 1 of input b',function() {
    add_node_id = engine.addNode("ADD");
    default_config = engine.getNodeConfigs(add_node_id);
    expect(default_config['b']['defaultValue']).to.be.eql(add_config.b);
  });

  it('When config b changed, the plus callback should be called', function() {
    add_node_id = engine.addNode("ADD");
    // Verify b input changed
    engine.configNode(add_node_id,{'b':3});
    //Verify c output changed
    expect(cb_out_node_id).to.be.eql(add_node_id);
    expect(cb_out_name).to.be.eql('c');
    expect(cb_out_value).to.be.eql(3);
  });

  it('Input ports can be changed by external input', function(){
    for (var i = 0; i < inputPortPkgs.length; i++) {
      add_node_id = engine.addNode("ADD");
      number_node_id = engine.addNode("NUMBER");
      engine.configNode(number_node_id,{'number' : inputPortPkgs[i].value});
      engine.connect(number_node_id,'number',add_node_id,inputPortPkgs[i].input_port);
      // verify in port xxx value changed
      expect(cb_in_node_id).to.be.eql(add_node_id);
      expect(cb_in_name).to.be.eql(inputPortPkgs[i].input_port);
      expect(cb_in_value).to.be.eql(inputPortPkgs[i].value);
    }
  });


  it('Output c can be exported to other node', function(){
    var clock = sinon.useFakeTimers();
    add_node_id = engine.addNode("ADD");
    clock.tick(500);
    number_a_id = engine.addNode("NUMBER");
    clock.tick(2);
    number_b_id = engine.addNode("NUMBER");
    clock.tick(2);
    add2_node_id = engine.addNode("ADD");
    console.log("add_node_id: " + add_node_id);
    console.log("number_a_id: " + number_a_id);
    console.log("number_b_id: " + number_b_id);
    console.log("add2_node_id: " + add2_node_id);

    engine.configNode(number_a_id,{'number' : -1.1});
    engine.connect(number_a_id,'number',add_node_id,'a');

    engine.configNode(add_node_id,{'b' : 3.1});
    expect(cb_out_node_id).to.be.eql(add_node_id);
    expect(cb_out_name).to.be.eql('c');
    expect(cb_out_value).to.be.eql(2);

    engine.connect(add_node_id,'c',add2_node_id,'a');
    expect(cb_in_node_id).to.be.eql(add2_node_id);
    expect(cb_in_name).to.be.eql('a');
    expect(cb_in_value).to.be.eql(2);

    clock.restore();
  });

  it('Remove an add node', function(){
    add_node_id = engine.addNode("ADD");
    node = engine.getActiveNodeCache();
    expect(node).to.include.keys(add_node_id);
   // console.log("AAA: " + JSON.stringify(node));
    engine.removeNode(add_node_id);
    node = engine.getActiveNodeCache();
    expect(node).to.be.empty
  });
});


