var expect = require('chai').expect;
var sinon = require("sinon");
var engine = "";
var cb_in_node_id = "";
var cb_in_name = "";
var cb_in_value = 0;
var cb_out_node_id = "";
var cb_out_name = "";
var cb_out_value = 0;


var hold_config = {
  b : 1
};

var hold_external = [
  {'seconds' : 2, 'number1' : -99, 'number2' : 100},
  {'seconds' : 0, 'number1' : 2, 'number2' : -2},
  {'seconds' : -10, 'number1' : -300, 'number2' : 300}
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
  value = -1;
}

describe('HOLD node', function(){

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

  it('Config parameters initial checking',function() {
    hold_node_id = engine.addNode("HOLD");
    default_config = engine.getNodeConfigs(hold_node_id);
    expect(default_config['hold']['defaultValue']).to.be.eql(hold_config.b);
  });

  it('Hold 1 seconds to output by default hold config', function(){
    var clock = sinon.useFakeTimers();
    hold_node_id = engine.addNode("HOLD");
    default_config = engine.getNodeConfigs(hold_node_id);
    engine.configNode(hold_node_id, {'hold' : default_config['hold']['defaultValue']});
    number_node_id = engine.addNode("NUMBER");
    engine.configNode(number_node_id, {'number' : 6});
    engine.connect(number_node_id, 'number', hold_node_id, 'a');
    // second time to set input number 2
    engine.configNode(number_node_id, {'number' : 2});
    // verify the first input number 6 holded
    expect(cb_out_node_id).to.be.not.equal(hold_node_id);
    clock.tick(1000);
    // after 1 second, verify the hold 6 finished (output b change to 2).
    expect(cb_out_node_id).to.be.eql(hold_node_id);
    expect(cb_out_name).to.be.eql('b');
    expect(cb_out_value).to.be.eql(2);
    clock.restore();
  });

  // negative hold error ...
  it('Hold n seconds to output by external hold setting', function(){
    var clock = sinon.useFakeTimers();
    hold_node_id = engine.addNode("HOLD");
    number_a_id = engine.addNode("NUMBER");
    clock.tick(500);
    number_hold_id = engine.addNode("NUMBER");
    engine.connect(number_a_id, 'number', hold_node_id, 'a');
    engine.connect(number_hold_id, 'number', hold_node_id, 'hold');
    for(var i = 0; i < hold_external.length; i++){
      console.log("time : " + i + " hold_external[i].seconds: " + hold_external[i].seconds);
      console.log("number1 : " + hold_external[i].number1 + "  number2: " + hold_external[i].number2);
      engine.configNode(number_hold_id, {'number': hold_external[i].seconds});
      engine.configNode(number_a_id, {'number': hold_external[i].number1});
      engine.configNode(number_a_id, {'number': hold_external[i].number2});
      if (hold_external[i].seconds > 0){
        expect(cb_out_node_id).to.be.not.equal(hold_node_id);
        milliseconds = hold_external[i].seconds * 1000;
        console.log('milliseconds : ' + milliseconds);
        clock.tick(milliseconds);
        console.log("cb_out_node_id: " + cb_out_node_id);
        console.log("cb_out_name: " + cb_out_name);
        console.log("cb_out_value: " + cb_out_value);
        expect(cb_out_node_id).to.be.eql(hold_node_id);
        expect(cb_out_name).to.be.eql('b');
        expect(cb_out_value).to.be.eql(hold_external[i].number2);
      }else{
        console.log("---------------" + i);
        clock.tick(3);
        console.log("cb_out_node_id: " + cb_out_node_id);
        console.log("cb_out_name: " + cb_out_name);
        console.log("cb_out_value: " + cb_out_value);
        expect(cb_out_node_id).to.be.eql(hold_node_id);
        expect(cb_out_name).to.be.eql('b');
        expect(cb_out_value).to.be.eql(hold_external[i].number2);
      }
    }
  });

  it('Config hold will be useless when external input connected with hold port', function() {
    var clock = sinon.useFakeTimers();
    hold_node_id = engine.addNode("HOLD");
    number_a_id = engine.addNode("NUMBER");
    clock.tick(200);
    number_hold_id = engine.addNode("NUMBER");
    engine.connect(number_a_id, 'number', hold_node_id, 'a');
    engine.connect(number_hold_id, 'number', hold_node_id, 'hold');
    engine.configNode(number_hold_id, {'number' : 5});
    // first set number 2 (hold)
    engine.configNode(number_a_id, {'number' : 2});
    // second set number -2 (when finish hold, -2 will be output)
    engine.configNode(number_a_id, {'number' : -2});
    // config hold param
    engine.configNode(hold_node_id, {'hold' : 3});
    milliseconds = 3 * 1000;
    clock.tick(milliseconds);
    expect(cb_out_node_id).to.be.not.equal(hold_node_id);
    milliseconds = 2 * 1000;
    clock.tick(milliseconds);
    expect(cb_out_node_id).to.be.eql(hold_node_id);
    expect(cb_out_name).to.be.eql('b');
    expect(cb_out_value).to.be.eql(-2);
    clock.restore();
  });

  it('When hold time reset (config), the hold operation reset', function(){
    var clock = sinon.useFakeTimers();
    hold_node_id = engine.addNode("HOLD");
    number_node_id = engine.addNode("NUMBER");
    engine.connect(number_node_id, 'number', hold_node_id, 'a');
    // first time to set 5 second hold
    engine.configNode(hold_node_id, {'hold' : 5});
    engine.configNode(number_node_id, {'number' : 6});
    engine.configNode(number_node_id, {'number' : -6});
    // second time to set 3 second hold
    engine.configNode(hold_node_id, {'hold' : 3});
    expect(cb_out_node_id).to.be.eql(hold_node_id);
    expect(cb_out_name).to.be.eql('b');
    expect(cb_out_value).to.be.eql(-6);
    // set -2.2 and it will be output when -6 hold finished (after 3 seconds)
    engine.configNode(number_node_id, {'number' : -2.2});
    expect(cb_out_node_id).to.be.not.equal(hold_node_id);
    clock.tick(3000);
    expect(cb_out_node_id).to.be.eql(hold_node_id);
    expect(cb_out_name).to.be.eql('b');
    expect(cb_out_value).to.be.eql(-2.2);
    clock.restore();
  });

  it('When hold time reset (external node), the hold operation reset', function(){
    var clock = sinon.useFakeTimers();
    hold_node_id = engine.addNode("HOLD");
    number_a_id = engine.addNode("NUMBER");
    clock.tick(501);
    number_hold_id = engine.addNode("NUMBER");
    engine.connect(number_a_id, 'number', hold_node_id, 'a');
    engine.connect(number_hold_id, 'number', hold_node_id, 'hold');
    // first time to set 5 second hold
    engine.configNode(number_hold_id, {'number' : 5});
    engine.configNode(number_node_id, {'number' : 6});
    engine.configNode(number_node_id, {'number' : -6});
    // second time to set 3 second hold
    engine.configNode(number_hold_id, {'number' : 3});
    expect(cb_out_node_id).to.be.eql(hold_node_id);
    expect(cb_out_name).to.be.eql('b');
    expect(cb_out_value).to.be.eql(-6);
    // set -2.2 and it will be output when -6 hold finished (after 3 seconds)
    engine.configNode(number_node_id, {'number' : -2.2});
    clock.tick(3000);
    expect(cb_out_node_id).to.be.eql(hold_node_id);
    expect(cb_out_name).to.be.eql('b');
    expect(cb_out_value).to.be.eql(-2.2);
    clock.restore();
  });

  it('Output b can be exported to other node', function(){
    var clock = sinon.useFakeTimers();
    hold_node_id = engine.addNode("HOLD");
    default_config = engine.getNodeConfigs(hold_node_id);
    engine.configNode(hold_node_id, {'hold' : default_config['hold']['defaultValue']});
    number_node_id = engine.addNode("NUMBER");
    engine.configNode(number_node_id, {'number' : 6});
    engine.connect(number_node_id, 'number', hold_node_id, 'a');
    // second time to set input number 2
    engine.configNode(number_node_id, {'number' : 2});
    // verify the first input number 6 holded
    expect(cb_out_node_id).to.be.not.equal(hold_node_id);
    clock.tick(1000);
    // after 1 second, verify the hold 6 finished (output b change to 2).
    expect(cb_out_node_id).to.be.eql(hold_node_id);
    expect(cb_out_name).to.be.eql('b');
    expect(cb_out_value).to.be.eql(2);
    clock.tick(200);
    add_node_id = engine.addNode("ADD");
    engine.connect(hold_node_id, 'b', add_node_id, 'a');
    expect(cb_in_node_id).to.be.eql(add_node_id);
    expect(cb_in_name).to.be.eql('a');
    expect(cb_in_value).to.be.eql(2);
    clock.restore();
  });

  it('Remove a hold node', function(){
    hold_node_id = engine.addNode("HOLD");
    node = engine.getActiveNodeCache();
    expect(node).to.include.keys(hold_node_id);
    // console.log("AAA: " + JSON.stringify(node));
    engine.removeNode(hold_node_id);
    node = engine.getActiveNodeCache();
    expect(node).to.be.empty
  });

});


