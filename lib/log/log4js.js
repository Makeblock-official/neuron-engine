var log4js = require('log4js');
log4js.configure({
  appenders: [
    { type: 'console' } //控制台输出
  ],
  replaceConsole: false
});

var logger = log4js.getLogger('engineLog');

function setLoglevel(level){
  logger.setLevel(level);
}
exports.setLoglevel = setLoglevel;
exports.logger = logger;
