var events = require('./events');
var async = require('async');
var when = require('when');
var utils = require('../../protocol/utils');
var core = require('./core');
var logger = require('../../log/log4js').logger;
var event = require('../../event/event');
var events = require('./events');
var block = require('./block');
var system = require('./system');
var protocol = require('../../protocol');
var table = require('./table');
var firmware = require('./firmware');

var _isUpdating = false;
var _updateFinished = true;
var _nodesLength = 0;
var _lastTimeStamp = 0;
var _currentTimeStamp = 0;
var _uint8buf = null;
var _defaultFirmware = '@@';
var _setbootloadSuccess = false;
var _setbootloadIntervalId = 0;
var _setbootloadCount = 0;
var _setbootloadMaxCount = 3;
var _setbootloadInterval = 3000;

var _infoIntervalID = 0;
var _dataIntervalID = 0;
var _infoCount = 0;
var _dataCount = 0;
var _dataFailCount = 0;
var _dataFailMaxCount = 10;
var _dataIndex = 0;
var _infoSuccess = false;
var _dataSuccess = false;
var _infoDataInterval = 3000;
var _infoDataMaxCount = 3;

var _updateBlockBuf = null;
var _fileInfoBuf = null;
var _fileDataBuf = null;

var _handleBootloadBlockTimeoutId = 0;
var _handleUpdateFirmwareFileResTimeoutId = 0;
var _handleQueryFirmwareFileResTimeoutId = 0;

function setUpdatingFalse() {
    logger.error('[update:setUpdatingFalse] set _isUpdating = false');
    _isUpdating = false;
}

function resetFirmwareUpdateState(nodesLength) {
    _nodesLength = nodesLength;
    if(_nodesLength === 0) {
        if(_infoIntervalID === 0 && _dataIntervalID === 0 && _updateFinished) {
            logger.error('resetFirmwareUpdateState _isUpdating = false _updateFinished:', _updateFinished);
            _isUpdating = false;
        } else {
            logger.error('resetFirmwareUpdateState _infoIntervalID _dataIntervalID', _infoIntervalID, _dataIntervalID);
        }
        
    }
}

function updateBlockFirmware(name, idx) {
    'use strict';
    if (!idx) {
        idx = idx | 1;
    }

    if (idx === 255) {
        return null;
    }

    var opt = block.getBlockOption(name);
    if (!opt) {
        return logger.error('unknown block name: ', name);
    }

    _setbootloadSuccess = false;
    _setbootloadIntervalId = 0;
    _setbootloadCount = 0;
    logger.error('updateBlockFirmware _isUpdating = false');
    _isUpdating = false;
    _updateFinished = false;

    var pkg = system.DOWN.UPDATEBLOCK;
    pkg.no = core.getBlockNo(name, idx);
    if (pkg.no <= 0) {
        return null;
    }

    pkg.data[0].BYTE = opt.type;
    pkg.data[1].BYTE = opt.subtype;

    _updateBlockBuf = protocol.serialize(pkg);
    logger.error(utils.hexBuf(_updateBlockBuf));
    if (core.getDriver()) {
        // logger.error('[updateBlockFirmware] core.getDriver().send(_updateBlockBuf)');
        core.getDriver().send(_updateBlockBuf);
    }

    if(_setbootloadIntervalId === 0) {
        _setbootloadIntervalId = setInterval(_updateBlockFirmwareInterval, _setbootloadInterval);
    }
}

function _updateBlockFirmwareInterval() {
    _setbootloadCount += 1;
    if (_setbootloadCount >= _setbootloadMaxCount) {
        logger.error('[_updateBlockFirmwareInterval] reach _setbootloadMaxCount:', _setbootloadMaxCount);
        clearInterval(_setbootloadIntervalId);
        _setbootloadIntervalId = 0;
        event.emit(events.INITIATIVEDISCONNECT);
        logger.error('_updateBlockFirmwareInterval _isUpdating = false');
        _isUpdating = false;
        _updateFinished = true;
        return;
    }
    if (_setbootloadSuccess) {
        logger.error('[_updateBlockFirmwareInterval] _setbootloadSuccess: true');
        clearInterval(_setbootloadIntervalId);
        _setbootloadIntervalId = 0;
        return;
    }
    logger.error('[_updateBlockFirmwareInterval] _setbootloadCount:', _setbootloadCount);
    if (core.getDriver()) {
        // logger.error('[_updateBlockFirmwareInterval] core.getDriver().send(buf) interval');
        core.getDriver().send(_updateBlockBuf);
    }
}

function handleBootloadBlock(pkg) {
    if (!_setbootloadSuccess) {
        _setbootloadSuccess = true;
        clearInterval(_setbootloadIntervalId);
        _setbootloadIntervalId = 0;
        logger.error('[handleBootloadBlock] _setbootloadSuccess: true');
    }

    logger.error('[handleBootloadBlock] _isUpdating:', _isUpdating, _infoIntervalID, _dataIntervalID, _updateFinished);

    if (!_isUpdating) { // make sure only one block is updating
        _currentTimeStamp = new Date().getTime();
        if((_currentTimeStamp - _lastTimeStamp) > 5000) {
            _lastTimeStamp = _currentTimeStamp;
            _isUpdating = true;
            _updateFinished = false;
            _dataFailCount = 0;
            _dataIndex = 0;
            if(_handleBootloadBlockTimeoutId === 0) {
                _handleBootloadBlockTimeoutId = setTimeout(_handleBootloadBlockTimeout, 90000);
            }
            
            queryHardwareID(pkg.no);
        } else {
            logger.error('[handleBootloadBlock] no need to set _isUpdating=true');
        }
    } else {
        if(_infoIntervalID === 0 && _dataIntervalID === 0 && _updateFinished) {
            logger.error('handleBootloadBlock _isUpdating = false _updateFinished:', _updateFinished);
            _isUpdating = false;
        }
    }
}

function _handleBootloadBlockTimeout() {
    logger.error('_handleBootloadBlockTimeout timeout 60s');
    logger.error('_handleBootloadBlockTimeout _isUpdating = false');
    _isUpdating = false;
    _updateFinished = true;
    _handleBootloadBlockTimeoutId = 0;
}

function queryHardwareID(no) {
    logger.error('queryHardwareID blockId:', no);
    var pkg = system.DOWN.QUERYBLOCKID;
    pkg.no = no;
    var buf = protocol.serialize(pkg);
    logger.error(utils.hexBuf(buf));
    if (core.getDriver()) {
        core.getDriver().send(buf);
    }
}

function handleHardwareID(pkg) {
    if (pkg.data.length < 2) {
        logger.error('handleHardwareID unexpected pkg.data.length:', pkg.data.length);
        return;
    }
    event.emit(events.DISCONNBLOCKRECONNECT);
    var hardwareId_0 = pkg.data[0].short;
    var hardwareId_1 = pkg.data[1].short;
    logger.error('hardwareId_0:' + hardwareId_0 + ', hardwareId_1:' + hardwareId_1);
    var valid = _setFirmwareFile(hardwareId_0, hardwareId_1);
    if (!valid) {
        logger.error('handleHardwareID _isUpdating = false');
        _isUpdating = false;
        _updateFinished = true;
        clearTimeout(_handleBootloadBlockTimeoutId);
        clearTimeout(_handleQueryFirmwareFileResTimeoutId);
        clearTimeout(_handleUpdateFirmwareFileResTimeoutId);
        _handleBootloadBlockTimeoutId = 0;
        _handleQueryFirmwareFileResTimeoutId = 0;
        _handleUpdateFirmwareFileResTimeoutId = 0;
        logger.error('unexpected hardwareId_0:' + hardwareId_0 + ', hardwareId_1:' + hardwareId_1);
        return;
    }

    var crc = _getFirmwareFileCRC();
    sendFirmwareFileInfo(pkg.no, crc);
}

function _setFirmwareFile(hardwareId_0, hardwareId_1) {
    uint8buf = null;
    var hardwareid = table.checkHardwareId(hardwareId_0, hardwareId_1);
    logger.error('[_setFirmwareFile] hardwareid:', hardwareid);
    if (hardwareid == -1) {
        return false;
    }

    var typeObj = table.getRelativeTypeSubType(hardwareid);
    logger.error('[_setFirmwareFile] typeObj:', typeObj);
    if (typeObj.type == -1) {
        return false;
    }

    uint8buf = firmware.getFirmware(typeObj.type, typeObj.subtype);
    if (uint8buf == _defaultFirmware) {
        event.emit(events.SETFIRMWAREBYTYPEANDSUBTYPE, {
            type: typeObj.type,
            subtype: typeObj.subtype
        });
        return false;
    }
    return true;
}

function _getFirmwareFileCRC() {
    if (uint8buf === null) {
        logger.error('[_getFirmwareFileCRC] unexpected case uint8buf == null');
        return;
    }
    var defaultCRC = new Uint32Array(1);
    defaultCRC[0] = 0xffffffff;
    var crc = utils.crc32(defaultCRC[0], uint8buf, uint8buf.length);
    logger.error('[_getFirmwareFileCRC] crc:' + crc);
    return crc;
}

function sendFirmwareFileInfo(no, crc) {
    if (uint8buf === null) {
        logger.error('[sendFirmwareFileInfo] unexpected case uint8buf == null');
        return;
    }

    var pkg = system.DOWN.SENDFIRMWAREFILEINFO;
    pkg.no = no; //todo get this pkg.no by name and idx
    pkg.data[0].SHORT = 0; //0 means the first info packet
    pkg.data[1].long = uint8buf.length;
    pkg.data[2].long = crc;
    _fileInfoBuf = protocol.serialize(pkg);
    logger.error('[sendFirmwareFileInfo] _fileInfoBuf:', utils.hexBuf(_fileInfoBuf));

    clearInterval(_infoIntervalID);
    _infoIntervalID = 0;
    _infoCount = 0;
    _infoSuccess = false;

    if (core.getDriver()) {
        core.getDriver().send(_fileInfoBuf);
    }

    if(_infoIntervalID === 0) {
        _infoIntervalID = setInterval(_sendFirmwareFileInfoInterval, _infoDataInterval);
    }
}

function _sendFirmwareFileInfoInterval() {
    _infoCount += 1;
    if (_infoCount >= _infoDataMaxCount) {
        logger.error('[_sendFirmwareFileInfoInterval] reach _infoDataMaxCount:', _infoDataMaxCount);
        clearInterval(_infoIntervalID);
        _infoIntervalID = 0;
        event.emit(events.INITIATIVEDISCONNECT);
        logger.error('_sendFirmwareFileInfoInterval _isUpdating = false');
        _isUpdating = false;
        _updateFinished = true;
        return;
    }
    if (_infoSuccess) {
        logger.error('[_sendFirmwareFileInfoInterval] setInterval _infoSuccess: true');
        clearInterval(_infoIntervalID);
        _infoIntervalID = 0;
        logger.error('_sendFirmwareFileInfoInterval _isUpdating = false');
        _isUpdating = false;
        return;
    }
    logger.error('[_sendFirmwareFileInfoInterval] send info count:', _infoCount);
    if (core.getDriver()) {
        core.getDriver().send(_fileInfoBuf);
    }
}

function handleUpdateFirmwareFileRes(pkg) {
    if (pkg.data.length < 2) {
        logger.error('[handleUpdateFirmwareFileRes] unexpected pkg.data.length:', pkg.data.length);
        return;
    }
    if (pkg.data[0].SHORT === 0x00) { // pkg.data[0].SHORT == 0x00 means the first pkg with file info
        if (pkg.data[1].BYTE == 0x01) { // pkg.data[1].BYTE == 0x01 means success
            _infoSuccess = true;
            clearInterval(_infoIntervalID);
            _infoIntervalID = 0;
            sendFirmwareFileData(pkg.no, 0x01);
        } else {
            _infoSuccess = false;
            logger.error('[handleUpdateFirmwareFileRes] _infoSuccess: false');
        }
    } else { // pkg.data[0].SHORT != 0x00 means the other pkg with file data
        if (pkg.data[1].BYTE == 0x01) { // pkg.data[1].BYTE == 0x01 means success
            logger.error('[handleUpdateFirmwareFileRes] _dataSuccess:true, pkgseq:', pkg.data[0].SHORT, pkg);
            _dataSuccess = true;
            clearInterval(_dataIntervalID);
            _dataIntervalID = 0;
            _dataFailCount = 0;
            if(pkg.data[0].SHORT > _dataIndex) {
                _dataIndex = pkg.data[0].SHORT;
                sendFirmwareFileData(pkg.no, pkg.data[0].SHORT + 1);
            }
            
        } else {
            logger.error('[handleUpdateFirmwareFileRes] _dataSuccess: false, pkgseq:', pkg.data[0].SHORT);
            _dataSuccess = false;
            if(pkg.data[0].SHORT > _dataIndex) {
                _dataFailCount += 1;
            }
            
            if(_dataFailCount <= _dataFailMaxCount) {
                if(pkg.data[0].SHORT > _dataIndex) {
                    sendFirmwareFileData(pkg.no, pkg.data[0].SHORT);
                }
            } else {
                logger.error('[handleUpdateFirmwareFileRes] reach send data max fail count');
                clearInterval(_dataIntervalID);
                _dataIntervalID = 0;
                _isUpdating = true;
                _updateFinished = true;
                _dataIndex = 0;
                if(_handleUpdateFirmwareFileResTimeoutId === 0) {
                    _handleUpdateFirmwareFileResTimeoutId = setTimeout(_handleUpdateFirmwareFileResTimeout, 90000);
                }
                
                
            }
            
        }
    }
}

function _handleUpdateFirmwareFileResTimeout() {
    logger.error('_handleUpdateFirmwareFileResTimeout _isUpdating = false');
    _isUpdating = false;
    _updateFinished = true;
    _handleUpdateFirmwareFileResTimeoutId = 0;
}

function sendFirmwareFileData(no, seq) {
    if (uint8buf === null) {
        logger.error('[sendFirmwareFileData] unexpected case uint8buf == null');
        return;
    }

    var pkg = system.DOWN.SENDFIRMWAREFILEDATA;
    pkg.no = no;
    //packet data
    var data = [];
    data.push({
        'SHORT': seq
    }); //sub package number
    data.push({
        'SHORT': 0x80
    });
    var startIndex = (seq - 0x01) * 64;
    if (startIndex >= uint8buf.length) {
        logger.error('[sendFirmwareFileData] finished, startIndex:', startIndex);
        queryFirmwareFileResult(no);
        return;
    }
    for (var i = startIndex; i < (startIndex + 64) && i < uint8buf.length; ++i) {
        data.push({
            'byte': uint8buf[i]
        });
    }
    pkg.data = data;
    _fileDataBuf = protocol.serialize(pkg);
    //end packet data
    clearInterval(_dataIntervalID);
    _dataIntervalID = 0;
    _dataCount = 0;
    _dataSuccess = false;
    if (core.getDriver()) {
        // logger.error('[sendFirmwareFileData] no, seq, _fileDataBuf:', no, seq, utils.hexBuf(_fileDataBuf));
        core.getDriver().send(_fileDataBuf);
    }
    //send data interval
    _dataIntervalID = setInterval(_sendFirmwareFileDataInterval, _infoDataInterval);
}

function _sendFirmwareFileDataInterval() {
    _dataCount += 1;
    if (_dataCount >= _infoDataMaxCount) {
        logger.error('[_sendFirmwareFileDataInterval] reach _infoDataMaxCount:', _infoDataMaxCount);
        clearInterval(_dataIntervalID);
        _dataIntervalID = 0;
        event.emit(events.INITIATIVEDISCONNECT);
        logger.error('_sendFirmwareFileDataInterval _isUpdating = false');
        _isUpdating = false;
        _updateFinished = true;
        return;
    }
    if (_dataSuccess) {
        logger.error('[_sendFirmwareFileDataInterval] _dataSuccess:true');
        clearInterval(_dataIntervalID);
        _dataIntervalID = 0;
        logger.error('_sendFirmwareFileDataInterval _isUpdating = false');
        _isUpdating = false;
        return;
    }
    logger.error('[_sendFirmwareFileDataInterval] _dataCount:', _dataCount);
    if (core.getDriver()) {
        // logger.error('[_sendFirmwareFileDataInterval] no, seq _fileDataBuf:', no, seq, utils.hexBuf(_fileDataBuf));
        core.getDriver().send(_fileDataBuf);
    }
}

function queryFirmwareFileResult(no) {
    var pkg = system.DOWN.QUERYUPDATERESULT;
    pkg.no = no;
    var buf = protocol.serialize(pkg);
    logger.error(utils.hexBuf(buf));
    if (core.getDriver()) {
        core.getDriver().send(buf);
    }
}

function handleQueryFirmwareFileRes(pkg) {
    var iRet = pkg.data[0].BYTE;
    logger.error('[handleQueryFirmwareFileRes] iRet:', iRet);
    if (iRet == 0x01) { //means update success
        resetBlockCommand(pkg.no);
        if(_handleQueryFirmwareFileResTimeoutId === 0) {
            _handleQueryFirmwareFileResTimeoutId = setTimeout(_handleQueryFirmwareFileResTimeout, 2000);
        }
        
        event.emit(events.BLOCKUPDATERESULT, {
            result: iRet
        });
    } else { // means update fail
        event.emit(events.BLOCKUPDATERESULT, {
            result: iRet
        });
    }
}

function _handleQueryFirmwareFileResTimeout() {
    logger.error('[_handleQueryFirmwareFileResTimeout] update success, now reset isUpdating == false');
    isUpdating = false;
    _handleQueryFirmwareFileResTimeoutId = 0;
    clearInterval(_handleBootloadBlockTimeoutId);
    _updateFinished = true;
    _handleBootloadBlockTimeoutId = 0;
}

function resetBlockCommand(no) {
    var pkg = system.DOWN.RESET;
    pkg.no = no;
    var buf = protocol.serialize(pkg);
    logger.error(utils.hexBuf(buf));
    if (core.getDriver()) {
        core.getDriver().send(buf);
    }
}

exports.setUpdatingFalse = setUpdatingFalse;
exports.resetFirmwareUpdateState = resetFirmwareUpdateState;
exports.updateBlockFirmware = updateBlockFirmware;
exports.handleBootloadBlock = handleBootloadBlock;
exports.handleHardwareID = handleHardwareID;
exports.handleUpdateFirmwareFileRes = handleUpdateFirmwareFileRes;
exports.handleQueryFirmwareFileRes = handleQueryFirmwareFileRes;