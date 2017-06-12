/**
 * engine factory and initializition.
 */
var blocks = require('../../blocks/electronic');
var LogicEngine = require('./engine');
var _ = require('underscore');

/**
 * [create is the engine factory]
 * @param  {object} conf [configuration]
 * @return {object}      [the engine instance]
 */
function create(conf) {
  var engine = new LogicEngine(conf);
  for (var i = 0; i < blocks.length; i++) {
    engine.registerBlockType(blocks[i]);
  }

  return engine;
}

// export to browser
if (typeof window !== "undefined") {
  window.createNeuronsLogicEngine = create;
}

exports.create = create;
