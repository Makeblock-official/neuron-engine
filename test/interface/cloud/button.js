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


var names = ['   ', 'dhsajhdkja', '哈哈'];

describe('Button node', function(){
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

    it('Default configs: state is hidden,name is text', function () {
        var button_node_id = engine.addNode('BUTTON');
        expect(engine.getNodeConfigs(button_node_id).state).to.be.eql({ type: 'hidden' });
        expect(engine.getNodeConfigs(button_node_id).name).to.be.eql({ type: 'text' });
    });

    it('Config name verify', function() {
        var button_node_id = engine.addNode('BUTTON');
        engine.configNode(button_node_id,{name : 'my button'});
        object = engine.exportFlow();
        console.log(JSON.stringify(object));
    });

    it('Click button should tigger state output value', function () {
        var button_node_id = engine.addNode('BUTTON');
        engine.configNode(button_node_id, {state:1});
        expect(cb_out_node_id).to.be.eql(button_node_id);
        expect(cb_out_name).to.be.eql('state');
        expect(cb_out_value).to.be.eql(100);
        engine.configNode(button_node_id, {state:0});
        expect(cb_out_node_id).to.be.eql(button_node_id);
        expect(cb_out_name).to.be.eql('state');
        expect(cb_out_value).to.be.eql(0);
    });

    it('Click button should tigger external node', function(){
        var button_node_id = engine.addNode('BUTTON');
        engine.configNode(button_node_id, {state:0});
        var number_node_id = engine.addNode('NUMBER');
        engine.configNode(number_node_id, {number:0});
        engine.connect(button_node_id, 'state', number_node_id, 'send');
        engine.configNode(button_node_id, {state:1});
        expect(cb_in_node_id).to.be.eql(number_node_id);
        expect(cb_in_name).to.be.eql('send');
        expect(cb_in_value).to.be.eql(100);
        expect(cb_out_node_id).to.be.eql(number_node_id);
        expect(cb_out_name).to.be.eql('number');
        expect(cb_out_value).to.be.eql(0);
    });

    it('Remove a button node', function(){
        button_node_id = engine.addNode("BUTTON");
        node = engine.getActiveNodeCache();
        expect(node).to.include.keys(button_node_id);
        // console.log("AAA: " + JSON.stringify(node));
        engine.removeNode(button_node_id);
        node = engine.getActiveNodeCache();
        expect(node).to.be.empty
    });

    it('Config name verify', function() {
        var button_node_id = engine.addNode('BUTTON');
        for(var i = 0; i < names.length; i++){
            engine.configNode(button_node_id,{name : names[i]});
            node = engine.exportFlow();
            expect(node[0].conf.name).to.be.eql(names[i]);
        }
    });

});