'use strict';

const events = require('events');
const stream = require('stream');
const ws = require('ws');
const http = require('http');

class Console extends stream.Readable {
  constructor(client) {
    super({
      objectMode: true
    });

    client.on('message', (method, params) => {
      if(method === 'Console.messageAdded') {
        this.push(params.message);
      } else if (method === 'Console.messagesCleared') {
        this.emit('clear');
      }
    });

    this._client = client;
  }

  get client() {
    return this._client;
  }

  _read() {}
}

module.exports.Console = Console;

class Runtime extends events.EventEmitter {
  constructor(client) {
    super();

    client.on('message', (method, params) => {
      if(method === 'Runtime.executionContextCreated') {
        this.emit('create', params);
      } 
    });

    this._client = client;
  }

  get client() {
    return this._client;
  }
}

module.exports.Runtime = Runtime;

class Debugger extends events.EventEmitter {
  constructor(client) {
    super();

    client.on('message', (method, params) => {
      if(method === 'Debugger.breakpointResolved') {
        this.emit('resolve', params);
      } else if(method === 'Debugger.globalObjectCleared') {
        this.emit('clear');
      } else if(method === 'Debugger.paused') {
        this.emit('pause', params);
      } else if(method === 'Debugger.resumed') {
        this.emit('resume');
      } else if(method === 'Debugger.scriptFailedToParse') {
        this.emit('fail', params);
      } else if(method === 'Debugger.scriptParsed') {
        this.emit('parse', params);
      }
    });

    this._client = client;
  }

  get client() {
    return this._client;
  }  
}

module.exports.Debugger = Debugger;

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

  get console() {
    if(!this._console) {
      this._console = new Console(this);
    }

    return this._console;
  }

  get runtime() {
    if(!this._runtime) {
      this._runtime = new Runtime(this);
    }

    return this._runtime;
  }

  get debugger() {
    if(!this._runtime) {
      this._debugger = new Debugger(this);
    }

    return this._debugger;
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

function list(port, host, callback) {
  if(typeof host === 'function') {
    callback = host;
    host = undefined;
  }

  if(typeof host === 'undefined') {
    host = 'localhost';
  }

  var request = http.get({
    port: port,
    host: host,
    path: '/json/list'
  });

  request.on('response', response => {
    var data = '';

    response.on('data', chunk => {
      data += chunk;
    });

    response.on('end', () => {
      try {
        let targets = JSON.parse(data);
        return callback(null, targets);
      } catch(error) {
        return callback(error);
      }
    });
  });

  request.on('error', error => {
    return callback(error);
  });
}

module.exports.list = list;
