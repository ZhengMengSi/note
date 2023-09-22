// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/Control","sap/ui/core/IconPool","sap/ushell/library"],function(e,t){"use strict";var n=e.extend("sap.ushell.ui.shell.NavigationMiniTile",{metadata:{library:"sap.ushell",properties:{title:{type:"string",group:"Misc",defaultValue:null},subtitle:{type:"string",group:"Misc",defaultValue:null},icon:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:null},intent:{type:"string",group:"Misc",defaultValue:null}},aggregations:{},events:{press:{}}},renderer:{apiVersion:2,render:function(e,n){var a=n.getTitle();var s=n.getSubtitle();var i=n.getIcon();var l=t.createControlByURI(i);e.openStart("div",n);e.attr("tabindex","-1");e.class("sapUshellNavMiniTile");e.attr("role","listitem");e.attr("aria-label",s?a+" "+s:a);e.openEnd();e.openStart("div");e.openEnd();e.openStart("span");e.class("sapUshellNavMiniTileTitle");e.openEnd();if(a){e.text(a)}e.close("span");e.close("div");e.openStart("div");e.openEnd();if(l){e.openStart("span");e.class("sapUshellNavMiniTileIcon");e.openEnd();e.renderControl(l);e.close("span")}else{e.openStart("span");e.class("sapUshellNavMiniTileSubtitle");e.openEnd();e.text(s||"");e.close("span")}e.close("div");e.close("div")}}});n.prototype.ontap=function(){this.firePress({})};n.prototype.onsapenter=function(){this.firePress({})};n.prototype.onsapspace=function(){this.firePress({})};return n});
//# sourceMappingURL=NavigationMiniTile.js.map