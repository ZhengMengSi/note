/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/changeHandler/BaseAddXml"],function(B){"use strict";var A={};A.applyChange=function(c,C,p){var v=p.view;var m=p.modifier;if(m.targets==="jsControlTree"){throw new Error("Changes with type "+c.getChangeType()+" are not supported on js");}var s=c.getDefinition().selector;var e=m.getExtensionPointInfo(s.name,v);if(!e){throw new Error("AddXMLAtExtensionPoint-Error: Either no Extension-Point found by name '"+(s&&s.name)+"' or multiple Extension-Points available with the given name in the view (view.id='"+(v&&m.getId(v))+"'). Multiple Extension-points with the same name in one view are not supported!");}e.defaultContent.forEach(function($){if($.parentNode){$.parentNode.removeChild($);}});return B.applyChange(c,C,p,e);};A.revertChange=B.revertChange;A.completeChangeContent=B.completeChangeContent;return A;},true);
