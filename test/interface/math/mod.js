var expect = require('chai').expect;
var sinon = require("sinon");
var engine = "";
var cb_in_node_id = "";
var cb_in_name = "";
var cb_in_value = 0;
var cb_out_node_id = "";
var cb_out_name = "";
var cb_out_value = 0;

var mode_config = {
  config_name : "b",
  default_value : 2
};

var inputPortPkgs = [
  {
    input_port : "a",
    value : 11
  }
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
  value = 0;
}

describe('MOD node', function(){

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
    console.log("node length: " + nodes.length);
    for(var i = 0; i < nodes.length; i++){
      engine.removeNode(nodes[i].id);
    }
    resetParams(cb_in_node_id,cb_in_name,cb_in_value);
    resetParams(cb_out_node_id,cb_out_name,cb_out_value);
  });

  it('Should be with default value 2 of config value',function() {
    mod_node_id = engine.addNode("MOD");
    default_config = engine.getNodeConfigs(mod_node_id);
    expect(default_config[mode_config.config_name]['defaultValue']).to.be.eql(mode_config.default_value);
  });

  it('When config b changed, the mod callback should be called', function() {
    mod_node_id = engine.addNode("MOD");
    // Verify b input changed
    engine.configNode(mod_node_id,{'b':3});
    //Verify c output changed
    expect(cb_out_node_id).to.be.eql(mod_node_id);
    expect(cb_out_name).to.be.eql('c');
    expect(cb_out_value).to.be.eql(0);
  });

  it('Input ports can be changed by external input', function() {
    for (var i = 0; i < inputPortPkgs.length; i++) {
      mod_node_id = engine.addNode("MOD");
      number_node_id = engine.addNode("NUMBER");
      engine.configNode(number_node_id,{'number' : inputPortPkgs[i].value});
      engine.connect(number_node_id,'number',mod_node_id,inputPortPkgs[i].input_port);
      // verify in port xxx value changed
      expect(cb_in_node_id).to.be.eql(mod_node_id);
      expect(cb_in_name).to.be.eql(inputPortPkgs[i].input_port);
      expect(cb_in_value).to.be.eql(inputPortPkgs[i].value);
    }
  });

  it('When 0 divisor provided, out c should be NaN', function() {
    mod_node_id = engine.addNode("MOD");
    // Verify b input changed
    engine.configNode(mod_node_id,{'b': 0});
    //Verify c output changed
    expect(cb_out_node_id).to.be.eql(mod_node_id);
    expect(cb_out_name).to.be.eql('c');
    expect(cb_out_value).to.be.eql(NaN);
  });


  it('Remove an mod node', function(){
    mod_node_id = engine.addNode("MOD");
    node = engine.getActiveNodeCache();
    expect(node).to.include.keys(mod_node_id);
    // console.log("AAA: " + JSON.stringify(node));
    engine.removeNode(mod_node_id);
    node = engine.getActiveNodeCache();
    expect(node).to.be.empty
  });
});


