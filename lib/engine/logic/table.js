var logger = require('../../log/log4js').logger;

function checkHardwareId(hardwareId_0, hardwareId_1) {
    var iRet = -1;
    var firstValue = _checkHardwareFirstId(hardwareId_0);
    logger.warn('hardwareId_0 firstValue ', hardwareId_0, firstValue);
    if(firstValue == -1) {
        return iRet;
    }
    var secondValue = _checkHardwareSecondId(hardwareId_1);
    logger.warn('hardwareId_1 secondValue ', hardwareId_1, secondValue);
    if(secondValue == -1) {
        return iRet;
    }

    iRet = _getHardwareId(firstValue, secondValue);
    return iRet;
}

function getRelativeTypeSubType(hardwareId) {
    var typeObj = {type:-1, subtype:-1};
    switch(hardwareId) {
        case 1:
            break;
        case 2:
            typeObj.type = 0x63;
            typeObj.subtype = 0x04;
            break;
        case 3:
            break;
        case 4:
            typeObj.type = 0x64;
            typeObj.subtype = 0x01;
            break;
        case 5:
            typeObj.type = 0x65;
            typeObj.subtype = 0x04;
            break;
        case 6:
            break;
        case 7:
            typeObj.type = 0x65;
            typeObj.subtype = 0x02;
            break;
        case 8:
            typeObj.type = 0x62;
            typeObj.subtype = 0x03;
            break;
        case 9:
            break;
        case 10:
            typeObj.type = 0x63;
            typeObj.subtype = 0x03;
            break;
        case 11:
            typeObj.type = 0x63;
            typeObj.subtype = 0x05;
            break;
        case 12:
            break;
        case 13:
            typeObj.type = 0x64;
            typeObj.subtype = 0x02;
            break;
        case 14:
            typeObj.type = 0x63;
            typeObj.subtype = 0x06;
            break;
        case 15:
            typeObj.type = 0x63;
            typeObj.subtype = 0x02;
            break;
        case 16:
            typeObj.type = 0x65;
            typeObj.subtype = 0x03;
            break;
        case 17:
            typeObj.type = 0x64;
            typeObj.subtype = 0x04;
            break;
        case 18:
            break;
        case 19:
            break;
        case 20:
            typeObj.type = 0x63;
            typeObj.subtype = 0x01;
            break;
        case 21:
            break;
        case 22:
            break;
        case 23:
            typeObj.type = 0x62;
            typeObj.subtype = 0x02;
            break;
        case 24:
            typeObj.type = 0x66;
            typeObj.subtype = 0x02;
            break;
        case 25:
            typeObj.type = 0x65;
            typeObj.subtype = 0x05;
            break;
        case 26:
            break;
        case 27:
            break;
        case 28:
            break;
        case 29:
            typeObj.type = 0x66;
            typeObj.subtype = 0x03;
            break;
        case 30:
            typeObj.type = 0x63;
            typeObj.subtype = 0x07;
            break;
        case 31:
            break;
        case 32:
            typeObj.type = 0x64;
            typeObj.subtype = 0x07;
            break;
        case 33:
            break;
        case 34:
            break;
        case 35:
            typeObj.type = 0x63;
            typeObj.subtype = 0x0c;
            break;
        case 36:
            break;
        case 37:
            typeObj.type = 0x63;
            typeObj.subtype = 0x08;
            break;
        case 38:
            break;
        case 39:
            break;
        case 40:
            break;
        case 41:
            typeObj.type = 0x63;
            typeObj.subtype = 0x0d;
            break;
        case 42:
            typeObj.type = 0x65;
            typeObj.subtype = 0x06;
            break;
        case 43:
            break;
        default:
            break;
    }
    return typeObj;
}

function _getHardwareId(firstValue, secondValue) {
    var iRet = -1;
    var index = _getIndex(secondValue);
    logger.warn('firstValue secondValue index ', firstValue, secondValue, index);
    if(index == -1) {
        return iRet;
    }
    var startID = 0;
    if(firstValue === 0) {
        startID = 1;
        iRet = startID + index;
    } else if(firstValue == 0x81) {
        startID = 35;
        iRet = startID + index;
    } else if(firstValue == 0x3ff) {
        startID = 18;
        iRet = startID + index;
    }
    return iRet;
}

function _getIndex(hardwareId) {
    var index = -1;
    switch (hardwareId) {
        case 0:
            index = 0;
            break;
        case 0x40:
            index = 1;
            break;
        case 0x81:
            index = 2;
            break;
        case 0xc1:
            index = 3;
            break;
        case 0x100:
            index = 4;
            break;
        case 0x140:
            index = 5;
            break;
        case 0x17b:
            index = 6;
            break;
        case 0x1bc:
            index = 7;
            break;
        case 0x200:
            index = 8;
            break;
        case 0x243:
            index = 9;
            break;
        case 0x284:
            index = 10;
            break;
        case 0x2aa:
            index = 11;
            break;
        case 0x2ff:
            index = 12;
            break;
        case 0x33e:
            index = 13;
            break;
        case 0x37e:
            index = 14;
            break;
        case 0x3bf:
            index = 15;
            break;
        case 0x3ff:
            index = 16;
            break;
        default:
            index = -1;
            break;
    }
    return index;
}

function _checkHardwareFirstId(hardwareId) {
    var firstValue = -1;
    if(hardwareId >= 0 && hardwareId <= 15) {
        firstValue = 0;
    } else if(hardwareId >= (0x81 - 15) && hardwareId <= (0x81 + 15)) {
        firstValue = 0x81;
    } else if(hardwareId >= (0x3ff - 15) && hardwareId <= (0x3ff + 15)) {
        firstValue = 0x3ff;
    }
    return firstValue;
}

function _checkHardwareSecondId(hardwareId) {
    var secondValue = -1;
    if(hardwareId >= 0 && hardwareId <= 15) {
        secondValue = 0;
    } else if(hardwareId >= (0x40 - 15) && hardwareId <= (0x40 + 15)) {
        secondValue = 0x40;
    } else if(hardwareId >= (0x81 - 15) && hardwareId <= (0x81 + 15)) {
        secondValue = 0x81;
    } else if(hardwareId >= (0xc1 - 15) && hardwareId <= (0xc1 + 15)) {
        secondValue = 0xc1;
    } else if(hardwareId >= (0x100 - 15) && hardwareId <= (0x100 + 15)) {
        secondValue = 0x100;
    } else if(hardwareId >= (0x140 - 15) && hardwareId <= (0x140 + 15)) {
        secondValue = 0x140;
    } else if(hardwareId >= (0x17b - 15) && hardwareId <= (0x17b + 15)) {
        secondValue = 0x17b;
    } else if(hardwareId >= (0x1bc - 15) && hardwareId <= (0x1bc + 15)) {
        secondValue = 0x1bc;
    } else if(hardwareId >= (0x200 - 15) && hardwareId <= (0x200 + 15)) {
        secondValue = 0x200;
    } else if(hardwareId >= (0x243 - 15) && hardwareId <= (0x243 + 15)) {
        secondValue = 0x243;
    } else if(hardwareId >= (0x284 - 15) && hardwareId <= (0x284 + 15)) {
        secondValue = 0x284;
    } else if(hardwareId >= (0x2aa - 15) && hardwareId <= (0x2aa + 15)) {
        secondValue = 0x2aa;
    } else if(hardwareId >= (0x2ff - 15) && hardwareId <= (0x2ff + 15)) {
        secondValue = 0x2ff;
    } else if(hardwareId >= (0x33e - 15) && hardwareId <= (0x33e + 15)) {
        secondValue = 0x33e;
    } else if(hardwareId >= (0x37e - 15) && hardwareId <= (0x37e + 15)) {
        secondValue = 0x37e;
    } else if(hardwareId >= (0x3bf - 15) && hardwareId <= (0x3bf + 15)) {
        secondValue = 0x3bf;
    } else if(hardwareId >= (0x3ff - 15) && hardwareId <= (0x3ff + 15)) {
        secondValue = 0x3ff;
    }
    return secondValue;
}

exports.checkHardwareId = checkHardwareId;
exports.getRelativeTypeSubType = getRelativeTypeSubType;