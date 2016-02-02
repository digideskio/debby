'use strict';

const debby = require('..');
const test = require('tape');
const ws = require('ws');

test('test runtime notifications', assert => {
  assert.plan(2);

  var server = ws.createServer({port: '4000'});
  server.once('connection', connection => {
      connection.send(JSON.stringify({
        method: 'Runtime.executionContextCreated',
        params: {
          context: { id: 34, name:'', origin:'http://www.chromium.org', frameId:'7936.2' }
        }
      }));
  });

  var client = debby.connect({uri: 'ws://localhost:4000'});
  client.once('close', () => {
    server.close();
    assert.pass('close');
  });

  client.runtime.on('create', params => {
    assert.deepEqual(params.context, { id: 34, name:'', origin:'http://www.chromium.org', frameId:'7936.2' });
    client.close();
  });
});
