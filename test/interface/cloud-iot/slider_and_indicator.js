var expect = require('chai').expect;
var sinon = require("sinon");
var engine = "";


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
/*
  it('Publish cloud app with slider and indicator (verify indicator data upload 100)', function(done){
    var slider_node_id = engine.addNode('SLIDER');
    var indicator_node_id = engine.addNode('INDICATOR');
    var slider_topic = slider_node_id + '@' + 'state';
    var indicator_topic = indicator_node_id + '@' + 'input';
    console.log("indicator_topic : " + indicator_topic);
    engine.configNode(slider_node_id, {name : 'my_slider'});
    engine.configNode(indicator_node_id, {name : 'my_indicator'});
    engine.connect(slider_node_id, 'state', indicator_node_id, 'input');

    // client local (app)
    var local_client = engine.createIotClient(client_config.userKey, client_config.uuid);

    engine.getClientConnectResult().then(function(result){
      console.log("connection result : " + result);
      if(result === 1){
        var cloud_client = local_client;
        // subscribe
        cloud_client.onMessage(indicator_topic, function(message){
          console.log("message : " + message);
          expect(message).to.be.eql('100');
          done();
        });
        console.log("subscribe indicator_topic : " + indicator_topic);
        engine.configNode(slider_node_id,{state : 1});
      }
    }).catch(function(err){
      console.log("connect failed..." + JSON.stringify(err));
      throw err;
      done();
    });
  });

  it('Publish cloud app with slider and indicator (verify indicator data upload 0)', function(done){
    var slider_node_id = engine.addNode('SLIDER');
    var indicator_node_id = engine.addNode('INDICATOR');
    var slider_topic = slider_node_id + '@' + 'state';
    var indicator_topic = indicator_node_id + '@' + 'input';
    console.log("indicator_topic : " + indicator_topic);
    engine.configNode(slider_node_id, {name : 'my_slider'});
    engine.configNode(indicator_node_id, {name : 'my_indicator'});
    engine.connect(slider_node_id, 'state', indicator_node_id, 'input');

    // client local (app)
    var local_client = engine.createIotClient(client_config.userKey, client_config.uuid);

    engine.getClientConnectResult().then(function(result){
      console.log("connection result : " + result);
      if(result === 1){
        var cloud_client = local_client;
        // subscribe
        count = 0;
        cloud_client.onMessage(indicator_topic, function(message){
          count ++;
          if(count === 2){
            expect(message).to.be.eql('0');
            done();
          }
          console.log("message : " + message);
        });
        console.log("subscribe indicator_topic : " + indicator_topic);
        engine.configNode(slider_node_id,{state : 1});

        engine.configNode(slider_node_id,{state : 0});
      }
    }).catch(function(err){
      console.log("connect failed..." + JSON.stringify(err));
      throw err;
      done();
    });
  });
*/


  it('Publish cloud app with slider and indicator (verify slider data download)', function(done){
    function nodeOutputCallBack(id, portName, value){
      expect(id).to.be.eql(slider_node_id);
      expect(portName).to.be.eql('state');
      expect(value).to.be.eql(100);
      done();
    }
    var slider_node_id = engine.addNode('SLIDER');
    var indicator_node_id = engine.addNode('INDICATOR');
    var slider_topic = slider_node_id + '@' + 'state';
    var indicator_topic = indicator_node_id + '@' + 'input';
    console.log("slider_topic : " + slider_topic);
    engine.configNode(slider_node_id, {name : 'my_slider'});
    engine.configNode(indicator_node_id, {name : 'my_indicator'});
    engine.connect(slider_node_id, 'state', indicator_node_id, 'input');
    // client local (app)
    var local_client = engine.createIotClient(client_config.userKey, client_config.uuid);
    engine.getClientConnectResult().then(function(result) {
      console.log("connection result : " + result);
      engine.on('NodeOutputChanged', nodeOutputCallBack);
      if (result === 1) {
        local_client.sendMessage(slider_topic, 1, function(err){
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


