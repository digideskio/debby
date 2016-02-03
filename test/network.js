'use strict';

const debby = require('..');
const test = require('tape');
const ws = require('ws');

test('test network notifications', assert => {
  assert.plan(7);

  var parameters = {
    data: {
      requestId: '22',
      timestamp: 56,
      dataLength: 200,
      encodedDataLength: 200
    },
    fail: {
      requestId: '22',
      timestamp: 56,
      errorText: ''
    },
    finish: {
      requestId: '22',
      timestamp: 56   
    },
    cache: {
      requestId: '22'
    },
    request: {
      requestId: '22',
      loaderId: '23',
      documentURL: '',
      request: { headers: {}, method: '', url: ''},
      timestamp: 56,
      initiator: { type: 'script' }
    },
    response: {
      requestId: '22',
      loaderId: '23',
      timestamp: 56,
      type: 'WebSocket',
      response: { 
        connectionId: '22',
        connectionReused: false,
        headers: {},
        mimeType: 'application/json',
        status: 200,
        statusText: 'OK',
        url: '' 
      }
    },        
  };

  var server = ws.createServer({port: '4000'});
  server.once('connection', connection => {

    connection.send(JSON.stringify({
      method: 'Network.dataReceived',
      params: parameters.data
    }));

    connection.send(JSON.stringify({
      method: 'Network.loadingFailed',
      params: parameters.fail
    }));

     connection.send(JSON.stringify({
      method: 'Network.loadingFinished',
      params: parameters.finish
    }));
    
    connection.send(JSON.stringify({
      method: 'Network.requestServedFromCache',
      params: parameters.cache
    }));

    connection.send(JSON.stringify({
      method: 'Network.requestWillBeSent',
      params: parameters.request
    }));

    connection.send(JSON.stringify({
      method: 'Network.responseReceived',
      params: parameters.response
    }));    

  });

  var client = debby.connect('ws://localhost:4000');
  client.once('close', () => {
    server.close();
    assert.pass('close');
  });

  client.network.on('data', params => {
    assert.deepEqual(params, parameters.data);
  });

  client.network.on('fail', params => {
    assert.deepEqual(params, parameters.fail);
  });

  client.network.on('finish', params => {
    assert.deepEqual(params, parameters.finish);
  });

  client.network.on('cache', params => {
    assert.deepEqual(params, parameters.cache);
  });

  client.network.on('request', params => {
    assert.deepEqual(params, parameters.request);
  });

  client.network.on('response', params => {
    assert.deepEqual(params, parameters.response);
    client.close();
  });      
});
