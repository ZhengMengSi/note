/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/helpers/ClassSupport", "sap/fe/macros/library", "sap/m/FlexBox", "sap/m/Label", "sap/m/library", "sap/suite/ui/microchart/AreaMicroChart", "sap/suite/ui/microchart/ColumnMicroChart", "sap/suite/ui/microchart/ComparisonMicroChart", "sap/suite/ui/microchart/LineMicroChart", "sap/ui/core/Control", "sap/ui/core/format/NumberFormat", "sap/ui/model/odata/v4/ODataListBinding", "sap/ui/model/odata/v4/ODataMetaModel", "sap/ui/model/type/Date"], function (Log, ClassSupport, macroLib, FlexBox, Label, mobilelibrary, AreaMicroChart, ColumnMicroChart, ComparisonMicroChart, LineMicroChart, Control, NumberFormat, ODataV4ListBinding, ODataMetaModel, DateType) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16;

  var property = ClassSupport.property;
  var event = ClassSupport.event;
  var defineUI5Class = ClassSupport.defineUI5Class;
  var aggregation = ClassSupport.aggregation;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var NavigationType = macroLib.NavigationType;
  var ValueColor = mobilelibrary.ValueColor;
  /**
   *  Container Control for Micro Chart and UoM.
   *
   * @private
   * @experimental This module is only for internal/experimental use!
   */

  var MicroChartContainer = (_dec = defineUI5Class("sap.fe.macros.microchart.MicroChartContainer"), _dec2 = property({
    type: "boolean",
    defaultValue: false
  }), _dec3 = property({
    type: "string",
    defaultValue: undefined
  }), _dec4 = property({
    type: "string[]",
    defaultValue: []
  }), _dec5 = property({
    type: "string",
    defaultValue: undefined
  }), _dec6 = property({
    type: "string[]",
    defaultValue: []
  }), _dec7 = property({
    type: "int",
    defaultValue: undefined
  }), _dec8 = property({
    type: "int",
    defaultValue: 1
  }), _dec9 = property({
    type: "int",
    defaultValue: undefined
  }), _dec10 = property({
    type: "string",
    defaultValue: ""
  }), _dec11 = property({
    type: "string",
    defaultValue: ""
  }), _dec12 = property({
    type: "sap.fe.macros.NavigationType",
    defaultValue: "None"
  }), _dec13 = property({
    type: "string",
    defaultValue: ""
  }), _dec14 = event(), _dec15 = aggregation({
    type: "sap.ui.core.Control",
    multiple: false,
    isDefault: true
  }), _dec16 = aggregation({
    type: "sap.m.Label",
    multiple: false
  }), _dec17 = aggregation({
    type: "sap.ui.core.Control",
    multiple: true
  }), _dec(_class = (_class2 = /*#__PURE__*/function (_Control) {
    _inheritsLoose(MicroChartContainer, _Control);

    function MicroChartContainer() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _Control.call.apply(_Control, [this].concat(args)) || this;

      _initializerDefineProperty(_this, "showOnlyChart", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "uomPath", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "measures", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "dimension", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "dataPointQualifiers", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "measurePrecision", _descriptor6, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "measureScale", _descriptor7, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "dimensionPrecision", _descriptor8, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "chartTitle", _descriptor9, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "chartDescription", _descriptor10, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "navigationType", _descriptor11, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "calendarPattern", _descriptor12, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "onTitlePressed", _descriptor13, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "microChart", _descriptor14, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_uomLabel", _descriptor15, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "microChartTitle", _descriptor16, _assertThisInitialized(_this));

      return _this;
    }

    MicroChartContainer.render = function render(oRm, oControl) {
      oRm.openStart("div", oControl);
      oRm.openEnd();

      if (!oControl.showOnlyChart) {
        var oChartTitle = oControl.microChartTitle;

        if (oChartTitle) {
          oChartTitle.forEach(function (oSubChartTitle) {
            oRm.openStart("div");
            oRm.openEnd();
            oRm.renderControl(oSubChartTitle);
            oRm.close("div");
          });
        }

        oRm.openStart("div");
        oRm.openEnd();
        var oChartDescription = new Label({
          text: oControl.chartDescription
        });
        oRm.renderControl(oChartDescription);
        oRm.close("div");
      }

      var oMicroChart = oControl.microChart;

      if (oMicroChart) {
        oMicroChart.addStyleClass("sapUiTinyMarginTopBottom");
        oRm.renderControl(oMicroChart);

        if (!oControl.showOnlyChart && oControl.uomPath) {
          var oSettings = oControl._checkIfChartRequiresRuntimeLabels() ? undefined : {
            text: {
              path: oControl.uomPath
            }
          },
              oLabel = new Label(oSettings),
              oFlexBox = new FlexBox({
            alignItems: "Start",
            justifyContent: "End",
            items: [oLabel]
          });
          oRm.renderControl(oFlexBox);
          oControl.setAggregation("_uomLabel", oLabel);
        }
      }

      oRm.close("div");
    };

    var _proto = MicroChartContainer.prototype;

    _proto.onBeforeRendering = function onBeforeRendering() {
      var oBinding = this._getListBindingForRuntimeLabels();

      if (oBinding) {
        oBinding.detachEvent("change", this._setRuntimeChartLabelsAndUnitOfMeasure, this);
        this._olistBinding = undefined;
      }
    };

    _proto.onAfterRendering = function onAfterRendering() {
      var oBinding = this._getListBindingForRuntimeLabels();

      if (!this._checkIfChartRequiresRuntimeLabels()) {
        return;
      }

      if (oBinding) {
        oBinding.attachEvent("change", this._setRuntimeChartLabelsAndUnitOfMeasure, this);
        this._olistBinding = oBinding;
      }
    };

    _proto.setShowOnlyChart = function setShowOnlyChart(sValue) {
      if (!sValue && this._olistBinding) {
        this._setChartLabels();
      }

      this.setProperty("showOnlyChart", sValue, false
      /*re-rendering*/
      );
    };

    _proto._checkIfChartRequiresRuntimeLabels = function _checkIfChartRequiresRuntimeLabels() {
      var oMicroChart = this.microChart;
      return Boolean(oMicroChart instanceof AreaMicroChart || oMicroChart instanceof ColumnMicroChart || oMicroChart instanceof LineMicroChart || oMicroChart instanceof ComparisonMicroChart);
    };

    _proto._checkForChartLabelAggregations = function _checkForChartLabelAggregations() {
      var oMicroChart = this.microChart;
      return Boolean(oMicroChart instanceof AreaMicroChart && oMicroChart.getAggregation("firstYLabel") && oMicroChart.getAggregation("lastYLabel") && oMicroChart.getAggregation("firstXLabel") && oMicroChart.getAggregation("lastXLabel") || oMicroChart instanceof ColumnMicroChart && oMicroChart.getAggregation("leftTopLabel") && oMicroChart.getAggregation("rightTopLabel") && oMicroChart.getAggregation("leftBottomLabel") && oMicroChart.getAggregation("rightBottomLabel") || oMicroChart instanceof LineMicroChart);
    };

    _proto._getListBindingForRuntimeLabels = function _getListBindingForRuntimeLabels() {
      var oMicroChart = this.microChart;
      var oBinding;

      if (oMicroChart instanceof AreaMicroChart) {
        var oChart = oMicroChart.getChart();
        oBinding = oChart && oMicroChart.getChart().getBinding("points");
      } else if (oMicroChart instanceof ColumnMicroChart) {
        oBinding = oMicroChart.getBinding("columns");
      } else if (oMicroChart instanceof LineMicroChart) {
        var aLines = oMicroChart.getLines();
        oBinding = aLines && aLines.length && aLines[0].getBinding("points");
      } else if (oMicroChart instanceof ComparisonMicroChart) {
        oBinding = oMicroChart.getBinding("data");
      }

      return oBinding instanceof ODataV4ListBinding ? oBinding : false;
    };

    _proto._setRuntimeChartLabelsAndUnitOfMeasure = function _setRuntimeChartLabelsAndUnitOfMeasure() {
      var _this2 = this;

      var oListBinding = this._olistBinding,
          aContexts = oListBinding === null || oListBinding === void 0 ? void 0 : oListBinding.getContexts(),
          aMeasures = this.measures || [],
          sDimension = this.dimension,
          sUnitOfMeasurePath = this.uomPath,
          oMicroChart = this.microChart,
          oUnitOfMeasureLabel = this._uomLabel;

      if (oUnitOfMeasureLabel && sUnitOfMeasurePath && aContexts && aContexts.length && !this.showOnlyChart) {
        oUnitOfMeasureLabel.setText(aContexts[0].getObject(sUnitOfMeasurePath));
      } else if (oUnitOfMeasureLabel) {
        oUnitOfMeasureLabel.setText("");
      }

      if (!this._checkForChartLabelAggregations()) {
        return;
      }

      if (!aContexts || !aContexts.length) {
        this._setChartLabels();

        return;
      }

      var oFirstContext = aContexts[0],
          oLastContext = aContexts[aContexts.length - 1],
          aLinesPomises = [],
          bLineChart = oMicroChart instanceof LineMicroChart,
          iCurrentMinX = oFirstContext.getObject(sDimension),
          iCurrentMaxX = oLastContext.getObject(sDimension);
      var iCurrentMinY,
          iCurrentMaxY,
          oMinX = {
        value: Infinity
      },
          oMaxX = {
        value: -Infinity
      },
          oMinY = {
        value: Infinity
      },
          oMaxY = {
        value: -Infinity
      };
      oMinX = iCurrentMinX == undefined ? oMinX : {
        context: oFirstContext,
        value: iCurrentMinX
      };
      oMaxX = iCurrentMaxX == undefined ? oMaxX : {
        context: oLastContext,
        value: iCurrentMaxX
      };
      aMeasures.forEach(function (sMeasure, i) {
        iCurrentMinY = oFirstContext.getObject(sMeasure);
        iCurrentMaxY = oLastContext.getObject(sMeasure);
        oMaxY = iCurrentMaxY > oMaxY.value ? {
          context: oLastContext,
          value: iCurrentMaxY,
          index: bLineChart ? i : 0
        } : oMaxY;
        oMinY = iCurrentMinY < oMinY.value ? {
          context: oFirstContext,
          value: iCurrentMinY,
          index: bLineChart ? i : 0
        } : oMinY;

        if (bLineChart) {
          aLinesPomises.push(_this2._getCriticalityFromPoint({
            context: oLastContext,
            value: iCurrentMaxY,
            index: i
          }));
        }
      });

      this._setChartLabels(oMinY.value, oMaxY.value, oMinX.value, oMaxX.value);

      if (bLineChart) {
        return Promise.all(aLinesPomises).then(function (aColors) {
          var aLines = oMicroChart.getLines();
          aLines.forEach(function (oLine, i) {
            oLine.setColor(aColors[i]);
          });
        });
      } else {
        return this._setChartLabelsColors(oMaxY, oMinY);
      }
    };

    _proto._setChartLabelsColors = function _setChartLabelsColors(oMaxY, oMinY) {
      var oMicroChart = this.microChart;
      return Promise.all([this._getCriticalityFromPoint(oMinY), this._getCriticalityFromPoint(oMaxY)]).then(function (aCriticality) {
        if (oMicroChart instanceof AreaMicroChart) {
          oMicroChart.getAggregation("firstYLabel").setProperty("color", aCriticality[0], true);
          oMicroChart.getAggregation("lastYLabel").setProperty("color", aCriticality[1], true);
        } else if (oMicroChart instanceof ColumnMicroChart) {
          oMicroChart.getAggregation("leftTopLabel").setProperty("color", aCriticality[0], true);
          oMicroChart.getAggregation("rightTopLabel").setProperty("color", aCriticality[1], true);
        }
      });
    };

    _proto._setChartLabels = function _setChartLabels(leftTop, rightTop, leftBottom, rightBottom) {
      var oMicroChart = this.microChart;
      leftTop = this._formatDateAndNumberValue(leftTop, this.measurePrecision, this.measureScale);
      rightTop = this._formatDateAndNumberValue(rightTop, this.measurePrecision, this.measureScale);
      leftBottom = this._formatDateAndNumberValue(leftBottom, this.dimensionPrecision, undefined, this.calendarPattern);
      rightBottom = this._formatDateAndNumberValue(rightBottom, this.dimensionPrecision, undefined, this.calendarPattern);

      if (oMicroChart instanceof AreaMicroChart) {
        oMicroChart.getAggregation("firstYLabel").setProperty("label", leftTop, false);
        oMicroChart.getAggregation("lastYLabel").setProperty("label", rightTop, false);
        oMicroChart.getAggregation("firstXLabel").setProperty("label", leftBottom, false);
        oMicroChart.getAggregation("lastXLabel").setProperty("label", rightBottom, false);
      } else if (oMicroChart instanceof ColumnMicroChart) {
        oMicroChart.getAggregation("leftTopLabel").setProperty("label", leftTop, false);
        oMicroChart.getAggregation("rightTopLabel").setProperty("label", rightTop, false);
        oMicroChart.getAggregation("leftBottomLabel").setProperty("label", leftBottom, false);
        oMicroChart.getAggregation("rightBottomLabel").setProperty("label", rightBottom, false);
      } else if (oMicroChart instanceof LineMicroChart) {
        oMicroChart.setProperty("leftTopLabel", leftTop, false);
        oMicroChart.setProperty("rightTopLabel", rightTop, false);
        oMicroChart.setProperty("leftBottomLabel", leftBottom, false);
        oMicroChart.setProperty("rightBottomLabel", rightBottom, false);
      }
    };

    _proto._getCriticalityFromPoint = function _getCriticalityFromPoint(oPoint) {
      var _this3 = this;

      var oReturn = Promise.resolve(ValueColor.Neutral);
      var oMetaModel = this.getModel() && this.getModel().getMetaModel(),
          aDataPointQualifiers = this.dataPointQualifiers,
          sMetaPath = oMetaModel instanceof ODataMetaModel && oPoint && oPoint.context && oPoint.context.getPath() && oMetaModel.getMetaPath(oPoint.context.getPath());

      if (typeof sMetaPath === "string") {
        oReturn = oMetaModel.requestObject("".concat(sMetaPath, "/@com.sap.vocabularies.UI.v1.DataPoint").concat(aDataPointQualifiers[oPoint.index] ? "#".concat(aDataPointQualifiers[oPoint.index]) : "")).then(function (oDataPoint) {
          var sCriticality = ValueColor.Neutral;
          var oContext = oPoint.context;

          if (oDataPoint.Criticality) {
            sCriticality = _this3._criticality(oDataPoint.Criticality, oContext);
          } else if (oDataPoint.CriticalityCalculation) {
            var oCriticalityCalculation = oDataPoint.CriticalityCalculation,
                oCC = {},
                fnGetValue = function (oProperty) {
              var sReturn;

              if (oProperty.$Path) {
                sReturn = oContext.getObject(oProperty.$Path);
              } else if (oProperty.hasOwnProperty("$Decimal")) {
                sReturn = oProperty.$Decimal;
              }

              return sReturn;
            };

            oCC.sAcceptanceHigh = oCriticalityCalculation.AcceptanceRangeHighValue ? fnGetValue(oCriticalityCalculation.AcceptanceRangeHighValue) : undefined;
            oCC.sAcceptanceLow = oCriticalityCalculation.AcceptanceRangeLowValue ? fnGetValue(oCriticalityCalculation.AcceptanceRangeLowValue) : undefined;
            oCC.sDeviationHigh = oCriticalityCalculation.DeviationRangeHighValue ? fnGetValue(oCriticalityCalculation.DeviationRangeHighValue) : undefined;
            oCC.sDeviationLow = oCriticalityCalculation.DeviationRangeLowValue ? fnGetValue(oCriticalityCalculation.DeviationRangeLowValue) : undefined;
            oCC.sToleranceHigh = oCriticalityCalculation.ToleranceRangeHighValue ? fnGetValue(oCriticalityCalculation.ToleranceRangeHighValue) : undefined;
            oCC.sToleranceLow = oCriticalityCalculation.ToleranceRangeLowValue ? fnGetValue(oCriticalityCalculation.ToleranceRangeLowValue) : undefined;
            oCC.sImprovementDirection = oCriticalityCalculation.ImprovementDirection.$EnumMember;
            sCriticality = _this3._criticalityCalculation(oCC.sImprovementDirection, oPoint.value, oCC.sDeviationLow, oCC.sToleranceLow, oCC.sAcceptanceLow, oCC.sAcceptanceHigh, oCC.sToleranceHigh, oCC.sDeviationHigh);
          }

          return sCriticality;
        });
      }

      return oReturn;
    };

    _proto._criticality = function _criticality(oCriticality, oContext) {
      var iCriticality,
          sCriticality = ValueColor.Neutral;

      if (oCriticality.$Path) {
        var sCriticalityPath = oCriticality.$Path;
        iCriticality = oContext.getObject(sCriticalityPath);

        if (iCriticality === "Negative" || iCriticality === "1" || iCriticality === 1) {
          sCriticality = ValueColor.Error;
        } else if (iCriticality === "Critical" || iCriticality === "2" || iCriticality === 2) {
          sCriticality = ValueColor.Critical;
        } else if (iCriticality === "Positive" || iCriticality === "3" || iCriticality === 3) {
          sCriticality = ValueColor.Good;
        }
      } else if (oCriticality.$EnumMember) {
        iCriticality = oCriticality.$EnumMember;

        if (iCriticality.indexOf("com.sap.vocabularies.UI.v1.CriticalityType/Negative") > -1) {
          sCriticality = ValueColor.Error;
        } else if (iCriticality.indexOf("com.sap.vocabularies.UI.v1.CriticalityType/Positive") > -1) {
          sCriticality = ValueColor.Good;
        } else if (iCriticality.indexOf("com.sap.vocabularies.UI.v1.CriticalityType/Critical") > -1) {
          sCriticality = ValueColor.Critical;
        }
      } else {
        Log.warning("Case not supported, returning the default Value Neutral");
      }

      return sCriticality;
    };

    _proto._criticalityCalculation = function _criticalityCalculation(sImprovementDirection, sValue, sDeviationLow, sToleranceLow, sAcceptanceLow, sAcceptanceHigh, sToleranceHigh, sDeviationHigh) {
      var sCriticalityExpression = ValueColor.Neutral; // Default Criticality State
      // Dealing with Decimal and Path based bingdings

      sDeviationLow = sDeviationLow == undefined ? -Infinity : sDeviationLow;
      sToleranceLow = sToleranceLow == undefined ? sDeviationLow : sToleranceLow;
      sAcceptanceLow = sAcceptanceLow == undefined ? sToleranceLow : sAcceptanceLow;
      sDeviationHigh = sDeviationHigh == undefined ? Infinity : sDeviationHigh;
      sToleranceHigh = sToleranceHigh == undefined ? sDeviationHigh : sToleranceHigh;
      sAcceptanceHigh = sAcceptanceHigh == undefined ? sToleranceHigh : sAcceptanceHigh; // Creating runtime expression binding from criticality calculation for Criticality State

      if (sImprovementDirection.indexOf("Minimize") > -1) {
        if (sValue <= sAcceptanceHigh) {
          sCriticalityExpression = ValueColor.Good;
        } else if (sValue <= sToleranceHigh) {
          sCriticalityExpression = ValueColor.Neutral;
        } else if (sDeviationHigh && sValue <= sDeviationHigh) {
          sCriticalityExpression = ValueColor.Critical;
        } else {
          sCriticalityExpression = ValueColor.Error;
        }
      } else if (sImprovementDirection.indexOf("Maximize") > -1) {
        if (sValue >= sAcceptanceLow) {
          sCriticalityExpression = ValueColor.Good;
        } else if (sValue >= sToleranceLow) {
          sCriticalityExpression = ValueColor.Neutral;
        } else if (sDeviationHigh && sValue >= sDeviationLow) {
          sCriticalityExpression = ValueColor.Critical;
        } else {
          sCriticalityExpression = ValueColor.Error;
        }
      } else if (sImprovementDirection.indexOf("Target") > -1) {
        if (sValue <= sAcceptanceHigh && sValue >= sAcceptanceLow) {
          sCriticalityExpression = ValueColor.Good;
        } else if (sValue >= sToleranceLow && sValue < sAcceptanceLow || sValue > sAcceptanceHigh && sValue <= sToleranceHigh) {
          sCriticalityExpression = ValueColor.Neutral;
        } else if (sDeviationLow && sValue >= sDeviationLow && sValue < sToleranceLow || sValue > sToleranceHigh && sDeviationHigh && sValue <= sDeviationHigh) {
          sCriticalityExpression = ValueColor.Critical;
        } else {
          sCriticalityExpression = ValueColor.Error;
        }
      } else {
        Log.warning("Case not supported, returning the default Value Neutral");
      }

      return sCriticalityExpression;
    };

    _proto._formatDateAndNumberValue = function _formatDateAndNumberValue(value, iPrecision, iScale, sPattern) {
      if (sPattern) {
        return this._getSemanticsValueFormatter(sPattern).formatValue(value, "string");
      } else if (!isNaN(value)) {
        return this._getLabelNumberFormatter(iPrecision, iScale).format(value);
      }

      return value;
    };

    _proto._getSemanticsValueFormatter = function _getSemanticsValueFormatter(sPattern) {
      if (!this._oDateType) {
        this._oDateType = new DateType({
          style: "short",
          source: {
            pattern: sPattern
          }
        });
      }

      return this._oDateType;
    };

    _proto._getLabelNumberFormatter = function _getLabelNumberFormatter(iPrecision, iScale) {
      return NumberFormat.getFloatInstance({
        style: "short",
        showScale: true,
        precision: typeof iPrecision === "number" ? iPrecision : null,
        decimals: typeof iScale === "number" ? iScale : null
      });
    };

    return MicroChartContainer;
  }(Control), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "showOnlyChart", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "uomPath", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "measures", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "dimension", [_dec5], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "dataPointQualifiers", [_dec6], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "measurePrecision", [_dec7], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "measureScale", [_dec8], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "dimensionPrecision", [_dec9], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "chartTitle", [_dec10], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "chartDescription", [_dec11], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "navigationType", [_dec12], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "calendarPattern", [_dec13], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "onTitlePressed", [_dec14], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "microChart", [_dec15], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "_uomLabel", [_dec16], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "microChartTitle", [_dec17], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  })), _class2)) || _class);
  return MicroChartContainer;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJOYXZpZ2F0aW9uVHlwZSIsIm1hY3JvTGliIiwiVmFsdWVDb2xvciIsIm1vYmlsZWxpYnJhcnkiLCJNaWNyb0NoYXJ0Q29udGFpbmVyIiwiZGVmaW5lVUk1Q2xhc3MiLCJwcm9wZXJ0eSIsInR5cGUiLCJkZWZhdWx0VmFsdWUiLCJ1bmRlZmluZWQiLCJldmVudCIsImFnZ3JlZ2F0aW9uIiwibXVsdGlwbGUiLCJpc0RlZmF1bHQiLCJyZW5kZXIiLCJvUm0iLCJvQ29udHJvbCIsIm9wZW5TdGFydCIsIm9wZW5FbmQiLCJzaG93T25seUNoYXJ0Iiwib0NoYXJ0VGl0bGUiLCJtaWNyb0NoYXJ0VGl0bGUiLCJmb3JFYWNoIiwib1N1YkNoYXJ0VGl0bGUiLCJyZW5kZXJDb250cm9sIiwiY2xvc2UiLCJvQ2hhcnREZXNjcmlwdGlvbiIsIkxhYmVsIiwidGV4dCIsImNoYXJ0RGVzY3JpcHRpb24iLCJvTWljcm9DaGFydCIsIm1pY3JvQ2hhcnQiLCJhZGRTdHlsZUNsYXNzIiwidW9tUGF0aCIsIm9TZXR0aW5ncyIsIl9jaGVja0lmQ2hhcnRSZXF1aXJlc1J1bnRpbWVMYWJlbHMiLCJwYXRoIiwib0xhYmVsIiwib0ZsZXhCb3giLCJGbGV4Qm94IiwiYWxpZ25JdGVtcyIsImp1c3RpZnlDb250ZW50IiwiaXRlbXMiLCJzZXRBZ2dyZWdhdGlvbiIsIm9uQmVmb3JlUmVuZGVyaW5nIiwib0JpbmRpbmciLCJfZ2V0TGlzdEJpbmRpbmdGb3JSdW50aW1lTGFiZWxzIiwiZGV0YWNoRXZlbnQiLCJfc2V0UnVudGltZUNoYXJ0TGFiZWxzQW5kVW5pdE9mTWVhc3VyZSIsIl9vbGlzdEJpbmRpbmciLCJvbkFmdGVyUmVuZGVyaW5nIiwiYXR0YWNoRXZlbnQiLCJzZXRTaG93T25seUNoYXJ0Iiwic1ZhbHVlIiwiX3NldENoYXJ0TGFiZWxzIiwic2V0UHJvcGVydHkiLCJCb29sZWFuIiwiQXJlYU1pY3JvQ2hhcnQiLCJDb2x1bW5NaWNyb0NoYXJ0IiwiTGluZU1pY3JvQ2hhcnQiLCJDb21wYXJpc29uTWljcm9DaGFydCIsIl9jaGVja0ZvckNoYXJ0TGFiZWxBZ2dyZWdhdGlvbnMiLCJnZXRBZ2dyZWdhdGlvbiIsIm9DaGFydCIsImdldENoYXJ0IiwiZ2V0QmluZGluZyIsImFMaW5lcyIsImdldExpbmVzIiwibGVuZ3RoIiwiT0RhdGFWNExpc3RCaW5kaW5nIiwib0xpc3RCaW5kaW5nIiwiYUNvbnRleHRzIiwiZ2V0Q29udGV4dHMiLCJhTWVhc3VyZXMiLCJtZWFzdXJlcyIsInNEaW1lbnNpb24iLCJkaW1lbnNpb24iLCJzVW5pdE9mTWVhc3VyZVBhdGgiLCJvVW5pdE9mTWVhc3VyZUxhYmVsIiwiX3VvbUxhYmVsIiwic2V0VGV4dCIsImdldE9iamVjdCIsIm9GaXJzdENvbnRleHQiLCJvTGFzdENvbnRleHQiLCJhTGluZXNQb21pc2VzIiwiYkxpbmVDaGFydCIsImlDdXJyZW50TWluWCIsImlDdXJyZW50TWF4WCIsImlDdXJyZW50TWluWSIsImlDdXJyZW50TWF4WSIsIm9NaW5YIiwidmFsdWUiLCJJbmZpbml0eSIsIm9NYXhYIiwib01pblkiLCJvTWF4WSIsImNvbnRleHQiLCJzTWVhc3VyZSIsImkiLCJpbmRleCIsInB1c2giLCJfZ2V0Q3JpdGljYWxpdHlGcm9tUG9pbnQiLCJQcm9taXNlIiwiYWxsIiwidGhlbiIsImFDb2xvcnMiLCJvTGluZSIsInNldENvbG9yIiwiX3NldENoYXJ0TGFiZWxzQ29sb3JzIiwiYUNyaXRpY2FsaXR5IiwibGVmdFRvcCIsInJpZ2h0VG9wIiwibGVmdEJvdHRvbSIsInJpZ2h0Qm90dG9tIiwiX2Zvcm1hdERhdGVBbmROdW1iZXJWYWx1ZSIsIm1lYXN1cmVQcmVjaXNpb24iLCJtZWFzdXJlU2NhbGUiLCJkaW1lbnNpb25QcmVjaXNpb24iLCJjYWxlbmRhclBhdHRlcm4iLCJvUG9pbnQiLCJvUmV0dXJuIiwicmVzb2x2ZSIsIk5ldXRyYWwiLCJvTWV0YU1vZGVsIiwiZ2V0TW9kZWwiLCJnZXRNZXRhTW9kZWwiLCJhRGF0YVBvaW50UXVhbGlmaWVycyIsImRhdGFQb2ludFF1YWxpZmllcnMiLCJzTWV0YVBhdGgiLCJPRGF0YU1ldGFNb2RlbCIsImdldFBhdGgiLCJnZXRNZXRhUGF0aCIsInJlcXVlc3RPYmplY3QiLCJvRGF0YVBvaW50Iiwic0NyaXRpY2FsaXR5Iiwib0NvbnRleHQiLCJDcml0aWNhbGl0eSIsIl9jcml0aWNhbGl0eSIsIkNyaXRpY2FsaXR5Q2FsY3VsYXRpb24iLCJvQ3JpdGljYWxpdHlDYWxjdWxhdGlvbiIsIm9DQyIsImZuR2V0VmFsdWUiLCJvUHJvcGVydHkiLCJzUmV0dXJuIiwiJFBhdGgiLCJoYXNPd25Qcm9wZXJ0eSIsIiREZWNpbWFsIiwic0FjY2VwdGFuY2VIaWdoIiwiQWNjZXB0YW5jZVJhbmdlSGlnaFZhbHVlIiwic0FjY2VwdGFuY2VMb3ciLCJBY2NlcHRhbmNlUmFuZ2VMb3dWYWx1ZSIsInNEZXZpYXRpb25IaWdoIiwiRGV2aWF0aW9uUmFuZ2VIaWdoVmFsdWUiLCJzRGV2aWF0aW9uTG93IiwiRGV2aWF0aW9uUmFuZ2VMb3dWYWx1ZSIsInNUb2xlcmFuY2VIaWdoIiwiVG9sZXJhbmNlUmFuZ2VIaWdoVmFsdWUiLCJzVG9sZXJhbmNlTG93IiwiVG9sZXJhbmNlUmFuZ2VMb3dWYWx1ZSIsInNJbXByb3ZlbWVudERpcmVjdGlvbiIsIkltcHJvdmVtZW50RGlyZWN0aW9uIiwiJEVudW1NZW1iZXIiLCJfY3JpdGljYWxpdHlDYWxjdWxhdGlvbiIsIm9Dcml0aWNhbGl0eSIsImlDcml0aWNhbGl0eSIsInNDcml0aWNhbGl0eVBhdGgiLCJFcnJvciIsIkNyaXRpY2FsIiwiR29vZCIsImluZGV4T2YiLCJMb2ciLCJ3YXJuaW5nIiwic0NyaXRpY2FsaXR5RXhwcmVzc2lvbiIsImlQcmVjaXNpb24iLCJpU2NhbGUiLCJzUGF0dGVybiIsIl9nZXRTZW1hbnRpY3NWYWx1ZUZvcm1hdHRlciIsImZvcm1hdFZhbHVlIiwiaXNOYU4iLCJfZ2V0TGFiZWxOdW1iZXJGb3JtYXR0ZXIiLCJmb3JtYXQiLCJfb0RhdGVUeXBlIiwiRGF0ZVR5cGUiLCJzdHlsZSIsInNvdXJjZSIsInBhdHRlcm4iLCJOdW1iZXJGb3JtYXQiLCJnZXRGbG9hdEluc3RhbmNlIiwic2hvd1NjYWxlIiwicHJlY2lzaW9uIiwiZGVjaW1hbHMiLCJDb250cm9sIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJNaWNyb0NoYXJ0Q29udGFpbmVyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMb2cgZnJvbSBcInNhcC9iYXNlL0xvZ1wiO1xuaW1wb3J0IHsgYWdncmVnYXRpb24sIGRlZmluZVVJNUNsYXNzLCBldmVudCwgcHJvcGVydHkgfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9DbGFzc1N1cHBvcnRcIjtcbmltcG9ydCBtYWNyb0xpYiBmcm9tIFwic2FwL2ZlL21hY3Jvcy9saWJyYXJ5XCI7XG5pbXBvcnQgRmxleEJveCBmcm9tIFwic2FwL20vRmxleEJveFwiO1xuaW1wb3J0IExhYmVsIGZyb20gXCJzYXAvbS9MYWJlbFwiO1xuaW1wb3J0IG1vYmlsZWxpYnJhcnkgZnJvbSBcInNhcC9tL2xpYnJhcnlcIjtcbmltcG9ydCBBcmVhTWljcm9DaGFydCBmcm9tIFwic2FwL3N1aXRlL3VpL21pY3JvY2hhcnQvQXJlYU1pY3JvQ2hhcnRcIjtcbmltcG9ydCBDb2x1bW5NaWNyb0NoYXJ0IGZyb20gXCJzYXAvc3VpdGUvdWkvbWljcm9jaGFydC9Db2x1bW5NaWNyb0NoYXJ0XCI7XG5pbXBvcnQgQ29tcGFyaXNvbk1pY3JvQ2hhcnQgZnJvbSBcInNhcC9zdWl0ZS91aS9taWNyb2NoYXJ0L0NvbXBhcmlzb25NaWNyb0NoYXJ0XCI7XG5pbXBvcnQgTGluZU1pY3JvQ2hhcnQgZnJvbSBcInNhcC9zdWl0ZS91aS9taWNyb2NoYXJ0L0xpbmVNaWNyb0NoYXJ0XCI7XG5pbXBvcnQgQ29udHJvbCBmcm9tIFwic2FwL3VpL2NvcmUvQ29udHJvbFwiO1xuaW1wb3J0IE51bWJlckZvcm1hdCBmcm9tIFwic2FwL3VpL2NvcmUvZm9ybWF0L051bWJlckZvcm1hdFwiO1xuaW1wb3J0IHR5cGUgUmVuZGVyTWFuYWdlciBmcm9tIFwic2FwL3VpL2NvcmUvUmVuZGVyTWFuYWdlclwiO1xuaW1wb3J0IHR5cGUgQ29udGV4dCBmcm9tIFwic2FwL3VpL21vZGVsL0NvbnRleHRcIjtcbmltcG9ydCBPRGF0YVY0TGlzdEJpbmRpbmcgZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NC9PRGF0YUxpc3RCaW5kaW5nXCI7XG5pbXBvcnQgT0RhdGFNZXRhTW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NC9PRGF0YU1ldGFNb2RlbFwiO1xuaW1wb3J0IERhdGVUeXBlIGZyb20gXCJzYXAvdWkvbW9kZWwvdHlwZS9EYXRlXCI7XG5cbmNvbnN0IE5hdmlnYXRpb25UeXBlID0gbWFjcm9MaWIuTmF2aWdhdGlvblR5cGU7XG5jb25zdCBWYWx1ZUNvbG9yID0gbW9iaWxlbGlicmFyeS5WYWx1ZUNvbG9yO1xuLyoqXG4gKiAgQ29udGFpbmVyIENvbnRyb2wgZm9yIE1pY3JvIENoYXJ0IGFuZCBVb00uXG4gKlxuICogQHByaXZhdGVcbiAqIEBleHBlcmltZW50YWwgVGhpcyBtb2R1bGUgaXMgb25seSBmb3IgaW50ZXJuYWwvZXhwZXJpbWVudGFsIHVzZSFcbiAqL1xuQGRlZmluZVVJNUNsYXNzKFwic2FwLmZlLm1hY3Jvcy5taWNyb2NoYXJ0Lk1pY3JvQ2hhcnRDb250YWluZXJcIilcbmNsYXNzIE1pY3JvQ2hhcnRDb250YWluZXIgZXh0ZW5kcyBDb250cm9sIHtcblx0QHByb3BlcnR5KHtcblx0XHR0eXBlOiBcImJvb2xlYW5cIixcblx0XHRkZWZhdWx0VmFsdWU6IGZhbHNlXG5cdH0pXG5cdHNob3dPbmx5Q2hhcnQhOiBib29sZWFuO1xuXHRAcHJvcGVydHkoe1xuXHRcdHR5cGU6IFwic3RyaW5nXCIsXG5cdFx0ZGVmYXVsdFZhbHVlOiB1bmRlZmluZWRcblx0fSlcblx0dW9tUGF0aCE6IHN0cmluZztcblx0QHByb3BlcnR5KHtcblx0XHR0eXBlOiBcInN0cmluZ1tdXCIsXG5cdFx0ZGVmYXVsdFZhbHVlOiBbXVxuXHR9KVxuXHRtZWFzdXJlcyE6IHN0cmluZ1tdO1xuXHRAcHJvcGVydHkoe1xuXHRcdHR5cGU6IFwic3RyaW5nXCIsXG5cdFx0ZGVmYXVsdFZhbHVlOiB1bmRlZmluZWRcblx0fSlcblx0ZGltZW5zaW9uPzogc3RyaW5nO1xuXHRAcHJvcGVydHkoe1xuXHRcdHR5cGU6IFwic3RyaW5nW11cIixcblx0XHRkZWZhdWx0VmFsdWU6IFtdXG5cdH0pXG5cdGRhdGFQb2ludFF1YWxpZmllcnMhOiBzdHJpbmdbXTtcblx0QHByb3BlcnR5KHtcblx0XHR0eXBlOiBcImludFwiLFxuXHRcdGRlZmF1bHRWYWx1ZTogdW5kZWZpbmVkXG5cdH0pXG5cdG1lYXN1cmVQcmVjaXNpb24hOiBudW1iZXI7XG5cdEBwcm9wZXJ0eSh7XG5cdFx0dHlwZTogXCJpbnRcIixcblx0XHRkZWZhdWx0VmFsdWU6IDFcblx0fSlcblx0bWVhc3VyZVNjYWxlITogbnVtYmVyO1xuXHRAcHJvcGVydHkoe1xuXHRcdHR5cGU6IFwiaW50XCIsXG5cdFx0ZGVmYXVsdFZhbHVlOiB1bmRlZmluZWRcblx0fSlcblx0ZGltZW5zaW9uUHJlY2lzaW9uPzogbnVtYmVyO1xuXHRAcHJvcGVydHkoe1xuXHRcdHR5cGU6IFwic3RyaW5nXCIsXG5cdFx0ZGVmYXVsdFZhbHVlOiBcIlwiXG5cdH0pXG5cdGNoYXJ0VGl0bGUhOiBzdHJpbmc7XG5cdEBwcm9wZXJ0eSh7XG5cdFx0dHlwZTogXCJzdHJpbmdcIixcblx0XHRkZWZhdWx0VmFsdWU6IFwiXCJcblx0fSlcblx0Y2hhcnREZXNjcmlwdGlvbiE6IHN0cmluZztcblx0QHByb3BlcnR5KHtcblx0XHR0eXBlOiBcInNhcC5mZS5tYWNyb3MuTmF2aWdhdGlvblR5cGVcIixcblx0XHRkZWZhdWx0VmFsdWU6IFwiTm9uZVwiXG5cdH0pXG5cdG5hdmlnYXRpb25UeXBlITogdHlwZW9mIE5hdmlnYXRpb25UeXBlO1xuXHRAcHJvcGVydHkoe1xuXHRcdHR5cGU6IFwic3RyaW5nXCIsXG5cdFx0ZGVmYXVsdFZhbHVlOiBcIlwiXG5cdH0pXG5cdGNhbGVuZGFyUGF0dGVybiE6IHN0cmluZztcblx0QGV2ZW50KClcblx0b25UaXRsZVByZXNzZWQhOiBGdW5jdGlvbjtcblxuXHRAYWdncmVnYXRpb24oe1xuXHRcdHR5cGU6IFwic2FwLnVpLmNvcmUuQ29udHJvbFwiLFxuXHRcdG11bHRpcGxlOiBmYWxzZSxcblx0XHRpc0RlZmF1bHQ6IHRydWVcblx0fSlcblx0bWljcm9DaGFydCE6IENvbnRyb2w7XG5cdEBhZ2dyZWdhdGlvbih7XG5cdFx0dHlwZTogXCJzYXAubS5MYWJlbFwiLFxuXHRcdG11bHRpcGxlOiBmYWxzZVxuXHR9KVxuXHRfdW9tTGFiZWwhOiBMYWJlbDtcblxuXHRAYWdncmVnYXRpb24oe1xuXHRcdHR5cGU6IFwic2FwLnVpLmNvcmUuQ29udHJvbFwiLFxuXHRcdG11bHRpcGxlOiB0cnVlXG5cdH0pXG5cdG1pY3JvQ2hhcnRUaXRsZSE6IENvbnRyb2xbXTtcblx0cHJpdmF0ZSBfb2xpc3RCaW5kaW5nPzogT0RhdGFWNExpc3RCaW5kaW5nO1xuXHRwcml2YXRlIF9vRGF0ZVR5cGU/OiBEYXRlVHlwZTtcblxuXHRzdGF0aWMgcmVuZGVyKG9SbTogUmVuZGVyTWFuYWdlciwgb0NvbnRyb2w6IE1pY3JvQ2hhcnRDb250YWluZXIpIHtcblx0XHRvUm0ub3BlblN0YXJ0KFwiZGl2XCIsIG9Db250cm9sKTtcblx0XHRvUm0ub3BlbkVuZCgpO1xuXHRcdGlmICghb0NvbnRyb2wuc2hvd09ubHlDaGFydCkge1xuXHRcdFx0Y29uc3Qgb0NoYXJ0VGl0bGUgPSBvQ29udHJvbC5taWNyb0NoYXJ0VGl0bGU7XG5cdFx0XHRpZiAob0NoYXJ0VGl0bGUpIHtcblx0XHRcdFx0b0NoYXJ0VGl0bGUuZm9yRWFjaChmdW5jdGlvbiAob1N1YkNoYXJ0VGl0bGU6IGFueSkge1xuXHRcdFx0XHRcdG9SbS5vcGVuU3RhcnQoXCJkaXZcIik7XG5cdFx0XHRcdFx0b1JtLm9wZW5FbmQoKTtcblx0XHRcdFx0XHRvUm0ucmVuZGVyQ29udHJvbChvU3ViQ2hhcnRUaXRsZSk7XG5cdFx0XHRcdFx0b1JtLmNsb3NlKFwiZGl2XCIpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdG9SbS5vcGVuU3RhcnQoXCJkaXZcIik7XG5cdFx0XHRvUm0ub3BlbkVuZCgpO1xuXHRcdFx0Y29uc3Qgb0NoYXJ0RGVzY3JpcHRpb24gPSBuZXcgTGFiZWwoeyB0ZXh0OiBvQ29udHJvbC5jaGFydERlc2NyaXB0aW9uIH0pO1xuXHRcdFx0b1JtLnJlbmRlckNvbnRyb2wob0NoYXJ0RGVzY3JpcHRpb24pO1xuXHRcdFx0b1JtLmNsb3NlKFwiZGl2XCIpO1xuXHRcdH1cblx0XHRjb25zdCBvTWljcm9DaGFydCA9IG9Db250cm9sLm1pY3JvQ2hhcnQ7XG5cdFx0aWYgKG9NaWNyb0NoYXJ0KSB7XG5cdFx0XHRvTWljcm9DaGFydC5hZGRTdHlsZUNsYXNzKFwic2FwVWlUaW55TWFyZ2luVG9wQm90dG9tXCIpO1xuXHRcdFx0b1JtLnJlbmRlckNvbnRyb2wob01pY3JvQ2hhcnQpO1xuXHRcdFx0aWYgKCFvQ29udHJvbC5zaG93T25seUNoYXJ0ICYmIG9Db250cm9sLnVvbVBhdGgpIHtcblx0XHRcdFx0Y29uc3Qgb1NldHRpbmdzID0gb0NvbnRyb2wuX2NoZWNrSWZDaGFydFJlcXVpcmVzUnVudGltZUxhYmVscygpID8gdW5kZWZpbmVkIDogeyB0ZXh0OiB7IHBhdGg6IG9Db250cm9sLnVvbVBhdGggfSB9LFxuXHRcdFx0XHRcdG9MYWJlbCA9IG5ldyBMYWJlbChvU2V0dGluZ3MpLFxuXHRcdFx0XHRcdG9GbGV4Qm94ID0gbmV3IEZsZXhCb3goe1xuXHRcdFx0XHRcdFx0YWxpZ25JdGVtczogXCJTdGFydFwiLFxuXHRcdFx0XHRcdFx0anVzdGlmeUNvbnRlbnQ6IFwiRW5kXCIsXG5cdFx0XHRcdFx0XHRpdGVtczogW29MYWJlbF1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0b1JtLnJlbmRlckNvbnRyb2wob0ZsZXhCb3gpO1xuXHRcdFx0XHRvQ29udHJvbC5zZXRBZ2dyZWdhdGlvbihcIl91b21MYWJlbFwiLCBvTGFiZWwpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRvUm0uY2xvc2UoXCJkaXZcIik7XG5cdH1cblx0b25CZWZvcmVSZW5kZXJpbmcoKSB7XG5cdFx0Y29uc3Qgb0JpbmRpbmcgPSB0aGlzLl9nZXRMaXN0QmluZGluZ0ZvclJ1bnRpbWVMYWJlbHMoKTtcblx0XHRpZiAob0JpbmRpbmcpIHtcblx0XHRcdG9CaW5kaW5nLmRldGFjaEV2ZW50KFwiY2hhbmdlXCIsIHRoaXMuX3NldFJ1bnRpbWVDaGFydExhYmVsc0FuZFVuaXRPZk1lYXN1cmUsIHRoaXMpO1xuXHRcdFx0dGhpcy5fb2xpc3RCaW5kaW5nID0gdW5kZWZpbmVkO1xuXHRcdH1cblx0fVxuXHRvbkFmdGVyUmVuZGVyaW5nKCkge1xuXHRcdGNvbnN0IG9CaW5kaW5nID0gdGhpcy5fZ2V0TGlzdEJpbmRpbmdGb3JSdW50aW1lTGFiZWxzKCk7XG5cblx0XHRpZiAoIXRoaXMuX2NoZWNrSWZDaGFydFJlcXVpcmVzUnVudGltZUxhYmVscygpKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGlmIChvQmluZGluZykge1xuXHRcdFx0KG9CaW5kaW5nLmF0dGFjaEV2ZW50IGFzIGFueSkoXCJjaGFuZ2VcIiwgdGhpcy5fc2V0UnVudGltZUNoYXJ0TGFiZWxzQW5kVW5pdE9mTWVhc3VyZSwgdGhpcyk7XG5cdFx0XHR0aGlzLl9vbGlzdEJpbmRpbmcgPSBvQmluZGluZztcblx0XHR9XG5cdH1cblx0c2V0U2hvd09ubHlDaGFydChzVmFsdWU6IGFueSkge1xuXHRcdGlmICghc1ZhbHVlICYmIHRoaXMuX29saXN0QmluZGluZykge1xuXHRcdFx0dGhpcy5fc2V0Q2hhcnRMYWJlbHMoKTtcblx0XHR9XG5cdFx0dGhpcy5zZXRQcm9wZXJ0eShcInNob3dPbmx5Q2hhcnRcIiwgc1ZhbHVlLCBmYWxzZSAvKnJlLXJlbmRlcmluZyovKTtcblx0fVxuXHRfY2hlY2tJZkNoYXJ0UmVxdWlyZXNSdW50aW1lTGFiZWxzKCkge1xuXHRcdGNvbnN0IG9NaWNyb0NoYXJ0ID0gdGhpcy5taWNyb0NoYXJ0O1xuXG5cdFx0cmV0dXJuIEJvb2xlYW4oXG5cdFx0XHRvTWljcm9DaGFydCBpbnN0YW5jZW9mIEFyZWFNaWNyb0NoYXJ0IHx8XG5cdFx0XHRcdG9NaWNyb0NoYXJ0IGluc3RhbmNlb2YgQ29sdW1uTWljcm9DaGFydCB8fFxuXHRcdFx0XHRvTWljcm9DaGFydCBpbnN0YW5jZW9mIExpbmVNaWNyb0NoYXJ0IHx8XG5cdFx0XHRcdG9NaWNyb0NoYXJ0IGluc3RhbmNlb2YgQ29tcGFyaXNvbk1pY3JvQ2hhcnRcblx0XHQpO1xuXHR9XG5cdF9jaGVja0ZvckNoYXJ0TGFiZWxBZ2dyZWdhdGlvbnMoKSB7XG5cdFx0Y29uc3Qgb01pY3JvQ2hhcnQgPSB0aGlzLm1pY3JvQ2hhcnQ7XG5cdFx0cmV0dXJuIEJvb2xlYW4oXG5cdFx0XHQob01pY3JvQ2hhcnQgaW5zdGFuY2VvZiBBcmVhTWljcm9DaGFydCAmJlxuXHRcdFx0XHRvTWljcm9DaGFydC5nZXRBZ2dyZWdhdGlvbihcImZpcnN0WUxhYmVsXCIpICYmXG5cdFx0XHRcdG9NaWNyb0NoYXJ0LmdldEFnZ3JlZ2F0aW9uKFwibGFzdFlMYWJlbFwiKSAmJlxuXHRcdFx0XHRvTWljcm9DaGFydC5nZXRBZ2dyZWdhdGlvbihcImZpcnN0WExhYmVsXCIpICYmXG5cdFx0XHRcdG9NaWNyb0NoYXJ0LmdldEFnZ3JlZ2F0aW9uKFwibGFzdFhMYWJlbFwiKSkgfHxcblx0XHRcdFx0KG9NaWNyb0NoYXJ0IGluc3RhbmNlb2YgQ29sdW1uTWljcm9DaGFydCAmJlxuXHRcdFx0XHRcdG9NaWNyb0NoYXJ0LmdldEFnZ3JlZ2F0aW9uKFwibGVmdFRvcExhYmVsXCIpICYmXG5cdFx0XHRcdFx0b01pY3JvQ2hhcnQuZ2V0QWdncmVnYXRpb24oXCJyaWdodFRvcExhYmVsXCIpICYmXG5cdFx0XHRcdFx0b01pY3JvQ2hhcnQuZ2V0QWdncmVnYXRpb24oXCJsZWZ0Qm90dG9tTGFiZWxcIikgJiZcblx0XHRcdFx0XHRvTWljcm9DaGFydC5nZXRBZ2dyZWdhdGlvbihcInJpZ2h0Qm90dG9tTGFiZWxcIikpIHx8XG5cdFx0XHRcdG9NaWNyb0NoYXJ0IGluc3RhbmNlb2YgTGluZU1pY3JvQ2hhcnRcblx0XHQpO1xuXHR9XG5cdF9nZXRMaXN0QmluZGluZ0ZvclJ1bnRpbWVMYWJlbHMoKSB7XG5cdFx0Y29uc3Qgb01pY3JvQ2hhcnQgPSB0aGlzLm1pY3JvQ2hhcnQ7XG5cdFx0bGV0IG9CaW5kaW5nO1xuXHRcdGlmIChvTWljcm9DaGFydCBpbnN0YW5jZW9mIEFyZWFNaWNyb0NoYXJ0KSB7XG5cdFx0XHRjb25zdCBvQ2hhcnQgPSBvTWljcm9DaGFydC5nZXRDaGFydCgpO1xuXHRcdFx0b0JpbmRpbmcgPSBvQ2hhcnQgJiYgb01pY3JvQ2hhcnQuZ2V0Q2hhcnQoKS5nZXRCaW5kaW5nKFwicG9pbnRzXCIpO1xuXHRcdH0gZWxzZSBpZiAob01pY3JvQ2hhcnQgaW5zdGFuY2VvZiBDb2x1bW5NaWNyb0NoYXJ0KSB7XG5cdFx0XHRvQmluZGluZyA9IG9NaWNyb0NoYXJ0LmdldEJpbmRpbmcoXCJjb2x1bW5zXCIpO1xuXHRcdH0gZWxzZSBpZiAob01pY3JvQ2hhcnQgaW5zdGFuY2VvZiBMaW5lTWljcm9DaGFydCkge1xuXHRcdFx0Y29uc3QgYUxpbmVzID0gb01pY3JvQ2hhcnQuZ2V0TGluZXMoKTtcblx0XHRcdG9CaW5kaW5nID0gYUxpbmVzICYmIGFMaW5lcy5sZW5ndGggJiYgYUxpbmVzWzBdLmdldEJpbmRpbmcoXCJwb2ludHNcIik7XG5cdFx0fSBlbHNlIGlmIChvTWljcm9DaGFydCBpbnN0YW5jZW9mIENvbXBhcmlzb25NaWNyb0NoYXJ0KSB7XG5cdFx0XHRvQmluZGluZyA9IG9NaWNyb0NoYXJ0LmdldEJpbmRpbmcoXCJkYXRhXCIpO1xuXHRcdH1cblx0XHRyZXR1cm4gb0JpbmRpbmcgaW5zdGFuY2VvZiBPRGF0YVY0TGlzdEJpbmRpbmcgPyBvQmluZGluZyA6IGZhbHNlO1xuXHR9XG5cdF9zZXRSdW50aW1lQ2hhcnRMYWJlbHNBbmRVbml0T2ZNZWFzdXJlKCkge1xuXHRcdGNvbnN0IG9MaXN0QmluZGluZyA9IHRoaXMuX29saXN0QmluZGluZyxcblx0XHRcdGFDb250ZXh0cyA9IG9MaXN0QmluZGluZz8uZ2V0Q29udGV4dHMoKSxcblx0XHRcdGFNZWFzdXJlcyA9IHRoaXMubWVhc3VyZXMgfHwgW10sXG5cdFx0XHRzRGltZW5zaW9uID0gdGhpcy5kaW1lbnNpb24sXG5cdFx0XHRzVW5pdE9mTWVhc3VyZVBhdGggPSB0aGlzLnVvbVBhdGgsXG5cdFx0XHRvTWljcm9DaGFydCA9IHRoaXMubWljcm9DaGFydCxcblx0XHRcdG9Vbml0T2ZNZWFzdXJlTGFiZWwgPSB0aGlzLl91b21MYWJlbDtcblxuXHRcdGlmIChvVW5pdE9mTWVhc3VyZUxhYmVsICYmIHNVbml0T2ZNZWFzdXJlUGF0aCAmJiBhQ29udGV4dHMgJiYgYUNvbnRleHRzLmxlbmd0aCAmJiAhdGhpcy5zaG93T25seUNoYXJ0KSB7XG5cdFx0XHRvVW5pdE9mTWVhc3VyZUxhYmVsLnNldFRleHQoYUNvbnRleHRzWzBdLmdldE9iamVjdChzVW5pdE9mTWVhc3VyZVBhdGgpKTtcblx0XHR9IGVsc2UgaWYgKG9Vbml0T2ZNZWFzdXJlTGFiZWwpIHtcblx0XHRcdG9Vbml0T2ZNZWFzdXJlTGFiZWwuc2V0VGV4dChcIlwiKTtcblx0XHR9XG5cblx0XHRpZiAoIXRoaXMuX2NoZWNrRm9yQ2hhcnRMYWJlbEFnZ3JlZ2F0aW9ucygpKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCFhQ29udGV4dHMgfHwgIWFDb250ZXh0cy5sZW5ndGgpIHtcblx0XHRcdHRoaXMuX3NldENoYXJ0TGFiZWxzKCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3Qgb0ZpcnN0Q29udGV4dCA9IGFDb250ZXh0c1swXSxcblx0XHRcdG9MYXN0Q29udGV4dCA9IGFDb250ZXh0c1thQ29udGV4dHMubGVuZ3RoIC0gMV0sXG5cdFx0XHRhTGluZXNQb21pc2VzOiBhbnlbXSA9IFtdLFxuXHRcdFx0YkxpbmVDaGFydCA9IG9NaWNyb0NoYXJ0IGluc3RhbmNlb2YgTGluZU1pY3JvQ2hhcnQsXG5cdFx0XHRpQ3VycmVudE1pblggPSBvRmlyc3RDb250ZXh0LmdldE9iamVjdChzRGltZW5zaW9uKSxcblx0XHRcdGlDdXJyZW50TWF4WCA9IG9MYXN0Q29udGV4dC5nZXRPYmplY3Qoc0RpbWVuc2lvbik7XG5cdFx0bGV0IGlDdXJyZW50TWluWSxcblx0XHRcdGlDdXJyZW50TWF4WSxcblx0XHRcdG9NaW5YOiBhbnkgPSB7IHZhbHVlOiBJbmZpbml0eSB9LFxuXHRcdFx0b01heFg6IGFueSA9IHsgdmFsdWU6IC1JbmZpbml0eSB9LFxuXHRcdFx0b01pblk6IGFueSA9IHsgdmFsdWU6IEluZmluaXR5IH0sXG5cdFx0XHRvTWF4WTogYW55ID0geyB2YWx1ZTogLUluZmluaXR5IH07XG5cblx0XHRvTWluWCA9IGlDdXJyZW50TWluWCA9PSB1bmRlZmluZWQgPyBvTWluWCA6IHsgY29udGV4dDogb0ZpcnN0Q29udGV4dCwgdmFsdWU6IGlDdXJyZW50TWluWCB9O1xuXHRcdG9NYXhYID0gaUN1cnJlbnRNYXhYID09IHVuZGVmaW5lZCA/IG9NYXhYIDogeyBjb250ZXh0OiBvTGFzdENvbnRleHQsIHZhbHVlOiBpQ3VycmVudE1heFggfTtcblxuXHRcdGFNZWFzdXJlcy5mb3JFYWNoKChzTWVhc3VyZTogYW55LCBpOiBhbnkpID0+IHtcblx0XHRcdGlDdXJyZW50TWluWSA9IG9GaXJzdENvbnRleHQuZ2V0T2JqZWN0KHNNZWFzdXJlKTtcblx0XHRcdGlDdXJyZW50TWF4WSA9IG9MYXN0Q29udGV4dC5nZXRPYmplY3Qoc01lYXN1cmUpO1xuXHRcdFx0b01heFkgPSBpQ3VycmVudE1heFkgPiBvTWF4WS52YWx1ZSA/IHsgY29udGV4dDogb0xhc3RDb250ZXh0LCB2YWx1ZTogaUN1cnJlbnRNYXhZLCBpbmRleDogYkxpbmVDaGFydCA/IGkgOiAwIH0gOiBvTWF4WTtcblx0XHRcdG9NaW5ZID0gaUN1cnJlbnRNaW5ZIDwgb01pblkudmFsdWUgPyB7IGNvbnRleHQ6IG9GaXJzdENvbnRleHQsIHZhbHVlOiBpQ3VycmVudE1pblksIGluZGV4OiBiTGluZUNoYXJ0ID8gaSA6IDAgfSA6IG9NaW5ZO1xuXHRcdFx0aWYgKGJMaW5lQ2hhcnQpIHtcblx0XHRcdFx0YUxpbmVzUG9taXNlcy5wdXNoKHRoaXMuX2dldENyaXRpY2FsaXR5RnJvbVBvaW50KHsgY29udGV4dDogb0xhc3RDb250ZXh0LCB2YWx1ZTogaUN1cnJlbnRNYXhZLCBpbmRleDogaSB9KSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0dGhpcy5fc2V0Q2hhcnRMYWJlbHMob01pblkudmFsdWUsIG9NYXhZLnZhbHVlLCBvTWluWC52YWx1ZSwgb01heFgudmFsdWUpO1xuXHRcdGlmIChiTGluZUNoYXJ0KSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5hbGwoYUxpbmVzUG9taXNlcykudGhlbihmdW5jdGlvbiAoYUNvbG9yczogYW55W10pIHtcblx0XHRcdFx0Y29uc3QgYUxpbmVzID0gb01pY3JvQ2hhcnQuZ2V0TGluZXMoKTtcblx0XHRcdFx0YUxpbmVzLmZvckVhY2goZnVuY3Rpb24gKG9MaW5lOiBhbnksIGk6IGFueSkge1xuXHRcdFx0XHRcdG9MaW5lLnNldENvbG9yKGFDb2xvcnNbaV0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fc2V0Q2hhcnRMYWJlbHNDb2xvcnMob01heFksIG9NaW5ZKTtcblx0XHR9XG5cdH1cblx0X3NldENoYXJ0TGFiZWxzQ29sb3JzKG9NYXhZOiBvYmplY3QsIG9NaW5ZOiBvYmplY3QpIHtcblx0XHRjb25zdCBvTWljcm9DaGFydCA9IHRoaXMubWljcm9DaGFydDtcblxuXHRcdHJldHVybiBQcm9taXNlLmFsbChbdGhpcy5fZ2V0Q3JpdGljYWxpdHlGcm9tUG9pbnQob01pblkpLCB0aGlzLl9nZXRDcml0aWNhbGl0eUZyb21Qb2ludChvTWF4WSldKS50aGVuKGZ1bmN0aW9uIChcblx0XHRcdGFDcml0aWNhbGl0eTogW2FueSwgYW55XVxuXHRcdCkge1xuXHRcdFx0aWYgKG9NaWNyb0NoYXJ0IGluc3RhbmNlb2YgQXJlYU1pY3JvQ2hhcnQpIHtcblx0XHRcdFx0KG9NaWNyb0NoYXJ0LmdldEFnZ3JlZ2F0aW9uKFwiZmlyc3RZTGFiZWxcIikgYXMgYW55KS5zZXRQcm9wZXJ0eShcImNvbG9yXCIsIGFDcml0aWNhbGl0eVswXSwgdHJ1ZSk7XG5cdFx0XHRcdChvTWljcm9DaGFydC5nZXRBZ2dyZWdhdGlvbihcImxhc3RZTGFiZWxcIikgYXMgYW55KS5zZXRQcm9wZXJ0eShcImNvbG9yXCIsIGFDcml0aWNhbGl0eVsxXSwgdHJ1ZSk7XG5cdFx0XHR9IGVsc2UgaWYgKG9NaWNyb0NoYXJ0IGluc3RhbmNlb2YgQ29sdW1uTWljcm9DaGFydCkge1xuXHRcdFx0XHQob01pY3JvQ2hhcnQuZ2V0QWdncmVnYXRpb24oXCJsZWZ0VG9wTGFiZWxcIikgYXMgYW55KS5zZXRQcm9wZXJ0eShcImNvbG9yXCIsIGFDcml0aWNhbGl0eVswXSwgdHJ1ZSk7XG5cdFx0XHRcdChvTWljcm9DaGFydC5nZXRBZ2dyZWdhdGlvbihcInJpZ2h0VG9wTGFiZWxcIikgYXMgYW55KS5zZXRQcm9wZXJ0eShcImNvbG9yXCIsIGFDcml0aWNhbGl0eVsxXSwgdHJ1ZSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblx0X3NldENoYXJ0TGFiZWxzKGxlZnRUb3A/OiBvYmplY3QsIHJpZ2h0VG9wPzogb2JqZWN0LCBsZWZ0Qm90dG9tPzogb2JqZWN0LCByaWdodEJvdHRvbT86IG9iamVjdCkge1xuXHRcdGNvbnN0IG9NaWNyb0NoYXJ0ID0gdGhpcy5taWNyb0NoYXJ0O1xuXG5cdFx0bGVmdFRvcCA9IHRoaXMuX2Zvcm1hdERhdGVBbmROdW1iZXJWYWx1ZShsZWZ0VG9wLCB0aGlzLm1lYXN1cmVQcmVjaXNpb24sIHRoaXMubWVhc3VyZVNjYWxlKTtcblx0XHRyaWdodFRvcCA9IHRoaXMuX2Zvcm1hdERhdGVBbmROdW1iZXJWYWx1ZShyaWdodFRvcCwgdGhpcy5tZWFzdXJlUHJlY2lzaW9uLCB0aGlzLm1lYXN1cmVTY2FsZSk7XG5cdFx0bGVmdEJvdHRvbSA9IHRoaXMuX2Zvcm1hdERhdGVBbmROdW1iZXJWYWx1ZShsZWZ0Qm90dG9tLCB0aGlzLmRpbWVuc2lvblByZWNpc2lvbiwgdW5kZWZpbmVkLCB0aGlzLmNhbGVuZGFyUGF0dGVybik7XG5cdFx0cmlnaHRCb3R0b20gPSB0aGlzLl9mb3JtYXREYXRlQW5kTnVtYmVyVmFsdWUocmlnaHRCb3R0b20sIHRoaXMuZGltZW5zaW9uUHJlY2lzaW9uLCB1bmRlZmluZWQsIHRoaXMuY2FsZW5kYXJQYXR0ZXJuKTtcblxuXHRcdGlmIChvTWljcm9DaGFydCBpbnN0YW5jZW9mIEFyZWFNaWNyb0NoYXJ0KSB7XG5cdFx0XHQob01pY3JvQ2hhcnQuZ2V0QWdncmVnYXRpb24oXCJmaXJzdFlMYWJlbFwiKSBhcyBhbnkpLnNldFByb3BlcnR5KFwibGFiZWxcIiwgbGVmdFRvcCwgZmFsc2UpO1xuXHRcdFx0KG9NaWNyb0NoYXJ0LmdldEFnZ3JlZ2F0aW9uKFwibGFzdFlMYWJlbFwiKSBhcyBhbnkpLnNldFByb3BlcnR5KFwibGFiZWxcIiwgcmlnaHRUb3AsIGZhbHNlKTtcblx0XHRcdChvTWljcm9DaGFydC5nZXRBZ2dyZWdhdGlvbihcImZpcnN0WExhYmVsXCIpIGFzIGFueSkuc2V0UHJvcGVydHkoXCJsYWJlbFwiLCBsZWZ0Qm90dG9tLCBmYWxzZSk7XG5cdFx0XHQob01pY3JvQ2hhcnQuZ2V0QWdncmVnYXRpb24oXCJsYXN0WExhYmVsXCIpIGFzIGFueSkuc2V0UHJvcGVydHkoXCJsYWJlbFwiLCByaWdodEJvdHRvbSwgZmFsc2UpO1xuXHRcdH0gZWxzZSBpZiAob01pY3JvQ2hhcnQgaW5zdGFuY2VvZiBDb2x1bW5NaWNyb0NoYXJ0KSB7XG5cdFx0XHQob01pY3JvQ2hhcnQuZ2V0QWdncmVnYXRpb24oXCJsZWZ0VG9wTGFiZWxcIikgYXMgYW55KS5zZXRQcm9wZXJ0eShcImxhYmVsXCIsIGxlZnRUb3AsIGZhbHNlKTtcblx0XHRcdChvTWljcm9DaGFydC5nZXRBZ2dyZWdhdGlvbihcInJpZ2h0VG9wTGFiZWxcIikgYXMgYW55KS5zZXRQcm9wZXJ0eShcImxhYmVsXCIsIHJpZ2h0VG9wLCBmYWxzZSk7XG5cdFx0XHQob01pY3JvQ2hhcnQuZ2V0QWdncmVnYXRpb24oXCJsZWZ0Qm90dG9tTGFiZWxcIikgYXMgYW55KS5zZXRQcm9wZXJ0eShcImxhYmVsXCIsIGxlZnRCb3R0b20sIGZhbHNlKTtcblx0XHRcdChvTWljcm9DaGFydC5nZXRBZ2dyZWdhdGlvbihcInJpZ2h0Qm90dG9tTGFiZWxcIikgYXMgYW55KS5zZXRQcm9wZXJ0eShcImxhYmVsXCIsIHJpZ2h0Qm90dG9tLCBmYWxzZSk7XG5cdFx0fSBlbHNlIGlmIChvTWljcm9DaGFydCBpbnN0YW5jZW9mIExpbmVNaWNyb0NoYXJ0KSB7XG5cdFx0XHRvTWljcm9DaGFydC5zZXRQcm9wZXJ0eShcImxlZnRUb3BMYWJlbFwiLCBsZWZ0VG9wLCBmYWxzZSk7XG5cdFx0XHRvTWljcm9DaGFydC5zZXRQcm9wZXJ0eShcInJpZ2h0VG9wTGFiZWxcIiwgcmlnaHRUb3AsIGZhbHNlKTtcblx0XHRcdG9NaWNyb0NoYXJ0LnNldFByb3BlcnR5KFwibGVmdEJvdHRvbUxhYmVsXCIsIGxlZnRCb3R0b20sIGZhbHNlKTtcblx0XHRcdG9NaWNyb0NoYXJ0LnNldFByb3BlcnR5KFwicmlnaHRCb3R0b21MYWJlbFwiLCByaWdodEJvdHRvbSwgZmFsc2UpO1xuXHRcdH1cblx0fVxuXHRfZ2V0Q3JpdGljYWxpdHlGcm9tUG9pbnQob1BvaW50OiBhbnkpIHtcblx0XHRsZXQgb1JldHVybiA9IFByb21pc2UucmVzb2x2ZShWYWx1ZUNvbG9yLk5ldXRyYWwpO1xuXHRcdGNvbnN0IG9NZXRhTW9kZWwgPSB0aGlzLmdldE1vZGVsKCkgJiYgKHRoaXMuZ2V0TW9kZWwoKS5nZXRNZXRhTW9kZWwoKSBhcyBPRGF0YU1ldGFNb2RlbCksXG5cdFx0XHRhRGF0YVBvaW50UXVhbGlmaWVycyA9IHRoaXMuZGF0YVBvaW50UXVhbGlmaWVycyxcblx0XHRcdHNNZXRhUGF0aCA9XG5cdFx0XHRcdG9NZXRhTW9kZWwgaW5zdGFuY2VvZiBPRGF0YU1ldGFNb2RlbCAmJlxuXHRcdFx0XHRvUG9pbnQgJiZcblx0XHRcdFx0b1BvaW50LmNvbnRleHQgJiZcblx0XHRcdFx0b1BvaW50LmNvbnRleHQuZ2V0UGF0aCgpICYmXG5cdFx0XHRcdG9NZXRhTW9kZWwuZ2V0TWV0YVBhdGgob1BvaW50LmNvbnRleHQuZ2V0UGF0aCgpKTtcblxuXHRcdGlmICh0eXBlb2Ygc01ldGFQYXRoID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRvUmV0dXJuID0gb01ldGFNb2RlbFxuXHRcdFx0XHQucmVxdWVzdE9iamVjdChcblx0XHRcdFx0XHRgJHtzTWV0YVBhdGh9L0Bjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhUG9pbnQke1xuXHRcdFx0XHRcdFx0YURhdGFQb2ludFF1YWxpZmllcnNbb1BvaW50LmluZGV4XSA/IGAjJHthRGF0YVBvaW50UXVhbGlmaWVyc1tvUG9pbnQuaW5kZXhdfWAgOiBcIlwiXG5cdFx0XHRcdFx0fWBcblx0XHRcdFx0KVxuXHRcdFx0XHQudGhlbigob0RhdGFQb2ludDogYW55KSA9PiB7XG5cdFx0XHRcdFx0bGV0IHNDcml0aWNhbGl0eSA9IFZhbHVlQ29sb3IuTmV1dHJhbDtcblx0XHRcdFx0XHRjb25zdCBvQ29udGV4dCA9IG9Qb2ludC5jb250ZXh0O1xuXHRcdFx0XHRcdGlmIChvRGF0YVBvaW50LkNyaXRpY2FsaXR5KSB7XG5cdFx0XHRcdFx0XHRzQ3JpdGljYWxpdHkgPSB0aGlzLl9jcml0aWNhbGl0eShvRGF0YVBvaW50LkNyaXRpY2FsaXR5LCBvQ29udGV4dCk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChvRGF0YVBvaW50LkNyaXRpY2FsaXR5Q2FsY3VsYXRpb24pIHtcblx0XHRcdFx0XHRcdGNvbnN0IG9Dcml0aWNhbGl0eUNhbGN1bGF0aW9uID0gb0RhdGFQb2ludC5Dcml0aWNhbGl0eUNhbGN1bGF0aW9uLFxuXHRcdFx0XHRcdFx0XHRvQ0M6IGFueSA9IHt9LFxuXHRcdFx0XHRcdFx0XHRmbkdldFZhbHVlID0gZnVuY3Rpb24gKG9Qcm9wZXJ0eTogYW55KSB7XG5cdFx0XHRcdFx0XHRcdFx0bGV0IHNSZXR1cm47XG5cdFx0XHRcdFx0XHRcdFx0aWYgKG9Qcm9wZXJ0eS4kUGF0aCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0c1JldHVybiA9IG9Db250ZXh0LmdldE9iamVjdChvUHJvcGVydHkuJFBhdGgpO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAob1Byb3BlcnR5Lmhhc093blByb3BlcnR5KFwiJERlY2ltYWxcIikpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHNSZXR1cm4gPSBvUHJvcGVydHkuJERlY2ltYWw7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBzUmV0dXJuO1xuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0b0NDLnNBY2NlcHRhbmNlSGlnaCA9IG9Dcml0aWNhbGl0eUNhbGN1bGF0aW9uLkFjY2VwdGFuY2VSYW5nZUhpZ2hWYWx1ZVxuXHRcdFx0XHRcdFx0XHQ/IGZuR2V0VmFsdWUob0NyaXRpY2FsaXR5Q2FsY3VsYXRpb24uQWNjZXB0YW5jZVJhbmdlSGlnaFZhbHVlKVxuXHRcdFx0XHRcdFx0XHQ6IHVuZGVmaW5lZDtcblx0XHRcdFx0XHRcdG9DQy5zQWNjZXB0YW5jZUxvdyA9IG9Dcml0aWNhbGl0eUNhbGN1bGF0aW9uLkFjY2VwdGFuY2VSYW5nZUxvd1ZhbHVlXG5cdFx0XHRcdFx0XHRcdD8gZm5HZXRWYWx1ZShvQ3JpdGljYWxpdHlDYWxjdWxhdGlvbi5BY2NlcHRhbmNlUmFuZ2VMb3dWYWx1ZSlcblx0XHRcdFx0XHRcdFx0OiB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0XHRvQ0Muc0RldmlhdGlvbkhpZ2ggPSBvQ3JpdGljYWxpdHlDYWxjdWxhdGlvbi5EZXZpYXRpb25SYW5nZUhpZ2hWYWx1ZVxuXHRcdFx0XHRcdFx0XHQ/IGZuR2V0VmFsdWUob0NyaXRpY2FsaXR5Q2FsY3VsYXRpb24uRGV2aWF0aW9uUmFuZ2VIaWdoVmFsdWUpXG5cdFx0XHRcdFx0XHRcdDogdW5kZWZpbmVkO1xuXHRcdFx0XHRcdFx0b0NDLnNEZXZpYXRpb25Mb3cgPSBvQ3JpdGljYWxpdHlDYWxjdWxhdGlvbi5EZXZpYXRpb25SYW5nZUxvd1ZhbHVlXG5cdFx0XHRcdFx0XHRcdD8gZm5HZXRWYWx1ZShvQ3JpdGljYWxpdHlDYWxjdWxhdGlvbi5EZXZpYXRpb25SYW5nZUxvd1ZhbHVlKVxuXHRcdFx0XHRcdFx0XHQ6IHVuZGVmaW5lZDtcblx0XHRcdFx0XHRcdG9DQy5zVG9sZXJhbmNlSGlnaCA9IG9Dcml0aWNhbGl0eUNhbGN1bGF0aW9uLlRvbGVyYW5jZVJhbmdlSGlnaFZhbHVlXG5cdFx0XHRcdFx0XHRcdD8gZm5HZXRWYWx1ZShvQ3JpdGljYWxpdHlDYWxjdWxhdGlvbi5Ub2xlcmFuY2VSYW5nZUhpZ2hWYWx1ZSlcblx0XHRcdFx0XHRcdFx0OiB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0XHRvQ0Muc1RvbGVyYW5jZUxvdyA9IG9Dcml0aWNhbGl0eUNhbGN1bGF0aW9uLlRvbGVyYW5jZVJhbmdlTG93VmFsdWVcblx0XHRcdFx0XHRcdFx0PyBmbkdldFZhbHVlKG9Dcml0aWNhbGl0eUNhbGN1bGF0aW9uLlRvbGVyYW5jZVJhbmdlTG93VmFsdWUpXG5cdFx0XHRcdFx0XHRcdDogdW5kZWZpbmVkO1xuXHRcdFx0XHRcdFx0b0NDLnNJbXByb3ZlbWVudERpcmVjdGlvbiA9IG9Dcml0aWNhbGl0eUNhbGN1bGF0aW9uLkltcHJvdmVtZW50RGlyZWN0aW9uLiRFbnVtTWVtYmVyO1xuXG5cdFx0XHRcdFx0XHRzQ3JpdGljYWxpdHkgPSB0aGlzLl9jcml0aWNhbGl0eUNhbGN1bGF0aW9uKFxuXHRcdFx0XHRcdFx0XHRvQ0Muc0ltcHJvdmVtZW50RGlyZWN0aW9uLFxuXHRcdFx0XHRcdFx0XHRvUG9pbnQudmFsdWUsXG5cdFx0XHRcdFx0XHRcdG9DQy5zRGV2aWF0aW9uTG93LFxuXHRcdFx0XHRcdFx0XHRvQ0Muc1RvbGVyYW5jZUxvdyxcblx0XHRcdFx0XHRcdFx0b0NDLnNBY2NlcHRhbmNlTG93LFxuXHRcdFx0XHRcdFx0XHRvQ0Muc0FjY2VwdGFuY2VIaWdoLFxuXHRcdFx0XHRcdFx0XHRvQ0Muc1RvbGVyYW5jZUhpZ2gsXG5cdFx0XHRcdFx0XHRcdG9DQy5zRGV2aWF0aW9uSGlnaFxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIHNDcml0aWNhbGl0eTtcblx0XHRcdFx0fSk7XG5cdFx0fVxuXHRcdHJldHVybiBvUmV0dXJuO1xuXHR9XG5cdF9jcml0aWNhbGl0eShvQ3JpdGljYWxpdHk6IGFueSwgb0NvbnRleHQ6IENvbnRleHQpIHtcblx0XHRsZXQgaUNyaXRpY2FsaXR5LFxuXHRcdFx0c0NyaXRpY2FsaXR5ID0gVmFsdWVDb2xvci5OZXV0cmFsO1xuXHRcdGlmIChvQ3JpdGljYWxpdHkuJFBhdGgpIHtcblx0XHRcdGNvbnN0IHNDcml0aWNhbGl0eVBhdGggPSBvQ3JpdGljYWxpdHkuJFBhdGg7XG5cdFx0XHRpQ3JpdGljYWxpdHkgPSBvQ29udGV4dC5nZXRPYmplY3Qoc0NyaXRpY2FsaXR5UGF0aCkgYXMgYW55O1xuXHRcdFx0aWYgKGlDcml0aWNhbGl0eSA9PT0gXCJOZWdhdGl2ZVwiIHx8IGlDcml0aWNhbGl0eSA9PT0gXCIxXCIgfHwgaUNyaXRpY2FsaXR5ID09PSAxKSB7XG5cdFx0XHRcdHNDcml0aWNhbGl0eSA9IFZhbHVlQ29sb3IuRXJyb3I7XG5cdFx0XHR9IGVsc2UgaWYgKGlDcml0aWNhbGl0eSA9PT0gXCJDcml0aWNhbFwiIHx8IGlDcml0aWNhbGl0eSA9PT0gXCIyXCIgfHwgaUNyaXRpY2FsaXR5ID09PSAyKSB7XG5cdFx0XHRcdHNDcml0aWNhbGl0eSA9IFZhbHVlQ29sb3IuQ3JpdGljYWw7XG5cdFx0XHR9IGVsc2UgaWYgKGlDcml0aWNhbGl0eSA9PT0gXCJQb3NpdGl2ZVwiIHx8IGlDcml0aWNhbGl0eSA9PT0gXCIzXCIgfHwgaUNyaXRpY2FsaXR5ID09PSAzKSB7XG5cdFx0XHRcdHNDcml0aWNhbGl0eSA9IFZhbHVlQ29sb3IuR29vZDtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKG9Dcml0aWNhbGl0eS4kRW51bU1lbWJlcikge1xuXHRcdFx0aUNyaXRpY2FsaXR5ID0gb0NyaXRpY2FsaXR5LiRFbnVtTWVtYmVyO1xuXHRcdFx0aWYgKGlDcml0aWNhbGl0eS5pbmRleE9mKFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQ3JpdGljYWxpdHlUeXBlL05lZ2F0aXZlXCIpID4gLTEpIHtcblx0XHRcdFx0c0NyaXRpY2FsaXR5ID0gVmFsdWVDb2xvci5FcnJvcjtcblx0XHRcdH0gZWxzZSBpZiAoaUNyaXRpY2FsaXR5LmluZGV4T2YoXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5Dcml0aWNhbGl0eVR5cGUvUG9zaXRpdmVcIikgPiAtMSkge1xuXHRcdFx0XHRzQ3JpdGljYWxpdHkgPSBWYWx1ZUNvbG9yLkdvb2Q7XG5cdFx0XHR9IGVsc2UgaWYgKGlDcml0aWNhbGl0eS5pbmRleE9mKFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQ3JpdGljYWxpdHlUeXBlL0NyaXRpY2FsXCIpID4gLTEpIHtcblx0XHRcdFx0c0NyaXRpY2FsaXR5ID0gVmFsdWVDb2xvci5Dcml0aWNhbDtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0TG9nLndhcm5pbmcoXCJDYXNlIG5vdCBzdXBwb3J0ZWQsIHJldHVybmluZyB0aGUgZGVmYXVsdCBWYWx1ZSBOZXV0cmFsXCIpO1xuXHRcdH1cblx0XHRyZXR1cm4gc0NyaXRpY2FsaXR5O1xuXHR9XG5cdF9jcml0aWNhbGl0eUNhbGN1bGF0aW9uKFxuXHRcdHNJbXByb3ZlbWVudERpcmVjdGlvbjogc3RyaW5nLFxuXHRcdHNWYWx1ZTogc3RyaW5nLFxuXHRcdHNEZXZpYXRpb25Mb3c/OiBzdHJpbmcgfCBudW1iZXIsXG5cdFx0c1RvbGVyYW5jZUxvdz86IHN0cmluZyB8IG51bWJlcixcblx0XHRzQWNjZXB0YW5jZUxvdz86IHN0cmluZyB8IG51bWJlcixcblx0XHRzQWNjZXB0YW5jZUhpZ2g/OiBzdHJpbmcgfCBudW1iZXIsXG5cdFx0c1RvbGVyYW5jZUhpZ2g/OiBzdHJpbmcgfCBudW1iZXIsXG5cdFx0c0RldmlhdGlvbkhpZ2g/OiBzdHJpbmcgfCBudW1iZXJcblx0KSB7XG5cdFx0bGV0IHNDcml0aWNhbGl0eUV4cHJlc3Npb24gPSBWYWx1ZUNvbG9yLk5ldXRyYWw7IC8vIERlZmF1bHQgQ3JpdGljYWxpdHkgU3RhdGVcblxuXHRcdC8vIERlYWxpbmcgd2l0aCBEZWNpbWFsIGFuZCBQYXRoIGJhc2VkIGJpbmdkaW5nc1xuXHRcdHNEZXZpYXRpb25Mb3cgPSBzRGV2aWF0aW9uTG93ID09IHVuZGVmaW5lZCA/IC1JbmZpbml0eSA6IHNEZXZpYXRpb25Mb3c7XG5cdFx0c1RvbGVyYW5jZUxvdyA9IHNUb2xlcmFuY2VMb3cgPT0gdW5kZWZpbmVkID8gc0RldmlhdGlvbkxvdyA6IHNUb2xlcmFuY2VMb3c7XG5cdFx0c0FjY2VwdGFuY2VMb3cgPSBzQWNjZXB0YW5jZUxvdyA9PSB1bmRlZmluZWQgPyBzVG9sZXJhbmNlTG93IDogc0FjY2VwdGFuY2VMb3c7XG5cdFx0c0RldmlhdGlvbkhpZ2ggPSBzRGV2aWF0aW9uSGlnaCA9PSB1bmRlZmluZWQgPyBJbmZpbml0eSA6IHNEZXZpYXRpb25IaWdoO1xuXHRcdHNUb2xlcmFuY2VIaWdoID0gc1RvbGVyYW5jZUhpZ2ggPT0gdW5kZWZpbmVkID8gc0RldmlhdGlvbkhpZ2ggOiBzVG9sZXJhbmNlSGlnaDtcblx0XHRzQWNjZXB0YW5jZUhpZ2ggPSBzQWNjZXB0YW5jZUhpZ2ggPT0gdW5kZWZpbmVkID8gc1RvbGVyYW5jZUhpZ2ggOiBzQWNjZXB0YW5jZUhpZ2g7XG5cblx0XHQvLyBDcmVhdGluZyBydW50aW1lIGV4cHJlc3Npb24gYmluZGluZyBmcm9tIGNyaXRpY2FsaXR5IGNhbGN1bGF0aW9uIGZvciBDcml0aWNhbGl0eSBTdGF0ZVxuXHRcdGlmIChzSW1wcm92ZW1lbnREaXJlY3Rpb24uaW5kZXhPZihcIk1pbmltaXplXCIpID4gLTEpIHtcblx0XHRcdGlmIChzVmFsdWUgPD0gc0FjY2VwdGFuY2VIaWdoKSB7XG5cdFx0XHRcdHNDcml0aWNhbGl0eUV4cHJlc3Npb24gPSBWYWx1ZUNvbG9yLkdvb2Q7XG5cdFx0XHR9IGVsc2UgaWYgKHNWYWx1ZSA8PSBzVG9sZXJhbmNlSGlnaCkge1xuXHRcdFx0XHRzQ3JpdGljYWxpdHlFeHByZXNzaW9uID0gVmFsdWVDb2xvci5OZXV0cmFsO1xuXHRcdFx0fSBlbHNlIGlmIChzRGV2aWF0aW9uSGlnaCAmJiBzVmFsdWUgPD0gc0RldmlhdGlvbkhpZ2gpIHtcblx0XHRcdFx0c0NyaXRpY2FsaXR5RXhwcmVzc2lvbiA9IFZhbHVlQ29sb3IuQ3JpdGljYWw7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzQ3JpdGljYWxpdHlFeHByZXNzaW9uID0gVmFsdWVDb2xvci5FcnJvcjtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKHNJbXByb3ZlbWVudERpcmVjdGlvbi5pbmRleE9mKFwiTWF4aW1pemVcIikgPiAtMSkge1xuXHRcdFx0aWYgKHNWYWx1ZSA+PSBzQWNjZXB0YW5jZUxvdykge1xuXHRcdFx0XHRzQ3JpdGljYWxpdHlFeHByZXNzaW9uID0gVmFsdWVDb2xvci5Hb29kO1xuXHRcdFx0fSBlbHNlIGlmIChzVmFsdWUgPj0gc1RvbGVyYW5jZUxvdykge1xuXHRcdFx0XHRzQ3JpdGljYWxpdHlFeHByZXNzaW9uID0gVmFsdWVDb2xvci5OZXV0cmFsO1xuXHRcdFx0fSBlbHNlIGlmIChzRGV2aWF0aW9uSGlnaCAmJiBzVmFsdWUgPj0gc0RldmlhdGlvbkxvdykge1xuXHRcdFx0XHRzQ3JpdGljYWxpdHlFeHByZXNzaW9uID0gVmFsdWVDb2xvci5Dcml0aWNhbDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNDcml0aWNhbGl0eUV4cHJlc3Npb24gPSBWYWx1ZUNvbG9yLkVycm9yO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoc0ltcHJvdmVtZW50RGlyZWN0aW9uLmluZGV4T2YoXCJUYXJnZXRcIikgPiAtMSkge1xuXHRcdFx0aWYgKHNWYWx1ZSA8PSBzQWNjZXB0YW5jZUhpZ2ggJiYgc1ZhbHVlID49IHNBY2NlcHRhbmNlTG93KSB7XG5cdFx0XHRcdHNDcml0aWNhbGl0eUV4cHJlc3Npb24gPSBWYWx1ZUNvbG9yLkdvb2Q7XG5cdFx0XHR9IGVsc2UgaWYgKChzVmFsdWUgPj0gc1RvbGVyYW5jZUxvdyAmJiBzVmFsdWUgPCBzQWNjZXB0YW5jZUxvdykgfHwgKHNWYWx1ZSA+IHNBY2NlcHRhbmNlSGlnaCAmJiBzVmFsdWUgPD0gc1RvbGVyYW5jZUhpZ2gpKSB7XG5cdFx0XHRcdHNDcml0aWNhbGl0eUV4cHJlc3Npb24gPSBWYWx1ZUNvbG9yLk5ldXRyYWw7XG5cdFx0XHR9IGVsc2UgaWYgKFxuXHRcdFx0XHQoc0RldmlhdGlvbkxvdyAmJiBzVmFsdWUgPj0gc0RldmlhdGlvbkxvdyAmJiBzVmFsdWUgPCBzVG9sZXJhbmNlTG93KSB8fFxuXHRcdFx0XHQoc1ZhbHVlID4gc1RvbGVyYW5jZUhpZ2ggJiYgc0RldmlhdGlvbkhpZ2ggJiYgc1ZhbHVlIDw9IHNEZXZpYXRpb25IaWdoKVxuXHRcdFx0KSB7XG5cdFx0XHRcdHNDcml0aWNhbGl0eUV4cHJlc3Npb24gPSBWYWx1ZUNvbG9yLkNyaXRpY2FsO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c0NyaXRpY2FsaXR5RXhwcmVzc2lvbiA9IFZhbHVlQ29sb3IuRXJyb3I7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdExvZy53YXJuaW5nKFwiQ2FzZSBub3Qgc3VwcG9ydGVkLCByZXR1cm5pbmcgdGhlIGRlZmF1bHQgVmFsdWUgTmV1dHJhbFwiKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gc0NyaXRpY2FsaXR5RXhwcmVzc2lvbjtcblx0fVxuXHRfZm9ybWF0RGF0ZUFuZE51bWJlclZhbHVlKHZhbHVlOiBhbnksIGlQcmVjaXNpb246IGFueSwgaVNjYWxlOiBhbnksIHNQYXR0ZXJuPzogYW55KSB7XG5cdFx0aWYgKHNQYXR0ZXJuKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fZ2V0U2VtYW50aWNzVmFsdWVGb3JtYXR0ZXIoc1BhdHRlcm4pLmZvcm1hdFZhbHVlKHZhbHVlLCBcInN0cmluZ1wiKTtcblx0XHR9IGVsc2UgaWYgKCFpc05hTih2YWx1ZSkpIHtcblx0XHRcdHJldHVybiB0aGlzLl9nZXRMYWJlbE51bWJlckZvcm1hdHRlcihpUHJlY2lzaW9uLCBpU2NhbGUpLmZvcm1hdCh2YWx1ZSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9XG5cdF9nZXRTZW1hbnRpY3NWYWx1ZUZvcm1hdHRlcihzUGF0dGVybjogYW55KSB7XG5cdFx0aWYgKCF0aGlzLl9vRGF0ZVR5cGUpIHtcblx0XHRcdHRoaXMuX29EYXRlVHlwZSA9IG5ldyBEYXRlVHlwZSh7XG5cdFx0XHRcdHN0eWxlOiBcInNob3J0XCIsXG5cdFx0XHRcdHNvdXJjZToge1xuXHRcdFx0XHRcdHBhdHRlcm46IHNQYXR0ZXJuXG5cdFx0XHRcdH1cblx0XHRcdH0gYXMgYW55KTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX29EYXRlVHlwZTtcblx0fVxuXHRfZ2V0TGFiZWxOdW1iZXJGb3JtYXR0ZXIoaVByZWNpc2lvbjogYW55LCBpU2NhbGU6IGFueSkge1xuXHRcdHJldHVybiBOdW1iZXJGb3JtYXQuZ2V0RmxvYXRJbnN0YW5jZSh7XG5cdFx0XHRzdHlsZTogXCJzaG9ydFwiLFxuXHRcdFx0c2hvd1NjYWxlOiB0cnVlLFxuXHRcdFx0cHJlY2lzaW9uOiB0eXBlb2YgaVByZWNpc2lvbiA9PT0gXCJudW1iZXJcIiA/IGlQcmVjaXNpb24gOiAobnVsbCBhcyBhbnkpLFxuXHRcdFx0ZGVjaW1hbHM6IHR5cGVvZiBpU2NhbGUgPT09IFwibnVtYmVyXCIgPyBpU2NhbGUgOiAobnVsbCBhcyBhbnkpXG5cdFx0fSk7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWljcm9DaGFydENvbnRhaW5lcjtcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFrQkEsSUFBTUEsY0FBYyxHQUFHQyxRQUFRLENBQUNELGNBQWhDO0VBQ0EsSUFBTUUsVUFBVSxHQUFHQyxhQUFhLENBQUNELFVBQWpDO0VBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztNQUVNRSxtQixXQURMQyxjQUFjLENBQUMsOENBQUQsQyxVQUViQyxRQUFRLENBQUM7SUFDVEMsSUFBSSxFQUFFLFNBREc7SUFFVEMsWUFBWSxFQUFFO0VBRkwsQ0FBRCxDLFVBS1JGLFFBQVEsQ0FBQztJQUNUQyxJQUFJLEVBQUUsUUFERztJQUVUQyxZQUFZLEVBQUVDO0VBRkwsQ0FBRCxDLFVBS1JILFFBQVEsQ0FBQztJQUNUQyxJQUFJLEVBQUUsVUFERztJQUVUQyxZQUFZLEVBQUU7RUFGTCxDQUFELEMsVUFLUkYsUUFBUSxDQUFDO0lBQ1RDLElBQUksRUFBRSxRQURHO0lBRVRDLFlBQVksRUFBRUM7RUFGTCxDQUFELEMsVUFLUkgsUUFBUSxDQUFDO0lBQ1RDLElBQUksRUFBRSxVQURHO0lBRVRDLFlBQVksRUFBRTtFQUZMLENBQUQsQyxVQUtSRixRQUFRLENBQUM7SUFDVEMsSUFBSSxFQUFFLEtBREc7SUFFVEMsWUFBWSxFQUFFQztFQUZMLENBQUQsQyxVQUtSSCxRQUFRLENBQUM7SUFDVEMsSUFBSSxFQUFFLEtBREc7SUFFVEMsWUFBWSxFQUFFO0VBRkwsQ0FBRCxDLFVBS1JGLFFBQVEsQ0FBQztJQUNUQyxJQUFJLEVBQUUsS0FERztJQUVUQyxZQUFZLEVBQUVDO0VBRkwsQ0FBRCxDLFdBS1JILFFBQVEsQ0FBQztJQUNUQyxJQUFJLEVBQUUsUUFERztJQUVUQyxZQUFZLEVBQUU7RUFGTCxDQUFELEMsV0FLUkYsUUFBUSxDQUFDO0lBQ1RDLElBQUksRUFBRSxRQURHO0lBRVRDLFlBQVksRUFBRTtF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