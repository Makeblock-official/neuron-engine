/**
 * Created by root on 16-11-8.
 */
var expect = require('chai').expect;


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

describe('Pattern node', function(){
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

    it('Config delay default should be equal 0', function () {
        var pattern_node_id = engine.addNode('PATTERN');
        expect(engine.getNodeConfigs(pattern_node_id).delay.defaultValue).to.be.eql(0);
    });

    it('Config speed default should be equal slow', function () {
        var pattern_node_id = engine.addNode('PATTERN');
        expect(engine.getNodeConfigs(pattern_node_id).speed.defaultValue).to.be.eql('slow');
        expect(engine.getNodeConfigs(pattern_node_id).speed.options).to.be.eql(['slow','middle','fast']);
    });

    it('Config pattern mode default should be equal static', function () {
        var pattern_node_id = engine.addNode('PATTERN');
        expect(engine.getNodeConfigs(pattern_node_id).pattern.defaultValue).to.be.eql({mode: 'static',colors: [1,2,3,4]});
    });

    it('Remove a pattern node', function(){
        pattern_node_id = engine.addNode("PATTERN");
        node = engine.getActiveNodeCache();
        expect(node).to.include.keys(pattern_node_id);
        // console.log("AAA: " + JSON.stringify(node));
        engine.removeNode(pattern_node_id);
        node = engine.getActiveNodeCache();
        expect(node).to.be.empty
    });
});