/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/base/util/ObjectPath", "sap/fe/core/templating/DisplayModeFormatter", "sap/m/Button", "sap/m/table/Util", "sap/ui/dom/units/Rem"], function (Log, ObjectPath, DisplayModeFormatter, Button, Util, Rem) {
  "use strict";

  var EDM_TYPE_MAPPING = DisplayModeFormatter.EDM_TYPE_MAPPING;

  var TableSizeHelper = {
    nbCalls: 0,
    oBtn: undefined,
    propertyHelper: undefined,
    init: function () {
      // Create a new button in static area sap.ui.getCore().getStaticAreaRef()
      this.nbCalls = this.nbCalls ? this.nbCalls : 0;
      this.nbCalls++;
      this.oBtn = this.oBtn ? this.oBtn : new Button().placeAt(sap.ui.getCore().getStaticAreaRef()); // Hide button from accessibility tree

      this.oBtn.setVisible(false);
    },

    /**
     * Method to calculate button's width from a temp created button placed in static area.
     *
     * @param sText The text to masure inside the Button.
     * @returns The value of the Button width.
     */
    getButtonWidth: function (sText) {
      if (this.oBtn.getVisible() === false) {
        this.oBtn.setVisible(true);
      }

      this.oBtn.setText(sText); //adding missing styles from buttons inside a table
      // for sync rendering

      this.oBtn.rerender();
      var nButtonWidth = Rem.fromPx(this.oBtn.getDomRef().scrollWidth);
      this.oBtn.setVisible(false);
      return Math.round(nButtonWidth * 100) / 100;
    },

    /**
     * Method to calculate MDC Column's width.
     *
     * @param oProperty The Property or PropertyInfo Object for which the width will be calculated.
     * @private
     * @alias sap.fe.macros.TableSizeHelper
     * @returns The value of the Column width.
     */
    getMDCColumnWidth: function (oProperty) {
      var _EDM_TYPE_MAPPING;

      var propertyODataType = (_EDM_TYPE_MAPPING = EDM_TYPE_MAPPING[oProperty.typeConfig ? oProperty.typeConfig.className : oProperty.$Type]) === null || _EDM_TYPE_MAPPING === void 0 ? void 0 : _EDM_TYPE_MAPPING.type;
      var PropertyODataConstructor = propertyODataType ? ObjectPath.get(propertyODataType) : null;
      var instance = PropertyODataConstructor ? new PropertyODataConstructor() : null;
      var sSize = instance ? Util.calcColumnWidth(instance) : null;

      if (!sSize) {
        Log.error("Cannot compute the column width for property: ".concat(oProperty.name));
      }

      return sSize ? parseFloat(sSize.replace("Rem", "")) : 0;
    },
    _getPropertyHelperCache: function (sTableId) {
      return this.propertyHelper && this.propertyHelper[sTableId];
    },
    _setPropertyHelperCache: function (sTableId, oPropertyHelper) {
      this.propertyHelper = Object.assign({}, this.propertyHelper);
      this.propertyHelper[sTableId] = oPropertyHelper;
    },

    /**
     * Method to calculate  width of a DataFieldAnnotation object contained in a fieldgroup.
     *
     * @param oData DataFieldAnnotation object.
     * @param bShowDataFieldsLabel Label is displayed inside the field
     * @param aProperties Array containing all PropertyInfo objects.
     * @param oContext Context Object of the parent property.
     * @private
     * @alias sap.fe.macros.TableSizeHelper
     * @returns Object containing the width of the label and the width of the property.
     */
    getWidthForDataFieldForAnnotation: function (oData, bShowDataFieldsLabel, aProperties, oContext) {
      var oObject = oContext.getObject(oData.Target.$AnnotationPath),
          oValue = oObject.Value;
      var oTargetedProperty,
          nPropertyWidth = 0,
          fLabelWidth = 0;

      if (oValue) {
        oTargetedProperty = this._getPropertiesByPath(aProperties, oContext.getObject(oData.Target.$AnnotationPath).Value.$Path);
        var oVisualization = oContext.getObject(oData.Target.$AnnotationPath).Visualization;

        switch (oVisualization && oVisualization.$EnumMember) {
          case "com.sap.vocabularies.UI.v1.VisualizationType/Rating":
            var iTargetedValue = oContext.getObject(oData.Target.$AnnotationPath).TargetValue;
            nPropertyWidth = parseInt(iTargetedValue, 10) * 1.375;
            break;

          case "com.sap.vocabularies.UI.v1.VisualizationType/Progress":
          default:
            nPropertyWidth = 5;
        }

        var sLabel = oTargetedProperty ? oTargetedProperty.label : oData.Label || "";
        fLabelWidth = bShowDataFieldsLabel && sLabel ? TableSizeHelper.getButtonWidth(sLabel) : 0;
      } else if (oObject.$Type === "com.sap.vocabularies.Communication.v1.ContactType") {
        var propertyPath = oData.Target.$AnnotationPath.replace(/\/@.*/, "");
        var fullNameProperty = oContext.getObject(propertyPath + "/" + oObject.fn.$Path);
        nPropertyWidth = this.getMDCColumnWidth(fullNameProperty);
      } else {
        Log.error("Cannot compute width for type object: ".concat(oObject.$Type));
      }

      return {
        labelWidth: fLabelWidth,
        propertyWidth: nPropertyWidth
      };
    },

    /**
     * Method to calculate  width of a DataField object.
     *
     * @param {object} oData DataFieldAnnotation object.
     * @param {boolean} bShowDataFieldsLabel Label is displayed inside the field.
     * @param {Array} aProperties Array containing all PropertyInfo objects.
     * @param {object} oContext Context Object of the parent property.
     * @param {object} oTable The Table reference.
     * @private
     * @alias sap.fe.macros.TableSizeHelper
     * @returns {object} Object containing the width of the label and the width of the property.
     */
    getWidthForDataField: function (oData, bShowDataFieldsLabel, aProperties, oContext) {
      var oTargetedProperty = this._getPropertiesByPath(aProperties, oData.Value.$Path),
          oTextArrangementTarget = oContext.getObject("".concat(oData.Value.$Path, "@com.sap.vocabularies.Common.v1.Text")),
          oTextArrangementType = oContext.getObject("".concat(oData.Value.$Path, "@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"));

      var nPropertyWidth = 0,
          fLabelWidth = 0;

      if (oTargetedProperty) {
        var TextArrangmentTargetWidth = 0;

        if (oTextArrangementTarget && oTextArrangementType) {
          var oTextArrangementTargetProperty = this._getPropertiesByPath(aProperties, oTextArrangementTarget.$Path);

          TextArrangmentTargetWidth = oTextArrangementTargetProperty && this.getMDCColumnWidth(oTextArrangementTargetProperty) - 1;
        }

        switch (oTextArrangementType && oTextArrangementType.$EnumMember) {
          case "com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst":
          case "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast":
            nPropertyWidth = this.getMDCColumnWidth(oTargetedProperty) - 1 + TextArrangmentTargetWidth;
            break;

          case "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly":
            nPropertyWidth = TextArrangmentTargetWidth;
            break;

          case "com.sap.vocabularies.UI.v1.TextArrangementType/TextSeparate":
          default:
            nPropertyWidth = this.getMDCColumnWidth(oTargetedProperty) - 1;
        }

        var sLabel = oData.Label ? oData.Label : oTargetedProperty.label;
        fLabelWidth = bShowDataFieldsLabel && sLabel ? TableSizeHelper.getButtonWidth(sLabel) : 0;
      } else {
        Log.error("Cannot compute width for type object: ".concat(oData.$Type));
      }

      return {
        labelWidth: fLabelWidth,
        propertyWidth: nPropertyWidth
      };
    },
    _getPropertiesByPath: function (aProperties, sPath) {
      return aProperties.find(function (oProperty) {
        return oProperty.path === sPath;
      });
    },
    exit: function () {
      this.nbCalls--;

      if (this.nbCalls === 0) {
        this.oBtn.destroy();
        this.oBtn = null;
      }
    }
  };
  return TableSizeHelper;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJUYWJsZVNpemVIZWxwZXIiLCJuYkNhbGxzIiwib0J0biIsInVuZGVmaW5lZCIsInByb3BlcnR5SGVscGVyIiwiaW5pdCIsIkJ1dHRvbiIsInBsYWNlQXQiLCJzYXAiLCJ1aSIsImdldENvcmUiLCJnZXRTdGF0aWNBcmVhUmVmIiwic2V0VmlzaWJsZSIsImdldEJ1dHRvbldpZHRoIiwic1RleHQiLCJnZXRWaXNpYmxlIiwic2V0VGV4dCIsInJlcmVuZGVyIiwibkJ1dHRvbldpZHRoIiwiUmVtIiwiZnJvbVB4IiwiZ2V0RG9tUmVmIiwic2Nyb2xsV2lkdGgiLCJNYXRoIiwicm91bmQiLCJnZXRNRENDb2x1bW5XaWR0aCIsIm9Qcm9wZXJ0eSIsInByb3BlcnR5T0RhdGFUeXBlIiwiRURNX1RZUEVfTUFQUElORyIsInR5cGVDb25maWciLCJjbGFzc05hbWUiLCIkVHlwZSIsInR5cGUiLCJQcm9wZXJ0eU9EYXRhQ29uc3RydWN0b3IiLCJPYmplY3RQYXRoIiwiZ2V0IiwiaW5zdGFuY2UiLCJzU2l6ZSIsIlV0aWwiLCJjYWxjQ29sdW1uV2lkdGgiLCJMb2ciLCJlcnJvciIsIm5hbWUiLCJwYXJzZUZsb2F0IiwicmVwbGFjZSIsIl9nZXRQcm9wZXJ0eUhlbHBlckNhY2hlIiwic1RhYmxlSWQiLCJfc2V0UHJvcGVydHlIZWxwZXJDYWNoZSIsIm9Qcm9wZXJ0eUhlbHBlciIsIk9iamVjdCIsImFzc2lnbiIsImdldFdpZHRoRm9yRGF0YUZpZWxkRm9yQW5ub3RhdGlvbiIsIm9EYXRhIiwiYlNob3dEYXRhRmllbGRzTGFiZWwiLCJhUHJvcGVydGllcyIsIm9Db250ZXh0Iiwib09iamVjdCIsImdldE9iamVjdCIsIlRhcmdldCIsIiRBbm5vdGF0aW9uUGF0aCIsIm9WYWx1ZSIsIlZhbHVlIiwib1RhcmdldGVkUHJvcGVydHkiLCJuUHJvcGVydHlXaWR0aCIsImZMYWJlbFdpZHRoIiwiX2dldFByb3BlcnRpZXNCeVBhdGgiLCIkUGF0aCIsIm9WaXN1YWxpemF0aW9uIiwiVmlzdWFsaXphdGlvbiIsIiRFbnVtTWVtYmVyIiwiaVRhcmdldGVkVmFsdWUiLCJUYXJnZXRWYWx1ZSIsInBhcnNlSW50Iiwic0xhYmVsIiwibGFiZWwiLCJMYWJlbCIsInByb3BlcnR5UGF0aCIsImZ1bGxOYW1lUHJvcGVydHkiLCJmbiIsImxhYmVsV2lkdGgiLCJwcm9wZXJ0eVdpZHRoIiwiZ2V0V2lkdGhGb3JEYXRhRmllbGQiLCJvVGV4dEFycmFuZ2VtZW50VGFyZ2V0Iiwib1RleHRBcnJhbmdlbWVudFR5cGUiLCJUZXh0QXJyYW5nbWVudFRhcmdldFdpZHRoIiwib1RleHRBcnJhbmdlbWVudFRhcmdldFByb3BlcnR5Iiwic1BhdGgiLCJmaW5kIiwicGF0aCIsImV4aXQiLCJkZXN0cm95Il0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJUYWJsZVNpemVIZWxwZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvZyBmcm9tIFwic2FwL2Jhc2UvTG9nXCI7XG5pbXBvcnQgT2JqZWN0UGF0aCBmcm9tIFwic2FwL2Jhc2UvdXRpbC9PYmplY3RQYXRoXCI7XG5pbXBvcnQgeyBFRE1fVFlQRV9NQVBQSU5HIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvRGlzcGxheU1vZGVGb3JtYXR0ZXJcIjtcbmltcG9ydCBCdXR0b24gZnJvbSBcInNhcC9tL0J1dHRvblwiO1xuaW1wb3J0IFV0aWwgZnJvbSBcInNhcC9tL3RhYmxlL1V0aWxcIjtcbmltcG9ydCBSZW0gZnJvbSBcInNhcC91aS9kb20vdW5pdHMvUmVtXCI7XG5pbXBvcnQgdHlwZSBDb250ZXh0IGZyb20gXCJzYXAvdWkvbW9kZWwvQ29udGV4dFwiO1xuXG5jb25zdCBUYWJsZVNpemVIZWxwZXIgPSB7XG5cdG5iQ2FsbHM6IDAsXG5cdG9CdG46IHVuZGVmaW5lZCBhcyBhbnksXG5cdHByb3BlcnR5SGVscGVyOiB1bmRlZmluZWQgYXMgYW55LFxuXHRpbml0OiBmdW5jdGlvbiAoKSB7XG5cdFx0Ly8gQ3JlYXRlIGEgbmV3IGJ1dHRvbiBpbiBzdGF0aWMgYXJlYSBzYXAudWkuZ2V0Q29yZSgpLmdldFN0YXRpY0FyZWFSZWYoKVxuXHRcdHRoaXMubmJDYWxscyA9IHRoaXMubmJDYWxscyA/IHRoaXMubmJDYWxscyA6IDA7XG5cdFx0dGhpcy5uYkNhbGxzKys7XG5cdFx0dGhpcy5vQnRuID0gdGhpcy5vQnRuID8gdGhpcy5vQnRuIDogbmV3IEJ1dHRvbigpLnBsYWNlQXQoc2FwLnVpLmdldENvcmUoKS5nZXRTdGF0aWNBcmVhUmVmKCkpO1xuXHRcdC8vIEhpZGUgYnV0dG9uIGZyb20gYWNjZXNzaWJpbGl0eSB0cmVlXG5cdFx0dGhpcy5vQnRuLnNldFZpc2libGUoZmFsc2UpO1xuXHR9LFxuXHQvKipcblx0ICogTWV0aG9kIHRvIGNhbGN1bGF0ZSBidXR0b24ncyB3aWR0aCBmcm9tIGEgdGVtcCBjcmVhdGVkIGJ1dHRvbiBwbGFjZWQgaW4gc3RhdGljIGFyZWEuXG5cdCAqXG5cdCAqIEBwYXJhbSBzVGV4dCBUaGUgdGV4dCB0byBtYXN1cmUgaW5zaWRlIHRoZSBCdXR0b24uXG5cdCAqIEByZXR1cm5zIFRoZSB2YWx1ZSBvZiB0aGUgQnV0dG9uIHdpZHRoLlxuXHQgKi9cblx0Z2V0QnV0dG9uV2lkdGg6IGZ1bmN0aW9uIChzVGV4dDogc3RyaW5nKSB7XG5cdFx0aWYgKHRoaXMub0J0bi5nZXRWaXNpYmxlKCkgPT09IGZhbHNlKSB7XG5cdFx0XHR0aGlzLm9CdG4uc2V0VmlzaWJsZSh0cnVlKTtcblx0XHR9XG5cdFx0dGhpcy5vQnRuLnNldFRleHQoc1RleHQpO1xuXHRcdC8vYWRkaW5nIG1pc3Npbmcgc3R5bGVzIGZyb20gYnV0dG9ucyBpbnNpZGUgYSB0YWJsZVxuXHRcdC8vIGZvciBzeW5jIHJlbmRlcmluZ1xuXHRcdHRoaXMub0J0bi5yZXJlbmRlcigpO1xuXHRcdGNvbnN0IG5CdXR0b25XaWR0aCA9IFJlbS5mcm9tUHgodGhpcy5vQnRuLmdldERvbVJlZigpLnNjcm9sbFdpZHRoKTtcblx0XHR0aGlzLm9CdG4uc2V0VmlzaWJsZShmYWxzZSk7XG5cdFx0cmV0dXJuIE1hdGgucm91bmQobkJ1dHRvbldpZHRoICogMTAwKSAvIDEwMDtcblx0fSxcblxuXHQvKipcblx0ICogTWV0aG9kIHRvIGNhbGN1bGF0ZSBNREMgQ29sdW1uJ3Mgd2lkdGguXG5cdCAqXG5cdCAqIEBwYXJhbSBvUHJvcGVydHkgVGhlIFByb3BlcnR5IG9yIFByb3BlcnR5SW5mbyBPYmplY3QgZm9yIHdoaWNoIHRoZSB3aWR0aCB3aWxsIGJlIGNhbGN1bGF0ZWQuXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBhbGlhcyBzYXAuZmUubWFjcm9zLlRhYmxlU2l6ZUhlbHBlclxuXHQgKiBAcmV0dXJucyBUaGUgdmFsdWUgb2YgdGhlIENvbHVtbiB3aWR0aC5cblx0ICovXG5cdGdldE1EQ0NvbHVtbldpZHRoOiBmdW5jdGlvbiAob1Byb3BlcnR5OiBhbnkpOiBudW1iZXIge1xuXHRcdGNvbnN0IHByb3BlcnR5T0RhdGFUeXBlID0gRURNX1RZUEVfTUFQUElOR1tvUHJvcGVydHkudHlwZUNvbmZpZyA/IG9Qcm9wZXJ0eS50eXBlQ29uZmlnLmNsYXNzTmFtZSA6IG9Qcm9wZXJ0eS4kVHlwZV0/LnR5cGU7XG5cdFx0Y29uc3QgUHJvcGVydHlPRGF0YUNvbnN0cnVjdG9yID0gcHJvcGVydHlPRGF0YVR5cGUgPyBPYmplY3RQYXRoLmdldChwcm9wZXJ0eU9EYXRhVHlwZSkgOiBudWxsO1xuXHRcdGNvbnN0IGluc3RhbmNlID0gUHJvcGVydHlPRGF0YUNvbnN0cnVjdG9yID8gbmV3IFByb3BlcnR5T0RhdGFDb25zdHJ1Y3RvcigpIDogbnVsbDtcblx0XHRjb25zdCBzU2l6ZSA9IGluc3RhbmNlID8gVXRpbC5jYWxjQ29sdW1uV2lkdGgoaW5zdGFuY2UpIDogbnVsbDtcblx0XHRpZiAoIXNTaXplKSB7XG5cdFx0XHRMb2cuZXJyb3IoYENhbm5vdCBjb21wdXRlIHRoZSBjb2x1bW4gd2lkdGggZm9yIHByb3BlcnR5OiAke29Qcm9wZXJ0eS5uYW1lfWApO1xuXHRcdH1cblx0XHRyZXR1cm4gc1NpemUgPyBwYXJzZUZsb2F0KHNTaXplLnJlcGxhY2UoXCJSZW1cIiwgXCJcIikpIDogMDtcblx0fSxcblxuXHRfZ2V0UHJvcGVydHlIZWxwZXJDYWNoZTogZnVuY3Rpb24gKHNUYWJsZUlkOiBhbnkpIHtcblx0XHRyZXR1cm4gdGhpcy5wcm9wZXJ0eUhlbHBlciAmJiB0aGlzLnByb3BlcnR5SGVscGVyW3NUYWJsZUlkXTtcblx0fSxcblx0X3NldFByb3BlcnR5SGVscGVyQ2FjaGU6IGZ1bmN0aW9uIChzVGFibGVJZDogYW55LCBvUHJvcGVydHlIZWxwZXI6IGFueSkge1xuXHRcdHRoaXMucHJvcGVydHlIZWxwZXIgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BlcnR5SGVscGVyKTtcblx0XHR0aGlzLnByb3BlcnR5SGVscGVyW3NUYWJsZUlkXSA9IG9Qcm9wZXJ0eUhlbHBlcjtcblx0fSxcblxuXHQvKipcblx0ICogTWV0aG9kIHRvIGNhbGN1bGF0ZSAgd2lkdGggb2YgYSBEYXRhRmllbGRBbm5vdGF0aW9uIG9iamVjdCBjb250YWluZWQgaW4gYSBmaWVsZGdyb3VwLlxuXHQgKlxuXHQgKiBAcGFyYW0gb0RhdGEgRGF0YUZpZWxkQW5ub3RhdGlvbiBvYmplY3QuXG5cdCAqIEBwYXJhbSBiU2hvd0RhdGFGaWVsZHNMYWJlbCBMYWJlbCBpcyBkaXNwbGF5ZWQgaW5zaWRlIHRoZSBmaWVsZFxuXHQgKiBAcGFyYW0gYVByb3BlcnRpZXMgQXJyYXkgY29udGFpbmluZyBhbGwgUHJvcGVydHlJbmZvIG9iamVjdHMuXG5cdCAqIEBwYXJhbSBvQ29udGV4dCBDb250ZXh0IE9iamVjdCBvZiB0aGUgcGFyZW50IHByb3BlcnR5LlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAYWxpYXMgc2FwLmZlLm1hY3Jvcy5UYWJsZVNpemVIZWxwZXJcblx0ICogQHJldHVybnMgT2JqZWN0IGNvbnRhaW5pbmcgdGhlIHdpZHRoIG9mIHRoZSBsYWJlbCBhbmQgdGhlIHdpZHRoIG9mIHRoZSBwcm9wZXJ0eS5cblx0ICovXG5cdGdldFdpZHRoRm9yRGF0YUZpZWxkRm9yQW5ub3RhdGlvbjogZnVuY3Rpb24gKG9EYXRhOiBhbnksIGJTaG93RGF0YUZpZWxkc0xhYmVsOiBib29sZWFuLCBhUHJvcGVydGllczogYW55W10sIG9Db250ZXh0OiBDb250ZXh0KSB7XG5cdFx0Y29uc3Qgb09iamVjdCA9IG9Db250ZXh0LmdldE9iamVjdChvRGF0YS5UYXJnZXQuJEFubm90YXRpb25QYXRoKSBhcyBhbnksXG5cdFx0XHRvVmFsdWUgPSBvT2JqZWN0LlZhbHVlO1xuXHRcdGxldCBvVGFyZ2V0ZWRQcm9wZXJ0eSxcblx0XHRcdG5Qcm9wZXJ0eVdpZHRoID0gMCxcblx0XHRcdGZMYWJlbFdpZHRoID0gMDtcblx0XHRpZiAob1ZhbHVlKSB7XG5cdFx0XHRvVGFyZ2V0ZWRQcm9wZXJ0eSA9IHRoaXMuX2dldFByb3BlcnRpZXNCeVBhdGgoXG5cdFx0XHRcdGFQcm9wZXJ0aWVzLFxuXHRcdFx0XHQob0NvbnRleHQuZ2V0T2JqZWN0KG9EYXRhLlRhcmdldC4kQW5ub3RhdGlvblBhdGgpIGFzIGFueSkuVmFsdWUuJFBhdGhcblx0XHRcdCk7XG5cdFx0XHRjb25zdCBvVmlzdWFsaXphdGlvbiA9IChvQ29udGV4dC5nZXRPYmplY3Qob0RhdGEuVGFyZ2V0LiRBbm5vdGF0aW9uUGF0aCkgYXMgYW55KS5WaXN1YWxpemF0aW9uO1xuXHRcdFx0c3dpdGNoIChvVmlzdWFsaXphdGlvbiAmJiBvVmlzdWFsaXphdGlvbi4kRW51bU1lbWJlcikge1xuXHRcdFx0XHRjYXNlIFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuVmlzdWFsaXphdGlvblR5cGUvUmF0aW5nXCI6XG5cdFx0XHRcdFx0Y29uc3QgaVRhcmdldGVkVmFsdWUgPSAob0NvbnRleHQuZ2V0T2JqZWN0KG9EYXRhLlRhcmdldC4kQW5ub3RhdGlvblBhdGgpIGFzIGFueSkuVGFyZ2V0VmFsdWU7XG5cdFx0XHRcdFx0blByb3BlcnR5V2lkdGggPSBwYXJzZUludChpVGFyZ2V0ZWRWYWx1ZSwgMTApICogMS4zNzU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5WaXN1YWxpemF0aW9uVHlwZS9Qcm9ncmVzc1wiOlxuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdG5Qcm9wZXJ0eVdpZHRoID0gNTtcblx0XHRcdH1cblx0XHRcdGNvbnN0IHNMYWJlbCA9IG9UYXJnZXRlZFByb3BlcnR5ID8gb1RhcmdldGVkUHJvcGVydHkubGFiZWwgOiBvRGF0YS5MYWJlbCB8fCBcIlwiO1xuXHRcdFx0ZkxhYmVsV2lkdGggPSBiU2hvd0RhdGFGaWVsZHNMYWJlbCAmJiBzTGFiZWwgPyBUYWJsZVNpemVIZWxwZXIuZ2V0QnV0dG9uV2lkdGgoc0xhYmVsKSA6IDA7XG5cdFx0fSBlbHNlIGlmIChvT2JqZWN0LiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW11bmljYXRpb24udjEuQ29udGFjdFR5cGVcIikge1xuXHRcdFx0Y29uc3QgcHJvcGVydHlQYXRoID0gb0RhdGEuVGFyZ2V0LiRBbm5vdGF0aW9uUGF0aC5yZXBsYWNlKC9cXC9ALiovLCBcIlwiKTtcblx0XHRcdGNvbnN0IGZ1bGxOYW1lUHJvcGVydHkgPSBvQ29udGV4dC5nZXRPYmplY3QocHJvcGVydHlQYXRoICsgXCIvXCIgKyBvT2JqZWN0LmZuLiRQYXRoKTtcblx0XHRcdG5Qcm9wZXJ0eVdpZHRoID0gdGhpcy5nZXRNRENDb2x1bW5XaWR0aChmdWxsTmFtZVByb3BlcnR5KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0TG9nLmVycm9yKGBDYW5ub3QgY29tcHV0ZSB3aWR0aCBmb3IgdHlwZSBvYmplY3Q6ICR7b09iamVjdC4kVHlwZX1gKTtcblx0XHR9XG5cblx0XHRyZXR1cm4geyBsYWJlbFdpZHRoOiBmTGFiZWxXaWR0aCwgcHJvcGVydHlXaWR0aDogblByb3BlcnR5V2lkdGggfTtcblx0fSxcblxuXHQvKipcblx0ICogTWV0aG9kIHRvIGNhbGN1bGF0ZSAgd2lkdGggb2YgYSBEYXRhRmllbGQgb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge29iamVjdH0gb0RhdGEgRGF0YUZpZWxkQW5ub3RhdGlvbiBvYmplY3QuXG5cdCAqIEBwYXJhbSB7Ym9vbGVhbn0gYlNob3dEYXRhRmllbGRzTGFiZWwgTGFiZWwgaXMgZGlzcGxheWVkIGluc2lkZSB0aGUgZmllbGQuXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGFQcm9wZXJ0aWVzIEFycmF5IGNvbnRhaW5pbmcgYWxsIFByb3BlcnR5SW5mbyBvYmplY3RzLlxuXHQgKiBAcGFyYW0ge29iamVjdH0gb0NvbnRleHQgQ29udGV4dCBPYmplY3Qgb2YgdGhlIHBhcmVudCBwcm9wZXJ0eS5cblx0ICogQHBhcmFtIHtvYmplY3R9IG9UYWJsZSBUaGUgVGFibGUgcmVmZXJlbmNlLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAYWxpYXMgc2FwLmZlLm1hY3Jvcy5UYWJsZVNpemVIZWxwZXJcblx0ICogQHJldHVybnMge29iamVjdH0gT2JqZWN0IGNvbnRhaW5pbmcgdGhlIHdpZHRoIG9mIHRoZSBsYWJlbCBhbmQgdGhlIHdpZHRoIG9mIHRoZSBwcm9wZXJ0eS5cblx0ICovXG5cblx0Z2V0V2lkdGhGb3JEYXRhRmllbGQ6IGZ1bmN0aW9uIChvRGF0YTogYW55LCBiU2hvd0RhdGFGaWVsZHNMYWJlbDogYm9vbGVhbiwgYVByb3BlcnRpZXM6IGFueVtdLCBvQ29udGV4dDogQ29udGV4dCAvKm9UYWJsZTogQ29udHJvbCovKSB7XG5cdFx0Y29uc3Qgb1RhcmdldGVkUHJvcGVydHkgPSB0aGlzLl9nZXRQcm9wZXJ0aWVzQnlQYXRoKGFQcm9wZXJ0aWVzLCBvRGF0YS5WYWx1ZS4kUGF0aCksXG5cdFx0XHRvVGV4dEFycmFuZ2VtZW50VGFyZ2V0ID0gb0NvbnRleHQuZ2V0T2JqZWN0KGAke29EYXRhLlZhbHVlLiRQYXRofUBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuVGV4dGApIGFzIGFueSxcblx0XHRcdG9UZXh0QXJyYW5nZW1lbnRUeXBlID0gb0NvbnRleHQuZ2V0T2JqZWN0KFxuXHRcdFx0XHRgJHtvRGF0YS5WYWx1ZS4kUGF0aH1AY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlRleHRAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuVGV4dEFycmFuZ2VtZW50YFxuXHRcdFx0KSBhcyBhbnk7XG5cdFx0bGV0IG5Qcm9wZXJ0eVdpZHRoID0gMCxcblx0XHRcdGZMYWJlbFdpZHRoID0gMDtcblx0XHRpZiAob1RhcmdldGVkUHJvcGVydHkpIHtcblx0XHRcdGxldCBUZXh0QXJyYW5nbWVudFRhcmdldFdpZHRoID0gMDtcblx0XHRcdGlmIChvVGV4dEFycmFuZ2VtZW50VGFyZ2V0ICYmIG9UZXh0QXJyYW5nZW1lbnRUeXBlKSB7XG5cdFx0XHRcdGNvbnN0IG9UZXh0QXJyYW5nZW1lbnRUYXJnZXRQcm9wZXJ0eSA9IHRoaXMuX2dldFByb3BlcnRpZXNCeVBhdGgoYVByb3BlcnRpZXMsIG9UZXh0QXJyYW5nZW1lbnRUYXJnZXQuJFBhdGgpO1xuXHRcdFx0XHRUZXh0QXJyYW5nbWVudFRhcmdldFdpZHRoID0gb1RleHRBcnJhbmdlbWVudFRhcmdldFByb3BlcnR5ICYmIHRoaXMuZ2V0TURDQ29sdW1uV2lkdGgob1RleHRBcnJhbmdlbWVudFRhcmdldFByb3BlcnR5KSAtIDE7XG5cdFx0XHR9XG5cdFx0XHRzd2l0Y2ggKG9UZXh0QXJyYW5nZW1lbnRUeXBlICYmIG9UZXh0QXJyYW5nZW1lbnRUeXBlLiRFbnVtTWVtYmVyKSB7XG5cdFx0XHRcdGNhc2UgXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5UZXh0QXJyYW5nZW1lbnRUeXBlL1RleHRGaXJzdFwiOlxuXHRcdFx0XHRjYXNlIFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuVGV4dEFycmFuZ2VtZW50VHlwZS9UZXh0TGFzdFwiOlxuXHRcdFx0XHRcdG5Qcm9wZXJ0eVdpZHRoID0gdGhpcy5nZXRNRENDb2x1bW5XaWR0aChvVGFyZ2V0ZWRQcm9wZXJ0eSkgLSAxICsgVGV4dEFycmFuZ21lbnRUYXJnZXRXaWR0aDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlRleHRBcnJhbmdlbWVudFR5cGUvVGV4dE9ubHlcIjpcblx0XHRcdFx0XHRuUHJvcGVydHlXaWR0aCA9IFRleHRBcnJhbmdtZW50VGFyZ2V0V2lkdGg7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5UZXh0QXJyYW5nZW1lbnRUeXBlL1RleHRTZXBhcmF0ZVwiOlxuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdG5Qcm9wZXJ0eVdpZHRoID0gdGhpcy5nZXRNRENDb2x1bW5XaWR0aChvVGFyZ2V0ZWRQcm9wZXJ0eSkgLSAxO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3Qgc0xhYmVsID0gb0RhdGEuTGFiZWwgPyBvRGF0YS5MYWJlbCA6IG9UYXJnZXRlZFByb3BlcnR5LmxhYmVsO1xuXHRcdFx0ZkxhYmVsV2lkdGggPSBiU2hvd0RhdGFGaWVsZHNMYWJlbCAmJiBzTGFiZWwgPyBUYWJsZVNpemVIZWxwZXIuZ2V0QnV0dG9uV2lkdGgoc0xhYmVsKSA6IDA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdExvZy5lcnJvcihgQ2Fubm90IGNvbXB1dGUgd2lkdGggZm9yIHR5cGUgb2JqZWN0OiAke29EYXRhLiRUeXBlfWApO1xuXHRcdH1cblx0XHRyZXR1cm4geyBsYWJlbFdpZHRoOiBmTGFiZWxXaWR0aCwgcHJvcGVydHlXaWR0aDogblByb3BlcnR5V2lkdGggfTtcblx0fSxcblxuXHRfZ2V0UHJvcGVydGllc0J5UGF0aDogZnVuY3Rpb24gKGFQcm9wZXJ0aWVzOiBhbnksIHNQYXRoOiBhbnkpIHtcblx0XHRyZXR1cm4gYVByb3BlcnRpZXMuZmluZChmdW5jdGlvbiAob1Byb3BlcnR5OiBhbnkpIHtcblx0XHRcdHJldHVybiBvUHJvcGVydHkucGF0aCA9PT0gc1BhdGg7XG5cdFx0fSk7XG5cdH0sXG5cblx0ZXhpdDogZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMubmJDYWxscy0tO1xuXHRcdGlmICh0aGlzLm5iQ2FsbHMgPT09IDApIHtcblx0XHRcdHRoaXMub0J0bi5kZXN0cm95KCk7XG5cdFx0XHR0aGlzLm9CdG4gPSBudWxsO1xuXHRcdH1cblx0fVxufTtcblxuZXhwb3J0IGRlZmF1bHQgVGFibGVTaXplSGVscGVyO1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7RUFRQSxJQUFNQSxlQUFlLEdBQUc7SUFDdkJDLE9BQU8sRUFBRSxDQURjO0lBRXZCQyxJQUFJLEVBQUVDLFNBRmlCO0lBR3ZCQyxjQUFjLEVBQUVELFNBSE87SUFJdkJFLElBQUksRUFBRSxZQUFZO01BQ2pCO01BQ0EsS0FBS0osT0FBTCxHQUFlLEtBQUtBLE9BQUwsR0FBZSxLQUFLQSxPQUFwQixHQUE4QixDQUE3QztNQUNBLEtBQUtBLE9BQUw7TUFDQSxLQUFLQyxJQUFMLEdBQVksS0FBS0EsSUFBTCxHQUFZLEtBQUtBLElBQWpCLEdBQXdCLElBQUlJLE1BQUosR0FBYUMsT0FBYixDQUFxQkMsR0FBRyxDQUFDQyxFQUFKLENBQU9DLE9BQVAsR0FBaUJDLGdCQUFqQixFQUFyQixDQUFwQyxDQUppQixDQUtqQjs7TUFDQSxLQUFLVCxJQUFMLENBQVVVLFVBQVYsQ0FBcUIsS0FBckI7SUFDQSxDQVhzQjs7SUFZdkI7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0lBQ0NDLGNBQWMsRUFBRSxVQUFVQyxLQUFWLEVBQXlCO01BQ3hDLElBQUksS0FBS1osSUFBTCxDQUFVYSxVQUFWLE9BQTJCLEtBQS9CLEVBQXNDO1FBQ3JDLEtBQUtiLElBQUwsQ0FBVVUsVUFBVixDQUFxQixJQUFyQjtNQUNBOztNQUNELEtBQUtWLElBQUwsQ0FBVWMsT0FBVixDQUFrQkYsS0FBbEIsRUFKd0MsQ0FLeEM7TUFDQTs7TUFDQSxLQUFLWixJQUFMLENBQVVlLFFBQVY7TUFDQSxJQUFNQyxZQUFZLEdBQUdDLEdBQUcsQ0FBQ0MsTUFBSixDQUFX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