sap.ui.define(["sap/ovp/cards/v4/generic/Component","sap/ovp/cards/v4/charts/VizAnnotationManager","sap/ovp/cards/jUtils"],function(a,e,t){"use strict";return a.extend("sap.ovp.cards.v4.charts.analytical.Component",{metadata:{properties:{headerExtensionFragment:{type:"string",defaultValue:"sap.ovp.cards.v4.generic.KPIHeader"},contentFragment:{type:"string",defaultValue:"sap.ovp.cards.v4.charts.analytical.analyticalChart"},controllerName:{type:"string",defaultValue:"sap.ovp.cards.v4.charts.analytical.analyticalChart"}},version:"1.108.0",library:"sap.ovp",includes:[],dependencies:{libs:["sap.viz"],components:[]},config:{}},onAfterRendering:function(){t.setAttributeToMultipleElements(".tabindex0","tabindex",0);t.setAttributeToMultipleElements(".tabindex-1","tabindex",-1)}})});
//# sourceMappingURL=Component.js.map