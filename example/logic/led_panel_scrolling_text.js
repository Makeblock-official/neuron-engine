var wordToWrite = " KREATIVADELAR.SE ";
var currentColor = 1;

var LETTERS = {
  A: [
    0, 0, 0, 2, 2, 0, 0, 0, 
    0, 0, 2, 2, 2, 2, 0, 0, 
    0, 2, 2, 0, 0, 2, 2, 0, 
    0, 2, 2, 0, 0, 2, 2, 0, 
    0, 2, 2, 2, 2, 2, 2, 0, 
    0, 2, 2, 0, 0, 2, 2, 0, 
    0, 2, 2, 0, 0, 2, 2, 0, 
    0, 0, 0, 0, 0, 0, 0, 0
  ],
  D: [
    2, 2, 2, 2, 2, 0, 0, 0,
    0, 2, 2, 0, 2, 2, 0, 0,
    0, 2, 2, 0, 0, 2, 2, 0,
    0, 2, 2, 0, 0, 2, 2, 0,
    0, 2, 2, 0, 0, 2, 2, 0,
    0, 2, 2, 0, 2, 2, 0, 0,
    2, 2, 2, 2, 2, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0
  ],
  E: [
      2, 2, 2, 2, 2, 2, 2, 0,
      0, 2, 2, 0, 0, 0, 2, 0,
      0, 2, 2, 0, 2, 0, 0, 0,
      0, 2, 2, 2, 2, 0, 0, 0,
      0, 2, 2, 0, 2, 0, 0, 0,
      0, 2, 2, 0, 0, 0, 2, 0,
      2, 2, 2, 2, 2, 2, 2, 0,
      0, 0, 0, 0, 0, 0, 0, 0
    ],
  I: [
      0, 0, 2, 2, 2, 2, 0, 0, 
      0, 0, 0, 2, 2, 0, 0, 0, 
      0, 0, 0, 2, 2, 0, 0, 0, 
      0, 0, 0, 2, 2, 0, 0, 0, 
      0, 0, 0, 2, 2, 0, 0, 0, 
      0, 0, 0, 2, 2, 0, 0, 0, 
      0, 0, 2, 2, 2, 2, 0, 0, 
      0, 0, 0, 0, 0, 0, 0, 0
    ],
  K: [
      2, 2, 2, 0, 0, 2, 2, 0,
      0, 2, 2, 0, 0, 2, 2, 0,
      0, 2, 2, 0, 2, 2, 0, 0,
      0, 2, 2, 2, 2, 0, 0, 0,
      0, 2, 2, 0, 2, 2, 0, 0,
      0, 2, 2, 0, 0, 2, 2, 0,
      2, 2, 2, 0, 0, 2, 2, 0,
      0, 0, 0, 0, 0, 0, 0, 0
    ],
  L: [
      2, 2, 2, 2, 0, 0, 0, 0,
      0, 2, 2, 0, 0, 0, 0, 0,
      0, 2, 2, 0, 0, 0, 0, 0,
      0, 2, 2, 0, 0, 0, 0, 0,
      0, 2, 2, 0, 0, 0, 2, 0,
      0, 2, 2, 0, 0, 2, 2, 0,
      2, 2, 2, 2, 2, 2, 2, 0,
      0, 0, 0, 0, 0, 0, 0, 0
    ],
  R: [
      2, 2, 2, 2, 2, 2, 0, 0,
      0, 2, 2, 0, 0, 2, 2, 0,
      0, 2, 2, 0, 0, 2, 2, 0,
      0, 2, 2, 2, 2, 2, 0, 0,
      0, 2, 2, 0, 2, 2, 0, 0,
      0, 2, 2, 0, 0, 2, 2, 0,
      2, 2, 2, 0, 0, 2, 2, 0,
      0, 0, 0, 0, 0, 0, 0, 0
    ],
  S: [
      0, 0, 2, 2, 2, 2, 0, 0, 
      0, 2, 2, 0, 0, 2, 2, 0, 
      0, 2, 2, 2, 0, 0, 0, 0, 
      0, 0, 2, 2, 2, 0, 0, 0, 
      0, 0, 0, 0, 2, 2, 2, 0, 
      0, 2, 2, 0, 0, 2, 2, 0, 
      0, 0, 2, 2, 2, 2, 0, 0, 
      0, 0, 0, 0, 0, 0, 0, 0
    ],
  T: [
    0, 2, 2, 2, 2, 2, 2, 0, 
    0, 2, 0, 2, 2, 0, 2, 0, 
    0, 0, 0, 2, 2, 0, 0, 0, 
    0, 0, 0, 2, 2, 0, 0, 0, 
    0, 0, 0, 2, 2, 0, 0, 0, 
    0, 0, 0, 2, 2, 0, 0, 0, 
    0, 0, 2, 2, 2, 2, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0
  ],
  V: [
    0, 2, 2, 0, 0, 2, 2, 0, 
    0, 2, 2, 0, 0, 2, 2, 0, 
    0, 2, 2, 0, 0, 2, 2, 0, 
    0, 2, 2, 0, 0, 2, 2, 0, 
    0, 2, 2, 0, 0, 2, 2, 0, 
    0, 0, 2, 2, 2, 2, 0, 0, 
    0, 0, 0, 2, 2, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 
  ],
  ".": [
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 2, 2, 0, 0, 0,
    0, 0, 0, 2, 2, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0
  ],
  " ": [
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0
  ]
}

var tempImage = [];
var ledPanelCount = 0;
var wordCount = 0;
var first = true;
var count = 1;
var count2 = 0;

var engine = require('../../lib/engine/logic').create(
    {"driver": "serial", "loglevel": "FATAL"}
  );

/* Events */
 engine.on("driverConnectResult", driverConnectResult);
 engine.on("blockListChanges", blockListChanges);
 engine.on("blockStatusChanges", blockStatusChanges);
 
/* Callbacks */
function driverConnectResult(type, idx, value){
    console.log("Driver is connected.");
}

function blockListChanges(list){
  oldLedCount = ledPanelCount;
  if ('LEDPANEL' in list && 'BUTTON' in list){
    if(first){
      console.log("Found button and LED panel.");
      clearPanel();
      drawUpdate(1600); 
      console.log("Starting to display text.");
      first = false;
    }

     // Count nr of LED panel
    ledPanelCount = list["LEDPANEL"].length;
    console.log("Found "+ledPanelCount+" LED panel");
  }else{
    ledPanelCount = 0;
  }
}

function blockStatusChanges(type, idx, value){
  console.log('blockStatusChanges: ' + type + ' ' + idx + ' ' + JSON.stringify(value));
  if(type== "BUTTON" && idx==1){
    if(value.press == 1){
      console.log("Button pressed, changing color on text");
      currentColor++;
      if(currentColor >= 12) currentColor = 1;
    }
  }
}


/* Helper functions */ 
function drawUpdate(ms){
  
  var letter = wordToWrite[wordCount];
  for (var index = 0; index < ledPanelCount; index++) {
    if(wordCount >= index && (wordCount-index) <= (wordToWrite.length-1)){
      letter = wordToWrite[wordCount-index];
      uplodeAndShow(ledPanelCount-index, LETTERS[letter], 2, currentColor);
    }else{
      uplodeAndShow(ledPanelCount-index, emptyImage(), 2, currentColor);
    }
  }
  wordCount++;
  if(wordCount >= (wordToWrite.length + ledPanelCount)) wordCount = 0;
  
  setTimeout(drawUpdate, ms, ms);
}

function uplodeAndShow(id, image, mode, color){
  var out = [];
  var number;
  
  out.push(mode);
  for (var l = (image.length - 1); l >= 0; l--){
      if (image[l] > 0){
        number = l + 1;
        break;
      }
  }
  out.push(number); // led number
  for (var m = 0; m < number; m++){
      if(image[m] > 0){
        out.push(color);
      }else{
        out.push(image[m]);
      }
      
  }
  engine.sendBlockCommand('LEDPANEL','DISPLAY_IMAGE',out,id);        
}

function clearPanel(){
  for (var id = 0; id < ledPanelCount; id++) {
    for (var index = 0; index < 64; index++) {
      engine.sendBlockCommand('LEDPANEL','DISPLAY_SINGLE_LED',[index, 0, 0, 0],id+1);
    }
  }
}

function showMovingDot(){
  engine.sendBlockCommand('LEDPANEL','DISPLAY_SINGLE_LED',[count, 255, 0, 0],1);
  if(count2 > 0) engine.sendBlockCommand('LEDPANEL','DISPLAY_SINGLE_LED',[count2, 0, 0, 0],1);
  count++;
  count2 = count-1;

  if(count>= 64) count = 1;
  if(count2>= 64) count2 = 0;
}

function shiftImage(image, dir, step){
  
  var image2 = emptyImage();

  for (var index = 1; index < 8; index++) {
    //Row 1
    image2[(index + 0) - 1] = image[(index + 0)];
    image2[(index + 8) - 1] = image[(index + 8)];
    image2[(index + 16) - 1] = image[(index + 16)];
    image2[(index + 24) - 1] = image[(index + 24)];
    image2[(index + 32) - 1] = image[(index + 32)];
    image2[(index + 40) - 1] = image[(index + 40)];
    image2[(index + 48) - 1] = image[(index + 48)];
    image2[(index + 56) - 1] = image[(index + 56)];
  }

  return image2;
}

function emptyImage (){
  return [
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0
  ];
}
