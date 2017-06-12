/**
 * Created by root on 16-11-9.
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

var names = ['   ', 'dhsajhdkja', '哈哈'];

describe('Number_input node', function(){
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

    it('Default configs: name type is text', function () {
        var number_input_node_id = engine.addNode('NUMBER_INPUT');
        expect(engine.getNodeConfigs(number_input_node_id).name).to.be.eql({ type: 'text' });
    });

    it('Input change should trigger number output value', function () {
        var number_input_node_id = engine.addNode('NUMBER_INPUT');
        engine.configNode(number_input_node_id, {number:1234567890});
        expect(cb_out_node_id).to.be.eql(number_input_node_id);
        expect(cb_out_name).to.be.eql('number');
        expect(cb_out_value).to.be.eql(1234567890);

    });

    it('Input number should trigger external node', function () {
        var number_input_node_id = engine.addNode('NUMBER_INPUT');
        engine.configNode(number_input_node_id, {number:0});
        var label_node_id = engine.addNode('LABEL');
        engine.configNode(label_node_id, {text:''});
        engine.connect(number_input_node_id, 'number', label_node_id, 'text');
        engine.configNode(number_input_node_id, {number:1234567890});
        expect(cb_in_node_id).to.be.eql(label_node_id);
        expect(cb_in_name).to.be.eql('text');
        expect(cb_in_value).to.be.eql(1234567890);
    });

    it('Remove a number input node', function(){
        number_input_node_id = engine.addNode("NUMBER_INPUT");
        node = engine.getActiveNodeCache();
        expect(node).to.include.keys(number_input_node_id);
        // console.log("AAA: " + JSON.stringify(node));
        engine.removeNode(number_input_node_id);
        node = engine.getActiveNodeCache();
        expect(node).to.be.empty
    });

    it('Config name verify', function() {
        number_input_node_id = engine.addNode("NUMBER_INPUT");
        for(var i = 0; i < names.length; i++){
            engine.configNode(number_input_node_id,{name : names[i]});
            node = engine.exportFlow();
            expect(node[0].conf.name).to.be.eql(names[i]);
        }
    });
});