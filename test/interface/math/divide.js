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

var divide_config = {
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

describe('DIVIDE node', function(){

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
    for(var i = 0; i < nodes.length; i++){
      engine.removeNode(nodes[i].id);
    }
    resetParams(cb_in_node_id,cb_in_name,cb_in_value);
    resetParams(cb_out_node_id,cb_out_name,cb_out_value);
  });

  it('Should be with default value 2 of input b',function() {
    divide_node_id = engine.addNode("DIVIDE");
    default_config = engine.getNodeConfigs(divide_node_id);
    expect(default_config[divide_config.config_name]['defaultValue']).to.be.eql(divide_config.default_value);
  });


  it('When config b changed, the divide callback should be called', function() {
    divide_node_id = engine.addNode("DIVIDE");
    // Verify b input changed
    engine.configNode(divide_node_id,{'b':3});
    //Verify c output changed
    expect(cb_out_node_id).to.be.eql(divide_node_id);
    expect(cb_out_name).to.be.eql('c');
    expect(cb_out_value).to.be.eql(0);
  });


  it('When 0 divisor provided, out c should be NaN', function() {
    divide_node_id = engine.addNode("DIVIDE");
    engine.configNode(divide_node_id,{'b':0});
    expect(cb_out_node_id).to.be.eql(divide_node_id);
    expect(cb_out_name).to.be.eql('c');
    expect(cb_out_value).to.be.eql(NaN);
  });


  it('Input ports can be changed by external input', function() {
    for (var i = 0; i < inputPortPkgs.length; i++) {
      divide_node_id = engine.addNode("DIVIDE");
      number_node_id = engine.addNode("NUMBER");
      engine.configNode(number_node_id,{'number' : inputPortPkgs[i].value});
      engine.connect(number_node_id,'number',divide_node_id,inputPortPkgs[i].input_port);
      // verify in port xxx value changed
      expect(cb_in_node_id).to.be.eql(divide_node_id);
      expect(cb_in_name).to.be.eql(inputPortPkgs[i].input_port);
      expect(cb_in_value).to.be.eql(inputPortPkgs[i].value);
    }
  });


  it('Output c can be exported to other node', function(){
    var clock = sinon.useFakeTimers();
    divide_node_id = engine.addNode("DIVIDE");
    clock.tick(500);
    number_a_id = engine.addNode("NUMBER");
    clock.tick(2);
    number_b_id = engine.addNode("NUMBER");
    clock.tick(2);
    divide2_node_id = engine.addNode("DIVIDE");

    engine.configNode(number_a_id,{'number' : 6.6});
    engine.connect(number_a_id,'number',divide_node_id,'a');
    engine.configNode(divide_node_id,{'b' : -3.3});


    expect(cb_out_node_id).to.be.eql(divide_node_id);
    expect(cb_out_name).to.be.eql('c');
    expect(cb_out_value).to.be.eql(-2);

    engine.connect(divide_node_id,'c',divide2_node_id,'a');
    expect(cb_in_node_id).to.be.eql(divide2_node_id);
    expect(cb_in_name).to.be.eql('a');
    expect(cb_in_value).to.be.eql(-2);

    clock.restore();
  });

  it('Remove an divide node', function(){
    divi_node_id = engine.addNode("DIVIDE");
    node = engine.getActiveNodeCache();
    expect(node).to.include.keys(divi_node_id);
    // console.log("AAA: " + JSON.stringify(node));
    engine.removeNode(divi_node_id);
    node = engine.getActiveNodeCache();
    expect(node).to.be.empty
  });
});


