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

describe('Text_input node', function(){
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
        var text_input_node_id = engine.addNode('TEXT_INPUT');
        expect(engine.getNodeConfigs(text_input_node_id).name).to.be.eql({ type: 'text' });
        expect(engine.getNodeConfigs(text_input_node_id).text).to.be.eql({type: 'hidden'});
    });

    it('Text input change should trigger text output value', function () {
        var text_input_node_id = engine.addNode('TEXT_INPUT');
        engine.configNode(text_input_node_id, {text:'vebqebq123'});
        expect(cb_out_node_id).to.be.eql(text_input_node_id);
        expect(cb_out_name).to.be.eql('text');
        expect(cb_out_value).to.be.eql('vebqebq123');

    });

    it('Input number should trigger external node', function () {
        var text_input_node_id = engine.addNode('TEXT_INPUT');
        engine.configNode(text_input_node_id, {text:''});
        var label_node_id = engine.addNode('LABEL');
        engine.configNode(label_node_id, {text:''});
        engine.connect(text_input_node_id, 'text', label_node_id, 'text');
        engine.configNode(text_input_node_id, {text:'bqebqer'});
        expect(cb_in_node_id).to.be.eql(label_node_id);
        expect(cb_in_name).to.be.eql('text');
        expect(cb_in_value).to.be.eql('bqebqer');
    });

    it('Remove a text input node', function(){
        text_input_node_id = engine.addNode("TEXT_INPUT");
        node = engine.getActiveNodeCache();
        expect(node).to.include.keys(text_input_node_id);
        // console.log("AAA: " + JSON.stringify(node));
        engine.removeNode(text_input_node_id);
        node = engine.getActiveNodeCache();
        expect(node).to.be.empty
    });

    it('Config name verify', function() {
        text_input_node_id = engine.addNode("TEXT_INPUT");
        for(var i = 0; i < names.length; i++){
            engine.configNode(text_input_node_id,{name : names[i]});
            node = engine.exportFlow();
            expect(node[0].conf.name).to.be.eql(names[i]);
        }
    });
});