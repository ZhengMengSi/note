sap.ui.define(["sap/ovp/cards/Integration/Helpers/ContentHelper", "sap/ovp/cards/Integration/Helpers/i18n"], function (ContentHelper, i18nHelper) {
    "use strict";

     /**
     * Get the first 'n' visible columns index
     *
     * @param {object} oCardDefinition Card defination object
     * @param {integer} n Count of visible columns index to be returned
     * @returns {Array} array containing the index of first 'n' visible column's indices
     */
    function getIndexesForVisibleColumns(oCardDefinition, n) {
        var aIndexesForVisibleColumns = [], j = 0;
        var aCols = oCardDefinition.view.byId("ovpTable").getAggregation("columns");
        for (var i = 0; i < aCols.length && aIndexesForVisibleColumns.length < n; i++) {
            if (aCols[i].getVisible()) {
                aIndexesForVisibleColumns[j] = i;
                j++;
            }
        }
        return aIndexesForVisibleColumns;
    }

     /**
     * Get the header and hAlign property of the column
     *
     * @param {Array} aCols Table Card columns array
     * @param {Array} aIndexArray the array holding indices of visible columns
     * @param {integer} index of the Column
     * @param {string} sCardId card id of the table card
     * @returns {object} object containing the header and hAlign property for the column
     */
    function getColumnInfo(aCols, aIndexArray, index, sCardId, oCardDefinition) {
        var oColumn = aCols[aIndexArray[index]];
        if (oColumn) {
            var sHeader = ContentHelper.getBindingPathOrValue(oColumn.getHeader(), "text", false, oCardDefinition.parameters);
            var sHeaderKey, sHeaderVal;
            if (sHeader && !sHeader.startsWith("{")) {
                sHeaderKey = sHeader.replace(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g, "");
                sHeaderKey = sCardId + "_" + sHeaderKey.replace(/ /g, "_");
                sHeaderVal = sHeader;
                i18nHelper.seti18nValueToMap("content.row.columns." + index + ".title", "{{" + sHeaderKey + "}}", true);
                i18nHelper.inserti18nPayLoad(sCardId, sHeaderKey, sHeaderVal, "Column header", "column " + index + " title value");
            }
           return {
                "header" : sHeader,
                "hAlign": oColumn.getHAlign()
           };
        }
        return {};
    }

     /**
     * Get the cell value and state property
     * @param {object} oCell Table Card column object
     * @returns {object} object containing the cell value and state
     */
    function getCellValue(oCell, oCardDefinition) {
        if (!oCell) {
            return {};
        }
        var oControlType, oVBoxText, oObjectStatus, sObjectStatus, oValState, oVal = {};
        oControlType = oCell.getMetadata().getName();
       switch (oControlType) {
            case 'sap.m.VBox':
                var aItems = oCell.getAggregation("items");
                if (aItems.length) {
                    aItems.forEach(function (oItem) {
                        oVBoxText = ContentHelper.getBindingPathOrValue(oItem,"text", false, oCardDefinition.parameters);
                        // VBox can have item which doesn't have text property hence set oVal.value only for the item which has "text" property
                        if (oVBoxText) {
                            oVal.value = oVBoxText;
                        }
                    });
                }
                break;
            case 'sap.ui.comp.navpopover.SmartLink':
                oVal.value = ContentHelper.getBindingPathOrValue(oCell,"text", false, oCardDefinition.parameters);
                break;
            case 'sap.m.Text':
                oVal.value = ContentHelper.getBindingPathOrValue(oCell,"text", false, oCardDefinition.parameters);
                break;
            case 'sap.ui.comp.smartfield.SmartField':
                oVal.value = ContentHelper.getBindingPathOrValue(oCell,"value", false, oCardDefinition.parameters);
                oObjectStatus = oCell.getControlProposal().getObjectStatus ? oCell.getControlProposal().getObjectStatus() : 'None';
                sObjectStatus = ContentHelper.getBindingPathOrValue(oObjectStatus,"criticality", false, oCardDefinition.parameters);
                oVal.state = sObjectStatus && sObjectStatus !== "None" ? ContentHelper.buildValueStateExpression(sObjectStatus, "state") : "None";
                break;
            case 'sap.m.ObjectNumber':
                oVal.value = ContentHelper.getBindingPathOrValue(oCell,"number", false, oCardDefinition.parameters);
                oValState = ContentHelper.getBindingPathOrValue(oCell,"state", false, oCardDefinition.parameters);
                oVal.state = oValState && oValState !== "None" ? ContentHelper.buildValueStateExpression(oValState, "state") : "None";
                break;
       }
       return oVal;
    }

     /**
     * Get the table content
     *
     * @param {object} oCardDefinition Card definition object
     * @param {object} oSapCard containing the card configuration
     * @returns {object} object containing the table card content
     */
    function getTableContent(oCardDefinition, oSapCard) {
        if (!oCardDefinition) {
            return {};
        }
        var aCols, oFirstColumnInfo, oSecondColumnInfo, oThirdColumnInfo;
        var oFirstCellValue, oSecondcellValue, oThirdCellValue, sCardId;
        sCardId = oCardDefinition.cardComponentData.cardId;
        oCardDefinition.parameters = oSapCard.configuration.parameters;
        var aIndexesForFirstThreeVisibleColumns = getIndexesForVisibleColumns(oCardDefinition, 3);
        aCols = oCardDefinition.view.byId("ovpTable").getAggregation("columns");
        oFirstColumnInfo = getColumnInfo(aCols, aIndexesForFirstThreeVisibleColumns, 0, sCardId, oCardDefinition);
        oSecondColumnInfo = getColumnInfo(aCols, aIndexesForFirstThreeVisibleColumns, 1, sCardId, oCardDefinition);
        oThirdColumnInfo = getColumnInfo(aCols, aIndexesForFirstThreeVisibleColumns, 2, sCardId, oCardDefinition);
        var oCells = oCardDefinition.itemBindingInfo && oCardDefinition.itemBindingInfo.template.getAggregation("cells");
        oFirstCellValue = getCellValue(oCells[aIndexesForFirstThreeVisibleColumns[0]], oCardDefinition);
        oSecondcellValue = getCellValue(oCells[aIndexesForFirstThreeVisibleColumns[1]], oCardDefinition);
        oThirdCellValue = getCellValue(oCells[aIndexesForFirstThreeVisibleColumns[2]], oCardDefinition);

        var oSapCardContent = {
            data: ContentHelper.getData(oSapCard.data.request.batch),
            row:  {
                "columns": [{
                    "title":  oFirstColumnInfo.header,
                    "value": oFirstCellValue.value,
                    "state": oFirstCellValue.state,
                    "actions": oFirstCellValue.actions,
                    "hAlign": oFirstColumnInfo.hAlign
                },
                {
                    "title": oSecondColumnInfo.header,
                    "value": oSecondcellValue.value,
                    "state": oSecondcellValue.state,
                    "actions": oSecondcellValue.actions,
                    "hAlign": oSecondColumnInfo.hAlign
                },
                {
                    "title": oThirdColumnInfo.header,
                    "value": oThirdCellValue.value,
                    "state": oThirdCellValue.state,
                    "actions": oThirdCellValue.actions,
                    "hAlign": oThirdColumnInfo.hAlign
                }]
            }
        };
        return oSapCardContent;
    }

    return {
        getTableContent: getTableContent
    };

});
