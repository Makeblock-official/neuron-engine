/**
 * the example for Neuron led_panel block.
 * our led_panel is a 8*8 matrix(64 leds)
 */

/*
  * display a image
  * engine.sendBlockCommand('LEDPANEL','DISPLAY_IMAGE',[mode,ledNumber, led1_color,led2_color,...],index)
  * @param mode {integer} display mode,you can choose 0,1,2,3,see what happen
  * @param ledNumber {integer} the count of leds you set 
  * @param led_color {integer} 0: black; 1: red; 2: orange; 3: yellow; 4: green; 5: cyan; 6: blue; 7:purple; 8: white
  * @param index {integer} for example,if you connected two servo driver,the first is 1;the second is 2
 */

 /*
  * display animation(at most 4 frame)

  * step 1 upload animation
  * engine.sendBlockCommand('LEDPANEL','UPLOAD_IMAGE',[frame_no,ledNumber,led1_color,led2_color,...],index)
  * @param frame_no {integer} 
  * @param ledNumber {integer} the count of leds you set 
  * @param led_color {integer} 0: black; 1: red; 2: orange; 3: yellow; 4: green; 5: cyan; 6: blue; 7:purple; 8: white
  * @param index {integer} for example,if you connected two servo driver,the first is 1;the second is 2
  
  * step 2 disply
  * engine.sendBlockCommand('LEDPANEL','DISPLAY_IMAGES',[speed,mode],index); 
  * @param speed {integer} 0:'slow'; 1: 'middle'; 2:'fast'
  * @param mode {integer} display mode,you can choose 0,1,2,3,see what happen
 */
var DEFAULTMODE = 0;
var DEFAULTSPEED = 1;  //'slow':0,'middle':1,'fast':2
var EXAMPLE_IMAGES = [
  // happy
  [
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 4, 0, 0, 0, 0, 4, 0,
    4, 0, 4, 0, 0, 4, 0, 4,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 4, 0, 0, 0, 0, 4, 0,
    0, 0, 4, 4, 4, 4, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0
  ],
  // sad
  [
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    2, 2, 2, 0, 0, 2, 2, 2,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 2, 2, 2, 2, 0, 0,
    0, 2, 0, 0, 0, 0, 2, 0,
    0, 0, 0, 0, 0, 0, 0, 0
  ],
  // angry
  [
    0, 0, 0, 0, 0, 0, 0, 0,
    1, 0, 0, 0, 0, 0, 0, 1,
    0, 1, 1, 0, 0, 1, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 1, 1, 0, 0,
    0, 0, 1, 1, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0
  ],
  // heart
  [
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 1, 0, 0, 1, 1, 0,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    0, 1, 1, 1, 1, 1, 1, 0,
    0, 0, 1, 1, 1, 1, 0, 0,
    0, 0, 0, 1, 1, 0, 0, 0
  ]
];

 var engine = require('../../lib/engine/logic').create({"driver": "websocket", "serverIP": "192.168.100.1","loglevel": "WARN"});

 engine.on("blockStatusChanges", blockStatusChanges);

function blockStatusChanges(type, idx, value) {
  console.log('blockStatusChanges: ' + type + ' ' + idx + ' ' + JSON.stringify(value));
  if (type === 'BUTTON'){
    var out = [];
    var number;
    if ('press' in value){
      if (value.press[0]>0){  // when button press ,display animation
        var matrix = EXAMPLE_IMAGES;
           for (var i = 0; i < matrix.length; i++){
            out = [];
            out.push(i);  // frame number
            for (var j = (matrix[i].length - 1); j >= 0; j--){
              if (matrix[i][j] > 0){
                number = j + 1;
                break;
              }
            }
            out.push(number); // led number
            for (var k = 0; k < number; k++){
              out.push(matrix[i][k]);
            }
            engine.sendBlockCommand('LEDPANEL','UPLOAD_IMAGE',out,1);
          }
          engine.sendBlockCommand('LEDPANEL','DISPLAY_IMAGES',[DEFAULTSPEED,DEFAULTMODE],1);       
      } else { // display a image
        var image = EXAMPLE_IMAGES[0];
        out.push(DEFAULTMODE);
        for (var l = (image.length - 1); l >= 0; l--){
            if (image[l] > 0){
              number = l + 1;
              break;
            }
       }
       out.push(number); // led number
       for (var m = 0; m < number; m++){
            out.push(image[m]);
        }
        engine.sendBlockCommand('LEDPANEL','DISPLAY_IMAGE',out,1);        
      }
    }
  }
}