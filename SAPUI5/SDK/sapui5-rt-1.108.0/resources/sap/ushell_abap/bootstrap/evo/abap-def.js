// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["./abap.configure.ushell","./abap.load.launchpad","./boottask","sap/ushell/bootstrap/common/common.configure.ui5","sap/ushell/bootstrap/common/common.configure.ui5.extractLibs","sap/ushell/bootstrap/common/common.load.bootstrapExtension","sap/ushell/bootstrap/common/common.debug.mode","sap/ushell/bootstrap/common/common.load.core-min"],function(a,o,s,p,t,l,e,n){"use strict";var m;window["sap-ui-debug"]=e;m=a();p({ushellConfig:m,libs:t(m),theme:"sap_belize",platform:"abap",platformAdapters:{abap:"sap.ushell_abap.adapters.abap",hana:"sap.ushell_abap.adapters.hana"},bootTask:s.start,onInitCallback:o});n.load("sap.ushell_abap.bootstrap.evo");l(m)});
//# sourceMappingURL=abap-def.js.map