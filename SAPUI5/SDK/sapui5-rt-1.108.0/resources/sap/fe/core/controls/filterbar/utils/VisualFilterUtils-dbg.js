/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/templating/FilterHelper", "sap/ui/core/format/NumberFormat", "sap/ui/mdc/condition/Condition", "sap/ui/model/odata/type/DateTimeOffset"], function (Log, FilterHelper, NumberFormat, Condition, DateTimeOffset) {
  "use strict";

  var getTypeCompliantValue = FilterHelper.getTypeCompliantValue;
  var getRangeProperty = FilterHelper.getRangeProperty;

  var VisualFilterUtils = {
    /**
     * Applies the median scale to the chart data.
     *
     * @param oInteractiveChart InteractiveChart in the VisualFilter control
     * @param oView Instance of the view
     * @param sVFId VisualFilter control ID
     * @param sInfoPath Internal model context path to store info.
     */
    applyMedianScaleToChartData: function (oInteractiveChart, oView, sVFId, sInfoPath) {
      var oData = [];
      var sMeasure = oInteractiveChart.data("measure");
      var oInternalModelContext = oView.getBindingContext("internal");
      var aAggregation = oInteractiveChart.getPoints && oInteractiveChart.getPoints() || oInteractiveChart.getBars && oInteractiveChart.getBars() || oInteractiveChart.getSegments && oInteractiveChart.getSegments();

      for (var i = 0; i < aAggregation.length; i++) {
        oData.push(aAggregation[i].getBindingContext().getObject());
      }

      var scaleFactor = this._getMedianScaleFactor(oData, sMeasure);

      if (scaleFactor && scaleFactor.iShortRefNumber && scaleFactor.scale) {
        oInternalModelContext.setProperty("scalefactor/".concat(sInfoPath), scaleFactor.scale);
        oInternalModelContext.setProperty("scalefactorNumber/".concat(sInfoPath), scaleFactor.iShortRefNumber);
      } else {
        oInternalModelContext.setProperty("scalefactor/".concat(sInfoPath), "");
        oInternalModelContext.setProperty("scalefactorNumber/".concat(sInfoPath), "");
        var oScaleTitle = oView.byId("".concat(sVFId, "::ScaleUoMTitle"));
        var oMeasureDimensionTitle = oView.byId("".concat(sVFId, "::MeasureDimensionTitle"));
        var sText = oScaleTitle.getText();

        if (sText === " | ") {
          oScaleTitle.setVisible(false);
          oMeasureDimensionTitle.setTooltip(oMeasureDimensionTitle.getText());
        }
      }
    },

    /**
     * Returns the median scale factor.
     *
     * @param oData VisualFilter data
     * @param sMeasureField Path of the measure
     * @returns Object containing scale and iShortRefNumber
     */
    _getMedianScaleFactor: function (oData, sMeasureField) {
      var i;
      var scaleFactor;
      oData.sort(function (a, b) {
        if (Number(a[sMeasureField]) < Number(b[sMeasureField])) {
          return -1;
        }

        if (Number(a[sMeasureField]) > Number(b[sMeasureField])) {
          return 1;
        }

        return 0;
      });

      if (oData.length > 0) {
        // get median index
        var iMid = oData.length / 2,
            // get mid of array
        // if iMid is whole number, array length is even, calculate median
        // if iMid is not whole number, array length is odd, take median as iMid - 1
        iMedian = iMid % 1 === 0 ? (parseFloat(oData[iMid - 1][sMeasureField]) + parseFloat(oData[iMid][sMeasureField])) / 2 : parseFloat(oData[Math.floor(iMid)][sMeasureField]),
            // get scale factor on median
        val = iMedian;

        for (i = 0; i < 14; i++) {
          scaleFactor = Math.pow(10, i);

          if (Math.round(Math.abs(val) / scaleFactor) < 10) {
            break;
          }
        }
      }

      var fixedInteger = NumberFormat.getIntegerInstance({
        style: "short",
        showScale: false,
        shortRefNumber: scaleFactor
      }); // apply scale factor to other values and check

      for (i = 0; i < oData.length; i++) {
        var aData = oData[i],
            sScaledValue = fixedInteger.format(aData[sMeasureField]),
            aScaledValueParts = sScaledValue.split("."); // if scaled value has only 0 before decimal or 0 after decimal (example: 0.02)
        // then ignore this scale factor else proceed with this scale factor
        // if scaled value divided by 1000 is >= 1000 then also ignore scale factor

        if (!aScaledValueParts[1] && parseInt(aScaledValueParts[0], 10) === 0 || aScaledValueParts[1] && parseInt(aScaledValueParts[0], 10) === 0 && aScaledValueParts[1].indexOf("0") === 0 || sScaledValue / 1000 >= 1000) {
          scaleFactor = undefined;
          break;
        }
      }

      return {
        iShortRefNumber: scaleFactor,
        scale: scaleFactor ? fixedInteger.getScale() : ""
      };
    },

    /**
     * Returns the formatted number according to the rules of VisualChartFilters.
     *
     * @param value Value which needs to be formatted
     * @param scaleFactor ScaleFactor to which the value needs to be scaled
     * @param numberOfFractionalDigits NumberOfFractionalDigits digits in the decimals according to scale
     * @param currency Currency code
     * @returns The formatted number
     */
    getFormattedNumber: function (value, scaleFactor, numberOfFractionalDigits, currency) {
      var fixedInteger;
      value = typeof value === "string" ? Number(value.replace(/,/g, "")) : value;

      if (currency) {
        var currencyFormat = NumberFormat.getCurrencyInstance({
          showMeasure: false
        });
        return currencyFormat.format(parseFloat(value), currency); // parseFloat(value) is required otherwise -ve value are wrongly rounded off
        // Example: "-1.9" rounds off to -1 instead of -2. however -1.9 rounds off to -2
      } else if (scaleFactor) {
        fixedInteger = NumberFormat.getFloatInstance({
          style: "short",
          showScale: false,
          shortRefNumber: scaleFactor,
          shortDecimals: numberOfFractionalDigits
        });
        return fixedInteger.format(parseFloat(value));
      } else {
        fixedInteger = NumberFormat.getFloatInstance({
          decimals: numberOfFractionalDigits
        });
        return fixedInteger.format(parseFloat(value));
      }
    },

    /**
     * Applies the UOM to the title of the visual filter control.
     *
     * @param oInteractiveChart InteractiveChart in the VisualFilter control
     * @param oContextData Data of the VisualFilter
     * @param oView Instance of the view
     * @param sInfoPath Internal model context path to store info.
     */
    applyUOMToTitle: function (oInteractiveChart, oContextData, oView, sInfoPath) {
      var vUOM = oInteractiveChart.data("uom");
      var sUOM;
      var sCurrency;

      if (vUOM && vUOM["ISOCurrency"]) {
        sUOM = vUOM["ISOCurrency"];
        sCurrency = sUOM.$Path ? oContextData[sUOM.$Path] : sUOM;
      } else if (vUOM && vUOM["Unit"]) {
        sUOM = vUOM["Unit"];
      }

      if (sUOM) {
        var sUOMValue = sUOM.$Path ? oContextData[sUOM.$Path] : sUOM;
        var oInternalModelContext = oView.getBindingContext("internal");
        oInternalModelContext.setProperty("uom/".concat(sInfoPath), sUOMValue);

        if (sCurrency) {
          oInternalModelContext.setProperty("currency/".concat(sInfoPath), sUOMValue);
        }
      }
    },

    /**
     * Updates the scale factor in the title of the visual filter.
     *
     * @param oInteractiveChart InteractiveChart in the VisualFilter control
     * @param oView Instance of the view
     * @param sVFId VisualFilter control ID
     * @param sInfoPath Internal model context path to store info.
     */
    updateChartScaleFactorTitle: function (oInteractiveChart, oView, sVFId, sInfoPath) {
      if (!oInteractiveChart.data("scalefactor")) {
        this.applyMedianScaleToChartData(oInteractiveChart, oView, sVFId, sInfoPath);
      } else {
        var fixedInteger = NumberFormat.getIntegerInstance({
          style: "short",
          showScale: false,
          shortRefNumber: oInteractiveChart.data("scalefactor")
        });
        var oInternalModelContext = oView.getBindingContext("internal");
        oInternalModelContext.setProperty("scalefactor/".concat(sInfoPath), fixedInteger.getScale());
      }
    },

    /**
     *
     * @param s18nMessageTitle Text of the error message title.
     * @param s18nMessage Text of the error message description.
     * @param sInfoPath Internal model context path to store info.
     * @param oView Instance of the view.
     */
    applyErrorMessageAndTitle: function (s18nMessageTitle, s18nMessage, sInfoPath, oView) {
      var oInternalModelContext = oView.getBindingContext("internal");
      oInternalModelContext.setProperty(sInfoPath, {});
      oInternalModelContext.setProperty(sInfoPath, {
        "errorMessageTitle": s18nMessageTitle,
        "errorMessage": s18nMessage,
        "showError": true
      });
    },

    /**
     * Checks if multiple units are present.
     *
     * @param oContexts Contexts of the VisualFilter
     * @param sUnitfield The path of the unit field
     * @returns Returns if multiple units are configured or not
     */
    checkMulitUnit: function (oContexts, sUnitfield) {
      var aData = [];

      if (oContexts && sUnitfield) {
        for (var i = 0; i < oContexts.length; i++) {
          var aContextData = oContexts[i] && oContexts[i].getObject();
          aData.push(aContextData[sUnitfield]);
        }
      }

      return !!aData.reduce(function (data, key) {
        return data === key ? data : NaN;
      });
    },

    /**
     * Sets an error message if multiple UOM are present.
     *
     * @param oData Data of the VisualFilter control
     * @param oInteractiveChart InteractiveChart in the VisualFilter control
     * @param sInfoPath Internal model context path to store info.
     * @param oResourceBundle The resource bundle
     * @param oView Instance of the view
     */
    setMultiUOMMessage: function (oData, oInteractiveChart, sInfoPath, oResourceBundle, oView) {
      var vUOM = oInteractiveChart.data("uom");
      var sIsCurrency = vUOM && vUOM["ISOCurrency"] && vUOM["ISOCurrency"].$Path;
      var sIsUnit = vUOM && vUOM["Unit"] && vUOM["Unit"].$Path;
      var sUnitfield = sIsCurrency || sIsUnit;
      var s18nMessageTitle, s18nMessage;

      if (sUnitfield) {
        if (!this.checkMulitUnit(oData, sUnitfield)) {
          if (sIsCurrency) {
            s18nMessageTitle = oResourceBundle.getText("M_VISUAL_FILTERS_ERROR_MESSAGE_TITLE");
            s18nMessage = oResourceBundle.getText("M_VISUAL_FILTERS_MULTIPLE_CURRENCY", sUnitfield);
            this.applyErrorMessageAndTitle(s18nMessageTitle, s18nMessage, sInfoPath, oView);
            Log.warning("Filter is set for multiple Currency for".concat(sUnitfield));
          } else if (sIsUnit) {
            s18nMessageTitle = oResourceBundle.getText("M_VISUAL_FILTERS_ERROR_MESSAGE_TITLE");
            s18nMessage = oResourceBundle.getText("M_VISUAL_FILTERS_MULTIPLE_UNIT", sUnitfield);
            this.applyErrorMessageAndTitle(s18nMessageTitle, s18nMessage, sInfoPath, oView);
            Log.warning("Filter is set for multiple UOMs for".concat(sUnitfield));
          }
        }
      }
    },

    /**
     * Sets an error message if response data is empty.
     *
     * @param sInfoPath Internal model context path to store info.
     * @param oResourceBundle The resource bundle
     * @param oView Instance of the view
     */
    setNoDataMessage: function (sInfoPath, oResourceBundle, oView) {
      var s18nMessageTitle = oResourceBundle.getText("M_VISUAL_FILTERS_ERROR_MESSAGE_TITLE");
      var s18nMessage = oResourceBundle.getText("M_VISUAL_FILTER_NO_DATA_TEXT");
      this.applyErrorMessageAndTitle(s18nMessageTitle, s18nMessage, sInfoPath, oView);
    },
    convertFilterCondions: function (oFilterConditions) {
      var oConvertedConditions = {};
      Object.keys(oFilterConditions).forEach(function (sKey) {
        var aConvertedConditions = [];
        var aConditions = oFilterConditions[sKey];

        for (var i = 0; i < aConditions.length; i++) {
          var values = aConditions[i].value2 ? [aConditions[i].value1, aConditions[i].value2] : [aConditions[i].value1];
          aConvertedConditions.push(Condition.createCondition(aConditions[i].operator, values, null, null, "Validated"));
        }

        if (aConvertedConditions.length) {
          oConvertedConditions[sKey] = aConvertedConditions;
        }
      });
      return oConvertedConditions;
    },
    getCustomConditions: function (Range, oValidProperty, sPropertyName) {
      var value1, value2;

      if (oValidProperty.$Type === "Edm.DateTimeOffset") {
        value1 = this._parseDateTime(getTypeCompliantValue(this._formatDateTime(Range.Low), oValidProperty.$Type));
        value2 = Range.High ? this._parseDateTime(getTypeCompliantValue(this._formatDateTime(Range.High), oValidProperty.$Type)) : null;
      } else {
        value1 = Range.Low;
        value2 = Range.High ? Range.High : null;
      }

      return {
        operator: Range.Option ? getRangeProperty(Range.Option.$EnumMember || Range.Option) : null,
        value1: value1,
        value2: value2,
        path: sPropertyName
      };
    },
    _parseDateTime: function (sValue) {
      return this._getDateTimeTypeInstance().parseValue(sValue, "string");
    },
    _formatDateTime: function (sValue) {
      return this._getDateTimeTypeInstance().formatValue(sValue, "string");
    },
    _getDateTimeTypeInstance: function () {
      return new DateTimeOffset({
        pattern: "yyyy-MM-ddTHH:mm:ssZ",
        calendarType: "Gregorian"
      }, {
        V4: true
      });
    }
  };
  return VisualFilterUtils;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJWaXN1YWxGaWx0ZXJVdGlscyIsImFwcGx5TWVkaWFuU2NhbGVUb0NoYXJ0RGF0YSIsIm9JbnRlcmFjdGl2ZUNoYXJ0Iiwib1ZpZXciLCJzVkZJZCIsInNJbmZvUGF0aCIsIm9EYXRhIiwic01lYXN1cmUiLCJkYXRhIiwib0ludGVybmFsTW9kZWxDb250ZXh0IiwiZ2V0QmluZGluZ0NvbnRleHQiLCJhQWdncmVnYXRpb24iLCJnZXRQb2ludHMiLCJnZXRCYXJzIiwiZ2V0U2VnbWVudHMiLCJpIiwibGVuZ3RoIiwicHVzaCIsImdldE9iamVjdCIsInNjYWxlRmFjdG9yIiwiX2dldE1lZGlhblNjYWxlRmFjdG9yIiwiaVNob3J0UmVmTnVtYmVyIiwic2NhbGUiLCJzZXRQcm9wZXJ0eSIsIm9TY2FsZVRpdGxlIiwiYnlJZCIsIm9NZWFzdXJlRGltZW5zaW9uVGl0bGUiLCJzVGV4dCIsImdldFRleHQiLCJzZXRWaXNpYmxlIiwic2V0VG9vbHRpcCIsInNNZWFzdXJlRmllbGQiLCJzb3J0IiwiYSIsImIiLCJOdW1iZXIiLCJpTWlkIiwiaU1lZGlhbiIsInBhcnNlRmxvYXQiLCJNYXRoIiwiZmxvb3IiLCJ2YWwiLCJwb3ciLCJyb3VuZCIsImFicyIsImZpeGVkSW50ZWdlciIsIk51bWJlckZvcm1hdCIsImdldEludGVnZXJJbnN0YW5jZSIsInN0eWxlIiwic2hvd1NjYWxlIiwic2hvcnRSZWZOdW1iZXIiLCJhRGF0YSIsInNTY2FsZWRWYWx1ZSIsImZvcm1hdCIsImFTY2FsZWRWYWx1ZVBhcnRzIiwic3BsaXQiLCJwYXJzZUludCIsImluZGV4T2YiLCJ1bmRlZmluZWQiLCJnZXRTY2FsZSIsImdldEZvcm1hdHRlZE51bWJlciIsInZhbHVlIiwibnVtYmVyT2ZGcmFjdGlvbmFsRGlnaXRzIiwiY3VycmVuY3kiLCJyZXBsYWNlIiwiY3VycmVuY3lGb3JtYXQiLCJnZXRDdXJyZW5jeUluc3RhbmNlIiwic2hvd01lYXN1cmUiLCJnZXRGbG9hdEluc3RhbmNlIiwic2hvcnREZWNpbWFscyIsImRlY2ltYWxzIiwiYXBwbHlVT01Ub1RpdGxlIiwib0NvbnRleHREYXRhIiwidlVPTSIsInNVT00iLCJzQ3VycmVuY3kiLCIkUGF0aCIsInNVT01WYWx1ZSIsInVwZGF0ZUNoYXJ0U2NhbGVGYWN0b3JUaXRsZSIsImFwcGx5RXJyb3JNZXNzYWdlQW5kVGl0bGUiLCJzMThuTWVzc2FnZVRpdGxlIiwiczE4bk1lc3NhZ2UiLCJjaGVja011bGl0VW5pdCIsIm9Db250ZXh0cyIsInNVbml0ZmllbGQiLCJhQ29udGV4dERhdGEiLCJyZWR1Y2UiLCJrZXkiLCJOYU4iLCJzZXRNdWx0aVVPTU1lc3NhZ2UiLCJvUmVzb3VyY2VCdW5kbGUiLCJzSXNDdXJyZW5jeSIsInNJc1VuaXQiLCJMb2ciLCJ3YXJuaW5nIiwic2V0Tm9EYXRhTWVzc2FnZSIsImNvbnZlcnRGaWx0ZXJDb25kaW9ucyIsIm9GaWx0ZXJDb25kaXRpb25zIiwib0NvbnZlcnRlZENvbmRpdGlvbnMiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsInNLZXkiLCJhQ29udmVydGVkQ29uZGl0aW9ucyIsImFDb25kaXRpb25zIiwidmFsdWVzIiwidmFsdWUyIiwidmFsdWUxIiwiQ29uZGl0aW9uIiwiY3JlYXRlQ29uZGl0aW9uIiwib3BlcmF0b3IiLCJnZXRDdXN0b21Db25kaXRpb25zIiwiUmFuZ2UiLCJvVmFsaWRQcm9wZXJ0eSIsInNQcm9wZXJ0eU5hbWUiLCIkVHlwZSIsIl9wYXJzZURhdGVUaW1lIiwiZ2V0VHlwZUNvbXBsaWFudFZhbHVlIiwiX2Zvcm1hdERhdGVUaW1lIiwiTG93IiwiSGlnaCIsIk9wdGlvbiIsImdldFJhbmdlUHJvcGVydHkiLCIkRW51bU1lbWJlciIsInBhdGgiLCJzVmFsdWUiLCJfZ2V0RGF0ZVRpbWVUeXBlSW5zdGFuY2UiLCJwYXJzZVZhbHVlIiwiZm9ybWF0VmFsdWUiLCJEYXRlVGltZU9mZnNldCIsInBhdHRlcm4iLCJjYWxlbmRhclR5cGUiLCJWNCJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiVmlzdWFsRmlsdGVyVXRpbHMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgUmVzb3VyY2VCdW5kbGUgZnJvbSBcInNhcC9iYXNlL2kxOG4vUmVzb3VyY2VCdW5kbGVcIjtcbmltcG9ydCBMb2cgZnJvbSBcInNhcC9iYXNlL0xvZ1wiO1xuaW1wb3J0IHR5cGUgeyBJbnRlcm5hbE1vZGVsQ29udGV4dCB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL01vZGVsSGVscGVyXCI7XG5pbXBvcnQgeyBnZXRSYW5nZVByb3BlcnR5LCBnZXRUeXBlQ29tcGxpYW50VmFsdWUgfSBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9GaWx0ZXJIZWxwZXJcIjtcbmltcG9ydCB0eXBlIFRpdGxlIGZyb20gXCJzYXAvbS9UaXRsZVwiO1xuaW1wb3J0IE51bWJlckZvcm1hdCBmcm9tIFwic2FwL3VpL2NvcmUvZm9ybWF0L051bWJlckZvcm1hdFwiO1xuaW1wb3J0IHR5cGUgVmlldyBmcm9tIFwic2FwL3VpL2NvcmUvbXZjL1ZpZXdcIjtcbmltcG9ydCBDb25kaXRpb24gZnJvbSBcInNhcC91aS9tZGMvY29uZGl0aW9uL0NvbmRpdGlvblwiO1xuaW1wb3J0IHR5cGUgQ29uZGl0aW9uVmFsaWRhdGVkIGZyb20gXCJzYXAvdWkvbWRjL2VudW0vQ29uZGl0aW9uVmFsaWRhdGVkXCI7XG5pbXBvcnQgdHlwZSBDb250ZXh0IGZyb20gXCJzYXAvdWkvbW9kZWwvQ29udGV4dFwiO1xuaW1wb3J0IERhdGVUaW1lT2Zmc2V0IGZyb20gXCJzYXAvdWkvbW9kZWwvb2RhdGEvdHlwZS9EYXRlVGltZU9mZnNldFwiO1xuXG5jb25zdCBWaXN1YWxGaWx0ZXJVdGlscyA9IHtcblx0LyoqXG5cdCAqIEFwcGxpZXMgdGhlIG1lZGlhbiBzY2FsZSB0byB0aGUgY2hhcnQgZGF0YS5cblx0ICpcblx0ICogQHBhcmFtIG9JbnRlcmFjdGl2ZUNoYXJ0IEludGVyYWN0aXZlQ2hhcnQgaW4gdGhlIFZpc3VhbEZpbHRlciBjb250cm9sXG5cdCAqIEBwYXJhbSBvVmlldyBJbnN0YW5jZSBvZiB0aGUgdmlld1xuXHQgKiBAcGFyYW0gc1ZGSWQgVmlzdWFsRmlsdGVyIGNvbnRyb2wgSURcblx0ICogQHBhcmFtIHNJbmZvUGF0aCBJbnRlcm5hbCBtb2RlbCBjb250ZXh0IHBhdGggdG8gc3RvcmUgaW5mby5cblx0ICovXG5cdGFwcGx5TWVkaWFuU2NhbGVUb0NoYXJ0RGF0YTogZnVuY3Rpb24gKG9JbnRlcmFjdGl2ZUNoYXJ0OiBhbnksIG9WaWV3OiBWaWV3LCBzVkZJZDogc3RyaW5nLCBzSW5mb1BhdGg6IHN0cmluZykge1xuXHRcdGNvbnN0IG9EYXRhID0gW107XG5cdFx0Y29uc3Qgc01lYXN1cmUgPSBvSW50ZXJhY3RpdmVDaGFydC5kYXRhKFwibWVhc3VyZVwiKTtcblx0XHRjb25zdCBvSW50ZXJuYWxNb2RlbENvbnRleHQgPSBvVmlldy5nZXRCaW5kaW5nQ29udGV4dChcImludGVybmFsXCIpIGFzIEludGVybmFsTW9kZWxDb250ZXh0O1xuXHRcdGNvbnN0IGFBZ2dyZWdhdGlvbiA9XG5cdFx0XHQob0ludGVyYWN0aXZlQ2hhcnQuZ2V0UG9pbnRzICYmIG9JbnRlcmFjdGl2ZUNoYXJ0LmdldFBvaW50cygpKSB8fFxuXHRcdFx0KG9JbnRlcmFjdGl2ZUNoYXJ0LmdldEJhcnMgJiYgb0ludGVyYWN0aXZlQ2hhcnQuZ2V0QmFycygpKSB8fFxuXHRcdFx0KG9JbnRlcmFjdGl2ZUNoYXJ0LmdldFNlZ21lbnRzICYmIG9JbnRlcmFjdGl2ZUNoYXJ0LmdldFNlZ21lbnRzKCkpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYUFnZ3JlZ2F0aW9uLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRvRGF0YS5wdXNoKGFBZ2dyZWdhdGlvbltpXS5nZXRCaW5kaW5nQ29udGV4dCgpLmdldE9iamVjdCgpKTtcblx0XHR9XG5cdFx0Y29uc3Qgc2NhbGVGYWN0b3IgPSB0aGlzLl9nZXRNZWRpYW5TY2FsZUZhY3RvcihvRGF0YSwgc01lYXN1cmUpO1xuXHRcdGlmIChzY2FsZUZhY3RvciAmJiBzY2FsZUZhY3Rvci5pU2hvcnRSZWZOdW1iZXIgJiYgc2NhbGVGYWN0b3Iuc2NhbGUpIHtcblx0XHRcdG9JbnRlcm5hbE1vZGVsQ29udGV4dC5zZXRQcm9wZXJ0eShgc2NhbGVmYWN0b3IvJHtzSW5mb1BhdGh9YCwgc2NhbGVGYWN0b3Iuc2NhbGUpO1xuXHRcdFx0b0ludGVybmFsTW9kZWxDb250ZXh0LnNldFByb3BlcnR5KGBzY2FsZWZhY3Rvck51bWJlci8ke3NJbmZvUGF0aH1gLCBzY2FsZUZhY3Rvci5pU2hvcnRSZWZOdW1iZXIpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRvSW50ZXJuYWxNb2RlbENvbnRleHQuc2V0UHJvcGVydHkoYHNjYWxlZmFjdG9yLyR7c0luZm9QYXRofWAsIFwiXCIpO1xuXHRcdFx0b0ludGVybmFsTW9kZWxDb250ZXh0LnNldFByb3BlcnR5KGBzY2FsZWZhY3Rvck51bWJlci8ke3NJbmZvUGF0aH1gLCBcIlwiKTtcblx0XHRcdGNvbnN0IG9TY2FsZVRpdGxlID0gb1ZpZXcuYnlJZChgJHtzVkZJZH06OlNjYWxlVW9NVGl0bGVgKSBhcyBUaXRsZTtcblx0XHRcdGNvbnN0IG9NZWFzdXJlRGltZW5zaW9uVGl0bGUgPSBvVmlldy5ieUlkKGAke3NWRklkfTo6TWVhc3VyZURpbWVuc2lvblRpdGxlYCkgYXMgVGl0bGU7XG5cdFx0XHRjb25zdCBzVGV4dCA9IG9TY2FsZVRpdGxlLmdldFRleHQoKTtcblx0XHRcdGlmIChzVGV4dCA9PT0gXCIgfCBcIikge1xuXHRcdFx0XHRvU2NhbGVUaXRsZS5zZXRWaXNpYmxlKGZhbHNlKTtcblx0XHRcdFx0b01lYXN1cmVEaW1lbnNpb25UaXRsZS5zZXRUb29sdGlwKG9NZWFzdXJlRGltZW5zaW9uVGl0bGUuZ2V0VGV4dCgpKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIG1lZGlhbiBzY2FsZSBmYWN0b3IuXG5cdCAqXG5cdCAqIEBwYXJhbSBvRGF0YSBWaXN1YWxGaWx0ZXIgZGF0YVxuXHQgKiBAcGFyYW0gc01lYXN1cmVGaWVsZCBQYXRoIG9mIHRoZSBtZWFzdXJlXG5cdCAqIEByZXR1cm5zIE9iamVjdCBjb250YWluaW5nIHNjYWxlIGFuZCBpU2hvcnRSZWZOdW1iZXJcblx0ICovXG5cdF9nZXRNZWRpYW5TY2FsZUZhY3RvcjogZnVuY3Rpb24gKG9EYXRhOiBhbnlbXSwgc01lYXN1cmVGaWVsZDogc3RyaW5nKSB7XG5cdFx0bGV0IGk7XG5cdFx0bGV0IHNjYWxlRmFjdG9yO1xuXHRcdG9EYXRhLnNvcnQoZnVuY3Rpb24gKGE6IGFueSwgYjogYW55KSB7XG5cdFx0XHRpZiAoTnVtYmVyKGFbc01lYXN1cmVGaWVsZF0pIDwgTnVtYmVyKGJbc01lYXN1cmVGaWVsZF0pKSB7XG5cdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdH1cblx0XHRcdGlmIChOdW1iZXIoYVtzTWVhc3VyZUZpZWxkXSkgPiBOdW1iZXIoYltzTWVhc3VyZUZpZWxkXSkpIHtcblx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gMDtcblx0XHR9KTtcblx0XHRpZiAob0RhdGEubGVuZ3RoID4gMCkge1xuXHRcdFx0Ly8gZ2V0IG1lZGlhbiBpbmRleFxuXHRcdFx0Y29uc3QgaU1pZCA9IG9EYXRhLmxlbmd0aCAvIDIsIC8vIGdldCBtaWQgb2YgYXJyYXlcblx0XHRcdFx0Ly8gaWYgaU1pZCBpcyB3aG9sZSBudW1iZXIsIGFycmF5IGxlbmd0aCBpcyBldmVuLCBjYWxjdWxhdGUgbWVkaWFuXG5cdFx0XHRcdC8vIGlmIGlNaWQgaXMgbm90IHdob2xlIG51bWJlciwgYXJyYXkgbGVuZ3RoIGlzIG9kZCwgdGFrZSBtZWRpYW4gYXMgaU1pZCAtIDFcblx0XHRcdFx0aU1lZGlhbiA9XG5cdFx0XHRcdFx0aU1pZCAlIDEgPT09IDBcblx0XHRcdFx0XHRcdD8gKHBhcnNlRmxvYXQob0RhdGFbaU1pZCAtIDFdW3NNZWFzdXJlRmllbGRdKSArIHBhcnNlRmxvYXQob0RhdGFbaU1pZF1bc01lYXN1cmVGaWVsZF0pKSAvIDJcblx0XHRcdFx0XHRcdDogcGFyc2VGbG9hdChvRGF0YVtNYXRoLmZsb29yKGlNaWQpXVtzTWVhc3VyZUZpZWxkXSksXG5cdFx0XHRcdC8vIGdldCBzY2FsZSBmYWN0b3Igb24gbWVkaWFuXG5cdFx0XHRcdHZhbCA9IGlNZWRpYW47XG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgMTQ7IGkrKykge1xuXHRcdFx0XHRzY2FsZUZhY3RvciA9IE1hdGgucG93KDEwLCBpKTtcblx0XHRcdFx0aWYgKE1hdGgucm91bmQoTWF0aC5hYnModmFsKSAvIHNjYWxlRmFjdG9yKSA8IDEwKSB7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRjb25zdCBmaXhlZEludGVnZXIgPSBOdW1iZXJGb3JtYXQuZ2V0SW50ZWdlckluc3RhbmNlKHtcblx0XHRcdHN0eWxlOiBcInNob3J0XCIsXG5cdFx0XHRzaG93U2NhbGU6IGZhbHNlLFxuXHRcdFx0c2hvcnRSZWZOdW1iZXI6IHNjYWxlRmFjdG9yXG5cdFx0fSk7XG5cblx0XHQvLyBhcHBseSBzY2FsZSBmYWN0b3IgdG8gb3RoZXIgdmFsdWVzIGFuZCBjaGVja1xuXHRcdGZvciAoaSA9IDA7IGkgPCBvRGF0YS5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgYURhdGEgPSBvRGF0YVtpXSxcblx0XHRcdFx0c1NjYWxlZFZhbHVlID0gZml4ZWRJbnRlZ2VyLmZvcm1hdChhRGF0YVtzTWVhc3VyZUZpZWxkXSkgYXMgYW55LFxuXHRcdFx0XHRhU2NhbGVkVmFsdWVQYXJ0cyA9IHNTY2FsZWRWYWx1ZS5zcGxpdChcIi5cIik7XG5cdFx0XHQvLyBpZiBzY2FsZWQgdmFsdWUgaGFzIG9ubHkgMCBiZWZvcmUgZGVjaW1hbCBvciAwIGFmdGVyIGRlY2ltYWwgKGV4YW1wbGU6IDAuMDIpXG5cdFx0XHQvLyB0aGVuIGlnbm9yZSB0aGlzIHNjYWxlIGZhY3RvciBlbHNlIHByb2NlZWQgd2l0aCB0aGlzIHNjYWxlIGZhY3RvclxuXHRcdFx0Ly8gaWYgc2NhbGVkIHZhbHVlIGRpdmlkZWQgYnkgMTAwMCBpcyA+PSAxMDAwIHRoZW4gYWxzbyBpZ25vcmUgc2NhbGUgZmFjdG9yXG5cdFx0XHRpZiAoXG5cdFx0XHRcdCghYVNjYWxlZFZhbHVlUGFydHNbMV0gJiYgcGFyc2VJbnQoYVNjYWxlZFZhbHVlUGFydHNbMF0sIDEwKSA9PT0gMCkgfHxcblx0XHRcdFx0KGFTY2FsZWRWYWx1ZVBhcnRzWzFdICYmIHBhcnNlSW50KGFTY2FsZWRWYWx1ZVBhcnRzWzBdLCAxMCkgPT09IDAgJiYgYVNjYWxlZFZhbHVlUGFydHNbMV0uaW5kZXhPZihcIjBcIikgPT09IDApIHx8XG5cdFx0XHRcdHNTY2FsZWRWYWx1ZSAvIDEwMDAgPj0gMTAwMFxuXHRcdFx0KSB7XG5cdFx0XHRcdHNjYWxlRmFjdG9yID0gdW5kZWZpbmVkO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdGlTaG9ydFJlZk51bWJlcjogc2NhbGVGYWN0b3IsXG5cdFx0XHRzY2FsZTogc2NhbGVGYWN0b3IgPyAoZml4ZWRJbnRlZ2VyIGFzIGFueSkuZ2V0U2NhbGUoKSA6IFwiXCJcblx0XHR9O1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBmb3JtYXR0ZWQgbnVtYmVyIGFjY29yZGluZyB0byB0aGUgcnVsZXMgb2YgVmlzdWFsQ2hhcnRGaWx0ZXJzLlxuXHQgKlxuXHQgKiBAcGFyYW0gdmFsdWUgVmFsdWUgd2hpY2ggbmVlZHMgdG8gYmUgZm9ybWF0dGVkXG5cdCAqIEBwYXJhbSBzY2FsZUZhY3RvciBTY2FsZUZhY3RvciB0byB3aGljaCB0aGUgdmFsdWUgbmVlZHMgdG8gYmUgc2NhbGVkXG5cdCAqIEBwYXJhbSBudW1iZXJPZkZyYWN0aW9uYWxEaWdpdHMgTnVtYmVyT2ZGcmFjdGlvbmFsRGlnaXRzIGRpZ2l0cyBpbiB0aGUgZGVjaW1hbHMgYWNjb3JkaW5nIHRvIHNjYWxlXG5cdCAqIEBwYXJhbSBjdXJyZW5jeSBDdXJyZW5jeSBjb2RlXG5cdCAqIEByZXR1cm5zIFRoZSBmb3JtYXR0ZWQgbnVtYmVyXG5cdCAqL1xuXHRnZXRGb3JtYXR0ZWROdW1iZXI6IGZ1bmN0aW9uICh2YWx1ZTogc3RyaW5nIHwgbnVtYmVyLCBzY2FsZUZhY3Rvcj86IG51bWJlciwgbnVtYmVyT2ZGcmFjdGlvbmFsRGlnaXRzPzogbnVtYmVyLCBjdXJyZW5jeT86IHN0cmluZykge1xuXHRcdGxldCBmaXhlZEludGVnZXI7XG5cdFx0dmFsdWUgPSB0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgPyBOdW1iZXIodmFsdWUucmVwbGFjZSgvLC9nLCBcIlwiKSkgOiB2YWx1ZTtcblxuXHRcdGlmIChjdXJyZW5jeSkge1xuXHRcdFx0Y29uc3QgY3VycmVuY3lGb3JtYXQgPSBOdW1iZXJGb3JtYXQuZ2V0Q3VycmVuY3lJbnN0YW5jZSh7XG5cdFx0XHRcdHNob3dNZWFzdXJlOiBmYWxzZVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gY3VycmVuY3lGb3JtYXQuZm9ybWF0KHBhcnNlRmxvYXQodmFsdWUgYXMgYW55KSwgY3VycmVuY3kpO1xuXHRcdFx0Ly8gcGFyc2VGbG9hdCh2YWx1ZSkgaXMgcmVxdWlyZWQgb3RoZXJ3aXNlIC12ZSB2YWx1ZSBhcmUgd3JvbmdseSByb3VuZGVkIG9mZlxuXHRcdFx0Ly8gRXhhbXBsZTogXCItMS45XCIgcm91bmRzIG9mZiB0byAtMSBpbnN0ZWFkIG9mIC0yLiBob3dldmVyIC0xLjkgcm91bmRzIG9mZiB0byAtMlxuXHRcdH0gZWxzZSBpZiAoc2NhbGVGYWN0b3IpIHtcblx0XHRcdGZpeGVkSW50ZWdlciA9IE51bWJlckZvcm1hdC5nZXRGbG9hdEluc3RhbmNlKHtcblx0XHRcdFx0c3R5bGU6IFwic2hvcnRcIixcblx0XHRcdFx0c2hvd1NjYWxlOiBmYWxzZSxcblx0XHRcdFx0c2hvcnRSZWZOdW1iZXI6IHNjYWxlRmFjdG9yLFxuXHRcdFx0XHRzaG9ydERlY2ltYWxzOiBudW1iZXJPZkZyYWN0aW9uYWxEaWdpdHNcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGZpeGVkSW50ZWdlci5mb3JtYXQocGFyc2VGbG9hdCh2YWx1ZSBhcyBhbnkpKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Zml4ZWRJbnRlZ2VyID0gTnVtYmVyRm9ybWF0LmdldEZsb2F0SW5zdGFuY2Uoe1xuXHRcdFx0XHRkZWNpbWFsczogbnVtYmVyT2ZGcmFjdGlvbmFsRGlnaXRzXG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBmaXhlZEludGVnZXIuZm9ybWF0KHBhcnNlRmxvYXQodmFsdWUgYXMgYW55KSk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBBcHBsaWVzIHRoZSBVT00gdG8gdGhlIHRpdGxlIG9mIHRoZSB2aXN1YWwgZmlsdGVyIGNvbnRyb2wuXG5cdCAqXG5cdCAqIEBwYXJhbSBvSW50ZXJhY3RpdmVDaGFydCBJbnRlcmFjdGl2ZUNoYXJ0IGluIHRoZSBWaXN1YWxGaWx0ZXIgY29udHJvbFxuXHQgKiBAcGFyYW0gb0NvbnRleHREYXRhIERhdGEgb2YgdGhlIFZpc3VhbEZpbHRlclxuXHQgKiBAcGFyYW0gb1ZpZXcgSW5zdGFuY2Ugb2YgdGhlIHZpZXdcblx0ICogQHBhcmFtIHNJbmZvUGF0aCBJbnRlcm5hbCBtb2RlbCBjb250ZXh0IHBhdGggdG8gc3RvcmUgaW5mby5cblx0ICovXG5cdGFwcGx5VU9NVG9UaXRsZTogZnVuY3Rpb24gKG9JbnRlcmFjdGl2ZUNoYXJ0OiBhbnksIG9Db250ZXh0RGF0YTogYW55LCBvVmlldzogVmlldywgc0luZm9QYXRoOiBzdHJpbmcpIHtcblx0XHRjb25zdCB2VU9NID0gb0ludGVyYWN0aXZlQ2hhcnQuZGF0YShcInVvbVwiKTtcblx0XHRsZXQgc1VPTTtcblx0XHRsZXQgc0N1cnJlbmN5O1xuXHRcdGlmICh2VU9NICYmIHZVT01bXCJJU09DdXJyZW5jeVwiXSkge1xuXHRcdFx0c1VPTSA9IHZVT01bXCJJU09DdXJyZW5jeVwiXTtcblx0XHRcdHNDdXJyZW5jeSA9IHNVT00uJFBhdGggPyBvQ29udGV4dERhdGFbc1VPTS4kUGF0aF0gOiBzVU9NO1xuXHRcdH0gZWxzZSBpZiAodlVPTSAmJiB2VU9NW1wiVW5pdFwiXSkge1xuXHRcdFx0c1VPTSA9IHZVT01bXCJVbml0XCJdO1xuXHRcdH1cblx0XHRpZiAoc1VPTSkge1xuXHRcdFx0Y29uc3Qgc1VPTVZhbHVlID0gc1VPTS4kUGF0aCA/IG9Db250ZXh0RGF0YVtzVU9NLiRQYXRoXSA6IHNVT007XG5cdFx0XHRjb25zdCBvSW50ZXJuYWxNb2RlbENvbnRleHQgPSBvVmlldy5nZXRCaW5kaW5nQ29udGV4dChcImludGVybmFsXCIpIGFzIEludGVybmFsTW9kZWxDb250ZXh0O1xuXHRcdFx0b0ludGVybmFsTW9kZWxDb250ZXh0LnNldFByb3BlcnR5KGB1b20vJHtzSW5mb1BhdGh9YCwgc1VPTVZhbHVlKTtcblx0XHRcdGlmIChzQ3VycmVuY3kpIHtcblx0XHRcdFx0b0ludGVybmFsTW9kZWxDb250ZXh0LnNldFByb3BlcnR5KGBjdXJyZW5jeS8ke3NJbmZvUGF0aH1gLCBzVU9NVmFsdWUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0LyoqXG5cdCAqIFVwZGF0ZXMgdGhlIHNjYWxlIGZhY3RvciBpbiB0aGUgdGl0bGUgb2YgdGhlIHZpc3VhbCBmaWx0ZXIuXG5cdCAqXG5cdCAqIEBwYXJhbSBvSW50ZXJhY3RpdmVDaGFydCBJbnRlcmFjdGl2ZUNoYXJ0IGluIHRoZSBWaXN1YWxGaWx0ZXIgY29udHJvbFxuXHQgKiBAcGFyYW0gb1ZpZXcgSW5zdGFuY2Ugb2YgdGhlIHZpZXdcblx0ICogQHBhcmFtIHNWRklkIFZpc3VhbEZpbHRlciBjb250cm9sIElEXG5cdCAqIEBwYXJhbSBzSW5mb1BhdGggSW50ZXJuYWwgbW9kZWwgY29udGV4dCBwYXRoIHRvIHN0b3JlIGluZm8uXG5cdCAqL1xuXHR1cGRhdGVDaGFydFNjYWxlRmFjdG9yVGl0bGU6IGZ1bmN0aW9uIChvSW50ZXJhY3RpdmVDaGFydDogYW55LCBvVmlldzogVmlldywgc1ZGSWQ6IHN0cmluZywgc0luZm9QYXRoOiBzdHJpbmcpIHtcblx0XHRpZiAoIW9JbnRlcmFjdGl2ZUNoYXJ0LmRhdGEoXCJzY2FsZWZhY3RvclwiKSkge1xuXHRcdFx0dGhpcy5hcHBseU1lZGlhblNjYWxlVG9DaGFydERhdGEob0ludGVyYWN0aXZlQ2hhcnQsIG9WaWV3LCBzVkZJZCwgc0luZm9QYXRoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgZml4ZWRJbnRlZ2VyID0gTnVtYmVyRm9ybWF0LmdldEludGVnZXJJbnN0YW5jZSh7XG5cdFx0XHRcdHN0eWxlOiBcInNob3J0XCIsXG5cdFx0XHRcdHNob3dTY2FsZTogZmFsc2UsXG5cdFx0XHRcdHNob3J0UmVmTnVtYmVyOiBvSW50ZXJhY3RpdmVDaGFydC5kYXRhKFwic2NhbGVmYWN0b3JcIilcblx0XHRcdH0pO1xuXHRcdFx0Y29uc3Qgb0ludGVybmFsTW9kZWxDb250ZXh0ID0gb1ZpZXcuZ2V0QmluZGluZ0NvbnRleHQoXCJpbnRlcm5hbFwiKSBhcyBJbnRlcm5hbE1vZGVsQ29udGV4dDtcblx0XHRcdG9JbnRlcm5hbE1vZGVsQ29udGV4dC5zZXRQcm9wZXJ0eShgc2NhbGVmYWN0b3IvJHtzSW5mb1BhdGh9YCwgKGZpeGVkSW50ZWdlciBhcyBhbnkpLmdldFNjYWxlKCkpO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICpcblx0ICogQHBhcmFtIHMxOG5NZXNzYWdlVGl0bGUgVGV4dCBvZiB0aGUgZXJyb3IgbWVzc2FnZSB0aXRsZS5cblx0ICogQHBhcmFtIHMxOG5NZXNzYWdlIFRleHQgb2YgdGhlIGVycm9yIG1lc3NhZ2UgZGVzY3JpcHRpb24uXG5cdCAqIEBwYXJhbSBzSW5mb1BhdGggSW50ZXJuYWwgbW9kZWwgY29udGV4dCBwYXRoIHRvIHN0b3JlIGluZm8uXG5cdCAqIEBwYXJhbSBvVmlldyBJbnN0YW5jZSBvZiB0aGUgdmlldy5cblx0ICovXG5cdGFwcGx5RXJyb3JNZXNzYWdlQW5kVGl0bGU6IGZ1bmN0aW9uIChzMThuTWVzc2FnZVRpdGxlOiBzdHJpbmcsIHMxOG5NZXNzYWdlOiBzdHJpbmcsIHNJbmZvUGF0aDogc3RyaW5nLCBvVmlldzogVmlldykge1xuXHRcdGNvbnN0IG9JbnRlcm5hbE1vZGVsQ29udGV4dCA9IG9WaWV3LmdldEJpbmRpbmdDb250ZXh0KFwiaW50ZXJuYWxcIikgYXMgSW50ZXJuYWxNb2RlbENvbnRleHQ7XG5cdFx0b0ludGVybmFsTW9kZWxDb250ZXh0LnNldFByb3BlcnR5KHNJbmZvUGF0aCwge30pO1xuXHRcdG9JbnRlcm5hbE1vZGVsQ29udGV4dC5zZXRQcm9wZXJ0eShzSW5mb1BhdGgsIHtcblx0XHRcdFwiZXJyb3JNZXNzYWdlVGl0bGVcIjogczE4bk1lc3NhZ2VUaXRsZSxcblx0XHRcdFwiZXJyb3JNZXNzYWdlXCI6IHMxOG5NZXNzYWdlLFxuXHRcdFx0XCJzaG93RXJyb3JcIjogdHJ1ZVxuXHRcdH0pO1xuXHR9LFxuXHQvKipcblx0ICogQ2hlY2tzIGlmIG11bHRpcGxlIHVuaXRzIGFyZSBwcmVzZW50LlxuXHQgKlxuXHQgKiBAcGFyYW0gb0NvbnRleHRzIENvbnRleHRzIG9mIHRoZSBWaXN1YWxGaWx0ZXJcblx0ICogQHBhcmFtIHNVbml0ZmllbGQgVGhlIHBhdGggb2YgdGhlIHVuaXQgZmllbGRcblx0ICogQHJldHVybnMgUmV0dXJucyBpZiBtdWx0aXBsZSB1bml0cyBhcmUgY29uZmlndXJlZCBvciBub3Rcblx0ICovXG5cdGNoZWNrTXVsaXRVbml0OiBmdW5jdGlvbiAob0NvbnRleHRzOiBDb250ZXh0W10sIHNVbml0ZmllbGQ6IHN0cmluZykge1xuXHRcdGNvbnN0IGFEYXRhID0gW107XG5cdFx0aWYgKG9Db250ZXh0cyAmJiBzVW5pdGZpZWxkKSB7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG9Db250ZXh0cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRjb25zdCBhQ29udGV4dERhdGEgPSBvQ29udGV4dHNbaV0gJiYgKG9Db250ZXh0c1tpXS5nZXRPYmplY3QoKSBhcyBhbnkpO1xuXHRcdFx0XHRhRGF0YS5wdXNoKGFDb250ZXh0RGF0YVtzVW5pdGZpZWxkXSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiAhIWFEYXRhLnJlZHVjZShmdW5jdGlvbiAoZGF0YTogYW55LCBrZXk6IGFueSkge1xuXHRcdFx0cmV0dXJuIGRhdGEgPT09IGtleSA/IGRhdGEgOiBOYU47XG5cdFx0fSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIFNldHMgYW4gZXJyb3IgbWVzc2FnZSBpZiBtdWx0aXBsZSBVT00gYXJlIHByZXNlbnQuXG5cdCAqXG5cdCAqIEBwYXJhbSBvRGF0YSBEYXRhIG9mIHRoZSBWaXN1YWxGaWx0ZXIgY29udHJvbFxuXHQgKiBAcGFyYW0gb0ludGVyYWN0aXZlQ2hhcnQgSW50ZXJhY3RpdmVDaGFydCBpbiB0aGUgVmlzdWFsRmlsdGVyIGNvbnRyb2xcblx0ICogQHBhcmFtIHNJbmZvUGF0aCBJbnRlcm5hbCBtb2RlbCBjb250ZXh0IHBhdGggdG8gc3RvcmUgaW5mby5cblx0ICogQHBhcmFtIG9SZXNvdXJjZUJ1bmRsZSBUaGUgcmVzb3VyY2UgYnVuZGxlXG5cdCAqIEBwYXJhbSBvVmlldyBJbnN0YW5jZSBvZiB0aGUgdmlld1xuXHQgKi9cblx0c2V0TXVsdGlVT01NZXNzYWdlOiBmdW5jdGlvbiAoXG5cdFx0b0RhdGE6IENvbnRleHRbXSxcblx0XHRvSW50ZXJhY3RpdmVDaGFydDogYW55LFxuXHRcdHNJbmZvUGF0aDogc3RyaW5nLFxuXHRcdG9SZXNvdXJjZUJ1bmRsZTogUmVzb3VyY2VCdW5kbGUsXG5cdFx0b1ZpZXc6IFZpZXdcblx0KSB7XG5cdFx0Y29uc3QgdlVPTSA9IG9JbnRlcmFjdGl2ZUNoYXJ0LmRhdGEoXCJ1b21cIik7XG5cdFx0Y29uc3Qgc0lzQ3VycmVuY3kgPSB2VU9NICYmIHZVT01bXCJJU09DdXJyZW5jeVwiXSAmJiB2VU9NW1wiSVNPQ3VycmVuY3lcIl0uJFBhdGg7XG5cdFx0Y29uc3Qgc0lzVW5pdCA9IHZVT00gJiYgdlVPTVtcIlVuaXRcIl0gJiYgdlVPTVtcIlVuaXRcIl0uJFBhdGg7XG5cdFx0Y29uc3Qgc1VuaXRmaWVsZCA9IHNJc0N1cnJlbmN5IHx8IHNJc1VuaXQ7XG5cdFx0bGV0IHMxOG5NZXNzYWdlVGl0bGUsIHMxOG5NZXNzYWdlO1xuXHRcdGlmIChzVW5pdGZpZWxkKSB7XG5cdFx0XHRpZiAoIXRoaXMuY2hlY2tNdWxpdFVuaXQob0RhdGEsIHNVbml0ZmllbGQpKSB7XG5cdFx0XHRcdGlmIChzSXNDdXJyZW5jeSkge1xuXHRcdFx0XHRcdHMxOG5NZXNzYWdlVGl0bGUgPSBvUmVzb3VyY2VCdW5kbGUuZ2V0VGV4dChcIk1fVklTVUFMX0ZJTFRFUlNfRVJST1JfTUVTU0FHRV9USVRMRVwiKTtcblx0XHRcdFx0XHRzMThuTWVzc2FnZSA9IG9SZXNvdXJjZUJ1bmRsZS5nZXRUZXh0KFwiTV9WSVNVQUxfRklMVEVSU19NVUxUSVBMRV9DVVJSRU5DWVwiLCBzVW5pdGZpZWxkKTtcblx0XHRcdFx0XHR0aGlzLmFwcGx5RXJyb3JNZXNzYWdlQW5kVGl0bGUoczE4bk1lc3NhZ2VUaXRsZSwgczE4bk1lc3NhZ2UsIHNJbmZvUGF0aCwgb1ZpZXcpO1xuXHRcdFx0XHRcdExvZy53YXJuaW5nKGBGaWx0ZXIgaXMgc2V0IGZvciBtdWx0aXBsZSBDdXJyZW5jeSBmb3Ike3NVbml0ZmllbGR9YCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoc0lzVW5pdCkge1xuXHRcdFx0XHRcdHMxOG5NZXNzYWdlVGl0bGUgPSBvUmVzb3VyY2VCdW5kbGUuZ2V0VGV4dChcIk1fVklTVUFMX0ZJTFRFUlNfRVJST1JfTUVTU0FHRV9USVRMRVwiKTtcblx0XHRcdFx0XHRzMThuTWVzc2FnZSA9IG9SZXNvdXJjZUJ1bmRsZS5nZXRUZXh0KFwiTV9WSVNVQUxfRklMVEVSU19NVUxUSVBMRV9VTklUXCIsIHNVbml0ZmllbGQpO1xuXHRcdFx0XHRcdHRoaXMuYXBwbHlFcnJvck1lc3NhZ2VBbmRUaXRsZShzMThuTWVzc2FnZVRpdGxlLCBzMThuTWVzc2FnZSwgc0luZm9QYXRoLCBvVmlldyk7XG5cdFx0XHRcdFx0TG9nLndhcm5pbmcoYEZpbHRlciBpcyBzZXQgZm9yIG11bHRpcGxlIFVPTXMgZm9yJHtzVW5pdGZpZWxkfWApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBTZXRzIGFuIGVycm9yIG1lc3NhZ2UgaWYgcmVzcG9uc2UgZGF0YSBpcyBlbXB0eS5cblx0ICpcblx0ICogQHBhcmFtIHNJbmZvUGF0aCBJbnRlcm5hbCBtb2RlbCBjb250ZXh0IHBhdGggdG8gc3RvcmUgaW5mby5cblx0ICogQHBhcmFtIG9SZXNvdXJjZUJ1bmRsZSBUaGUgcmVzb3VyY2UgYnVuZGxlXG5cdCAqIEBwYXJhbSBvVmlldyBJbnN0YW5jZSBvZiB0aGUgdmlld1xuXHQgKi9cblx0c2V0Tm9EYXRhTWVzc2FnZTogZnVuY3Rpb24gKHNJbmZvUGF0aDogc3RyaW5nLCBvUmVzb3VyY2VCdW5kbGU6IFJlc291cmNlQnVuZGxlLCBvVmlldzogVmlldykge1xuXHRcdGNvbnN0IHMxOG5NZXNzYWdlVGl0bGUgPSBvUmVzb3VyY2VCdW5kbGUuZ2V0VGV4dChcIk1fVklTVUFMX0ZJTFRFUlNfRVJST1JfTUVTU0FHRV9USVRMRVwiKTtcblx0XHRjb25zdCBzMThuTWVzc2FnZSA9IG9SZXNvdXJjZUJ1bmRsZS5nZXRUZXh0KFwiTV9WSVNVQUxfRklMVEVSX05PX0RBVEFfVEVYVFwiKTtcblx0XHR0aGlzLmFwcGx5RXJyb3JNZXNzYWdlQW5kVGl0bGUoczE4bk1lc3NhZ2VUaXRsZSwgczE4bk1lc3NhZ2UsIHNJbmZvUGF0aCwgb1ZpZXcpO1xuXHR9LFxuXHRjb252ZXJ0RmlsdGVyQ29uZGlvbnM6IGZ1bmN0aW9uIChvRmlsdGVyQ29uZGl0aW9uczogYW55KSB7XG5cdFx0Y29uc3Qgb0NvbnZlcnRlZENvbmRpdGlvbnM6IGFueSA9IHt9O1xuXHRcdE9iamVjdC5rZXlzKG9GaWx0ZXJDb25kaXRpb25zKS5mb3JFYWNoKGZ1bmN0aW9uIChzS2V5OiBzdHJpbmcpIHtcblx0XHRcdGNvbnN0IGFDb252ZXJ0ZWRDb25kaXRpb25zID0gW107XG5cdFx0XHRjb25zdCBhQ29uZGl0aW9ucyA9IG9GaWx0ZXJDb25kaXRpb25zW3NLZXldO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhQ29uZGl0aW9ucy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRjb25zdCB2YWx1ZXMgPSBhQ29uZGl0aW9uc1tpXS52YWx1ZTIgPyBbYUNvbmRpdGlvbnNbaV0udmFsdWUxLCBhQ29uZGl0aW9uc1tpXS52YWx1ZTJdIDogW2FDb25kaXRpb25zW2ldLnZhbHVlMV07XG5cdFx0XHRcdGFDb252ZXJ0ZWRDb25kaXRpb25zLnB1c2goXG5cdFx0XHRcdFx0Q29uZGl0aW9uLmNyZWF0ZUNvbmRpdGlvbihhQ29uZGl0aW9uc1tpXS5vcGVyYXRvciwgdmFsdWVzLCBudWxsLCBudWxsLCBcIlZhbGlkYXRlZFwiIGFzIENvbmRpdGlvblZhbGlkYXRlZClcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdGlmIChhQ29udmVydGVkQ29uZGl0aW9ucy5sZW5ndGgpIHtcblx0XHRcdFx0b0NvbnZlcnRlZENvbmRpdGlvbnNbc0tleV0gPSBhQ29udmVydGVkQ29uZGl0aW9ucztcblx0XHRcdH1cblx0XHR9KTtcblx0XHRyZXR1cm4gb0NvbnZlcnRlZENvbmRpdGlvbnM7XG5cdH0sXG5cdGdldEN1c3RvbUNvbmRpdGlvbnM6IGZ1bmN0aW9uIChSYW5nZTogYW55LCBvVmFsaWRQcm9wZXJ0eTogYW55LCBzUHJvcGVydHlOYW1lOiBhbnkpIHtcblx0XHRsZXQgdmFsdWUxLCB2YWx1ZTI7XG5cdFx0aWYgKG9WYWxpZFByb3BlcnR5LiRUeXBlID09PSBcIkVkbS5EYXRlVGltZU9mZnNldFwiKSB7XG5cdFx0XHR2YWx1ZTEgPSB0aGlzLl9wYXJzZURhdGVUaW1lKGdldFR5cGVDb21wbGlhbnRWYWx1ZSh0aGlzLl9mb3JtYXREYXRlVGltZShSYW5nZS5Mb3cpLCBvVmFsaWRQcm9wZXJ0eS4kVHlwZSkpO1xuXHRcdFx0dmFsdWUyID0gUmFuZ2UuSGlnaCA/IHRoaXMuX3BhcnNlRGF0ZVRpbWUoZ2V0VHlwZUNvbXBsaWFudFZhbHVlKHRoaXMuX2Zvcm1hdERhdGVUaW1lKFJhbmdlLkhpZ2gpLCBvVmFsaWRQcm9wZXJ0eS4kVHlwZSkpIDogbnVsbDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFsdWUxID0gUmFuZ2UuTG93O1xuXHRcdFx0dmFsdWUyID0gUmFuZ2UuSGlnaCA/IFJhbmdlLkhpZ2ggOiBudWxsO1xuXHRcdH1cblx0XHRyZXR1cm4ge1xuXHRcdFx0b3BlcmF0b3I6IFJhbmdlLk9wdGlvbiA/IGdldFJhbmdlUHJvcGVydHkoUmFuZ2UuT3B0aW9uLiRFbnVtTWVtYmVyIHx8IFJhbmdlLk9wdGlvbikgOiBudWxsLFxuXHRcdFx0dmFsdWUxOiB2YWx1ZTEsXG5cdFx0XHR2YWx1ZTI6IHZhbHVlMixcblx0XHRcdHBhdGg6IHNQcm9wZXJ0eU5hbWVcblx0XHR9O1xuXHR9LFxuXHRfcGFyc2VEYXRlVGltZTogZnVuY3Rpb24gKHNWYWx1ZTogYW55KSB7XG5cdFx0cmV0dXJuIHRoaXMuX2dldERhdGVUaW1lVHlwZUluc3RhbmNlKCkucGFyc2VWYWx1ZShzVmFsdWUsIFwic3RyaW5nXCIpO1xuXHR9LFxuXHRfZm9ybWF0RGF0ZVRpbWU6IGZ1bmN0aW9uIChzVmFsdWU6IGFueSkge1xuXHRcdHJldHVybiB0aGlzLl9nZXREYXRlVGltZVR5cGVJbnN0YW5jZSgpLmZvcm1hdFZhbHVlKHNWYWx1ZSwgXCJzdHJpbmdcIik7XG5cdH0sXG5cdF9nZXREYXRlVGltZVR5cGVJbnN0YW5jZTogZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiBuZXcgRGF0ZVRpbWVPZmZzZXQoeyBwYXR0ZXJuOiBcInl5eXktTU0tZGRUSEg6bW06c3NaXCIsIGNhbGVuZGFyVHlwZTogXCJHcmVnb3JpYW5cIiB9LCB7IFY0OiB0cnVlIH0pO1xuXHR9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBWaXN1YWxGaWx0ZXJVdGlscztcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7Ozs7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