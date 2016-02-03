'use strict';

const debby = require('..');
const test = require('tape');
const ws = require('ws');

test('test DOM notifications', assert => {
  assert.plan(9);

  var server = ws.createServer({port: '4000'});
  server.once('connection', connection => {

    connection.send(JSON.stringify({
      method: 'DOM.attributeModified',
      params: {
        nodeId: 45,
        name: 'id',
        value: 'title'
      }
    }));

    connection.send(JSON.stringify({
      method: 'DOM.attributeRemoved',
      params: {
        nodeId: 45,
        name: 'class'
      }
    }));

    connection.send(JSON.stringify({
      method: 'DOM.characterDataModified',
      params: {
        nodeId: 45,
        characterData: 'Debby'
      }
    }));

    connection.send(JSON.stringify({
      method: 'DOM.childNodeCountUpdated',
      params: {
        nodeId: 45,
        childNodeCount: 1
      }
    }));

    connection.send(JSON.stringify({
      method: 'DOM.childNodeInserted',
      params: {
        parentNodeId: 45,
        previousNodeId: 32,
        node: { nodeId: 14 }
      }
    }));

    connection.send(JSON.stringify({
      method: 'DOM.childNodeRemoved',
      params: {
        parentNodeId: 5,
        nodeId: 14
      }
    }));

    connection.send(JSON.stringify({
      method: 'DOM.documentUpdated'
    }));

    connection.send(JSON.stringify({
      method: 'DOM.setChildNodes',
      params: {
        parentId: 5,
        nodes: []
      }
    }));            

  });

  var client = debby.connect('ws://localhost:4000');
  client.once('close', () => {
    server.close();
    assert.pass('close');
  });

  client.dom.on('modify', params => {
    assert.deepEqual(params, { nodeId: 45, name: 'id', value: 'title' });
  });

  client.dom.on('detach', params => {
    assert.deepEqual(params, { nodeId: 45, name: 'class' });
  });

  client.dom.on('change', params => {
    assert.deepEqual(params, { nodeId: 45, characterData: 'Debby' });
  });

  client.dom.on('count', params => {
    assert.deepEqual(params, { nodeId: 45, childNodeCount: 1 });
  });

  client.dom.on('insert', params => {
    assert.deepEqual(params, { parentNodeId: 45, previousNodeId: 32, node: { nodeId: 14 } });
  });

  client.dom.on('remove', params => {
    assert.deepEqual(params, { parentNodeId: 5, nodeId: 14 });
  });

  client.dom.on('update', () => {
    assert.pass('update');
  });

  client.dom.on('assemble', params => {
    assert.deepEqual(params, { parentId: 5, nodes: [] });
    client.close();
  });
});
