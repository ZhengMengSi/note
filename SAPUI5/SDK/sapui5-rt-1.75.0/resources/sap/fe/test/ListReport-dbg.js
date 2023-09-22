sap.ui.define(
	[
		"sap/fe/test/Utils",
		"./TemplatePage",
		"sap/ui/test/Opa5",
		"sap/ui/test/OpaBuilder",
		"sap/fe/macros/filter/EditState",
		"sap/fe/test/builder/FilterBarBuilder"
	],
	function(Utils, TemplatePage, Opa5, OpaBuilder, EditState, FilterBarBuilder) {
		"use strict";
		// In higher scope as the method is invoked by both actions and assertions.
		function _getFilterColumnBuilder(sFieldName, vGroupName, bIsSelected, vAdditionalMatchers) {
			var oFilterColumnMatcher = OpaBuilder.Matchers.aggregationMatcher("items", function(oControl) {
				var bControlFound = false;
				if (oControl.getItems) {
					var items = oControl.getItems();
					if (items && items.length === 2) {
						bControlFound = items[0].getProperty("text") === sFieldName;
						if (vGroupName !== undefined) {
							if (!Array.isArray(vGroupName)) {
								vGroupName = [vGroupName];
							}
							vGroupName = vGroupName.join(" > ");
							bControlFound = bControlFound && items[1].getProperty("text") === vGroupName;
						}
					}
				}
				return bControlFound;
			});
			return OpaBuilder.create()
				.hasType("sap.m.ColumnListItem")
				.isDialogElement()
				.hasProperties({ selected: bIsSelected })
				.hasAggregation("cells", vAdditionalMatchers ? [oFilterColumnMatcher, vAdditionalMatchers] : oFilterColumnMatcher);
		}

		return {
			create: function(sAppId, sComponentId, sEntityPath) {
				var ViewId = sAppId + "::" + sComponentId,
					TableId = "fe::table::" + sEntityPath + "::LineItem",
					FilterBarId = "fe::fb::" + sEntityPath,
					FilterBarVHDId = FilterBarId + "::FFVH::",
					TableSettingsButtonId = TableId + "-settings",
					AdaptFiltersButtonId = FilterBarId + "-btnAdapt",
					oResourceBundleCore = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core"),
					oResourceBundleTemplates = sap.ui.getCore().getLibraryResourceBundle("sap.fe.templates");

				return Utils.mergeObjects(TemplatePage.create(ViewId, sEntityPath), {
					actions: {
						iSelectEditingStatusAll: function(bSuppressApplyFiltersToList) {
							return this.iFilter("UI::EditingStatus", EditState.ALL.display, bSuppressApplyFiltersToList);
						},
						iSelectEditingStatusOwnDraft: function(bSuppressApplyFiltersToList) {
							return this.iFilter("UI::EditingStatus", EditState.OWN_DRAFT.display, bSuppressApplyFiltersToList);
						},
						iSelectEditingStatusUnchanged: function(bSuppressApplyFiltersToList) {
							return this.iFilter("UI::EditingStatus", EditState.UNCHANGED.display, bSuppressApplyFiltersToList);
						},
						iApplyFiltersToList: function() {
							return OpaBuilder.create(this)
								.hasId(FilterBarId + "-btnSearch")
								.doPress()
								.description("Pressing Go Button")
								.execute();
						},
						iSearchFor: function(sText, bSuppressApplyFiltersToList) {
							var oResult = OpaBuilder.create(this)
								.hasId(FilterBarId)
								.doOnChildren(
									OpaBuilder.create(this)
										.hasType("sap.m.SearchField")
										.doEnterText(sText, true)
								)
								.description("Searching for '" + sText + "'")
								.execute();

							if (!bSuppressApplyFiltersToList) {
								oResult = this.iApplyFiltersToList();
							}
							return oResult;
						},
						iClearFilter: function(sFieldName, bSuppressApplyFiltersToList) {
							var oResult = OpaBuilder.create(this)
								.hasId(FilterBarId + "::FF::" + sFieldName)
								.doEnterText("", true)
								.doOnChildren(
									OpaBuilder.create(this)
										.hasType("sap.ui.core.Icon")
										.hasProperties({ src: "sap-icon://decline" })
										.doPress()
								)
								.description("Clearing filter '" + sFieldName + "'")
								.execute();

							if (!bSuppressApplyFiltersToList) {
								oResult = this.iApplyFiltersToList();
							}
							return oResult;
						},
						iFilter: function(sFieldName, vValue, bSuppressApplyFiltersToList) {
							var oResult = OpaBuilder.create(this)
								.hasId(FilterBarId + "::FF::" + sFieldName)
								.doEnterText(vValue, true)
								.description("Filtering '" + sFieldName + "' for '" + vValue + "'")
								.execute();

							if (!bSuppressApplyFiltersToList) {
								oResult = this.iApplyFiltersToList();
							}
							return oResult;
						},
						iSelectAll: function() {
							return OpaBuilder.create(this)
								.hasId(TableId + "-innerTable-sa")
								.doPress()
								.description("Selecting all rows")
								.execute();
						},
						iSelectRowWithCellValue: function(vColumn, sValue) {
							return this._iSelectRowWithCellValue(TableId, vColumn, sValue);
						},
						iDeleteSelected: function() {
							return this._iDeleteSelected(TableId);
						},
						iOpenListReportItem: function(sPath) {
							return OpaBuilder.create(this)
								.hasType("sap.m.ColumnListItem")
								.has(OpaBuilder.Matchers.bindingPath(sPath))
								.doPress()
								.description("Open item with path '" + sPath + "'")
								.execute();
						},
						iOpenListReportItemWithCellText: function(vColumn, sText) {
							return this._iActOnRowWithCellValue(TableId, vColumn, sText);
						},
						iExecuteActionOnDialog: function(sText) {
							return OpaBuilder.create(this)
								.hasType("sap.m.Button")
								.hasProperties({ text: sText })
								.isDialogElement()
								.doPress()
								.description("Pressing dialog button '" + sText + "'")
								.execute();
						},
						iCreateNewItem: function() {
							return OpaBuilder.create(this)
								.hasId(TableId + "::Create")
								.doPress()
								.description("Creating new item")
								.execute();
						},
						iExecuteUnboundAction: function(sServiceName, sActionName) {
							return OpaBuilder.create(this)
								.hasId(TableId + "::" + sServiceName + "::" + sActionName)
								.doPress()
								.description("Executing unbound action '" + sServiceName + "." + sActionName + "'")
								.execute();
						},
						iOpenTableSettings: function() {
							return OpaBuilder.create(this)
								.hasId(TableSettingsButtonId)
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
						iOpenFilterSettings: function() {
							return OpaBuilder.create(this)
								.hasId(AdaptFiltersButtonId)
								.doPress()
								.description("Accessing adapt filters")
								.execute();
						},
						_iModifyFilterInFilterSettings: function(sFieldName, vGroupName, bIsSelected, sDescription) {
							return _getFilterColumnBuilder(sFieldName, vGroupName, bIsSelected)
								.doOnChildren(
									OpaBuilder.create(this)
										.hasType("sap.m.CheckBox")
										.doPress()
								)
								.description(sDescription + " '" + sFieldName + "' in '" + vGroupName + "' group")
								.execute(this);
						},
						iAddFilterInFilterSettings: function(sFieldName, vGroupName) {
							return this._iModifyFilterInFilterSettings(sFieldName, vGroupName, false, "Adding filter");
						},
						iRemoveFilterInFilterSettings: function(sFieldName, vGroupName) {
							return this._iModifyFilterInFilterSettings(sFieldName, vGroupName, true, "Removing filter");
						},
						iOpenVHDialog: function(sFieldName) {
							return OpaBuilder.create(this)
								.hasId(FilterBarId + "::FF::" + sFieldName + "-inner-vhi")
								.doPress()
								.description("Opening value help for dialog'" + sFieldName + "'")
								.execute();
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
						iConfirmVHDSelection: function(sFieldName, bSuppressApplyFiltersToList) {
							var oResult = OpaBuilder.create(this)
								.hasId(FilterBarVHDId + sFieldName + "-ok")
								.doPress()
								.description("Confirming value help selection for '" + sFieldName + "'")
								.execute();
							if (!bSuppressApplyFiltersToList) {
								oResult = this.iApplyFiltersToList();
							}
							return oResult;
						},
						iFilterWithVHDialog: function(sFieldName, vValue) {
							var oResult = this.iOpenVHDialog(sFieldName)
								.and.iSelectFromVHDTable(vValue)
								.and.iConfirmVHDSelection(sFieldName);
							return oResult;
						},
						iExecuteBoundAction: function(sServiceName, sActionName) {
							return this._iExecuteBoundAction(TableId, sServiceName, sActionName);
						},
						iPressKeyboardShortcutOnTable: function(sShortcut) {
							return this._iPressKeyboardShortcut(TableId, sShortcut);
						},
						iPressKeyboardShortcutOnFilter: function(sShortcut) {
							return this._iPressKeyboardShortcut(FilterBarId, sShortcut);
						},
						iSortTableByColumn: function(sColumn) {
							return this._iSortTableByColumn(TableId, sColumn);
						}
					},
					assertions: {
						iSeeRowsInList: function(iNumberOfRows) {
							return this._iSeeTableRows(TableId, iNumberOfRows);
						},
						iSeeRowWithValueSetInList: function(mValues, oRowState) {
							return this._iSeeTableRowWithCellValues(TableId, mValues, oRowState);
						},
						iSeeSelectedRowsInList: function(iNumberOfRows) {
							return this._iSeeSelectedTableRows(TableId, iNumberOfRows);
						},
						iSeeColumnsInList: function(iNumberOfColumns) {
							return OpaBuilder.create(this)
								.hasId(TableId)
								.hasAggregationLength("columns", iNumberOfColumns)
								.description("Seeing table with " + iNumberOfColumns + " columns")
								.execute();
						},
						iCanAccessTableSettings: function() {
							return OpaBuilder.create(this)
								.hasId(TableSettingsButtonId)
								.description("Table settings available")
								.execute();
						},
						iCanAccessColumnInTableSettings: function(sFieldName, vGroupName, bSelected) {
							return this._iCanAccessColumnInTableSettings(TableId, sFieldName, vGroupName, bSelected);
						},
						iCanAccessColumnInFilterSettings: function(sFieldName, vGroupName, bIsSelected) {
							return OpaBuilder.create(this)
								.hasId(AdaptFiltersButtonId)
								.do(_getFilterColumnBuilder(sFieldName, vGroupName, bIsSelected))
								.description("Property '" + sFieldName + "' is available in filter settings")
								.execute();
						},
						iSeeHiddenFilterField: function(sFieldName, vGroupName) {
							var oIconMatcher = OpaBuilder.Matchers.properties({ src: "sap-icon://filter", visible: true });
							return _getFilterColumnBuilder(
								sFieldName,
								vGroupName,
								false,
								OpaBuilder.Matchers.aggregationMatcher("items", oIconMatcher)
							)
								.description("Seeing hidden filter '" + sFieldName + "' in '" + vGroupName + "' group")
								.execute(this);
						},
						iSeeFilterBar: function() {
							return OpaBuilder.create(this)
								.hasId(FilterBarId)
								.description("Seeing the filter bar")
								.execute();
						},
						iSeeFilterApplyButton: function() {
							return OpaBuilder.create(this)
								.hasId(FilterBarId + "-btnSearch")
								.description("Seeing the filter bar go button")
								.execute();
						},
						iSeeListReportTable: function() {
							return OpaBuilder.create(this)
								.hasId(TableId)
								.description("Seeing the report table")
								.execute();
						},
						iSeeTheMessageToast: function(sText) {
							return this._iSeeTheMessageToast(sText);
						},
						iSeeValueSetInTable: function(iIndex, sExpectedValue) {
							return OpaBuilder.create(this)
								.hasType("sap.m.ColumnListItem")
								.has(function(aRows) {
									var oField = aRows.getCells()[iIndex],
										sValue;
									if (oField.getId().indexOf("vbox") > -1) {
										//for links in the table
										sValue = oField.getItems()[0].getValue();
									} else {
										sValue = oField.getValue();
									}
									return sValue === sExpectedValue;
								})
								.description("The value is '" + sExpectedValue + "' for the field with index " + iIndex)
								.execute();
						},
						iCheckRatingIndicatorIsVisible: function(nRatingValue) {
							return OpaBuilder.create(this)
								.hasType("sap.m.RatingIndicator")
								.hasProperties({ value: nRatingValue })
								.description("Rating Indicator is visible")
								.execute();
						},
						iCheckDataFieldWithTextIsVisible: function(sText) {
							return OpaBuilder.create(this)
								.hasType("sap.m.ObjectStatus")
								.hasProperties({ text: sText })
								.description("DataField with text '" + sText + "' is visible")
								.execute();
						},
						iCheckContactCardWithLinkTextIsVisible: function(sText) {
							return OpaBuilder.create(this)
								.hasType("sap.m.Link")
								.hasProperties({ text: sText })
								.description("Contact card with text '" + sText + "' is visible")
								.execute();
						},
						iCheckTableCellIsHidden: function(sPath, nCellPos, oValue) {
							return OpaBuilder.create(this)
								.hasType("sap.m.ColumnListItem")
								.has(OpaBuilder.Matchers.bindingPath(sPath))
								.has(function(row) {
									var cell = row.getCells()[nCellPos];
									return cell.getVisible() === false;
								})
								.description("The DataField within a table cell with " + oValue + " value is hidden")
								.execute();
						},
						iSeeCreateButton: function(oElementState) {
							return this._iSeeElement(TableId + "::Create", oElementState);
						},
						iSeeFilterFieldsInFilterBar: function(iNumberOfFilterFields) {
							return OpaBuilder.create(this)
								.hasId(FilterBarId)
								.hasAggregationLength("filterItems", iNumberOfFilterFields)
								.description("Seeing Filter bar with " + iNumberOfFilterFields + " filter fields")
								.execute();
						},
						iSeeEditingStatusFilter: function(mState) {
							return FilterBarBuilder.create(this)
								.hasId(FilterBarId)
								.hasEditingStatus(null, mState)
								.description(Utils.formatMessage("Seeing Editing Status filter with state {0}", mState))
								.execute();
						},
						iSeeFilterField: function(sFieldName) {
							if (sFieldName.indexOf("/") === 0) {
								sFieldName = sFieldName.substring(1);
							}
							sFieldName = sFieldName.replace(/\//g, "::");

							return OpaBuilder.create(this)
								.hasId(FilterBarId + "::FF::" + sFieldName)
								.description("Seeing filter input for '" + sFieldName + "'")
								.execute();
						},
						iSeeFilterDefined: function(sFieldName, sText) {
							return OpaBuilder.create(this)
								.hasId(FilterBarId + "::FF::" + sFieldName + "-inner")
								.hasAggregationProperties("tokens", { text: sText })
								.description("Seeing filter for '" + sFieldName + "' set to '" + sText + "'")
								.execute();
						},
						iSeeVHDialog: function(sFieldName) {
							return OpaBuilder.create(this)
								.hasId(FilterBarVHDId + sFieldName + "-dialog")
								.description("Seeing value help dialog for field '" + sFieldName + "'")
								.execute();
						},
						iSeeVHDTable: function(sFieldName) {
							return OpaBuilder.create(this)
								.hasId(FilterBarVHDId + sFieldName + "::Table")
								.has(function(oTable) {
									return oTable.getItems().length !== 0;
								})
								.description("Seeing table of value help dialog for field '" + sFieldName + "'")
								.execute();
						},
						_checkVHDSearchFieldIsVisible: function(sFieldName, bVisible) {
							var sSearchFieldId = ViewId + "--" + FilterBarVHDId + sFieldName + "-VHP--SearchField";
							return OpaBuilder.create(this)
								.hasId(sSearchFieldId)
								.hasProperties({ visible: bVisible })
								.mustBeVisible(false)
								.description(
									"Search field of value help dialog for field '" +
										sFieldName +
										"' is " +
										(bVisible ? "visible" : "invisible")
								)
								.execute();
						},
						iCheckVHDSearchFieldIsVisible: function(sFieldName, bVisible) {
							return this._checkVHDSearchFieldIsVisible(sFieldName, bVisible === undefined ? true : bVisible);
						},
						iSeeVHDFilterBar: function(sFieldName) {
							return OpaBuilder.create(this)
								.hasId(FilterBarVHDId + sFieldName + "::FilterBar")
								.description("Seeing value help filterbar for field '" + sFieldName + "'")
								.execute();
						},
						iSeeFieldOfDCPOnVHDialog: function(sFieldName) {
							return OpaBuilder.create(this)
								.hasId(FilterBarVHDId + sFieldName + "-DCP")
								.description("Definition Condition Panel is available in Value Help of field '" + sFieldName + "'")
								.execute();
						},
						iSeeDeleteConfirmation: function() {
							return this._iSeeTheMessageToast(oResourceBundleTemplates.getText("OBJECT_PAGE_DELETE_TOAST_SINGULAR"));
						},
						iSeeEditingStatusDropdown: function() {
							return this.iSeeFilterField("UI::EditingStatus");
						},
						iSeePageTitle: function(sTitle) {
							return OpaBuilder.create(this)
								.hasType("sap.f.DynamicPageTitle")
								.hasAggregationProperties("heading", { text: sTitle })
								.description("Seeing title '" + sTitle + "'")
								.execute();
						},
						iSeeVariantTitle: function(sTitle) {
							return OpaBuilder.create(this)
								.hasType("sap.m.Title")
								.hasId("fe::lr::vm-text")
								.hasProperties({ text: sTitle })
								.description("Seeing variant title '" + sTitle + "'")
								.execute();
						},
						iSeeVariantModified: function(bIsModified) {
							var sLabelId = "fe::lr::vm-modified";
							bIsModified = bIsModified === undefined ? true : bIsModified;
							if (bIsModified) {
								return OpaBuilder.create(this)
									.hasType("sap.m.Label")
									.hasId(sLabelId)
									.hasProperties({ text: "*" })
									.description("Seeing variant state as 'modified'")
									.execute();
							} else {
								return OpaBuilder.create(this)
									.hasType("sap.m.Label")
									.check(function(oLabels) {
										return !oLabels.some(function(oLabel) {
											return oLabel.getId() === sLabelId;
										});
									}, true)
									.description("Seeing variant state as 'not modified'")
									.execute();
							}
						},
						iSeePageVM: function() {
							return OpaBuilder.create(this)
								.hasType("sap.f.DynamicPageTitle")
								.hasAggregation("heading", function(oControl) {
									return oControl.getMetadata().getName() === "sap.ui.fl.variants.VariantManagement";
								})
								.description("Seeing page level VM")
								.execute();
						},
						iSeeTableActionButtonIsEnabled: function(sServiceName, sActionName, bEnabled, bBoundAction) {
							return this._checkTableActionButtonEnablement(
								TableId,
								sServiceName,
								sActionName,
								bEnabled === undefined ? true : bEnabled,
								bBoundAction
							);
						},
						iSeeTableDeleteButtonIsEnabled: function(bEnabled) {
							return this._checkTableActionButtonEnablement(TableId, "", "Delete", bEnabled === undefined ? true : bEnabled);
						},
						iSeeDraftIndicator: function() {
							return OpaBuilder.create(this)
								.hasType("sap.m.Link")
								.hasProperties({ text: oResourceBundleCore.getText("DRAFTINFO_DRAFT_OBJECT") })
								.description("Draft indicator is visible")
								.execute();
						},
						iSeeSortedColumn: function(sColumnName) {
							return this._iSeeSortedColumn(TableId, sColumnName, "sortIndicator");
						},
						iSeeTableP13nMode: function(sMode) {
							return this._iSeeTableP13nMode(TableId, sMode);
						}
					}
				});
			}
		};
	}
);
