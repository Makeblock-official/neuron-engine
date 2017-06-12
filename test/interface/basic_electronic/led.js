var expect = require('chai').expect;
var sinon = require("sinon");
var electronicblock = require('../../../lib/engine/flow/electronicblock');
var assert = require('assert');
var engine = "";

var config_color_arr = {
	0:[0x64,0x64,0x64],
	1:[0x64,0,0],
	2:[0x64,0x34,0],
	3:[0x64,0x64,0],
	4:[0,0x64,0],
	5:[0,0x64,0x64],
	6:[0,0,0x64],
	7:[0xac,0,0xac]};


var config_color = [
  {'id' : 1, 'color' : [0x64,0,0]},
  {'id' : 2, 'color' : [0x64,0x34,0]},
  {'id' : 3, 'color' : [0x64,0x64,0]},
  {'id' : 4, 'color' : [0,0x64,0]},
  {'id' : 5, 'color' : [0,0x64,0x64]},
  {'id' : 6, 'color' : [0,0,0x64]},
  {'id' : 7, 'color' : [0xac,0,0xac]},
  {'id' : 0, 'color' : [0x64,0x64,0x64]}
  ];

var combine_arr = [
      {colorControl1: true, colorControl2: true, brightness: 25, result: [0,63.75,0]}, // 是 是 25  绿色25
      {colorControl1: false, colorControl2: true, brightness: 50, result: [127.5,127.5,127.5]}, // 否 是 50  白色50
      {colorControl1: false, colorControl2: false, brightness: 25, result: [63.75,63.75,63.75]}, // 否 否 25  白色25
      {colorControl1: true, colorControl2: false, brightness: 50, result: [0,127.5,0]}, // 是 否 50  绿色50
      {colorControl1: true, colorControl2: true, brightness: 0, result: [0,0,0]} // 是 是 0  不亮0
    ];

describe('LED node', function(){
  before(function() {
    engine = require('../../../lib/engine/flow').create({"driver": "serial", "loglevel": "WARN"});
    
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
    try{
      electronicblock.sendBlockCommand.restore();
    }catch(e){

    }
    try{
      clock.restore();
    }catch(e){

    }
  });


  config_color.forEach(function(color){
    it('led_003 config color of LED node', function(){  
      sinon.spy(electronicblock, 'sendBlockCommand');
      var led_node_id = engine.addNode("LED");
      engine.configNode(led_node_id,{'color' : color.id});
      expect(electronicblock.sendBlockCommand.getCall(0).args[0]).to.be.eql('LED');
      expect(electronicblock.sendBlockCommand.getCall(0).args[1]).to.be.eql('SET_COLOUR');
      expect(electronicblock.sendBlockCommand.getCall(0).args[2]).to.be.eql(color.color);
      electronicblock.sendBlockCommand.restore();
    });
  });

  config_color.forEach(function(color){
    it('led_004 config color of LED node with color picker node', function(){
      sinon.spy(electronicblock, 'sendBlockCommand');
  	  var led_node_id = engine.addNode("LED");
  	  color_picker_node_id = engine.addNode("COLOR");
      engine.connect(color_picker_node_id, 'color', led_node_id, 'color');
      engine.configNode(color_picker_node_id,{'color' : color.id});
      expect(electronicblock.sendBlockCommand.getCall(0).args[0]).to.be.eql('LED');
      expect(electronicblock.sendBlockCommand.getCall(0).args[1]).to.be.eql('SET_COLOUR');
      expect(electronicblock.sendBlockCommand.getCall(0).args[2]).to.be.eql(color.color);
      electronicblock.sendBlockCommand.restore();
    });
  });

  /*
  *  When more than one node connected to one port, they should be configured with default value,
  *  otherwise, the script will throw error...
  */
  it('led_005 config color of LED with more than one color picker node', function(){
    var clock = sinon.useFakeTimers();
    led_node_id = engine.addNode("LED");
    var color_picker1_node_id = engine.addNode("COLOR");
    engine.configNode(color_picker1_node_id, {'color' : 0});
    clock.tick(100);
    var color_picker2_node_id = engine.addNode("COLOR");
    engine.configNode(color_picker2_node_id, {'color' : 0});
    engine.connect(color_picker1_node_id, 'color', led_node_id, 'color');
    engine.connect(color_picker2_node_id, 'color', led_node_id, 'color');
    clock.tick(100);


    sinon.spy(electronicblock, 'sendBlockCommand');
    engine.configNode(color_picker1_node_id,{'color' : 2});
    console.log(electronicblock.sendBlockCommand.getCall(0).args[2]);
    expect(electronicblock.sendBlockCommand.getCall(0).args[0]).to.be.eql('LED');
    expect(electronicblock.sendBlockCommand.getCall(0).args[1]).to.be.eql('SET_COLOUR');
    expect(electronicblock.sendBlockCommand.getCall(0).args[2]).to.be.eql(config_color_arr[2]);
    electronicblock.sendBlockCommand.restore();

    clock.tick(100);
    sinon.spy(electronicblock, 'sendBlockCommand');
    engine.configNode(color_picker2_node_id,{'color' : 4});
    console.log(electronicblock.sendBlockCommand.getCall(0).args[2]);
    expect(electronicblock.sendBlockCommand.getCall(0).args[0]).to.be.eql('LED');
    expect(electronicblock.sendBlockCommand.getCall(0).args[1]).to.be.eql('SET_COLOUR');
    expect(electronicblock.sendBlockCommand.getCall(0).args[2]).to.be.eql(config_color_arr[4]);
    electronicblock.sendBlockCommand.restore();
    clock.restore();
  });

  it('led_006 config brightness of LED by number node', function(){
    var expected_color = [127.5, 127.5, 127.5];
    var brightness = 50;
    var led_node_id = engine.addNode("LED");
    var number_node_id = engine.addNode("NUMBER");
    engine.configNode(led_node_id,{'color' : 0});
    engine.connect(number_node_id, 'number', led_node_id, 'color');
    sinon.spy(electronicblock, 'sendBlockCommand');  
    engine.configNode(number_node_id,{'number' : brightness});
    expect(electronicblock.sendBlockCommand.getCall(0).args[0]).to.be.eql('LED');
    expect(electronicblock.sendBlockCommand.getCall(0).args[1]).to.be.eql('SET_COLOUR');
    expect(electronicblock.sendBlockCommand.getCall(0).args[2]).to.be.eql(expected_color);
    electronicblock.sendBlockCommand.restore();
  });


  
  config_color.forEach(function(color){
    it('led_007 control LED by boolean', function(){

      var controlbutton_node_id = engine.addNode('CONTROLBUTTON');
      var led_node_id = engine.addNode("LED");
      engine.configNode(controlbutton_node_id, {'state' : false});
      engine.connect(controlbutton_node_id, 'state', led_node_id, 'color');
      engine.configNode(controlbutton_node_id, {'state' : true});
      sinon.spy(electronicblock, 'sendBlockCommand');
      engine.configNode(led_node_id,{'color' : color.id});
      expect(electronicblock.sendBlockCommand.getCall(0).args[0]).to.be.eql('LED');
      expect(electronicblock.sendBlockCommand.getCall(0).args[1]).to.be.eql('SET_COLOUR');
      console.log('actual color: --------------' + electronicblock.sendBlockCommand.getCall(0).args[2]);
      console.log('expect color: --------------' + color.color);
      expect(electronicblock.sendBlockCommand.getCall(0).args[2]).to.be.eql(color.color);
      electronicblock.sendBlockCommand.restore();


      sinon.spy(electronicblock, 'sendBlockCommand');
      engine.configNode(controlbutton_node_id, {'state' : false});
      expect(electronicblock.sendBlockCommand.getCall(0).args[0]).to.be.eql('LED');
      expect(electronicblock.sendBlockCommand.getCall(0).args[1]).to.be.eql('SET_COLOUR');
      expect(electronicblock.sendBlockCommand.getCall(0).args[2]).to.be.eql([0,0,0]);
      electronicblock.sendBlockCommand.restore();
    });
  });

  /*
  *  When more than one node connected to one port, they should be configured with default value,
  *  otherwise, the script will throw error...
  */
  combine_arr.forEach(function(data){
    it('led_009 LED combine color(external), number and boolean', function(){
      var clock = sinon.useFakeTimers();
      // add led node with default value 0
      var led_node_id = engine.addNode("LED");
      engine.configNode(led_node_id, {'color' : 0});
      // add color picker node with default value 0
      var color_picker_node_id = engine.addNode("COLOR");
      engine.configNode(color_picker_node_id, {'color' : 0});
      // add control button with default state 0
      var controlbutton1_node_id = engine.addNode('CONTROLBUTTON');
      engine.configNode(controlbutton1_node_id, {'state' : false});
      clock.tick(100);
      // add control button with default state 0
      var controlbutton2_node_id = engine.addNode('CONTROLBUTTON');
      engine.configNode(controlbutton2_node_id, {'state' : false});
      // add number node with default value 0
      var number_node_id = engine.addNode('NUMBER');
      engine.configNode(number_node_id, {'number' : 0});

      engine.connect(controlbutton1_node_id, 'state', led_node_id, 'color');
      engine.connect(controlbutton2_node_id, 'state', color_picker_node_id, 'send');
      engine.connect(color_picker_node_id, 'color', led_node_id, 'color');
      engine.connect(number_node_id, 'number', led_node_id, 'color');

      
      engine.configNode(color_picker_node_id, {'color': 4});      
      engine.configNode(controlbutton1_node_id, {'state': data.colorControl2}); 
      engine.configNode(controlbutton2_node_id, {'state': data.colorControl1}); 

      sinon.spy(electronicblock, 'sendBlockCommand');
      engine.configNode(number_node_id, {'number': data.brightness});
      console.log(electronicblock.sendBlockCommand.getCall(0).args[2]);
      expect(electronicblock.sendBlockCommand.getCall(0).args[0]).to.be.eql('LED');
      expect(electronicblock.sendBlockCommand.getCall(0).args[1]).to.be.eql('SET_COLOUR');
      expect(electronicblock.sendBlockCommand.getCall(0).args[2]).to.be.eql(data.result);
      
      electronicblock.sendBlockCommand.restore();

/*
      var clock = sinon.useFakeTimers();
      var led_node_id = engine.addNode("LED");
      var color_picker_node_id = engine.addNode("COLOR");
      var not_node_id = engine.addNode("NOT");
      var number_node1_id = engine.addNode('NUMBER');
      clock.tick(100);
      var number_node2_id = engine.addNode('NUMBER');
      clock.tick(100);
      var number_node3_id = engine.addNode('NUMBER');
      var not_node2_id = engine.addNode("NOT");


      engine.connect(number_node1_id, 'number', not_node_id, 'a');
      engine.connect(not_node_id, 'c', led_node_id, 'color');
      engine.connect(number_node2_id, 'number', led_node_id, 'color');
      engine.connect(color_picker_node_id, 'color', led_node_id, 'color');
      engine.connect(number_node3_id, 'number', not_node2_id, 'a');
      engine.connect(not_node2_id, 'c', color_picker_node_id, 'send');
      engine.configNode(color_picker_node_id, {'color': 4});

      engine.configNode(number_node1_id, {'number': data.boolean});
      engine.configNode(number_node3_id, {'number': data.colorControl});
      sinon.spy(electronicblock, 'sendBlockCommand');
      engine.configNode(number_node2_id, {'number': data.brightness});
      console.log(electronicblock.sendBlockCommand.getCall(0).args[2]);
      expect(electronicblock.sendBlockCommand.getCall(0).args[0]).to.be.eql('LED');
      expect(electronicblock.sendBlockCommand.getCall(0).args[1]).to.be.eql('SET_COLOUR');
      expect(electronicblock.sendBlockCommand.getCall(0).args[2]).to.be.eql(data.result);
      
      electronicblock.sendBlockCommand.restore();
      */
    });
  });

  

});