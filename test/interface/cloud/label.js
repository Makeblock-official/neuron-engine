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

describe('Label node', function(){
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
        var label_node_id = engine.addNode('LABEL');
        expect(engine.getNodeConfigs(label_node_id).name).to.be.eql({ type: 'text' });
    });

    it('Input value should change by number external node', function () {
        var label_node_id = engine.addNode('LABEL');
        var number_node_id = engine.addNode('NUMBER');
        engine.connect(number_node_id, 'number', label_node_id, 'text');
        engine.configNode(number_node_id, {number:1234567890});
        expect(cb_in_node_id).to.be.eql(label_node_id);
        expect(cb_in_name).to.be.eql('text');
        expect(cb_in_value).to.be.eql(1234567890);
    });

    it('Input value should change by text external node', function () {
        var label_node_id = engine.addNode('LABEL');
        var text_node_id = engine.addNode('TEXT_INPUT');
        engine.connect(text_node_id, 'text', label_node_id, 'text');
        engine.configNode(text_node_id, {text:'vqwevqevqe'});
        expect(cb_in_node_id).to.be.eql(label_node_id);
        expect(cb_in_name).to.be.eql('text');
        expect(cb_in_value).to.be.eql('vqwevqevqe');
    });

    it('Remove a label node', function(){
        label_node_id = engine.addNode("LABEL");
        node = engine.getActiveNodeCache();
        expect(node).to.include.keys(label_node_id);
        // console.log("AAA: " + JSON.stringify(node));
        engine.removeNode(label_node_id);
        node = engine.getActiveNodeCache();
        expect(node).to.be.empty
    });

    it('Config name verify', function() {
        label_node_id = engine.addNode("LABEL");
        for(var i = 0; i < names.length; i++){
            engine.configNode(label_node_id,{name : names[i]});
            node = engine.exportFlow();
            expect(node[0].conf.name).to.be.eql(names[i]);
        }
    });
});