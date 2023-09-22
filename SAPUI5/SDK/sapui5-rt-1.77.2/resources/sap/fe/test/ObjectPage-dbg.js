sap.ui.define(
	[
		"sap/base/util/merge",
		"./TemplatePage",
		"sap/ui/test/OpaBuilder",
		"sap/ui/test/Opa5",
		"sap/fe/test/Utils",
		"sap/fe/test/builder/FEBuilder",
		"sap/fe/test/builder/FieldBuilder",
		"sap/fe/test/builder/OverflowToolbarBuilder",
		"sap/fe/test/api/FooterAssertions",
		"sap/fe/test/api/FooterActions"
	],
	function(
		mergeObjects,
		TemplatePage,
		OpaBuilder,
		Opa5,
		Utils,
		FEBuilder,
		FieldBuilder,
		OverflowToolbarBuilder,
		FooterAssertions,
		FooterActions
	) {
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

		function _getOverflowToolbarBuilder(vOpaInstance, vFooterIdentifier) {
			return OverflowToolbarBuilder.create(vOpaInstance).hasId(vFooterIdentifier.id);
		}

		return {
			create: function(sAppId, sComponentId, sEntityPath) {
				var ViewId = sAppId + "::" + sComponentId,
					FormFieldPrefix = "F::fe::form::" + sEntityPath,
					VHDFieldPrefix = "fe::form::" + sEntityPath,
					OPHeaderId = "fe::OPHeaderContent",
					OPHeaderContentId = "fe::op-OPHeaderContent",
					OPFooterId = "fe::op::footer::" + sEntityPath,
					BreadCrumbId = ViewId + "--breadcrumbs",
					AnchorBarId = "fe::op-anchBar",
					PaginatorId = "fe::paginator",
					Page_EditMode = {
						DISPLAY: "Display",
						EDITABLE: "Editable"
					},
					oResourceBundleTemplates = sap.ui.getCore().getLibraryResourceBundle("sap.fe.templates"),
					oResourceBundleCore = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");

				return mergeObjects(TemplatePage.create(ViewId, sEntityPath), {
					actions: {
						onTable: function(vTableIdentifier) {
							if (!Utils.isOfType(vTableIdentifier, String)) {
								vTableIdentifier = { id: getTableId(vTableIdentifier.property) };
							}
							return this._onTable(vTableIdentifier);
						},
						onFooter: function() {
							return new FooterActions(
								_getOverflowToolbarBuilder(this, { id: OPFooterId }),
								{
									id: OPFooterId
								},
								sEntityPath
							);
						},
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
						iNavigateToBreadCrumbLink: function(sLink) {
							return (
								OpaBuilder.create(this)
									.hasId(BreadCrumbId)
									.doOnChildren(
										OpaBuilder.create(this)
											.hasType("sap.m.Link")
											.hasProperties({ text: sLink })
											.checkNumberOfMatches(1)
											.doPress()
											.error("Cannot find Bread Crumb Link " + sLink)
									)
									//.description("Navigating back through Bread Crumb " + sLink)
									.do(function() {
										Opa5.assert.ok(true, "Navigating back through Bread Crumb Link " + sLink);
									})
									.execute()
							);
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
								.hasType("sap.m.ColumnListItem")
								.hasAggregationProperties("cells", { text: sText })
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
						iPressKeyboardShortcutOnSection: function(sShortcut, mProperties) {
							return this._iPressKeyboardShortcut(undefined, sShortcut, mProperties, "sap.uxap.ObjectPageSection");
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
						iCancelDialog: function() {
							return OpaBuilder.create(this)
								.hasType("sap.m.Button")
								.isDialogElement()
								.hasProperties({ text: oResourceBundleCore.getText("OBJECT_PAGE_CANCEL") })
								.doPress()
								.description("Clicking the Cancel button")
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
						iOpenSectionWithTitle: function(sName) {
							return OpaBuilder.create(this)
								.hasId(AnchorBarId)
								.has(OpaBuilder.Matchers.aggregation("content", OpaBuilder.Matchers.properties({ text: sName })))
								.doPress()
								.description("Selecting section " + sName)
								.execute();
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
						iSortTableByColumn: function(sNavProperty, sColumn) {
							return this._iSortTableByColumn(getTableId(sNavProperty), sColumn);
						},
						iClickOnRelatedAppButton: function() {
							return OpaBuilder.create(this)
								.hasType("sap.m.Button")
								.hasProperties({ text: oResourceBundleTemplates.getText("OBJECT_PAGE_REALATED_APPS") })
								.doPress()
								.description("Clicking on Related Apps Button")
								.execute();
						},
						iClickCreateButton: function() {
							return OpaBuilder.create(this)
								.isDialogElement()
								.hasType("sap.m.Button")
								.has(OpaBuilder.Matchers.resourceBundle("text", "sap.fe.core", "SAPFE_ACTION_CREATE"))
								.doPress()
								.description("Pressing Create button on sticky creation dialog.")
								.execute();
						}
					},
					assertions: {
						onTable: function(vTableIdentifier) {
							if (!Utils.isOfType(vTableIdentifier, String)) {
								vTableIdentifier = { id: getTableId(vTableIdentifier.property) };
							}
							return this._onTable(vTableIdentifier);
						},
						onFooter: function() {
							return new FooterAssertions(_getOverflowToolbarBuilder(this, { id: OPFooterId }), { id: OPFooterId });
						},
						iSeeLinkWithText: function(sText) {
							return OpaBuilder.create(this)
								.hasType("sap.m.Link")
								.hasProperties({ text: sText })
								.description("Seeing link with text '" + sText + "'")
								.execute();
						},
						iSeeBreadCrumb: function(sLinks, oBreadCrumbState) {
							return this._iSeeBreadCrumb(BreadCrumbId, sLinks, oBreadCrumbState);
						},
						iSeeEditButton: function(oButtonState) {
							return this._iSeeButtonWithText(oResourceBundleCore.getText("OBJECT_PAGE_EDIT"), oButtonState);
						},
						iSeePageActionButton: function(sServiceName, sActionName, oButtonState) {
							return this._iSeeElement("fe::" + sServiceName + "." + sActionName + "::" + sEntityPath, oButtonState);
						},
						iSeeFacetActionButton: function(sFieldGroupName, sActionName, oButtonState) {
							return this._iSeeElement(
								"fe::fab::com.sap.vocabularies.UI.v1.FieldGroup::" + sFieldGroupName + "::" + sActionName,
								oButtonState
							);
						},
						iSeeContactDetailsPopover: function(sTitle) {
							return (
								OpaBuilder.create(this)
									.hasType("sap.ui.mdc.link.Panel")
									// .hasAggregation("items", [
									// 	function(oItem) {
									// 		return oItem instanceof sap.m.Label;
									// 	},
									// 	{
									// 		properties: {
									// 			text: sTitle
									// 		}
									// 	}
									// ])
									.description("Contact card with title '" + sTitle + "' is present")
									.execute()
							);
						},
						iSeeQuickViewPopover: function() {
							return OpaBuilder.create(this)
								.hasType("sap.ui.mdc.link.Panel")
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
								.has(function(oObjectPage) {
									return oObjectPage.getModel("ui").getProperty("/editable") === sMode;
								})
								.description("Object Page is in mode '" + sMode + "'")
								.execute();
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
								.hasId(OPHeaderContentId)
								.has(function(oOPHeaderContent) {
									return oOPHeaderContent.getContent()[0].getItems().length === iNumberOfItems;
								})
								.description("Header Content has " + iNumberOfItems + " item(s)")
								.execute();
						},
						iSeeHeaderDataPoint: function(sTitle, sValue) {
							return OpaBuilder.create(this)
								.hasId(OPHeaderContentId)
								.doOnChildren(
									OpaBuilder.create(this)
										.hasType("sap.m.ObjectNumber")
										// TODO non breaking space is used, so it needs to be covered - is this a default behavior?
										.hasProperties({ number: sValue.replace(/ /g, String.fromCharCode(160)) })
										.has(function(oObjectNumber) {
											return oObjectNumber.getParent();
										})
										.hasAggregationProperties("items", { text: sTitle })
								)
								.description(Utils.formatMessage("Seeing header data point '{0}' with value '{1}'", sTitle, sValue))
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
								.has(OpaBuilder.Matchers.resourceBundle("text", "sap.ui.mdc", "info.SELECTION_DIALOG_ALIGNEDTITLE"))
								.description("Seeing dialog open")
								.execute();
						},
						iDoNotSeeFlpLink: function(sDescription) {
							return OpaBuilder.create(this)
								.hasType("sap.m.Link")
								.isDialogElement(true)
								.check(function(links) {
									var bFound = links.some(function(link) {
										return link.getText() === sDescription;
									});
									return bFound === false;
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
							return this._iSeeTheMessageToast(oResourceBundleCore.getText("OBJECT_SAVED"));
						},
						iSeeDeleteConfirmation: function() {
							return this._iSeeTheMessageToast(oResourceBundleCore.getText("OBJECT_PAGE_DELETE_TOAST_SINGULAR"));
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
						iSeeSortedColumn: function(sNavProperty, sColumnName, sProperty) {
							return this._iSeeSortedColumn(getTableId(sNavProperty), sColumnName, sProperty || "sortOrder");
						},
						iSeeTableP13nMode: function(sNavProperty, sMode) {
							return this._iSeeControlsP13nMode(getTableId(sNavProperty), sMode);
						},
						iSeeConfirmMessageBoxWithTitle: function(sTitle) {
							return OpaBuilder.create(this)
								.hasType("sap.m.Dialog")
								.isDialogElement(true)
								.hasProperties({ title: sTitle })
								.description("Seeing Message dialog open")
								.execute();
						},
						iSeeExportExcelOptions: function(sNavProperty) {
							return this._iSeeExportExcelOptions(getTableId(sNavProperty));
						},
						iDoNotSeeExportExcelOptions: function(sNavProperty) {
							return this._iDoNotSeeExportExcelOptions(getTableId(sNavProperty));
						},
						iSeeFieldPropertyInTable: function(sNavProperty, mValues, oRowState) {
							return this._iSeeTableRowWithCellProperty(getTableId(sNavProperty), mValues, oRowState);
						},
						iSeeRelatedAppsDropdown: function(appCount) {
							return OpaBuilder.create(this)
								.hasType("sap.ui.unified.Menu")
								.isDialogElement()
								.hasProperties({ visible: true })
								.hasAggregationLength("items", appCount)
								.description("Seeing Related Apps dropdown with '{0}' entries ", appCount)
								.execute();
						}
					}
				});
			}
		};
	}
);
