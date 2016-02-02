'use strict';

const debby = require('..');
const test = require('tape');
const ws = require('ws');

test('test debugger notifications', assert => {
  assert.plan(7);

  var parameters = {
    resolve: {
      breakpointId: '12',
      location: { columnNumber: 0, lineNumber: 0, scriptId: '33' }
    },
    pause: {
      callFrames: [],
      reason: { columnNumber: 0, lineNumber: 0, scriptId: '33' }
    },
    fail: {
      url: 'extensions::json_schema',
      scriptSource: 'self',
      startLine: 0,
      errorLine: 256,
      errorMessage: 'error'      
    },
    parse: {
      scriptId: '318',
      url: 'extensions::json_schema',
      startLine: 0,
      startColumn: 0,
      endLine: 526,
      endColumn: 2
    }
  };

  var server = ws.createServer({port: '4000'});
  server.once('connection', connection => {

    connection.send(JSON.stringify({
      method: 'Debugger.breakpointResolved',
      params: parameters.resolve
    }));

    connection.send(JSON.stringify({
      method: 'Debugger.globalObjectCleared'
    }));

    connection.send(JSON.stringify({
      method: 'Debugger.paused',
      params: parameters.pause
    }));

    connection.send(JSON.stringify({
      method: 'Debugger.resumed'
    }));  

    connection.send(JSON.stringify({
      method: 'Debugger.scriptFailedToParse',
      params: parameters.fail
    }));

    connection.send(JSON.stringify({
      method: 'Debugger.scriptParsed',
      params: parameters.parse
    }));

  });

  var client = debby.connect({uri: 'ws://localhost:4000'});
  client.once('close', () => {
    server.close();
    assert.pass('close');
  });

  client.debugger.on('resolve', params => {
    assert.deepEqual(params, parameters.resolve);
  });

  client.debugger.on('clear', () => {
    assert.pass('cleared');
  });

  client.debugger.on('pause', params => {
    assert.deepEqual(params, parameters.pause);
  }); 

  client.debugger.on('resume', () => {
    assert.pass('resumed');
  });

  client.debugger.on('fail', params => {
    assert.deepEqual(params, parameters.fail);
  });

  client.debugger.on('parse', params => {
    assert.deepEqual(params, parameters.parse);
    client.close();
  });    
});
