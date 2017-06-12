/**
 * Created by root on 16-11-9.
 */
var expect = require('chai').expect;

var engine = "";

var cb_in_node_id = "";
var cb_in_name = "";
var cb_in_value = 0;
var cb_out_node_id = "";
var cb_out_name = "";
var cb_out_value = 0;

var out_tigger_num = 0;
function input_change(id,portName, value){
    cb_in_node_id = id;
    cb_in_name = portName;
    cb_in_value = value;
}

function output_change(id,portName, value){
    cb_out_node_id = id;
    cb_out_name = portName;
    cb_out_value = value;
    ++out_tigger_num;
}

function resetParams(id,portname,value){
    id = "";
    portname = "";
    value = 0;
}


var names = ['   ', 'dhsajhdkja', '哈哈'];

describe('Indicator node', function(){
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

    it('Default configs: name is textarea', function () {
        var indicator_node_id = engine.addNode('INDICATOR');
        expect(engine.getNodeConfigs(indicator_node_id).name).to.be.eql({ type: 'text' });
    });

    it('Input value should change by external node', function () {
        var indicator_node_id = engine.addNode('INDICATOR');
        var number_node_id = engine.addNode('NUMBER');
        engine.connect(number_node_id, 'number', indicator_node_id, 'input');
        engine.configNode(number_node_id, {number:100});
        expect(cb_in_node_id).to.be.eql(indicator_node_id);
        expect(cb_in_name).to.be.eql('input');
        expect(cb_in_value).to.be.eql(100);
        engine.configNode(number_node_id, {number:-1});
        expect(cb_in_node_id).to.be.eql(indicator_node_id);
        expect(cb_in_name).to.be.eql('input');
        expect(cb_in_value).to.be.eql(-1);
        engine.configNode(number_node_id, {number:0});
        expect(cb_in_node_id).to.be.eql(indicator_node_id);
        expect(cb_in_name).to.be.eql('input');
        expect(cb_in_value).to.be.eql(0);
    });

    it('Remove a indicator node', function(){
        indicator_node_id = engine.addNode("INDICATOR");
        node = engine.getActiveNodeCache();
        expect(node).to.include.keys(indicator_node_id);
        // console.log("AAA: " + JSON.stringify(node));
        engine.removeNode(indicator_node_id);
        node = engine.getActiveNodeCache();
        expect(node).to.be.empty
    });

    it('Config name verify', function() {
        indicator_node_id = engine.addNode("INDICATOR");
        for(var i = 0; i < names.length; i++){
            engine.configNode(indicator_node_id,{name : names[i]});
            node = engine.exportFlow();
            expect(node[0].conf.name).to.be.eql(names[i]);
        }
    });

});