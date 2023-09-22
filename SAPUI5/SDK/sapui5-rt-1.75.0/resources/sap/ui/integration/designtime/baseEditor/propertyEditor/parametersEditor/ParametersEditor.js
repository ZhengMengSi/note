/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/designtime/baseEditor/propertyEditor/mapEditor/MapEditor","sap/base/util/deepClone","sap/base/util/isPlainObject"],function(M,d,i){"use strict";var P=M.extend("sap.ui.integration.designtime.baseEditor.propertyEditor.parametersEditor.ParametersEditor",{formatInputValue:function(v){return(v||{}).value;},fireValueChange:function(p){var f={};Object.keys(p).forEach(function(k){f[k]=this._formatOutputValue(d(p[k]));}.bind(this));this.fireEvent("valueChange",{path:this.getConfig().path,value:f});},_formatOutputValue:function(v){if(!i(v)||!v.hasOwnProperty("value")){v={value:v};}return v;},renderer:M.getMetadata().getRenderer().render});return P;});
