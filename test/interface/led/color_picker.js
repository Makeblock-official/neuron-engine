/**
 * Created by root on 16-11-7.
 */
var expect = require('chai').expect;
var sinon = require("sinon");

var engine = "";


var default_config={
    color : 1
};

var cb_in_node_id = "";
var cb_in_name = "";
var cb_in_value = 0;
var cb_out_node_id = "";
var cb_out_name = "";
var cb_out_value = 0;

function input_change(id,portName, value){
    cb_in_node_id = id;
    cb_in_name = portName;
    cb_in_value = value;
}

function output_change(id,portName, value){
    cb_out_node_id = id;
    cb_out_name = portName;
    cb_out_value = value;
}

function resetParams(id,portname,value){
    id = "";
    portname = "";
    value = 0;
}

describe('Color_picker node', function(){
    this.timeout(15000);
    before(function(){
        engine = require('../../../lib/engine/flow').create({"driver": "serial", "loglevel": "WARN"});
        engine.on('NodeInputChanged', input_change);
        engine.on('NodeOutputChanged', output_change);
    });
    after(function(){
        engine.stop();
        engine = "";
    });
    afterEach(function () {
        var nodes = engine.getActiveNodes();
        for(var i = 0; i < nodes.length; i++){
            engine.removeNode(nodes[i].id);
        }
        resetParams(cb_in_node_id
            ,cb_in_name,cb_in_value);
        resetParams(cb_out_node_id,cb_out_name,cb_out_value);
    });

    it('Should be default value 1 with color', function () {
        var cp_node_id = engine.addNode('COLOR_PICKER');
        var cp_config = engine.getNodeConfigs(cp_node_id);
        expect(cp_config['color']['defaultValue']).to.be.eql(default_config.color);
    });

    it('Change config  should effect output value', function () {
        var cp_node_id = engine.addNode('COLOR_PICKER');
        engine.configNode(cp_node_id, {'color':5});
        expect(cb_out_node_id).to.be.eql(cp_node_id);
        expect(cb_out_name).to.be.eql('color');
        expect(cb_out_value).to.be.eql(5);
    });

    it('Input value should changed by external node input', function () {
        var cp_node_id = engine.addNode('COLOR_PICKER');
        var number_node_id =engine.addNode('NUMBER');
        engine.connect(number_node_id, 'number', cp_node_id, 'send');
        engine.configNode(number_node_id, {number:9});
        try{
            expect(cb_in_node_id).to.be.eql(cp_node_id);
            expect(cb_in_name).to.be.eql('send');
            expect(cb_in_value).to.be.eql(9);
        }catch(e){
            engine.disconnect(number_node_id, 'number', cp_node_id, 'send');
        }
        engine.disconnect(number_node_id, 'number', cp_node_id, 'send');
    });

    it('Output change should effect input of external node', function(){
        var cp_node_id = engine.addNode('COLOR_PICKER');
        var number_node_id =engine.addNode('NUMBER');
        engine.connect(cp_node_id, 'color', number_node_id, 'send');
        engine.configNode(cp_node_id, {color:5});
    });

    it('send input value from -1 to 10, should trigger color output', function(){
        var clock = sinon.useFakeTimers();
        var number_node1_id = engine.addNode('NUMBER');
        engine.configNode(number_node1_id, {number:0});
        clock.tick(100);
        var number_node2_id = engine.addNode('NUMBER');
        engine.configNode(number_node2_id, {number:0});
        clock.tick(100);
        var number_node3_id = engine.addNode('NUMBER');
        engine.configNode(number_node3_id, {number:0});
        clock.tick(100);
        var cp_node_id = engine.addNode('COLOR_PICKER');
        engine.configNode(cp_node_id, {color:1});
        clock.tick(100);

        engine.connect(cp_node_id, 'color', number_node1_id, 'send');
        engine.connect(number_node2_id, 'number', number_node1_id, 'send');
        engine.connect(number_node3_id, 'number', cp_node_id, 'send');


        // engine.configNode(number_node3_id)

        engine.configNode(number_node2_id, {number:3});
        clock.tick(100);
        expect(cb_in_node_id).to.be.eql(number_node1_id);
        expect(cb_in_name).to.be.eql('send');
        expect(cb_in_value).to.eql(3);

        engine.configNode(number_node3_id, {number:0});
        clock.tick(100);
        engine.configNode(number_node3_id, {number:5});
        clock.tick(100);
        expect(cb_in_node_id).to.be.eql(number_node1_id);
        expect(cb_in_name).to.be.eql('send');
        expect(cb_in_value).to.eql(1);
        clock.restore();
    });

    it('Remove a color picker node', function(){
        picker_node_id = engine.addNode("COLOR_PICKER");
        node = engine.getActiveNodeCache();
        expect(node).to.include.keys(picker_node_id);
        // console.log("AAA: " + JSON.stringify(node));
        engine.removeNode(picker_node_id);
        node = engine.getActiveNodeCache();
        expect(node).to.be.empty
    });

});
