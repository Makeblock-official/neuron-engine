var events = {
  HANDSHAKE: 'handshake',
  BLOCKLIST: 'blockListChanges',
  BLOCKSTATUS: 'blockStatusChanges',
  BLOCKCONNECTION: 'blockConnectionStatusChanges',
  BLOCKCONUT: 'sameTypeBlockCountChanges',
  DRIVERCONNECT: 'driverConnectResult',
  DRIVERDISCONNECT: 'driverDisconnect',
  AVBLOCKCHANGE: 'avblockChanges',
  RESETAVSTATE: 'resetavstate',
  ERROR: 'error',
  BLOCKVERSION: 'blockVersionResult',
  UPDATEFIRMWAREFILERESULT: 'updateFirmwareFileResult',
  SETFIRMWAREBYTYPEANDSUBTYPE: 'setFirmWareByTypeAndSubtype',
  BLOCKUPDATERESULT: 'blockUpdateResult',
  INITIATIVEDISCONNECT: 'initiativeDisconnect',
  DISCONNBLOCKRECONNECT: 'disconnBLockReconnect'
};

module.exports = events;
