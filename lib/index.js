'use strict';

const events = require('events');
const stream = require('stream');
const ws = require('ws');

class Client extends events.EventEmitter {
  constructor() {
    super();

    this._counter = 0;
    this._commands = {};
    this._callbacks = {};
    this._socket = null;
  }

  get socket() {
    return this._socket;
  }

  connect(options) {
    if(options !== undefined) {
      if(options.uri === undefined) {
        this.emit('error', new Error('No URI was provided. The options parameter need the uri property.'));
        return;
      }
    } else {
      this.emit('error', new Error('The options parameter is undefined. It has to be an object with uri as a property.'));
      return;
    }

    let socket = ws.connect(options.uri);
    socket.once('open', () => {
      this.emit('connect');
    });

    socket.on('error', error => {
      this.emit('error', error);
    });

    socket.on('message', data => {
      try {
        let message = JSON.parse(data);

        if(message.id === undefined) {
          this.emit('message', message.method, message.params);
        } else {
          let command = this._commands[message.id];
          let callback = this._callbacks[message.id];

          this.emit('response', command, message);

          if(callback) {
            if(message.error) {
              callback(message.error);
            } else {
              callback(null, message.result);
            }

            delete this._callbacks[message.id];        
          }

          delete this._commands[message.id];     
        }
      } catch(error) {
        this.emit('error', error);
      }
    });

    this._socket = socket;
    this.emit('socket', socket);
  }

  send(method, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = undefined;
    }

    if (typeof params === 'undefined') {
      params = {};
    }

    let id = this._counter++;
    let request = {
      id: id,
      method: method,
      params: params
    };

    this._commands[id] = request;
    this._callbacks[id] = callback;

    this.emit('request', request);
    this._socket.send(JSON.stringify(request));
  }

  close() {
    if(this._socket) {
      this._socket.removeAllListeners();
      this._socket.close();
      this.emit('close');
    }
  }
}

module.exports.Client = Client;

function connect(options) {
  var client = new Client();
  if(options.uri !== undefined) {
    client.connect(options);
  }
  
  return client;
}

module.exports.connect = connect;
