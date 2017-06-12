var expect = require('chai').expect;
var sinon = require("sinon");
var engine = "";

var output_change_data = {
  'id' : null,
  'portName' : null,
  'value' : null
}

function nodeOutputCallBack(id, portName, value){
  output_change_data['id'] = id;
  output_change_data['portName'] = portName;
  output_change_data['value'] = value;
}

describe('COMPARE node', function(){
  before(function() {
    engine = require('../../../lib/engine/flow').create({"driver": "serial", "loglevel": "WARN"});

    engine.on('NodeOutputChanged', nodeOutputCallBack);
  });

  after(function() {
    engine.removeListener('NodeOutputChanged', nodeOutputCallBack);
    engine.stop();
    engine = null;
  });

  afterEach(function(){
    nodes = engine.getActiveNodes();
    for(var i = 0; i < nodes.length; i++){
      engine.removeNode(nodes[i].id);
    }
    output_change_data['id'] = null;
  	output_change_data['portName'] = null;
  	output_change_data['value'] = null;
  });

  it('number_003 : config number', function(){
  	var number_node_id = engine.addNode("NUMBER");
  	var number = 3
  	engine.configNode(number_node_id, {'number' : number});
  	console.log(JSON.stringify(output_change_data));
  	expect(number_node_id).to.be.eql(output_change_data.id);
    expect('number').to.be.eql(output_change_data.portName);
    expect(number).to.be.eql(output_change_data.value);
  });

  it('number_004 : send number', function(){
  	var number_node_id = engine.addNode("NUMBER");
  	var number = 3;
  	var slider_node_id = engine.addNode("SLIDER");
  	engine.configNode(number_node_id, {'number' : number});
  	engine.connect(slider_node_id, 'state', number_node_id, 'send');
  	engine.configNode(slider_node_id, {'state' : 1});
  	console.log(JSON.stringify(output_change_data));
  	expect(number_node_id).to.be.eql(output_change_data.id);
    expect('number').to.be.eql(output_change_data.portName);
    expect(number).to.be.eql(output_change_data.value);
  });

});