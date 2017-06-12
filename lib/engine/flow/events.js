var events = {
  NODELIST: 'NodeListChanged',
  NODEINPUT: 'NodeInputChanged',
  NODEOUTPUT: 'NodeOutputChanged',
  NODECONNECTION: 'NodeConnectionStatusChanged',
  NODECOUNT: 'SameTypeNodeCountChanged',
  CATEGORYCHANGE: 'CategoryChanged',
  ERROR: 'error',
  NODEVERSION: 'NodeVersion',
  NODESETFIRMWARE: 'NodeSetFirmware',
  NODEUPDATERESULT: 'NodeUpdateResult',
  NODEINITIATIVEDISCONNECT: 'NodeInitiativeDisconnect',
  NODEDISCONNRECONNECT: 'NodeDisconnReconnect'
};

module.exports = events;
