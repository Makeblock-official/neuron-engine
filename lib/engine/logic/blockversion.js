var logger = require('../../log/log4js').logger;
var mostVersion = 4;
var soundSensorVersion = 5;

function getBlockLatestVersion(name) {
    logger.warn('[getBlockLatestVersion] name:', name);
    switch(name) {
        case 'LINEFOLLOWER':
            return mostVersion;
        case 'KNOB':
            return mostVersion;
        case 'LEDPANEL':
            return mostVersion;
        case 'SERVO':
            return mostVersion;
         case 'ULTRASONIC':
            return mostVersion;
        case 'COLORSENSOR':
            return mostVersion;
        case 'BUTTON':
            return mostVersion;
        case 'ACCELEROMETER_GYRO':
            return mostVersion;
        case 'LIGHTSENSOR':
            return mostVersion;
        case 'FUNNYTOUCH':
            return mostVersion;
        case 'TEMPERATURE':
            return mostVersion;
        case 'BUZZER':
            return mostVersion;
        case 'OLED_DISPLAY':
            return mostVersion;
        case 'VOISERECOGNITION':
            return mostVersion;
        case 'JOYSTICK':
            return mostVersion;
        case 'PIR':
            return mostVersion;
        case 'SOIL_HUMIDITY':
            return mostVersion;
        case 'SOUNDSENSOR':
            return soundSensorVersion;
        case 'SEGDISPLAY':
            return mostVersion;
        case 'ELWIRES':
            return mostVersion;
        case 'HUMITURE':
            return mostVersion;
        case 'LEDSTRIP':
            return mostVersion;
        case 'LED':
            return mostVersion;
        case 'MOTORS':
            return mostVersion;
        case 'USB_AUDIO':
            return mostVersion;
        case 'USB_CAMERA':
            return mostVersion;
        default:
            return -1;
    }
}

exports.getBlockLatestVersion = getBlockLatestVersion;