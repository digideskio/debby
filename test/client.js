'use strict';

const debby = require('..');
const test = require('tape');
const ws = require('ws');

test('test client connect errors', assert => {
  assert.plan(2);

  var client = new debby.Client();
  try{
    client.connect();
  } catch(error) {
    assert.equals(error.toString(), 'Error: The options parameter is undefined. It has to be an object with uri as a property.');
  }

  try{
    client.connect({foo: 'bar'});
  } catch(error) {
    assert.equals(error.toString(), 'Error: No URI was provided. The options parameter need the uri property.');
  } 
});

test('test client commands', assert => {
  assert.plan(4);

  var server = ws.createServer({ port: 4000 });
  server.once('connection', connection => {

    let counter = 0;
    connection.on('message', data => {
      let message = JSON.parse(data);

      let err = (counter++ & 1 ) ? {} : null;

      connection.send(JSON.stringify({
        id: message.id,
        error: err
      }));
    });
  });

  server.on('listening', () => {

    var client = debby.connect({uri: 'ws://localhost:4000'});
    client.once('close', () => {
      server.close();
      assert.pass('close');
    });

    client.once('connect', () => {

      client.once('request', request => {
        assert.equal(request.method, 'Console.enable');
      });

      client.send('Console.enable', error => {
        assert.error(error);

        client.send('Console.disable', error => {
          assert.deepEqual(error, {});

          client.close();
        });
      });
    });
  });
});

test('test client commands with params and result', assert => {
  assert.plan(5);

  var example = {
    func: 'function getCompletions(type)\r\n{var object;if(type===\"string\")\r\nobject=new String(\"\");else if(type===\"number\")\r\nobject=new Number(0);else if(type===\"boolean\")\r\nobject=new Boolean(false);else\r\nobject=this;var resultSet={};for(var o=object;o;o=o.__proto__){try{if(type===\"array\"&&o===object&&ArrayBuffer.isView(o)&&o.length>9999)\r\ncontinue;var names=Object.getOwnPropertyNames(o);for(var i=0;i<names.length;++i)\r\nresultSet[names[i]]=true;}catch(e){}}\r\nreturn resultSet;}',
    res: {type: 'object',value:{JOT_callGateway:true,trim:true,Map:true,_gaq:true,ga:true,sites:true,JOT_postEvent:true,JOT_getCompParts:true,Math:true,document:true,eval:true,encodeURI:true,Uint8Array:true,Uint16Array:true,JOT_userRelTimeStrs:true,Int8Array:true,JOT_setupPostRenderingManager:true,RangeError:true,chrome:true,DebugLogDisplay:true,JOT_SUBPAGE_click:true,Float64Array:true,URIError:true,JOT_setStatusMsg:true,external:true,maestroRunner:true,isNaN:true,jstiming:true,decodeURIComponent:true,JOT_callEndpoint:true,JOT_setTextDir:true,decodeURI:true,DataView:true,parseInt:true,escape:true,goog:true,String:true,Function:true,Object:true,EvalError:true,Float32Array:true,Intl:true,Array:true,GoogleAnalyticsObject:true,RegExp:true,JOT_addListener:true,webspace:true,JOT_fullyLoaded:true,ReferenceError:true,JOT_insertAnalyticsCode:true,JOT_postFormToGateway:true,undefined:true,unescape:true,JOT_formatRelativeToNow:true,Infinity:true,_gat:true,SyntaxError:true,Int16Array:true,Promise:true,Date:true,breadcrumbs:true,Number:true,JOT_clearStatusMsg:true,JOT_wrapTextDir:true,Boolean:true,Error:true,ResourceLoader:true,WeakMap:true,Symbol:true,userfeedback:true,JOT_delayedEvents:true,JOT_addParamToUri:true,Uint8ClampedArray:true,Uint32Array:true,JOT_removeListenerByKey:true,Int32Array:true,gsites:true,isFinite:true,TypeError:true,ArrayBuffer:true,JOT_insertTranslateCode:true,JOT_getTextDir:true,JOT_clearDotPath:true,gaplugins:true,parseFloat:true,__remoteObjectAPI:true,gC:true,NaN:true,Set:true,JOT_siteRelTimeStrs:true,JOT_setInnerRelativeTime:true,closure_lm_880882:true,WeakSet:true,JOT_setMobilePreview:true,gaGlobal:true,JOT_setupNav:true,JSON:true,JOT_removeAllListenersForName:true,JOT_NAVIGATION_titleChange:true,byId:true,encodeURIComponent:true,webkitOfflineAudioContext:true,webkitAudioContext:true,OfflineAudioContext:true,AudioContext:true,speechSynthesis:true,webkitSpeechRecognitionEvent:true,webkitSpeechRecognitionError:true,webkitSpeechRecognition:true,webkitSpeechGrammarList:true,webkitSpeechGrammar:true,caches:true,SpeechSynthesisUtterance:true,SpeechSynthesisEvent:true,ScreenOrientation:true,PushSubscription:true,PushManager:true,PresentationRequest:true,Presentation:true,PresentationConnection:true,PresentationConnectionAvailableEvent:true,PresentationAvailability:true,Permissions:true,PermissionStatus:true,Notification:true,MediaSource:true,MediaDevices:true,MediaKeys:true,MediaKeySystemAccess:true,MediaKeySession:true,MediaKeyMessageEvent:true,MediaEncryptedEvent:true,BeforeInstallPromptEvent:true,AppBannerPromptResult:true,localStorage:true,sessionStorage:true,webkitStorageInfo:true,webkitRTCPeerConnection:true,webkitMediaStream:true,webkitIDBTransaction:true,webkitIDBRequest:true,webkitIDBObjectStore:true,webkitIDBKeyRange:true,webkitIDBIndex:true,webkitIDBFactory:true,webkitIDBDatabase:true,webkitIDBCursor:true,indexedDB:true,webkitIndexedDB:true,ondeviceorientation:true,ondevicemotion:true,crypto:true,WebSocket:true,WebGLUniformLocation:true,WebGLTexture:true,WebGLShaderPrecisionFormat:true,WebGLShader:true,WebGLRenderingContext:true,WebGLRenderbuffer:true,WebGLProgram:true,WebGLFramebuffer:true,WebGLContextEvent:true,WebGLBuffer:true,WebGLActiveInfo:true,TextEncoder:true,TextDecoder:true,SubtleCrypto:true,StorageEvent:true,Storage:true,ServiceWorkerRegistration:true,ServiceWorkerMessageEvent:true,ServiceWorkerContainer:true,ServiceWorker:true,Response:true,Request:true,RTCSessionDescription:true,RTCIceCandidate:true,Plugin:true,PluginArray:true,Path2D:true,MimeType:true,MimeTypeArray:true,MediaStreamTrack:true,MediaStreamEvent:true,MediaKeyStatusMap:true,MIDIPort:true,MIDIOutputMap:true,MIDIOutput:true,MIDIMessageEvent:true,MIDIInputMap:true,MIDIInput:true,MIDIConnectionEvent:true,MIDIAccess:true,IDBVersionChangeEvent:true,IDBTransaction:true,IDBRequest:true,IDBOpenDBRequest:true,IDBObjectStore:true,IDBKeyRange:true,IDBIndex:true,IDBFactory:true,IDBDatabase:true,IDBCursorWithValue:true,IDBCursor:true,Headers:true,GamepadEvent:true,Gamepad:true,GamepadButton:true,DeviceOrientationEvent:true,DeviceMotionEvent:true,CryptoKey:true,Crypto:true,CloseEvent:true,CanvasRenderingContext2D:true,CanvasPattern:true,CanvasGradient:true,CacheStorage:true,Cache:true,BatteryManager:true,WaveShaperNode:true,ScriptProcessorNode:true,PeriodicWave:true,OscillatorNode:true,OfflineAudioCompletionEvent:true,MediaStreamAudioSourceNode:true,MediaStreamAudioDestinationNode:true,MediaElementAudioSourceNode:true,GainNode:true,DynamicsCompressorNode:true,DelayNode:true,ConvolverNode:true,ChannelSplitterNode:true,ChannelMergerNode:true,BiquadFilterNode:true,AudioProcessingEvent:true,AudioParam:true,AudioNode:true,AudioListener:true,AudioDestinationNode:true,AudioBufferSourceNode:true,AudioBuffer:true,AnalyserNode:true,postMessage:true,blur:true,focus:true,close:true,onautocompleteerror:true,onautocomplete:true,SVGMPathElement:true,SVGDiscardElement:true,SVGAnimationElement:true,XSLTProcessor:true,SharedWorker:true,SVGTransformList:true,SVGTransform:true,SVGStringList:true,SVGPreserveAspectRatio:true,SVGPointList:true,SVGNumberList:true,SVGLengthList:true,SVGLength:true,SVGAnimatedTransformList:true,SVGAnimatedString:true,SVGAnimatedRect:true,SVGAnimatedPreserveAspectRatio:true,SVGAnimatedNumberList:true,SVGAnimatedNumber:true,SVGAnimatedLengthList:true,SVGAnimatedLength:true,SVGAnimatedInteger:true,SVGAnimatedEnumeration:true,SVGAnimatedBoolean:true,SVGAnimatedAngle:true,IdleDeadline:true,TimeRanges:true,MediaError:true,HTMLVideoElement:true,HTMLSourceElement:true,HTMLMediaElement:true,Audio:true,HTMLAudioElement:true,InputDeviceCapabilities:true,applicationCache:true,performance:true,onunload:true,onstorage:true,onpopstate:true,onpageshow:true,onpagehide:true,ononline:true,onoffline:true,onmessage:true,onlanguagechange:true,onhashchange:true,onbeforeunload:true,onwaiting:true,onvolumechange:true,ontoggle:true,ontimeupdate:true,onsuspend:true,onsubmit:true,onstalled:true,onshow:true,onselect:true,onseeking:true,onseeked:true,onscroll:true,onresize:true,onreset:true,onratechange:true,onprogress:true,onplaying:true,onplay:true,onpause:true,onmousewheel:true,onmouseup:true,onmouseover:true,onmouseout:true,onmousemove:true,onmouseleave:true,onmouseenter:true,onmousedown:true,onloadstart:true,onloadedmetadata:true,onloadeddata:true,onload:true,onkeyup:true,onkeypress:true,onkeydown:true,oninvalid:true,oninput:true,onfocus:true,onerror:true,onended:true,onemptied:true,ondurationchange:true,ondrop:true,ondragstart:true,ondragover:true,ondragleave:true,ondragenter:true,ondragend:true,ondrag:true,ondblclick:true,oncuechange:true,oncontextmenu:true,onclose:true,onclick:true,onchange:true,oncanplaythrough:true,oncanplay:true,oncancel:true,onblur:true,onabort:true,XPathResult:true,XPathExpression:true,XPathEvaluator:true,XMLSerializer:true,XMLHttpRequestUpload:true,XMLHttpRequestProgressEvent:true,XMLHttpRequestEventTarget:true,XMLHttpRequest:true,XMLDocument:true,Worker:true,Window:true,WheelEvent:true,WebKitCSSMatrix:true,ValidityState:true,VTTCue:true,URL:true,UIEvent:true,TreeWalker:true,TransitionEvent:true,TrackEvent:true,TouchList:true,TouchEvent:true,Touch:true,TextTrackList:true,TextTrackCueList:true,TextTrackCue:true,TextTrack:true,TextMetrics:true,TextEvent:true,Text:true,StyleSheetList:true,StyleSheet:true,ShadowRoot:true,Selection:true,SecurityPolicyViolationEvent:true,Screen:true,SVGZoomEvent:true,SVGViewSpec:true,SVGViewElement:true,SVGUseElement:true,SVGUnitTypes:true,SVGTitleElement:true,SVGTextPositioningElement:true,SVGTextPathElement:true,SVGTextElement:true,SVGTextContentElement:true,SVGTSpanElement:true,SVGSymbolElement:true,SVGSwitchElement:true,SVGStyleElement:true,SVGStopElement:true,SVGSetElement:true,SVGScriptElement:true,SVGSVGElement:true,SVGRectElement:true,SVGRect:true,SVGRadialGradientElement:true,SVGPolylineElement:true,SVGPolygonElement:true,SVGPoint:true,SVGPatternElement:true,SVGPathElement:true,SVGNumber:true,SVGMetadataElement:true,SVGMatrix:true,SVGMaskElement:true,SVGMarkerElement:true,SVGLinearGradientElement:true,SVGLineElement:true,SVGImageElement:true,SVGGraphicsElement:true,SVGGradientElement:true,SVGGeometryElement:true,SVGGElement:true,SVGForeignObjectElement:true,SVGFilterElement:true,SVGFETurbulenceElement:true,SVGFETileElement:true,SVGFESpotLightElement:true,SVGFESpecularLightingElement:true,SVGFEPointLightElement:true,SVGFEOffsetElement:true,SVGFEMorphologyElement:true,SVGFEMergeNodeElement:true,SVGFEMergeElement:true,SVGFEImageElement:true,SVGFEGaussianBlurElement:true,SVGFEFuncRElement:true,SVGFEFuncGElement:true,SVGFEFuncBElement:true,SVGFEFuncAElement:true,SVGFEFloodElement:true,SVGFEDropShadowElement:true,SVGFEDistantLightElement:true,SVGFEDisplacementMapElement:true,SVGFEDiffuseLightingElement:true,SVGFEConvolveMatrixElement:true,SVGFECompositeElement:true,SVGFEComponentTransferElement:true,SVGFEColorMatrixElement:true,SVGFEBlendElement:true,SVGEllipseElement:true,SVGElement:true,SVGDescElement:true,SVGDefsElement:true,SVGCursorElement:true,SVGComponentTransferFunctionElement:true,SVGClipPathElement:true,SVGCircleElement:true,SVGAnimateTransformElement:true,SVGAnimateMotionElement:true,SVGAnimateElement:true,SVGAngle:true,SVGAElement:true,ReadableStream:true,ReadableByteStream:true,Range:true,RadioNodeList:true,ProgressEvent:true,ProcessingInstruction:true,PopStateEvent:true,PerformanceTiming:true,PerformanceResourceTiming:true,PerformanceNavigation:true,PerformanceMeasure:true,PerformanceMark:true,PerformanceEntry:true,Performance:true,PageTransitionEvent:true,NodeList:true,NodeIterator:true,NodeFilter:true,Node:true,Navigator:true,NamedNodeMap:true,MutationRecord:true,MutationObserver:true,MutationEvent:true,MouseEvent:true,MessagePort:true,MessageEvent:true,MessageChannel:true,MediaQueryListEvent:true,MediaQueryList:true,MediaList:true,Location:true,KeyboardEvent:true,ImageData:true,ImageBitmap:true,History:true,HashChangeEvent:true,HTMLUnknownElement:true,HTMLUListElement:true,HTMLTrackElement:true,HTMLTitleElement:true,HTMLTextAreaElement:true,HTMLTemplateElement:true,HTMLTableSectionElement:true,HTMLTableRowElement:true,HTMLTableElement:true,HTMLTableColElement:true,HTMLTableCellElement:true,HTMLTableCaptionElement:true,HTMLStyleElement:true,HTMLSpanElement:true,HTMLShadowElement:true,HTMLSelectElement:true,HTMLScriptElement:true,HTMLQuoteElement:true,HTMLProgressElement:true,HTMLPreElement:true,HTMLPictureElement:true,HTMLParamElement:true,HTMLParagraphElement:true,HTMLOutputElement:true,HTMLOptionsCollection:true,Option:true,HTMLOptionElement:true,HTMLOptGroupElement:true,HTMLObjectElement:true,HTMLOListElement:true,HTMLModElement:true,HTMLMeterElement:true,HTMLMetaElement:true,HTMLMenuElement:true,HTMLMarqueeElement:true,HTMLMapElement:true,HTMLLinkElement:true,HTMLLegendElement:true,HTMLLabelElement:true,HTMLLIElement:true,HTMLKeygenElement:true,HTMLInputElement:true,Image:true,HTMLImageElement:true,HTMLIFrameElement:true,HTMLHtmlElement:true,HTMLHeadingElement:true,HTMLHeadElement:true,HTMLHRElement:true,HTMLFrameSetElement:true,HTMLFrameElement:true,HTMLFormElement:true,HTMLFormControlsCollection:true,HTMLFontElement:true,HTMLFieldSetElement:true,HTMLEmbedElement:true,HTMLElement:true,HTMLDocument:true,HTMLDivElement:true,HTMLDirectoryElement:true,HTMLDialogElement:true,HTMLDetailsElement:true,HTMLDataListElement:true,HTMLDListElement:true,HTMLContentElement:true,HTMLCollection:true,HTMLCanvasElement:true,HTMLButtonElement:true,HTMLBodyElement:true,HTMLBaseElement:true,HTMLBRElement:true,HTMLAreaElement:true,HTMLAnchorElement:true,HTMLAllCollection:true,FormData:true,FontFace:true,FocusEvent:true,FileReader:true,FileList:true,FileError:true,File:true,EventTarget:true,EventSource:true,Event:true,ErrorEvent:true,Element:true,DragEvent:true,DocumentType:true,DocumentFragment:true,Document:true,DataTransferItemList:true,DataTransferItem:true,DataTransfer:true,DOMTokenList:true,DOMStringMap:true,DOMStringList:true,DOMSettableTokenList:true,DOMParser:true,DOMImplementation:true,DOMException:true,DOMError:true,CustomEvent:true,CompositionEvent:true,Comment:true,ClipboardEvent:true,ClientRectList:true,ClientRect:true,CharacterData:true,CSSViewportRule:true,CSSSupportsRule:true,CSSStyleSheet:true,CSSStyleRule:true,CSSStyleDeclaration:true,CSSRuleList:true,CSSRule:true,CSSPageRule:true,CSSNamespaceRule:true,CSSMediaRule:true,CSSKeyframesRule:true,CSSKeyframeRule:true,CSSImportRule:true,CSSGroupingRule:true,CSSFontFaceRule:true,CSS:true,CDATASection:true,Blob:true,BeforeUnloadEvent:true,BarProp:true,AutocompleteErrorEvent:true,Attr:true,ApplicationCacheErrorEvent:true,ApplicationCache:true,AnimationEvent:true,isSecureContext:true,onwheel:true,onwebkittransitionend:true,onwebkitanimationstart:true,onwebkitanimationiteration:true,onwebkitanimationend:true,ontransitionend:true,onsearch:true,onanimationstart:true,onanimationiteration:true,onanimationend:true,WebKitMutationObserver:true,webkitURL:true,WebKitAnimationEvent:true,WebKitTransitionEvent:true,styleMedia:true,defaultstatus:true,defaultStatus:true,screenTop:true,screenLeft:true,offscreenBuffering:true,event:true,clientInformation:true,console:true,devicePixelRatio:true,outerHeight:true,outerWidth:true,screenY:true,screenX:true,pageYOffset:true,scrollY:true,pageXOffset:true,scrollX:true,innerHeight:true,innerWidth:true,screen:true,navigator:true,frameElement:true,parent:true,opener:true,top:true,length:true,frames:true,closed:true,status:true,toolbar:true,statusbar:true,scrollbars:true,personalbar:true,menubar:true,locationbar:true,history:true,location:true,name:true,self:true,window:true,stop:true,open:true,alert:true,confirm:true,prompt:true,print:true,requestAnimationFrame:true,cancelAnimationFrame:true,captureEvents:true,releaseEvents:true,getComputedStyle:true,matchMedia:true,moveTo:true,moveBy:true,resizeTo:true,resizeBy:true,getSelection:true,find:true,getMatchedCSSRules:true,webkitRequestAnimationFrame:true,webkitCancelAnimationFrame:true,webkitCancelRequestAnimationFrame:true,btoa:true,atob:true,setTimeout:true,clearTimeout:true,setInterval:true,clearInterval:true,requestIdleCallback:true,cancelIdleCallback:true,scroll:true,scrollTo:true,scrollBy:true,fetch:true,webkitRequestFileSystem:true,webkitResolveLocalFileSystemURL:true,openDatabase:true,toString:true,TEMPORARY:true,PERSISTENT:true,constructor:true,addEventListener:true,removeEventListener:true,dispatchEvent:true,toLocaleString:true,valueOf:true,hasOwnProperty:true,isPrototypeOf:true,propertyIsEnumerable:true,__defineGetter__:true,__lookupGetter__:true,__defineSetter__:true,__lookupSetter__:true}}
  };

  var server = ws.createServer({ port: 4000 });
  server.once('connection', connection => {
    connection.on('message', data => {
      let message = JSON.parse(data);

      connection.send(JSON.stringify({
        id: message.id,
        result:  {
          result: example.res,
          wasThrown: false
        }
      }));
    });
  });

  server.on('listening', () => {

    var client = debby.connect({uri: 'ws://localhost:4000'});
    client.once('close', () => {
      server.close();
      assert.pass('close');
    });

    client.once('connect', () => {
      client.once('request', request => {
        assert.equal(request.method, 'Runtime.callFunctionOn');
        assert.deepEqual(request.params, { 
          objectId: '{ \"injectedScriptId\": 33, \"id\": 11 }', 
          functionDeclaration: example.func,
          arguments: [{"type":"undefined"}],
          returnByValue: true
        });
      });

      client.send('Runtime.callFunctionOn', { 
        objectId: '{ \"injectedScriptId\": 33, \"id\": 11 }', 
        functionDeclaration: example.func,
        arguments: [{"type":"undefined"}],
        returnByValue: true
      }, (error, result) => {
        assert.deepEqual(result.result, example.res);
        assert.notOk(result.wasThrown);
        client.close();
      });
    });
  });
});
