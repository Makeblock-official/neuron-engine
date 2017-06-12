/**
 * the example for Neuron voiseRecognition block.
 */

  /*
  * how to get voiseRecognition value
  * use event listener
  * engine.on("blockStatusChanges", callBack);

  * use api: getBlockSubStatus
  * engine.getBlockSubStatus('VOISERECOGNITION', 'recognition', index)
  * @param index {integer} for example,if you connected two voiseRecognition,the first is 1;the second is 2
  * @return {array}           [the substatus]
 */

var COMMAND = {'Turn on the light': 3, 'Turn Red': 4, 'Turn Blue': 5, 'Turn Green': 6,'Turn White':7,'More light':8,'Less light':9,'Lights off':10,'Motor Forward':11,'Motor Backward':12,'Speed Up':13,'Speed Down':14,'Love':15,'Smile':16,'Angry':17,'Sad':18,'Rock and roll':19,'Fire Fire':20,'Game start':21,'Winter is coming':22,'Start':23,'Shut down':24};
var TURNRED = [100,0,0];
var TURNGREEN = [0,100,0]

var engine = require('../../lib/engine/logic').create({"driver": "websocket", "serverIP": "192.168.3.119","loglevel": "WARN"});
engine.on("blockStatusChanges", blockStatusChanges);
engine.on("blockListChanges", blockListChanges);

function blockStatusChanges(type, idx, value) {
  if (type === 'VOISERECOGNITION'){
    if ('recognition' in value){
      var recognition = value.recognition[0];
      console.log('voiseRecognition StatusChanges: ' + recognition);
      var state  = engine.getBlockSubStatus('VOISERECOGNITION', 'recognition', 1);
      recognition = state[0];
      console.log('get voiseRecognition: ' + recognition);
      var command,found = false;
      for (command in COMMAND){
        if (COMMAND[command] === recognition){
          found = true;
          console.log('command: ' + command);
          break;
        }
      }
      if (found){
        switch (command){
          case 'Turn Red':
            engine.sendBlockCommand('LED','SET_COLOUR',TURNRED,1);
          break;
          case 'Turn Green':
            engine.sendBlockCommand('LED','SET_COLOUR',TURNGREEN,1);
          break;
        }
      }      
    }
  }
}

function blockListChanges(list){
  console.log(JSON.stringify(list));
}
