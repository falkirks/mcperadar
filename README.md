#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

> Scan for MCPE servers in local network


## Install

```sh
$ npm install --save mcperadar
```


## Usage

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
