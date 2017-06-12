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

describe('Slider node', function(){
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

    it('Default configs: state is text,name is textarea', function () {
        var dd_node_id = engine.addNode('SLIDER');
        expect(engine.getNodeConfigs(dd_node_id).name).to.be.eql({ type: 'text' });
        expect(engine.getNodeConfigs(dd_node_id).state).to.be.eql({ type: 'hidden' });
    });

    it('Slide on should trigger output state value', function () {
        var slider_node_id = engine.addNode('SLIDER');
        engine.configNode(slider_node_id, {state:1});
        expect(cb_out_node_id).to.be.eql(slider_node_id);
        expect(cb_out_name).to.be.eql('state');
        expect(cb_out_value).to.be.eql(100);
        engine.configNode(slider_node_id, {state:0});
        expect(cb_out_node_id).to.be.eql(slider_node_id);
        expect(cb_out_name).to.be.eql('state');
        expect(cb_out_value).to.be.eql(0);
    });

    it('Slider change should trigger external input value', function () {
        var slider_node_id = engine.addNode('SLIDER');
        engine.configNode(slider_node_id, {state:0});
        var number_node_id = engine.addNode('NUMBER');
        engine.configNode(number_node_id, {number:0});
        engine.connect(slider_node_id, 'state', number_node_id, 'send');
        engine.configNode(slider_node_id, {state:1});
        expect(cb_in_node_id).to.be.eql(number_node_id);
        expect(cb_in_name).to.be.eql('send');
        expect(cb_in_value).to.be.eql(100);
        expect(cb_out_node_id).to.be.eql(number_node_id);
        expect(cb_out_name).to.be.eql('number');
        expect(cb_out_value).to.be.eql(0);
    });

    it('Remove a slider node', function(){
        slider_node_id = engine.addNode("SLIDER");
        node = engine.getActiveNodeCache();
        expect(node).to.include.keys(slider_node_id);
        // console.log("AAA: " + JSON.stringify(node));
        engine.removeNode(slider_node_id);
        node = engine.getActiveNodeCache();
        expect(node).to.be.empty
    });

    it('Config name verify', function() {
        slider_node_id = engine.addNode("SLIDER");
        for(var i = 0; i < names.length; i++){
            engine.configNode(slider_node_id,{name : names[i]});
            node = engine.exportFlow();
            expect(node[0].conf.name).to.be.eql(names[i]);
        }
    });
});