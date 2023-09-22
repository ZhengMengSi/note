// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/base/Object","sap/ushell/Config","sap/ushell/resources","sap/ushell/components/MessagingHelper","sap/m/GenericTile","sap/base/util/uid","sap/base/Log","sap/ui/performance/Measurement","sap/m/library"],function(q,B,C,r,m,G,g,L,M,a){"use strict";var b=a.GenericTileMode;var c=a.LoadState;var d={PERSONALIZATION:"FLP: Personalization",RENAME_GROUP:"FLP: Rename Group",MOVE_GROUP:"FLP: Move Group",DELETE_GROUP:"FLP: Delete Group",RESET_GROUP:"FLP: Reset Group",DELETE_TILE:"FLP: Delete Tile",ADD_TILE:"FLP: Add Tile",MOVE_TILE:"FLP: Move Tile"};function _(E,p){sap.ushell.Container.getServiceAsync("UsageAnalytics").then(function(u){u.logCustomEvent(d.PERSONALIZATION,E,p);});}var P=B.extend("sap.ushell.components._HomepageManager.PersistentPageOperationAdapter",{constructor:function(){B.call(this);this.oPageBuilderService=sap.ushell.Container.getService("LaunchPage");},_getIsAppBox:function(o){if(!sap.ushell.Container){return false;}var s=this.oPageBuilderService,i=!!(s.getCatalogTileTargetURL(o)&&(s.getCatalogTilePreviewTitle(o)||s.getCatalogTilePreviewSubtitle(o)));return i;},getCurrentHiddenGroupIds:function(o){var f=o.getProperty("/groups"),h=[],s,i,j;for(i=0;i<f.length;i++){j=f[i]?f[i].isGroupVisible:true;if(f[i].object){s=this.oPageBuilderService.getGroupId(f[i].object);}if(!j&&s!==undefined){h.push(s);}}return h;},getPreparedTileModel:function(t,i,T){var s=this.oPageBuilderService,f=g(),o,S=s.getTileSize(t),l=[],h;T=T||s.getTileType(t);if(T==="link"){l=[new G({mode:sap.m.GenericTileMode.LineMode})];}o={"isCustomTile":!this._getIsAppBox(t),"object":t,"originalTileId":s.getTileId(t),"uuid":f,"tileCatalogId":encodeURIComponent(s.getCatalogTileId(t)),"content":l,"long":S==="1x2","target":s.getTileTarget(t)||"","debugInfo":s.getTileDebugInfo(t),"isTileIntentSupported":s.isTileIntentSupported(t),"rgba":"","isLocked":i,"showActionsIcon":C.last("/core/home/enableTileActionsIcon"),"isLinkPersonalizationSupported":s.isLinkPersonalizationSupported(t),"navigationMode":undefined};if(T==="card"){h=s.getCardManifest(t);o.isCard=true;if(h){o.manifest=h;}}return o;},getPreparedGroupModel:function(o,D,l,f){var s=this.oPageBuilderService,h=(o&&s.getGroupTiles(o))||[],j=[],k=[],i,n=C.last("/core/shell/model/personalization");var I=!!(o&&s.isGroupLocked(o)),p=!!(o&&s.isGroupFeatured(o));for(i=0;i<h.length;++i){var t=h[i],T=s.getTileType(t).toLowerCase();if(T==="tile"||T==="card"){j.push(this.getPreparedTileModel(h[i],I,T));}else if(T==="link"){k.push(this.getPreparedTileModel(h[i],I,T));}else{L.error("Unknown tile type: '"+T+"'",undefined,"sap.ushell.components.HomepageManager");}}return{title:(D&&m.getLocalizedText("my_group"))||(o&&s.getGroupTitle(o))||(f&&f.title)||"",object:o,groupId:g(),links:k,pendingLinks:[],tiles:j,isDefaultGroup:!!D,editMode:!o,isGroupLocked:I,isFeatured:p,visibilityModes:[true,true],removable:!o||s.isGroupRemovable(o),sortable:n,isGroupVisible:!o||s.isGroupVisible(o),isEnabled:!D,isLastGroup:l||false,isRendered:!!(f&&f.isRendered),isGroupSelected:false};},getPage:function(){q.sap.flpmeasure.start(0,"Service: Get Data for Dashboard",4);M.start("FLP:DashboardManager.loadPersonalizedGroups","loadPersonalizedGroups","FLP");return this._getGroupsFromServer().then(this.loadGroupsFromArray.bind(this));},_getGroupsFromServer:function(){var t=this;return new Promise(function(f,h){t.oPageBuilderService.getGroups().done(function(i){M.end("FLP:DashboardManager.loadPersonalizedGroups");f(i);}).fail(h);});},loadGroupsFromArray:function(f){var t=this;q.sap.flpmeasure.end(0,"Service: Get Data for Dashboard");q.sap.flpmeasure.start(0,"Process & render the first segment/tiles",4);M.start("FLP:DashboardManager.loadGroupsFromArray","loadGroupsFromArray","FLP");M.start("FLP:DashboardManager.getDefaultGroup","getDefaultGroup","FLP");return new Promise(function(h,j){t.oPageBuilderService.getDefaultGroup().done(function(D){M.end("FLP:DashboardManager.getDefaultGroup");if(f.length===0&&D===undefined){h([]);return;}var i=0,n,N=[],k,l;f=t._sortGroups(D,f);l=f.indexOf(D);k=f.length;M.start("FLP:DashboardManager._getGroupModel","_getGroupModel","FLP");for(i=0;i<k;++i){n=t.getPreparedGroupModel(f[i],i===l,i===k-1);n.index=i;N.push(n);}M.end("FLP:DashboardManager._getGroupModel");M.end("FLP:DashboardManager.loadGroupsFromArray");q.sap.flpmeasure.end(0,"Process & render the first segment/tiles");h(N);}).fail(j);});},_sortGroups:function(D,f){var i=0,t=this,h=f.indexOf(D),l=[],j,o,k;f.splice(h,1);while(i<f.length){o=f[i];k=this.oPageBuilderService.isGroupLocked(o);if(k){l.push(o);f.splice(i,1);}else{i++;}}if(!C.last("/core/home/disableSortedLockedGroups")){l.sort(function(x,y){var n=t.oPageBuilderService.getGroupTitle(x).toLowerCase(),p=t.oPageBuilderService.getGroupTitle(y).toLowerCase();return n<p?-1:1;});}l.sort(function(x,y){var I=t.oPageBuilderService.isGroupFeatured(x),n=t.oPageBuilderService.isGroupFeatured(y);if(I===n){return 0;}else if(I>n){return-1;}return 1;});j=l;j.push(D);j.push.apply(j,f);return j;},addGroupAt:function(o,i,I){var t=this;return new Promise(function(f,h){try{if(i===undefined){t.oPageBuilderService.addGroup(o.title).done(function(n){var s=t.oPageBuilderService.getGroupId(n);_(d.RENAME_GROUP,[null,o.title,s]);f(t.getPreparedGroupModel(n,I,o.isLastGroup,undefined));}).fail(h);}else{t.oPageBuilderService.addGroupAt(o.title,i).done(function(n){var s=t.oPageBuilderService.getGroupId(n);_(d.RENAME_GROUP,[null,o.title,s]);f(t.getPreparedGroupModel(n,I,o.isLastGroup,undefined));}).fail(h);}}catch(j){h();}});},renameGroup:function(o,n,O){var t=this;return new Promise(function(f,h){try{t.oPageBuilderService.setGroupTitle(o.object,n).done(function(){var s=t.oPageBuilderService.getGroupId(o.object);_(d.RENAME_GROUP,[O,n,s]);f();}).fail(h);}catch(E){h();}});},deleteGroup:function(o){var t=this,s=o.object,f=this.oPageBuilderService.getGroupId(s),h=this.oPageBuilderService.getGroupTitle(s);return new Promise(function(i,j){try{t.oPageBuilderService.removeGroup(s).done(function(){_(d.DELETE_GROUP,[h,f]);i();}).fail(j);}catch(k){j();}});},moveGroup:function(o,t,i){var f=this;return new Promise(function(h,j){try{f.oPageBuilderService.moveGroup(o.object,t).done(function(){var s=f.oPageBuilderService.getGroupId(o.object);_(d.MOVE_GROUP,[o.title,i.iFromIndex,i.iToIndex,s]);h();}).fail(j);}catch(k){j();}});},resetGroup:function(o,i){var t=this,s=o.object,f=this.oPageBuilderService.getGroupId(s),h=this.oPageBuilderService.getGroupTitle(s);return new Promise(function(j,k){try{t.oPageBuilderService.resetGroup(s).done(function(R){_(d.RESET_GROUP,[h,f]);j(t.getPreparedGroupModel(R,i,o.isLastGroup,undefined));}).fail(k);}catch(l){k();}});},refreshGroup:function(s){var t=this,E="Failed to refresh group with id:"+s+" in the model";return new Promise(function(f){t.oPageBuilderService.getGroups().fail(function(){L.error(E,null,"sap.ushell.components.HomepageManager");f(null);}).done(function(h){var S=null;for(var i=0;i<h.length;i++){if(t.oPageBuilderService.getGroupId(h[i])===s){S=h[i];break;}}if(S){t.oPageBuilderService.getDefaultGroup().done(function(D){var I=s===D.getId(),o=t.getPreparedGroupModel(S,I,false,{isRendered:true});f(o);});}else{f(null);}});});},getIndexOfGroup:function(f,s){var n=-1,t=this,h=this.oPageBuilderService.getGroupId(s);f.every(function(o,i){var j=t.oPageBuilderService.getGroupId(o.object);if(j===h){n=i;return false;}return true;});return n;},getOriginalGroupIndex:function(o){var s=this.oPageBuilderService,S=o.object,f=this.oPageBuilderService.getGroups();return new Promise(function(h,j){f.done(function(k){var n;for(var i=0;i<k.length;i++){if(s.getGroupId(k[i])===s.getGroupId(S)){n=i;break;}}h(n);}).fail(j);});},moveTile:function(t,i,s,T,f){var h=this,S,p=new Promise(function(j,k){try{var R=h.oPageBuilderService.moveTile(t.object,i.tileIndex,i.newTileIndex,s.object,T.object,f);R.done(function(o){var u=[h.oPageBuilderService.getTileTitle(t.object),h.oPageBuilderService.getGroupTitle(s.object),h.oPageBuilderService.getGroupTitle(T.object),t.uuid];_(d.MOVE_TILE,u);S=o;j(o);});R.fail(k);}catch(l){k();}});return p.then(this._getTileViewAsPromise.bind(this)).then(function(v){return Promise.resolve({content:v,originalTileId:h.oPageBuilderService.getTileId(S),object:S});});},removeTile:function(o,t){var f=this,s=t.object,T=f.oPageBuilderService.getTileTitle(s),h=f.oPageBuilderService.getCatalogTileId(s),i=f.oPageBuilderService.getCatalogTileTitle(s),j=f.oPageBuilderService.getTileId(s),p;p=new Promise(function(k,l){try{f.oPageBuilderService.removeTile(o.object,s).done(function(){m.showLocalizedMessage("tile_deleted_msg",[T,o.title]);_(d.DELETE_TILE,[T||j,h,i,o.title]);k();}).fail(l);}catch(n){l();}});return p;},_getTileViewAsPromise:function(t){var f=this,p=new Promise(function(h,i){var j=f.oPageBuilderService.getTileView(t);j.done(h);j.fail(i);});return p;},refreshTile:function(s){this.oPageBuilderService.refreshTile(s);},setTileVisible:function(s,v){this.oPageBuilderService.setTileVisible(s,v);},getTileType:function(s){return this.oPageBuilderService.getTileType(s);},getTileSize:function(s){return this.oPageBuilderService.getTileSize(s);},getTileTitle:function(t){return this.oPageBuilderService.getTileTitle(t.object);},getTileId:function(s){return this.oPageBuilderService.getTileId(s);},isLinkPersonalizationSupported:function(s){return this.oPageBuilderService.isLinkPersonalizationSupported(s);},getTileTarget:function(t){return this.oPageBuilderService.getTileTarget(t.object);},getTileView:function(t){return this.oPageBuilderService.getTileView(t.object);},getTileActions:function(t){return this.oPageBuilderService.getTileActions(t);},getFailedLinkView:function(t){var s=this.oPageBuilderService.getCatalogTilePreviewSubtitle(t.object);var h=this.oPageBuilderService.getCatalogTilePreviewTitle(t.object);if(!h&&!s){h=r.i18n.getText("cannotLoadLinkInformation");}return new G({mode:b.LineMode,state:c.Failed,header:h,subheader:s});},getTileModelByCatalogTileId:function(s){L.error("Cannot get tile with id "+s+": Method is not supported");},transformGroupModel:function(){return;}});var e=null;return{getInstance:function(){if(!e){e=new P();}return e;},destroy:function(){e=null;}};});