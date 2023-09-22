sap.ui.define(["sap/base/Log","./SceneContext","./CallbackHandler","./Command","./TotaraUtils","../threejs/SceneBuilder","sap/ui/thirdparty/URI"],function(L,S,C,a,T,b,U){"use strict";var c=T.mark;var d=function(){this._pushMesh=false;this._url=null;this._cid=null;this._performanceTimingMsg=[];this._isPostable=true;this.currentSceneInfo={};this.sceneBuilder=new b();this.contextMap=new Map();this.tokenContextMap=new Map();this.onErrorCallbacks=new C();this.onImageFinishedCallbacks=new C();this.onMaterialFinishedCallbacks=new C();this.onSetGeometryCallbacks=new C();this.onSetSequenceCallbacks=new C();this.onSetTrackCallbacks=new C();this.onViewGroupUpdatedCallbacks=new C();this.onLoadingFinishedCallbacks=new C();};d.prototype.init=function(e,f){this._url=e;this._cid=f;var t=this;return new Promise(function(r){if(!t._worker){var u=new U(sap.ui.require.toUrl("sap/ui/vk/totara/TotaraLoaderWorker.js"));if(u.is("relative")){u=u.absoluteTo(new U(location.href));}var g="'"+u.toString()+"'";if(sap.ui.Device.browser.internet_explorer){var p=new U(sap.ui.require.toUrl("sap/ui/thirdparty/es6-promise.js"));var h=new U(sap.ui.require.toUrl("sap/ui/thirdparty/es6-string-methods.js"));var i=new U(sap.ui.require.toUrl("sap/ui/vk/thirdparty/ie-polyfills.js"));if(p.is("relative")){var j=new U(location.href);p=p.absoluteTo(j);h=h.absoluteTo(j);i=i.absoluteTo(j);}g="'"+p.toString()+"','"+h.toString()+"','"+i.toString()+"',"+g;}t._worker=new Worker((window.URL||window.webkitURL).createObjectURL(new Blob(["importScripts("+g+");"],{"type":"application/javascript"})));t._worker.onmessage=function(k){var m;var n=k.data;if(n.ready){return;}if(n.name==="getAuthorization"){if(n.sceneId){m=t.getContext(n.sceneId);}if(m&&m.authorizationHandler){m.authorizationHandler(n.jsonContent.url).then(function(o){t.postMessage({"method":"setAuthorization","authorizationToken":o});}).catch(function(o){t.postMessage({"method":"setAuthorization","authorizationToken":null,"error":o.toString()});});}else{t.postMessage({"method":"setAuthorization","authorizationToken":null});}return;}if(n.name==="protocol"){t.protocolVersion=n.jsonContent.version.split(".").map(function(s){return parseInt(s,10);});return;}m=t.processCommand(n.name,n.jsonContent,n.binaryContent);if(m){t.sendRequest(m.requestQueue);}};t._worker.onerror=function(k){};}});};d.prototype.dispose=function(){this.contextMap.forEach(function(e){e.dispose();});this.contextMap.clear();this.tokenContextMap.clear();this.postMessage({method:"close"});this._worker=undefined;this.currentSceneInfo=null;this.sceneBuilder.cleanup();this.sceneBuilder=null;this.onErrorCallbacks=null;this.onMaterialFinishedCallbacks=null;this.onImageFinishedCallbacks=null;this.onSetGeometryCallbacks=null;this.onSetTrackCallbacks=null;this.onSetSequenceCallbacks=null;};d.prototype.cleanup=function(){this.currentSceneInfo={};this.contextMap.clear();this.tokenContextMap.clear();this.sceneBuilder.cleanup();};d.prototype.enablePushMesh=function(e){this._pushMesh=e;};d.prototype.getUrl=function(){return this._url;};d.prototype.getSceneBuilder=function(){return this.sceneBuilder;};d.prototype.getContext=function(s){return this.contextMap.get(s);};d.prototype.createContext=function(s,p){var e=new S(s,p,this);this.contextMap.set(s,e);this.tokenContextMap.set(e.requestQueue.token,e);if(e.onActiveCamera){e.onActiveCameraCallbacks.attach(e.onActiveCamera);delete e.onActiveCamera;}if(e.onInitialSceneFinished){e.onInitialSceneFinishedCallbacks.attach(e.onInitialSceneFinished);delete e.onInitialSceneFinished;}if(e.onPartialRetrievalFinished){e.onPartialRetrievalFinishedCallbacks.attach(e.onPartialRetrievalFinished);delete e.onPartialRetrievalFinished;}if(e.onViewPartialRetrievalFinished){e.onViewPartialRetrievalFinishedCallbacks.attach(e.onViewPartialRetrievalFinished);delete e.onViewPartialRetrievalFinished;}if(e.onViewFinished){e.onViewFinishedCallbacks.attach(e.onViewFinished);delete e.onViewFinished;}if(e.onSceneCompleted){e.onSceneCompletedCallbacks.attach(e.onSceneCompleted);delete e.onSceneCompleted;}if(e.onProgressChanged){e.setOnProgressChanged(e.onProgressChanged);delete e.onProgressChanged;}if(e.onLoadingFinished){this.onLoadingFinishedCallbacks.detachAll();this.onLoadingFinishedCallbacks.attach(e.onLoadingFinished);delete e.onLoadingFinished;}if(e.onContentChangesProgress){e.onContentChangesProgressCallbacks.attach(e.onContentChangesProgress);delete e.onContentChangesProgress;}return e;};d.prototype.isLoadingFinished=function(){var e=this.contextMap.values();var f=e.next();while(!f.done){if(!f.value.isLoadingFinished()){return false;}f=e.next();}return true;};d.prototype.decrementResourceCountersForDeletedTreeNode=function(e,n){if(e){this.sceneBuilder.decrementResourceCountersForDeletedTreeNode(n,e.sceneId);}};function l(e,n){if(e.progressLogger){e.progressLogger.logPerformance(n,e.token);}}d.prototype.request=function(s,e,f){if(!e.root){throw"context must include root where three js objects are attached to";}var g=this.createContext(s,e);g.token=g.requestQueue.token;this.currentSceneInfo.id=s;g.retrievalType=S.RetrievalType.Initial;g.authorizationHandler=f;g.initialRequestTime=Date.now();if(g.enableLogger){T.createLogger(s,g,this);}g.includeHidden=e.includeHidden;g.includeAnimation=e.includeAnimation;g.selectField=e.$select;g.pushViewGroups=e.pushViewGroups;g.pushPMI=e.pushPMI;g.metadataFilter=e.metadataFilter;g.activateView=e.activateView;var h=T.createCommand(a.getScene,{sceneId:s});l(g,"modelRequested");c("modelRequested");this.postMessage({method:"initializeConnection",url:this._url,cid:this._cid,useSecureConnection:e.useSecureConnection,token:g.token,command:h,sceneId:s});};d.prototype.postMessage=function(m){if(this._worker){this._worker.postMessage(m);}};d.prototype.processSetSceneCommand=function(j){var e=this.getContext(j.veid);if(e){e.defaultViewId=j.defaultViewId;e.defaultViewGroupId=j.defaultViewGroupId;e.sceneThumbnailId=j.imageId;e.dimension=j.dimension;e.defaultRootEntityId=j.defaultRootEntityId;if(e.defaultViewGroupId){e.currentViewGroupId=e.defaultViewGroupId;}var i=e.includeHidden!==undefined?e.includeHidden:true;var f=e.includeAnimation!==undefined?e.includeAnimation:true;var s=e.$select!==undefined?e.$select:"name,transform,meshId,annotationId,materialId,contentType,visible,opacity,renderOrder,entityId,highlightStyleId";var p=e.pushViewGroups!==undefined?e.pushViewGroups:true;var g="nodes,bounds,animation";if(!f){g="nodes,bounds";}var v={pushMaterials:true,pushMeshes:this._pushMesh,sceneId:e.sceneId,token:e.token,includeHidden:i,pushViewGroups:p,pushPMI:e.pushPMI||false,metadataFilter:e.metadataFilter,$select:s,$expand:g};v.context=e.sceneId;if(e.activateView){v.id=e.activateView;}else if(e.defaultViewId){v.id=e.defaultViewId;}if(v.id){e.initialViewId=v.id;e.currentViewId=v.id;e.initialViewDecided=true;}this.postMessage(T.createRequestCommand(a.getView,v));}};d.prototype.update=function(s,e,v){this.currentSceneInfo.id=s;var f=this.getContext(s);if(!f){return Promise.reject("no context for ${sceneVeId}");}var t=this;return new Promise(function(r,g){f.nodeSidsForPartialTree=new Set(e);f.retrievalType=S.RetrievalType.Partial;var i=f.includeHidden!==undefined?f.includeHidden:true;var h=f.includeAnimation!==undefined?f.includeAnimation:true;var j=f.$select!==undefined?f.$select:"name,transform,meshId,annotationId,materialId,contentType,visible,opacity,renderOrder,entityId,highlightStyleId";var p=f.pushViewGroups!==undefined?f.pushViewGroups:true;var o={sceneId:s,token:f.token,pushMaterials:true,pushMeshes:t._pushMesh,filter:e.join(),includeAnimation:h,includeHidden:i,pushPMI:f.pushPMI||false,metadataFilter:f.metadataFilter,pushViewGroups:p,$select:j,breadcrumbs:true};if(v){o.activateView=v;}var k=T.createCommand(a.getTree,o);var m=function(){f.onPartialRetrievalFinishedCallbacks.detach(m);l(f,"updateFinished(mesh)");var n=[];var q=[];f.replacedNodes.forEach(function(x,y){q.push(x);n.push(y);});var u=n;var w=q;r({sceneVeId:s,sids:e,replacedNodeRefs:u,replacementNodeRefs:w});};f.onPartialRetrievalFinishedCallbacks.attach(m);l(f,"updateRequested");t.postMessage({method:"update",command:k});});};d.prototype.requestViewGroup=function(s,v,i){if(!v){return Promise.reject("invalid arg: viewGroupId undefined");}var e=this.getContext(s);if(!e){return Promise.reject("no context for ${sceneVeId}");}if(i!==undefined){e.includeAnimation=i;}var t=this;var p=new Promise(function(r,f){var g=t.sceneBuilder.getViewGroup(v,s);if(g&&g.length){r(g);return;}var o={sceneId:s,id:v,token:e.token};var h=function(){e.onViewGroupFinishedCallbacks.detach(h);l(e,"onViewGroupFinished");var j=t.sceneBuilder.getViewGroup(v,s);if(j&&j.length){r(j);}else{f("no view ground data");}};e.onViewGroupFinishedCallbacks.attach(h);e.currentViewGroupId=v;t.postMessage(T.createRequestCommand(a.getViewGroups,o));});return p;};d.prototype.requestView=function(s,v,e,p,i){this.currentSceneInfo.id=s;if(v!=="static"&&v!=="dynamic"){return Promise.reject("invalid arg: supported type - static, dynamic");}if(!e){return Promise.reject("invalid arg: viewId undefined");}var f=this.getContext(s);if(!f){return Promise.reject("no context for ${sceneVeId}");}f.currentViewId=e;var g=f.includeHidden!==undefined?f.includeHidden:false;var h;if(i){h=i;}else{h=f.includeAnimation!==undefined?f.includeAnimation:true;}var j=f.$select!==undefined?f.$select:"name,transform,meshId,annotationId,materialId,contentType,visible,opacity,renderOrder,entityId,highlightStyleId";var k="nodes,bounds,animation";if(!h){k="nodes,bounds";}this.hasAnimation=false;var t=this;var m=new Promise(function(r,n){var o,q;if(v==="static"){o=a.getView;q={sceneId:s,id:e,token:f.token,includeHidden:g,$select:j,$expand:k};if(p&&p.length){q.$expand="playback";f.playbackIds=p;}}else{o=a.getDynamicView;q={sceneId:s,type:e,token:f.token};}f.onSetPlaybackCallbacks.detachAll();var u=function(z){f.onSetPlaybackCallbacks.detach(u);l(f,"onSetPlayback");if(z){r(z);}else{n("no view data");}};f.onSetPlaybackCallbacks.attach(u);f.onViewFinishedCallbacks.detachAll();var w=function(z){f.onViewFinishedCallbacks.detach(w);l(f,"onViewFinished");if(!t.hasAnimation){if(z){r(z);}else{n("no view data");}}else{f.currentView=z;}};f.onViewFinishedCallbacks.attach(w);t.onSetSequenceCallbacks.detachAll();var x=function(){t.onSetSequenceCallbacks.detach(x);l(f,"onSetSequence");if(f.currentView){r(f.currentView);}};t.onSetSequenceCallbacks.attach(x);t.onSetTrackCallbacks.detachAll();var y=function(z){t.onSetTrackCallbacks.detach(y);l(f,"onSetTrack");if(f.currentView){r(f.currentView);}};t.onSetTrackCallbacks.attach(y);l(f,"viewRequested");t.postMessage(T.createRequestCommand(o,q));});return m;};d.prototype.requestMaterial=function(s,e){if(!e){return Promise.reject("invalid arg: materialId undefined");}var f=this.getContext(s);if(!f){return Promise.reject("no context for ${sceneVeId}");}var t=this;var p=new Promise(function(r,g){var h=f.sceneBuilder.getMaterial(e);if(h){r(h);return;}f.requestQueue.materials.push(e);var i=function(k){var m=t.sceneBuilder.getMaterial(e);if(m&&!m.userData.imageIdsToLoad){t.onImageFinishedCallbacks.detach(i);r(m);}};var j=function(n){if(e!=n){return;}t.onMaterialFinishedCallbacks.detach(j);var m=t.sceneBuilder.getMaterial(e);if(!m){t.onImageFinishedCallbacks.detach(i);g("no material data");}if(m.userData.imageIdsToLoad){return;}t.onImageFinishedCallbacks.detach(i);r(m);};t.onMaterialFinishedCallbacks.attach(j);t.onImageFinishedCallbacks.attach(i);t.sendRequest(f.requestQueue);});return p;};d.prototype.sendRequest=function(r){if(!this._worker){return false;}var s=false;while(!r.isEmpty()){var n=r.generateRequestCommand();this.postMessage(n);s=true;}return s;};d.prototype.timestamp=function(j){};d.prototype.performanceTiming=function(j){};d.prototype.checkError=function(j){if(!j){return true;}var r=j.result==="failure";if(r){if(j.message){j.error=j.message;delete j.message;}else{j.error="Unknown error";}}return r;};d.prototype.reportError=function(e,f){this.onErrorCallbacks.execute({error:f,context:e});};d.prototype.processContextCommand=function(e,n,j,f){if(!e){var g=n+" error: unknown context - "+JSON.stringify(j);this.contextMap.forEach(function(e){e[n].call(e,j,f);});return{error:g};}return e[n].call(e,j,f);};d.prototype.processCommand=function(n,j,e){if(this.checkError(j)){if(n===a.setTree){if(j.events&&j.events.length){var f=j.events[0];if(f.values&&f.values.id){this.contextMap.delete(f.values.id);}}}this.onErrorCallbacks.execute(j);return null;}var g=null;if(j.sceneId!==undefined){g=this.getContext(j.sceneId);}else if(j.token!==undefined){g=this.tokenContextMap.get(j.token);}if(g){this.currentSceneInfo.id=g.sceneId;}this.setPerformance(n,j,g?g.sceneId:null);var r;switch(n){case a.setScene:this.processSetSceneCommand(j);break;case a.setTree:case a.setTreeNode:case a.notifyFinishedTree:case a.setView:case a.setViewNode:case a.setViewGroup:case a.notifyFinishedView:case a.setCamera:case a.setMesh:case a.setMaterial:case a.setGeometry:case a.setImage:case a.setAnnotation:case a.setPlayback:case a.setHighlightStyle:case a.setSequence:case a.setTrack:r=this.processContextCommand(g,n,j,e);break;case a.notifyError:r={error:j.errorText};break;case a.timestamp:r=this.timestamp(j);break;case a.performanceTiming:r=this.performanceTiming(j);break;default:r={error:"Unknown command: "+n};break;}if(n!==a.setView&&n!==a.setViewNode&&n!==a.timestamp&&n!==a.performanceTiming&&this.isLoadingFinished()){this.onLoadingFinishedCallbacks.execute();L.info("Loading is finished - all streaming requests are fulfilled.");}if(r&&r.error){L.error(r.error);this.onErrorCallbacks.execute(r);}return g;};d.prototype.setPerformance=function(n,j,s){var i;switch(n){case a.setGeometry:i=j.id;c("setGeometry-"+i);break;case a.setImage:i=j.id;c("setImage-"+i);break;case a.setView:i=j.viewId;c("setView-"+i);break;case a.setViewGroup:i=j.id;c("setViewGroup-"+i);break;case a.setMesh:c("setMesh-"+s);break;case a.setMaterial:c("setMaterial-"+s);break;case a.setTree:c("setTree-"+s);break;case a.performanceTiming:this._isPostable=true;this.postPerformanceTiming();break;default:break;}};d.prototype.postPerformanceTiming=function(m){if(m){this._performanceTimingMsg.push(m);}if(this._isPostable&&this._performanceTimingMsg.length>0){this.postMessage(this._performanceTimingMsg.shift());this._isPostable=false;}};d.prototype.printLogTokens=function(){this.contextMap.forEach(function(e,s){L.info("log tokens for scene => "+s);L.info("---------------------------------------");if(e.progressLogger){e.progressLogger.getTokens().forEach(function(t){L.info(t);});}L.info("---------------------------------------");});};return d;});