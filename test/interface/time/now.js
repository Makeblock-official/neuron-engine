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


describe('NOW node', function(){

  function resetParams(id,portname,value){
    id = "";
    portname = "";
    value = -1;
  }

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

  it('Hour can export to other node',function() {
    var clock = sinon.useFakeTimers();
    now_node_id = engine.addNode("NOW");
    and_node_id = engine.addNode("AND");
    engine.initNode(now_node_id);
    clock.tick(1001);
    engine.connect(now_node_id,'hour',and_node_id, 'a');
    var myDate=new Date();
    var hour = myDate.getHours();
    expect(cb_in_value).to.be.eql(hour);
    expect(cb_in_node_id).to.be.eql(and_node_id);
    expect(cb_in_name).to.be.eql('a');
    clock.restore();
  });

  it('Minute can export to other node',function() {
    var clock = sinon.useFakeTimers();
    now_node_id = engine.addNode("NOW");
    and_node_id = engine.addNode("AND");
    engine.initNode(now_node_id);
    clock.tick(1001);
    engine.connect(now_node_id,'minute',and_node_id, 'a');
    var myDate=new Date();
    var minute = myDate.getMinutes();
    expect(cb_in_value).to.be.eql(minute);
    expect(cb_in_node_id).to.be.eql(and_node_id);
    expect(cb_in_name).to.be.eql('a');
    clock.restore();
  });

  it('Second can export to other node',function() {
    var clock = sinon.useFakeTimers();
    now_node_id = engine.addNode("NOW");
    and_node_id = engine.addNode("AND");
    engine.initNode(now_node_id);
    clock.tick(1001);
    engine.connect(now_node_id,'second',and_node_id, 'a');
    var myDate=new Date();
    var second = myDate.getSeconds();
    expect(cb_in_value).to.be.eql(second);
    expect(cb_in_node_id).to.be.eql(and_node_id);
    expect(cb_in_name).to.be.eql('a');
    clock.restore();
  });


  it('Remove a now node', function(){
    now_node_id = engine.addNode("NOW");
    node = engine.getActiveNodeCache();
    expect(node).to.include.keys(now_node_id);
    // console.log("AAA: " + JSON.stringify(node));
    engine.removeNode(now_node_id);
    node = engine.getActiveNodeCache();
    expect(node).to.be.empty
  });

});


