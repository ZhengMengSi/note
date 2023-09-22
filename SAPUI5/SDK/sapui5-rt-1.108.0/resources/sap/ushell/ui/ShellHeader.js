// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/Control","sap/ui/core/theming/Parameters","sap/ui/Device","sap/ui/dom/units/Rem","sap/base/Log","sap/ushell/EventHub","sap/ushell/Config","sap/ushell/library","sap/ushell/resources","sap/ushell/ui/shell/ShellAppTitle","sap/ushell/ui/ShellHeaderRenderer","sap/ushell/utils","sap/ushell/utils/WindowUtils"],function(e,t,i,a,o,r,n,s,l,h,p,d,u){"use strict";var g="sapUshellShellShowSearchOverlay";var f=0;var c;var y=sap.ui.require.toUrl("sap/ushell")+"/themes/base/img/SAPLogo.svg";var m=e.extend("sap.ushell.ui.ShellHeader",{metadata:{library:"sap.ushell",properties:{logo:{type:"sap.ui.core.URI",defaultValue:""},showLogo:{type:"boolean",defaultValue:true},homeUri:{type:"sap.ui.core.URI",defaultValue:"#"},searchState:{type:"string",defaultValue:"COL"},ariaLabel:{type:"string"},centralAreaElement:{type:"string",defaultValue:null},title:{type:"string",defaultValue:""}},aggregations:{headItems:{type:"sap.ushell.ui.shell.ShellHeadItem",multiple:true},headEndItems:{type:"sap.ui.core.Control",multiple:true},search:{type:"sap.ui.core.Control",multiple:false},appTitle:{type:"sap.ushell.ui.shell.ShellAppTitle",multiple:false}},associations:{shellLayout:{type:"sap.ui.base.ManagedObject",multiple:false}},events:{searchSizeChanged:{}}}});m.prototype.setHomeUri=function(e){if(u.hasInvalidProtocol(e)){o.fatal("Tried to set a URL with an invalid protocol as the home uri. Setting to an empty string instead.",null,"sap/ushell/ui/ShellHeader");e=""}return this.setProperty("homeUri",e)};m.prototype.getShellLayoutControl=function(){return sap.ui.getCore().byId(this.getShellLayout())};m.prototype.createUIArea=function(){var e=window.document.getElementById("shell-hdr");if(!e){window.document.body.insertAdjacentHTML("afterbegin",'<div id="shell-hdr" class="sapContrastPlus sapUshellShellHead"></div>');this.placeAt("shell-hdr")}};m.prototype.SearchState={COL:"COL",EXP:"EXP",EXP_S:"EXP_S"};m.prototype.init=function(){i.media.attachHandler(this.invalidate,this,i.media.RANGESETS.SAP_STANDARD_EXTENDED);i.resize.attachHandler(this.refreshLayout,this);r.once("ShellNavigationInitialized").do(function(){sap.ushell.Container.getServiceAsync("ShellNavigation").then(function(e){this._rerenderLogoNavigationFilterBound=this._rerenderLogoNavigationFilter.bind(this,e);e.registerNavigationFilter(this._rerenderLogoNavigationFilterBound);this._rerenderLogoNavigationFilterBound.detach=function(){e.unregisterNavigationFilter(this._rerenderLogoNavigationFilterBound)}}.bind(this))}.bind(this))};m.prototype.exit=function(){i.media.detachHandler(this.invalidate,this,i.media.RANGESETS.SAP_STANDARD_EXTENDED);i.resize.detachHandler(this.refreshLayout,this);var e=window.document.getElementById("shell-hdr");if(e){e.parentElement.removeChild(e)}if(this._rerenderLogoNavigationFilterfnRerenderLogoNavigationFilter){this._rerenderLogoNavigationFilterfnRerenderLogoNavigationFilter.detach()}};m.prototype.setFocusOnShellHeader=function(e){if(e){var t=this.getHeadEndItems();if(t.length>0){t[t.length-1].focus()}else{this.getAppTitle().focus()}}else{var i=this.getHeadItems();if(i.length>0){i[0].focus()}else{this.getAppTitle().focus()}}};m.prototype.onsapspace=function(e){if(e.target===this.getDomRef("logo")){this._setLocationHref(e.target.href)}};m.prototype._setLocationHref=function(e){if(u.hasInvalidProtocol(e)){o.fatal("Tried to navigate to URL with an invalid protocol. Preventing navigation.",null,"sap/ushell/ui/ShellHeader");return}window.location.href=e};m.prototype.onAfterRendering=function(){var e=this.getDomRef();if(!c&&e.parentElement.getBoundingClientRect().height>0){e.style.visibility="hidden";e.style.height="2.75rem";return}this.refreshLayout()};m.prototype.onThemeChanged=function(e){c=e.theme;this.invalidate()};m.prototype.getLogo=function(){return this.getProperty("logo")||(sap.ui.getCore().isThemeApplied()?t._getThemeImage()||y:undefined)};m.prototype.refreshLayout=function(){if(!this.getDomRef()){return}this._setAppTitleFontSize();this._adjustAppTitleTooltip();if(this.getSearchVisible()){var e=this.getDomRef("hdr-search");e.style.display="none";this._hideElementsForSearch();e.style.display="";e.style["max-width"]=f+"rem";this.fireSearchSizeChanged({remSize:a.fromPx(e.getBoundingClientRect().width),isFullWidth:this.isPhoneState()||this.getDomRef("hdr-end").style.display==="none"})}};m.prototype._setAppTitleFontSize=function(){if(this.isExtraLargeState()){return}var e=this.getDomRef("hdr-begin"),t=window.document.getElementById("shellAppTitle"),i="sapUshellHeadTitleWithSmallerFontSize";if(e&&t){t.classList.remove(i);t.style.overflow="visible";var a=e.getBoundingClientRect(),o=a.x+a.width,r=t.getBoundingClientRect(),n=r.x+r.width;if(n>o){t.classList.add(i)}t.style.overflow=""}};m.prototype._adjustAppTitleTooltip=function(){var e=sap.ui.getCore().byId("shellAppTitle");if(e){var t=e.getDomRef("button");var i=t&&t.firstChild;if(i){var a;var o=n.last("/core/shell/model/currentState/stateName");var r=n.last("/core/services/allMyApps/enabled");var s=(o==="app"||o==="home")&&r;var h=sap.ui.getCore().byId(e.getNavigationMenu());var p=h&&h.getItems()&&h.getItems().length>0;if(s||p){a=l.i18n.getText("shellNavMenu_openMenuTooltip")}else{var d=i.offsetWidth<i.scrollWidth;a=d?e.getText():null}if(e.getTooltip()!==a){e.setTooltip(a)}}}};m.prototype.removeHeadItem=function(e){if(typeof e==="number"){e=this.getHeadItems()[e]}this.removeAggregation("headItems",e)};m.prototype.addHeadItem=function(e){this.addAggregation("headItems",e)};m.prototype.isExtraLargeState=function(){return i.media.getCurrentRange(i.media.RANGESETS.SAP_STANDARD_EXTENDED).from===1440};m.prototype.isPhoneState=function(){var e=i.media.getCurrentRange(i.media.RANGESETS.SAP_STANDARD).name;var t=this.getDomRef().getBoundingClientRect().width>f;return i.system.phone||e==="Phone"||!t};m.prototype.setSearchState=function(e,t,i){if(this.SearchState[e]&&this.getSearchState()!==e){if(typeof t==="boolean"){i=t;t=undefined}this.setProperty("searchState",e,false);var a=e!=="COL";var o=this.getShellLayoutControl();if(o){o.toggleStyleClass(g,a&&i)}f=a?t||35:0}};m.prototype._hideElementsForSearch=function(){if(this.isExtraLargeState()){return}var e,t=this.getDomRef("hdr-search-container"),i=this.getDomRef("hdr-begin"),o=this.getDomRef("hdr-center"),r=this.getDomRef("hdr-end");if(this.getSearchState()==="EXP"||this.isPhoneState()){e=a.toPx(f+3)}else{e=a.toPx(9+.5)}var n=[i];Array.prototype.forEach.call(i.childNodes,function(e){n.unshift(e)});if(o){n.unshift(o)}i.style.flexBasis="";r.style.display="";n.forEach(function(e){if(e.getAttribute("id")==="shellAppTitle"){e.classList.remove("sapUiPseudoInvisibleText")}else{e.style.display=""}});var s;for(var l=0;l<n.length;l++){s=n[l];if(e>t.getBoundingClientRect().width){if(s.getAttribute("id")==="shellAppTitle"){s.classList.add("sapUiPseudoInvisibleText")}else{s.style.display="none";if(o&&l===0){i.style.flexBasis="auto"}}}else{return}}if(a.toPx(f)>t.getBoundingClientRect().width){r.style.display="none"}};m.prototype.getSearchWidth=function(){return f};m.prototype.isHomepage=function(){var e=window.hasher&&"#"+window.hasher.getHash()||"";var t=new RegExp("[?]"+"(?:"+"(?!&[/])."+")*");var i=e.replace(t,"");return d.isRootIntent(i)||i==="#Launchpad-openFLPPage"};m.prototype._rerenderLogoNavigationFilter=function(e,t,i){var a=e.hashChanger.isInnerAppNavigation(t,i);if(a){this.invalidate()}return e.NavigationFilterStatus.Continue};m.prototype.getSearchVisible=function(){return this.getSearchState()!==this.SearchState.COL};m.prototype.getCentralControl=function(){return sap.ui.getCore().byId(this.getCentralAreaElement())};m.prototype.setNoLogo=function(){this.setLogo(undefined)};m.prototype._getLeanMode=function(){return(window.location.search||"").indexOf("appState=lean")>=0};return m},true);
//# sourceMappingURL=ShellHeader.js.map