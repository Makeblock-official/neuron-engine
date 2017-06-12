var expect = require('chai').expect;
var sinon = require("sinon");
var engine = "";
var cb_in_node_id = "";
var cb_in_name = "";
var cb_in_value = 0;
var cb_out_node_id = "";
var cb_out_name = "";
var cb_out_value = 0;

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

describe('TOGGLE node', function(){

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
    toggle_node_id = engine.addNode("TOGGLE");
    number_node_id = engine.addNode("NUMBER");
    engine.configNode(number_node_id,{'number' : -1});
    engine.connect(number_node_id,'number',toggle_node_id,"a");
    engine.configNode(number_node_id,{'number' : 1});

    expect(cb_in_node_id).to.be.eql(toggle_node_id);
    expect(cb_in_name).to.be.eql("a");
    expect(cb_in_value).to.be.eql(1);

    expect(cb_out_node_id).to.be.eql(toggle_node_id);
    expect(cb_out_name).to.be.eql("b");
    expect(cb_out_value).to.be.eql(100);

    engine.configNode(number_node_id,{'number' : -1});
    engine.configNode(number_node_id,{'number' : 1});

    expect(cb_out_node_id).to.be.eql(toggle_node_id);
    expect(cb_out_name).to.be.eql("b");
    expect(cb_out_value).to.be.eql(0);

    engine.configNode(number_node_id,{'number' : -1});
    engine.configNode(number_node_id,{'number' : 1});

    expect(cb_out_node_id).to.be.eql(toggle_node_id);
    expect(cb_out_name).to.be.eql("b");
    expect(cb_out_value).to.be.eql(100);
  });

  it('Output c can be exported to other node', function(){
    var clock = sinon.useFakeTimers();
    toggle_node_id = engine.addNode("TOGGLE");
    clock.tick(500);
    number_node_id = engine.addNode("NUMBER");
    clock.tick(2);
    toggle2_node_id = engine.addNode("TOGGLE");
    console.log("toggle_node_id: " + toggle_node_id);
    console.log("number_node_id: " + number_node_id);
    console.log("toggle2_node_id: " + toggle2_node_id);

    engine.configNode(number_node_id,{'number' : 0});
    engine.connect(number_node_id,'number',toggle_node_id,'a');
    engine.configNode(number_node_id,{'number' : 1});

    expect(cb_out_node_id).to.be.eql(toggle_node_id);
    expect(cb_out_name).to.be.eql('b');
    expect(cb_out_value).to.be.eql(100);

    engine.configNode(number_node_id,{'number' : 0});
    engine.configNode(number_node_id,{'number' : 1});

    engine.connect(toggle_node_id,'b',toggle2_node_id,'a');

    expect(cb_in_node_id).to.be.eql(toggle2_node_id);
    expect(cb_in_name).to.be.eql('a');
    expect(cb_in_value).to.be.eql(0);

    engine.configNode(number_node_id,{'number' : 1});

    expect(cb_in_node_id).to.be.eql(toggle2_node_id);
    expect(cb_in_name).to.be.eql('a');
    expect(cb_in_value).to.be.eql(0);

    engine.configNode(number_node_id,{'number' : -1});
    engine.configNode(number_node_id,{'number' : 1});

    expect(cb_in_node_id).to.be.eql(toggle2_node_id);
    expect(cb_in_name).to.be.eql('a');
    expect(cb_in_value).to.be.eql(100);

    expect(cb_out_node_id).to.be.eql(toggle2_node_id);
    expect(cb_out_name).to.be.eql('b');
    expect(cb_out_value).to.be.eql(100);

    engine.configNode(number_node_id,{'number' : 0});
    engine.configNode(number_node_id,{'number' : 1});

    expect(cb_in_node_id).to.be.eql(toggle2_node_id);
    expect(cb_in_name).to.be.eql('a');
    expect(cb_in_value).to.be.eql(0);

    clock.restore();
  });

  it('Remove a toggle node', function(){
    toggle_node_id = engine.addNode("TOGGLE");
    node = engine.getActiveNodeCache();
    expect(node).to.include.keys(toggle_node_id);
    // console.log("AAA: " + JSON.stringify(node));
    engine.removeNode(toggle_node_id);
    node = engine.getActiveNodeCache();
    expect(node).to.be.empty
  });

});


