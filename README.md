#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

> Scan for MCPE clients in local network


## Install

```sh
$ npm install --save mcperadar
```


## Usage

```js
var mcperadar = require('mcperadar');

mcperadar.on('message', function(data){
  console.log(data.name);
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
