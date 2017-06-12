var async = require('async');
var when = require('when');
var Client = require('./client');
var client = null;

/**
 * [create client connects to makeblock iot cloud and sending/receiving message to/from the cloud.]
 * @param {object} conf 
 *        userKey {string} [the userkey. (check it out from http://iot.makeblock.com/console#/settings)]
 *        uuid {string} [a device specific identifier(eg. mac, imei)]
 */
function create(conf){
  client = new Client(conf);
  return client;
}

/**
  [get Client object]
  @return {[client object]}
 */
function getClient(){
  return client;
}

/**
 * [getClientConnectResult return the client ConnectResult]
 * @return {integer}      [1: success; 0:fail]
 */
function getClientConnectResult(){
  var count = 0;
  return when.promise(function(resolve) {
     async.whilst(
       function() { return !(client._mqttClient && client._mqttClient.connected); },
       function(callback) {
         if(count > 18) {
           callback('timeout');
         } else {
           count++;
           setTimeout(callback, 100);
         }
       },
       function (err, count) {
         if (err){
           if (client._mqttClient && client._mqttClient.connected){
             return resolve(1);
           } else {
             return resolve(0);
           }
         } else{
           return resolve(1);
         }
       }
     );
  });
}

exports.create = create;
exports.getClient = getClient;
exports.getClientConnectResult = getClientConnectResult;
