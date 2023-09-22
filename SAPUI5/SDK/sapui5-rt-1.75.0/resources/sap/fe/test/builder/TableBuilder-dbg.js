sap.ui.define(
	[
		"sap/ui/test/OpaBuilder",
		"./FEBuilder",
		"./FieldBuilder",
		"sap/fe/test/Utils",
		"sap/ui/table/library",
		"sap/ui/test/matchers/Interactable"
	],
	function(OpaBuilder, FEBuilder, FieldBuilder, Utils, GridTableLibrary, Interactable) {
		"use strict";

		var RowActionType = GridTableLibrary.RowActionType;

		function _isGridTable(oMdcTable) {
			return oMdcTable._oTable.getMetadata().getName() === "sap.ui.table.Table";
		}

		function _getRowAggregationName(oMdcTable) {
			return _isGridTable(oMdcTable) ? "rows" : "items";
		}

		function _getCellIndex(vColumn, oRow) {
			var oTable = oRow.getParent(),
				oMdcTable = oTable.getParent(),
				iIndex = Number(vColumn);
			return Number.isNaN(iIndex)
				? oMdcTable.getColumns().findIndex(function(oColumn) {
						return oColumn.getHeader() === vColumn;
				  })
				: iIndex;
		}

		function _getRowNavigationIconOnGridTable(oRow) {
			var oRowAction = oRow.getRowAction();
			return oRowAction.getItems().reduce(function(oIcon, oActionItem, iIndex) {
				if (!oIcon && oActionItem.getType() === RowActionType.Navigation) {
					oIcon = oRowAction.getAggregation("_icons")[iIndex];
				}
				return oIcon;
			}, null);
		}

		function _getRowMatcher(vRowMatcher) {
			var aRowMatcher = [new Interactable()];
			if (Utils.isOfType(vRowMatcher, Object)) {
				vRowMatcher = TableBuilder.Row.Matchers.cellValues(vRowMatcher);
			}
			if (vRowMatcher) {
				aRowMatcher = aRowMatcher.concat(vRowMatcher);
			}
			return aRowMatcher;
		}

		var TableBuilder = function() {
			return FEBuilder.apply(this, arguments);
		};

		TableBuilder.create = function(oOpaInstance) {
			return new TableBuilder(oOpaInstance);
		};

		TableBuilder.prototype = Object.create(FEBuilder.prototype);

		TableBuilder.prototype.hasRows = function(vRowMatcher, bReturnAggregationItems) {
			vRowMatcher = _getRowMatcher(vRowMatcher);

			return bReturnAggregationItems
				? this.has(TableBuilder.Matchers.rows(vRowMatcher))
				: this.has(TableBuilder.Matchers.rowsMatcher(vRowMatcher));
		};

		TableBuilder.prototype.doOnRows = function(vRowMatcher, vRowAction) {
			if (arguments.length === 1) {
				vRowAction = vRowMatcher;
				vRowMatcher = undefined;
			}
			if (!vRowAction) {
				return this;
			}
			return this.hasRows(vRowMatcher, true).do(OpaBuilder.Actions.conditional(OpaBuilder.Matchers.TRUE, vRowAction));
		};

		TableBuilder.prototype.doEditValues = function(vRowMatcher, mColumnValueMap) {
			if (arguments.length === 1) {
				mColumnValueMap = vRowMatcher;
				vRowMatcher = undefined;
			}
			return this.doOnRows(vRowMatcher, TableBuilder.Row.Actions.editCells(mColumnValueMap));
		};

		TableBuilder.prototype.doSelect = function(vRowMatcher) {
			return this.doOnRows(vRowMatcher, function(oRow) {
				if (oRow.getMetadata().getName() === "sap.ui.table.Row") {
					var oTable = oRow.getParent(),
						oRowIndex = oTable.indexOfRow(oRow);
					return OpaBuilder.Actions.press("rowsel" + oRowIndex).executeOn(oTable);
				}
				return OpaBuilder.Actions.press().executeOn(oRow.getMultiSelectControl());
			});
		};

		TableBuilder.prototype.doNavigate = function(vRowMatcher) {
			return this.doOnRows(vRowMatcher, function(oRow) {
				if (oRow.getMetadata().getName() === "sap.ui.table.Row") {
					return OpaBuilder.Actions.press().executeOn(_getRowNavigationIconOnGridTable(oRow));
				}
				return OpaBuilder.Actions.press("imgNav").executeOn(oRow);
			});
		};

		TableBuilder.Row = {
			Matchers: {
				cellValue: function(vColumn, vExpectedValue) {
					return function(oRow) {
						var iColumn = _getCellIndex(vColumn, oRow),
							oField = oRow.getCells()[iColumn];
						return FieldBuilder.Matchers.value(vExpectedValue)(oField);
					};
				},
				cellValues: function(mColumnValueMap) {
					return Object.keys(mColumnValueMap).map(function(sColumnName) {
						return TableBuilder.Row.Matchers.cellValue(sColumnName, mColumnValueMap[sColumnName]);
					});
				}
			},
			Actions: {
				onCell: function(vColumn, vCellAction) {
					return function(oRow) {
						var iColumn = _getCellIndex(vColumn, oRow),
							oCellControl = oRow.getCells()[iColumn];
						if (vCellAction.executeOn) {
							vCellAction.executeOn(oCellControl);
						} else {
							vCellAction(oCellControl);
						}
					};
				},
				editCell: function(vColumn, vValue) {
					return TableBuilder.Row.Actions.onCell(vColumn, OpaBuilder.Actions.enterText(vValue, true));
				},
				editCells: function(mColumnValueMap) {
					return Object.keys(mColumnValueMap).map(function(sColumnName) {
						return TableBuilder.Row.Actions.editCell(sColumnName, mColumnValueMap[sColumnName]);
					});
				}
			}
		};

		TableBuilder.Matchers = {
			isGridTable: function() {
				return _isGridTable;
			},
			rows: function(vRowMatcher) {
				return function(oMdcTable) {
					return FEBuilder.Matchers.aggregation(_getRowAggregationName(oMdcTable), vRowMatcher)(oMdcTable._oTable);
				};
			},
			rowsMatcher: function(vRowMatcher) {
				return function(oMdcTable) {
					return TableBuilder.Matchers.rows(vRowMatcher)(oMdcTable).length > 0;
				};
			}
		};

		TableBuilder.Actions = {};

		return TableBuilder;
	}
);
