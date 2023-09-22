// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/services/_VisualizationInstantiation/VizInstanceAbap"],function(V){"use strict";function a(){}a.prototype.instantiateVisualization=function(v){var o;var p=v._instantiationData.platform;switch(p){case"ABAP":{o=new V(v);o.load();break;}default:{break;}}return o;};a.hasNoAdapter=true;return a;});
