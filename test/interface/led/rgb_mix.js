/**
 * Created by root on 16-11-8.
 */
var expect = require('chai').expect;
var sinon = require("sinon");

var engine = "";


var default_config={
    color : 1
};

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

describe('rgb_mix node', function(){
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

    it('r,g,b input should change with external node', function () {
        var clock = sinon.useFakeTimers();

        var cm_node_id = engine.addNode('COLOR_MIX');
        var number_node_1_id = engine.addNode('NUMBER');
        clock.tick(100);
        var number_node_2_id = engine.addNode('NUMBER');
        clock.tick(100);
        var number_node_3_id = engine.addNode('NUMBER');
        clock.tick(100);

        //connect number node with r,g,b port
        engine.connect(number_node_1_id, 'number', cm_node_id, 'R');
        engine.connect(number_node_2_id, 'number', cm_node_id, 'G');
        engine.connect(number_node_3_id, 'number', cm_node_id, 'B');

        //config three number node
        engine.configNode(number_node_1_id, {number:12});
        expect(cb_in_node_id).to.be.equal(cm_node_id);
        expect(cb_in_name).to.be.equal('R');
        expect(cb_in_value).to.be.equal(12);
        engine.configNode(number_node_2_id, {number:36});
        expect(cb_in_node_id).to.be.equal(cm_node_id);
        expect(cb_in_name).to.be.equal('G');
        expect(cb_in_value).to.be.equal(36);
        engine.configNode(number_node_3_id, {number:128});
        expect(cb_in_node_id).to.be.equal(cm_node_id);
        expect(cb_in_name).to.be.equal('B');
        expect(cb_in_value).to.be.equal(128);
        console.log("cb_out_node_id : " + cb_out_node_id);
        console.log("cb_out_name : " + cb_out_name);
        console.log("cb_out_value : " + cb_out_value);
        //verify color output
        expect(cb_out_node_id).to.be.eql(cm_node_id);
        expect(cb_out_name).to.be.eql('color');
        expect(cb_out_value).to.be.eql('{...}');

        clock.restore();
    });

});