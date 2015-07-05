#!/usr/bin/env node
'use strict';

//var UP_LINE = "\\033[1A";
//var DELETE_LINE = "\\033[K";

var meow = require('meow');
var crypto = require('crypto');
var mcperadar = require('./');
var cli = meow({
  help: [
    'Usage',
    '  mcperadar',
    ''
  ].join('\n')
});

function getClientId(data){
  return crypto.createHash('md5').update(data.serverId + data.rinfo.address + data.rinfo.port.toString()).digest('hex');
}

var clients = {};

setInterval(function(){
  for(var clientId in clients){
    if(clients.hasOwnProperty(clientId) && clients[clientId] != null){
      if(clients[clientId].updateTime+1500 < new Date().getTime()){
        if(cli.flags.format === "log") {
          console.log(clientId + " has been timed out.");
        }
        clients[clientId] = null;
      }
    }
  }
}, 500);

mcperadar.on("message", function(data){
  //console.log(data.name);
  data.updateTime = new Date().getTime();
  var clientId = getClientId(data);
  if(clients[clientId] === null){
    if(cli.flags.format === "log") {
      console.log(clientId + " has been discovered with the name " + data.name);
    }
  }
  clients[getClientId(data)] = data;
});
