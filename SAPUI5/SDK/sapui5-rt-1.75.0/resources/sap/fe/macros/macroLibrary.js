/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/util/XMLPreprocessor","sap/fe/macros/PhantomUtil","./Chart.metadata","./Field.metadata","./FilterField.metadata","./FilterBar.metadata","./Form.metadata","./FormContainer.metadata","./MicroChart.metadata","./Contact.metadata","./Table.metadata","./ValueHelp.metadata"],function(X,P,C,F,a,b,c,d,M,e,T,V){"use strict";var n="sap.fe.macros",f=[T,c,d,F,b,a,C,V,M,e].map(function(E){if(typeof E==="string"){return{name:E,namespace:n,metadata:{metadataContexts:{},properties:{},events:{}}};}return E;});function r(){f.forEach(function(E){P.register(E);});}function g(){f.forEach(function(E){X.plugIn(null,E.namespace,E.name);});}r();return{register:r,deregister:g};});
