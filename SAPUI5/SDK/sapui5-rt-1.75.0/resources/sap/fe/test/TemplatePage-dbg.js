sap.ui.define(
	[
		"sap/ui/test/OpaBuilder",
		"sap/ui/test/Opa5",
		"sap/ui/table/library",
		"sap/ui/core/util/ShortcutHelper",
		"sap/fe/test/Utils",
		"sap/fe/test/builder/FEBuilder",
		"sap/fe/test/builder/FieldBuilder",
		"sap/fe/test/builder/TableBuilder"
	],
	function(OpaBuilder, Opa5, GridTableLibrary, ShortcutHelper, Utils, FEBuilder, FieldBuilder, TableBuilder) {
		"use strict";
		var RowActionType = GridTableLibrary.RowActionType;

		function _getLegacyRowMatcher(vRowMatcher, vValue) {
			if (arguments.length === 2) {
				var mPropertyValueMap = {};
				mPropertyValueMap[vRowMatcher] = vValue;
				return mPropertyValueMap;
			}
			return vRowMatcher;
		}

		// TODO the following two functions should reside in TableBuilder
		function getRowNavigationIconOnGridTable(oRow) {
			var oRowAction = oRow.getRowAction();
			return oRowAction.getItems().reduce(function(oIcon, oActionItem, iIndex) {
				if (!oIcon && oActionItem.getType() === RowActionType.Navigation) {
					oIcon = oRowAction.getAggregation("_icons")[iIndex];
				}
				return oIcon;
			}, null);
		}

		// TODO here the rowState is misused to check the navigation icon
		// Create Matchers array according to the expected state of the row
		function getStateRowMatchers(oState) {
			return function(oRow) {
				return FEBuilder.Matchers.states(oState)(
					oRow.getMetadata().getName() === "sap.ui.table.Row" ? getRowNavigationIconOnGridTable(oRow) : oRow
				);
			};
		}

		function getTableSettingsButtonId(sTableId) {
			return sTableId + "-settings";
		}

		function _getTableSettingsColumnBuilder(sFieldName, vGroupName) {
			return OpaBuilder.Matchers.aggregationMatcher("cells", function(oControl) {
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
		}

		return {
			create: function(sViewId, sEntityPath) {
				var oResourceBundleTemplates = sap.ui.getCore().getLibraryResourceBundle("sap.fe.templates"),
					oResourceBundleCore = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");

				return {
					viewId: sViewId,
					actions: {
						_iSelectRowWithCellValue: function(sTableId, vRowMatcher, vValue) {
							vRowMatcher = _getLegacyRowMatcher(vRowMatcher, vValue);
							return TableBuilder.create(this)
								.hasId(sTableId)
								.doSelect(vRowMatcher)
								.description(Utils.formatMessage("Selecting row(s) on table '{0}' having '{1}'", sTableId, vRowMatcher))
								.execute(this);
						},
						_iActOnRowWithCellValue: function(sTableId, vRowMatcher, vValue) {
							vRowMatcher = _getLegacyRowMatcher(vRowMatcher, vValue);
							return TableBuilder.create(this)
								.hasId(sTableId)
								.doNavigate(vRowMatcher)
								.description(Utils.formatMessage("Pressing row on table '{0}' having '{1}'", sTableId, vRowMatcher))
								.execute(this);
						},
						_iEditCellValueForRowWithCellValue: function(sTableId, vRowMatcher, vValue, mInputs) {
							if (arguments.length === 4) {
								vRowMatcher = _getLegacyRowMatcher(vRowMatcher, vValue);
							} else {
								mInputs = vValue;
								vValue = undefined;
							}
							return TableBuilder.create(this)
								.hasId(sTableId)
								.doEditValues(vRowMatcher, mInputs)
								.description(
									Utils.formatMessage(
										"Editing table '{0}' setting values '{1}' for row(s) having '{2}'",
										sTableId,
										mInputs,
										vRowMatcher
									)
								)
								.execute(this);
						},
						iCloseMessageErrorDialog: function() {
							return OpaBuilder.create(this)
								.isDialogElement()
								.hasType("sap.m.Bar")
								.hasAggregation("contentMiddle", OpaBuilder.Matchers.resourceBundle("text", "sap.fe", "Error")) // TODO THIS MUST BE A LOCALIZED TEXT!!!!
								.do(
									OpaBuilder.create(this)
										.isDialogElement()
										.hasType("sap.m.Dialog")
										.doOnAggregation(
											"beginButton",
											OpaBuilder.Matchers.resourceBundle("text", "sap.fe.core", "SAPFE_CLOSE"),
											OpaBuilder.Actions.press()
										)
								)
								.description("Closing message error dialog")
								.execute();
						},
						_iDeleteSelected: function(sTableId) {
							return OpaBuilder.create(this)
								.hasId(sTableId + "::Delete")
								.mustBeEnabled(false)
								.doPress()
								.doConditional(
									OpaBuilder.Matchers.properties({ enabled: true }),
									OpaBuilder.create(this)
										.hasType("sap.m.Button")
										.isDialogElement()
										.hasProperties({ text: oResourceBundleTemplates.getText("OBJECT_PAGE_DELETE") })
										.doPress()
								)
								.description("Deleting selected rows")
								.execute();
						},
						_iExecuteBoundAction: function(sTableId, sServiceName, sActionName) {
							return OpaBuilder.create(this)
								.hasId(sTableId + "::" + sServiceName + "." + sActionName)
								.doPress()
								.description("Executing bound action '" + sServiceName + "." + sActionName + "'")
								.execute();
						},
						iOpenVHOnActionDialog: function(sFieldName) {
							var sFieldId = "APD_::" + sFieldName + "-inner-vhi";
							return OpaBuilder.create(this)
								.hasId(sFieldId)
								.isDialogElement()
								.doPress()
								.description("Opening value help for '" + sFieldName + "'")
								.execute();
						},
						_iSwitchItem: function(bNextItem) {
							var oIcon = bNextItem
								? { icon: "sap-icon://navigation-down-arrow" }
								: { icon: "sap-icon://navigation-up-arrow" };
							return OpaBuilder.create(this)
								.hasType("sap.fe.templates.controls.Paginator")
								.doOnChildren(
									OpaBuilder.create(this)
										.hasType("sap.uxap.ObjectPageHeaderActionButton")
										.hasProperties(oIcon)
										.doPress()
								)
								.description("Paginator button " + (bNextItem ? "Up" : "Down") + " pressed")
								.execute();
						},
						_iPressKeyboardShortcut: function(sId, sShortcut) {
							return OpaBuilder.create(this)
								.hasId(sId)
								.do(function(oElement) {
									var oNormalizedShorcut = ShortcutHelper.parseShortcut(sShortcut);
									oNormalizedShorcut.type = "keydown";
									oElement.$().trigger(oNormalizedShorcut);
								})
								.description("Execute keyboard shortcut " + sShortcut)
								.execute();
						},
						iCancelActionDialog: function() {
							return OpaBuilder.create(this)
								.hasType("sap.m.Button")
								.isDialogElement()
								.hasProperties({ text: oResourceBundleCore.getText("SAPFE_ACTION_PARAMETER_DIALOG_CANCEL") })
								.doPress()
								.description("Cancelling Action dialog")
								.execute();
						},
						iConfirmActionVHDialog: function(sServiceName, sActionName, sFieldName) {
							return OpaBuilder.create(this)
								.hasId(sServiceName + "." + sActionName + "::" + sFieldName + "-ok")
								.isDialogElement()
								.doPress()
								.description("Confirming value help dialog for action " + sActionName)
								.execute();
						},
						iCancelActionVHDialog: function(sServiceName, sActionName, sFieldName) {
							return OpaBuilder.create(this)
								.hasId(sServiceName + "." + sActionName + "::" + sFieldName + "-cancel")
								.isDialogElement()
								.doPress()
								.description("Cancelling value help dialog for action " + sActionName)
								.execute();
						},
						iCollapseExpandPageHeader: function(bCollapse) {
							return OpaBuilder.create(this)
								.hasType("sap.m.Button")
								.has(
									OpaBuilder.Matchers.resourceBundle(
										"tooltip",
										"sap.f",
										bCollapse ? "COLLAPSE_HEADER_BUTTON_TOOLTIP" : "EXPAND_HEADER_BUTTON_TOOLTIP"
									)
								)
								.doPress()
								.description("Resizing of the Page Header")
								.execute();
						},
						_iOpenTableSortSettings: function(sTableId) {
							return TableBuilder.create(this)
								.hasId(sTableId)
								.doPress("sort")
								.description("Opening sort settings for table " + sTableId)
								.execute();
						},
						_iAddColumnInTableSettings: function(sFieldName, vGroupName) {
							return this._iModifyFilterInTableSettings(sFieldName, vGroupName, false, "Adding column");
						},
						_iSortTableByColumn: function(sTableId, sColumn) {
							return this._iOpenTableSortSettings(sTableId).and._iAddColumnInTableSettings(sColumn);
						},
						_iModifyFilterInTableSettings: function(sFieldName, vGroupName, bIsSelected, sDescription) {
							return OpaBuilder.create(this)
								.hasType("sap.m.ColumnListItem")
								.isDialogElement()
								.hasProperties({ selected: bIsSelected })
								.has(_getTableSettingsColumnBuilder(sFieldName, vGroupName))
								.doOnChildren(
									OpaBuilder.create(this)
										.hasType("sap.m.CheckBox")
										.doPress()
								)
								.description(sDescription + " '" + sFieldName + "'")
								.execute();
						}
					},
					assertions: {
						_iCanAccessColumnInTableSettings: function(sTableId, sFieldName, vGroupName, bSelected) {
							var oFindColumnBuilder = OpaBuilder.create(this)
								.hasType("sap.m.ColumnListItem")
								.isDialogElement()
								.has(_getTableSettingsColumnBuilder(sFieldName, vGroupName))
								.description("Column '" + sFieldName + "' is available in table settings");
							if (arguments.length > 3) {
								oFindColumnBuilder.hasProperties({ selected: bSelected });
							}
							return OpaBuilder.create(this)
								.hasId(getTableSettingsButtonId(sTableId))
								.do(oFindColumnBuilder)
								.execute();
						},
						_iCannotAccessColumnInTableSettings: function(sTableId, sFieldName, vGroupName) {
							var oFindColumnBuilder = OpaBuilder.create(this)
								.isDialogElement()
								.hasType("sap.m.Table")
								.has(
									FEBuilder.Matchers.not(
										OpaBuilder.Matchers.aggregationMatcher(
											"items",
											_getTableSettingsColumnBuilder(sFieldName, vGroupName)
										)
									)
								)
								.description("Column '" + sFieldName + "' is not available in table settings");
							return OpaBuilder.create(this)
								.hasId(getTableSettingsButtonId(sTableId))
								.do(oFindColumnBuilder)
								.execute();
						},
						iSeeThisPage: function() {
							return OpaBuilder.create(this)
								.hasId(sViewId)
								.viewId(null)
								.viewName(null)
								.description(Utils.formatMessage("Seeing the page '{0}'", sViewId))
								.execute();
						},
						iSeeFilterDefinedOnActionDialogValueHelp: function(sAction, sVHParameter, sFieldName, sValue) {
							return OpaBuilder.create(this)
								.hasId(sAction + "::" + sVHParameter + "::FilterBar::FF::" + sFieldName + "-inner")
								.isDialogElement()
								.hasAggregationProperties("tokens", { text: sValue })
								.description("Seeing filter for '" + sFieldName + "' set to '" + sValue + "'")
								.execute();
						},
						_iSeeTheMessageToast: function(sText) {
							return OpaBuilder.create(this)
								.has(function() {
									return !!Opa5.getJQuery()(".sapMMessageToast").length;
								})
								.check(function() {
									return Opa5.getJQuery()(".sapMMessageToast").getEncodedText() === sText;
								})
								.description("Toast message '" + sText + "' is displayed")
								.execute();
						},
						_iSeeTableRows: function(sTableId, iNumberOfRows) {
							return OpaBuilder.create(this)
								.hasId(sTableId)
								.has(function(oTable) {
									var oRowBinding = oTable.getRowBinding();
									return (
										(oRowBinding &&
											(iNumberOfRows === undefined
												? oRowBinding.getLength() !== 0
												: oRowBinding.getLength() === iNumberOfRows)) ||
										(!oRowBinding && iNumberOfRows === 0)
									);
								})
								.mustBeEnabled(false)
								.description("Seeing table with " + (iNumberOfRows === undefined ? "> 0" : iNumberOfRows) + " rows")
								.execute();
						},
						_iSeeSelectedTableRows: function(sTableId, iNumberOfRows) {
							return OpaBuilder.create(this)
								.hasId(sTableId)
								.has(function(oTable) {
									var selectedRows = oTable.getSelectedContexts().length;
									return iNumberOfRows === undefined ? selectedRows !== 0 : selectedRows === iNumberOfRows;
								})
								.description("Seeing table with " + (iNumberOfRows === undefined ? "> 0" : iNumberOfRows) + " rows")
								.execute();
						},
						iSeeMessageErrorDialog: function() {
							return OpaBuilder.create(this)
								.isDialogElement()
								.hasType("sap.m.Bar")
								.hasAggregation("contentMiddle", OpaBuilder.Matchers.resourceBundle("text", "sap.fe", "Error")) // TODO THIS MUST BE A LOCALIZED TEXT!!!!
								.description("Seeing message error dialog")
								.execute();
						},
						_iSeeTableRowWithCellValues: function(sTableId, mCellValues, oRowState) {
							// TODO here the rowState is misused to check the navigation icon
							return TableBuilder.create(this)
								.hasId(sTableId)
								.hasRows([TableBuilder.Row.Matchers.cellValues(mCellValues), getStateRowMatchers(oRowState)])
								.description(
									Utils.formatMessage(
										"Seeing table '{0}' having values '{1}'" + (oRowState ? " with state: '{2}'" : ""),
										sTableId,
										mCellValues,
										oRowState
									)
								)
								.execute(this);
						},
						_iSeeButtonWithText: function(sText, oButtonState) {
							return OpaBuilder.create(this)
								.hasType("sap.m.Button")
								.hasProperties({ text: sText })
								.has(FEBuilder.Matchers.states(oButtonState))
								.checkNumberOfMatches(1)
								.description(
									Utils.formatMessage(
										"Seeing Button with text '{0}'" + (oButtonState ? " with state: '{1}'" : ""),
										sText,
										oButtonState
									)
								)
								.execute();
						},
						_iSeeElement: function(sId, oElementState) {
							return OpaBuilder.create(this)
								.hasId(sId)
								.has(FEBuilder.Matchers.states(oElementState))
								.description(
									Utils.formatMessage(
										"Seeing Element '{0}'" + (oElementState ? " with state: '{1}'" : ""),
										sId,
										oElementState
									)
								)
								.execute();
						},
						_checkTableActionButtonEnablement: function(sTableId, sServiceName, sActionName, bEnablement, bBoundAction) {
							var sActionSeparator = bBoundAction === false ? "::" : ".";
							return OpaBuilder.create(this)
								.hasId(sTableId + "::" + sServiceName + (sServiceName === "" ? "" : sActionSeparator) + sActionName)
								.hasProperties({ enabled: bEnablement })
								.mustBeEnabled(false)
								.description("Table action button " + sActionName + " is " + (bEnablement ? "enabled" : "disabled"))
								.execute();
						},
						_checkPaginatorButtonEnablement: function(bNextItem, bEnabled) {
							var oMatcher = bNextItem
								? { icon: "sap-icon://navigation-down-arrow" }
								: { icon: "sap-icon://navigation-up-arrow" };
							oMatcher.enabled = bEnabled;
							return OpaBuilder.create(this)
								.hasType("sap.fe.templates.controls.Paginator")
								.doOnChildren(
									OpaBuilder.create(this)
										.hasType("sap.uxap.ObjectPageHeaderActionButton")
										.hasProperties(oMatcher)
										.mustBeEnabled(false)
								)
								.description(
									"Paginator button " + (bNextItem ? "Up" : "Down") + " is " + (bEnabled ? "enabled" : "disabled")
								)
								.execute();
						},
						iSeeActionParameterDialog: function(sDialogTitle) {
							return OpaBuilder.create(this)
								.hasType("sap.m.Dialog")
								.hasProperties({ title: sDialogTitle })
								.isDialogElement()
								.description("Seeing Action Parameter Dialog with title '" + sDialogTitle + "'")
								.execute();
						},
						iSeeActionParameterContent: function(sFieldName, sContent) {
							var sFieldId = "APD_::" + sFieldName + "-inner";
							return OpaBuilder.create(this)
								.hasId(sFieldId)
								.isDialogElement()
								.hasProperties({ value: sContent })
								.description("Seeing Action parameter '" + sFieldName + "' with content '" + sContent + "'")
								.execute();
						},
						iSeeActionVHDialog: function(sServiceName, sActionName, sFieldName) {
							return OpaBuilder.create(this)
								.hasId(sServiceName + "." + sActionName + "::" + sFieldName + "-dialog")
								.isDialogElement()
								.description("Seeing Action Value Help dialog for field " + sFieldName)
								.execute();
						},
						iSeeActionVHDialogFilterBar: function(sServiceName, sActionName, sFieldName) {
							return OpaBuilder.create(this)
								.hasId(sServiceName + "." + sActionName + "::" + sFieldName + "::FilterBar")
								.isDialogElement()
								.description("Seeing Action Value Help FilterBar for field " + sFieldName)
								.execute();
						},
						iSeeActionVHDialogTable: function(sServiceName, sActionName, sFieldName) {
							return OpaBuilder.create(this)
								.hasId(sServiceName + "." + sActionName + "::" + sFieldName + "::Table")
								.isDialogElement()
								.description("Seeing Action Value Help Table for field " + sFieldName)
								.execute();
						},
						iSeePageHeaderButton: function(bCollapse) {
							return OpaBuilder.create(this)
								.hasType("sap.m.Button")
								.has(
									OpaBuilder.Matchers.resourceBundle(
										"tooltip",
										"sap.f",
										bCollapse ? "COLLAPSE_HEADER_BUTTON_TOOLTIP" : "EXPAND_HEADER_BUTTON_TOOLTIP"
									)
								)
								.description("Seeing the " + (bCollapse ? "Collapse" : "Expand") + " Page Header Button")
								.execute();
						},
						_iSeeSortedColumn: function(sTableId, sColumnName, sPropertyName) {
							var properties = {};
							properties[sPropertyName] = "Ascending";
							return OpaBuilder.create(this)
								.hasId(sTableId + "::C::" + sColumnName + "-innerColumn")
								.hasProperties(properties)
								.description("Seeing column " + sColumnName + " with sortOrder property")
								.execute();
						},
						_iSeeTableP13nMode: function(sTableID, aMode) {
							return OpaBuilder.create(this)
								.hasId(sTableID)
								.check(function(oTable) {
									var p13nMode = oTable.getP13nMode();
									if ((p13nMode === undefined || p13nMode.length === 0) && (aMode === undefined || aMode.length === 0)) {
										return true;
									}
									if (p13nMode === undefined || aMode === undefined || p13nMode.length !== aMode.length) {
										return false;
									}
									return !aMode.some(function(element) {
										return !p13nMode.includes(element);
									});
								})
								.description("Seeing " + aMode.toString() + "-P13n Mode for Table " + sTableID)
								.execute();
						}
					}
				};
			}
		};
	}
);
