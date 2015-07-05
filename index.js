'use strict';
var events = require('events');
var dgram = require('dgram');
var ByteBuffer = require('bytebuffer');
var portfinder = require('portfinder');
var crypto = require('crypto');

portfinder.basePort = 49152;

var START_TIME = new Date().getTime();
var CLIENT_TIMEOUT = 1000;

function getClientId(data){
  return (data.clientId != null ? data.clientId : crypto.createHash('md5').update(data.serverId + data.rinfo.address + data.rinfo.port.toString()).digest('hex'));
}

var RAKNET = {
  STRUCTURE : 5,
  MAGIC : "00ffff00fefefefefdfdfdfd12345678",
  SERVER_ID: 925686942,
  UNCONNECTED_PING : 0x01,
  UNCONNECTED_PING_OPEN_CONNECTIONS : 0x02,

  OPEN_CONNECTION_REQUEST_1 : 0x05,
  OPEN_CONNECTION_REPLY_1 : 0x06,
  OPEN_CONNECTION_REQUEST_2 : 0x07,
  OPEN_CONNECTION_REPLY_2 : 0x08,

  INCOMPATIBLE_PROTOCOL_VERSION : 0x1a, //CHECK THIS

  UNCONNECTED_PONG : 0x1c,
  ADVERTISE_SYSTEM : 0x1d,
  DATA_PACKET_0 : 0x80,
  DATA_PACKET_1 : 0x81,
  DATA_PACKET_2 : 0x82,
  DATA_PACKET_3 : 0x83,
  DATA_PACKET_4 : 0x84,
  DATA_PACKET_5 : 0x85,
  DATA_PACKET_6 : 0x86,
  DATA_PACKET_7 : 0x87,
  DATA_PACKET_8 : 0x88,
  DATA_PACKET_9 : 0x89,
  DATA_PACKET_A : 0x8a,
  DATA_PACKET_B : 0x8b,
  DATA_PACKET_C : 0x8c,
  DATA_PACKET_D : 0x8d,
  DATA_PACKET_E : 0x8e,
  DATA_PACKET_F : 0x8f,

  NACK : 0xa0,
  ACK : 0xc0
};
var UNCONNECTED_PING = function(pingId){
  this.bb = new ByteBuffer();
  this.bb.buffer[0] = RAKNET.UNCONNECTED_PING;
  this.bb.offset = 1;
  this.pingId = pingId;
};
UNCONNECTED_PING.prototype.encode = function(){
  //console.log(this.pingId);
  this.bb
    .writeLong(this.pingId)
    .append(RAKNET.MAGIC, "hex")
    .flip()
    .compact();
};


var UNCONNECTED_PONG = function(buf){
  this.bb = buf;
  this.bb.offset = 1;
};
UNCONNECTED_PONG.prototype.decode = function(){
  //console.log(this.bb.buffer.toString("hex"));
  this.pingId = this.bb.readLong();
  this.serverId = this.bb.readLong();
  this.bb.offset += 16;
  this.nameLength = this.bb.readShort();
  this.advertiseString = this.bb.readUTF8String(this.nameLength);
  var splitString = this.advertiseString.split(/;/g);
  this.gameId = splitString[0];
  this.name = splitString[1];
  this.unknownId = splitString[2];
  this.gameVersion = splitString[3];
  this.currentPlayers = splitString[4];
  this.maxPlayers = splitString[5];
};

var MCPERADAR = function(){
  portfinder.getPort((function (err, port) {
    this.client = dgram.createSocket("udp4");
    this.client.bind({port: port}, (function(){
        this.client.setBroadcast(true);
    }).bind(this));
    events.EventEmitter.call(this);
    this.clients = {};
    this.start();
    this.client.on("message", ((function (msg, rinfo) {
      var buf = new ByteBuffer().append(msg, "hex").flip();
      var id = buf.buffer[0];
      switch(id){
        case RAKNET.UNCONNECTED_PONG:
          var pong = new UNCONNECTED_PONG(buf);
          pong.decode();
          var client = {
            'rinfo': rinfo,
            'advertise': pong.advertiseString,
            'serverId': pong.serverId,
            'pingId': pong.pingId,
            'game': pong.gameId,
            'version': pong.gameVersion,
            'name': pong.name,
            'currentPlayers': pong.currentPlayers,
            'maxPlayers': pong.maxPlayers,
            'ackId': new Date().getTime() - START_TIME,
            'connected': true
          };
          var clientId = getClientId(client);
          client.clientId = clientId;
          if(this.clients[clientId] == null){
            this.emit('discover', client);
            this.emit('connect', client);
          }
          else if(!this.clients[clientId].connected){
            this.emit('connect', client);
            this.emit('reconnect', client);
          }
          this.clients[clientId] = client;
          this.emit("message", client);
          break;
        default:
          break;
      }
    }).bind(this)));
  }).bind(this));
};
MCPERADAR.prototype = events.EventEmitter.prototype;

MCPERADAR.prototype.startBroadcast = function(){
  if(this.broadcastIntervalId == null) {
    this.broadcastIntervalId = setInterval((function () {
      var ping = new UNCONNECTED_PING(new Date().getTime() - START_TIME);
      ping.encode();
      this.client.send(ping.bb.buffer, 0, ping.bb.buffer.length, 19132, "255.255.255.255");
    }).bind(this), 100);
  }
};
MCPERADAR.prototype.stopBroadcast = function(){
  if(this.broadcastIntervalId != null) {
    clearInterval(this.broadcastIntervalId);
  }
};
MCPERADAR.prototype.startClientTimeout = function(){
  if(this.clientTimeoutIntervalId == null) {
    this.clientTimeoutIntervalId = setInterval((function () {
      for(var clientId in this.clients){
        if(this.clients.hasOwnProperty(clientId) && this.clients[clientId] != null && this.clients[clientId].connected){
          if(this.clients[clientId].ackId+CLIENT_TIMEOUT < new Date().getTime() - START_TIME){
            this.emit('disconnect', this.clients[clientId]);
            this.clients[clientId].connected = false;
          }
        }
      }
    }).bind(this), CLIENT_TIMEOUT);
  }
};
MCPERADAR.prototype.stopClientTimeout = function(){
  if(this.clientTimeoutIntervalId != null) {
    clearInterval(this.clientTimeoutIntervalId);
  }
};
MCPERADAR.prototype.start = function(){
  this.startBroadcast();
  this.startClientTimeout();
};
MCPERADAR.prototype.stop = function () {
  this.stopBroadcast();
  this.startClientTimeout();
};
MCPERADAR.prototype.getClientById = function(clientId){
  return this.clients[clientId] || null;
};



module.exports = new MCPERADAR();
