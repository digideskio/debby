'use strict';

const debby = require('..');
const test = require('tape');
const ws = require('ws');

test('test console notifications', assert => {
  assert.plan(4);

  let messages = [
  {
    source: 'console-api',
    level: 'info',
    text: '[Faye.Client] Initiating connection for \"tzcbry00j8hrc9d31ygjohuuulw40d2\"'
  }, 
  {
    source: 'console-api',
    level: 'debug',
    text: '[Faye.Client] Passing through \"outgoing\" extensions: {\"channel\":\"/meta/connect\",\"clientId\":\"tzcbry00j8hrc9d31ygjohuuulw40d2\",\"connectionType\":\"websocket\",\"id\":\"f\"}'
  }
  ];

  var server = ws.createServer({port: '4000'});
  server.once('connection', connection => {
    messages.forEach(message => {

      connection.send(JSON.stringify({
        method: 'Console.messageAdded',
        params: {
          message
        }
      }));

      connection.send(JSON.stringify({
        method: 'Console.messagesCleared'
      }));

    });
  });

  var client = debby.connect({uri: 'ws://localhost:4000'});
  client.once('close', () => {
    server.close();
    assert.pass('close');
  });

  client.console.on('data', message => {
    assert.deepEqual(message, messages.shift());
    if(messages.length == 0) {
      client.close();
    }
  });

  client.console.on('clear', () => {
    assert.pass('cleared');
  });  
});
