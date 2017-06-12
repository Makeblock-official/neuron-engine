var expect = require('chai').expect;
var sinon = require("sinon");
var engine = "";
var cb_in_node_id = "";
var cb_in_name = "";
var cb_in_value = 0;
var cb_out_node_id = "";
var cb_out_name = "";
var cb_out_value = 0;


var timer_config = {
  'value' : 1,
  'interval' : 1,
  'duty' : 0.5
};

var config_data = [
  {'value' : -22, 'interval' : 3, 'duty' : 0.5},
  {'value' : 0.3, 'interval' : 5, 'duty' : 0.2}
];

var external_value_data = {
  'external_value' : 22,
  'config_value' : -2,
  'interval' : 2,
  'duty' : 0.4
};

var external_interval_data = {
  'external_interval' : 4,
  'value' : 4,
  'config_interval' : 2,
  'duty' : 0.4
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

describe('TIMER node', function(){

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
    timer_node_id = engine.addNode("TIMER");
    default_config = engine.getNodeConfigs(timer_node_id);
    //console.log(JSON.stringify(default_config));
    expect(default_config.value.defaultValue).to.be.eql(timer_config.value);
    expect(default_config.interval.defaultValue).to.be.eql(timer_config.interval);
    expect(default_config.duty.defaultValue).to.be.eql(timer_config.duty);
  });

  it('Output between 0 and 1 by default settings', function(){
    var clock = sinon.useFakeTimers();
    timer_node_id = engine.addNode("TIMER");
    default_config = engine.getNodeConfigs(timer_node_id);
    engine.configNode(timer_node_id, {'value' : default_config.value.defaultValue});
    engine.configNode(timer_node_id, {'interval' : default_config.interval.defaultValue});
    engine.configNode(timer_node_id, {'duty' : default_config.duty.defaultValue});
    var i = 0;
    while(i < 10){
      expect(cb_out_value).to.be.eql(timer_config.value);
      //console.log('----------------------------------- ' + i);
      milliseconds = default_config.interval.defaultValue * (1 - default_config.duty.defaultValue) * 1000;
      //console.log('milliseconds : ' + milliseconds);
      clock.tick(milliseconds);
      expect(cb_out_value).to.be.eql(0);
      milliseconds = default_config.interval.defaultValue * default_config.duty.defaultValue * 1000;
      clock.tick(milliseconds);
      //console.log('milliseconds : ' + milliseconds);
      i++;
    }
    clock.restore();
  });

  it('Output between 0 and n by config settings', function(){
    var clock = sinon.useFakeTimers();
    timer_node_id = engine.addNode("TIMER");
    for(var i = 0; i < config_data.length; i++){
      engine.configNode(timer_node_id, {'value' :config_data[i].value});
      engine.configNode(timer_node_id, {'interval' : config_data[i].interval});
      engine.configNode(timer_node_id, {'duty' : config_data[i].duty});

      var j = 0;
      while(j < 10){
        expect(cb_out_value).to.be.eql(config_data[i].value);
       // console.log('----------------------------------- ' + i);
        milliseconds = config_data[i].interval * (1 - config_data[i].duty) * 1000;
       // console.log('milliseconds : ' + milliseconds);
        clock.tick(milliseconds);
        expect(cb_out_value).to.be.eql(0);
        milliseconds = config_data[i].interval * config_data[i].duty * 1000;
        clock.tick(milliseconds);
       // console.log('milliseconds : ' + milliseconds);
        j++;
      }
    }
    clock.restore();
  });

  it('Output between 0 and n by external settings', function(){
    var clock = sinon.useFakeTimers();
    timer_node_id = engine.addNode("TIMER");
    number_value_id = engine.addNode("NUMBER");
    clock.tick(501);
    number_interval_id = engine.addNode("NUMBER");
    engine.connect(number_value_id, 'number', timer_node_id, 'value');
    engine.connect(number_interval_id, 'number', timer_node_id, 'interval');

    for(var i = 0; i < config_data.length; i++){
      engine.configNode(number_value_id, {'number' :config_data[i].value});
      engine.configNode(number_interval_id, {'number' : config_data[i].interval});
      engine.configNode(timer_node_id, {'duty' : config_data[i].duty});

      var j = 0;
      while(j < 10){
        expect(cb_out_value).to.be.eql(config_data[i].value);
        //console.log('----------------------------------- ' + i);
        milliseconds = config_data[i].interval * (1 - config_data[i].duty) * 1000;
        //console.log('milliseconds : ' + milliseconds);
        clock.tick(milliseconds);
        expect(cb_out_value).to.be.eql(0);
        milliseconds = config_data[i].interval * config_data[i].duty * 1000;
        clock.tick(milliseconds);
        //console.log('milliseconds : ' + milliseconds);
        j++;
      }
    }
    clock.restore();
  });

  it('Config value will be useless, when external value set', function(){
    var clock = sinon.useFakeTimers();
    timer_node_id = engine.addNode("TIMER");
    number_value_id = engine.addNode("NUMBER");
    engine.connect(number_value_id, 'number', timer_node_id, 'value');
    // external node set value
    engine.configNode(number_value_id, {'number' : external_value_data.external_value});
    // config value
    engine.configNode(timer_node_id, {'value' : external_value_data.config_value});
    engine.configNode(timer_node_id, {'interval' : external_value_data.interval});
    engine.configNode(timer_node_id, {'duty' : external_value_data.duty});

    // verify the output number changed between external value and 0
    var j = 0;
    while(j < 10){
      expect(cb_out_value).to.be.eql(external_value_data.external_value);
      // console.log('----------------------------------- ' + i);
      milliseconds = external_value_data.interval * (1 - external_value_data.duty) * 1000;
      // console.log('milliseconds : ' + milliseconds);
      clock.tick(milliseconds);
      expect(cb_out_value).to.be.eql(0);
      milliseconds = external_value_data.interval * external_value_data.duty * 1000;
      clock.tick(milliseconds);
      // console.log('milliseconds : ' + milliseconds);
      j++;
    }
    clock.restore();
  });

  it('Config interval will be useless, when external interval set', function(){
    var clock = sinon.useFakeTimers();
    timer_node_id = engine.addNode("TIMER");
    number_interval_id = engine.addNode("NUMBER");
    engine.connect(number_interval_id, 'number', timer_node_id, 'interval');
    // external node set interval
    engine.configNode(number_interval_id, {'number' : external_interval_data.external_interval});
    // config interval
    engine.configNode(timer_node_id, {'value' : external_interval_data.value});
    engine.configNode(timer_node_id, {'interval' : external_interval_data.config_interval});
    engine.configNode(timer_node_id, {'duty' : external_interval_data.duty});
    // verify the changed interval set by external node
    var j = 0;
    while(j < 10){
      expect(cb_out_value).to.be.eql(external_interval_data.value);
      milliseconds = external_interval_data.external_interval * (1 - external_interval_data.duty) * 1000;
      clock.tick(milliseconds);
      expect(cb_out_value).to.be.eql(0);
      milliseconds = external_interval_data.external_interval * external_interval_data.duty * 1000;
      clock.tick(milliseconds);
      j++;
    }
    clock.restore();
  });

  it('Output c can be exported to other node', function(){
    var clock = sinon.useFakeTimers();
    timer_node_id = engine.addNode("TIMER");
    add_node_id = engine.addNode("ADD");
    engine.connect(timer_node_id, 'output', add_node_id, 'a');

    default_config = engine.getNodeConfigs(timer_node_id);
    engine.configNode(timer_node_id, {'value' : default_config.value.defaultValue});
    engine.configNode(timer_node_id, {'interval' : default_config.interval.defaultValue});
    engine.configNode(timer_node_id, {'duty' : default_config.duty.defaultValue});

    var j = 0;
    while(j < 10){
      expect(cb_in_value).to.be.eql(default_config.value.defaultValue);
      // console.log('----------------------------------- ' + i);
      milliseconds = default_config.interval.defaultValue * (1 - default_config.duty.defaultValue) * 1000;
      // console.log('milliseconds : ' + milliseconds);
      clock.tick(milliseconds);
      expect(cb_in_value).to.be.eql(0);
      milliseconds = default_config.interval.defaultValue * default_config.duty.defaultValue * 1000;
      clock.tick(milliseconds);
      // console.log('milliseconds : ' + milliseconds);
      j++;
    }
    clock.restore();
  });


  it('Remove a timer node', function(){
    timer_node_id = engine.addNode("TIMER");
    node = engine.getActiveNodeCache();
    expect(node).to.include.keys(timer_node_id);
    // console.log("AAA: " + JSON.stringify(node));
    engine.removeNode(timer_node_id);
    node = engine.getActiveNodeCache();
    expect(node).to.be.empty
  });
});


