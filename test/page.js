'use strict';

const debby = require('..');
const test = require('tape');
const ws = require('ws');

test('test page notifications', assert => {
  assert.plan(6);

  var server = ws.createServer({port: '4000'});
  server.once('connection', connection => {

    connection.send(JSON.stringify({
      method: 'Page.domContentEventFired',
      params: {
        timestamp: 45
      }
    }));

    connection.send(JSON.stringify({
      method: 'Page.frameAttached',
      params: {
        frameId: '5'
      }
    }));

    connection.send(JSON.stringify({
      method: 'Page.frameDetached',
      params: {
        frameId: '5'
      }
    }));

    connection.send(JSON.stringify({
      method: 'Page.frameNavigated',
      params: {
        frame: {
          id: '24',
          loaderId: '25',
          secyrityOrigin: '',
          url: ''
        }
      }
    }));

    connection.send(JSON.stringify({
      method: 'Page.loadEventFired',
      params: {
        timestamp: 256
      }
    }));

  });

  var client = debby.connect('ws://localhost:4000');
  client.once('close', () => {
    server.close();
    assert.pass('close');
  });

  client.page.on('content', params => {
    assert.equal(params.timestamp, 45);
  });

  client.page.on('attach', params => {
    assert.equal(params.frameId, '5');
  });

  client.page.on('detach', params => {
    assert.equal(params.frameId, '5');
  });

  client.page.on('navigate', params => {
    assert.deepEqual(params.frame, {
      id: '24',
      loaderId: '25',
      secyrityOrigin: '',
      url: ''
    });
  });

  client.page.on('load', params => {
    assert.equal(params.timestamp, 256);
    client.close();
  });      
});