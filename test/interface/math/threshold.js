var expect = require('chai').expect;
var sinon = require("sinon");
var engine = "";
var cb_in_node_id = "";
var cb_in_name = "";
var cb_in_value = 0;
var cb_out_node_id = "";
var cb_out_name = "";
var cb_out_value = 0;

var threshold_configs = {
  from : 0,
  to : 255
};

var threshold_value_check = [
  {from : 0, to : 255, a : -1, b : 0},
  {from : 0, to : 255, a : 0, b : 0},
  {from : 0, to : 255, a : 20, b : 20},
  {from : 0, to : 255, a : 255, b : 255},
  {from : 0, to : 255, a : 300, b : 0}
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
  id = '';
  portname = '';
  value = 0;
}

describe('THRESHOLD node', function(){

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
    threshold_node_id = engine.addNode("THRESHOLD");
    default_configs = engine.getNodeConfigs(threshold_node_id);
    //console.log(JSON.stringify(default_configs));
    expect(default_configs['from']['defaultValue']).to.be.eql(threshold_configs.from);
    expect(default_configs['to']['defaultValue']).to.be.eql(threshold_configs.to);
  });

  it('When port a changed, the threshold run should be called', function() {
    threshold_node_id = engine.addNode("THRESHOLD");
    number_node_id = engine.addNode("NUMBER");
    default_configs = engine.getNodeConfigs(threshold_node_id);
    engine.configNode(threshold_node_id,{'from': default_configs['from']['defaultValue']});
    engine.configNode(threshold_node_id,{'to': default_configs['to']['defaultValue']});
    engine.connect(number_node_id,'number',threshold_node_id,'a');
    engine.configNode(number_node_id,{'number':11});
    // Verify a input changed
    expect(cb_in_node_id).to.be.eql(threshold_node_id);
    expect(cb_in_name).to.be.eql('a');
    expect(cb_in_value).to.be.eql(11);
    //Verify c output changed
    expect(cb_out_node_id).to.be.eql(threshold_node_id);
    expect(cb_out_name).to.be.eql('b');
    expect(cb_out_value).to.be.eql(11);
  });

  it('Data driven to verify the threshold operation', function(){
    threshold_node_id = engine.addNode("THRESHOLD");
    number_node_id = engine.addNode("NUMBER");
    engine.connect(number_node_id,'number',threshold_node_id,'a');
    for (var i = 0; i < threshold_value_check.length; i++){
      engine.configNode(threshold_node_id, {'from' : threshold_value_check[i].from});
      engine.configNode(threshold_node_id, {'to' : threshold_value_check[i].to});
      engine.configNode(number_node_id, {'number' : threshold_value_check[i].a});
      // Verify a input changed
      expect(cb_in_node_id).to.be.eql(threshold_node_id);
      expect(cb_in_name).to.be.eql('a');
      expect(cb_in_value).to.be.eql(threshold_value_check[i].a);
      //Verify b output changed
      expect(cb_out_node_id).to.be.eql(threshold_node_id);
      expect(cb_out_name).to.be.eql('b');
      expect(cb_out_value).to.be.eql(threshold_value_check[i].b);
    }
  });

  it('Output b can be exported to other node', function() {
    threshold_node_id = engine.addNode("THRESHOLD");
    number_node_id = engine.addNode("NUMBER");
    default_configs = engine.getNodeConfigs(threshold_node_id);
    engine.configNode(threshold_node_id,{'from': default_configs['from']['defaultValue']});
    engine.configNode(threshold_node_id,{'to': default_configs['to']['defaultValue']});
    engine.connect(number_node_id,'number',threshold_node_id,'a');
    engine.configNode(number_node_id,{'number':11});
    // Verify a input changed
    expect(cb_in_node_id).to.be.eql(threshold_node_id);
    expect(cb_in_name).to.be.eql('a');
    expect(cb_in_value).to.be.eql(11);
    //Verify c output changed
    expect(cb_out_node_id).to.be.eql(threshold_node_id);
    expect(cb_out_name).to.be.eql('b');
    expect(cb_out_value).to.be.eql(11);


    add_node_id = engine.addNode('ADD');
    engine.connect(threshold_node_id, 'b', add_node_id, 'a');
    expect(cb_in_node_id).to.be.eql(add_node_id);
    expect(cb_in_name).to.be.eql('a');
    expect(cb_in_value).to.be.eql(11);
  });

  it('Threshold a scale node', function(){
    threshold_node_id = engine.addNode("THRESHOLD");
    node = engine.getActiveNodeCache();
    expect(node).to.include.keys(threshold_node_id);
    // console.log("AAA: " + JSON.stringify(node));
    engine.removeNode(threshold_node_id);
    node = engine.getActiveNodeCache();
    expect(node).to.be.empty
  });

});


