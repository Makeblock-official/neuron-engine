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


describe('TODAY node', function(){

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

  it('Year can export to other node',function() {
    today_node_id = engine.addNode("TODAY");
    and_node_id = engine.addNode("AND");
    engine.initNode(today_node_id);
    //clock.tick(1001);
    engine.connect(today_node_id,'year',and_node_id, 'a');
    var myDate=new Date();
    var year = myDate.getFullYear();
    expect(cb_in_value).to.be.eql(year);
    expect(cb_in_node_id).to.be.eql(and_node_id);
    expect(cb_in_name).to.be.eql('a');
  });

  it('Month can export to other node',function() {
    today_node_id = engine.addNode("TODAY");
    and_node_id = engine.addNode("AND");
    engine.initNode(today_node_id);
    //clock.tick(1001);
    engine.connect(today_node_id,'month',and_node_id, 'a');
    var myDate=new Date();
    var month = myDate.getMonth() + 1;
    expect(cb_in_value).to.be.eql(month);
    expect(cb_in_node_id).to.be.eql(and_node_id);
    expect(cb_in_name).to.be.eql('a');
  });

  it('Day can export to other node',function() {
    today_node_id = engine.addNode("TODAY");
    and_node_id = engine.addNode("AND");
    engine.initNode(today_node_id);
    //clock.tick(1001);
    engine.connect(today_node_id,'day',and_node_id, 'a');
    var myDate=new Date();
    var day =  myDate.getDate();
    expect(cb_in_value).to.be.eql(day);
    expect(cb_in_node_id).to.be.eql(and_node_id);
    expect(cb_in_name).to.be.eql('a');
  });

  it('Week can export to other node',function() {
    today_node_id = engine.addNode("TODAY");
    and_node_id = engine.addNode("AND");
    engine.initNode(today_node_id);
    //clock.tick(1001);
    engine.connect(today_node_id,'week',and_node_id, 'a');
    var myDate=new Date();var week = myDate.getDay();
    if (week === 0){
      week = 7;
    }
    expect(cb_in_value).to.be.eql(week);
    expect(cb_in_node_id).to.be.eql(and_node_id);
    expect(cb_in_name).to.be.eql('a');
  });



  it('Remove a today node', function(){
    today_node_id = engine.addNode("TODAY");
    node = engine.getActiveNodeCache();
    expect(node).to.include.keys(today_node_id);
    // console.log("AAA: " + JSON.stringify(node));
    engine.removeNode(today_node_id);
    node = engine.getActiveNodeCache();
    expect(node).to.be.empty
  });
});


