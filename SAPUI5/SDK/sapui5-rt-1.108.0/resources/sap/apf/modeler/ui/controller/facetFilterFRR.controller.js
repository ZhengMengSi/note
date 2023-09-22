/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */
sap.ui.define(["sap/apf/modeler/ui/controller/requestOptions","sap/apf/modeler/ui/utils/textPoolHelper"],function(e,t){"use strict";var r=false;var i=e.extend("sap.apf.modeler.ui.controller.facetFilterFRR",{setDisplayText:function(){var e=this;var t=e.getView().getViewData().oTextReader;e.byId("idSourceLabel").setText(t("vhSource"));e.byId("idEntityLabel").setText(t("vhEntity"));e.byId("idSelectPropertiesLabel").setText(t("vhSelectProperties"))},handleCopy:function(){var e=this;e.setDetailData()},clearFRRFields:function(){var e=this;e.clearSource();e.setDetailData()},enableOrDisableView:function(){var e=true,t=this;if(t.oParentObject.getUseSameRequestForValueHelpAndFilterResolution()===true){e=false}t.byId("idSource").setEnabled(e);t.byId("idEntity").setEnabled(e);t.byId("idSelectProperties").setEnabled(e)},getSource:function(){var e=this;return e.oParentObject.getServiceOfFilterResolution()},getAllEntitiesAsPromise:function(e){var t=this;return t.oConfigurationEditor.getAllEntitySetsOfServiceAsPromise(e)},getEntity:function(){var e=this;return e.oParentObject.getEntitySetOfFilterResolution()},getAllEntitySetPropertiesAsPromise:function(e,t){var r=this;return r.oConfigurationEditor.getAllPropertiesOfEntitySetAsPromise(e,t)},clearSource:function(){var e=this;e.oParentObject.setServiceOfFilterResolution(undefined);e.clearEntity()},clearEntity:function(){var e=this;e.oParentObject.setEntitySetOfFilterResolution(undefined);e.clearSelectProperties()},clearSelectProperties:function(){var e=this;var t=e.oParentObject.getSelectPropertiesOfFilterResolution();t.forEach(function(t){e.oParentObject.removeSelectPropertyOfFilterResolution(t)})},removeSelectProperties:function(e){var t=this;e.forEach(function(e){t.oParentObject.removeSelectPropertyOfFilterResolution(e)})},updateSource:function(e){var t=this;t.oParentObject.setServiceOfFilterResolution(e);r=true},updateEntity:function(e){var t=this;t.oParentObject.setEntitySetOfFilterResolution(e)},updateSelectProperties:function(e){var t=this;t.clearSelectProperties();e.forEach(function(e){t.oParentObject.addSelectPropertyOfFilterResolution(e)})},getSelectProperties:function(){var e=this;return e.oParentObject.getSelectPropertiesOfFilterResolution()},fireRelevantEvents:function(){var e=this;if(r){e.getView().fireEvent(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.UPDATEPROPERTIES);r=false}},getValidationState:function(){var e=this;return e.viewValidator.getValidationState()}});return i});
//# sourceMappingURL=facetFilterFRR.controller.js.map