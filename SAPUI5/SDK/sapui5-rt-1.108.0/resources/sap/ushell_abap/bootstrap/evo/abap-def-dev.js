// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["./abap.configure.ushell","./abap.load.launchpad","./boottask","sap/ushell/bootstrap/common/common.configure.ui5","sap/ushell/bootstrap/common/common.configure.ui5.extractLibs","sap/ushell/bootstrap/common/common.debug.mode","sap/ushell/bootstrap/common/common.load.bootstrapExtension"],function(a,o,s,t,p,e,l){"use strict";var n;window["sap-ui-debug"]=e;n=a();t({ushellConfig:n,libs:p(n),theme:"sap_fiori_3",platform:"abap",platformAdapters:{abap:"sap.ushell_abap.adapters.abap",hana:"sap.ushell_abap.adapters.hana"},bootTask:s.start,onInitCallback:o});l(n)});
//# sourceMappingURL=abap-def-dev.js.map