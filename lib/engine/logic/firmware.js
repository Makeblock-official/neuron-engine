var logger = require('../../log/log4js').logger;

var _initiateArr = false;
var subtypeArr = [];
var firmwareArr = [];
var _maxArrLength = 0x80;
var _maxSubArrLength = 0x80;
var _defaultFirmware = '@@';

function _initFirmwareArr() {
    for(var i = 0; i < _maxSubArrLength; ++i) {
        subtypeArr[i] = _defaultFirmware;
    }
    for(var j = 0; j < _maxArrLength; ++j) {
        firmwareArr[j] = subtypeArr;
    }
}

function setFirmware(type, subtype, firmware) {
    logger.warn('[setFirmware] ', type, subtype);
    if(!_initiateArr) {
        _initiateArr = true;
        _initFirmwareArr();
    }
    if(type <= 0 || type >= _maxArrLength) {
        return false;
    }
    firmwareArr[type][subtype] = firmware;
    logger.warn('[setFirmware] firmware.length:', firmwareArr[type][subtype].length);
    return true;
}

function getFirmware(type, subtype) {
    if(!_initiateArr) {
        _initiateArr = true;
        _initFirmwareArr();
    }
    if(type <= 0 || type >= _maxArrLength) {
        return _defaultFirmware;
    }
    return firmwareArr[type][subtype];
}

exports.setFirmware = setFirmware;
exports.getFirmware = getFirmware;