/**
 * logic engine
 */
var protocol = require('../../protocol');
var config = require('../../config/config');
var core = require('./core');
var log4js = require('../../log/log4js');
var logger = log4js.logger;
var block = require('./block');
var event = require('../../event/event');
var update = require('./update');
var firmware = require('./firmware');

var LogicEngine = function(conf) {
  var self = this;

  config.setConfig(conf);

  this._config = config.getConfig();

  log4js.setLoglevel(this._config.loglevel);

  /**
   * [setConfig sets config]
   * @param {object} conf [configuration]
   */
  this.setConfig = function(conf) {
    config.setConfig(conf);
  };

  /**
   * [setDriver sets driver]
   * @param {string} type [the type of driver.]
   */
  this.setDriver = function(type) {
    return core.setDriver(type);
  };

  /**
   * [getDriverConnectResult return the current driver ConnectResult]
   * @return {integer}      [1: success; 0:fail]
  */
  this.getDriverConnectResult = function() {
    return core.getDriverConnectResult();
  };

  /**
   * [closeDriver closde driver]
   */
  this.closeDriver = function() {
    core.closeDriver();
  };

  /**
   * registerBlockType adds a new type of block to the engine.
   * @param {object} option [block configuration and implementation.]
   */
  this.registerBlockType = function(option) {
    return block.registerBlockType(option);
  };

  /**
   * unregisterBlockType remove block type by name.
   * @param {string} type [the name of the block type]
   */
  this.unregisterBlockType = function(name) {
    return block.unregisterBlockType(name);
  };

  /**
   * setBlockStatus sets a block's status.
   * @param {string} type   [the name of the block type]
   * @param {object} status [the status to set]
   * @param {integer} idx    [optional, if set, will set status of the {idx}th block of specified type(idx begins from 0 and defaults to 0)]
   */
  this.setBlockStatus = function(type, status, idx) {
    return core.setBlockStatus(type, status, idx);
  };

  /**
   * updateBlockStatus update a Block's status to app.
   */
  this.updateBlockStatus = function(name, idx) {
    return core.updateBlockStatus(name, idx);
  };

  /**
   * updateAllBlockStatus update all Block's status to app.
   */
  this.updateAllBlockStatus = function() {
    return core.updateAllBlockStatus();
  };

  /**
   * getVoiceCommand.
   * @return {object} {command1: id1;command2: id2;......}
   */
  this.getVoiceCommand = function() {
    return core.getVoiceCommand();
  };

  /**
   * getBlockStatus queries a block's status.
   * @param  {string}   type     [the name of the block type]
   * @param  {integer}   idx      [optional, if set, will set status of the {idx}th block of specified type(idx begins from 0 and defaults 0)]
   * @return {Promise}            [the status promise]
   */
  this.getBlockStatus = function(type, idx) {
    return core.getBlockStatus(type, idx);
  };

/**
 * getBlockSubStatus queries a block's substatus.
 * @param  {string}   type     [the name of the block type]
 * @param  {string}   subname  [the name of the block substate]
 * @param  {integer}   idx     [optional, if set, will get status of the {idx}th block of specified name(idx begins from 0 and defaults 0)]
 * @return {Promise}           [the substatus]
 */
  this.getBlockSubStatus = function(type, subname, idx) {
    return core.getBlockSubStatus(type, subname, idx);
  };

  /**
   * [getActiveBlocks get all active blocks and their values]
   * @return {object} [blocks oject]
   */
  this.getActiveBlocks = function() {
    return core.getActiveBlocks();
  };

  /**
   * send block command sends a command to block name.
   * @param {string} name   [the name of the block type]
   * @param {string} command   [the name of the block command]
   * @param {object} params [the params of the block command]
   * @param {integer} idx    [optional, if set, will set status of the {idx}th block of specified type(idx begins from 0 and defaults to 0)]
   */
  this.sendBlockCommand = function(name, command, params, idx) {
    return core.sendBlockCommand(name, command, params, idx);
  };

  /**
   * send get block version command to block name.
   * @param {string} name   [the name of the block type]
   * @param {integer} idx    [optional, if set, will get block version of the {idx}th block of specified type(idx begins from 0 and defaults to 0)]
   */
  this.getBlockVersion = function(name, idx) {
    return core.getBlockVersion(name, idx);
  };

  this.getTypeAndSubtypeByName = function(name) {
    return core.getTypeAndSubtypeByName(name);
  };

  this.setBlockFirmware = function(type, subtype, firmwarebuf) {
    return firmware.setFirmware(type, subtype, firmwarebuf);
  };

  this.updateBlockFirmware = function(name, idx) {
    return update.updateBlockFirmware(name, idx);
  };

  this.resetFirmwareUpdateState = function(nodesLength) {
    return update.resetFirmwareUpdateState(nodesLength);
  };

  this.setUpdatingFalse = function() {
    return update.setUpdatingFalse();
  };

  /**
   * setBlockCommonCommand sends a common command to block.
   * @param {string} name   [the name of the block type]
   * @param {string} command   [the name of the block command]
   * @param {object} params [the params of the block command]
   * @param {integer} idx    [optional, if set, will set status of the {idx}th block of specified type(idx begins from 0 and defaults to 0)]
   */
  this.setBlockCommonCommand = function(name, command, params, idx) {
    return core.setBlockCommonCommand(name, command, params, idx);
  };

  /**
   * start interface
   */
  this.start = function() {
    return core.start();
  };

  /**
   * stop interface
   */
  this.stop = function() {
    return core.stop();
  };

  /**
   * send HeartbeatPkg interface
   */
  this.sendHeartbeatPkg = function() {
    return core.sendHeartbeatPkg();
  };

  /**
   * stop HeartbeatPkg interface
   */
  this.stopHeartbeatPkg = function() {
    return core.stopHeartbeatPkg();
  };

  this.event = event;
  
  /**
   * on registers an event handler to engine.
   * @param  {string}   event    [the event name]
   * @param  {Function} callback [callback funtion when event triggers]
   */
  this.on = function(event, callback) {
    this.event.on(event, callback);
  };

  /**
   * remove an event handler.
   * @param  {string}   event    [the event name]
   * @param  {Function} callback [callback funtion when event triggers]
   */
  this.removeListener = function(event, callback) {
    this.event.removeListener(event, callback);
  };

  // static the egine
  core.start();
};

module.exports = LogicEngine;
