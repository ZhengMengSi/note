/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2014 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/Device","sap/ui/core/Control","sap/m/Dialog","sap/ovp/app/resources","sap/ui/events/KeyCodes","sap/base/util/uid","sap/m/Button","sap/ui/core/Core","./ObjectStreamRenderer","sap/ui/dom/jquery/Selectors"],function(jQuery,t,e,s,i,a,r,o,n,l){"use strict";var p=null;var h=function(t){this.init(t)};h.prototype.init=function(t){this.objectStream=t;this.keyCodes=a;this.jqElement=t.$();this.jqElement.on("keydown.keyboardNavigation",this.keydownHandler.bind(this));this.jqElement.on("focus.keyboardNavigation",".sapOvpObjectStreamItem",this.ObjectStreamFocusAccessabilityHandler.bind(this))};h.prototype.destroy=function(){if(this.jqElement){this.jqElement.off(".keyboardNavigation")}delete this.jqElement;delete this.objectStream};h.prototype._swapItemsFocus=function(t,e,s){t.preventDefault();e.attr("tabindex","-1");s.attr("tabindex","0").focus()};h.prototype.ObjectStreamFocusAccessabilityHandler=function(){var t=document.activeElement;t=jQuery(t);if(t){var e=t.find("[aria-label]");var s,i="";for(s=0;s<e.length;s++){if(e[s].getAttribute("role")=="heading"){i+=e[s].id+" "}}if(i.length){t.attr("aria-labelledby",i)}if(t.hasClass("sapOvpCardHeader")){t.closest(".sapOvpObjectStreamItem").removeAttr("aria-labelledby")}}};h.prototype.tabButtonHandler=function(t){var e=jQuery(document.activeElement);if(e.hasClass("sapOvpObjectStreamItem")){return}if(e.hasClass("sapOvpObjectStreamClose")){t.preventDefault();this.jqElement.find(".sapOvpObjectStreamItem:sapTabbable").focus();return}var s=e.closest(".sapOvpObjectStreamItem");if(!s.length){return}var i=s.find(":sapTabbable");if(i.eq(i.length-1).is(e)){t.preventDefault();this.jqElement.find("a.sapOvpObjectStreamHeader").focus()}};h.prototype.shiftTabButtonHandler=function(t){var e=jQuery(document.activeElement);if(e.hasClass("sapOvpObjectStreamItem")){t.preventDefault();this.jqElement.find(".sapOvpObjectStreamClose").focus()}if(e.hasClass("sapOvpObjectStreamClose")){t.preventDefault();this.jqElement.find("a.sapOvpObjectStreamHeader").focus()}if(e.hasClass("sapOvpObjectStreamHeader")){t.preventDefault();this.jqElement.find(".sapOvpObjectStreamItem:sapTabbable *:sapTabbable").last().focus();return}};h.prototype.enterHandler=function(t){var e=jQuery(document.activeElement);if(e.hasClass("sapOvpObjectStreamClose")){t.preventDefault();this.objectStream.getParent().close();if(p){p.focus()}return}if(e.hasClass("sapOvpObjectStreamItem")&&!e.next().length){e.children().click();return}};h.prototype.f6Handler=function(t){var e=jQuery(document.activeElement);if(e.hasClass("sapOvpObjectStreamClose")){this.jqElement.find(".sapOvpObjectStreamItem").attr("tabindex","-1").first().attr("tabindex","0").focus()}else{this.jqElement.find(".sapOvpObjectStreamClose").focus()}};h.prototype.f7Handler=function(t){var e=jQuery(document.activeElement);if(e.hasClass("sapOvpObjectStreamItem")){e.find(":sapTabbable").first().focus()}else{e.closest(".sapOvpObjectStreamItem").focus()}t.preventDefault()};h.prototype.leftRightHandler=function(t,e){var s=e?"next":"prev";var i=jQuery(document.activeElement);if(!i.hasClass("sapOvpObjectStreamItem")){return false}var a=i[s]();if(!a.length){return}this._swapItemsFocus(t,i,a)};h.prototype.homeEndHandler=function(t,e){var s=e?"first":"last";var i=jQuery(document.activeElement);if(!i.hasClass("sapOvpObjectStreamItem")){return false}t.preventDefault();var a=this.jqElement.find(".sapOvpObjectStreamItem")[s]();this._swapItemsFocus(t,i,a)};h.prototype.pageUpDownHandler=function(t,e){var s=e?"prev":"next";var i=jQuery(document.activeElement);if(!i.hasClass("sapOvpObjectStreamItem")){return}if(!i[s]().length){return}var a=false;var r=i;var o=window.innerWidth;while(!a){var n=r[s]();if(!n.length){a=r;break}if(!e&&n.offset().left>o){a=n;break}if(e&&n.offset().left+n.outerHeight()<=0){a=n;break}r=n}this._swapItemsFocus(t,i,a)};h.prototype.keydownHandler=function(t){switch(t.keyCode){case this.keyCodes.TAB:t.shiftKey?this.shiftTabButtonHandler(t):this.tabButtonHandler(t);break;case this.keyCodes.ENTER:case this.keyCodes.SPACE:this.enterHandler(t);break;case this.keyCodes.F6:this.f6Handler(t);break;case this.keyCodes.F7:this.f7Handler(t);break;case this.keyCodes.ARROW_UP:case this.keyCodes.ARROW_LEFT:this.leftRightHandler(t,false);break;case this.keyCodes.ARROW_DOWN:case this.keyCodes.ARROW_RIGHT:this.leftRightHandler(t,true);break;case this.keyCodes.HOME:this.homeEndHandler(t,true);break;case this.keyCodes.END:this.homeEndHandler(t,false);break;case this.keyCodes.PAGE_UP:this.pageUpDownHandler(t,true);break;case this.keyCodes.PAGE_DOWN:this.pageUpDownHandler(t,false);break;default:break}};var c=e.extend("sap.ovp.ui.ObjectStream",{metadata:{library:"sap.ovp",aggregations:{content:{type:"sap.ui.core.Control",multiple:true},placeHolder:{type:"sap.ui.core.Control",multiple:false},title:{type:"sap.ui.core.Control",multiple:false}}},renderer:l});c.prototype.init=function(){var t=this;this._closeButton=new o({icon:"sap-icon://decline",tooltip:i.getText("close"),type:"Transparent",press:function(){t.getParent().close()}})};c.prototype._startScroll=function(t){this._direction=t;var e=this.wrapper.scrollWidth-this.wrapper.offsetWidth-Math.abs(this.wrapper.scrollLeft);var s;if(t=="left"){s=this.rtl&&!this.scrollReverse?e:this.wrapper.scrollLeft;if(s<=0){return}this.jqRightEdge.css("opacity",1)}else{s=this.rtl&&!this.scrollReverse?Math.abs(this.wrapper.scrollLeft):e;if(s<=0){return}this.jqLeftEdge.css("opacity",1)}var i=s*3;var a=t=="left"?s:~s+1;jQuery(this.container).one("transitionend",function(){this._mouseLeave({data:this})}.bind(this));this.container.style.transition="transform "+i+"ms linear";this.container.style.transform="translate("+a+"px, 0px) scale(1) translateZ(0px) "};c.prototype._mouseLeave=function(e){var s=window.getComputedStyle(e.data.container).transform;e.data.container.style.transform=s;e.data.container.style.transition="";this.rtl=n.getConfiguration().getRTL();var i;var a=s.split(",");if(s.substr(0,8)=="matrix3d"){i=parseInt(a[12],10)}else if(s.substr(0,6)=="matrix"){i=parseInt(a[4],10)}if(isNaN(i)){return}e.data.container.style.transform="none";if(t.browser.msie){i=this.rtl?~i:i}e.data.wrapper.scrollLeft+=~i+(e.data._direction=="left"?-5:5);e.data._checkEdgesVisibility()};var d;c.prototype.debounceScrollHandler=function(){window.clearTimeout(d);d=window.setTimeout(this._checkEdgesVisibility.bind(this),150)};c.prototype._initScrollVariables=function(){var e=this.$();this.container=e.find(".sapOvpObjectStreamScroll").get(0);this.rtl=n.getConfiguration().getRTL();this.wrapper=e.find(".sapOvpObjectStreamCont").get(0);this.scrollReverse=this.scrollReverse||this.wrapper.scrollLeft>0;this.shouldShowScrollButton=!t.system.phone&&!t.system.tablet||t.system.combi;this.jqRightEdge=e.find(".sapOvpOSEdgeRight");this.jqLeftEdge=e.find(".sapOvpOSEdgeLeft");if(this.shouldShowScrollButton){this.jqRightEdge.add(this.jqLeftEdge).on("mouseenter.objectStream",this,this._mouseEnter).on("mouseleave.objectStream",this,this._mouseLeave);jQuery(this.wrapper).on("scroll.objectStream",this.debounceScrollHandler.bind(this))}else{this.jqLeftEdge.css("display","none");this.jqRightEdge.css("display","none")}this._checkEdgesVisibility()};c.prototype._afterOpen=function(){if(t.os.ios&&this.$().length){this.$().on("touchmove.scrollFix",function(t){t.stopPropagation()})}var e=this.$().find("a.sapOvpObjectStreamHeader");e.removeAttr("aria-describedby");e.removeAttr("href");var s=e.attr("id");e.parent("div").attr("aria-labelledby",s);e.focus();if(this.keyboardNavigation){this.keyboardNavigation.destroy()}this.keyboardNavigation=new h(this);this._initScrollVariables();this.jqBackground=jQuery("<div id='objectStreamBackgroundId' class='objectStreamNoBackground'></div>");jQuery("#sap-ui-static").prepend(this.jqBackground);this.jqBackground.on("click.closePopup",function(){this._oPopup.close()}.bind(this));jQuery(".sapUshellEasyScanLayout").addClass("bluredLayout");var i=this.$().find(".sapOvpObjectStreamItem");for(var a=0;a<i.length;a++){var r=jQuery(i[a]).find(".sapOvpActionFooter");if(r.find("button").length==0){r.attr("tabindex","-1")}}};c.prototype._beforeClose=function(){if(t.os.ios&&this.$().length){this.$().off(".scrollFix")}this.keyboardNavigation.destroy();this.jqBackground.remove();this.jqLeftEdge.add(this.jqRightEdge).add(this.wrapper).off(".objectStream");jQuery(".sapUshellEasyScanLayout").removeClass("bluredLayout");this._oPopup=undefined};c.prototype._mouseEnter=function(t){var e="right";if(t.target==t.data.jqRightEdge.get(0)||t.currentTarget==t.data.jqRightEdge.get(0)){e=n.getConfiguration().getRTL()?"left":"right"}if(t.target==t.data.jqLeftEdge.get(0)||t.currentTarget==t.data.jqLeftEdge.get(0)){e=n.getConfiguration().getRTL()?"right":"left"}t.data._startScroll(e)};c.prototype._checkEdgesVisibility=function(){var t=this.wrapper.scrollLeft;var e=this.wrapper.scrollWidth-this.wrapper.offsetWidth-this.wrapper.scrollLeft;var s=t==0?0:1;var i=e==0?0:1;if(n.getConfiguration().getRTL()&&this.scrollReverse){this.jqLeftEdge.css("opacity",i);this.jqRightEdge.css("opacity",s);this.jqRightEdge.css("z-index",s===0?0:1)}else{this.jqLeftEdge.css("opacity",s);this.jqRightEdge.css("opacity",i);this.jqRightEdge.css("z-index",i===0?0:1)}};c.prototype._createPopup=function(){this._oPopup=new s({showHeader:false,afterOpen:this._afterOpen.bind(this),beforeClose:this._beforeClose.bind(this),content:[this],stretch:t.system.phone}).removeStyleClass("sapUiPopupWithPadding").addStyleClass("sapOvpStackedCardPopup");this._oPopup.oPopup.setModal(false)};c.prototype.open=function(t,e){if(!this._oPopup){this._createPopup()}this._cardWidth=t;p=e;this.setCardsSize(this._cardWidth);this._oPopup.open()};c.prototype.onBeforeRendering=function(){var t=this.getBinding("content");var e=this.getPlaceHolder();if(t&&t.getLength()<=20){this.setPlaceHolder(null);if(e){e.destroy()}}};c.prototype.onAfterRendering=function(){if(!this._oPopup||!this._oPopup.isOpen()||!this.getContent().length){return}setTimeout(function(){this._initScrollVariables()}.bind(this))};c.prototype.exit=function(){if(this._oPopup){this._oPopup.destroy()}if(this.jqBackground){this.jqBackground.remove()}this._closeButton.destroy();if(this._oScroller){this._oScroller.destroy();this._oScroller=null}};c.prototype.setCardsSize=function(e){var s=parseInt(window.getComputedStyle(document.documentElement).fontSize,10);var i=t.system.phone?document.body.clientHeight/s-4.5:28.75;var a=this.getContent();a.map(function(t){t.setWidth(e+"px");t.setHeight(i+"rem")});var r=this.getPlaceHolder();if(r){r.setWidth(e+"px");r.setHeight(i+"rem")}};c.prototype.getNewContentAvailable=function(){return this.onRefreshNewContent};c.prototype.setNewContentAvailable=function(t){this.onRefreshNewContent=t};c.prototype.updateContent=function(t){var e=this.mBindingInfos["content"],s=e.binding,i=s.getContexts(e.startIndex,e.length);if(t==="change"){e.clearQuickViewCard();var a=e.factory,o=0,n=this.getContent(),l=function(t){var s=this.getId()+"-"+r(),i=a(s,t);i.setBindingContext(t,e.model);this.addContent(i)};var p=l.bind(this);if(n.length<i.length){for(o=0;o<n.length;++o){n[o].destroy()}n.length=0;this.setNewContentAvailable(true);for(o=0;o<i.length;o++){p(i[o])}}if(!this.getNewContentAvailable()){for(o=0;o<i.length;++o){n[o].setBindingContext(i[o],e.model)}}if(n.length>=i.length){for(o=0;o<n.length;++o){n[o].destroy()}n.length=i.length;this.setNewContentAvailable(true);for(o=0;o<i.length;o++){p(i[o])}}}};return c});
//# sourceMappingURL=ObjectStream.js.map