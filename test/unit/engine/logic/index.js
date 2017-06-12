var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);

var core = require('../../../../lib/engine/logic/core');
var index = require('../../../../lib/engine/logic/index');

var DEFAULT_CONF = {
  driver: 'mock', 
  loglevel: 'WARN',
  serverIP: '192.168.100.1',
  socketServerPort: 8082,
  userKey: '',
  uuid: '',
  device: '',
  runtime: '',
};

describe('logic/index', function() {
  var coreStub = {};
  coreStub.start = sinon.spy(core, "start");
  var engine = index.create(DEFAULT_CONF);
  expect(coreStub.start).to.have.been.called;
  coreStub.start.restore();
});
