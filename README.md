#neurons-engine

## Introduction
Neurons Engine is the JavaScript implementation of neurons central processing block, which runs on both Node and browser environment. It includes two parts:
1. Logic Engine.
   * Neurons binary protocol implementation.
   * Neurons blocks auto discovery and management.
   * Communication drivers used for running on different platforms.
2. Flow Engine.
   * Provide Flow-based API to easy Programming.

## How To Use
### PC/RPI/IntelEdison

1. install NodeJS environment.
2. run `node cli.js`.
3. connect the blocks with serial port.

### Browser

1. copy `browser/neurons_engine.js` to your project.
2. add `<script src="/path/to/neurons_engine.js"></script>` in your html `<head>` tag.

### Example
see 'example'

## LogicEngine Programming API

### Create LogicEngine
#### In Node
``` javascript
    var engine = require('./lib/engine/logic').create(
      {"driver": "serial", "loglevel": "DEBUG"}
    );
```

#### In Browser
``` javascript
    var engine = createNeuronsLogicEngine(
      {"driver": "makeblockhd", "loglevel": "DEBUG"}
    );

#### configuration

* `driver`: the driver to use ,currently support 
    * **serial**(Node Only), 
    * **tcpsocket**(Node Only),
    * **cordovable**(Makeblock Neuron App Only), 
    * **cordovatcp**(Makeblock Neuron App Only),

* `loglevel`: the loglevel to set ,when set, will not print the log which priority lower than set.
  * currently support loglevel
    * **TRACE**,
    * **DEBUG**,
    * **INFO**,
    * **WARN**,
    * **ERROR**,
    * **FATAL**
```

### Engine.getActiveBlocks()

Get all active blocks and their values. Example result:

``` javascript
    {
        "1_KEY_BUTTON": [
           {press: 0}
        ],
        "TEMPERATURE": [
          {temperature: 27}
        ],
        "HUMITURE": [
          {temperature_humidity: [27,70]}
        ],        
    }
```

### Engine.getBlockSubStatus(name, subname, idx = 0)

Queries a block's substatus by name. if idx is provided, will return the status of the {idx}th block of the name. If the required block does not exist, will return `null`.

Return the values array of the block if block exists. eg: `[1, 34]`.

### Engine.sendBlockCommand(name, command, params, idx = 0)
Sends a command to block of name given. Only works for blocks with sub command.

* `name`: the name of the block type. eg: "MOTORS"
* `command`: the name of the block command, eg: "SET_SPEED"
* `params`: [array],the params of the block command, eg: [100,-100] //port1 port2

### Engine Events

use `Engine.on(event, callback)` to register an event handler.

support events:

#### 'handshake'

`callback(name, idx)`

* `name`: the name of block type
* `idx`: the {idx}th block

#### 'error'

callback(error)

#### 'blockListChanges'

`callback(list)`

* `list`: the active blocks list. see `Engine.getActiveBlocks`

### 'blockStatusChanges'

`callback(name, idx, values)`

`values`: see `Engine.GetBlockStatus`

### 'blockConnectionStatusChanges'

`callback({name: $name, idx: $idx, state: $state})`

### Electronic Block Definition

All support electronic blocks are defined in `lib/blocks/electronic` folder by JSON objects. You can define your own block for extension: 

``` javascript
var example = {
  name: 'example', // the block name, MUST be unique
  type: 0x00, // the block type id 
  subtype: 0x01, // the block subtype id , optional.
  status: ['byte', 'BYTE', 'short', 'float'] // the block status values type definition.
};
```

For blocks will sub status:

``` javascript
var example2 = {
  // the name of the block, must not be unique.
  name: 'example2',
  // the typeid of block.
  type: 0x00,
  // subtypeid of block, optional.
  // subtype: 0x01,
  // available sub status' datatype.
  status: {
    'sub1' : {
      'subid': 0x01,
      'datatype': ['float']
    },
    'sub2' : {
      'subid': 0x02, 
      'datatype' : ['byte', 'BYTE', 'short', 'float']
    }
  }
};
```

For blocks with sub command:

``` javascript
var example3 = {
  // the name of the block, must not be unique.
  name: 'example3',
  // the typeid of block.
  type: 0x01,
  // subtypeid of block, optional.
  // subtype: 0x01,
  // available sub status' datatype.
  status: {
    'sub1' : {
      'subid': 0x01,
      'datatype': ['float']
    },
    'sub2' : {
      'subid': 0x02, 
      'datatype' : ['byte', 'BYTE', 'short', 'float']
    }
  },
  // block's commands
  commands: {
    'command1': {
      'commandid': 0x01,
      'datatype': ['float']
    }, 
    'command2' : {
      'commandid': 0x02, 
      'datatype' : ['byte', 'BYTE', 'short', 'float']
    }
  }
};

```

supported value type:

* "byte": 7bit/byte byte
* "BYTE": 8bit/byte byte (only use when the byte length < 128)
* "short": 7bit/byte short
* "SHORT": 7bit/byte short, but ignore most significant byte (only use when the MSB is 0x00)
* "long": 0x11111111 // 7bit/byte long
* "float": 7bit/byte float
* "double": 7bit/byte double
* "string": 7bit/byte byte array, in TLV format

## development
### run tests

``` bash
gulp test
```

### run syntax check

```bash
gulp jshint
```

### export to browser

```bash
gulp browserify
```

### compress after browserify

```bash
gulp compress
```
### USB Camera block

Access by Wifi Block

Snapshot: http://192.168.100.1:8329/snap?filename=test.jpg

Note: Can also be used directly connected to PC and it will be detected as a USB 2.0 device.
