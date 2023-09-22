//@ui5-bundle sap/ushell/components/shell/SearchCEP/Component-preload.js
sap.ui.require.preload({
	"sap/ushell/components/shell/SearchCEP/Component.js":function(){
// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/UIComponent","sap/m/SearchField","sap/m/Button","sap/m/ResponsivePopover","sap/ui/core/Fragment","sap/ui/model/json/JSONModel","sap/ushell/components/shell/SearchCEP/SearchCEP.controller","sap/base/Log","sap/ushell/resources","sap/ui/core/IconPool","sap/ushell/renderers/fiori2/search/util","sap/ushell/ui/shell/ShellHeadItem","sap/ui/Device"],function(e,t,s,i,r,a,o,h,n,l,S,c,u){"use strict";return e.extend("sap.ushell.components.shell.SearchCEP.Component",{metadata:{version:"1.108.1",library:["sap.ushell","sap.ushell.components.shell"],dependencies:{libs:["sap.m"]}},createContent:function(){try{this.oRenderer=sap.ushell.Container.getRenderer("fiori2");this.oShellHeader=sap.ui.getCore().byId("shell-header");this.oRenderer.addHeaderEndItem({id:"sf",tooltip:"{i18n>searchbox_tooltip}",text:"{i18n>search}",ariaLabel:"{i18n>searchbox_tooltip}",icon:l.getIconURI("search"),visible:true,showSeparator:false,press:this.onShellSearchButtonPressed.bind(this)},true,false);this.oShellSearchBtn=sap.ui.getCore().byId("sf");var e={width:"90%",placeholder:n.i18n.getText("search"),tooltip:n.i18n.getText("search"),enableSuggestions:true,suggest:this.onSuggest.bind(this),search:this.onSearch.bind(this),liveChange:this.onSuggest.bind(this)};this.oSF=new t("PlaceHolderSearchField",e);this.oSF.addStyleClass("sapUiMediumMarginBeginEnd");var s=this.getScreenSize();if(s==="S"){this.initSearchSSize()}else if(s==="M"||s==="L"){this.initSearchMLSizes()}else if(s==="XL"){this.initSearchXLSize()}this.oShellHeader.setSearch(this.oSF);this.oSearchCEPController=new o}catch(e){h.info("Failed to create CEP search field content"+e)}sap.ui.getCore().getEventBus().publish("shell","searchCompLoaded",{delay:0})},initSearchSSize:function(){this.oSF.setWidth("60%");this.oShellHeader.setSearchState("COL",35,false)},initSearchMLSizes:function(){this.oShellHeader.setSearchState("COL",35,false)},initSearchXLSize:function(){this.oShellSearchBtn.setVisible(false);this.oShellHeader.setSearchState("EXP",35,false)},onSuggest:function(e){if(sap.ui.getCore().byId("CEPSearchField")){this.oSearchCEPController.onSuggest(e)}else{this.oSearchCEPController.onInit()}},onSearch:function(e){if(sap.ui.getCore().byId("CEPSearchField")){this.oSearchCEPController.onSearch(e)}},exit:function(){this.oSearchCEPController.onExit()},expandSearch:function(){this.oShellHeader.setSearchState("EXP_S",35,false);this.oSF.focus()},onShellSearchButtonPressed:function(){this.oShellSearchBtn.setVisible(false);this.expandSearch()},collapseSearch:function(){this.oShellHeader.setSearchState("COL",35,false);this.oShellSearchBtn.setVisible(true)},getScreenSize:function(){var e=u.media.getCurrentRange(u.media.RANGESETS.SAP_STANDARD_EXTENDED);if(e.from>=1440){return"XL"}else if(e.from>=1024){return"L"}else if(e.from>=600){return"M"}else if(e.from>=0){return"S"}}})});
},
	"sap/ushell/components/shell/SearchCEP/ProvidersExecuter.js":function(){
// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/components/shell/SearchCEP/SearchProviders/SearchProvider","sap/ushell/components/shell/SearchCEP/SearchProviders/NavigationSvcSearchProvider","sap/ushell/components/shell/SearchCEP/SearchProviders/RecentAppsProvider","sap/ushell/components/shell/SearchCEP/SearchProviders/RecentSearchProvider","sap/base/Log"],function(e,r,s,n,a){"use strict";return{runProviders:function(o){var i,c;if(o!==undefined){i=[r]}else{i=[r,s,n]}a.info("-------------------- run CEP search test for sQuery="+o+" --------------------");for(c=0;c<i.length;c++){(function(r){r.execSearch(o).then(function(s){var n="",o=false;n+="-------------------- search provider '"+r.getName()+"' results:\n";for(var i in e.GROUP_TYPE){var c=e.GROUP_TYPE[i];if(Array.isArray(s[c])&&s[c].length>0){o=true;n+="----\x3e group '"+c+"' results:\n";for(var l=0;l<s[c].length;l++){n+="result #"+l+":\n";n+=JSON.stringify(s[c][l],null,2)+"\n"}}}if(!o){n+="----\x3e no results:\n"}a.info(n)})})(i[c])}}}});
},
	"sap/ushell/components/shell/SearchCEP/SearchCEP.controller.js":function(){
// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel","sap/ui/core/Fragment","sap/ushell/components/shell/SearchCEP/SearchProviders/SearchProvider","sap/ushell/components/shell/SearchCEP/SearchProviders/NavigationSvcSearchProvider","sap/ushell/components/shell/SearchCEP/SearchProviders/RecentAppsProvider","sap/ushell/components/shell/SearchCEP/SearchProviders/RecentSearchProvider","sap/base/Log","sap/ushell/utils/WindowUtils","sap/ui/thirdparty/jquery","sap/ushell/resources","sap/ushell/utils/UrlParsing","sap/ui/Device"],function(e,t,s,i,r,o,a,n,l,jQuery,h,c,u){"use strict";return e.extend("sap.ushell.components.shell.SearchCEP.SearchCEP",{onInit:function(){this._toggleSearchPopover(false);this._oPlaceHolderSF=sap.ui.getCore().byId("PlaceHolderSearchField");this._bIsMyHome=false;var e=sap.ushell.Container.getFLPPlatform(true);this._bOnInit=true;if(e==="MYHOME"){this._bIsMyHome=true}},onSuggest:function(e){var t=sap.ushell.Container.getFLPUrl(true);var s=c.getHash(t),i=s.split("&/")[0];if(this.bOnNavigationToResultPage===true&&i==="Action-search"){if(this._oPopover.isOpen()){this._oPopover.close()}return}else{this.bOnNavigationToResultPage=false}var r=e.getParameter("suggestValue");this.oSF.focus();if(this._recentSearchTermSelected===true){this._recentSearchTermSelected=false;return}if(this.bOpeningPopOver===true&&this._oPopover.isOpen()===true){this.bOpeningPopOver=false;return}this.testProviders(r)},getScreenSize:function(){var e=u.media.getCurrentRange(u.media.RANGESETS.SAP_STANDARD_EXTENDED);if(e.from>=1440){return"XL"}else if(e.from>=1024){return"L"}else if(e.from>=600){return"M"}else if(e.from>=0){return"S"}},onSearch:function(e){var t=e.getParameter("query"),s=e.getParameter("clearButtonPressed");if(s===true){this.oSF.setValue("");this._oPlaceHolderSF.setValue("");this.bOpeningPopOver=false;this.testProviders();if(this._oSearchHistoryList.getItems().length===0&&this._oFrequentlyUsedAppsList.getItems().length===0){this._oPopover.close()}return}if(t){this._saveSearchTerm(t);if(this._bIsMyHome===true){if(this._oSearchResultList.getItems().length>0){this._oSearchResultList.getItems()[0].focus();if(this._bIsMyHome===true){var i=this._oSearchResultList.getItems()[0].getBindingContext("searchResults").getObject().url;if(i!==undefined&&i!==null){this._navigateURL(i);return}}var r=this._oSearchResultList.getItems()[0].getBindingContext("searchResults").getObject().semanticObject;var o=this._oSearchResultList.getItems()[0].getBindingContext("searchResults").getObject().semanticObjectAction;this._navigateApp(r,o)}}else{this._navigateToResultPage(t)}}},onBeforeOpen:function(){this._oPopover.addStyleClass("sapUshellCEPSearchFieldPopover");var e=sap.ui.getCore().byId("shell-header").getSearchState();var t=false;if(e==="COL"){t=true}sap.ui.getCore().byId("shell-header").setSearchState("EXP",35,false);sap.ui.getCore().byId("shell-header").setSearchState("EXP_S",35,true);if(t===true){sap.ui.getCore().byId("shell-header").setSearchState("COL",35,false)}},onAfterOpen:function(){if(sap.ui.getCore().byId("SearchHistoryList-trigger")){sap.ui.getCore().byId("SearchHistoryList-trigger").addEventDelegate({onkeydown:this._keyDownSearchHistoryListMoreTrigger.bind(this),onmousedown:this._mouseDownSearchHistoryListMoreTrigger.bind(this)})}if(sap.ui.getCore().byId("FrequentlyUsedAppsList-trigger")){sap.ui.getCore().byId("FrequentlyUsedAppsList-trigger").addEventDelegate({onkeydown:this._keyDownFrequentlyUsedAppsListMoreTrigger.bind(this)})}var e=document.getElementById("PlaceHolderSearchField").clientHeight;document.getElementById("CEPSearchField").style.height=e+"px"},onBeforeClose:function(){},onAfterClose:function(){this._oPlaceHolderSF.setValue(this.oSF.getValue());var e=this.getScreenSize();if(e!=="XL"&&this.oSF.getValue()===""){sap.ui.getCore().byId("shell-header").setSearchState("COL",35,false);sap.ui.getCore().byId("sf").setVisible()}else{sap.ui.getCore().byId("shell-header").setSearchState("EXP",35,false);sap.ui.getCore().byId("shell-header").setSearchState("EXP_S",35,false)}},onGrowingStarted:function(e){var t=e.getParameter("actual");if(t>0){this._oSearchHistoryList.setGrowingThreshold(8)}},onGrowingFinishedResults:function(){this._boldResults(this.oSF.getValue())},onExit:function(){},testProviders:function(e){var s,n,l=this,c=false,u=false;if(e!==undefined&&e!==""){this._setListsVisible(false,this._oSearchHistoryList);this._setListsVisible(false,this._oFrequentlyUsedAppsList);sap.ui.getCore().byId("SearchHistoryCustom").setVisible(false);sap.ui.getCore().byId("FreqUsedAppCustom").setVisible(false);s=[r];c=true}else{this._setListsVisible(false,this._oSearchResultList);this._setListsVisible(false,this._oExternalSearchResultList);sap.ui.getCore().byId("SearchResultCustom").setVisible(false);sap.ui.getCore().byId("ExternalSearchAppsCustom").setVisible(false);if(this._bOnInit!==true){s=[o,a]}else{s=[r,o,a];this._bOnInit=false}}for(n=0;n<s.length;n++){(function(s){s.execSearch(e).then(function(s){for(var r in i.GROUP_TYPE){var o=i.GROUP_TYPE[r];if(Array.isArray(s[o])&&s[o].length>0){if(o==="recentSearches"){u=true;sap.ui.getCore().byId("SearchHistoryCustom").setVisible(true);l._setListsVisible(true,l._oSearchHistoryList);l._oSearchHistoryList.setGrowingThreshold(2);l._oSearchHistoryList.setModel(new t(s[o].slice(0,10)),"searchTerms")}else if(o==="recentApplications"){u=true;sap.ui.getCore().byId("FreqUsedAppCustom").setVisible(true);l._setListsVisible(true,l._oFrequentlyUsedAppsList);l._oFrequentlyUsedAppsList.setModel(new t(s[o].slice(0,12)),"freqUsedApps")}else if(c===true&&o==="applications"){sap.ui.getCore().byId("SearchResultCustom").setVisible(true);l._setListsVisible(true,l._oSearchResultList);l._oSearchResultList.setModel(new t(s[o]),"searchResults");window.setTimeout(function(){l._boldResults(e)},50)}else if(c===true&&o==="externalSearchApplications"){sap.ui.getCore().byId("ExternalSearchAppsCustom").setVisible(true);l._setListsVisible(true,l._oExternalSearchResultList);l._oExternalSearchResultList.setModel(new t(s[o]),"externalSearchResults")}if(!l._oPopover.isOpen()&&(u===true||c===true)){l._toggleSearchPopover(true)}if(sap.ui.getCore().byId("SearchResultList-trigger")){sap.ui.getCore().byId("SearchResultList-trigger").addEventDelegate({onkeydown:l._keyDownSearchResultListMoreTrigger.bind(l)})}l.oSF.focus()}else if(c===true&&o==="applications"){if(!s[o]||s[o].length===0){sap.ui.getCore().byId("SearchResultCustom").setVisible(true);l._setListsVisible(true,l._oSearchResultList);l._oSearchResultList.setModel(new t({}),"searchResults");h.i18n.getText("no_apps_found",[e]);var a=h.i18n.getText("no_apps_found",[e]);l._oSearchResultList.setNoDataText(a);if(!l._oPopover.isOpen()){l._toggleSearchPopover(true)}}}}})})(s[n])}},_boldResults:function(e){var t=this._oSearchResultList,s=t.getItems(),i=t.$().find(".sapMSLITitleOnly");jQuery.each(i,function(t){var r=s[t].getTitle(),o=new RegExp(e,"gi");var a=r;a=a.replace(o,function(e){return"</b>"+e+"<b>"});a="<b>"+a+"</b>";i[t].innerHTML=a})},_toggleSearchPopover:function(e){if(!this._oPopover){s.load({name:"sap.ushell.components.shell.SearchCEP.SearchFieldFragment",type:"XML",controller:this}).then(function(t){this._oPopover=t;var s=this.getScreenSize();var i=document.getElementById("PlaceHolderSearchField").clientWidth;if(s==="S"){i=1.1*i}else{i=1.05*i}this._oPopover.setContentWidth(i+"px");if(sap.ui.getCore().getConfiguration().getRTL()===true){var r=this._oPopover.getOffsetX();this._oPopover.setOffsetX(-1*r)}this._initializeSearchField();this._initializeSearchFieldList();this._initializeSearchHistoryList();this._initializeFrequentlyUsedAppsList();this._initializeSearchResultList();this._initializeExternalSearchResultList();this.testProviders();this._toggleSearchPopover(e)}.bind(this))}else if(e){this._oPopover.openBy(this._oPlaceHolderSF);this.bOpeningPopOver=true;if(this._oPlaceHolderSF.getValue()!==""){this.oSF.setValue(this._oPlaceHolderSF.getValue())}}},_keyDownSearchField:function(e){if(e.code===40||e.code==="ArrowDown"){this.oSF.focus();if(!this._oPopover.isOpen()){this._toggleSearchPopover(true)}if(this._oSearchHistoryList.getVisible()===true){this._oSearchHistoryList.getItems()[0].focus()}else if(this._oSearchResultList.getVisible()===true){this._oSearchResultList.getItems()[0].focus()}else if(this._oExternalSearchResultList.getVisible()===true){this._oExternalSearchResultList.getItems()[0].focus()}}else if(e.code===116||e.code==="F5"){window.location.reload()}else if(e.code===9||e.code==="Tab"){return}},_keyDownSearchHistoryList:function(e){var t=this._oSearchHistoryList.getItems().length;if(e.code===40||e.code==="ArrowDown"){if(t>0&&this._oSearchHistoryList.getItems()[t-1]===e.srcControl){var s=window.getComputedStyle(document.getElementById("SearchHistoryList-triggerList"),"");if(s.display==="none"){if(this._oFrequentlyUsedAppsList.getVisible()){this._oFrequentlyUsedAppsList.getItems()[0].focus()}}else{sap.ui.getCore().byId("SearchHistoryList-trigger").focus()}}}else if(e.code===38||e.code==="ArrowUp"){if(t>0&&this._oSearchHistoryList.getItems()[0]===e.srcControl){this.oSF.focus()}}},_keyDownFrequentlyUsedAppsList:function(e){var t,s=this._oFrequentlyUsedAppsList.getItems().length;if(e.code===40||e.code==="ArrowDown"){if(s>0&&this._oFrequentlyUsedAppsList.getItems()[s-1]===e.srcControl){t=window.getComputedStyle(document.getElementById("FrequentlyUsedAppsList-triggerList"),"");if(t.display!=="none"){sap.ui.getCore().byId("FrequentlyUsedAppsList-trigger").focus()}}}else if(e.code===38||e.code==="ArrowUp"){if(s>0&&this._oFrequentlyUsedAppsList.getItems()[0]===e.srcControl){if(this._oSearchHistoryList.getVisible()){t=window.getComputedStyle(document.getElementById("SearchHistoryList-triggerList"),"");if(t.display==="none"){var i=this._oSearchHistoryList.getItems().length;if(i>0){this._oSearchHistoryList.getItems()[i-1].focus()}}else{sap.ui.getCore().byId("SearchHistoryList-trigger").focus()}}else{this.oSF.focus()}}}else if(e.code===13||e.code==="Enter"){var r=e.srcControl.getBindingContext("freqUsedApps").getObject().appId;var o=r.split("-")[0];o=o.split("#")[1];var a=r.split("-")[1];this._navigateApp(o,a)}},_keyDownSearchHistoryListMoreTrigger:function(e){if(e.code===40||e.code==="ArrowDown"){if(this._oFrequentlyUsedAppsList.getVisible()){this._oFrequentlyUsedAppsList.getItems()[0].focus()}}else if(e.code===38||e.code==="ArrowUp"){var t=this._oSearchHistoryList.getItems().length;if(t>0){this._oSearchHistoryList.getItems()[t-1].focus()}}},_mouseDownSearchHistoryListMoreTrigger:function(e){this._oSearchHistoryList.setGrowingThreshold(8)},_keyDownFrequentlyUsedAppsListMoreTrigger:function(e){if(e.code===38||e.code==="ArrowUp"){var t=this._oFrequentlyUsedAppsList.getItems().length;if(t>0){this._oFrequentlyUsedAppsList.getItems()[t-1].focus()}}},_keyDownSearchResultListMoreTrigger:function(e){if(e.code===38||e.code==="ArrowUp"){var t=this._oSearchResultList.getItems().length;if(t>0){this._oSearchResultList.getItems()[t-1].focus()}}else if(e.code===40||e.code==="ArrowDown"){if(this._oExternalSearchResultList.getVisible()){var s=this._oExternalSearchResultList.getItems().length;if(s>0){this._oExternalSearchResultList.getItems()[0].focus()}}}},_keyDownSearchResultList:function(e){var t=this._oSearchResultList.getItems().length;if(e.code===40||e.code==="ArrowDown"){if(t>0&&this._oSearchResultList.getItems()[t-1]===e.srcControl){var s=window.getComputedStyle(document.getElementById("SearchResultList-triggerList"),"");if(s.display!=="none"){sap.ui.getCore().byId("SearchResultList-trigger").focus()}else if(this._oExternalSearchResultList.getVisible()){var i=this._oExternalSearchResultList.getItems().length;if(i>0){this._oExternalSearchResultList.getItems()[0].focus()}}}}else if(e.code===38||e.code==="ArrowUp"){if(t>0&&this._oSearchResultList.getItems()[0]===e.srcControl){this.oSF.focus()}}},_keyDownSearchFieldList:function(e){if(e.code===40||e.code==="ArrowDown"){if(this._oSearchFieldList.getItems()[0]===sap.ui.getCore().byId("SearchHistoryCustom")){this._oSearchHistoryList.getItems()[0].focus()}}},_keyDownExternalSearchResultList:function(e){var t=this._oExternalSearchResultList.getItems().length;if(e.code===38||e.code==="ArrowUp"){if(t>0&&this._oExternalSearchResultList.getItems()[0]===e.srcControl){if(this._oSearchResultList.getVisible()){var s=window.getComputedStyle(document.getElementById("SearchResultList-triggerList"),"");if(s.display==="none"){var i=this._oSearchResultList.getItems().length;if(i>0){this._oSearchResultList.getItems()[i-1].focus()}}else{sap.ui.getCore().byId("SearchResultList-trigger").focus()}}else{this.oSF.focus()}}}},_keyDownSearchFieldCustomItem:function(e){if(e.code===9||e.code==="Tab"){var t;if(e.shiftKey){t=this._oPlaceHolderSF.oParent.getDomRef().firstChild.firstChild}else{t=this._oPlaceHolderSF.oParent.getDomRef().lastChild.firstChild;if(t&&getComputedStyle(t).display==="none"){t=this._oPlaceHolderSF.oParent.getDomRef().lastChild.firstChild.nextSibling}}window.setTimeout(function(){if(t!==null){t.focus()}}.bind(this),0)}},_initializeSearchField:function(){this.oSF=sap.ui.getCore().byId("CEPSearchField");var e=document.getElementById("PlaceHolderSearchField").clientWidth;this.oSF.setWidth(e+"px");this.oSF.addEventDelegate({onkeydown:this._keyDownSearchField.bind(this)});this._SearchFieldCustomItem=sap.ui.getCore().byId("SearchFieldCustom");this._SearchFieldCustomItem.addEventDelegate({onkeydown:this._keyDownSearchFieldCustomItem.bind(this)})},_initializeSearchFieldList:function(){this._oSearchFieldList=sap.ui.getCore().byId("SearchFieldList");this._oSearchFieldList.addEventDelegate({onkeydown:this._keyDownSearchFieldList.bind(this)})},_initializeSearchHistoryList:function(){this._oSearchHistoryList=sap.ui.getCore().byId("SearchHistoryList");this._oSearchHistoryList.addEventDelegate({onkeydown:this._keyDownSearchHistoryList.bind(this)});this._SearchHistoryCustomItem=sap.ui.getCore().byId("SearchHistoryCustom")},_initializeFrequentlyUsedAppsList:function(){this._oFrequentlyUsedAppsList=sap.ui.getCore().byId("FrequentlyUsedAppsList");this._oFrequentlyUsedAppsList.setHeaderText(h.i18n.getText("frequentAppsCEPSearch"));this._oFrequentlyUsedAppsList.addEventDelegate({onkeydown:this._keyDownFrequentlyUsedAppsList.bind(this)})},_initializeSearchResultList:function(){this._oSearchResultList=sap.ui.getCore().byId("SearchResultList");this._oSearchResultList.addEventDelegate({onkeydown:this._keyDownSearchResultList.bind(this)})},_initializeExternalSearchResultList:function(){this._oExternalSearchResultList=sap.ui.getCore().byId("ExternalSearchAppsList");this._oExternalSearchResultList.setHeaderText(h.i18n.getText("searchWithin"));this._oExternalSearchResultList.addEventDelegate({onkeydown:this._keyDownExternalSearchResultList.bind(this)})},_saveSearchTerm:function(e){if(e){sap.ushell.Container.getServiceAsync("UserRecents").then(function(t){t.addSearchActivity({sTerm:e}).then(function(){return})})}},onRecentSearchPress:function(e){var t=e.getParameter("listItem").getProperty("title");this._recentSearchTermSelected=true;this.oSF.setValue(t);this.testProviders(t)},onSearchResultPress:function(e){var t=this.oSF.getValue();this._saveSearchTerm(t);var s="searchResults";if(this._bIsMyHome===true){var i=e.getParameter("listItem").getBindingContext(s).getObject().url;if(i!==undefined&&i!==null){this._navigateURL(i);return}}else{var r=e.getParameter("listItem").getBindingContext(s).getObject().semanticObject;var o=e.getParameter("listItem").getBindingContext(s).getObject().semanticObjectAction;this._navigateApp(r,o)}},onExternalSearchResultPress:function(e){var t=this.oSF.getValue();this._saveSearchTerm(t);if(e.getParameter("listItem").getBindingContext("externalSearchResults").getObject().isEnterpriseSearch===true){this._navigateToResultPage(t,true)}else{var s=e.getParameter("listItem").getBindingContext("externalSearchResults").getObject().url;if(s!==undefined&&s!==null){this._navigateURL(s)}}},onFreqUsedAppsPress:function(e){var t=e.getParameter("listItem").getBindingContext("freqUsedApps").getObject().appId;var s=t.split("-")[0];s=s.split("#")[1];var i=t.split("-")[1];this._navigateApp(s,i);if(this._oPopover.isOpen()){this._oPopover.close()}},_setListsVisible:function(e,t){t.setVisible(e)},_navigateURL:function(e){l.openURL(e);this.oSF.setValue("");window.setTimeout(function(){if(this._oPopover.isOpen()){this._oPopover.close()}}.bind(this),500)},_navigateApp:function(e,t){var s={};if(this._bIsMyHome===true){s={"sap-ushell-navmode":"explace"}}sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(function(i){i.toExternal({target:{semanticObject:e,action:t},params:s})});if(this.oSF.getValue()!==""){this.oSF.setValue("")}window.setTimeout(function(){if(this._oPopover.isOpen()){this._oPopover.close()}}.bind(this),500)},_navigateToResultPage:function(e,t){var s;if(t===true){s='#Action-search&/top=20&filter={"dataSource":{"type":"Category","id":"All","label":"All","labelPlural":"All"},"searchTerm":"'+e+'","rootCondition":{"type":"Complex","operator":"And","conditions":[]}}'}else{s='#Action-search&/top=20&filter={"dataSource":{"type":"Category","id":"$$APPS$$","label":"Apps","labelPlural":"Apps"},"searchTerm":"'+e+'","rootCondition":{"type":"Complex","operator":"And","conditions":[]}}'}this.bOnNavigationToResultPage=true;sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(function(e){e.toExternal({target:{shellHash:s}})});window.setTimeout(function(){this.bOnNavigationToResultPage=false}.bind(this),3e3)}})});
},
	"sap/ushell/components/shell/SearchCEP/SearchFieldFragment.fragment.xml":'<core:FragmentDefinition\n    height="100%"\n    xmlns:core="sap.ui.core"\n    xmlns="sap.m"><Popover\n        initialFocus="CEPSearchField"\n        id="searchFieldPopover"\n        placement="Bottom"\n        showArrow="false"\n        showHeader="false"\n        offsetX="-18"\n        beforeOpen=".onBeforeOpen"\n        beforeClose=".onBeforeClose"\n        afterOpen=".onAfterOpen"\n        afterClose=".onAfterClose"\n        horizontalScrolling="false"><content><List xmlns="sap.m" width="100%" id="SearchFieldList" showSeparators="None"><items><CustomListItem xmlns="sap.m" id="SearchFieldCustom" class="sapUiCEPSearchSFCustom"><content><SearchField\n                                id="CEPSearchField"\n                                width="98%"\n                                placeholder="{i18n>search}"\n                                tooltip="{i18n>search}"\n                                enableSuggestions="true"\n                                search=".onSearch"\n                                suggest=".onSuggest"\n                                class="sapUiTinyMarginBottom sapUshellCEPSearchFieldMargin"\n                            /></content></CustomListItem><CustomListItem xmlns="sap.m" id="SearchHistoryCustom" visible="false" class="sapUiTinyMarginBottom sapUiTinyMarginBeginEnd"><content><List id="SearchHistoryList"\n                                  showSeparators="None"\n                                  xmlns="sap.m"\n                                  items="{\n                      path: \'searchTerms>/\'\n              }"\n                                  itemPress=".onRecentSearchPress"\n                                  growing="true"\n                                  showNoData="false"\n                                  updateStarted=".onGrowingStarted"\n                                  growingThreshold="2"\n                                  growingScrollToLoad="false"><StandardListItem\n                                    type="Active"\n                                    title="{searchTerms>text}"\n                                    icon="sap-icon://history"\n                                    iconDensityAware="false"\n                                    class="sapUiTinyMarginBeginEnd"/></List></content></CustomListItem><CustomListItem xmlns="sap.m" id="FreqUsedAppCustom" visible="false" class="sapUiTinyMarginTopBottom sapUiTinyMarginBeginEnd"><content><List id="FrequentlyUsedAppsList"\n                                  visible="false"\n                                  showSeparators="None"\n                                  xmlns="sap.m"\n                                  items="{\n                      path: \'freqUsedApps>/\'\n              }"\n                                  itemPress=".onFreqUsedAppsPress"\n                                  class="sapUiTinyMarginEnd"\n                                  growing="true"\n                                  showNoData="false"\n                                  growingThreshold="6"\n                                  growingScrollToLoad="false"><StandardListItem\n                                    type="Active"\n                                    title="{freqUsedApps>title}"\n                                    icon="{freqUsedApps>icon}"\n                                    iconDensityAware="false"\n                                    class="sapUiTinyMarginBeginEnd"/></List></content></CustomListItem><CustomListItem xmlns="sap.m" id="SearchResultCustom" visible="false" class="sapUiTinyMarginTopBottom sapUiTinyMarginBeginEnd"><content><List id="SearchResultList"\n                                  showSeparators="None"\n                                  visible="false"\n                                  xmlns="sap.m"\n                                  items="{\n                                    path: \'searchResults>/\'\n                                }"\n                                  itemPress=".onSearchResultPress"\n                                  growing="true"\n                                  growingThreshold="6"\n                                  updateFinished=".onGrowingFinishedResults"\n                                  growingScrollToLoad="false"><StandardListItem\n                                    type="Active"\n                                    title="{searchResults>text}"\n                                    icon="{searchResults>icon}"\n                                    iconDensityAware="false"\n                                    class="sapUiTinyMarginBeginEnd"\n                                /></List></content></CustomListItem><CustomListItem xmlns="sap.m" id="ExternalSearchAppsCustom" visible="false" class="sapUiTinyMarginTopBottom sapUiTinyMarginBeginEnd"><content><List id="ExternalSearchAppsList"\n                                  showSeparators="None"\n                                  visible="false"\n                                  xmlns="sap.m"\n                                  items="{\n                                    path: \'externalSearchResults>/\'\n                                }"\n                                  itemPress=".onExternalSearchResultPress"\n                                  growing="true"\n                                  showNoData="false"\n                                  growingThreshold="6"\n                                  growingScrollToLoad="false"><StandardListItem\n                                    type="Active"\n                                    title="{externalSearchResults>text}"\n                                    icon="{externalSearchResults>icon}"\n                                    iconDensityAware="false"\n                                    class="sapUiTinyMarginBeginEnd"\n                                /></List></content></CustomListItem></items></List></content></Popover></core:FragmentDefinition>\n',
	"sap/ushell/components/shell/SearchCEP/SearchProviders/NavigationSvcSearchProvider.js":function(){
// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/components/shell/SearchCEP/SearchProviders/SearchProvider","sap/base/Log","sap/ushell/Config","sap/ushell/resources","sap/base/util/ObjectPath"],function(e,r,a,t,n){"use strict";var i=function(){};i.prototype.getName=function(){return"Navigation Service Search Provider"};i.prototype.execSearch=function(a){var t=this;return sap.ushell.Container.getServiceAsync("SearchCEP").then(function(r){return r.execSearch(a).then(function(r){var i=n.get("sap-ushell-config.services.SearchCEP")!==undefined,c=sap.ushell.Container.getFLPPlatform(true),o=i===true&&c==="cFLP",s={},l=n.get("sap-ushell-config.renderers.fiori2.componentData.config.searchBusinessObjects");if(r&&Array.isArray(r.applications)&&r.applications.length>0){s.applications=r.applications.map(function(r){r._type=e.ENTRY_TYPE.App;r.icon=r.icon||"sap-icon://SAP-icons-TNT/application";return r})}if(r&&Array.isArray(r.externalSearchApplications)&&r.externalSearchApplications.length>0){s.externalSearchApplications=r.externalSearchApplications.map(function(r){r._type=e.ENTRY_TYPE.App;r.icon=r.icon||"sap-icon://world";return r})}if(l===true&&o===true){s.externalSearchApplications=t._addESToResult(s,a)}return s})},function(e){r.error("Navigation Service Search Provider failed","error: "+e,"sap.ushell.components.shell.SearchCEP.SearchProviders.NavigationSvcSearchProvider::execSearch");return{}})};i.prototype._addESToResult=function(r,a){var n='#Action-search&/top=20&filter={"dataSource":{"type":"Category","id":"All","label":"All","labelPlural":"All"},"searchTerm":"'+a+'","rootCondition":{"type":"Complex","operator":"And","conditions":[]}}',i=sap.ushell.Container.getFLPUrl()+n,c={text:t.i18n.getText("enterprise_search"),description:t.i18n.getText("enterprise_search"),icon:"sap-icon://search",inboundIdentifier:"38cd162a-e185-448c-9c37-a4fc02b3d39d___GenericDefaultSemantic-__GenericDefaultAction",url:i,target:"_blank",recent:false,semanticObject:"Action",semanticObjectAction:"search",_type:e.ENTRY_TYPE.App,isEnterpriseSearch:true};if(r&&Array.isArray(r.externalSearchApplications)&&r.externalSearchApplications.length>0){r.externalSearchApplications.push(c)}else{r.externalSearchApplications=[c]}return r.externalSearchApplications};return new i},false);
},
	"sap/ushell/components/shell/SearchCEP/SearchProviders/RecentAppsProvider.js":function(){
// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/components/shell/SearchCEP/SearchProviders/SearchProvider","sap/base/Log"],function(e,t){"use strict";var n=function(){};n.prototype.getName=function(){return"Recent Applications Provider"};n.prototype.execSearch=function(){return sap.ushell.Container.getServiceAsync("UserRecents").then(function(n){return n.getFrequentActivity().then(function(t){if(Array.isArray(t)&&t.length>0){return{recentApplications:t.map(function(t){if(t.appType==="Application"){t._type=e.ENTRY_TYPE.App;t.text=t.text||t.title;t.icon=t.icon||"sap-icon://SAP-icons-TNT/application"}else if(t.appType==="External Link"){t._type=e.ENTRY_TYPE.ExternalLink;t.text=t.text||t.title;t.icon=t.icon||"sap-icon://internet-browser"}return t})}}return{}},function(e){t.error("Recent Applications Provider failed","error: "+e,"sap.ushell.components.shell.SearchCEP.SearchProviders.RecentAppsProvider::execSearch");return{}})})};return new n},false);
},
	"sap/ushell/components/shell/SearchCEP/SearchProviders/RecentSearchProvider.js":function(){
// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/components/shell/SearchCEP/SearchProviders/SearchProvider","sap/base/Log"],function(e,r){"use strict";var n=function(){};n.prototype.getName=function(){return"Recent Search Terms Provider"};n.prototype.execSearch=function(){return sap.ushell.Container.getServiceAsync("UserRecents").then(function(n){return n.getRecentSearches().then(function(r){if(Array.isArray(r)&&r.length>0){return{recentSearches:r.map(function(r){return{_type:e.ENTRY_TYPE.SearchText,text:r.sTerm,icon:r.icon||"sap-icon://history"}})}}return{}},function(e){r.error("Recent Search Terms Provider failed","error: "+e,"sap.ushell.components.shell.SearchCEP.SearchProviders.RecentSearchProvider::execSearch");return{}})})};return new n},false);
},
	"sap/ushell/components/shell/SearchCEP/SearchProviders/SearchProvider.js":function(){
// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define([],function(){"use strict";var e={};e.GROUP_TYPE={Applications:"applications",RecentApplications:"recentApplications",RecentSearches:"recentSearches",ExternalSearchApplications:"externalSearchApplications"};e.ENTRY_TYPE={App:"app",ExternalLink:"ex-link",SearchText:"text"};return e},false);
}
});
//# sourceMappingURL=Component-preload.js.map