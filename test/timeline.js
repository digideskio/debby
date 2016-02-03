'use strict';

const debby = require('..');
const test = require('tape');
const ws = require('ws');

test('test timeline notifications', assert => {
  assert.plan(2);

  var server = ws.createServer({port: '4000'});
  server.once('connection', connection => {
    connection.send(JSON.stringify({
      method: 'Timeline.eventRecorded',
      params: {
        record: { data: {}, type: 'record' }
      }
    }));
  });

  var client = debby.connect('ws://localhost:4000');
  client.once('close', () => {
    server.close();
    assert.pass('close');
  });

  client.timeline.on('record', params => {
    assert.deepEqual(params.record, { data: {}, type: 'record' });
    client.close();
  });
});
