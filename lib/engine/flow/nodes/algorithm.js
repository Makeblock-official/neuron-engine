var BASEBRIGHTNESS  = 100;
var CONFNOTNEEDRUN = ['editImage','editPattern','selected'];
var emotionTesting = [];

function mul(a,b){
    var c = 0,
          d = a.toString(),
          e = b.toString();
    try {
        c += d.split(".")[1].length;
    } catch (f) {}
    try {
        c += e.split(".")[1].length;
    } catch (f) {}
    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);  
}

function add(a,b){
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    e = Math.pow(10, Math.max(c, d));
    return  (mul(a, e) + mul(b, e)) / e;
}

function sub(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    e = Math.pow(10, Math.max(c, d));
    return (mul(a, e) - mul(b, e)) / e;
}

function div(a, b) {
    var c, d, e = 0,
           f = 0;
    try {
        e = a.toString().split(".")[1].length;
    } catch (g) {
        e = 0;
    }
    try {
        f = b.toString().split(".")[1].length;
    } catch (g) {
        f = 0;
    }
    c = Number(a.toString().replace(".", ""));
    d = Number(b.toString().replace(".", ""));
    return mul(c / d, Math.pow(10, f - e));
}

function checkEmotionTest(file){
  var testing = false;
  for (var i = 0; i < emotionTesting.length; i ++){
    if (emotionTesting[i] === file){
      testing = true;
      break;
    }
  }
  return testing;
}

function pushEmotionTesting(file){
  emotionTesting.push(file);
}

function deleteEmotionTesting(file){
  for (var i = 0; i < emotionTesting.length; i ++){
    if (emotionTesting[i] === file){
      emotionTesting.splice(i, 1);
      break;
    }
  }  
}

function jsonClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function checKIfNeedRun(name){
  var needRun = true;
  for (var i = 0; i < CONFNOTNEEDRUN.length; i++){
    if (name === CONFNOTNEEDRUN[i]){
      needRun = false;
      break;
    }
  }
  return needRun;
}

function getLatestObject (objectBuf){
  var i,object;
  if (objectBuf.length > 0){
    var found = false;
    for (i = 0; i < objectBuf.length; i++){
      if (objectBuf[i].isChanged === true){
         found = true;
         break;
      }
    }
    if (found){
      object = objectBuf[i].current;    
    } else {
      object =  objectBuf[objectBuf.length - 1].current;
    }
  } else {
    object = null;
  }
  return object;
}

function getLatestNumber (numberBuf){
  var i,number;
   if (numberBuf.length > 0){
     var found = false;
     for (i = 0; i < numberBuf.length; i++){
       if (numberBuf[i].isChanged === true){
         found = true;
         break;
       }
     }
     if (found){
      number = numberBuf[i].current;    
     } else {
      number =  getMaxNumber (numberBuf);
     }     
  } else {
    number = null;
  }
  return number;
}

function getMaxNumber (numberBuf){
  var number;
   if (numberBuf.length > 0){
     number = numberBuf[0].current;
     for (var i = 1; i < numberBuf.length; i++){
       if (numberBuf[i].current > number){
         number = numberBuf[i].current;
       }
     }
  } else {
    number = null;
  }
  return number;
}

function getBoolOrResult(boolBuf){
  var bool;
  if (boolBuf.length > 0){
    bool = boolBuf[0];
    for (var i = 1; i < boolBuf.length; i++){
      bool = boolBuf[i] || bool;
    }
  } else {
    bool = null;
  }
  return bool;
}

function combineInputDisplay(bool,number,text,object){
  if (object!==null){
    return object;
  }
  if (number!==null){
      return number + (text !== ''?text:0);
  } 
  if (text !== ''){
    return text;
  }
  return bool;
}


function combineInput(bool,number,object){
  if (object !== null){
    var temp = jsonClone(object);
    if (number !== null){
      if (temp.hasOwnProperty('data')){
        for (var key in temp.data)
            temp.data[key] = number;
      }
    }
    return temp;
  }
  if (number !== null){
    if ((number !== 0) || (bool === null)){
      return number;
    }
  }
  return bool;
}

function threaholdNumber(number,min,max){
  if (number > max){
    number = max;
  }
  if (number < min){
    number = min;
  }
  return number;
}

function combineBrightness(number, color){
  var temp = jsonClone(color);
  var ratio = number / BASEBRIGHTNESS;
  for(var key in temp){
    temp[key] = temp[key] * ratio;
  }
  return temp;
}

function getNotResult(array){
  var result = getOrResult(array);
  return !result;
}

function getAndResult(array){
  var result = true;
  for(var i = 0; i < array.length; i++){
    var value = array[i].value.current;
    var datatype = (typeof value);
    switch (datatype){
      case 'boolean' :
        result = result && value;
        break;
      case 'number' :
        if(value > 0){
          result = result && true;
        } else{
          result = result && false;
        }
        break;
      case 'object' :
        result = result && true;
        break;
    }
  }
  return result;
}

function getOrResult(array){
  var result = false;
  for(var i = 0; i < array.length; i++){
    var value = array[i].value.current;
    var datatype = (typeof value);
    switch (datatype){
      case 'boolean' :
        result = result || value;
        break;
      case 'number' :
        if(value > 0){
          result = result || true;
        } else{
          result = result || false;
        }
        break;
      case 'object' :
        result = result || true;
        break;
    }
  }
  return result;
}

function calcMotorspeed(data,speed,direction){
  if (direction < 0){
    data.port2 = -speed;
    if (direction <= -100){
     data.port1 = -speed;       
    } else {
      data.port1 = speed* (1 + direction/100);
    }
  } else if (direction === 0){
    data.port1 = speed;
    data.port2 = -speed;   
  } else {
    data.port1 = speed;
    if (direction >= 100){ 
      data.port2 = speed;
    } else {
      data.port2 = -speed* (1 - direction/100);
    }    
  }
  data.port1 = Math.round(data.port1);
  data.port2 = Math.round(data.port2);
  return data;
}

function getColorType(color){
  var length = 0;
  for(var key in color){
    length = length + 1;
  }

  if(length === 3){ //white
    return 0;
  }

  if(length === 2){
    if(color.hasOwnProperty('G') && color.hasOwnProperty('B')){ //cyan
      return 5;
    }
    if(color.hasOwnProperty('R') && color.hasOwnProperty('B')){ //purple
      return 7;
    }
    if(color.hasOwnProperty('R') && color.hasOwnProperty('G')){
      if(color.R === color.G){ //yellow
        return 3;
      } else{ //orange
        return 2;
      }
    }
  }

  if(length === 1){
    if(color.hasOwnProperty('R')){ //red
      return 1;
    }
    if(color.hasOwnProperty('G')){ //green
      return 4;
    }
    if(color.hasOwnProperty('B')){ //blue
      return 6;
    }
  }
  return -1;
}

function combineInputLED(bool,number,object){
  var COLORS = {0:{R:0xff,G:0xff,B:0xff},1:{R:0xff},2:{R:0xff,G:0x80},3:{R:0xff,G:0xff},4:{G:0xff},5:{G:0xff,B:0xff},6:{B:0xff},7:{R:0xff,B:0xff}};
  var MIN = 0;
  var MAX = 100;
  if (object !== null){
    var temp = jsonClone(object);
    if (number !== null){
      if (temp.hasOwnProperty('data')){
        number = threaholdNumber(number,MIN,MAX);
        var colorType = getColorType(temp.data);
        var ratio = number / MAX;
        for (var key in temp.data){
          temp.data[key] = COLORS[colorType][key] * ratio;
        }
      }
    }
    return temp;
  }
  if (number !== null){
    if ((number !== 0) || (bool === null)){
      return number;
    }
  }
  return bool;
}

exports.jsonClone = jsonClone;
exports.checKIfNeedRun = checKIfNeedRun;
exports.getLatestObject = getLatestObject;
exports.getLatestNumber = getLatestNumber;
exports.getBoolOrResult = getBoolOrResult;
exports.combineInput = combineInput;
exports.threaholdNumber = threaholdNumber;
exports.combineBrightness = combineBrightness;
exports.calcMotorspeed = calcMotorspeed;
exports.getNotResult = getNotResult;
exports.getAndResult = getAndResult;
exports.getOrResult = getOrResult;
exports.getColorType = getColorType;
exports.combineInputLED = combineInputLED;
exports.combineInputDisplay= combineInputDisplay;
exports.checkEmotionTest = checkEmotionTest;
exports.pushEmotionTesting = pushEmotionTesting;
exports.deleteEmotionTesting = deleteEmotionTesting;
exports.add = add;
exports.sub = sub;
exports.mul = mul;
exports.div = div;