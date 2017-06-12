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

describe('Line_graph node', function(){
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

    it('Default configs: name is text,sampleinterval is 0.5s', function () {
        var lineGraph_node_id = engine.addNode('LINE_GRAPH');
        expect(engine.getNodeConfigs(lineGraph_node_id).name).to.be.eql({ type: 'text' });
        expect(engine.getNodeConfigs(lineGraph_node_id).sampleinterval.defaultValue).to.be.eql(0.5);
    });

    it('Input value should not change by external text node', function () {
        var lineGraph_node_id = engine.addNode('LINE_GRAPH');
        var text_node_id = engine.addNode('TEXT_INPUT');
        engine.connect(text_node_id, 'text', lineGraph_node_id, 'input');
        engine.configNode(text_node_id, {text:'vqwevqevqe'});
        expect(cb_in_node_id).to.be.eql(lineGraph_node_id);
        expect(cb_in_name).to.be.eql('input');
        expect(cb_in_value).to.be.eql(0);
    });

    it('Input value should  change by external number node', function () {
        var lineGraph_node_id = engine.addNode('LINE_GRAPH');
        var number_node_id = engine.addNode('NUMBER');
        engine.connect(number_node_id, 'number', lineGraph_node_id, 'input');
        engine.configNode(number_node_id, {number:1234});
        expect(cb_in_node_id).to.be.eql(lineGraph_node_id);
        expect(cb_in_name).to.be.eql('input');
        expect(cb_in_value).to.be.eql(1234);
    });

    it('Remove a line graph node', function(){
        line_graph_node_id = engine.addNode("LINE_GRAPH");
        node = engine.getActiveNodeCache();
        expect(node).to.include.keys(line_graph_node_id);
        // console.log("AAA: " + JSON.stringify(node));
        engine.removeNode(line_graph_node_id);
        node = engine.getActiveNodeCache();
        expect(node).to.be.empty
    });

    it('Config name verify', function() {
        line_graph_node_id = engine.addNode("LINE_GRAPH");
        for(var i = 0; i < names.length; i++){
            engine.configNode(line_graph_node_id,{name : names[i]});
            node = engine.exportFlow();
            expect(node[0].conf.name).to.be.eql(names[i]);
        }
    });

});