debby
=====

Debugging interface for Chrome [Remote Debugging Protocol 1.1](https://developer.chrome.com/devtools/docs/protocol/1.1/index) that provides an abstraction for sending commands and handling notifications using Node.js.

## Installation

Install through npm

```sh
$ npm install debby --save
```

## Usage

Start Chrome with the `--remote-debugging-port=<port>` to enable the protocol.

```sh
$ google-chrome --remote-debugging-port=9222
```

## API

### list(port, [host], [callback])

List all the inspectable targets. Can be accessed as an array in the callback function.

```javascript
var debby = require('debby');

debby.list(9222, (error, targets) => {
  for(target of targets) {
    console.log(target);
  }
});
```

### connect(url)

Create a Client and connect it to a socket with the given url parameter.

```javascript
var debby = require('debby');

var client = debby.connect('ws://localhost:9222');
```

### Class: Client

#### client.send(method, [params], [callback])

Use client to send commands to Chrome.

```javascript
var debby = require('debby');

var client = debby.connect('ws://localhost:9222');

client.send('Console.enable');
```

#### client.close()

Closes the socket connection with Chrome.

### Class: Console

#### Event 'clear'

Emitted upon `Console.messagesCleared` notification.

### Class: Runtime

#### Event 'create', params

Emitted upon `Runtime.executionContextCreated` notification.

### Class: Debugger

#### Event 'resolve', params

Emitted upon `Debugger.breakpointResolved` notification.

#### Event 'clear'

Emitted upon `Debugger.globalObjectCleared` notification.

#### Event 'pause', params

Emitted upon `Debugger.paused` notification.

#### Event 'resume'

Emitted upon `Debugger.resumed` notification.

#### Event 'fail', params

Emitted upon `Debugger.scriptFailedToParse` notification.

#### Event 'parse', params

Emitted upon `Debugger.scriptParsed` notification.

### Class: Page

#### Event 'content', params

Emitted upon `Page.domContentEventFired` notification.

#### Event 'attach', params

Emitted upon `Page.frameAttached` notification.

#### Event 'detach', params

Emitted upon `Page.frameDetached` notification.

#### Event 'navigate', params

Emitted upon `Page.frameNavigated` notification.

#### Event 'load', params

Emitted upon `Page.loadEventFired` notification.

### Class: Timeline

#### Event 'record', params

Emitted upon `Timeline.eventRecorded` notification.
