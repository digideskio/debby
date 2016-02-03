debby
=====

Provides functionality for sending commands and handle notifications on Chrome targets using [Remote Debugging Protocol 1.1](https://developer.chrome.com/devtools/docs/protocol/1.1/index).

## Installation

Install through npm

```sh
$ npm install debby --save
```
## Usage

Start Chrome with the *--remote-debugging-port=\<port\>* to enable the protocol.

```sh
$ google-chrome --remote-debugging-port=9222
```
First, add *debby*
```javascript
var debby = require('debby');
// ...
```
To send commands using [Remote Debugging Protocol 1.1](https://developer.chrome.com/devtools/docs/protocol/1.1/index), use a *client* connected to a *target*.

```javascript
var client = debby.connect('ws://localhost:9222/<path>');

client.on('connect', () => {
  client.send('Page.navigate', { url: 'http://www.chromium.org/' });
});

client.close();
```
List all the inspectable targets on a given port

```javascript
var targets = debby.list(9222, targets => {
  for(target on targets) {
    // Do something
  }
});
```
## API
### Class: Client
#### client.connect(url)
#### client.send(method, [params], [callback])
#### client.close()

### Class: Console
#### Event 'clear'

Emitted upon `Console.messagesCleared` notification.

### Class: Runtime
#### Event 'create'
##### Parameters:
* context ( [ExecutionContextDescription](https://developer.chrome.com/devtools/docs/protocol/1.1/runtime#type-ExecutionContextDescription) )

Emitted upon `Runtime.executionContextCreated` notification.

### Class: Debugger
#### Event 'resolve'
##### Parameters:
* breakpointId ( [BreakpointId](https://developer.chrome.com/devtools/docs/protocol/1.1/debugger#type-BreakpointId) )
* location ( [Location](https://developer.chrome.com/devtools/docs/protocol/1.1/debugger#type-Location) )

Emitted upon `Debugger.breakpointResolved` notification.

#### Event 'clear'

Emitted upon `Debugger.globalObjectCleared` notification.

#### Event 'pause'
##### Parameters:
* callFrames ( array of [CallFrame](https://developer.chrome.com/devtools/docs/protocol/1.1/debugger#type-CallFrame) )
* reason ( enumerated string \["CSPViolation" , "DOM" , "EventListener" , "XHR" , "assert" , "debugCommand" , "exception" , "other" \] )
* data ( optional object )

Emitted upon `Debugger.paused` notification.

#### Event 'resume'

Emitted upon `Debugger.resumed` notification.

#### Event 'fail'
##### Parameters:
* url ( string )
* scriptSource ( string )
* errorLine ( integer )
* errorMessage ( string )

Emitted upon `Debugger.scriptFailedToParse` notification.

#### Event 'parse'
##### Parameters:
* scriptId ( [ScriptId](https://developer.chrome.com/devtools/docs/protocol/1.1/debugger#type-ScriptId) )
* url ( string )
* startLine ( integer )
* startColumn ( integer )
* endLine ( integer )
* endColumn ( integer )
* isContentScript ( optional boolean )
* sourceMapURL ( optional string )

Emitted upon `Debugger.scriptParsed` notification.

### Class: Page
#### Event 'content'
##### Parameters:
* timestamp ( number )

Emitted upon `Page.domContentEventFired` notification.

#### Event 'attach'
##### Parameters:
* frameId ( [FrameId](https://developer.chrome.com/devtools/docs/protocol/1.1/page#type-FrameId) )

Emitted upon `Page.frameAttached` notification.

#### Event 'detach'
##### Parameters:
* frameId ( [FrameId](https://developer.chrome.com/devtools/docs/protocol/1.1/page#type-FrameId) )

Emitted upon `Page.frameDetached` notification.

#### Event 'navigate'
##### Parameters:
* frame ( [Frame](https://developer.chrome.com/devtools/docs/protocol/1.1/page#type-Frame) )

Emitted upon `Page.frameNavigated` notification.

#### Event 'load'
##### Parameters:
* timestamp ( number )

Emitted upon `Page.loadEventFired` notification.

### Class: Timeline
#### Event 'record'
##### Parameters:
* record ( [TimelineEvent](https://developer.chrome.com/devtools/docs/protocol/1.1/timeline#type-TimelineEvent) )

Emitted upon `Timeline.eventRecorded` notification.

### Class: Network
#### Event 'data'
##### Parameters:
* requestId ( [RequestId](https://developer.chrome.com/devtools/docs/protocol/1.1/network#type-RequestId) )
* timestamp ( [Timestamp](https://developer.chrome.com/devtools/docs/protocol/1.1/network#type-Timestamp) )
* dataLength ( integer )
* encodedDataLength ( integer )

Emitted upon `Network.dataReceived` notification.

#### Event 'fail'
##### Parameters:
* requestId ( [RequestId](https://developer.chrome.com/devtools/docs/protocol/1.1/network#type-RequestId) )
* timestamp ( [Timestamp](https://developer.chrome.com/devtools/docs/protocol/1.1/network#type-Timestamp) )
* errorText ( string )
* canceled ( optional boolean )

Emitted upon `Network.loadingFailed` notification.

#### Event 'finish'
##### Parameters:
* requestId ( [RequestId](https://developer.chrome.com/devtools/docs/protocol/1.1/network#type-RequestId) )
* timestamp ( [Timestamp](https://developer.chrome.com/devtools/docs/protocol/1.1/network#type-Timestamp) )

Emitted upon `Network.loadingFinished` notification.

#### Event 'cache'
##### Parameters:
* requestId ( [RequestId](https://developer.chrome.com/devtools/docs/protocol/1.1/network#type-RequestId) )

Emitted upon `Network.requestServedFromCache` notification.

#### Event 'request'
##### Parameters:
* requestId ( [RequestId](https://developer.chrome.com/devtools/docs/protocol/1.1/network#type-RequestId) )
* loaderId ( [LoaderId](https://developer.chrome.com/devtools/docs/protocol/1.1/network#type-LoaderId) )
* documentURL ( string )
* request ( [Request](https://developer.chrome.com/devtools/docs/protocol/1.1/network#type-Request) )
* timestamp ( [Timestamp](https://developer.chrome.com/devtools/docs/protocol/1.1/network#type-Timestamp) )
* initiator ( [Initiator](https://developer.chrome.com/devtools/docs/protocol/1.1/network#type-Initiator) )
* redirectResponse ( optional [Response](https://developer.chrome.com/devtools/docs/protocol/1.1/network#type-Response) )

Emitted upon `Network.requestWillBeSent` notification.

#### Event 'response'
##### Parameters:
* requestId ( [RequestId](https://developer.chrome.com/devtools/docs/protocol/1.1/network#type-RequestId) )
* loaderId ( [LoaderId](https://developer.chrome.com/devtools/docs/protocol/1.1/network#type-LoaderId) )
* timestamp ( [Timestamp](https://developer.chrome.com/devtools/docs/protocol/1.1/network#type-Timestamp) )
* type ( [Page.ResourceType](https://developer.chrome.com/devtools/docs/protocol/1.1/page#type-ResourceType) )
* response ( [Response](https://developer.chrome.com/devtools/docs/protocol/1.1/network#type-Response) )

Emitted upon `Network.responseReceived` notification.

### Class: Dom
#### Event 'modify'
##### Parameters:
* nodeId ( [NodeId](https://developer.chrome.com/devtools/docs/protocol/1.1/dom#type-NodeId) )
* name ( string )
* value ( string )

Emitted upon `DOM.attributeModified` notification.

#### Event 'detach'
##### Parameters:
* nodeId ( [NodeId](https://developer.chrome.com/devtools/docs/protocol/1.1/dom#type-NodeId) )
* name ( string )

Emitted upon `DOM.attributeRemoved` notification.

#### Event 'change'
##### Parameters:
* nodeId ( [NodeId](https://developer.chrome.com/devtools/docs/protocol/1.1/dom#type-NodeId) )
* characterData ( string )

Emitted upon `DOM.characterDataModified` notification.

#### Event 'count'
##### Parameters:
* nodeId ( [NodeId](https://developer.chrome.com/devtools/docs/protocol/1.1/dom#type-NodeId) )
* childNodeCount ( integer )

Emitted upon `DOM.childNodeCountUpdated` notification.

#### Event 'insert'
##### Parameters:
* parentNodeId ( [NodeId](https://developer.chrome.com/devtools/docs/protocol/1.1/dom#type-NodeId) )
* previousNodeId ( [NodeId](https://developer.chrome.com/devtools/docs/protocol/1.1/dom#type-NodeId) )
* node ( [Node](https://developer.chrome.com/devtools/docs/protocol/1.1/dom#type-Node) )

Emitted upon `DOM.childNodeInserted` notification.

#### Event 'remove'
##### Parameters:
* parentNodeId ( [NodeId](https://developer.chrome.com/devtools/docs/protocol/1.1/dom#type-NodeId) )
* nodeId ( [NodeId](https://developer.chrome.com/devtools/docs/protocol/1.1/dom#type-NodeId) )

Emitted upon `DOM.childNodeRemoved` notification.

#### Event 'update'

Emitted upon `DOM.documentUpdated` notification.

#### Event 'assemble'
##### Parameters:
* parentId ( [NodeId](https://developer.chrome.com/devtools/docs/protocol/1.1/dom#type-NodeId) )
* node ( array of [Node](https://developer.chrome.com/devtools/docs/protocol/1.1/dom#type-Node) )

Emitted upon `DOM.setChildNodes` notification.
