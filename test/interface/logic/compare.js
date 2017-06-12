var expect = require('chai').expect;
var sinon = require("sinon");
var engine = "";

var compare_config = {
  operation : '>',
  b : 0,
  operation_opts : [">",">=","<","<=","=","!="]
};

var operation_data = [
  {'operation_name' : '>', 'port_b' : 0, 'result' : 0, 'else' : 100},
  {'operation_name' : '>=', 'port_b' : 0, 'result' : 100, 'else' : 0},
  {'operation_name' : '<', 'port_b' : 0, 'result' : 0, 'else' : 100},
  {'operation_name' : '<=', 'port_b' : 0, 'result' : 100, 'else' : 0},
  {'operation_name' : '=', 'port_b' : 0, 'result' : 100, 'else' : 0},
  {'operation_name' : '!=', 'port_b' : 0, 'result' : 0, 'else' : 100},
];

var datadriven = [
  {'operation_name' : '>', 'data' : 1, 'port_b' : 0, 'result' : 100, 'else' : 0},
  {'operation_name' : '>', 'data' : 0, 'port_b' : 1, 'result' : 0, 'else' : 100},
  {'operation_name' : '>', 'data' : 0, 'port_b' : -1, 'result' : 100, 'else' : 0},
  {'operation_name' : '>', 'data' : -1, 'port_b' : 0, 'result' : 0, 'else' : 100},
  {'operation_name' : '>', 'data' : 0, 'port_b' : 0, 'result' : 0, 'else' : 100},

  {'operation_name' : '>=', 'data' : 1, 'port_b' : 0, 'result' : 100, 'else' : 0},
  {'operation_name' : '>=', 'data' : 0, 'port_b' : 1, 'result' : 0, 'else' : 100},
  {'operation_name' : '>=', 'data' : 0, 'port_b' : -1, 'result' : 100, 'else' : 0},
  {'operation_name' : '>=', 'data' : -1, 'port_b' : 0, 'result' : 0, 'else' : 100},
  {'operation_name' : '>=', 'data' : 0, 'port_b' : 0, 'result' : 100, 'else' : 0},

  {'operation_name' : '<', 'data' : 1, 'port_b' : 0, 'result' : 0, 'else' : 100},
  {'operation_name' : '<', 'data' : 0, 'port_b' : 1, 'result' : 100, 'else' : 0},
  {'operation_name' : '<', 'data' : 0, 'port_b' : -1, 'result' : 0, 'else' : 100},
  {'operation_name' : '<', 'data' : -1, 'port_b' : 0, 'result' : 100, 'else' : 0},
  {'operation_name' : '<', 'data' : 0, 'port_b' : 0, 'result' : 0, 'else' : 100},

  {'operation_name' : '<=', 'data' : 1, 'port_b' : 0, 'result' : 0, 'else' : 100},
  {'operation_name' : '<=', 'data' : 0, 'port_b' : 1, 'result' : 100, 'else' : 0},
  {'operation_name' : '<=', 'data' : 0, 'port_b' : -1, 'result' : 0, 'else' : 100},
  {'operation_name' : '<=', 'data' : -1, 'port_b' : 0, 'result' : 100, 'else' : 0},
  {'operation_name' : '<=', 'data' : 0, 'port_b' : 0, 'result' : 100, 'else' : 0},

  {'operation_name' : '=', 'data' : 1, 'port_b' : 0, 'result' : 0, 'else' : 100},
  {'operation_name' : '=', 'data' : 0, 'port_b' : 1, 'result' : 0, 'else' : 100},
  {'operation_name' : '=', 'data' : 0, 'port_b' : -1, 'result' : 0, 'else' : 100},
  {'operation_name' : '=', 'data' : -1, 'port_b' : 0, 'result' : 0, 'else' : 100},
  {'operation_name' : '=', 'data' : 0, 'port_b' : 0, 'result' : 100, 'else' : 0},

  {'operation_name' : '!=', 'data' : 1, 'port_b' : 0, 'result' : 100, 'else' : 0},
  {'operation_name' : '!=', 'data' : 0, 'port_b' : 1, 'result' : 100, 'else' : 0},
  {'operation_name' : '!=', 'data' : 0, 'port_b' : -1, 'result' : 100, 'else' : 0},
  {'operation_name' : '!=', 'data' : -1, 'port_b' : 0, 'result' : 100, 'else' : 0},
  {'operation_name' : '!=', 'data' : 0, 'port_b' : 0, 'result' : 0, 'else' : 100}
];


describe('COMPARE node', function(){

  beforeEach(function() {
    engine = require('../../../lib/engine/flow').create({"driver": "serial", "loglevel": "WARN"});

  });

  afterEach(function(){
    nodes = engine.getActiveNodes();
    console.log("node length: " + nodes.length);
    for(var i = 0; i < nodes.length; i++){
      engine.removeNode(nodes[i].id);
    }
    // clear up engine
    engine.stop();
    engine = "";
  });

  it('Config parameters initial checking', function() {
    compare_node_id = engine.addNode("COMPARE");
    default_config = engine.getNodeConfigs(compare_node_id);
    //console.log(JSON.stringify(default_config));
    expect(default_config.operation.defaultValue).to.be.eql(compare_config.operation);
    expect(default_config.operation.options).to.be.eql(compare_config.operation_opts);
    expect(default_config.b.defaultValue).to.be.eql(compare_config.b);
  });


  it('When port a changed, the function run should be called', function(){
    compare_node_id = engine.addNode("COMPARE");
    number_node_id =  engine.addNode("NUMBER");

    function nodeOutputCallBack(id, portName, value){
      if(portName === 'result' && id === compare_node_id){
        expect(id).to.be.eql(compare_node_id);
        expect(portName).to.be.eql('result');
        expect(value).to.be.eql(100);
        console.log("result:" + value)
      }
      else if(portName === 'else' && id === compare_node_id){
        expect(value).to.be.eql(0);
        console.log("else:" + value)
      }
    }
    default_configs = engine.getNodeConfigs(compare_node_id);
    engine.configNode(compare_node_id, {'operation' : default_configs['operation']['defaultValue'],'b':default_configs['b']['defaultValue']});
    engine.configNode(number_node_id, {'number' : 2});
    engine.on('NodeOutputChanged', nodeOutputCallBack);
    engine.connect(number_node_id, 'number', compare_node_id, 'a');
  });

  it('When config operation changed, the function run should be called', function(){

    for(var i = 0; i < operation_data.length; i++){
      engine = require('../../../lib/engine/flow').create({"driver": "serial", "loglevel": "WARN"});
      compare_node_id = engine.addNode("COMPARE");
     /* console.log("times: " + i);
      console.log("operation:" + operation_data[i].operation_name + " result:" + operation_data[i].result + " else:" + operation_data[i].else);
      console.log("config b : " + operation_data[i].port_b);*/

      function nodeOutputCallBack(id, portName, value){
        if(portName === 'result' && id === compare_node_id){
          expect(value).to.be.eql(operation_data[i]['result']);
          console.log("result:" + value);
        }
        else if(portName === 'else' && id === compare_node_id){
          expect(value).to.be.eql(operation_data[i]['else']);
          console.log("else:" + value);
        }
      }
      engine.on('NodeOutputChanged', nodeOutputCallBack);
      engine.configNode(compare_node_id, {'operation' : operation_data[i].operation_name, 'b' : operation_data[i].port_b});
    }
  });

  it('Data driven to verify the function operation', function(){
    var flag = false;
    function nodeOutputCallBack1(id, portName, value){
      //console.log("aaaa-------");
      if(portName === 'result' && id === compare_node_id && flag){
        expect(value).to.be.eql(datadriven[i].result);
        console.log("result:" + value);
      }
      else if(portName === 'else' && id === compare_node_id && flag){
        expect(value).to.be.eql(datadriven[i].else);
        console.log("else:" + value);
      }
    }
    engine.on('NodeOutputChanged', nodeOutputCallBack1);

    for(var i=0; i < datadriven.length; i++){
      engine = require('../../../lib/engine/flow').create({"driver": "serial", "loglevel": "WARN"});
      compare_node_id = engine.addNode('COMPARE');
      number_node_id =  engine.addNode("NUMBER");
      console.log("times : " + i);
      console.log("operation:" + datadriven[i].operation_name + " data:" + datadriven[i].data + " port_b:" + datadriven[i].port_b
          + " result:" + datadriven[i].result + " else:" + datadriven[i].else);
      engine.connect(number_node_id, 'number', compare_node_id, 'a');
      engine.configNode(number_node_id, {'number' : datadriven[i].data});
      engine.configNode(compare_node_id, {'operation' : datadriven[i].operation_name});
      flag = true;
      //engine.configNode(compare_node_id, {'operation' : datadriven[i].operation_name, 'b' : datadriven[i].port_b});
      engine.configNode(compare_node_id, {'b' : datadriven[i].port_b});
      flag = false;
    }
  });

  it('Output result can be exported to other node', function(){
    compare_node_id = engine.addNode("COMPARE");
    compare2_node_id = engine.addNode("COMPARE");
    number_node_id =  engine.addNode("NUMBER");

    function nodeOutputCallBack(id, portName, value){
      if(portName === 'result' && id === compare_node_id){
        expect(id).to.be.eql(compare_node_id);
        expect(portName).to.be.eql('result');
        expect(value).to.be.eql(0);
        console.log("result:" + value)
      }
      else if(portName === 'else' && id === compare_node_id){
        expect(value).to.be.eql(100);
        console.log("else:" + value)
      }
    }

    default_configs = engine.getNodeConfigs(compare_node_id);
    engine.configNode(compare_node_id, {'operation' : default_configs['operation']['defaultValue'],'b':default_configs['b']['defaultValue']});
    engine.on('NodeOutputChanged', nodeOutputCallBack);
    engine.connect(number_node_id, 'number', compare_node_id, 'b');
    engine.connect(compare_node_id, 'result', compare2_node_id, 'a');
    engine.connect(compare_node_id, 'else', compare2_node_id, 'b');
    engine.configNode(number_node_id, {'number' : 1});
  });

  it('Remove a compare node', function(){
    compare_node_id = engine.addNode("COMPARE");
    node = engine.getActiveNodeCache();
    expect(node).to.include.keys(compare_node_id);
    // console.log("AAA: " + JSON.stringify(node));
    engine.removeNode(compare_node_id);
    node = engine.getActiveNodeCache();
    expect(node).to.be.empty;
  });
})