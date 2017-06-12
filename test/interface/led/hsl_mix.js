/**
 * Created by root on 16-11-8.
 */
var expect = require('chai').expect;
var sinon = require("sinon");

var engine = "";

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

describe('hsl_mix node', function(){
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

    it('hue,saturation,lightness input should change with external node', function () {
        var clock = sinon.useFakeTimers();

        var hm_node_id = engine.addNode('HSL_MIX');
        var number_node_1_id = engine.addNode('NUMBER');
        clock.tick(100);
        var number_node_2_id = engine.addNode('NUMBER');
        clock.tick(100);
        var number_node_3_id = engine.addNode('NUMBER');
        clock.tick(100);

        //connect number node with r,g,b port
        engine.connect(number_node_1_id, 'number', hm_node_id, 'hue');
        engine.connect(number_node_2_id, 'number', hm_node_id, 'saturation');
        engine.connect(number_node_3_id, 'number', hm_node_id, 'lightness');

        //config three number node
        engine.configNode(number_node_1_id, {number:123});
        expect(cb_in_node_id).to.be.equal(hm_node_id);
        expect(cb_in_name).to.be.equal('hue');
        expect(cb_in_value).to.be.equal(123);
        engine.configNode(number_node_2_id, {number:966});
        expect(cb_in_node_id).to.be.equal(hm_node_id);
        expect(cb_in_name).to.be.equal('saturation');
        expect(cb_in_value).to.be.equal(966);
        engine.configNode(number_node_3_id, {number:128});
        expect(cb_in_node_id).to.be.equal(hm_node_id);
        expect(cb_in_value).to.be.equal(128);
    });

    it('Remove a hsl mix node', function(){
        hsl_mix_node_id = engine.addNode("HSL_MIX");
        node = engine.getActiveNodeCache();
        expect(node).to.include.keys(hsl_mix_node_id);
        // console.log("AAA: " + JSON.stringify(node));
        engine.removeNode(hsl_mix_node_id);
        node = engine.getActiveNodeCache();
        expect(node).to.be.empty
    });

});