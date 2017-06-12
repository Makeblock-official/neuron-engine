var expect = require('chai').expect;
var sinon = require("sinon");
var engine = "";
var cb_in_node_id = "";
var cb_in_name = "";
var cb_in_value = -1;
var cb_out_node_id = "";
var cb_out_name = "";
var cb_out_value = -1;

var random_configs = {
  from : 0,
  to : 100,
  trigger : 0
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
  value = -1;
}

describe('RANDOM node', function(){

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
    random_node_id = engine.addNode("RANDOM");
    default_configs = engine.getNodeConfigs(random_node_id);
    expect(default_configs.from['defaultValue']).to.be.eql(random_configs.from);
    expect(default_configs.to['defaultValue']).to.be.eql(random_configs.to);
    expect(default_configs.trigger['defaultValue']).to.be.eql(random_configs.trigger);
  });

  it('When config trigger changed, the random run should be called', function(){
    random_node_id = engine.addNode("RANDOM");
    engine.configNode(random_node_id,{'trigger' : 'trigger'});
    expect(cb_out_node_id).to.be.eql(random_node_id);
    expect(cb_out_name).to.be.eql('b');
    expect(cb_out_value).to.be.a('number');
  });


  it('When port trigger changed (from <=0 to >0), the random run should be called', function(){
    random_node_id = engine.addNode("RANDOM");
    number_node_id = engine.addNode("NUMBER");
    engine.configNode(number_node_id,{'number' : 1});
    engine.connect(number_node_id, 'number', random_node_id, 'trigger');
    expect(cb_out_node_id).to.be.eql(random_node_id);
    expect(cb_out_name).to.be.eql('b');
    expect(cb_out_value).to.be.a('number');
  });

  it('When port trigger changed (from <=0 to <=0), the random run should not be called', function(){
    random_node_id = engine.addNode("RANDOM");
    number_node_id = engine.addNode("NUMBER");
    engine.configNode(number_node_id,{'number' : -8});
    resetParams(cb_out_node_id,cb_out_name,cb_out_value);
    engine.connect(number_node_id, 'number', random_node_id, 'trigger');
    expect(cb_out_node_id).to.not.equal(random_node_id);
  });

  it('When port trigger changed (from >0 to >0), the random run should not be called', function(){
    random_node_id = engine.addNode("RANDOM");
    number_node_id = engine.addNode("NUMBER");
    engine.configNode(random_node_id,{'number' : 8});
    engine.connect(number_node_id, 'number', random_node_id, 'trigger');
    tmp = cb_out_value;
    engine.configNode(random_node_id,{'number' : 22});
    expect(cb_out_node_id).to.not.equal(random_node_id);
    expect(cb_out_value).to.be.eql(tmp);
  });

  it('When port trigger changed (from >0 to <=0), the random run should not be called', function(){
    random_node_id = engine.addNode("RANDOM");
    number_node_id = engine.addNode("NUMBER");
    engine.configNode(random_node_id,{'number' : 8});
    engine.connect(number_node_id, 'number', random_node_id, 'trigger');
    tmp = cb_out_value;
    engine.configNode(random_node_id,{'number' : -22});
    expect(cb_out_node_id).to.not.equal(random_node_id);
    expect(cb_out_value).to.be.eql(tmp);
  });

  it('When port trigger connected with external input, the trigger configer should be useless', function() {
    random_node_id = engine.addNode("RANDOM");
    number_node_id = engine.addNode("NUMBER");
    engine.configNode(random_node_id,{'number' : 8});
    engine.connect(number_node_id, 'number', random_node_id, 'trigger');
    tmp = cb_out_value;
    engine.configNode(random_node_id,{'triger' : 'triger'});
    expect(cb_out_node_id).to.not.equal(random_node_id);
    expect(cb_out_value).to.be.eql(tmp);
  });

  it('Delete a random node', function(){
    random_node_id = engine.addNode("RANDOM");
    node = engine.getActiveNodeCache();
    expect(node).to.include.keys(random_node_id);
    // console.log("AAA: " + JSON.stringify(node));
    engine.removeNode(random_node_id);
    node = engine.getActiveNodeCache();
    expect(node).to.be.empty
  });
});


