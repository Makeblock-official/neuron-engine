var expect = require('chai').expect;
var sinon = require("sinon");
var engine = "";
var cb_in_node_id = "";
var cb_in_name = "";
var cb_in_value = 0;
var cb_out_node_id = "";
var cb_out_name = "";
var cb_out_value = 0;

var delay_config = {
  b : 1
};

var delay_external = [
  {'seconds' : 2, 'number' : -25},
  {'seconds' : 0, 'number' : -25},
  {'seconds' : -10, 'number' : -300}
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

describe('DELAY node', function(){

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
    delay_node_id = engine.addNode("DELAY");
    default_config = engine.getNodeConfigs(delay_node_id);
    expect(default_config['delay']['defaultValue']).to.be.eql(delay_config.b);
  });


  it('Delay 1 seconds to output by default delay config', function(){
    var clock = sinon.useFakeTimers();
    delay_node_id = engine.addNode("DELAY");
    default_config = engine.getNodeConfigs(delay_node_id);
    engine.configNode(delay_node_id, {'delay' : default_config['delay']['defaultValue']});
    number_node_id = engine.addNode("NUMBER");
    engine.configNode(number_node_id, {'number' : 6});
    engine.connect(number_node_id, 'number', delay_node_id, 'a');
    expect(cb_out_node_id).to.be.not.equal(delay_node_id);
    clock.tick(1000);
    expect(cb_out_node_id).to.be.eql(delay_node_id);
    expect(cb_out_name).to.be.eql('b');
    expect(cb_out_value).to.be.eql(6);
    clock.restore();
  });

  // negative delay error ...
  it('Delay n seconds to output by external delay setting', function(){
    var clock = sinon.useFakeTimers();
    delay_node_id = engine.addNode("DELAY");
    number_a_id = engine.addNode("NUMBER");
    clock.tick(200);
    number_delay_id = engine.addNode("NUMBER");
    engine.connect(number_a_id, 'number', delay_node_id, 'a');
    engine.connect(number_delay_id, 'number', delay_node_id, 'delay');
    for (var i=0; i<delay_external.length; i++){
      console.log("time : " + i + " delay_external[i].seconds: " + delay_external[i].seconds);
      engine.configNode(number_delay_id, {'number': delay_external[i].seconds});
      engine.configNode(number_a_id, {'number': delay_external[i].number});
      if (delay_external[i].seconds > 0){
        expect(cb_out_node_id).to.be.not.equal(delay_node_id);
        milliseconds = delay_external[i].seconds * 1000;
        console.log('milliseconds : ' + milliseconds);
        clock.tick(milliseconds);
        console.log("cb_out_node_id: " + cb_out_node_id);
        console.log("cb_out_name: " + cb_out_name);
        console.log("cb_out_value: " + cb_out_value);
        expect(cb_out_name).to.be.eql('b');
        expect(cb_out_value).to.be.eql(delay_external[i].number);
      }else{
        console.log("---------------" + i);
        clock.tick(3);
        console.log("cb_out_node_id: " + cb_out_node_id);
        console.log("cb_out_name: " + cb_out_name);
        console.log("cb_out_value: " + cb_out_value);

        expect(cb_out_name).to.be.eql('b');
        expect(cb_out_value).to.be.eql(delay_external[i].number);
      }
    }
    clock.restore();
  });

  it('Config delay will be useless when external input connected with delay port', function(){
    var clock = sinon.useFakeTimers();
    delay_node_id = engine.addNode("DELAY");
    number_a_id = engine.addNode("NUMBER");
    clock.tick(200);
    number_delay_id = engine.addNode("NUMBER");
    engine.connect(number_a_id, 'number', delay_node_id, 'a');
    engine.connect(number_delay_id, 'number', delay_node_id, 'delay');
    engine.configNode(number_delay_id, {'number' : 5});
    engine.configNode(number_a_id, {'number' : 2});
    // config delay param
    engine.configNode(delay_node_id, {'delay' : 3});
    milliseconds = 3 * 1000;
    clock.tick(milliseconds);
    expect(cb_out_node_id).to.be.not.equal(delay_node_id);
    milliseconds = 2 * 1000;
    clock.tick(milliseconds);
    expect(cb_out_node_id).to.be.eql(delay_node_id);
    expect(cb_out_name).to.be.eql('b');
    expect(cb_out_value).to.be.eql(2);
    clock.restore();
  });

  it('When delay time reset (config), the delay operation reset', function(){
    var clock = sinon.useFakeTimers();
    delay_node_id = engine.addNode("DELAY");
    default_config = engine.getNodeConfigs(delay_node_id);
    // first time to set 5 second delay
    engine.configNode(delay_node_id, {'delay' : 5});
    number_node_id = engine.addNode("NUMBER");
    engine.configNode(number_node_id, {'number' : 6});
    engine.connect(number_node_id, 'number', delay_node_id, 'a');
    // second time to set 3 second delay
    engine.configNode(delay_node_id, {'delay' : 3});
    expect(cb_out_node_id).to.be.not.equal(delay_node_id);
    clock.tick(3000);
    expect(cb_out_node_id).to.be.eql(delay_node_id);
    expect(cb_out_name).to.be.eql('b');
    expect(cb_out_value).to.be.eql(6);
    clock.restore();
  });

  it('When delay time reset (external node), the delay operation reset', function(){
    var clock = sinon.useFakeTimers();
    delay_node_id = engine.addNode("DELAY");
    default_config = engine.getNodeConfigs(delay_node_id);
    number_a_id = engine.addNode("NUMBER");
    clock.tick(501);
    number_delay_id = engine.addNode("NUMBER");
    engine.connect(number_a_id, 'number', delay_node_id, 'a');
    engine.connect(number_delay_id, 'number', delay_node_id, 'delay');
    engine.configNode(number_node_id, {'number' : 6});
    // first time to set 5 second delay
    engine.configNode(number_delay_id, {'number' : 5});
    // second time to set 3 second delay
    engine.configNode(number_delay_id, {'number' : 3});
    expect(cb_out_node_id).to.be.not.equal(delay_node_id);
    clock.tick(3000);
    expect(cb_out_node_id).to.be.eql(delay_node_id);
    expect(cb_out_name).to.be.eql('b');
    expect(cb_out_value).to.be.eql(6);
    clock.restore();
  });

  it('Output b can be exported to other node', function(){
    var clock = sinon.useFakeTimers();
    delay_node_id = engine.addNode("DELAY");
    default_config = engine.getNodeConfigs(delay_node_id);
    engine.configNode(delay_node_id, {'delay' : default_config['delay']['defaultValue']});
    number_node_id = engine.addNode("NUMBER");
    engine.configNode(number_node_id, {'number' : 6});
    engine.connect(number_node_id, 'number', delay_node_id, 'a');
    expect(cb_out_node_id).to.be.not.equal(delay_node_id);
    clock.tick(1000);
    expect(cb_out_node_id).to.be.eql(delay_node_id);
    expect(cb_out_name).to.be.eql('b');
    expect(cb_out_value).to.be.eql(6);
    clock.tick(200);
    add_node_id = engine.addNode("ADD");
    engine.connect(delay_node_id, 'b', add_node_id, 'a');
    expect(cb_in_node_id).to.be.eql(add_node_id);
    expect(cb_in_name).to.be.eql('a');
    expect(cb_in_value).to.be.eql(6);
    clock.restore();
  });

  it('Remove a delay node', function(){
    delay_node_id = engine.addNode("DELAY");
    node = engine.getActiveNodeCache();
    expect(node).to.include.keys(delay_node_id);
    // console.log("AAA: " + JSON.stringify(node));
    engine.removeNode(delay_node_id);
    node = engine.getActiveNodeCache();
    expect(node).to.be.empty
  });

});


