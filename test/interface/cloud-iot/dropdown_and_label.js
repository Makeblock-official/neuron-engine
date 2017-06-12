var expect = require('chai').expect;
var sinon = require("sinon");
var Promise = require('promise');
var mqtt = require('mqtt');
var engine = "";
var cb_in_node_id = "";
var cb_in_name = "";
var cb_in_value = 0;
var cb_out_node_id = "";
var cb_out_name = "";
var cb_out_value = 0;


var client_config = {
  userKey : 'a2a9705fc33071cc212af979ad9e52d75bc096936fb28fe18d0a6b56067a6bf8',
  uuid : '76FA49A9-78D8-4AE5-82A3-EC960138E908',
  runtime: 'node'
}


//iot.makeblock.com   120.25.83.222   测192.168.12.225

describe('Cloud App Test', function(){
  this.timeout(15000);
  before(function() {
    console.log("create before");
    // runtime must be node type!!!!!   NOTICE
    engine = require('../../../lib/engine/flow').create({"driver": "serial", "loglevel": "WARN","runtime": "node"});
    console.log("create engine success.....");
  });

  after(function() {
    engine.stop();
    engine = "";
  });

  afterEach(function(){
    nodes = engine.getActiveNodes();
    for(var i = 0; i < nodes.length; i++){
      engine.removeNode(nodes[i].id);
    }
  });

  it('Publish cloud app with dropdown and label, when local dropdown selected option changed, cloud label changed', function(done){
    var dropdown_node_id = engine.addNode('DROPDOWN');
    engine.configNode(dropdown_node_id, {options : 'a\nb\nc\n'});
    engine.configNode(dropdown_node_id, {name : "a b c d e f"});
    var label_node_id = engine.addNode('LABEL');
    var label_topic = label_node_id + '@' + 'text';
    engine.connect(dropdown_node_id, 'selected', label_node_id, 'text');

    // client local (app)
    var local_client = engine.createIotClient(client_config.userKey, client_config.uuid);

    engine.getClientConnectResult().then(function(result){
      console.log("connection result : " + result);
      if(result === 1){
        var cloud_client = local_client;
        // subscribe
        cloud_client.onMessage(label_topic, function(message){
          console.log("message : " + message);
          expect(message).to.be.eql('b');
          done();
        });
        console.log("subscribe label_topic : " + label_topic);
        engine.callMethod(dropdown_node_id,'selected','b');
      }
    }).catch(function(err){
      console.log("connect failed..." + JSON.stringify(err));
      throw err;
      done();
    });
  });


  it('Publish cloud app with dropdown and label, when cloud dropdown selected option changed, the local dropdown selected option changed', function(done){
    function nodeOutputCallBack(id, portName, value){
      expect(id).to.be.eql(dropdown_node_id);
      expect(portName).to.be.eql('selected');
      expect(value).to.be.eql('b');
      done();
    }
    var dropdown_node_id = engine.addNode('DROPDOWN');
    engine.configNode(dropdown_node_id, {options : 'a\nb\nc\n'});
    engine.configNode(dropdown_node_id, {name : "a b c d e f"});
    var label_node_id = engine.addNode('LABEL');
    var dropdown_topic = dropdown_node_id + '@' + 'selected';
    engine.connect(dropdown_node_id, 'selected', label_node_id, 'text');

    console.log('dropdown_topic : ' + dropdown_topic);

    // client local (app)
    var local_client = engine.createIotClient(client_config.userKey, client_config.uuid);
    engine.getClientConnectResult().then(function(result){
      console.log("connection result : " + result);
      if(result === 1){
        var cloud_client = local_client;
        // subscribe
        engine.on('NodeOutputChanged', nodeOutputCallBack);
        cloud_client.sendMessage(dropdown_topic, 'b', function(err){
          if(err) {
            console.log("err : " + err);
          }
        });
      }
    }).catch(function(err){
      console.log("connect failed..." + JSON.stringify(err));
      throw err;
      done();
    });

  });
});


