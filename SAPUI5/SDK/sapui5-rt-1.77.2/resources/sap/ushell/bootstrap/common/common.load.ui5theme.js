// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/bootstrap/common/common.boot.path","sap/ui/thirdparty/jquery"],function(b,q){"use strict";function a(B){if(!B||!B.theme){q.sap.log.error("No boot theme could be applied",null,"common.load.ui5theme");return;}var S=window["sap-ui-config"]||{},A=c(B.root),t=B.theme,h=S.theme!==t;i(t,A||(b+"/"));if(A||h){var C=sap.ui.getCore();var e=[t,A].filter(function(s){return s;});C.applyTheme.apply(C,e);}q.sap.log.debug("Boot theme applied: theme = '"+B.theme+"' theme root = '"+B.root+"'",null,"common.load.ui5theme");}function c(t){if(t){return t+"/UI5/";}return undefined;}function i(t,T){var l=sap.ui.getCore().getConfiguration().getLanguage(),s=T+"sap/fiori/themes/"+t,I=d(l),f=I?"library-RTL.css":"library.css";q.sap.includeStyleSheet(s+"/"+f,"sap-ui-theme-sap.fiori");}function d(l){var A=["ar","fa","he","iw"];l=l.toLowerCase().substring(0,2);return A.indexOf(l)>=0;}return a;});