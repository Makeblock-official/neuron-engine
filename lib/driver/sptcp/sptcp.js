var util = require('util');  
  
function SPtcp(socket) {  
    //解析所处的阶段  
    var _sp_parse_step = SPtcp.SP_PARSE_STEP.HEADER;  
    //接收缓存  
    var _sp_rcv_buf = new Buffer(0);  
    //包头  
    var _sp_header = null;  
    //包体  
    var _sp_body = null;  
    //套接字  
    this.socket = socket;  
  
    //解析整包方法  
    function _spParseSPPacket(func){  
        if (_sp_rcv_buf.length >= SPtcp.SP_HEADER_LENGTH) {  
            //解析包头  
            _sp_header = {bodyLength: _sp_rcv_buf.readUInt16LE(0, true)};  
            //裁剪接收缓存  
            _sp_rcv_buf = _sp_rcv_buf.slice(SPtcp.SP_HEADER_LENGTH);  
            //解析包体  
            _sp_parse_step = SPtcp.SP_PARSE_STEP.BODY;  
            _spParseBody(func);  
        }  
    }  
  
    //解析包体方法  
    function _spParseBody(func){  
        if (_sp_rcv_buf.length >= _sp_header.bodyLength) {  
            var packet = _sp_rcv_buf.toString('utf8', 0, _sp_header.bodyLength);  
            // util.log('['+socket.remoteAddress+']->['+socket.localAddress+'] receive: '+packet);  
            //裁剪接收缓存  
            _sp_rcv_buf = _sp_rcv_buf.slice(_sp_header.bodyLength);  
            //处理消息  
            try {  
                var msg = JSON.parse(packet);  
                func(msg);  
            } catch(e) {  
                util.log(e);  
            }  
            //清空包头和包体  
            _sp_header = null;  
            _sp_body = null;  
            //解析下一个包  
            _sp_parse_step = SPtcp.SP_PARSE_STEP.HEADER;  
            _spParseSPPacket(func);  
        }  
    } 
  
    //接收数据  
    this.spReceiveData = function(data, func){  
        //合并新旧数据  
        _sp_rcv_buf = Buffer.concat([_sp_rcv_buf, data]);  
        //解析处理数据  
        if (_sp_parse_step == SPtcp.SP_PARSE_STEP.HEADER) {  
            _spParseSPPacket(func);  
        } else if (_sp_parse_step == SPtcp.SP_PARSE_STEP.BODY) {  
            _spParseBody(func);  
        }  
    };  
  
    //发送数据  
    this.spSendData = function(msg){  
        var packet = JSON.stringify(msg);  
        var body_buf = new Buffer(packet);  
        var head_buf = new Buffer(SPtcp.SP_HEADER_LENGTH);  
        head_buf.writeUInt16LE(body_buf.length);  
        var snd_buf = Buffer.concat([head_buf, body_buf]); 
        if (this.socket && (this.socket.readyState === 'open')) { 
          this.socket.write(snd_buf);  
        } 
    };  
  
    //销毁方法  
    this.spDestroy = function() {  
        delete this.socket;  
    };  
}  
  
//包头长度，单位字节  
SPtcp.SP_HEADER_LENGTH = 4;  
//解析所处的阶段  
SPtcp.SP_PARSE_STEP = {  
    HEADER: 0,  //解析包头阶段  
    BODY: 1,    //解析包体阶段  
};  
  
exports.SPtcp = SPtcp; 