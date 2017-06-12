var expect = require('chai').expect;
var sinon = require("sinon");
var engine = "";
var cb_in_node_id = "";
var cb_in_name = "";
var cb_in_value = 0;
var cb_out_node_id = "";
var cb_out_name = "";
var cb_out_value = 0;

var generator_config = {
  func : {defaultValue : 'sin'},
  wavelength : {defaultValue : 3},
  amplitude : {defaultValue : 255}
}

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


describe('GENERATOR node', function(){

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

  it('Config parameters initial checking',function() {
    generator_node_id = engine.addNode("GENERATOR");
    default_config = engine.getNodeConfigs(generator_node_id);
    expect(default_config.func.defaultValue).to.be.eql(generator_config.func.defaultValue);
    expect(default_config.wavelength.defaultValue).to.be.eql(generator_config.wavelength.defaultValue);
    expect(default_config.amplitude.defaultValue).to.be.eql(generator_config.amplitude.defaultValue);
  });

  it('Generate default function with default settings', function(){
    var clock = sinon.useFakeTimers();
    generator_node_id = engine.addNode("GENERATOR");
    default_config = engine.getNodeConfigs(generator_node_id);
    engine.configNode(generator_node_id, {'func' : default_config.func.defaultValue});
    engine.configNode(generator_node_id, {'wavelength' : default_config.wavelength.defaultValue});
    engine.configNode(generator_node_id, {'amplitude' : default_config.amplitude.defaultValue});
    value = undefined;
    for(var i=1; i < 11; i++){
     // console.log('-----------------------------------------');
      clock.tick(i*1000/2);
     // console.log('cb_out_node_id: ' + cb_out_node_id);
     // console.log('cb_out_name: ' + cb_out_name);
      console.log('cb_out_value: ' + cb_out_value);
      expect(cb_out_node_id).to.be.eql(generator_node_id);
      expect(cb_out_name).to.be.eql('output');
      expect(cb_out_value).to.be.not.equal(value);
      value = cb_out_value;
    }
    clock.restore();
  });

  it('Generate square function with default settings', function(){
    var clock = sinon.useFakeTimers();
    generator_node_id = engine.addNode("GENERATOR");
    default_config = engine.getNodeConfigs(generator_node_id);
    engine.configNode(generator_node_id, {'func' : 'square'});
    engine.configNode(generator_node_id, {'wavelength' : default_config.wavelength.defaultValue});
    engine.configNode(generator_node_id, {'amplitude' : default_config.amplitude.defaultValue});
    value = undefined;
    // 17
    clock.tick(500);
    expect(cb_out_name).to.be.eql('output');
    expect(cb_out_value).to.be.eql(-default_config.amplitude.defaultValue);
    clock.tick(16500);
    expect(cb_out_name).to.be.eql('output');
    expect(cb_out_value).to.be.eql(default_config.amplitude.defaultValue);
    clock.restore();
  });

  it('Generate triangle function with default settings', function(){
    var clock = sinon.useFakeTimers();
    generator_node_id = engine.addNode("GENERATOR");
    default_config = engine.getNodeConfigs(generator_node_id);
    engine.configNode(generator_node_id, {'func' : 'triangle'});
    engine.configNode(generator_node_id, {'wavelength' : default_config.wavelength.defaultValue});
    engine.configNode(generator_node_id, {'amplitude' : default_config.amplitude.defaultValue});
    value = undefined;
    for(var i=1; i < 11; i++){
      // console.log('-----------------------------------------');
      clock.tick(i*1000/2);
      // console.log('cb_out_node_id: ' + cb_out_node_id);
      // console.log('cb_out_name: ' + cb_out_name);
      console.log('cb_out_value: ' + cb_out_value);
      expect(cb_out_node_id).to.be.eql(generator_node_id);
      expect(cb_out_name).to.be.eql('output');
      expect(cb_out_value).to.be.not.equal(value);
      value = cb_out_value;
    }
    clock.restore();
  });

  it('Remove a generator node', function(){
    generator_node_id = engine.addNode("GENERATOR");
    node = engine.getActiveNodeCache();
    expect(node).to.include.keys(generator_node_id);
    // console.log("AAA: " + JSON.stringify(node));
    engine.removeNode(generator_node_id);
    node = engine.getActiveNodeCache();
    expect(node).to.be.empty
  });

});


