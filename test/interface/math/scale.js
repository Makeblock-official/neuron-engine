var expect = require('chai').expect;
var sinon = require("sinon");
var engine = "";
var cb_in_node_id = "";
var cb_in_name = "";
var cb_in_value = 0;
var cb_out_node_id = "";
var cb_out_name = "";
var cb_out_value = 0;

var scale_configs = {
  minin : 0,
  maxin : 100,
  minout : 0,
  maxout : 255
};

var scale_value_check = [
  {minin : 0, maxin : 99, minout : 5, maxout : 105, a : 0, out : 5},
  {minin : 99, maxin : 99, minout : 5, maxout : 5, a : 0, out : NaN},
  {minin : 0, maxin : 0, minout : 0, maxout : 255, a : 0, out : NaN},
  {minin : 0, maxin : 99, minout : 5, maxout : 5, a : 0, out : NaN}
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

describe('SCALE node', function(){

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
    scale_node_id = engine.addNode("MAP");
    default_configs = engine.getNodeConfigs(scale_node_id);
    expect(default_configs['minin']['defaultValue']).to.be.eql(scale_configs.minin);
    expect(default_configs['minout']['defaultValue']).to.be.eql(scale_configs.minout);
    expect(default_configs['maxin']['defaultValue']).to.be.eql(scale_configs.maxin);
    expect(default_configs['maxout']['defaultValue']).to.be.eql(scale_configs.maxout);
  });

  it('When port a changed, the scale run should be called', function() {
    scale_node_id = engine.addNode("MAP");
    number_node_id = engine.addNode("NUMBER");
    default_configs = engine.getNodeConfigs(scale_node_id);
    engine.configNode(scale_node_id, {'minin' : default_configs['minin']['defaultValue']});
    engine.configNode(scale_node_id, {'maxin' : default_configs['maxin']['defaultValue']});
    engine.configNode(scale_node_id, {'minout' : default_configs['minout']['defaultValue']});
    engine.configNode(scale_node_id, {'maxout' : default_configs['maxout']['defaultValue']});
    engine.connect(number_node_id,'number',scale_node_id,'a');
    engine.configNode(number_node_id,{'number':100});
    // Verify a input changed
    expect(cb_in_node_id).to.be.eql(scale_node_id);
    expect(cb_in_name).to.be.eql('a');
    expect(cb_in_value).to.be.eql(100);
    //Verify c output changed
    expect(cb_out_node_id).to.be.eql(scale_node_id);
    expect(cb_out_name).to.be.eql('b');
    expect(cb_out_value).to.be.eql(255);
  });

  it('Data driven to verify the scale operation', function(){
    scale_node_id = engine.addNode("MAP");
    number_node_id = engine.addNode("NUMBER");
    engine.connect(number_node_id,'number',scale_node_id,'a');
    for (var i = 0; i < scale_value_check.length; i++){
      engine.configNode(scale_node_id, {'minin' : scale_value_check[i].minin});
      engine.configNode(scale_node_id, {'maxin' : scale_value_check[i].maxin});
      engine.configNode(scale_node_id, {'minout' : scale_value_check[i].minout});
      engine.configNode(scale_node_id, {'maxout' : scale_value_check[i].maxout});
      engine.configNode(number_node_id, {'number' : scale_value_check[i].a});
      // Verify a input changed
      expect(cb_in_node_id).to.be.eql(scale_node_id);
      expect(cb_in_name).to.be.eql('a');
      expect(cb_in_value).to.be.eql(scale_value_check[i].a);
      //Verify c output changed
      expect(cb_out_node_id).to.be.eql(scale_node_id);
      expect(cb_out_name).to.be.eql('b');
      expect(cb_out_value).to.be.eql(scale_value_check[i].out);
    }
  });

  it('Output b can be exported to other node', function(){
    scale_node_id = engine.addNode("MAP");
    number_node_id = engine.addNode("NUMBER");
    default_configs = engine.getNodeConfigs(scale_node_id);
    engine.configNode(scale_node_id, {'minin' : default_configs['minin']['defaultValue']});
    engine.configNode(scale_node_id, {'maxin' : default_configs['maxin']['defaultValue']});
    engine.configNode(scale_node_id, {'minout' : default_configs['minout']['defaultValue']});
    engine.configNode(scale_node_id, {'maxout' : default_configs['maxout']['defaultValue']});
    engine.connect(number_node_id,'number',scale_node_id,'a');
    engine.configNode(number_node_id,{'number':100});
    // Verify a input changed
    expect(cb_in_node_id).to.be.eql(scale_node_id);
    expect(cb_in_name).to.be.eql('a');
    expect(cb_in_value).to.be.eql(100);
    //Verify c output changed
    expect(cb_out_node_id).to.be.eql(scale_node_id);
    expect(cb_out_name).to.be.eql('b');
    expect(cb_out_value).to.be.eql(255);

    add_node_id = engine.addNode('ADD');
    engine.connect(scale_node_id, 'b', add_node_id, 'a');
    expect(cb_in_node_id).to.be.eql(add_node_id);
    expect(cb_in_name).to.be.eql('a');
    expect(cb_in_value).to.be.eql(255);
  });

  it('Remove a scale node', function(){
    map_node_id = engine.addNode("MAP");
    node = engine.getActiveNodeCache();
    expect(node).to.include.keys(map_node_id);
    // console.log("AAA: " + JSON.stringify(node));
    engine.removeNode(map_node_id);
    node = engine.getActiveNodeCache();
    expect(node).to.be.empty
  });

});


