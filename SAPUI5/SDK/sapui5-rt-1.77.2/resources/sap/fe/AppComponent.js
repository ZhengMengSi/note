/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/fe/core/AppComponent","sap/base/Log","sap/m/MessageToast"],function(C,L,M){"use strict";return C.extend("sap.fe.AppComponent",{init:function(){var t='This class of the AppComponent is deprecated, please use "sap.fe.core.AppComponent" instead';L.error(t);M.show(t);C.prototype.init.apply(this,arguments);}});});
