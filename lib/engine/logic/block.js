/**
 * eletronic block management.
 */

var protocol = require('../../protocol');
var logger = require('../../log/log4js').logger;

var _blockTypes = {};

/**
 * registerBlockType adds a new type of block to the engine.
 * @param {object} option [block configuration and implementation.]
 */
function registerBlockType(option) {
  'use strict';

  _blockTypes[option.name] = option;
}

/**
 * unregisterBlockType remove block type by name.
 * @param {string} type [the name of the block type]
 */
function unregisterBlockType(name) {
  'use strict';

  delete _blockTypes[name];
}

/**
 * [_getBlockOption search for block type definition in _blockTypes]
 * @param  {integer | string} type    [block type id or name]
 * @param  {integer} subtype [optional, block subtype id]
 * @return {object}     [block option]
 */
function getBlockOption(type, subtype) {
  'use strict';

  var opt = null;

  if (typeof type === 'string') {
    if (type in _blockTypes) {
      opt = _blockTypes[type];
    }
  } else {
    for (var name in _blockTypes) {
      if (_blockTypes[name].type === type && ((!subtype) || _blockTypes[name].subtype === subtype)) {
        opt = _blockTypes[name];
        break;
      }
    }
  }

  return opt;
}

/**
 * [checkSubStatus checks if block has sub status]
 * @param  {object} option [the block option]
 * @return {bool}        true of false
 */
function checkSubStatus(option) {
  'use strict';

  return !(option.status instanceof Array);
}

/**
 * [checkStatusParams check StatusParam's number]
 * @param  {object}     [block option]
 * @param  {array} status [the values to be checked]
 * @return {Integer} ret [if Number-of-params not correct,return -1;otherwise,return 0]
 */
function checkStatusParams(opt, status) {
  'use strict';

  if (opt.hasOwnProperty('status')) {
    if (opt.status.length != status.length) {
      logger.warn('the needed Number-of-params is: ', opt.status.length);
      logger.warn('but your Number-of-params is: ', status.length);
      return -1;
    } else {
      return 0;
    }
  }

  return 0;
}

/**
 * [checkCommandParams check CommandParam's number]
 * @param  {object}     [block option]
 * @param  {string} command [the name of command]
 * @param  {array} values [the values to be checked]
 * @return {Integer} ret [if Number-of-params not correct,return -1;otherwise,return 0]
 */
function checkCommandParams(opt, command, values) {
  'use strict';

  if (opt.hasOwnProperty('commands')) {
    var found = false;
    for (var cmd in opt.commands) {
      if (cmd == command) {
        found = true;
        break;
      }
    }
    if (!found) {
      logger.warn('block command not found:', command);
      return -2;
    }
    var commandObj = opt.commands[command];
    if (commandObj.hasOwnProperty('datatype')) {
      if (commandObj.datatype.length != values.length) {
        logger.warn('the needed Number-of-params is: ', commandObj.datatype.length);
        logger.warn('but your Number-of-params is: ', values.length);
        return -1;
      } else {
        return 0;
      }
    }
    return 0;   
  }
}

/**
 * createStatusPackage create a block pakage (without block number)
 * @param  {string} name [the name of the block type]
 * @param  {array} values [optional. if values is provided, will set data to provided value in package.]
 * @return {package object}      [the created package object.]
 */
function createStatusPackage(name, values) {
  'use strict';

  var pkg = {};

  var opt = _blockTypes[name];
  if (!opt) {
    return logger.warn('unknown block type: ', name);
  }

  pkg.type = opt.type;
  if (opt.subtype) {
    pkg.subtype = opt.subtype;
  }

  if (opt.hasOwnProperty('status')) {
    var withSubStatus = checkSubStatus(opt);
    pkg.data = [];
    var one;
    for (var i = 0; i < opt.status.length; i++) {
      one = {};
      if (values) {
        one[opt.status[i]] = values[i];
      } else {
        one[opt.status[i]] = null;
      }
      pkg.data.push(one);
    }
  }

  return pkg;
}

/**
 * [createSubStatusPackage creates a package with sub status id]
 * @param  {string} name [the name of the block type]
 * @param  {integer} subid  [the sub status id]
 * @param  {array} values [optional. if values is provided, will set data to provided value in package.]
 * @return {package object}      [the created package object.]
 */
function createSubStatusPackage(name, subid, values) {
  'use strict';

  var pkg = {};

  var opt = _blockTypes[name];
  if (!opt) {
    return logger.warn('unknown block type: ', name);
  }

  pkg.type = opt.type;
  if (opt.subtype) {
    pkg.subtype = opt.subtype;
  }

  var status = opt.status;
  var substatus = null;
  for (var subname in status) {
    if (status[subname].subid == subid) {
      substatus = status[subname];
      break;
    }
  }

  pkg.data = [];
  pkg.data[0] = {
    'BYTE': subid
  };

  if (substatus) {
    for (var i = 0; i < substatus.datatype.length; i++) {
      var one = {};
      if (values) {
        one[substatus.datatype[i]] = values[i];
      } else {
        one[substatus.datatype[i]] = null;
      }
      pkg.data.push(one);
    }
  }
  return pkg;
}

/**
 * createCommandPackage create a block pakage with command (without block number)
 * @param  {string} name [the name of the block type]
 * @param  {string} command [the name of command]
 * @param  {array} values [optional. if values is provided, will set data to provided value in package.]
 * @return {package object}      [the created package object.]
 */
function createCommandPackage(name, command, values) {
  'use strict';

  var pkg = {};

  var opt = _blockTypes[name];
  if (!opt) {
    return logger.warn('unknown block type: ', name);
  }

  pkg.type = opt.type;
  if (opt.subtype) {
    pkg.subtype = opt.subtype;
  }

  if (opt.hasOwnProperty('commands')) {
    var found = false;
    for (var cmd in opt.commands) {
      if (cmd == command) {
        found = true;
        break;
      }
    }
    if (!found) {
      return logger.warn('block command not found:', command);
    }
    pkg.data = [];
    var commandObj = opt.commands[command];
    pkg.data[0] = {
      'BYTE': commandObj.commandid
    };

    if (commandObj.hasOwnProperty('datatype')) {
      for (var i = 0; i < commandObj.datatype.length; i++) {
        var one = {};
        if (values) {
          one[commandObj.datatype[i]] = values[i];
        } else {
          one[commandObj.datatype[i]] = null;
        }
        pkg.data.push(one);
      }
    } else if (commandObj.hasOwnProperty('variableParams')) {
      for (var j = 0; j < values.length; j++) {
        var data = {};
        if (values) {
          data[commandObj.variableParams[0]] = values[j];
        } else {
          data[commandObj.variableParams[0]] = null;
        }
        pkg.data.push(data);
      }
    }
  }

  return pkg;
}



/**
 * [createBlockValues creates the values array of data by type]
 * @param  {string} name [the name of the block type]
 * @return {array}      [the default values array]
 */
function createBlockValues(name, data) {
  'use strict';

  var ret = null;
  var values = [];
  var withSubStatus = false;
  var valueIndex = 0;
  var opt = _blockTypes[name];
  var datatype = null;
  if (!opt) {
    return logger.warn('unknown block name: ', name);
  }

  if (opt.hasOwnProperty('status')) {
    var status = opt.status;
    withSubStatus = checkSubStatus(opt);

    if (withSubStatus) {
      (function() {
        // with sub status
        ret = {};
        var subname, i;
        if (data) {
          var subid = data[valueIndex++].BYTE;
          for (subname in status) {
            if (status[subname].subid == subid) {
              datatype = status[subname].datatype;
              break;
            }
          }
          if (datatype) {
            for (i = 0; i < datatype.length; i++) {
              values.push(data[i + valueIndex][datatype[i]]);
            }
            ret[subname] = values;
          }
        } else {
          for (subname in status) {
            ret[subname] = [];
            datatype = status[subname].datatype;
            for (i = 0; i < datatype.length; i++) {
              ret[subname].push(null);
            }
          }
        }
      })();
    } else {
      (function() {
        // normal
        datatype = status;
        for (var i = 0; i < datatype.length; i++) {
          if (data) {
            values.push(data[i + valueIndex][datatype[i]]);
          } else {
            values.push(null);
          }
        }
        ret = values;
      })();
    }
  }

  return ret;
}

exports.registerBlockType = registerBlockType;
exports.unregisterBlockType = unregisterBlockType;
exports.getBlockOption = getBlockOption;
exports.createStatusPackage = createStatusPackage;
exports.createSubStatusPackage = createSubStatusPackage;
exports.createCommandPackage = createCommandPackage;
exports.createBlockValues = createBlockValues;
exports.checkSubStatus = checkSubStatus;
exports.checkStatusParams = checkStatusParams;
exports.checkCommandParams = checkCommandParams;
