/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(["sap/apf/modeler/ui/utils/optionsValueModelBuilder","sap/apf/modeler/ui/utils/staticValuesBuilder","sap/apf/modeler/ui/utils/constants","sap/apf/modeler/ui/utils/textManipulator","sap/apf/modeler/ui/utils/nullObjectChecker","sap/apf/utils/utils"],function(e,t,r,o,i,a){"use strict";var n="idSortProperty";var d="idSortDirection";var e=sap.apf.modeler.ui.utils.optionsValueModelBuilder;var s=sap.apf.modeler.ui.utils.textManipulator;var u=sap.apf.modeler.ui.utils.CONSTANTS.events;function p(e){e.byId("idSortLabel").setText(e.oTextReader("sortingField"));e.byId("idSortLabel").setTooltip(e.oTextReader("sortingField"));e.byId("idSortDirectionLabel").setText(e.oTextReader("direction"));e.byId("idSortDirectionLabel").setTooltip(e.oTextReader("direction"));e.byId("idAddPropertyIcon").setTooltip(e.oTextReader("addButton"));e.byId("idRemovePropertyIcon").setTooltip(e.oTextReader("deleteButton"))}function l(e){if(sap.ui.Device.browser.msie&&sap.ui.Device.browser.version>=11){e.byId("idAriaPropertyForSortGroup").setText(e.oTextReader("sorting"))}e.byId("idAriaPropertyForAdd").setText(e.oTextReader("ariaTextForAddIcon"));e.byId("idAriaPropertyForDelete").setText(e.oTextReader("ariaTextForDeleteIcon"))}function f(t){var r=t.byId(n);t.getAllPropertiesAsPromise().done(function(t){var o=e.convert(t.aAllProperties);r.setModel(o);r.setSelectedKey(t.sSelectedKey)})}function c(t){var r=t.byId(d);var o=new sap.apf.modeler.ui.utils.StaticValuesBuilder(t.oTextReader,e);var i=o.getSortDirections();r.setModel(i);r.setSelectedKey(t.getView().getViewData().oPropertyTypeData.sContext)}function y(e){var t=true,r=true;var o=e.getView().getViewData().oPropertyTypeState;var i=o.indexOfPropertyTypeViewId(e.getView().getId());if(o.indexOfPropertyTypeViewId(e.getView().getId())===0){r=false}e.byId("idAddPropertyIcon").setVisible(t);e.byId("idRemovePropertyIcon").setVisible(r);if(i>0&&o.aProperties!==undefined){var a=o.getViewAt(i-1);a.oController.byId("idAddPropertyIcon").setVisible(false)}}function v(e,t){var r=e.getView().getViewData().oPropertyTypeState;if(r!==undefined){var o=r.aProperties.length;var i=r.getViewAt(t-1);var a=e.oConfigurationEditor.isSaved();if(t>1&&t==o&&a==false){i.oController.byId("idAddPropertyIcon").setVisible(true);i.oController.byId("idRemovePropertyIcon").setVisible(true)}if(t===1&&t==o&&a==false){i.oController.byId("idAddPropertyIcon").setVisible(true)}}}function g(e){e.byId("idAddPropertyIcon").attachEvent(u.SETFOCUSONADDICON,e.setFocusOnAddRemoveIcons.bind(e))}var P=sap.ui.core.mvc.Controller.extend("sap.apf.modeler.ui.controller.sortPropertyType",{oConfigurationEditor:{},oParentObject:{},oStepPropertyMetadataHandler:{},oTextReader:{},onInit:function(){var e=this;e.oConfigurationEditor=e.getView().getViewData().oConfigurationEditor;e.oParentObject=e.getView().getViewData().oParentObject;e.oStepPropertyMetadataHandler=e.getView().getViewData().oStepPropertyMetadataHandler;e.oTextReader=e.getView().getViewData().oCoreApi.getText;e.setDetailData()},onAfterRendering:function(){var e=this;e.byId("idAddPropertyIcon").fireEvent(u.SETFOCUSONADDICON)},setDetailData:function(){var e=this;p(e);l(e);f(e);c(e);y(e);e.disableView()},handleChangeForSortProperty:function(e){var t=this;var r=s.removePrefixText(t.byId(n).getSelectedKey(),t.oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));var o=t.getView().getViewData().oPropertyOrchestration;var i=t.getView().getId();return new Promise(function(e){t.getView().fireEvent(u.UPDATEPROPERTYVALUESTATE,{sProperty:r});o.updatePropertyTypeRow(i,r);o.updateAllSelectControlsForPropertyType().then(function(){t.updateOfConfigurationObject();t.oConfigurationEditor.setIsUnsaved();e()})})},handleChangeForSortDirection:function(){var e=this;e.updateOfConfigurationObject();e.oConfigurationEditor.setIsUnsaved()},setFocusOnAddRemoveIcons:function(){var e=this;e.byId("idAddPropertyIcon").focus()},handlePressOfAddPropertyIcon:function(){var e=this;g(e);e.addPropertyAsPromise()},handlePressOfRemovePropertyIcon:function(){var e=this;var t=e.getView().getViewData();var r=e.getView().getViewData().oPropertyTypeState;if(r!==undefined){var o=r.indexOfPropertyTypeViewId(e.getView().getId())}return new Promise(function(r){e.getView().fireEvent(u.FOCUSONREMOVE);var i=t.oPropertyOrchestration;i.removePropertyTypeReference(e.getView().getId());i.updateAllSelectControlsForPropertyType().then(function(){e.updateOfConfigurationObject();t.oPropertyTypeHandlerBackLink.handlePressOfRemove({oSourceView:e.getView()});v(e,o);e.oConfigurationEditor.setIsUnsaved();e.getView().destroy();r()})})},updateOfConfigurationObject:function(){var e=this;var t=e.getView().getViewData().oPropertyOrchestration;var r=t.getSortPropertyInformationList(d);e.updateOfConfigurationObjectOfSubclass(r)},getSelectedSortProperty:function(){var e=this;var t=e.getView().getViewData().oPropertyTypeState;var r=t.getPropertyValueState();var o=t.indexOfPropertyTypeViewId(e.getView().getId());return r[o]},removeAllItemsFromDropDownList:function(){var e=this;var t=e.byId(n);t.getItems().forEach(function(e){t.removeItem(e)})},setItemsOfDropDownList:function(e,t,r){function o(e,t){return e.indexOf(t)!==-1}var i=this;var a=i.byId(n);var d=r===i.oTextReader("none");var u=JSON.parse(JSON.stringify(e));a.addItem(new sap.ui.core.Item({key:i.oTextReader("none"),text:i.oTextReader("none")}));if(!o(u,r)&&!d){u.unshift(r)}u=u.filter(function(e){return e!==i.oTextReader("none")});u.forEach(function(e){var n=e;if(!o(t,e)&&!d){e=s.addPrefixText([e],i.oTextReader)[0]}var u=new sap.ui.core.Item({key:e,text:e});a.addItem(u);if(n===r){r=e}});a.setSelectedKey(r)},updateOfConfigurationObjectOfSubclass:function(e){},getOrderBy:function(){},setNextPropertyInParentObject:function(){},removePropertyFromParentObject:function(){},disableView:function(){},addPropertyAsPromise:function(){return sap.apf.utils.createPromise()}});return P},true);
//# sourceMappingURL=sortPropertyType.js.map