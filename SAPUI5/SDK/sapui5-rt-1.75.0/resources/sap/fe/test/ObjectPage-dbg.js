sap.ui.define(
	[
		"sap/base/util/merge",
		"./TemplatePage",
		"sap/ui/test/OpaBuilder",
		"sap/m/library",
		"sap/fe/test/Utils",
		"sap/fe/test/builder/FEBuilder",
		"sap/fe/test/builder/FieldBuilder"
	],
	function(mergeObjects, TemplatePage, OpaBuilder, mLibrary, Utils, FEBuilder, FieldBuilder) {
		"use strict";

		function getTableId(sNavProperty) {
			return "fe::table::" + sNavProperty + "::LineItem";
		}

		function _getFieldId(sPrefix, sField, sFacet, sHeaderFacet, sIdentification, sFieldGroup, bValueHelp) {
			var sId = sPrefix,
				bDoubleTheBug = false;

			if (typeof sFacet === "string") {
				sId += "::com.sap.vocabularies.UI.v1.Facets" + (sFacet ? "::" + sFacet : "");
			} else if (typeof sHeaderFacet === "string") {
				bDoubleTheBug = true;
				sId += "::com.sap.vocabularies.UI.v1.HeaderFacets" + (sHeaderFacet ? "::" + sHeaderFacet : "");
			}

			if (typeof sIdentification === "string") {
				sId += "::com.sap.vocabularies.UI.v1.Identification" + (sIdentification ? "::" + sIdentification : "");
				// TODO there seems to be a bug in the id generator
				sId += "::com.sap.vocabularies.UI.v1.Identification" + (sIdentification ? "::" + sIdentification : "");
			} else if (typeof sFieldGroup === "string") {
				sId += "::com.sap.vocabularies.UI.v1.FieldGroup" + (sFieldGroup ? "::" + sFieldGroup : "");
				// TODO there seems to be a bug in the id generator
				if (bDoubleTheBug) {
					sId += "::com.sap.vocabularies.UI.v1.FieldGroup" + (sFieldGroup ? "::" + sFieldGroup : "");
				}
			}
			sId += (bValueHelp ? "::FormC::FormVH::" : "::FormC::FormF::") + sField;
			return sId;
		}

		function getVHDFieldId(sPrefix, oField, sFieldSuffix) {
			return _getFieldId(
				sPrefix,
				oField.field + (sFieldSuffix || ""),
				oField.facet,
				oField.headerFacet,
				oField.identification,
				oField.fieldGroup,
				true
			);
		}

		function getFieldId(sPrefix, oField, sFieldSuffix) {
			return _getFieldId(
				sPrefix,
				oField.field + (sFieldSuffix || ""),
				oField.facet,
				oField.headerFacet,
				oField.identification,
				oField.fieldGroup
			);
		}

		function getTableSettingsButtonId(sNavProperty) {
			return getTableId(sNavProperty) + "-settings";
		}

		return {
			create: function(sAppId, sComponentId, sEntityPath) {
				var ViewId = sAppId + "::" + sComponentId,
					FormFieldPrefix = "F::fe::form::" + sEntityPath,
					VHDFieldPrefix = "fe::form::" + sEntityPath,
					OPHeaderId = "fe::OPHeaderContent",
					OPHeaderInfoId = "fe::ops::HeaderInfo",
					OPFooterId = "fe::op::footer::" + sEntityPath,
					AnchorBarId = "fe::op-anchBar",
					PaginatorId = "fe::paginator",
					Page_EditMode = {
						DISPLAY: "Display",
						EDITABLE: "Editable"
					},
					DraftIndicatorState = mLibrary.DraftIndicatorState,
					oResourceBundleTemplates = sap.ui.getCore().getLibraryResourceBundle("sap.fe.templates"),
					oResourceBundleCore = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");

				return mergeObjects(TemplatePage.create(ViewId, sEntityPath), {
					actions: {
						iClickQuickViewMoreLinksButton: function() {
							return OpaBuilder.create(this)
								.hasType("sap.m.Button")
								.has(OpaBuilder.Matchers.resourceBundle("text", "sap.ui.mdc", "info.POPOVER_DEFINE_LINKS"))
								.doPress()
								.description("Pressing 'More Links' button")
								.execute();
						},
						iClickLinkWithText: function(sText) {
							return OpaBuilder.create(this)
								.hasType("sap.m.Link")
								.hasProperties({ text: sText })
								.doPress()
								.description("Navigating via link '" + sText + "'")
								.execute();
						},
						iClickSemanticLink: function(oField) {
							var sFieldId = getFieldId(FormFieldPrefix, oField);
							return OpaBuilder.create(this)
								.hasId(new RegExp(sFieldId))
								.hasType("sap.m.Link")
								.doPress()
								.description("Opening semantic link '" + oField.field + "'")
								.execute();
						},
						iEnableLink: function(sText) {
							return OpaBuilder.create(this)
								.hasType("sap.m.CustomListItem")
								.hasAggregationProperties("content", { text: sText })
								.isDialogElement()
								.doPress("selectMulti")
								.description("The CheckBox for link " + sText + " is selected")
								.execute();
						},
						iEnterValueForField: function(oField, oValue) {
							var sFieldId = getFieldId(FormFieldPrefix, oField);
							return OpaBuilder.create(this)
								.hasId(sFieldId)
								.doEnterText(oValue)
								.description("Entering Text in the field '" + oField.field + "' with value '" + oValue + "'")
								.execute();
						},
						iOpenVHDialog: function(oField) {
							var sFieldId = getFieldId(FormFieldPrefix, oField, "-inner-vhi");
							return OpaBuilder.create(this)
								.hasId(sFieldId)
								.doPress()
								.description("Opening value help for '" + oField.field + "'")
								.execute();
						},
						iPressKeyboardShortcutOnHeaderInfo: function(sShortcut) {
							return this._iPressKeyboardShortcut(OPHeaderInfoId, sShortcut);
						},
						iPressKeyboardShortcutOnPropertyTable: function(sNavProperty, sShortcut) {
							return this._iPressKeyboardShortcut(getTableId(sNavProperty), sShortcut);
						},
						iSelectFromVHDTable: function(sValue) {
							return OpaBuilder.create(this)
								.hasType("sap.m.ColumnListItem")
								.hasAggregationProperties("cells", { value: sValue })
								.checkNumberOfMatches(1)
								.isDialogElement()
								.doPress()
								.description("Selecting row from dialog with value '" + sValue + "'")
								.execute();
						},
						iConfirmFacetVHD: function(oField) {
							var sFieldId = getVHDFieldId(VHDFieldPrefix, oField, "-ok");
							return OpaBuilder.create(this)
								.hasId(sFieldId)
								.doPress()
								.description("Confirming value help selection for '" + oField.field + "'")
								.execute();
						},
						iEditDetailPage: function() {
							return OpaBuilder.create(this)
								.hasType("sap.m.Button")
								.has(OpaBuilder.Matchers.i18n("text", "sap.fe.i18n>OBJECT_PAGE_EDIT"))
								.doPress()
								.description("Start editing")
								.execute();
						},
						iDeleteItem: function() {
							return OpaBuilder.create(this)
								.hasType("sap.m.Button")
								.has(OpaBuilder.Matchers.i18n("text", "sap.fe.i18n>OBJECT_PAGE_DELETE"))
								.doPress()
								.description("Clicking the Delete button")
								.execute();
						},
						iConfirmDelete: function() {
							return OpaBuilder.create(this)
								.hasType("sap.m.Button")
								.isDialogElement()
								.hasProperties({ text: oResourceBundleTemplates.getText("OBJECT_PAGE_DELETE") })
								.doPress()
								.description("Delete dialog confirmed")
								.execute();
						},
						iCancelDialog: function() {
							return OpaBuilder.create(this)
								.hasType("sap.m.Button")
								.isDialogElement()
								.hasProperties({ text: oResourceBundleCore.getText("OBJECT_PAGE_CANCEL") })
								.doPress()
								.description("Clicking the Cancel button")
								.execute();
						},
						iCreateNewItemViaCreationRow: function(sNavProperty) {
							return OpaBuilder.create(this)
								.hasId(getTableId(sNavProperty) + "::CreationRow-inner")
								.doPress("applyBtn")
								.description("Create new Item")
								.execute();
						},
						iConfirmDialog: function() {
							return OpaBuilder.create(this)
								.hasType("sap.m.Button")
								.isDialogElement()
								.hasProperties({ text: oResourceBundleCore.getText("SAPFE_OK") })
								.doPress()
								.description("Clicking the Ok button")
								.execute();
						},
						iConfirmDialogWithButtonText: function(sText) {
							return OpaBuilder.create(this)
								.hasType("sap.m.Button")
								.isDialogElement()
								.hasProperties({ text: sText })
								.doPress()
								.description("Clicking the " + sText + "button")
								.execute();
						},
						iSaveChanges: function() {
							return OpaBuilder.create(this)
								.hasId("fe::save::" + sEntityPath)
								.doPress()
								.description("Saving document")
								.execute();
						},
						iCancelChanges: function() {
							return OpaBuilder.create(this)
								.hasId("fe::cancel::" + sEntityPath)
								.doPress()
								.description("Cancelling document")
								.execute();
						},
						iConfirmDiscardingChanges: function() {
							return OpaBuilder.create(this)
								.hasType("sap.m.Button")
								.isDialogElement()
								.hasProperties({ text: oResourceBundleCore.getText("SAPFE_DRAFT_DISCARD_BUTTON") })
								.doPress()
								.description("Confirming Discard changes")
								.execute();
						},
						iOpenSectionWithTitle: function(sName) {
							return OpaBuilder.create(this)
								.hasId(AnchorBarId)
								.has(FEBuilder.Matchers.aggregation("content", OpaBuilder.Matchers.properties({ text: sName })))
								.doPress()
								.description("Selecting section " + sName)
								.execute();
						},
						iSelectRowWithCellValue: function(sNavProperty, vColumn, sValue) {
							return this._iSelectRowWithCellValue(getTableId(sNavProperty), vColumn, sValue);
						},
						iOpenItemWithCellText: function(sNavProperty, vColumn, sText) {
							return this._iActOnRowWithCellValue(getTableId(sNavProperty), vColumn, sText);
						},
						iDeleteSelected: function(sNavProperty) {
							return this._iDeleteSelected(getTableId(sNavProperty));
						},
						iEditCellValueForRowWithCellValue: function(sNavProperty, vColumn, sExpectedValue, mInputs) {
							return this._iEditCellValueForRowWithCellValue(getTableId(sNavProperty), vColumn, sExpectedValue, mInputs);
						},
						iExecuteBoundAction: function(sNavProperty, sServiceName, sActionName) {
							return this._iExecuteBoundAction(getTableId(sNavProperty), sServiceName, sActionName);
						},
						iExecuteAction: function(sText) {
							return OpaBuilder.create(this)
								.hasType("sap.uxap.ObjectPageDynamicHeaderTitle")
								.doOnAggregation("actions", OpaBuilder.Matchers.properties({ text: sText }), OpaBuilder.Actions.press())
								.execute();
						},
						iApplyChanges: function() {
							return OpaBuilder.create(this)
								.hasId(OPFooterId)
								.doOnChildren(
									OpaBuilder.create(this)
										.hasType("sap.m.Button")
										.hasProperties({ text: oResourceBundleTemplates.getText("OBJECT_PAGE_APPLY_DRAFT") })
										.doPress()
										.description("Applying changes")
								)
								.execute();
						},
						iSwitchToNextItem: function() {
							return this._iSwitchItem(true);
						},
						iSwitchToPrevItem: function() {
							return this._iSwitchItem(false);
						},
						iOpenTableSettings: function(sNavigationPath) {
							return OpaBuilder.create(this)
								.hasId(getTableSettingsButtonId(sNavigationPath))
								.doPress()
								.description("Accessing table settings")
								.execute();
						},
						iAddColumnInTableSettings: function(sFieldName, vGroupName) {
							return this._iAddColumnInTableSettings(sFieldName, vGroupName);
						},
						iRemoveColumnInTableSettings: function(sFieldName, vGroupName) {
							return this._iModifyFilterInTableSettings(sFieldName, vGroupName, true, "Removing column");
						},
						iSortTableByColumn: function(sNavProperty, sColumn) {
							return this._iSortTableByColumn(getTableId(sNavProperty), sColumn);
						}
					},
					assertions: {
						iSeeDraftStateSaved: function() {
							return this._iSeeDraftState(DraftIndicatorState.Saved);
						},
						iSeeSelectedRowsInList: function(sNavProperty, iNumberOfRows) {
							return this._iSeeSelectedTableRows(getTableId(sNavProperty), iNumberOfRows);
						},
						iSeeDraftStateClear: function() {
							return this._iSeeDraftState(DraftIndicatorState.Clear);
						},
						_iSeeDraftState: function(sState) {
							return OpaBuilder.create(this)
								.hasType("sap.m.DraftIndicator")
								.hasProperties({ state: sState })
								.description("Draft Indicator is in " + sState + " state")
								.execute();
						},
						iSeeLinkWithText: function(sText) {
							return OpaBuilder.create(this)
								.hasType("sap.m.Link")
								.hasProperties({ text: sText })
								.description("Seeing link with text '" + sText + "'")
								.execute();
						},
						iSeeEditButton: function(oButtonState) {
							return this._iSeeButtonWithText(oResourceBundleTemplates.getText("OBJECT_PAGE_EDIT"), oButtonState);
						},
						iSeePageActionButton: function(sServiceName, sActionName, oButtonState) {
							return this._iSeeElement("fe::" + sServiceName + "." + sActionName + "::" + sEntityPath, oButtonState);
						},
						iSeeContactDetailsPopover: function() {
							return OpaBuilder.create(this)
								.hasType("sap.ui.mdc.link.ContactDetails")
								.description("Seeing Contact Details in ObjectPage header")
								.execute();
						},
						iSeeQuickViewPopover: function() {
							return OpaBuilder.create(this)
								.hasType("sap.m.ResponsivePopover")
								.description("Seeing Quick View Details in ObjectPage")
								.execute();
						},
						iSeeQuickViewMoreLinksButton: function() {
							return OpaBuilder.create(this)
								.isDialogElement(true)
								.hasType("sap.m.Button")
								.has(OpaBuilder.Matchers.resourceBundle("text", "sap.ui.mdc", "info.POPOVER_DEFINE_LINKS"))
								.description("The 'More Links' button found")
								.execute();
						},
						iSeeObjectPageInDisplayMode: function() {
							return this._iSeeObjectPageInMode(Page_EditMode.DISPLAY);
						},
						iSeeObjectPageInEditMode: function() {
							return this._iSeeObjectPageInMode(Page_EditMode.EDITABLE);
						},
						_iSeeObjectPageInMode: function(sMode) {
							return OpaBuilder.create(this)
								.hasId(ViewId)
								.viewId(null)
								.check(function(oObjectPage) {
									return oObjectPage.getModel("ui").getProperty("/editable") === sMode;
								})
								.description("Object Page is in mode '" + sMode + "'")
								.execute();
						},
						iSeeTable: function(sNavProperty) {
							return OpaBuilder.create(this)
								.hasId(getTableId(sNavProperty))
								.description("Seeing table '" + sNavProperty + "'")
								.execute();
						},
						iSeeTableRows: function(sNavProperty, iNumberOfRows) {
							return this._iSeeTableRows(getTableId(sNavProperty), iNumberOfRows);
						},
						iSeeValueSetInTable: function(sNavProperty, mValues, oRowState) {
							return this._iSeeTableRowWithCellValues(getTableId(sNavProperty), mValues, oRowState);
						},
						iSeeObjectPageTitle: function(sTitle) {
							return OpaBuilder.create(this)
								.hasType("sap.uxap.ObjectPageDynamicHeaderTitle")
								.doOnChildren(
									OpaBuilder.create(this)
										.hasType("sap.m.Title")
										.hasProperties({ text: sTitle })
								)
								.description("Seeing Object Page title '" + sTitle + "'")
								.execute();
						},
						iSeeHeaderContentWithItems: function(iNumberOfItems) {
							return OpaBuilder.create(this)
								.hasId("fe::op-OPHeaderContent")
								.has(function(oOPHeaderContent) {
									return oOPHeaderContent.getContent()[0].getItems().length === iNumberOfItems;
								})
								.description("Header Content has " + iNumberOfItems + " item(s)")
								.execute();
						},
						iSeeMicroChartAndUomLabel: function(sSuffix, sChartType, sLocation, sUomText) {
							var oOpaBuilder = OpaBuilder.create(this)
								.hasId(OPHeaderId + sSuffix)
								.hasType("sap.suite.ui.microchart." + sChartType + "MicroChart");

							if (sUomText !== null) {
								oOpaBuilder
									.hasAggregationProperties("_uomLabel", { text: sUomText })
									.description("Seeing MicroChart of type '" + sChartType + "' with label '" + sUomText + "'");
							} else {
								oOpaBuilder.description("Seeing MicroChart of type '" + sChartType + "'");
							}
							return oOpaBuilder.execute();
						},
						iSeeValueSetInStatus: function(oValue) {
							return OpaBuilder.create(this)
								.hasType("sap.m.ObjectStatus")
								.hasProperties({ text: oValue })
								.description("Seeing object status '" + oValue + "'")
								.execute();
						},
						iSeeValueForField: function(oField, vValue, vAdditionalValue, oElementState) {
							var aArguments = Utils.parseArguments([Object, [Array, String], String, Object], arguments),
								sFieldId = getFieldId(FormFieldPrefix, aArguments[0]);
							return FieldBuilder.create(this)
								.hasId(sFieldId)
								.hasState(aArguments[3])
								.hasValue(aArguments[1], aArguments[2])
								.description(
									Utils.formatMessage(
										"Seeing field '{0}' with value '{1}'",
										oField.field,
										[].concat(aArguments[1], aArguments[2] || [])
									)
								)
								.execute(this);
						},
						iSeeSectionWithTitle: function(sTitle) {
							return OpaBuilder.create(this)
								.hasType("sap.uxap.ObjectPageSection")
								.hasProperties({ title: sTitle })
								.description("Seeing section with title '" + sTitle + "'")
								.execute();
						},
						iSeeSubSectionWithTitle: function(sTitle) {
							return OpaBuilder.create(this)
								.hasType("sap.uxap.ObjectPageSubSection")
								.hasProperties({ title: sTitle })
								.description("Seeing sub-section with title '" + sTitle + "'")
								.execute();
						},
						iSeeSemanticLink: function(oField) {
							var sFieldId = getFieldId(FormFieldPrefix, oField);
							return OpaBuilder.create(this)
								.hasId(new RegExp(sFieldId))
								.hasType("sap.m.Link")
								.description("Seeing semantic link for field '" + oField.field + "'")
								.execute();
						},
						iSeeFlpLink: function(sDescription) {
							return OpaBuilder.create(this)
								.hasType("sap.ui.mdc.link.PanelListItem")
								.isDialogElement(true)
								.hasProperties({ text: sDescription })
								.description("FLP link with text '" + sDescription + "' is present")
								.execute();
						},
						iSeeSelectLinksDialog: function() {
							return OpaBuilder.create(this)
								.hasType("sap.m.Title")
								.isDialogElement(true)
								.has(OpaBuilder.Matchers.resourceBundle("text", "sap.ui.mdc", "info.SELECTION_DIALOG_TITLE"))
								.description("Seeing dialog open")
								.execute();
						},
						iDoNotSeeFlpLink: function(sDescription) {
							return OpaBuilder.create(this)
								.hasType("sap.ui.mdc.link.PanelListItem")
								.isDialogElement(true)
								.check(function(aPanels) {
									return !aPanels.some(function(oPanel) {
										return oPanel.getText() === sDescription;
									});
								}, true)
								.description("FLP link with text '" + sDescription + "' is not found")
								.execute();
						},
						iSeeVHD: function(oField) {
							var sDialogId = getVHDFieldId(VHDFieldPrefix, oField, "-dialog");
							return OpaBuilder.create(this)
								.hasId(sDialogId)
								.description("Seeing value help dialog for field '" + oField.field + "'")
								.execute();
						},
						iSeeVHDTable: function(oField) {
							var sVHDTableId = getVHDFieldId(VHDFieldPrefix, oField, "::Table");
							return OpaBuilder.create(this)
								.hasId(sVHDTableId)
								.hasAggregation("items")
								.description("Seeing filled value help dialog for field '" + oField.field + "'")
								.execute();
						},
						iSeeVHDFilterBar: function(oField) {
							var sVHDFilterBarId = getVHDFieldId(VHDFieldPrefix, oField, "::FilterBar");
							return OpaBuilder.create(this)
								.hasId(sVHDFilterBarId)
								.description("Seeing value help filterbar for field '" + oField.field + "'")
								.execute();
						},
						iSeeSaveConfirmation: function() {
							return this._iSeeTheMessageToast(oResourceBundleTemplates.getText("OBJECT_SAVED"));
						},
						iSeeDeleteConfirmation: function() {
							return this._iSeeTheMessageToast(oResourceBundleTemplates.getText("OBJECT_PAGE_DELETE_TOAST_SINGULAR"));
						},
						iSeeHeaderDeleteButtonIsVisible: function(bVisible) {
							bVisible = bVisible === undefined ? true : bVisible;
							return OpaBuilder.create(this)
								.hasType("sap.m.Button")
								.hasProperties({ text: oResourceBundleTemplates.getText("OBJECT_PAGE_DELETE"), visible: bVisible })
								.mustBeVisible(false)
								.has(function(oButton) {
									return (
										oButton
											.getParent()
											.getMetadata()
											.getName() === "sap.uxap.ObjectPageDynamicHeaderTitle"
									);
								})
								.description("Header Delete button is " + (bVisible ? "visible" : "invisible"))
								.execute();
						},
						iSeeTableDeleteButtonIsVisible: function(sNavProperty, bVisible) {
							bVisible = bVisible === undefined ? true : bVisible;
							return OpaBuilder.create(this)
								.hasId(getTableId(sNavProperty) + "::Delete")
								.hasProperties({ visible: bVisible })
								.mustBeVisible(false)
								.description("Table action button Delete is " + (bVisible ? "visible" : "invisible"))
								.execute();
						},
						iSeeTableActionButtonIsEnabled: function(sNavProperty, sServiceName, sActionName, bEnabled, bBoundAction) {
							return this._checkTableActionButtonEnablement(
								getTableId(sNavProperty),
								sServiceName,
								sActionName,
								bEnabled === undefined ? true : bEnabled,
								bBoundAction
							);
						},
						iSeeTableDeleteButtonIsEnabled: function(sNavProperty, bEnabled) {
							return this._checkTableActionButtonEnablement(
								getTableId(sNavProperty),
								"",
								"Delete",
								bEnabled === undefined ? true : bEnabled
							);
						},
						iSeePaginator: function() {
							return OpaBuilder.create(this)
								.hasId(PaginatorId)
								.description("Seeing paginator")
								.execute();
						},
						iSeePaginatorButtonDownIsEnabled: function(bEnabled) {
							return this._checkPaginatorButtonEnablement(true, bEnabled === undefined ? true : bEnabled);
						},
						iSeePaginatorButtonUpIsEnabled: function(bEnabled) {
							return this._checkPaginatorButtonEnablement(false, bEnabled === undefined ? true : bEnabled);
						},
						iCanAccessTableSettings: function(sNavigationPath) {
							return OpaBuilder.create(this)
								.hasId(getTableSettingsButtonId(sNavigationPath))
								.description("Table settings available")
								.execute();
						},
						iCanAccessColumnInTableSettings: function(sNavigationPath, sFieldName, vGroupName, bSelected) {
							return this._iCanAccessColumnInTableSettings(getTableId(sNavigationPath), sFieldName, vGroupName, bSelected);
						},
						iCannotAccessColumnInTableSettings: function(sNavigationPath, sFieldName, vGroupName) {
							return this._iCannotAccessColumnInTableSettings(getTableId(sNavigationPath), sFieldName, vGroupName);
						},
						iSeeColumnsInList: function(sNavigationPath, iNumberOfColumns) {
							return OpaBuilder.create(this)
								.hasId(getTableId(sNavigationPath))
								.hasAggregationLength("columns", iNumberOfColumns)
								.description("Seeing table with " + iNumberOfColumns + " columns")
								.execute();
						},
						iSeeApplyButton: function() {
							return OpaBuilder.create(this)
								.hasId(OPFooterId)
								.doOnChildren(
									OpaBuilder.create(this)
										.hasType("sap.m.Button")
										.hasProperties({ text: oResourceBundleTemplates.getText("OBJECT_PAGE_APPLY_DRAFT") })
										.description("Apply button is visible in footer")
								)
								.execute();
						},
						iSeeSortedColumn: function(sNavProperty, sColumnName) {
							return this._iSeeSortedColumn(getTableId(sNavProperty), sColumnName, "sortOrder");
						},
						iSeeTableP13nMode: function(sNavProperty, sMode) {
							return this._iSeeTableP13nMode(getTableId(sNavProperty), sMode);
						},
						iSeeConfirmMessageBoxWithTitle: function(sTitle) {
							return OpaBuilder.create(this)
								.hasType("sap.m.Dialog")
								.isDialogElement(true)
								.hasProperties({ title: sTitle })
								.description("Seeing Message dialog open")
								.execute();
						}
					}
				});
			}
		};
	}
);
