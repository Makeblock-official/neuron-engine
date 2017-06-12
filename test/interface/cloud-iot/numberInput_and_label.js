var expect = require('chai').expect;
var sinon = require("sinon");
var mqtt = require('mqtt');


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
  it('Publish cloud app with number input and label, when local input changed, the cloud label changed', function(done){
    var number_input_node_id = engine.addNode('NUMBER_INPUT');
    var label_node_id = engine.addNode('LABEL');
    var label_topic = label_node_id + '@' + 'text';
    engine.connect(number_input_node_id, 'number', label_node_id, 'text');

    // client local (app)
    var local_client = engine.createIotClient(client_config.userKey, client_config.uuid);

    engine.getClientConnectResult().then(function(result){
      console.log("connection result : " + result);
      if(result === 1){
        var cloud_client = local_client;
        // subscribe
        cloud_client.onMessage(label_topic, function(message){
          console.log("message : " + message);
          expect(message).to.be.eql('222');
          done();
        });
        engine.configNode(number_input_node_id, {'number' : 222});
      }
    }).catch(function(err){
      console.log("connect failed..." + JSON.stringify(err));
      throw err;
      //done();
    });
  });

  it('Publish cloud app with number input and label, when cloud input changed, the local label output changed', function(done){
    function nodeOutputCallBack(id, portName, value){
      expect(id).to.be.eql(number_input_node_id);
      expect(portName).to.be.eql('number');
      expect(value).to.be.eql('222');
      done();
    }
    var number_input_node_id = engine.addNode('NUMBER_INPUT');
    var label_node_id = engine.addNode('LABEL');
    var number_input_topic = number_input_node_id + '@' + 'number';
    engine.connect(number_input_node_id, 'number', label_node_id, 'text');

    // client local (app)
    var local_client = engine.createIotClient(client_config.userKey, client_config.uuid);

    engine.getClientConnectResult().then(function(result){
      console.log("connection result : " + result);
      if(result === 1){
        var cloud_client = local_client;

        engine.on('NodeOutputChanged', nodeOutputCallBack);
        cloud_client.sendMessage(number_input_topic, '222', function(err){
          if(err) {
            console.log("err : " + err);
          }
        });
       // engine.configNode(number_input_topic, {'number' : 222});
      }
    }).catch(function(err){
      console.log("connect failed..." + JSON.stringify(err));
      throw err;
     // done();
    });
  });*/

  it('Publish cloud app with number input and label, when cloud input changed, the local label output changed', function(done){
    function nodeOutputCallBack(id, portName, value){
      expect(id).to.be.eql(number_input_node_id);
      expect(portName).to.be.eql('number');
     // expect(value).to.be.eql('222');
      console.log('value ... : ' + value);
      done();
    }
    var number_input_node_id = engine.addNode('NUMBER_INPUT');
    var label_node_id = engine.addNode('LABEL');
    var number_input_topic = number_input_node_id + '@' + 'number';
    engine.connect(number_input_node_id, 'number', label_node_id, 'text');

    // client local (app)
    var local_client = engine.createIotClient(client_config.userKey, client_config.uuid);

    engine.getClientConnectResult().then(function(result){
      console.log("connection result : " + result);
      if(result === 1){
        var cloud_client = local_client;

        engine.on('NodeOutputChanged', nodeOutputCallBack);
        cloud_client.sendMessage(number_input_topic, 'dsaadasdadasd', function(err){
          if(err) {
            console.log("err : " + err);
          }
        });
       // engine.configNode(number_input_topic, {'number' : 'jskjkjk'});
      }
    }).catch(function(err){
      console.log("connect failed..." + JSON.stringify(err));
      throw err;
      // done();
    });
  });

});


