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

describe('Dropdown node', function(){
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

    it('Default configs: name\'s type is text, options\'s is textarea ', function () {
        var dd_node_id = engine.addNode('DROPDOWN');
        expect(engine.getNodeConfigs(dd_node_id).name).to.be.eql({ type: 'text' });
        expect(engine.getNodeConfigs(dd_node_id).options).to.be.eql({ type: 'textarea' });
    });

    it('Call selected method should trigger output value', function(){
        var dd_node_id = engine.addNode('DROPDOWN');
        engine.callMethod(dd_node_id,'selected','option3');
        expect(cb_out_value).equal("option3");
        // engine.callMethod(dd_node_id,'selected', 1);
        // expect(cb_out_value).equal(1);
    });

    it('Call selected method should trigger external node', function () {
        var dd_node_id = engine.addNode('DROPDOWN');
        var label_node_id = engine.addNode('LABEL');
        engine.connect(dd_node_id, 'selected', label_node_id, 'text');
        engine.callMethod(dd_node_id,'selected','aaa');
        expect(cb_in_node_id).to.be.eql(label_node_id);
        expect(cb_in_name).to.be.eql('text');
        expect(cb_in_value).to.be.eql('aaa');
    });

    it('Remove a dropdown node', function(){
        dropdown_node_id = engine.addNode("DROPDOWN");
        node = engine.getActiveNodeCache();
        expect(node).to.include.keys(dropdown_node_id);
        // console.log("AAA: " + JSON.stringify(node));
        engine.removeNode(dropdown_node_id);
        node = engine.getActiveNodeCache();
        expect(node).to.be.empty
    });

    it('Config name verify', function() {
        dropdown_node_id = engine.addNode("DROPDOWN");
        for(var i = 0; i < names.length; i++){
            engine.configNode(dropdown_node_id,{name : names[i]});
            node = engine.exportFlow();
            expect(node[0].conf.name).to.be.eql(names[i]);
        }
    });
});