var expect = require('chai').expect;
var sinon = require("sinon");
var engine = "";
var cb_in_node_id = "";
var cb_in_name = "";
var cb_in_value = 0;
var cb_out_node_id = "";
var cb_out_name = "";
var cb_out_value = 0;

var round_config = {
  config_name : 'round',
  default_value : 'round',
  type : 'options',
  options : ['round', 'floor', 'ceil']
};

var scale_value_check = [
  {option : 'round', a : 4.4, b : 4},
  {option : 'round', a : 4.5, b : 5},
  {option : 'floor', a : 3.9, b : 3},
  {option : 'floor', a : 3.4, b : 3},
  {option : 'ceil', a : 4.01, b : 5}
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

describe('ROUND node', function(){

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


  it('Config parameters initial checking',function(){
    round_node_id = engine.addNode("ROUND");
    default_configs = engine.getNodeConfigs(round_node_id);
    expect(default_configs[round_config.config_name]['defaultValue']).to.be.eql(round_config.default_value);
    expect(default_configs[round_config.config_name]['options']).to.eql(round_config.options);
  });

  it('When port a changed, the round run should be called (default round)', function() {
    round_node_id = engine.addNode("ROUND");
    number_node_id = engine.addNode("NUMBER");
    default_configs = engine.getNodeConfigs(round_node_id);
    default_round = default_configs[round_config.config_name]['defaultValue'];
    engine.configNode(round_node_id,{'round' : default_round});
    engine.connect(number_node_id,'number',round_node_id,'a');
    engine.configNode(number_node_id,{'number':4.4});

    // Verify a input changed
    expect(cb_in_node_id).to.be.eql(round_node_id);
    expect(cb_in_name).to.be.eql('a');
    expect(cb_in_value).to.be.eql(4.4);
    //Verify b output changed
    expect(cb_out_node_id).to.be.eql(round_node_id);
    expect(cb_out_name).to.be.eql('b');
    expect(cb_out_value).to.be.eql(4);
  });

  it('Data driven to verify the round operation by changing input number', function(){
    round_node_id = engine.addNode("ROUND");
    number_node_id = engine.addNode("NUMBER");
    engine.connect(number_node_id,'number',round_node_id,'a');

    for (var i = 0; i < scale_value_check.length; i++){
      engine.configNode(round_node_id, {'round' : scale_value_check[i].option});
      engine.configNode(number_node_id, {'number' : scale_value_check[i].a});
      expect(cb_out_value).to.be.eql(scale_value_check[i].b);
    }
  });

  it('Data driven to verify the round operation by changing option', function(){
    round_node_id = engine.addNode("ROUND");
    number_node_id = engine.addNode("NUMBER");
    engine.connect(number_node_id,'number',round_node_id,'a');

    for (var i = 0; i < scale_value_check.length; i++){
      engine.configNode(number_node_id, {'number' : scale_value_check[i].a});
      engine.configNode(round_node_id, {'round' : scale_value_check[i].option});
      expect(cb_out_value).to.be.eql(scale_value_check[i].b);
    }
  });

  it('Output b can be exported to other node', function(){
    round_node_id = engine.addNode("ROUND");
    number_node_id = engine.addNode("NUMBER");
    default_configs = engine.getNodeConfigs(round_node_id);
    default_round = default_configs[round_config.config_name]['defaultValue'];
    engine.configNode(round_node_id,{'round' : default_round});
    engine.connect(number_node_id,'number',round_node_id,'a');
    engine.configNode(number_node_id,{'number':4.4});
    // Verify a input changed
    expect(cb_in_node_id).to.be.eql(round_node_id);
    expect(cb_in_name).to.be.eql('a');
    expect(cb_in_value).to.be.eql(4.4);
    //Verify b output changed
    expect(cb_out_node_id).to.be.eql(round_node_id);
    expect(cb_out_name).to.be.eql('b');
    expect(cb_out_value).to.be.eql(4);

    add_node_id = engine.addNode('ADD');
    engine.connect(round_node_id, 'b', add_node_id, 'a');
    expect(cb_in_node_id).to.be.eql(add_node_id);
    expect(cb_in_name).to.be.eql('a');
    expect(cb_in_value).to.be.eql(4);
  });

  it('Round a scale node', function(){
    round_node_id = engine.addNode("ROUND");
    node = engine.getActiveNodeCache();
    expect(node).to.include.keys(round_node_id);
    // console.log("AAA: " + JSON.stringify(node));
    engine.removeNode(round_node_id);
    node = engine.getActiveNodeCache();
    expect(node).to.be.empty
  });
});


