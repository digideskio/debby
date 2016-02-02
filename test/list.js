'use strict';

const debby = require('..');
const test = require('tape');
const http = require('http');

test('test list targets', assert => {
  assert.plan(4);

  var server = http.createServer();
  server.once('listening', () => {
    server.once('request', (request, response) => {
      assert.equal(request.url, '/json/list');

      response.end(JSON.stringify([
        {
          description: '',
          devtoolsFrontendUrl: '/devtools/inspector.html?ws=localhost:9222/devtools/page/6A164AE7-4780-4D98-B3F6-FE60B50AA089',
          faviconUrl: 'http://www.chromium.org/_/rsrc/1354323194313/favicon.ico',
          id: '6A164AE7-4780-4D98-B3F6-FE60B50AA089',
          thumbnailUrl: '/thumb/6A164AE7-4780-4D98-B3F6-FE60B50AA089',
          title: 'The Chromium Projects',
          type: 'page',
          url: 'http://www.chromium.org/',
          webSocketDebuggerUrl: 'ws://localhost:9222/devtools/page/6A164AE7-4780-4D98-B3F6-FE60B50AA089'
        }
      ]));
    });

    debby.list(4000, (error, targets) => {
      assert.error(error);
      assert.deepEqual(targets, [
        {
          description: '',
          devtoolsFrontendUrl: '/devtools/inspector.html?ws=localhost:9222/devtools/page/6A164AE7-4780-4D98-B3F6-FE60B50AA089',
          faviconUrl: 'http://www.chromium.org/_/rsrc/1354323194313/favicon.ico',
          id: '6A164AE7-4780-4D98-B3F6-FE60B50AA089',
          thumbnailUrl: '/thumb/6A164AE7-4780-4D98-B3F6-FE60B50AA089',
          title: 'The Chromium Projects',
          type: 'page',
          url: 'http://www.chromium.org/',
          webSocketDebuggerUrl: 'ws://localhost:9222/devtools/page/6A164AE7-4780-4D98-B3F6-FE60B50AA089'
        }
      ]);

      server.once('close', () => {
        assert.pass('close');
      });

      server.close();
    });
  });

  server.listen(4000);
});
