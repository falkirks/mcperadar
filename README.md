#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

> Scan for MCPE servers in local network


## Install

```sh
$ npm install --save mcperadar
```


## Package

```js
var mcperadar = require('mcperadar');

//
// Listen to every PONG packet that is received
//
mcperadar.on('message', function(data){
  console.log(data);
});
//
// Called when a new client is discovered. A new client is a client whose clientId hasn't appeared in the current instance.
//
mcperadar.on('discover', function(data){
  console.log(data);
});

//
// Called when a client fails to respond to a PING with CLIENT_TIMEOUT milliseconds.
//
mcperadar.on('disconnect', function(data){
  console.log(data);
});

//
// Called whenever a client re-establishes a connection after
// being marked as disconnected.
//
mcperadar.on('reconnect', function(data){
  console.log(data);
});
//
// Called anytime a client opens a connection (ie: marked as connected). 
// This included 'discover' and 'reconnect'
//
mcperadar.on('connect', function(data){
  console.log(data);
});
```

### Client object
The client object is emmited to all events. **rinfo** is taken directly from the dgram package. The `pingId` is the time the packet was sent and the `ackId` is the time it was received. Times are relative to `START_TIME` and is measured in milliseconds.

```json
{
    rinfo: { address: "192.168.1.22", port: 19132 },
    advertise: "mcpe;Steve;27;0.11.0;1;5",
    serverId: "ID-of-MCPE-installation",
    pingId: 1,
    game: "mcpe",
    version: "0.11.0",
    name: "Steve",
    currentPlayers: 1,
    maxPlayers: 5,
    ackId: 25,
    connected: true
}
```

## CLI
```sh
$ npm install --global mcperadar
$ mcperadar --help
```


## License

MIT © [Falkirks](http://falkirks.com)


[npm-image]: https://badge.fury.io/js/mcperadar.svg
[npm-url]: https://npmjs.org/package/mcperadar
[travis-image]: https://travis-ci.org/Falkirks/mcperadar.svg?branch=master
[travis-url]: https://travis-ci.org/Falkirks/mcperadar
[daviddm-image]: https://david-dm.org/Falkirks/mcperadar.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/Falkirks/mcperadar
