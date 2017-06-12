/**
 * the example for Neuron oled_display block.
 */

 /*
  * oled_display api

  * display string
  * engine.sendBlockCommand('OLED_DISPLAY','DISPLAY_STRING',[position,text],index); 
  * @param position {integer} display position. 1: 'up'; 2: 'center'; 3: down
  * @param text {string} 
  * @param index {integer} for example,if you connected two oled_display,the first is 1;the second is 2
 
  * display face
  * engine.sendBlockCommand('OLED_DISPLAY','DISPLAY_FACE',[faceId,blink],index);
  * @param faceId {integer} all faceId see below FACEID
  * @param blink {integer} 1:'blink'; 2: 'not blink'
  * @param index {integer} for example,if you connected two oled_display,the first is 1;the second is 2
 */

var FACEID = {'angry':1,'drowsy':2,'enlarged':3,'fixed':4,'happy':5,'mini':6,'normal':7,'sad':8};
var BLINK = {'blink':1,'not blink':2};
var ICONID = {'none':'','air':'/ue801','checkmark':'/ue802','cloud':'/ue803','heart': '/ue804','moon':'/ue805','rain':'/ue806','rotate':'/ue807','ruler':'/ue808','running':'/ue809','smile':'/ue810','snow':'/ue811','sun':'/ue812','temperature':'/ue813','water':'/ue814'};

var engine = require('../../lib/engine/logic').create({"driver": "websocket", "serverIP": "192.168.100.1","loglevel": "WARN"});
engine.on("blockStatusChanges", blockStatusChanges);
engine.on("blockListChanges", blockListChanges);

function blockStatusChanges(type, idx, value) {
  console.log('blockStatusChanges: ' + type + ' ' + idx + ' ' + JSON.stringify(value));
  if (type === 'BUTTON'){
    if ('press' in value){
      var faceId = value.press[0]>0?FACEID.happy:FACEID.normal;
      var blink = 1;
      engine.sendBlockCommand('OLED_DISPLAY','DISPLAY_FACE',[faceId,blink],1);
    }
  } else if (type === 'TEMPERATURE'){
    if ('temperature' in value){
      var temperature = value.temperature[0];
      var text = ICONID.temperature + temperature;
      var position = 1;
      engine.sendBlockCommand('OLED_DISPLAY','DISPLAY_STRING',[position,text],1); 
    }
  }
}

function blockListChanges(list){
  console.log(JSON.stringify(list));
}