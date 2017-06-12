/**
 * engine factory and initializition.
 */
var FlowEngine = require('./engine');
var node = require('./node');

var basic_electronic_nodes = require('./nodes/basic_electronic/');
var basic_logic_nodes = require('./nodes/basic_logic/');
var display_nodes = require('./nodes/display/');
var led_nodes = require('./nodes/led/');
var motor_nodes = require('./nodes/motor/');
var servo_nodes = require('./nodes/servo/');
var sound_nodes = require('./nodes/sound/');
var camera_nodes = require('./nodes/camera/');
var assist_nodes = require('./nodes/assist/');
var advanced_nodes = require('./nodes/advanced/');
var time_nodes = require('./nodes/time/');
var control_nodes = require('./nodes/control/');

/*
var electronic_nodes = require('./nodes/electronic/');
var logic_nodes = require('./nodes/logic/');
var data_nodes = require('./nodes/data/');
var math_nodes = require('./nodes/math/');
var time_nodes = require('./nodes/time/');
var virtualElectronic = require('./nodes/virtualElectronic/');
var cloud_nodes = require('./nodes/cloud/');
var led_nodes = require('./nodes/led/');
*/

/**
 * [create is the engine factory]
 * @param  {object} conf [configuration]
 * @return {object}      [the engine instance]
 */
function create(conf) {
  var engine = new FlowEngine(conf);
  var i = 0;

  for (i = 0; i < basic_electronic_nodes.length; i++) {
    engine.registerNodeType(basic_electronic_nodes[i]);
  }

  for (i = 0; i < basic_logic_nodes.length; i++) {
    engine.registerNodeType(basic_logic_nodes[i]);
  }

  for (i = 0; i < control_nodes.length; i++) {
    engine.registerNodeType(control_nodes[i]);
  }

  for (i = 0; i < advanced_nodes.length; i++) {
    engine.registerNodeType(advanced_nodes[i]);
  }

  for (i = 0; i < time_nodes.length; i++) {
    engine.registerNodeType(time_nodes[i]);
  }

  for (i = 0; i < led_nodes.length; i++) {
    engine.registerNodeType(led_nodes[i]);
  }

  for (i = 0; i < motor_nodes.length; i++) {
    engine.registerNodeType(motor_nodes[i]);
  }

  for (i = 0; i < display_nodes.length; i++) {
    engine.registerNodeType(display_nodes[i]);
  }

  for (i = 0; i < servo_nodes.length; i++) {
    engine.registerNodeType(servo_nodes[i]);
  }

    for (i = 0; i < sound_nodes.length; i++) {
    engine.registerNodeType(sound_nodes[i]);
  }

  for (i = 0; i < camera_nodes.length; i++) {
    engine.registerNodeType(camera_nodes[i]);
  } 

  for (i = 0; i < assist_nodes.length; i++) {
    engine.registerNodeType(assist_nodes[i]);
  } 

/*
  for (i = 0; i < audiorecognize_nodes.length; i++) {
    engine.registerNodeType(audiorecognize_nodes[i]);
  }  

  for (i = 0; i < vision_nodes.length; i++) {
    engine.registerNodeType(vision_nodes[i]);
  }
  
  for (i = 0; i < electronic_nodes.length; i++) {
    engine.registerNodeType(electronic_nodes[i]);
  }

  for (i = 0; i < led_nodes.length; i++) {
    engine.registerNodeType(led_nodes[i]);
  }

  for (i = 0; i < math_nodes.length; i++) {
    engine.registerNodeType(math_nodes[i]);
  }

  for (i = 0; i < logic_nodes.length; i++) {
    engine.registerNodeType(logic_nodes[i]);
  }

  for (i = 0; i < time_nodes.length; i++) {
    engine.registerNodeType(time_nodes[i]);
  }

  for (i = 0; i < data_nodes.length; i++) {
    engine.registerNodeType(data_nodes[i]);
  }

  for (i = 0; i < cloud_nodes.length; i++) {
    engine.registerNodeType(cloud_nodes[i]);
  }

  for (i = 0; i < virtualElectronic.length; i++) {
    engine.registerNodeType(virtualElectronic[i]);
  }
*/
  return engine;
}

// export to browser
if (typeof window !== "undefined") {
  window.createNeuronsFlowEngine = create;
}

exports.create = create;
