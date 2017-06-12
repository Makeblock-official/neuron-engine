var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);

var Client = require('../../../../../lib/engine/flow/iotlib/index');

var option1 = {"userkey":"a2a9705fc33071cc212af979ad9e52d75bc096936fb28fe18d0a6b56067a6bf8",
              "uuid":"76FA49A9-78D8-4AE5-82A3-EC960138E908",
              "runtime": 'node',
              "device": 'PC'
             };

var option2 = {"userkey":"a2a9705fc33071cc212af979ad9e52d75bc096936fb28fe18d0a6b56067a6bf8",
              "uuid":"76FA49A9-78D8-4AE5-82A3-EC960138E908",
              "runtime": '',
              "device": 'PC'
             };
var messageCases =  {"topic": 'aaaa',
   "data": 1,
   "recv": null,
   "want": 1
  };

function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}

describe('flow/iotlob/client', function() {
  var client, client2;
  var clientSpy = {};
  var client2Spy = {};
  client2 = Client.create(option2);
  client = Client.create(option1);
  client2Spy.onMessage = sinon.spy(client2, "onMessage");
  client2Spy.sendMessage = sinon.spy(client2, "sendMessage");

  it('getClient', function() {
    Client.getClient();  
  });

  it('sendmessage/onmessage when client not connect', function() {
    client2.onMessage(messageCases.topic, function(data){
     messageCases.recv = data;
    });
    client2.stopReceiveMessage(messageCases.topic);

    client2.sendMessage(messageCases.topic, messageCases.data, function(err){
      if(err) {
        return console.warn(err);
      }
    });
  });

  it('sendmessage/onmessage when client connect', function(done) {
    Client.getClientConnectResult().then(function(result) {
      if (result === 1){
        client.onMessage(messageCases.topic, function(data){
          expect(data).to.deep.equal('1');
          client.stopReceiveMessage('aaaa');
          done();
        });        
      } else {
        done();
      }
      client.sendMessage(messageCases.topic, messageCases.data, function(err){
        if(err) {
          return console.warn(err);
        }
      }); 
    }).done();
  });

  client2Spy.onMessage.restore();
  client2Spy.sendMessage.restore();
});

