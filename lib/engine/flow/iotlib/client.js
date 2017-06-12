var mqtt = require('mqtt');
var qs = require('querystring');
var http = require('http');

var MQTT_BROKER_BROWSER = 'mqtt://iot.makeblock.com:1884';
var MQTT_BROKER_NODE = 'mqtt://iot.makeblock.com:8080';

//user name makeblockiot
//password: $userKey
//clientId: $uuid@$time
var settings = {clientId: '',username: 'makeblockiot', password: '',clean: false};


/**
 * [Client connects to makeblock iot cloud and sending/receiving message to/from the cloud.]
 * @param {object} option 
 *        userKey {string} [the userkey. (check it out from http://iot.makeblock.com/console#/settings)]
 *        uuid {string} [a device specific identifier(eg. mac, imei)]
 */
function Client(option) {
  var self = this;

  self._userKey = option.userKey || '';
  self._uuid = option.uuid || '';
  self._device = option.device || '';
  self._runtime = option.runtime || '';
  var currentTime = new Date().getTime();
  settings.clientId = self._uuid + '@' + currentTime;
  settings.password = self._userKey;
  self._mqttClient = null;
  self._channelCBs = {};

  self._register = function() {

    console.log('device uuid:' + self._uuid);
    var post_data = {  
        uuid: self._uuid, userKey: self._userKey, device: self._device 
    };
    var body = qs.stringify(post_data); 
    var options = {  
        hostname: 'iot.makeblock.com',  
        path: '/http/register',  
        method: 'POST',  
        headers: {  
            uuid: self._uuid, userKey: self._userKey, device: self._device
        }
    };
    var req = http.request(options, function (serverFeedback) { 
        if (serverFeedback.statusCode != 200) {  
            console.warn(err || new Error('error http response code ' + serverFeedback.statusCode));
            return setTimeout(self._register, 5000);
        }  

        serverFeedback.on('data', function (feedback) {
          feedback = JSON.parse(feedback);
          if (feedback.errCode !== 0){
            console.warn("errCode: " + feedback.errCode + " errMsg: " + feedback.errMsg);
            setTimeout(self._register, 5000);
          }
        }); 
    }); 
    req.on('error', function(e) {
        console.error(e);
    });    
    req.write(body);  
    req.end();
  };

  self._access = function() {
    console.log('try mqtt.connect');
    var MQTT_BROKER;
    if (self._runtime === 'node'){
      MQTT_BROKER = MQTT_BROKER_NODE;
    } else {
      MQTT_BROKER = MQTT_BROKER_BROWSER;
    }
    self._mqttClient = mqtt.connect(MQTT_BROKER, settings);

    self._mqttClient.on('connect', function() {
      console.log("connected to iot cloud ok...");
      // user defined channels.
      for(var channel in self._channelCBs){
        self._mqttClient.subscribe(channel);
      }
    });

    self._mqttClient.on('message', function(topic, message) {
      console.log('received from topic: ' + topic + ' message: '+ message.toString());
      var data = JSON.parse(message);
      var ret = self._channelCBs[topic] && self._channelCBs[topic](data);
    });

    self._mqttClient.on('error', function(err) {
      console.warn('iot client error: ' + err);
    });
  };

  self._register();
  self._access(); 

  /**
   * [sendMessage sends a message to device owner's data channel]
   * @param  {String} channel [the name of the data channel.]
   * @param  {object} data    [JSON object to send]
   * @param  {Function} callback    [callback(err)]
   * @param  {object} option    [optional, extra options for send]
   * @return {None}         []
   */
  self.sendMessage = function(channel, data, callback, option) {
    var err;

    if (!self._mqttClient || !(self._mqttClient.connected)) {
      err = new Error('iot client not ready.');
      console.warn(err);
      return callback && callback(err);
    }

    var send_data = JSON.stringify(data);
    self._mqttClient.publish(channel, send_data);
    return callback && callback(null);
  };

  /**
   * [onMessage register callbacks when channel name receivce a message.]
   * @param  {String}   channel  [the name of the data channel.]
   * @param  {Function} callback [callback(data)]
   * @param  {object} option    [optional, extra options for send]
   * @return {None}            []
   */
  self.onMessage = function(channel, callback, option) {
    self._channelCBs[channel] = callback;
    if(self._mqttClient && self._mqttClient.connected) {
      self._mqttClient.subscribe(channel);
    } else {
      console.warn('onMessage, but iot client not ready.');
    }
  };

  /**
   * [stopReceiveMessage stops receiving data from the channel]
   */
  self.stopReceiveMessage = function(channel) {
    delete self._channelCBs[channel];
    if(self._mqttClient && self._mqttClient.connected) {
      self._mqttClient.unsubscribe(channel);
    }
  };

}

module.exports = Client;
