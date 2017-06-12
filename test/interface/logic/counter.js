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
    value : -1
  },
  {
    input_port : "reset",
    value : 1
  }
];

var add_config = {
  reset : 'reset'
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

describe('COUNTER node', function(){

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

  it('Input ports can be changed by external input', function(){
    for (var i = 0; i < inputPortPkgs.length; i++) {
      counter_node_id = engine.addNode("COUNTER");
      number_node_id = engine.addNode("NUMBER");
      engine.configNode(number_node_id,{'number' : inputPortPkgs[i].value});
      engine.connect(number_node_id,'number',counter_node_id,inputPortPkgs[i].input_port);
      // verify in port xxx value changed
      expect(cb_in_node_id).to.be.eql(counter_node_id);
      expect(cb_in_name).to.be.eql(inputPortPkgs[i].input_port);
      expect(cb_in_value).to.be.eql(inputPortPkgs[i].value);
    }
  });

  it('Output ports can be changed by external input', function(){
    counter_node_id = engine.addNode("COUNTER");
    number_a_id = engine.addNode("NUMBER");
    number_b_id = engine.addNode("NUMBER");
    engine.configNode(number_a_id,{'number' : -1});
    engine.connect(number_a_id,'number',counter_node_id,"a");
    engine.configNode(number_a_id,{'number' : 1});

    expect(cb_out_node_id).to.be.eql(counter_node_id);
    expect(cb_out_name).to.be.eql("b");
    expect(cb_out_value).to.be.eql(1);

    engine.configNode(number_b_id,{'number' : -1});
    engine.connect(number_b_id,'number',counter_node_id,"reset");
    engine.configNode(number_b_id,{'number' : 1});

    expect(cb_out_node_id).to.be.eql(counter_node_id);
    expect(cb_out_name).to.be.eql("b");
    expect(cb_out_value).to.be.eql(0);
  });

  it('Config b should be useful', function(){
    counter_node_id = engine.addNode("COUNTER");
    number_node_id = engine.addNode("NUMBER");
    engine.configNode(number_node_id,{'number' : 1});
    engine.connect(number_node_id,'number',counter_node_id,'a');
    engine.configNode(counter_node_id,{'reset' : 'reset'});

    expect(cb_out_value).to.be.eql(0);
  });

  it('Config reset will be useless when external input connected with reset port', function(){
    counter_node_id = engine.addNode("COUNTER");
    number_node_id = engine.addNode("NUMBER");
    engine.configNode(number_node_id,{'number' : 1});
    engine.connect(number_node_id,'number',counter_node_id,'reset');
    engine.configNode(counter_node_id,{'reset' : 'reset'});
    // verify the config -7 will not affect on port b
    expect(cb_in_value).to.be.eql(1);
  });

  it('Output ports can be exported to other node', function(){
    var clock = sinon.useFakeTimers();
    counter_node_id = engine.addNode("COUNTER");
    clock.tick(500);
    number_a_id = engine.addNode("NUMBER");
    clock.tick(2);
    number_b_id = engine.addNode("NUMBER");
    clock.tick(2);
    counter2_node_id = engine.addNode("COUNTER");
    console.log("counter_node_id: " + counter_node_id);
    console.log("number_a_id: " + number_a_id);
    console.log("number_b_id: " + number_b_id);
    console.log("counter2_node_id: " + counter2_node_id);

    engine.configNode(number_a_id,{'number' : 2});
    // resetParams(cb_out_node_id,cb_out_name,cb_out_value);
    engine.connect(number_a_id,'number',counter_node_id,'a');
    // resetParams(cb_in_node_id,cb_in_name,cb_in_value);
    engine.connect(counter_node_id,'b',counter2_node_id,'a');
    console.log(counter2_node_id)

    expect(cb_in_node_id).to.be.eql(counter2_node_id);
    expect(cb_in_name).to.be.eql('a');
    expect(cb_in_value).to.be.eql(1);

    expect(cb_out_node_id).to.be.eql(counter2_node_id);
    expect(cb_out_name).to.be.eql('b');
    expect(cb_out_value).to.be.eql(1);

    engine.configNode(number_a_id,{'number' : 0});
    engine.configNode(number_a_id,{'number' : 1});

    expect(cb_in_node_id).to.be.eql(counter2_node_id);
    expect(cb_in_name).to.be.eql('a');
    expect(cb_in_value).to.be.eql(2);

    engine.configNode(number_a_id,{'number' : -1});
    engine.configNode(number_a_id,{'number' : 1});

    expect(cb_in_node_id).to.be.eql(counter2_node_id);
    expect(cb_in_name).to.be.eql('a');
    expect(cb_in_value).to.be.eql(3);

    engine.configNode(number_b_id,{'number' : 0});
    engine.connect(number_b_id,'number',counter_node_id,'reset');
    engine.connect(counter_node_id,'b',counter2_node_id,'reset');
    engine.configNode(number_b_id,{'number' : 1});

    expect(cb_in_node_id).to.be.eql(counter2_node_id);
    expect(cb_in_name).to.be.eql('reset');
    expect(cb_in_value).to.be.eql(0);

    clock.restore();
  });

  it('Remove a counter node', function(){
    counter_node_id = engine.addNode("COUNTER");
    node = engine.getActiveNodeCache();
    expect(node).to.include.keys(counter_node_id);
    // console.log("AAA: " + JSON.stringify(node));
    engine.removeNode(counter_node_id);
    node = engine.getActiveNodeCache();
    expect(node).to.be.empty
  });
});


