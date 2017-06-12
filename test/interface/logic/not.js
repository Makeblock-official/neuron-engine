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
    input_port : "b",
    value : -7
  },
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

describe('NOT node', function(){

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
    not_node_id = engine.addNode("NOT");
    number_node_id = engine.addNode("NUMBER");
    engine.configNode(number_node_id,{'number' : 1});
    engine.connect(number_node_id,'number',not_node_id,"a");
    // verify in port a value changed
    expect(cb_in_node_id).to.be.eql(not_node_id);
    expect(cb_in_name).to.be.eql("a");
    expect(cb_in_value).to.be.eql(1);
    // verify out port c value changed
    expect(cb_out_node_id).to.be.eql(not_node_id);
    expect(cb_out_name).to.be.eql("c");
    expect(cb_out_value).to.be.eql(0);
  });

  it('Output c can be exported to other node', function(){
    var clock = sinon.useFakeTimers();
    not_node_id = engine.addNode("NOT");
    clock.tick(500);
    number_node_id = engine.addNode("NUMBER");
    clock.tick(2);
    not2_node_id = engine.addNode("NOT");
    console.log("not_node_id: " + not_node_id);
    console.log("number_node_id: " + number_node_id);
    console.log("not2_node_id: " + not2_node_id);

    engine.configNode(number_node_id,{'number' : -1});
    // resetParams(cb_out_node_id,cb_out_name,cb_out_value);
    engine.connect(number_node_id,'number',not_node_id,'a');
    // resetParams(cb_in_node_id,cb_in_name,cb_in_value);

    expect(cb_out_node_id).to.be.eql(not_node_id);
    expect(cb_out_name).to.be.eql('c');
    expect(cb_out_value).to.be.eql(100);

    engine.connect(not_node_id,'c',not2_node_id,'a');

    expect(cb_in_node_id).to.be.eql(not2_node_id);
    expect(cb_in_name).to.be.eql('a');
    expect(cb_in_value).to.be.eql(100);

    expect(cb_out_node_id).to.be.eql(not2_node_id);
    expect(cb_out_name).to.be.eql('c');
    expect(cb_out_value).to.be.eql(0);

    engine.configNode(number_node_id,{'number' : 1});

    expect(cb_in_node_id).to.be.eql(not2_node_id);
    expect(cb_in_name).to.be.eql('a');
    expect(cb_in_value).to.be.eql(0);

    expect(cb_out_node_id).to.be.eql(not2_node_id);
    expect(cb_out_name).to.be.eql('c');
    expect(cb_out_value).to.be.eql(100);

    clock.restore();
  });

  it('Remove a not node', function(){
    and_node_id = engine.addNode("NOT");
    node = engine.getActiveNodeCache();
    expect(node).to.include.keys(and_node_id);
    // console.log("AAA: " + JSON.stringify(node));
    engine.removeNode(and_node_id);
    node = engine.getActiveNodeCache();
    expect(node).to.be.empty
  });

});


