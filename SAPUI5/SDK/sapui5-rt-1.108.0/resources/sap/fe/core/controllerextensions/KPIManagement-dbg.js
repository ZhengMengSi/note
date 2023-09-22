/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/formatters/TableFormatterTypes", "sap/m/Popover", "sap/ui/core/Core", "sap/ui/core/format/DateFormat", "sap/ui/core/format/NumberFormat", "sap/ui/core/Locale", "sap/ui/core/mvc/ControllerExtension", "sap/ui/model/Filter", "sap/ui/model/json/JSONModel", "sap/ui/model/Sorter", "../helpers/ClassSupport"], function (Log, TableFormatterTypes, Popover, Core, DateFormat, NumberFormat, Locale, ControllerExtension, Filter, JSONModel, Sorter, ClassSupport) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _class, _class2;

  var publicExtension = ClassSupport.publicExtension;
  var methodOverride = ClassSupport.methodOverride;
  var defineUI5Class = ClassSupport.defineUI5Class;
  var MessageType = TableFormatterTypes.MessageType;

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  var MessageTypeFromCriticality = {
    "1": MessageType.Error,
    "2": MessageType.Warning,
    "3": MessageType.Success,
    "5": MessageType.Information
  };
  var ValueColorFromMessageType = {
    Error: "Error",
    Warning: "Critical",
    Success: "Good",
    Information: "None",
    None: "None"
  };
  /**
   * Function to get a message state from a calculated criticality of type 'Target'.
   *
   * @param kpiValue The value of the KPI to be tested against.
   * @param aThresholds Thresholds to be used [DeviationRangeLowValue,ToleranceRangeLowValue,AcceptanceRangeLowValue,AcceptanceRangeHighValue,ToleranceRangeHighValue,DeviationRangeHighValue].
   * @returns Returns the corresponding MessageType
   */

  function messageTypeFromTargetCalculation(kpiValue, aThresholds) {
    var criticalityProperty;

    if (aThresholds[0] !== undefined && aThresholds[0] !== null && kpiValue < aThresholds[0]) {
      criticalityProperty = MessageType.Error;
    } else if (aThresholds[1] !== undefined && aThresholds[1] !== null && kpiValue < aThresholds[1]) {
      criticalityProperty = MessageType.Warning;
    } else if (aThresholds[2] !== undefined && aThresholds[2] !== null && kpiValue < aThresholds[2]) {
      criticalityProperty = MessageType.None;
    } else if (aThresholds[5] !== undefined && aThresholds[5] !== null && kpiValue > aThresholds[5]) {
      criticalityProperty = MessageType.Error;
    } else if (aThresholds[4] !== undefined && aThresholds[4] !== null && kpiValue > aThresholds[4]) {
      criticalityProperty = MessageType.Warning;
    } else if (aThresholds[3] !== undefined && aThresholds[3] !== null && kpiValue > aThresholds[3]) {
      criticalityProperty = MessageType.None;
    } else {
      criticalityProperty = MessageType.Success;
    }

    return criticalityProperty;
  }
  /**
   * Function to get a message state from a calculated criticality of type 'Minimize'.
   *
   * @param kpiValue The value of the KPI to be tested against.
   * @param aThresholds Thresholds to be used [AcceptanceRangeHighValue,ToleranceRangeHighValue,DeviationRangeHighValue].
   * @returns Returns the corresponding MessageType
   */


  function messageTypeFromMinimizeCalculation(kpiValue, aThresholds) {
    var criticalityProperty;

    if (aThresholds[2] !== undefined && aThresholds[2] !== null && kpiValue > aThresholds[2]) {
      criticalityProperty = MessageType.Error;
    } else if (aThresholds[1] !== undefined && aThresholds[1] !== null && kpiValue > aThresholds[1]) {
      criticalityProperty = MessageType.Warning;
    } else if (aThresholds[0] !== undefined && aThresholds[0] !== null && kpiValue > aThresholds[0]) {
      criticalityProperty = MessageType.None;
    } else {
      criticalityProperty = MessageType.Success;
    }

    return criticalityProperty;
  }
  /**
   * Function to get a message state from a calculated criticality of type 'Maximize'.
   *
   * @param kpiValue The value of the KPI to be tested against.
   * @param aThresholds Thresholds to be used [DeviationRangeLowValue,ToleranceRangeLowValue,AcceptanceRangeLowValue].
   * @returns Returns the corresponding MessageType
   */


  function messageTypeFromMaximizeCalculation(kpiValue, aThresholds) {
    var criticalityProperty;

    if (aThresholds[0] !== undefined && aThresholds[0] !== null && kpiValue < aThresholds[0]) {
      criticalityProperty = MessageType.Error;
    } else if (aThresholds[1] !== undefined && aThresholds[1] !== null && kpiValue < aThresholds[1]) {
      criticalityProperty = MessageType.Warning;
    } else if (aThresholds[2] !== undefined && aThresholds[2] !== null && kpiValue < aThresholds[2]) {
      criticalityProperty = MessageType.None;
    } else {
      criticalityProperty = MessageType.Success;
    }

    return criticalityProperty;
  }
  /**
   * Function to calculate a DeviationIndicator value from a trend value.
   *
   * @param trendValue The criticality values.
   * @returns Returns the corresponding DeviationIndicator value
   */


  function deviationIndicatorFromTrendType(trendValue) {
    var deviationIndicator;

    switch (trendValue) {
      case 1: // StrongUp

      case "1":
      case 2: // Up

      case "2":
        deviationIndicator = "Up";
        break;

      case 4: // Down

      case "4":
      case 5: // StrongDown

      case "5":
        deviationIndicator = "Down";
        break;

      default:
        deviationIndicator = "None";
    }

    return deviationIndicator;
  }
  /**
   * Function to calculate a DeviationIndicator from a TrendCalculation.
   *
   * @param kpiValue The value of the KPI
   * @param referenceValue The reference value to compare with
   * @param isRelative True is the comparison is relative
   * @param aThresholds Array of thresholds [StrongDownDifference, DownDifference, UpDifference, StrongUpDifference]
   * @returns Returns the corresponding DeviationIndicator value
   */


  function deviationIndicatorFromCalculation(kpiValue, referenceValue, isRelative, aThresholds) {
    var deviationIndicator;

    if (!aThresholds || isRelative && !referenceValue) {
      return "None";
    }

    var compValue = isRelative ? (kpiValue - referenceValue) / referenceValue : kpiValue - referenceValue;

    if (aThresholds[0] !== undefined && aThresholds[0] !== null && compValue <= aThresholds[0]) {
      // StrongDown --> Down
      deviationIndicator = "Down";
    } else if (aThresholds[1] !== undefined && aThresholds[1] !== null && compValue <= aThresholds[1]) {
      // Down --> Down
      deviationIndicator = "Down";
    } else if (aThresholds[3] !== undefined && aThresholds[3] !== null && compValue >= aThresholds[3]) {
      // StrongUp --> Up
      deviationIndicator = "Up";
    } else if (aThresholds[2] !== undefined && aThresholds[2] !== null && compValue >= aThresholds[2]) {
      // Up --> Up
      deviationIndicator = "Up";
    } else {
      // Sideways --> None
      deviationIndicator = "None";
    }

    return deviationIndicator;
  }
  /**
   * Creates a sap.ui.model.Filter from a filter definition.
   *
   * @param filterDefinition The filter definition
   * @returns Returns a sap.ui.model.Filter from the definition, or undefined if the definition is empty (no ranges)
   */


  function createFilterFromDefinition(filterDefinition) {
    if (filterDefinition.ranges.length === 0) {
      return undefined;
    } else if (filterDefinition.ranges.length === 1) {
      return new Filter(filterDefinition.propertyPath, filterDefinition.ranges[0].operator, filterDefinition.ranges[0].rangeLow, filterDefinition.ranges[0].rangeHigh);
    } else {
      var aRangeFilters = filterDefinition.ranges.map(function (range) {
        return new Filter(filterDefinition.propertyPath, range.operator, range.rangeLow, range.rangeHigh);
      });
      return new Filter({
        filters: aRangeFilters,
        and: false
      });
    }
  }

  function getFilterStringFromDefinition(filterDefinition) {
    var currentLocale = new Locale(sap.ui.getCore().getConfiguration().getLanguage());
    var resBundle = Core.getLibraryResourceBundle("sap.fe.core");
    var dateFormat = DateFormat.getDateInstance({
      style: "medium"
    }, currentLocale);

    function formatRange(range) {
      var valueLow = filterDefinition.propertyType.indexOf("Edm.Date") === 0 ? dateFormat.format(new Date(range.rangeLow)) : range.rangeLow;
      var valueHigh = filterDefinition.propertyType.indexOf("Edm.Date") === 0 ? dateFormat.format(new Date(range.rangeHigh)) : range.rangeHigh;

      switch (range.operator) {
        case "BT":
          return "[".concat(valueLow, " - ").concat(valueHigh, "]");

        case "Contains":
          return "*".concat(valueLow, "*");

        case "GE":
          return "\u2265".concat(valueLow);

        case "GT":
          return ">".concat(valueLow);

        case "LE":
          return "\u2264".concat(valueLow);

        case "LT":
          return "<".concat(valueLow);

        case "NB":
          return resBundle.getText("C_KPICARD_FILTERSTRING_NOT", ["[".concat(valueLow, " - ").concat(valueHigh, "]")]);

        case "NE":
          return "\u2260".concat(valueLow);

        case "NotContains":
          return resBundle.getText("C_KPICARD_FILTERSTRING_NOT", ["*".concat(valueLow, "*")]);

        case "EQ":
        default:
          return valueLow;
      }
    }

    if (filterDefinition.ranges.length === 0) {
      return "";
    } else if (filterDefinition.ranges.length === 1) {
      return formatRange(filterDefinition.ranges[0]);
    } else {
      return "(".concat(filterDefinition.ranges.map(formatRange).join(","), ")");
    }
  }

  function formatChartTitle(kpiDef) {
    var resBundle = Core.getLibraryResourceBundle("sap.fe.core");

    function formatList(items) {
      if (items.length === 0) {
        return "";
      } else if (items.length === 1) {
        return items[0].label;
      } else {
        var res = items[0].label;

        for (var I = 1; I < items.length - 1; I++) {
          res += ", ".concat(items[I].label);
        }

        return resBundle.getText("C_KPICARD_ITEMSLIST", [res, items[items.length - 1].label]);
      }
    }

    return resBundle.getText("C_KPICARD_CHARTTITLE", [formatList(kpiDef.chart.measures), formatList(kpiDef.chart.dimensions)]);
  }

  function updateChartLabelSettings(chartDefinition, oChartProperties) {
    switch (chartDefinition.chartType) {
      case "Donut":
        // Show data labels, do not show axis titles
        oChartProperties.categoryAxis = {
          title: {
            visible: false
          }
        };
        oChartProperties.valueAxis = {
          title: {
            visible: false
          },
          label: {
            formatString: "ShortFloat"
          }
        };
        oChartProperties.plotArea.dataLabel = {
          visible: true,
          type: "value",
          formatString: "ShortFloat_MFD2"
        };
        break;

      case "bubble":
        // Show axis title, bubble size legend, do not show data labels
        oChartProperties.valueAxis = {
          title: {
            visible: true
          },
          label: {
            formatString: "ShortFloat"
          }
        };
        oChartProperties.valueAxis2 = {
          title: {
            visible: true
          },
          label: {
            formatString: "ShortFloat"
          }
        };
        oChartProperties.legendGroup = {
          layout: {
            position: "bottom",
            alignment: "topLeft"
          }
        };
        oChartProperties.sizeLegend = {
          visible: true
        };
        oChartProperties.plotArea.dataLabel = {
          visible: false
        };
        break;

      case "scatter":
        // Do not show data labels and axis titles
        oChartProperties.valueAxis = {
          title: {
            visible: false
          },
          label: {
            formatString: "ShortFloat"
          }
        };
        oChartProperties.valueAxis2 = {
          title: {
            visible: false
          },
          label: {
            formatString: "ShortFloat"
          }
        };
        oChartProperties.plotArea.dataLabel = {
          visible: false
        };
        break;

      default:
        // Do not show data labels and axis titles
        oChartProperties.categoryAxis = {
          title: {
            visible: false
          }
        };
        oChartProperties.valueAxis = {
          title: {
            visible: false
          },
          label: {
            formatString: "ShortFloat"
          }
        };
        oChartProperties.plotArea.dataLabel = {
          visible: false
        };
    }
  }

  function filterMap(aObjects, aRoles) {
    if (aRoles && aRoles.length) {
      return aObjects.filter(function (dimension) {
        return aRoles.indexOf(dimension.role) >= 0;
      }).map(function (dimension) {
        return dimension.label;
      });
    } else {
      return aObjects.map(function (dimension) {
        return dimension.label;
      });
    }
  }

  function getScatterBubbleChartFeeds(chartDefinition) {
    var axis1Measures = filterMap(chartDefinition.measures, ["Axis1"]);
    var axis2Measures = filterMap(chartDefinition.measures, ["Axis2"]);
    var axis3Measures = filterMap(chartDefinition.measures, ["Axis3"]);
    var otherMeasures = filterMap(chartDefinition.measures, [undefined]);
    var seriesDimensions = filterMap(chartDefinition.dimensions, ["Series"]); // Get the first dimension with role "Category" for the shape

    var shapeDimension = chartDefinition.dimensions.find(function (dimension) {
      return dimension.role === "Category";
    }); // Measure for the x-Axis : first measure for Axis1, or for Axis2 if not found, or for Axis3 if not found

    var xMeasure = axis1Measures.shift() || axis2Measures.shift() || axis3Measures.shift() || otherMeasures.shift() || ""; // Measure for the y-Axis : first measure for Axis2, or second measure for Axis1 if not found, or first measure for Axis3 if not found

    var yMeasure = axis2Measures.shift() || axis1Measures.shift() || axis3Measures.shift() || otherMeasures.shift() || "";
    var res = [{
      "uid": "valueAxis",
      "type": "Measure",
      "values": [xMeasure]
    }, {
      "uid": "valueAxis2",
      "type": "Measure",
      "values": [yMeasure]
    }];

    if (chartDefinition.chartType === "bubble") {
      // Measure for the size of the bubble: first measure for Axis3, or remaining measure for Axis1/Axis2 if not found
      var sizeMeasure = axis3Measures.shift() || axis1Measures.shift() || axis2Measures.shift() || otherMeasures.shift() || "";
      res.push({
        "uid": "bubbleWidth",
        "type": "Measure",
        "values": [sizeMeasure]
      });
    } // Color (optional)


    if (seriesDimensions.length) {
      res.push({
        "uid": "color",
        "type": "Dimension",
        "values": seriesDimensions
      });
    } // Shape (optional)


    if (shapeDimension) {
      res.push({
        "uid": "shape",
        "type": "Dimension",
        "values": [shapeDimension.label]
      });
    }

    return res;
  }

  function getChartFeeds(chartDefinition) {
    var res;

    switch (chartDefinition.chartType) {
      case "Donut":
        res = [{
          "uid": "size",
          "type": "Measure",
          "values": filterMap(chartDefinition.measures)
        }, {
          "uid": "color",
          "type": "Dimension",
          "values": filterMap(chartDefinition.dimensions)
        }];
        break;

      case "bubble":
      case "scatter":
        res = getScatterBubbleChartFeeds(chartDefinition);
        break;

      case "vertical_bullet":
        res = [{
          "uid": "actualValues",
          "type": "Measure",
          "values": filterMap(chartDefinition.measures, [undefined, "Axis1"])
        }, {
          "uid": "targetValues",
          "type": "Measure",
          "values": filterMap(chartDefinition.measures, ["Axis2"])
        }, {
          "uid": "categoryAxis",
          "type": "Dimension",
          "values": filterMap(chartDefinition.dimensions, [undefined, "Category"])
        }, {
          "uid": "color",
          "type": "Dimension",
          "values": filterMap(chartDefinition.dimensions, ["Series"])
        }];
        break;

      default:
        res = [{
          "uid": "valueAxis",
          "type": "Measure",
          "values": filterMap(chartDefinition.measures)
        }, {
          "uid": "categoryAxis",
          "type": "Dimension",
          "values": filterMap(chartDefinition.dimensions, [undefined, "Category"])
        }, {
          "uid": "color",
          "type": "Dimension",
          "values": filterMap(chartDefinition.dimensions, ["Series"])
        }];
    }

    return res;
  }

  function getNavigationParameters(navInfo, oShellService) {
    if (navInfo.semanticObject) {
      if (navInfo.action) {
        // Action is already specified: check if it's available in the shell
        return oShellService.getLinks({
          semanticObject: navInfo.semanticObject,
          action: navInfo.action
        }).then(function (aLinks) {
          return aLinks.length ? {
            semanticObject: navInfo.semanticObject,
            action: navInfo.action
          } : undefined;
        });
      } else {
        // We get the primary intent from the shell
        return oShellService.getPrimaryIntent(navInfo.semanticObject).then(function (oLink) {
          if (!oLink) {
            // No primary intent...
            return undefined;
          } // Check that the primary intent is not part of the unavailable actions


          var oInfo = oShellService.parseShellHash(oLink.intent);
          return navInfo.unavailableActions && navInfo.unavailableActions.indexOf(oInfo.action) >= 0 ? undefined : {
            semanticObject: oInfo.semanticObject,
            action: oInfo.action
          };
        });
      }
    } else {
      // Outbound navigation specified in the manifest
      return navInfo.outboundNavigation ? Promise.resolve({
        outbound: navInfo.outboundNavigation
      }) : Promise.resolve(undefined);
    }
  }
  /**
   * @class A controller extension for managing the KPIs in an analytical list page
   * @name sap.fe.core.controllerextensions.KPIManagement
   * @hideconstructor
   * @private
   * @since 1.93.0
   */


  var KPIManagementControllerExtension = (_dec = defineUI5Class("sap.fe.core.controllerextensions.KPIManagement"), _dec2 = methodOverride(), _dec3 = methodOverride(), _dec4 = publicExtension(), _dec(_class = (_class2 = /*#__PURE__*/function (_ControllerExtension) {
    _inheritsLoose(KPIManagementControllerExtension, _ControllerExtension);

    function KPIManagementControllerExtension() {
      return _ControllerExtension.apply(this, arguments) || this;
    }

    var _proto = KPIManagementControllerExtension.prototype;

    /**
     * Creates the card manifest for a KPI definition and stores it in a JSON model.
     *
     * @param kpiDefinition The KPI definition
     * @param oKPIModel The JSON model in which the manifest will be stored
     */
    _proto.initCardManifest = function initCardManifest(kpiDefinition, oKPIModel) {
      var _kpiDefinition$select;

      var oCardManifest = {
        "sap.app": {
          id: "sap.fe",
          type: "card"
        },
        "sap.ui": {
          technology: "UI5"
        },
        "sap.card": {
          type: "Analytical",
          data: {
            json: {}
          },
          header: {
            type: "Numeric",
            title: kpiDefinition.datapoint.title,
            subTitle: kpiDefinition.datapoint.description,
            unitOfMeasurement: "{mainUnit}",
            mainIndicator: {
              number: "{mainValueNoScale}",
              unit: "{mainValueScale}",
              state: "{mainState}",
              trend: "{trend}"
            }
          },
          content: {
            minHeight: "25rem",
            chartProperties: {
              plotArea: {},
              title: {
                visible: true,
                alignment: "left"
              }
            },
            data: {
              path: "/chartData"
            }
          }
        }
      }; // Add side indicators in the card header if a target is defined for the KPI

      if (kpiDefinition.datapoint.targetPath || kpiDefinition.datapoint.targetValue !== undefined) {
        var resBundle = Core.getLibraryResourceBundle("sap.fe.core");
        oCardManifest["sap.card"].header.sideIndicators = [{
          title: resBundle.getText("C_KPICARD_INDICATOR_TARGET"),
          number: "{targetNumber}",
          unit: "{targetUnit}"
        }, {
          title: resBundle.getText("C_KPICARD_INDICATOR_DEVIATION"),
          number: "{deviationNumber}",
          unit: "%"
        }];
      } // Details of the card: filter descriptions


      if ((_kpiDefinition$select = kpiDefinition.selectionVariantFilterDefinitions) !== null && _kpiDefinition$select !== void 0 && _kpiDefinition$select.length) {
        var aDescriptions = [];
        kpiDefinition.selectionVariantFilterDefinitions.forEach(function (filterDefinition) {
          var desc = getFilterStringFromDefinition(filterDefinition);

          if (desc) {
            aDescriptions.push(desc);
          }
        });

        if (aDescriptions.length) {
          oCardManifest["sap.card"].header.details = aDescriptions.join(", ");
        }
      } // Chart settings: type, title, dimensions and measures in the manifest


      oCardManifest["sap.card"].content.chartType = kpiDefinition.chart.chartType;
      updateChartLabelSettings(kpiDefinition.chart, oCardManifest["sap.card"].content.chartProperties);
      oCardManifest["sap.card"].content.chartProperties.title.text = formatChartTitle(kpiDefinition);
      oCardManifest["sap.card"].content.dimensions = kpiDefinition.chart.dimensions.map(function (dimension) {
        return {
          label: dimension.label,
          value: "{".concat(dimension.name, "}")
        };
      });
      oCardManifest["sap.card"].content.measures = kpiDefinition.chart.measures.map(function (measure) {
        return {
          label: measure.label,
          value: "{".concat(measure.name, "}")
        };
      });
      oCardManifest["sap.card"].content.feeds = getChartFeeds(kpiDefinition.chart);
      oKPIModel.setProperty("/".concat(kpiDefinition.id), {
        manifest: oCardManifest
      });
    };

    _proto.initNavigationInfo = function initNavigationInfo(kpiDefinition, oKPIModel, oShellService) {
      // Add navigation
      if (kpiDefinition.navigation) {
        return getNavigationParameters(kpiDefinition.navigation, oShellService).then(function (oNavInfo) {
          if (oNavInfo) {
            oKPIModel.setProperty("/".concat(kpiDefinition.id, "/manifest/sap.card/header/actions"), [{
              type: "Navigation",
              parameters: oNavInfo
            }]);
          }
        });
      } else {
        return Promise.resolve();
      }
    };

    _proto.onInit = function onInit() {
      var _getPageModel,
          _this = this;

      this.aKPIDefinitions = (_getPageModel = this.getView().getController()._getPageModel()) === null || _getPageModel === void 0 ? void 0 : _getPageModel.getProperty("/kpiDefinitions");

      if (this.aKPIDefinitions && this.aKPIDefinitions.length) {
        var oView = this.getView();
        var oAppComponent = oView.getController().getAppComponent(); // Create a JSON model to store KPI data

        var oKPIModel = new JSONModel();
        oView.setModel(oKPIModel, "kpiModel");
        this.aKPIDefinitions.forEach(function (kpiDefinition) {
          // Create the manifest for the KPI card and store it in the KPI model
          _this.initCardManifest(kpiDefinition, oKPIModel); // Set the navigation information in the manifest


          _this.initNavigationInfo(kpiDefinition, oKPIModel, oAppComponent.getShellServices()).catch(function (err) {
            Log.error(err);
          }); // Load tag data for the KPI


          _this.loadKPITagData(kpiDefinition, oAppComponent.getModel(), oKPIModel).catch(function (err) {
            Log.error(err);
          });
        });
      }
    };

    _proto.onExit = function onExit() {
      var oKPIModel = this.getView().getModel("kpiModel");

      if (oKPIModel) {
        oKPIModel.destroy();
      }
    };

    _proto.updateDatapointValueAndCurrency = function updateDatapointValueAndCurrency(kpiDefinition, kpiContext, oKPIModel) {
      var _kpiDefinition$datapo, _kpiDefinition$datapo2, _kpiDefinition$datapo3;

      var currentLocale = new Locale(sap.ui.getCore().getConfiguration().getLanguage());
      var rawUnit = (_kpiDefinition$datapo = kpiDefinition.datapoint.unit) !== null && _kpiDefinition$datapo !== void 0 && _kpiDefinition$datapo.isPath ? kpiContext.getProperty(kpiDefinition.datapoint.unit.value) : (_kpiDefinition$datapo2 = kpiDefinition.datapoint.unit) === null || _kpiDefinition$datapo2 === void 0 ? void 0 : _kpiDefinition$datapo2.value;
      var isPercentage = ((_kpiDefinition$datapo3 = kpiDefinition.datapoint.unit) === null || _kpiDefinition$datapo3 === void 0 ? void 0 : _kpiDefinition$datapo3.isCurrency) === false && rawUnit === "%"; // /////////////////////
      // Main KPI value

      var rawValue = Number.parseFloat(kpiContext.getProperty(kpiDefinition.datapoint.propertyPath)); // Value formatted with a scale

      var kpiValue = NumberFormat.getFloatInstance({
        style: isPercentage ? undefined : "short",
        minFractionDigits: 0,
        maxFractionDigits: 1,
        showScale: !isPercentage
      }, currentLocale).format(rawValue);
      oKPIModel.setProperty("/".concat(kpiDefinition.id, "/manifest/sap.card/data/json/mainValue"), kpiValue); // Value without a scale

      var kpiValueUnscaled = NumberFormat.getFloatInstance({
        maxFractionDigits: 2,
        showScale: false,
        groupingEnabled: true
      }, currentLocale).format(rawValue);
      oKPIModel.setProperty("/".concat(kpiDefinition.id, "/manifest/sap.card/data/json/mainValueUnscaled"), kpiValueUnscaled); // Value formatted with the scale omitted

      var kpiValueNoScale = NumberFormat.getFloatInstance({
        style: isPercentage ? undefined : "short",
        minFractionDigits: 0,
        maxFractionDigits: 1,
        showScale: false
      }, currentLocale).format(rawValue);
      oKPIModel.setProperty("/".concat(kpiDefinition.id, "/manifest/sap.card/data/json/mainValueNoScale"), kpiValueNoScale); // Scale of the value

      var kpiValueScale = NumberFormat.getFloatInstance({
        style: isPercentage ? undefined : "short",
        decimals: 0,
        maxIntegerDigits: 0,
        showScale: true
      }, currentLocale).format(rawValue);
      oKPIModel.setProperty("/".concat(kpiDefinition.id, "/manifest/sap.card/data/json/mainValueScale"), kpiValueScale); // /////////////////////
      // Unit or currency

      if (kpiDefinition.datapoint.unit && rawUnit) {
        if (kpiDefinition.datapoint.unit.isCurrency) {
          oKPIModel.setProperty("/".concat(kpiDefinition.id, "/manifest/sap.card/data/json/mainUnit"), rawUnit);
        } else {
          // In case of unit of measure, we have to format it properly
          var kpiUnit = NumberFormat.getUnitInstance({
            showNumber: false
          }, currentLocale).format(rawValue, rawUnit);
          oKPIModel.setProperty("/".concat(kpiDefinition.id, "/manifest/sap.card/data/json/mainUnit"), kpiUnit);
        }
      }
    };

    _proto.updateDatapointCriticality = function updateDatapointCriticality(kpiDefinition, kpiContext, oKPIModel) {
      var rawValue = Number.parseFloat(kpiContext.getProperty(kpiDefinition.datapoint.propertyPath));
      var criticalityValue = MessageType.None;

      if (kpiDefinition.datapoint.criticalityValue) {
        // Criticality is a fixed value
        criticalityValue = kpiDefinition.datapoint.criticalityValue;
      } else if (kpiDefinition.datapoint.criticalityPath) {
        // Criticality comes from another property (via a path)
        criticalityValue = MessageTypeFromCriticality[kpiContext.getProperty(kpiDefinition.datapoint.criticalityPath)] || MessageType.None;
      } else if (kpiDefinition.datapoint.criticalityCalculationThresholds && kpiDefinition.datapoint.criticalityCalculationMode) {
        // Criticality calculation
        switch (kpiDefinition.datapoint.criticalityCalculationMode) {
          case "UI.ImprovementDirectionType/Target":
            criticalityValue = messageTypeFromTargetCalculation(rawValue, kpiDefinition.datapoint.criticalityCalculationThresholds);
            break;

          case "UI.ImprovementDirectionType/Minimize":
            criticalityValue = messageTypeFromMinimizeCalculation(rawValue, kpiDefinition.datapoint.criticalityCalculationThresholds);
            break;

          case "UI.ImprovementDirectionType/Maximize":
          default:
            criticalityValue = messageTypeFromMaximizeCalculation(rawValue, kpiDefinition.datapoint.criticalityCalculationThresholds);
            break;
        }
      }

      oKPIModel.setProperty("/".concat(kpiDefinition.id, "/manifest/sap.card/data/json/mainCriticality"), criticalityValue);
      oKPIModel.setProperty("/".concat(kpiDefinition.id, "/manifest/sap.card/data/json/mainState"), ValueColorFromMessageType[criticalityValue] || "None");
    };

    _proto.updateDatapointTrend = function updateDatapointTrend(kpiDefinition, kpiContext, oKPIModel) {
      var rawValue = Number.parseFloat(kpiContext.getProperty(kpiDefinition.datapoint.propertyPath));
      var trendValue = "None";

      if (kpiDefinition.datapoint.trendValue) {
        // Trend is a fixed value
        trendValue = kpiDefinition.datapoint.trendValue;
      } else if (kpiDefinition.datapoint.trendPath) {
        // Trend comes from another property via a path
        trendValue = deviationIndicatorFromTrendType(kpiContext.getProperty(kpiDefinition.datapoint.trendPath));
      } else if (kpiDefinition.datapoint.trendCalculationReferenceValue !== undefined || kpiDefinition.datapoint.trendCalculationReferencePath) {
        // Calculated trend
        var trendReferenceValue;

        if (kpiDefinition.datapoint.trendCalculationReferenceValue !== undefined) {
          trendReferenceValue = kpiDefinition.datapoint.trendCalculationReferenceValue;
        } else {
          trendReferenceValue = Number.parseFloat(kpiContext.getProperty(kpiDefinition.datapoint.trendCalculationReferencePath || ""));
        }

        trendValue = deviationIndicatorFromCalculation(rawValue, trendReferenceValue, !!kpiDefinition.datapoint.trendCalculationIsRelative, kpiDefinition.datapoint.trendCalculationTresholds);
      }

      oKPIModel.setProperty("/".concat(kpiDefinition.id, "/manifest/sap.card/data/json/trend"), trendValue);
    };

    _proto.updateTargetValue = function updateTargetValue(kpiDefinition, kpiContext, oKPIModel) {
      if (kpiDefinition.datapoint.targetValue === undefined && kpiDefinition.datapoint.targetPath === undefined) {
        return; // No target set for the KPI
      }

      var rawValue = Number.parseFloat(kpiContext.getProperty(kpiDefinition.datapoint.propertyPath));
      var currentLocale = new Locale(sap.ui.getCore().getConfiguration().getLanguage());
      var targetRawValue;

      if (kpiDefinition.datapoint.targetValue !== undefined) {
        targetRawValue = kpiDefinition.datapoint.targetValue;
      } else {
        targetRawValue = Number.parseFloat(kpiContext.getProperty(kpiDefinition.datapoint.targetPath || ""));
      }

      var deviationRawValue = targetRawValue !== 0 ? (rawValue - targetRawValue) / targetRawValue * 100 : undefined; // Formatting

      var targetValue = NumberFormat.getFloatInstance({
        style: "short",
        minFractionDigits: 0,
        maxFractionDigits: 1,
        showScale: false
      }, currentLocale).format(targetRawValue);
      var targetScale = NumberFormat.getFloatInstance({
        style: "short",
        decimals: 0,
        maxIntegerDigits: 0,
        showScale: true
      }, currentLocale).format(targetRawValue);
      oKPIModel.setProperty("/".concat(kpiDefinition.id, "/manifest/sap.card/data/json/targetNumber"), targetValue);
      oKPIModel.setProperty("/".concat(kpiDefinition.id, "/manifest/sap.card/data/json/targetUnit"), targetScale);

      if (deviationRawValue !== undefined) {
        var deviationValue = NumberFormat.getFloatInstance({
          minFractionDigits: 0,
          maxFractionDigits: 1,
          showScale: false
        }, currentLocale).format(deviationRawValue);
        oKPIModel.setProperty("/".concat(kpiDefinition.id, "/manifest/sap.card/data/json/deviationNumber"), deviationValue);
      } else {
        oKPIModel.setProperty("/".concat(kpiDefinition.id, "/manifest/sap.card/data/json/deviationNumber"), "N/A");
      }
    }
    /**
     * Loads tag data for a KPI, and stores it in the JSON KPI model.
     *
     * @param kpiDefinition The definition of the KPI.
     * @param oMainModel The model used to load the data.
     * @param oKPIModel The JSON model where the data will be stored
     * @param loadFull If not true, loads only data for the KPI tag
     * @returns Returns the promise that is resolved when data is loaded.
     */
    ;

    _proto.loadKPITagData = function loadKPITagData(kpiDefinition, oMainModel, oKPIModel, loadFull) {
      var _kpiDefinition$datapo4,
          _kpiDefinition$select2,
          _this2 = this;

      // If loadFull=false, then we're just loading data for the tag and we use the "$auto.LongRunners" groupID
      // If loadFull=true, we're loading data for the whole KPI (tag + card) and we use the default ("$auto") groupID
      var oListBinding = loadFull ? oMainModel.bindList("/".concat(kpiDefinition.entitySet)) : oMainModel.bindList("/".concat(kpiDefinition.entitySet), undefined, undefined, undefined, {
        $$groupId: "$auto.LongRunners"
      });
      var oAggregate = {}; // Main value + currency/unit

      if ((_kpiDefinition$datapo4 = kpiDefinition.datapoint.unit) !== null && _kpiDefinition$datapo4 !== void 0 && _kpiDefinition$datapo4.isPath) {
        oAggregate[kpiDefinition.datapoint.propertyPath] = {
          unit: kpiDefinition.datapoint.unit.value
        };
      } else {
        oAggregate[kpiDefinition.datapoint.propertyPath] = {};
      } // Property for criticality


      if (kpiDefinition.datapoint.criticalityPath) {
        oAggregate[kpiDefinition.datapoint.criticalityPath] = {};
      } // Properties for trend and trend calculation


      if (loadFull) {
        if (kpiDefinition.datapoint.trendPath) {
          oAggregate[kpiDefinition.datapoint.trendPath] = {};
        }

        if (kpiDefinition.datapoint.trendCalculationReferencePath) {
          oAggregate[kpiDefinition.datapoint.trendCalculationReferencePath] = {};
        }

        if (kpiDefinition.datapoint.targetPath) {
          oAggregate[kpiDefinition.datapoint.targetPath] = {};
        }
      }

      oListBinding.setAggregation({
        aggregate: oAggregate
      }); // Manage SelectionVariant filters

      if ((_kpiDefinition$select2 = kpiDefinition.selectionVariantFilterDefinitions) !== null && _kpiDefinition$select2 !== void 0 && _kpiDefinition$select2.length) {
        var aFilters = kpiDefinition.selectionVariantFilterDefinitions.map(createFilterFromDefinition).filter(function (filter) {
          return filter !== undefined;
        });
        oListBinding.filter(aFilters);
      }

      return oListBinding.requestContexts(0, 1).then(function (aContexts) {
        if (aContexts.length) {
          var _kpiDefinition$datapo5, _kpiDefinition$datapo6;

          var rawUnit = (_kpiDefinition$datapo5 = kpiDefinition.datapoint.unit) !== null && _kpiDefinition$datapo5 !== void 0 && _kpiDefinition$datapo5.isPath ? aContexts[0].getProperty(kpiDefinition.datapoint.unit.value) : (_kpiDefinition$datapo6 = kpiDefinition.datapoint.unit) === null || _kpiDefinition$datapo6 === void 0 ? void 0 : _kpiDefinition$datapo6.value;

          if (kpiDefinition.datapoint.unit && !rawUnit) {
            // A unit/currency is defined, but its value is undefined --> multi-unit situation
            oKPIModel.setProperty("/".concat(kpiDefinition.id, "/manifest/sap.card/data/json/mainValue"), "*");
            oKPIModel.setProperty("/".concat(kpiDefinition.id, "/manifest/sap.card/data/json/mainValueUnscaled"), "*");
            oKPIModel.setProperty("/".concat(kpiDefinition.id, "/manifest/sap.card/data/json/mainValueNoScale"), "*");
            oKPIModel.setProperty("/".concat(kpiDefinition.id, "/manifest/sap.card/data/json/mainValueScale"), "");
            oKPIModel.setProperty("/".concat(kpiDefinition.id, "/manifest/sap.card/data/json/mainUnit"), undefined);
            oKPIModel.setProperty("/".concat(kpiDefinition.id, "/manifest/sap.card/data/json/mainCriticality"), MessageType.None);
            oKPIModel.setProperty("/".concat(kpiDefinition.id, "/manifest/sap.card/data/json/mainState"), "None");
            oKPIModel.setProperty("/".concat(kpiDefinition.id, "/manifest/sap.card/data/json/trend"), "None");
            oKPIModel.setProperty("/".concat(kpiDefinition.id, "/manifest/sap.card/data/json/targetNumber"), undefined);
            oKPIModel.setProperty("/".concat(kpiDefinition.id, "/manifest/sap.card/data/json/targetUnit"), undefined);
            oKPIModel.setProperty("/".concat(kpiDefinition.id, "/manifest/sap.card/data/json/deviationNumber"), undefined);
          } else {
            _this2.updateDatapointValueAndCurrency(kpiDefinition, aContexts[0], oKPIModel);

            _this2.updateDatapointCriticality(kpiDefinition, aContexts[0], oKPIModel);

            if (loadFull) {
              _this2.updateDatapointTrend(kpiDefinition, aContexts[0], oKPIModel);

              _this2.updateTargetValue(kpiDefinition, aContexts[0], oKPIModel);
            }
          }
        }
      });
    }
    /**
     * Loads card data for a KPI, and stores it in the JSON KPI model.
     *
     * @param kpiDefinition The definition of the KPI.
     * @param oMainModel The model used to load the data.
     * @param oKPIModel The JSON model where the data will be stored
     * @returns Returns the promise that is resolved when data is loaded.
     */
    ;

    _proto.loadKPICardData = function loadKPICardData(kpiDefinition, oMainModel, oKPIModel) {
      var _kpiDefinition$select3;

      var oListBinding = oMainModel.bindList("/".concat(kpiDefinition.entitySet));
      var oGroup = {};
      var oAggregate = {};
      kpiDefinition.chart.dimensions.forEach(function (dimension) {
        oGroup[dimension.name] = {};
      });
      kpiDefinition.chart.measures.forEach(function (measure) {
        oAggregate[measure.name] = {};
      });
      oListBinding.setAggregation({
        group: oGroup,
        aggregate: oAggregate
      }); // Manage SelectionVariant filters

      if ((_kpiDefinition$select3 = kpiDefinition.selectionVariantFilterDefinitions) !== null && _kpiDefinition$select3 !== void 0 && _kpiDefinition$select3.length) {
        var aFilters = kpiDefinition.selectionVariantFilterDefinitions.map(createFilterFromDefinition).filter(function (filter) {
          return filter !== undefined;
        });
        oListBinding.filter(aFilters);
      } // Sorting


      if (kpiDefinition.chart.sortOrder) {
        oListBinding.sort(kpiDefinition.chart.sortOrder.map(function (sortInfo) {
          return new Sorter(sortInfo.name, sortInfo.descending);
        }));
      }

      return oListBinding.requestContexts(0, kpiDefinition.chart.maxItems).then(function (aContexts) {
        var chartData = aContexts.map(function (oContext) {
          var oData = {};
          kpiDefinition.chart.dimensions.forEach(function (dimension) {
            oData[dimension.name] = oContext.getProperty(dimension.name);
          });
          kpiDefinition.chart.measures.forEach(function (measure) {
            oData[measure.name] = oContext.getProperty(measure.name);
          });
          return oData;
        });
        oKPIModel.setProperty("/".concat(kpiDefinition.id, "/manifest/sap.card/data/json/chartData"), chartData);
      });
    }
    /**
     * Gets the popover to display the KPI card
     * The popover and the contained card for the KPIs are created if necessary.
     * The popover is shared between all KPIs, so it's created only once.
     *
     * @param oKPITag The tag that triggered the popover opening.
     * @returns The shared popover as a promise.
     */
    ;

    _proto.getPopover = function getPopover(oKPITag) {
      var _this3 = this;

      if (!this.oPopover) {
        return new Promise(function (resolve, reject) {
          Core.loadLibrary("sap/ui/integration", {
            async: true
          }).then(function () {
            sap.ui.require(["sap/ui/integration/widgets/Card", "sap/ui/integration/Host"], function (Card, Host) {
              var oHost = new Host();
              oHost.attachAction(function (oEvent) {
                var sType = oEvent.getParameter("type");
                var oParams = oEvent.getParameter("parameters");

                if (sType === "Navigation") {
                  if (oParams.semanticObject) {
                    _this3.getView().getController()._intentBasedNavigation.navigate(oParams.semanticObject, oParams.action);
                  } else {
                    _this3.getView().getController()._intentBasedNavigation.navigateOutbound(oParams.outbound);
                  }
                }
              });
              _this3.oCard = new Card({
                width: "25rem",
                height: "auto"
              });

              _this3.oCard.setHost(oHost);

              _this3.oPopover = new Popover("kpi-Popover", {
                showHeader: false,
                placement: "Auto",
                content: [_this3.oCard]
              });
              oKPITag.addDependent(_this3.oPopover); // The first clicked tag gets the popover as dependent

              resolve(_this3.oPopover);
            });
          }).catch(function () {
            reject();
          });
        });
      } else {
        return Promise.resolve(this.oPopover);
      }
    };

    _proto.onKPIPressed = function onKPIPressed(oKPITag, kpiID) {
      var _this4 = this;

      var oKPIModel = oKPITag.getModel("kpiModel");

      if (this.aKPIDefinitions && this.aKPIDefinitions.length) {
        var kpiDefinition = this.aKPIDefinitions.find(function (oDef) {
          return oDef.id === kpiID;
        });

        if (kpiDefinition) {
          var oModel = oKPITag.getModel();
          var aPromises = [this.loadKPITagData(kpiDefinition, oModel, oKPIModel, true), this.loadKPICardData(kpiDefinition, oModel, oKPIModel), this.getPopover(oKPITag)];
          Promise.all(aPromises).then(function (aResults) {
            _this4.oCard.setManifest(oKPIModel.getProperty("/".concat(kpiID, "/manifest")));

            _this4.oCard.refresh();

            var oPopover = aResults[2];
            oPopover.openBy(oKPITag, false);
          }).catch(function (err) {
            Log.error(err);
          });
        }
      }
    };

    return KPIManagementControllerExtension;
  }(ControllerExtension), (_applyDecoratedDescriptor(_class2.prototype, "onInit", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "onInit"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onExit", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "onExit"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onKPIPressed", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "onKPIPressed"), _class2.prototype)), _class2)) || _class);
  return KPIManagementControllerExtension;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJNZXNzYWdlVHlwZUZyb21Dcml0aWNhbGl0eSIsIk1lc3NhZ2VUeXBlIiwiRXJyb3IiLCJXYXJuaW5nIiwiU3VjY2VzcyIsIkluZm9ybWF0aW9uIiwiVmFsdWVDb2xvckZyb21NZXNzYWdlVHlwZSIsIk5vbmUiLCJtZXNzYWdlVHlwZUZyb21UYXJnZXRDYWxjdWxhdGlvbiIsImtwaVZhbHVlIiwiYVRocmVzaG9sZHMiLCJjcml0aWNhbGl0eVByb3BlcnR5IiwidW5kZWZpbmVkIiwibWVzc2FnZVR5cGVGcm9tTWluaW1pemVDYWxjdWxhdGlvbiIsIm1lc3NhZ2VUeXBlRnJvbU1heGltaXplQ2FsY3VsYXRpb24iLCJkZXZpYXRpb25JbmRpY2F0b3JGcm9tVHJlbmRUeXBlIiwidHJlbmRWYWx1ZSIsImRldmlhdGlvbkluZGljYXRvciIsImRldmlhdGlvbkluZGljYXRvckZyb21DYWxjdWxhdGlvbiIsInJlZmVyZW5jZVZhbHVlIiwiaXNSZWxhdGl2ZSIsImNvbXBWYWx1ZSIsImNyZWF0ZUZpbHRlckZyb21EZWZpbml0aW9uIiwiZmlsdGVyRGVmaW5pdGlvbiIsInJhbmdlcyIsImxlbmd0aCIsIkZpbHRlciIsInByb3BlcnR5UGF0aCIsIm9wZXJhdG9yIiwicmFuZ2VMb3ciLCJyYW5nZUhpZ2giLCJhUmFuZ2VGaWx0ZXJzIiwibWFwIiwicmFuZ2UiLCJmaWx0ZXJzIiwiYW5kIiwiZ2V0RmlsdGVyU3RyaW5nRnJvbURlZmluaXRpb24iLCJjdXJyZW50TG9jYWxlIiwiTG9jYWxlIiwic2FwIiwidWkiLCJnZXRDb3JlIiwiZ2V0Q29uZmlndXJhdGlvbiIsImdldExhbmd1YWdlIiwicmVzQnVuZGxlIiwiQ29yZSIsImdldExpYnJhcnlSZXNvdXJjZUJ1bmRsZSIsImRhdGVGb3JtYXQiLCJEYXRlRm9ybWF0IiwiZ2V0RGF0ZUluc3RhbmNlIiwic3R5bGUiLCJmb3JtYXRSYW5nZSIsInZhbHVlTG93IiwicHJvcGVydHlUeXBlIiwiaW5kZXhPZiIsImZvcm1hdCIsIkRhdGUiLCJ2YWx1ZUhpZ2giLCJnZXRUZXh0Iiwiam9pbiIsImZvcm1hdENoYXJ0VGl0bGUiLCJrcGlEZWYiLCJmb3JtYXRMaXN0IiwiaXRlbXMiLCJsYWJlbCIsInJlcyIsIkkiLCJjaGFydCIsIm1lYXN1cmVzIiwiZGltZW5zaW9ucyIsInVwZGF0ZUNoYXJ0TGFiZWxTZXR0aW5ncyIsImNoYXJ0RGVmaW5pdGlvbiIsIm9DaGFydFByb3BlcnRpZXMiLCJjaGFydFR5cGUiLCJjYXRlZ29yeUF4aXMiLCJ0aXRsZSIsInZpc2libGUiLCJ2YWx1ZUF4aXMiLCJmb3JtYXRTdHJpbmciLCJwbG90QXJlYSIsImRhdGFMYWJlbCIsInR5cGUiLCJ2YWx1ZUF4aXMyIiwibGVnZW5kR3JvdXAiLCJsYXlvdXQiLCJwb3NpdGlvbiIsImFsaWdubWVudCIsInNpemVMZWdlbmQiLCJmaWx0ZXJNYXAiLCJhT2JqZWN0cyIsImFSb2xlcyIsImZpbHRlciIsImRpbWVuc2lvbiIsInJvbGUiLCJnZXRTY2F0dGVyQnViYmxlQ2hhcnRGZWVkcyIsImF4aXMxTWVhc3VyZXMiLCJheGlzMk1lYXN1cmVzIiwiYXhpczNNZWFzdXJlcyIsIm90aGVyTWVhc3VyZXMiLCJzZXJpZXNEaW1lbnNpb25zIiwic2hhcGVEaW1lbnNpb24iLCJmaW5kIiwieE1lYXN1cmUiLCJzaGlmdCIsInlNZWFzdXJlIiwic2l6ZU1lYXN1cmUiLCJwdXNoIiwiZ2V0Q2hhcnRGZWVkcyIsImdldE5hdmlnYXRpb25QYXJhbWV0ZXJzIiwibmF2SW5mbyIsIm9TaGVsbFNlcnZpY2UiLCJzZW1hbnRpY09iamVjdCIsImFjdGlvbiIsImdldExpbmtzIiwidGhlbiIsImFMaW5rcyIsImdldFByaW1hcnlJbnRlbnQiLCJvTGluayIsIm9JbmZvIiwicGFyc2VTaGVsbEhhc2giLCJpbnRlbnQiLCJ1bmF2YWlsYWJsZUFjdGlvbnMiLCJvdXRib3VuZE5hdmlnYXRpb24iLCJQcm9taXNlIiwicmVzb2x2ZSIsIm91dGJvdW5kIiwiS1BJTWFuYWdlbWVudENvbnRyb2xsZXJFeHRlbnNpb24iLCJkZWZpbmVVSTVDbGFzcyIsIm1ldGhvZE92ZXJyaWRlIiwicHVibGljRXh0ZW5zaW9uIiwiaW5pdENhcmRNYW5pZmVzdCIsImtwaURlZmluaXRpb24iLCJvS1BJTW9kZWwiLCJvQ2FyZE1hbmlmZXN0IiwiaWQiLCJ0ZWNobm9sb2d5IiwiZGF0YSIsImpzb24iLCJoZWFkZXIiLCJkYXRhcG9pbnQiLCJzdWJUaXRsZSIsImRlc2NyaXB0aW9uIiwidW5pdE9mTWVhc3VyZW1lbnQiLCJtYWluSW5kaWNhdG9yIiwibnVtYmVyIiwidW5pdCIsInN0YXRlIiwidHJlbmQiLCJjb250ZW50IiwibWluSGVpZ2h0IiwiY2hhcnRQcm9wZXJ0aWVzIiwicGF0aCIsInRhcmdldFBhdGgiLCJ0YXJnZXRWYWx1ZSIsInNpZGVJbmRpY2F0b3JzIiwic2VsZWN0aW9uVmFyaWFudEZpbHRlckRlZmluaXRpb25zIiwiYURlc2NyaXB0aW9ucyIsImZvckVhY2giLCJkZXNjIiwiZGV0YWlscyIsInRleHQiLCJ2YWx1ZSIsIm5hbWUiLCJtZWFzdXJlIiwiZmVlZHMiLCJzZXRQcm9wZXJ0eSIsIm1hbmlmZXN0IiwiaW5pdE5hdmlnYXRpb25JbmZvIiwibmF2aWdhdGlvbiIsIm9OYXZJbmZvIiwicGFyYW1ldGVycyIsIm9uSW5pdCIsImFLUElEZWZpbml0aW9ucyIsImdldFZpZXciLCJnZXRDb250cm9sbGVyIiwiX2dldFBhZ2VNb2RlbCIsImdldFByb3BlcnR5Iiwib1ZpZXciLCJvQXBwQ29tcG9uZW50IiwiZ2V0QXBwQ29tcG9uZW50IiwiSlNPTk1vZGVsIiwic2V0TW9kZWwiLCJnZXRTaGVsbFNlcnZpY2VzIiwiY2F0Y2giLCJlcnIiLCJMb2ciLCJlcnJvciIsImxvYWRLUElUYWdEYXRhIiwiZ2V0TW9kZWwiLCJvbkV4aXQiLCJkZXN0cm95IiwidXBkYXRlRGF0YXBvaW50VmFsdWVBbmRDdXJyZW5jeSIsImtwaUNvbnRleHQiLCJyYXdVbml0IiwiaXNQYXRoIiwiaXNQZXJjZW50YWdlIiwiaXNDdXJyZW5jeSIsInJhd1ZhbHVlIiwiTnVtYmVyIiwicGFyc2VGbG9hdCIsIk51bWJlckZvcm1hdCIsImdldEZsb2F0SW5zdGFuY2UiLCJtaW5GcmFjdGlvbkRpZ2l0cyIsIm1heEZyYWN0aW9uRGlnaXRzIiwic2hvd1NjYWxlIiwia3BpVmFsdWVVbnNjYWxlZCIsImdyb3VwaW5nRW5hYmxlZCIsImtwaVZhbHVlTm9TY2FsZSIsImtwaVZhbHVlU2NhbGUiLCJkZWNpbWFscyIsIm1heEludGVnZXJEaWdpdHMiLCJrcGlVbml0IiwiZ2V0VW5pdEluc3RhbmNlIiwic2hvd051bWJlciIsInVwZGF0ZURhdGFwb2ludENyaXRpY2FsaXR5IiwiY3JpdGljYWxpdHlWYWx1ZSIsImNyaXRpY2FsaXR5UGF0aCIsImNyaXRpY2FsaXR5Q2FsY3VsYXRpb25UaHJlc2hvbGRzIiwiY3JpdGljYWxpdHlDYWxjdWxhdGlvbk1vZGUiLCJ1cGRhdGVEYXRhcG9pbnRUcmVuZCIsInRyZW5kUGF0aCIsInRyZW5kQ2FsY3VsYXRpb25SZWZlcmVuY2VWYWx1ZSIsInRyZW5kQ2FsY3VsYXRpb25SZWZlcmVuY2VQYXRoIiwidHJlbmRSZWZlcmVuY2VWYWx1ZSIsInRyZW5kQ2FsY3VsYXRpb25Jc1JlbGF0aXZlIiwidHJlbmRDYWxjdWxhdGlvblRyZXNob2xkcyIsInVwZGF0ZVRhcmdldFZhbHVlIiwidGFyZ2V0UmF3VmFsdWUiLCJkZXZpYXRpb25SYXdWYWx1ZSIsInRhcmdldFNjYWxlIiwiZGV2aWF0aW9uVmFsdWUiLCJvTWFpbk1vZGVsIiwibG9hZEZ1bGwiLCJvTGlzdEJpbmRpbmciLCJiaW5kTGlzdCIsImVudGl0eVNldCIsIiQkZ3JvdXBJZCIsIm9BZ2dyZWdhdGUiLCJzZXRBZ2dyZWdhdGlvbiIsImFnZ3JlZ2F0ZSIsImFGaWx0ZXJzIiwicmVxdWVzdENvbnRleHRzIiwiYUNvbnRleHRzIiwibG9hZEtQSUNhcmREYXRhIiwib0dyb3VwIiwiZ3JvdXAiLCJzb3J0T3JkZXIiLCJzb3J0Iiwic29ydEluZm8iLCJTb3J0ZXIiLCJkZXNjZW5kaW5nIiwibWF4SXRlbXMiLCJjaGFydERhdGEiLCJvQ29udGV4dCIsIm9EYXRhIiwiZ2V0UG9wb3ZlciIsIm9LUElUYWciLCJvUG9wb3ZlciIsInJlamVjdCIsImxvYWRMaWJyYXJ5IiwiYXN5bmMiLCJyZXF1aXJlIiwiQ2FyZCIsIkhvc3QiLCJvSG9zdCIsImF0dGFjaEFjdGlvbiIsIm9FdmVudCIsInNUeXBlIiwiZ2V0UGFyYW1ldGVyIiwib1BhcmFtcyIsIl9pbnRlbnRCYXNlZE5hdmlnYXRpb24iLCJuYXZpZ2F0ZSIsIm5hdmlnYXRlT3V0Ym91bmQiLCJvQ2FyZCIsIndpZHRoIiwiaGVpZ2h0Iiwic2V0SG9zdCIsIlBvcG92ZXIiLCJzaG93SGVhZGVyIiwicGxhY2VtZW50IiwiYWRkRGVwZW5kZW50Iiwib25LUElQcmVzc2VkIiwia3BpSUQiLCJvRGVmIiwib01vZGVsIiwiYVByb21pc2VzIiwiYWxsIiwiYVJlc3VsdHMiLCJzZXRNYW5pZmVzdCIsInJlZnJlc2giLCJvcGVuQnkiLCJDb250cm9sbGVyRXh0ZW5zaW9uIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJLUElNYW5hZ2VtZW50LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMb2cgZnJvbSBcInNhcC9iYXNlL0xvZ1wiO1xuaW1wb3J0IHR5cGUgQmFzZUNvbnRyb2xsZXIgZnJvbSBcInNhcC9mZS9jb3JlL0Jhc2VDb250cm9sbGVyXCI7XG5pbXBvcnQgdHlwZSB7IEtQSUNoYXJ0RGVmaW5pdGlvbiwgS1BJRGVmaW5pdGlvbiwgTmF2aWdhdGlvbkluZm8gfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9jb250cm9scy9Db21tb24vS1BJXCI7XG5pbXBvcnQgdHlwZSB7IEZpbHRlckRlZmluaXRpb24sIFJhbmdlRGVmaW5pdGlvbiB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvU2VsZWN0aW9uVmFyaWFudEhlbHBlclwiO1xuaW1wb3J0IHsgTWVzc2FnZVR5cGUgfSBmcm9tIFwic2FwL2ZlL2NvcmUvZm9ybWF0dGVycy9UYWJsZUZvcm1hdHRlclR5cGVzXCI7XG5pbXBvcnQgdHlwZSBMaXN0UmVwb3J0Q29udHJvbGxlciBmcm9tIFwic2FwL2ZlL3RlbXBsYXRlcy9MaXN0UmVwb3J0L0xpc3RSZXBvcnRDb250cm9sbGVyLmNvbnRyb2xsZXJcIjtcbmltcG9ydCB0eXBlIEdlbmVyaWNUYWcgZnJvbSBcInNhcC9tL0dlbmVyaWNUYWdcIjtcbmltcG9ydCBQb3BvdmVyIGZyb20gXCJzYXAvbS9Qb3BvdmVyXCI7XG5pbXBvcnQgQ29yZSBmcm9tIFwic2FwL3VpL2NvcmUvQ29yZVwiO1xuaW1wb3J0IERhdGVGb3JtYXQgZnJvbSBcInNhcC91aS9jb3JlL2Zvcm1hdC9EYXRlRm9ybWF0XCI7XG5pbXBvcnQgTnVtYmVyRm9ybWF0IGZyb20gXCJzYXAvdWkvY29yZS9mb3JtYXQvTnVtYmVyRm9ybWF0XCI7XG5pbXBvcnQgTG9jYWxlIGZyb20gXCJzYXAvdWkvY29yZS9Mb2NhbGVcIjtcbmltcG9ydCBDb250cm9sbGVyRXh0ZW5zaW9uIGZyb20gXCJzYXAvdWkvY29yZS9tdmMvQ29udHJvbGxlckV4dGVuc2lvblwiO1xuaW1wb3J0IEZpbHRlciBmcm9tIFwic2FwL3VpL21vZGVsL0ZpbHRlclwiO1xuaW1wb3J0IHR5cGUgRmlsdGVyT3BlcmF0b3IgZnJvbSBcInNhcC91aS9tb2RlbC9GaWx0ZXJPcGVyYXRvclwiO1xuaW1wb3J0IEpTT05Nb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL2pzb24vSlNPTk1vZGVsXCI7XG5pbXBvcnQgdHlwZSBDb250ZXh0IGZyb20gXCJzYXAvdWkvbW9kZWwvb2RhdGEvdjQvQ29udGV4dFwiO1xuaW1wb3J0IHR5cGUgT0RhdGFNb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0L09EYXRhTW9kZWxcIjtcbmltcG9ydCBTb3J0ZXIgZnJvbSBcInNhcC91aS9tb2RlbC9Tb3J0ZXJcIjtcbmltcG9ydCB7IGRlZmluZVVJNUNsYXNzLCBtZXRob2RPdmVycmlkZSwgcHVibGljRXh0ZW5zaW9uIH0gZnJvbSBcIi4uL2hlbHBlcnMvQ2xhc3NTdXBwb3J0XCI7XG5cbmNvbnN0IE1lc3NhZ2VUeXBlRnJvbUNyaXRpY2FsaXR5OiBSZWNvcmQ8c3RyaW5nLCBNZXNzYWdlVHlwZT4gPSB7XG5cdFwiMVwiOiBNZXNzYWdlVHlwZS5FcnJvcixcblx0XCIyXCI6IE1lc3NhZ2VUeXBlLldhcm5pbmcsXG5cdFwiM1wiOiBNZXNzYWdlVHlwZS5TdWNjZXNzLFxuXHRcIjVcIjogTWVzc2FnZVR5cGUuSW5mb3JtYXRpb25cbn07XG5cbmNvbnN0IFZhbHVlQ29sb3JGcm9tTWVzc2FnZVR5cGU6IFJlY29yZDxNZXNzYWdlVHlwZSwgc3RyaW5nPiA9IHtcblx0RXJyb3I6IFwiRXJyb3JcIixcblx0V2FybmluZzogXCJDcml0aWNhbFwiLFxuXHRTdWNjZXNzOiBcIkdvb2RcIixcblx0SW5mb3JtYXRpb246IFwiTm9uZVwiLFxuXHROb25lOiBcIk5vbmVcIlxufTtcblxuLyoqXG4gKiBGdW5jdGlvbiB0byBnZXQgYSBtZXNzYWdlIHN0YXRlIGZyb20gYSBjYWxjdWxhdGVkIGNyaXRpY2FsaXR5IG9mIHR5cGUgJ1RhcmdldCcuXG4gKlxuICogQHBhcmFtIGtwaVZhbHVlIFRoZSB2YWx1ZSBvZiB0aGUgS1BJIHRvIGJlIHRlc3RlZCBhZ2FpbnN0LlxuICogQHBhcmFtIGFUaHJlc2hvbGRzIFRocmVzaG9sZHMgdG8gYmUgdXNlZCBbRGV2aWF0aW9uUmFuZ2VMb3dWYWx1ZSxUb2xlcmFuY2VSYW5nZUxvd1ZhbHVlLEFjY2VwdGFuY2VSYW5nZUxvd1ZhbHVlLEFjY2VwdGFuY2VSYW5nZUhpZ2hWYWx1ZSxUb2xlcmFuY2VSYW5nZUhpZ2hWYWx1ZSxEZXZpYXRpb25SYW5nZUhpZ2hWYWx1ZV0uXG4gKiBAcmV0dXJucyBSZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIE1lc3NhZ2VUeXBlXG4gKi9cbmZ1bmN0aW9uIG1lc3NhZ2VUeXBlRnJvbVRhcmdldENhbGN1bGF0aW9uKGtwaVZhbHVlOiBudW1iZXIsIGFUaHJlc2hvbGRzOiAobnVtYmVyIHwgdW5kZWZpbmVkIHwgbnVsbClbXSk6IE1lc3NhZ2VUeXBlIHtcblx0bGV0IGNyaXRpY2FsaXR5UHJvcGVydHk6IE1lc3NhZ2VUeXBlO1xuXG5cdGlmIChhVGhyZXNob2xkc1swXSAhPT0gdW5kZWZpbmVkICYmIGFUaHJlc2hvbGRzWzBdICE9PSBudWxsICYmIGtwaVZhbHVlIDwgYVRocmVzaG9sZHNbMF0pIHtcblx0XHRjcml0aWNhbGl0eVByb3BlcnR5ID0gTWVzc2FnZVR5cGUuRXJyb3I7XG5cdH0gZWxzZSBpZiAoYVRocmVzaG9sZHNbMV0gIT09IHVuZGVmaW5lZCAmJiBhVGhyZXNob2xkc1sxXSAhPT0gbnVsbCAmJiBrcGlWYWx1ZSA8IGFUaHJlc2hvbGRzWzFdKSB7XG5cdFx0Y3JpdGljYWxpdHlQcm9wZXJ0eSA9IE1lc3NhZ2VUeXBlLldhcm5pbmc7XG5cdH0gZWxzZSBpZiAoYVRocmVzaG9sZHNbMl0gIT09IHVuZGVmaW5lZCAmJiBhVGhyZXNob2xkc1syXSAhPT0gbnVsbCAmJiBrcGlWYWx1ZSA8IGFUaHJlc2hvbGRzWzJdKSB7XG5cdFx0Y3JpdGljYWxpdHlQcm9wZXJ0eSA9IE1lc3NhZ2VUeXBlLk5vbmU7XG5cdH0gZWxzZSBpZiAoYVRocmVzaG9sZHNbNV0gIT09IHVuZGVmaW5lZCAmJiBhVGhyZXNob2xkc1s1XSAhPT0gbnVsbCAmJiBrcGlWYWx1ZSA+IGFUaHJlc2hvbGRzWzVdKSB7XG5cdFx0Y3JpdGljYWxpdHlQcm9wZXJ0eSA9IE1lc3NhZ2VUeXBlLkVycm9yO1xuXHR9IGVsc2UgaWYgKGFUaHJlc2hvbGRzWzRdICE9PSB1bmRlZmluZWQgJiYgYVRocmVzaG9sZHNbNF0gIT09IG51bGwgJiYga3BpVmFsdWUgPiBhVGhyZXNob2xkc1s0XSkge1xuXHRcdGNyaXRpY2FsaXR5UHJvcGVydHkgPSBNZXNzYWdlVHlwZS5XYXJuaW5nO1xuXHR9IGVsc2UgaWYgKGFUaHJlc2hvbGRzWzNdICE9PSB1bmRlZmluZWQgJiYgYVRocmVzaG9sZHNbM10gIT09IG51bGwgJiYga3BpVmFsdWUgPiBhVGhyZXNob2xkc1szXSkge1xuXHRcdGNyaXRpY2FsaXR5UHJvcGVydHkgPSBNZXNzYWdlVHlwZS5Ob25lO1xuXHR9IGVsc2Uge1xuXHRcdGNyaXRpY2FsaXR5UHJvcGVydHkgPSBNZXNzYWdlVHlwZS5TdWNjZXNzO1xuXHR9XG5cblx0cmV0dXJuIGNyaXRpY2FsaXR5UHJvcGVydHk7XG59XG5cbi8qKlxuICogRnVuY3Rpb24gdG8gZ2V0IGEgbWVzc2FnZSBzdGF0ZSBmcm9tIGEgY2FsY3VsYXRlZCBjcml0aWNhbGl0eSBvZiB0eXBlICdNaW5pbWl6ZScuXG4gKlxuICogQHBhcmFtIGtwaVZhbHVlIFRoZSB2YWx1ZSBvZiB0aGUgS1BJIHRvIGJlIHRlc3RlZCBhZ2FpbnN0LlxuICogQHBhcmFtIGFUaHJlc2hvbGRzIFRocmVzaG9sZHMgdG8gYmUgdXNlZCBbQWNjZXB0YW5jZVJhbmdlSGlnaFZhbHVlLFRvbGVyYW5jZVJhbmdlSGlnaFZhbHVlLERldmlhdGlvblJhbmdlSGlnaFZhbHVlXS5cbiAqIEByZXR1cm5zIFJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgTWVzc2FnZVR5cGVcbiAqL1xuZnVuY3Rpb24gbWVzc2FnZVR5cGVGcm9tTWluaW1pemVDYWxjdWxhdGlvbihrcGlWYWx1ZTogbnVtYmVyLCBhVGhyZXNob2xkczogKG51bWJlciB8IHVuZGVmaW5lZCB8IG51bGwpW10pOiBNZXNzYWdlVHlwZSB7XG5cdGxldCBjcml0aWNhbGl0eVByb3BlcnR5OiBNZXNzYWdlVHlwZTtcblxuXHRpZiAoYVRocmVzaG9sZHNbMl0gIT09IHVuZGVmaW5lZCAmJiBhVGhyZXNob2xkc1syXSAhPT0gbnVsbCAmJiBrcGlWYWx1ZSA+IGFUaHJlc2hvbGRzWzJdKSB7XG5cdFx0Y3JpdGljYWxpdHlQcm9wZXJ0eSA9IE1lc3NhZ2VUeXBlLkVycm9yO1xuXHR9IGVsc2UgaWYgKGFUaHJlc2hvbGRzWzFdICE9PSB1bmRlZmluZWQgJiYgYVRocmVzaG9sZHNbMV0gIT09IG51bGwgJiYga3BpVmFsdWUgPiBhVGhyZXNob2xkc1sxXSkge1xuXHRcdGNyaXRpY2FsaXR5UHJvcGVydHkgPSBNZXNzYWdlVHlwZS5XYXJuaW5nO1xuXHR9IGVsc2UgaWYgKGFUaHJlc2hvbGRzWzBdICE9PSB1bmRlZmluZWQgJiYgYVRocmVzaG9sZHNbMF0gIT09IG51bGwgJiYga3BpVmFsdWUgPiBhVGhyZXNob2xkc1swXSkge1xuXHRcdGNyaXRpY2FsaXR5UHJvcGVydHkgPSBNZXNzYWdlVHlwZS5Ob25lO1xuXHR9IGVsc2Uge1xuXHRcdGNyaXRpY2FsaXR5UHJvcGVydHkgPSBNZXNzYWdlVHlwZS5TdWNjZXNzO1xuXHR9XG5cblx0cmV0dXJuIGNyaXRpY2FsaXR5UHJvcGVydHk7XG59XG5cbi8qKlxuICogRnVuY3Rpb24gdG8gZ2V0IGEgbWVzc2FnZSBzdGF0ZSBmcm9tIGEgY2FsY3VsYXRlZCBjcml0aWNhbGl0eSBvZiB0eXBlICdNYXhpbWl6ZScuXG4gKlxuICogQHBhcmFtIGtwaVZhbHVlIFRoZSB2YWx1ZSBvZiB0aGUgS1BJIHRvIGJlIHRlc3RlZCBhZ2FpbnN0LlxuICogQHBhcmFtIGFUaHJlc2hvbGRzIFRocmVzaG9sZHMgdG8gYmUgdXNlZCBbRGV2aWF0aW9uUmFuZ2VMb3dWYWx1ZSxUb2xlcmFuY2VSYW5nZUxvd1ZhbHVlLEFjY2VwdGFuY2VSYW5nZUxvd1ZhbHVlXS5cbiAqIEByZXR1cm5zIFJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgTWVzc2FnZVR5cGVcbiAqL1xuZnVuY3Rpb24gbWVzc2FnZVR5cGVGcm9tTWF4aW1pemVDYWxjdWxhdGlvbihrcGlWYWx1ZTogbnVtYmVyLCBhVGhyZXNob2xkczogKG51bWJlciB8IHVuZGVmaW5lZCB8IG51bGwpW10pOiBNZXNzYWdlVHlwZSB7XG5cdGxldCBjcml0aWNhbGl0eVByb3BlcnR5OiBNZXNzYWdlVHlwZTtcblxuXHRpZiAoYVRocmVzaG9sZHNbMF0gIT09IHVuZGVmaW5lZCAmJiBhVGhyZXNob2xkc1swXSAhPT0gbnVsbCAmJiBrcGlWYWx1ZSA8IGFUaHJlc2hvbGRzWzBdKSB7XG5cdFx0Y3JpdGljYWxpdHlQcm9wZXJ0eSA9IE1lc3NhZ2VUeXBlLkVycm9yO1xuXHR9IGVsc2UgaWYgKGFUaHJlc2hvbGRzWzFdICE9PSB1bmRlZmluZWQgJiYgYVRocmVzaG9sZHNbMV0gIT09IG51bGwgJiYga3BpVmFsdWUgPCBhVGhyZXNob2xkc1sxXSkge1xuXHRcdGNyaXRpY2FsaXR5UHJvcGVydHkgPSBNZXNzYWdlVHlwZS5XYXJuaW5nO1xuXHR9IGVsc2UgaWYgKGFUaHJlc2hvbGRzWzJdICE9PSB1bmRlZmluZWQgJiYgYVRocmVzaG9sZHNbMl0gIT09IG51bGwgJiYga3BpVmFsdWUgPCBhVGhyZXNob2xkc1syXSkge1xuXHRcdGNyaXRpY2FsaXR5UHJvcGVydHkgPSBNZXNzYWdlVHlwZS5Ob25lO1xuXHR9IGVsc2Uge1xuXHRcdGNyaXRpY2FsaXR5UHJvcGVydHkgPSBNZXNzYWdlVHlwZS5TdWNjZXNzO1xuXHR9XG5cblx0cmV0dXJuIGNyaXRpY2FsaXR5UHJvcGVydHk7XG59XG5cbi8qKlxuICogRnVuY3Rpb24gdG8gY2FsY3VsYXRlIGEgRGV2aWF0aW9uSW5kaWNhdG9yIHZhbHVlIGZyb20gYSB0cmVuZCB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0gdHJlbmRWYWx1ZSBUaGUgY3JpdGljYWxpdHkgdmFsdWVzLlxuICogQHJldHVybnMgUmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBEZXZpYXRpb25JbmRpY2F0b3IgdmFsdWVcbiAqL1xuZnVuY3Rpb24gZGV2aWF0aW9uSW5kaWNhdG9yRnJvbVRyZW5kVHlwZSh0cmVuZFZhbHVlOiBudW1iZXIgfCBzdHJpbmcpOiBzdHJpbmcge1xuXHRsZXQgZGV2aWF0aW9uSW5kaWNhdG9yOiBzdHJpbmc7XG5cblx0c3dpdGNoICh0cmVuZFZhbHVlKSB7XG5cdFx0Y2FzZSAxOiAvLyBTdHJvbmdVcFxuXHRcdGNhc2UgXCIxXCI6XG5cdFx0Y2FzZSAyOiAvLyBVcFxuXHRcdGNhc2UgXCIyXCI6XG5cdFx0XHRkZXZpYXRpb25JbmRpY2F0b3IgPSBcIlVwXCI7XG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgNDogLy8gRG93blxuXHRcdGNhc2UgXCI0XCI6XG5cdFx0Y2FzZSA1OiAvLyBTdHJvbmdEb3duXG5cdFx0Y2FzZSBcIjVcIjpcblx0XHRcdGRldmlhdGlvbkluZGljYXRvciA9IFwiRG93blwiO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0ZGV2aWF0aW9uSW5kaWNhdG9yID0gXCJOb25lXCI7XG5cdH1cblxuXHRyZXR1cm4gZGV2aWF0aW9uSW5kaWNhdG9yO1xufVxuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIGNhbGN1bGF0ZSBhIERldmlhdGlvbkluZGljYXRvciBmcm9tIGEgVHJlbmRDYWxjdWxhdGlvbi5cbiAqXG4gKiBAcGFyYW0ga3BpVmFsdWUgVGhlIHZhbHVlIG9mIHRoZSBLUElcbiAqIEBwYXJhbSByZWZlcmVuY2VWYWx1ZSBUaGUgcmVmZXJlbmNlIHZhbHVlIHRvIGNvbXBhcmUgd2l0aFxuICogQHBhcmFtIGlzUmVsYXRpdmUgVHJ1ZSBpcyB0aGUgY29tcGFyaXNvbiBpcyByZWxhdGl2ZVxuICogQHBhcmFtIGFUaHJlc2hvbGRzIEFycmF5IG9mIHRocmVzaG9sZHMgW1N0cm9uZ0Rvd25EaWZmZXJlbmNlLCBEb3duRGlmZmVyZW5jZSwgVXBEaWZmZXJlbmNlLCBTdHJvbmdVcERpZmZlcmVuY2VdXG4gKiBAcmV0dXJucyBSZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIERldmlhdGlvbkluZGljYXRvciB2YWx1ZVxuICovXG5mdW5jdGlvbiBkZXZpYXRpb25JbmRpY2F0b3JGcm9tQ2FsY3VsYXRpb24oXG5cdGtwaVZhbHVlOiBudW1iZXIsXG5cdHJlZmVyZW5jZVZhbHVlOiBudW1iZXIsXG5cdGlzUmVsYXRpdmU6IGJvb2xlYW4sXG5cdGFUaHJlc2hvbGRzOiAobnVtYmVyIHwgdW5kZWZpbmVkIHwgbnVsbClbXSB8IHVuZGVmaW5lZFxuKTogc3RyaW5nIHtcblx0bGV0IGRldmlhdGlvbkluZGljYXRvcjogc3RyaW5nO1xuXG5cdGlmICghYVRocmVzaG9sZHMgfHwgKGlzUmVsYXRpdmUgJiYgIXJlZmVyZW5jZVZhbHVlKSkge1xuXHRcdHJldHVybiBcIk5vbmVcIjtcblx0fVxuXG5cdGNvbnN0IGNvbXBWYWx1ZSA9IGlzUmVsYXRpdmUgPyAoa3BpVmFsdWUgLSByZWZlcmVuY2VWYWx1ZSkgLyByZWZlcmVuY2VWYWx1ZSA6IGtwaVZhbHVlIC0gcmVmZXJlbmNlVmFsdWU7XG5cblx0aWYgKGFUaHJlc2hvbGRzWzBdICE9PSB1bmRlZmluZWQgJiYgYVRocmVzaG9sZHNbMF0gIT09IG51bGwgJiYgY29tcFZhbHVlIDw9IGFUaHJlc2hvbGRzWzBdKSB7XG5cdFx0Ly8gU3Ryb25nRG93biAtLT4gRG93blxuXHRcdGRldmlhdGlvbkluZGljYXRvciA9IFwiRG93blwiO1xuXHR9IGVsc2UgaWYgKGFUaHJlc2hvbGRzWzFdICE9PSB1bmRlZmluZWQgJiYgYVRocmVzaG9sZHNbMV0gIT09IG51bGwgJiYgY29tcFZhbHVlIDw9IGFUaHJlc2hvbGRzWzFdKSB7XG5cdFx0Ly8gRG93biAtLT4gRG93blxuXHRcdGRldmlhdGlvbkluZGljYXRvciA9IFwiRG93blwiO1xuXHR9IGVsc2UgaWYgKGFUaHJlc2hvbGRzWzNdICE9PSB1bmRlZmluZWQgJiYgYVRocmVzaG9sZHNbM10gIT09IG51bGwgJiYgY29tcFZhbHVlID49IGFUaHJlc2hvbGRzWzNdKSB7XG5cdFx0Ly8gU3Ryb25nVXAgLS0+IFVwXG5cdFx0ZGV2aWF0aW9uSW5kaWNhdG9yID0gXCJVcFwiO1xuXHR9IGVsc2UgaWYgKGFUaHJlc2hvbGRzWzJdICE9PSB1bmRlZmluZWQgJiYgYVRocmVzaG9sZHNbMl0gIT09IG51bGwgJiYgY29tcFZhbHVlID49IGFUaHJlc2hvbGRzWzJdKSB7XG5cdFx0Ly8gVXAgLS0+IFVwXG5cdFx0ZGV2aWF0aW9uSW5kaWNhdG9yID0gXCJVcFwiO1xuXHR9IGVsc2Uge1xuXHRcdC8vIFNpZGV3YXlzIC0tPiBOb25lXG5cdFx0ZGV2aWF0aW9uSW5kaWNhdG9yID0gXCJOb25lXCI7XG5cdH1cblxuXHRyZXR1cm4gZGV2aWF0aW9uSW5kaWNhdG9yO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBzYXAudWkubW9kZWwuRmlsdGVyIGZyb20gYSBmaWx0ZXIgZGVmaW5pdGlvbi5cbiAqXG4gKiBAcGFyYW0gZmlsdGVyRGVmaW5pdGlvbiBUaGUgZmlsdGVyIGRlZmluaXRpb25cbiAqIEByZXR1cm5zIFJldHVybnMgYSBzYXAudWkubW9kZWwuRmlsdGVyIGZyb20gdGhlIGRlZmluaXRpb24sIG9yIHVuZGVmaW5lZCBpZiB0aGUgZGVmaW5pdGlvbiBpcyBlbXB0eSAobm8gcmFuZ2VzKVxuICovXG5mdW5jdGlvbiBjcmVhdGVGaWx0ZXJGcm9tRGVmaW5pdGlvbihmaWx0ZXJEZWZpbml0aW9uOiBGaWx0ZXJEZWZpbml0aW9uKTogRmlsdGVyIHwgdW5kZWZpbmVkIHtcblx0aWYgKGZpbHRlckRlZmluaXRpb24ucmFuZ2VzLmxlbmd0aCA9PT0gMCkge1xuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH0gZWxzZSBpZiAoZmlsdGVyRGVmaW5pdGlvbi5yYW5nZXMubGVuZ3RoID09PSAxKSB7XG5cdFx0cmV0dXJuIG5ldyBGaWx0ZXIoXG5cdFx0XHRmaWx0ZXJEZWZpbml0aW9uLnByb3BlcnR5UGF0aCxcblx0XHRcdGZpbHRlckRlZmluaXRpb24ucmFuZ2VzWzBdLm9wZXJhdG9yIGFzIEZpbHRlck9wZXJhdG9yLFxuXHRcdFx0ZmlsdGVyRGVmaW5pdGlvbi5yYW5nZXNbMF0ucmFuZ2VMb3csXG5cdFx0XHRmaWx0ZXJEZWZpbml0aW9uLnJhbmdlc1swXS5yYW5nZUhpZ2hcblx0XHQpO1xuXHR9IGVsc2Uge1xuXHRcdGNvbnN0IGFSYW5nZUZpbHRlcnMgPSBmaWx0ZXJEZWZpbml0aW9uLnJhbmdlcy5tYXAoKHJhbmdlKSA9PiB7XG5cdFx0XHRyZXR1cm4gbmV3IEZpbHRlcihmaWx0ZXJEZWZpbml0aW9uLnByb3BlcnR5UGF0aCwgcmFuZ2Uub3BlcmF0b3IgYXMgRmlsdGVyT3BlcmF0b3IsIHJhbmdlLnJhbmdlTG93LCByYW5nZS5yYW5nZUhpZ2gpO1xuXHRcdH0pO1xuXHRcdHJldHVybiBuZXcgRmlsdGVyKHtcblx0XHRcdGZpbHRlcnM6IGFSYW5nZUZpbHRlcnMsXG5cdFx0XHRhbmQ6IGZhbHNlXG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gZ2V0RmlsdGVyU3RyaW5nRnJvbURlZmluaXRpb24oZmlsdGVyRGVmaW5pdGlvbjogRmlsdGVyRGVmaW5pdGlvbik6IHN0cmluZyB7XG5cdGNvbnN0IGN1cnJlbnRMb2NhbGUgPSBuZXcgTG9jYWxlKHNhcC51aS5nZXRDb3JlKCkuZ2V0Q29uZmlndXJhdGlvbigpLmdldExhbmd1YWdlKCkpO1xuXHRjb25zdCByZXNCdW5kbGUgPSBDb3JlLmdldExpYnJhcnlSZXNvdXJjZUJ1bmRsZShcInNhcC5mZS5jb3JlXCIpO1xuXHRjb25zdCBkYXRlRm9ybWF0ID0gRGF0ZUZvcm1hdC5nZXREYXRlSW5zdGFuY2UoeyBzdHlsZTogXCJtZWRpdW1cIiB9LCBjdXJyZW50TG9jYWxlKTtcblxuXHRmdW5jdGlvbiBmb3JtYXRSYW5nZShyYW5nZTogUmFuZ2VEZWZpbml0aW9uKTogc3RyaW5nIHtcblx0XHRjb25zdCB2YWx1ZUxvdyA9XG5cdFx0XHRmaWx0ZXJEZWZpbml0aW9uLnByb3BlcnR5VHlwZS5pbmRleE9mKFwiRWRtLkRhdGVcIikgPT09IDAgPyBkYXRlRm9ybWF0LmZvcm1hdChuZXcgRGF0ZShyYW5nZS5yYW5nZUxvdykpIDogcmFuZ2UucmFuZ2VMb3c7XG5cdFx0Y29uc3QgdmFsdWVIaWdoID1cblx0XHRcdGZpbHRlckRlZmluaXRpb24ucHJvcGVydHlUeXBlLmluZGV4T2YoXCJFZG0uRGF0ZVwiKSA9PT0gMCA/IGRhdGVGb3JtYXQuZm9ybWF0KG5ldyBEYXRlKHJhbmdlLnJhbmdlSGlnaCkpIDogcmFuZ2UucmFuZ2VIaWdoO1xuXG5cdFx0c3dpdGNoIChyYW5nZS5vcGVyYXRvcikge1xuXHRcdFx0Y2FzZSBcIkJUXCI6XG5cdFx0XHRcdHJldHVybiBgWyR7dmFsdWVMb3d9IC0gJHt2YWx1ZUhpZ2h9XWA7XG5cblx0XHRcdGNhc2UgXCJDb250YWluc1wiOlxuXHRcdFx0XHRyZXR1cm4gYCoke3ZhbHVlTG93fSpgO1xuXG5cdFx0XHRjYXNlIFwiR0VcIjpcblx0XHRcdFx0cmV0dXJuIGBcXHUyMjY1JHt2YWx1ZUxvd31gO1xuXG5cdFx0XHRjYXNlIFwiR1RcIjpcblx0XHRcdFx0cmV0dXJuIGA+JHt2YWx1ZUxvd31gO1xuXG5cdFx0XHRjYXNlIFwiTEVcIjpcblx0XHRcdFx0cmV0dXJuIGBcXHUyMjY0JHt2YWx1ZUxvd31gO1xuXG5cdFx0XHRjYXNlIFwiTFRcIjpcblx0XHRcdFx0cmV0dXJuIGA8JHt2YWx1ZUxvd31gO1xuXG5cdFx0XHRjYXNlIFwiTkJcIjpcblx0XHRcdFx0cmV0dXJuIHJlc0J1bmRsZS5nZXRUZXh0KFwiQ19LUElDQVJEX0ZJTFRFUlNUUklOR19OT1RcIiwgW2BbJHt2YWx1ZUxvd30gLSAke3ZhbHVlSGlnaH1dYF0pO1xuXG5cdFx0XHRjYXNlIFwiTkVcIjpcblx0XHRcdFx0cmV0dXJuIGBcXHUyMjYwJHt2YWx1ZUxvd31gO1xuXG5cdFx0XHRjYXNlIFwiTm90Q29udGFpbnNcIjpcblx0XHRcdFx0cmV0dXJuIHJlc0J1bmRsZS5nZXRUZXh0KFwiQ19LUElDQVJEX0ZJTFRFUlNUUklOR19OT1RcIiwgW2AqJHt2YWx1ZUxvd30qYF0pO1xuXG5cdFx0XHRjYXNlIFwiRVFcIjpcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHJldHVybiB2YWx1ZUxvdztcblx0XHR9XG5cdH1cblx0aWYgKGZpbHRlckRlZmluaXRpb24ucmFuZ2VzLmxlbmd0aCA9PT0gMCkge1xuXHRcdHJldHVybiBcIlwiO1xuXHR9IGVsc2UgaWYgKGZpbHRlckRlZmluaXRpb24ucmFuZ2VzLmxlbmd0aCA9PT0gMSkge1xuXHRcdHJldHVybiBmb3JtYXRSYW5nZShmaWx0ZXJEZWZpbml0aW9uLnJhbmdlc1swXSk7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIGAoJHtmaWx0ZXJEZWZpbml0aW9uLnJhbmdlcy5tYXAoZm9ybWF0UmFuZ2UpLmpvaW4oXCIsXCIpfSlgO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGZvcm1hdENoYXJ0VGl0bGUoa3BpRGVmOiBLUElEZWZpbml0aW9uKTogc3RyaW5nIHtcblx0Y29uc3QgcmVzQnVuZGxlID0gQ29yZS5nZXRMaWJyYXJ5UmVzb3VyY2VCdW5kbGUoXCJzYXAuZmUuY29yZVwiKTtcblxuXHRmdW5jdGlvbiBmb3JtYXRMaXN0KGl0ZW1zOiB7IG5hbWU6IHN0cmluZzsgbGFiZWw6IHN0cmluZyB9W10pIHtcblx0XHRpZiAoaXRlbXMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRyZXR1cm4gXCJcIjtcblx0XHR9IGVsc2UgaWYgKGl0ZW1zLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0cmV0dXJuIGl0ZW1zWzBdLmxhYmVsO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRsZXQgcmVzID0gaXRlbXNbMF0ubGFiZWw7XG5cdFx0XHRmb3IgKGxldCBJID0gMTsgSSA8IGl0ZW1zLmxlbmd0aCAtIDE7IEkrKykge1xuXHRcdFx0XHRyZXMgKz0gYCwgJHtpdGVtc1tJXS5sYWJlbH1gO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmVzQnVuZGxlLmdldFRleHQoXCJDX0tQSUNBUkRfSVRFTVNMSVNUXCIsIFtyZXMsIGl0ZW1zW2l0ZW1zLmxlbmd0aCAtIDFdLmxhYmVsXSk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHJlc0J1bmRsZS5nZXRUZXh0KFwiQ19LUElDQVJEX0NIQVJUVElUTEVcIiwgW2Zvcm1hdExpc3Qoa3BpRGVmLmNoYXJ0Lm1lYXN1cmVzKSwgZm9ybWF0TGlzdChrcGlEZWYuY2hhcnQuZGltZW5zaW9ucyldKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlQ2hhcnRMYWJlbFNldHRpbmdzKGNoYXJ0RGVmaW5pdGlvbjogS1BJQ2hhcnREZWZpbml0aW9uLCBvQ2hhcnRQcm9wZXJ0aWVzOiBhbnkpOiB2b2lkIHtcblx0c3dpdGNoIChjaGFydERlZmluaXRpb24uY2hhcnRUeXBlKSB7XG5cdFx0Y2FzZSBcIkRvbnV0XCI6XG5cdFx0XHQvLyBTaG93IGRhdGEgbGFiZWxzLCBkbyBub3Qgc2hvdyBheGlzIHRpdGxlc1xuXHRcdFx0b0NoYXJ0UHJvcGVydGllcy5jYXRlZ29yeUF4aXMgPSB7XG5cdFx0XHRcdHRpdGxlOiB7XG5cdFx0XHRcdFx0dmlzaWJsZTogZmFsc2Vcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdG9DaGFydFByb3BlcnRpZXMudmFsdWVBeGlzID0ge1xuXHRcdFx0XHR0aXRsZToge1xuXHRcdFx0XHRcdHZpc2libGU6IGZhbHNlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGxhYmVsOiB7XG5cdFx0XHRcdFx0Zm9ybWF0U3RyaW5nOiBcIlNob3J0RmxvYXRcIlxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0b0NoYXJ0UHJvcGVydGllcy5wbG90QXJlYS5kYXRhTGFiZWwgPSB7XG5cdFx0XHRcdHZpc2libGU6IHRydWUsXG5cdFx0XHRcdHR5cGU6IFwidmFsdWVcIixcblx0XHRcdFx0Zm9ybWF0U3RyaW5nOiBcIlNob3J0RmxvYXRfTUZEMlwiXG5cdFx0XHR9O1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFwiYnViYmxlXCI6XG5cdFx0XHQvLyBTaG93IGF4aXMgdGl0bGUsIGJ1YmJsZSBzaXplIGxlZ2VuZCwgZG8gbm90IHNob3cgZGF0YSBsYWJlbHNcblx0XHRcdG9DaGFydFByb3BlcnRpZXMudmFsdWVBeGlzID0ge1xuXHRcdFx0XHR0aXRsZToge1xuXHRcdFx0XHRcdHZpc2libGU6IHRydWVcblx0XHRcdFx0fSxcblx0XHRcdFx0bGFiZWw6IHtcblx0XHRcdFx0XHRmb3JtYXRTdHJpbmc6IFwiU2hvcnRGbG9hdFwiXG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHRvQ2hhcnRQcm9wZXJ0aWVzLnZhbHVlQXhpczIgPSB7XG5cdFx0XHRcdHRpdGxlOiB7XG5cdFx0XHRcdFx0dmlzaWJsZTogdHJ1ZVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRsYWJlbDoge1xuXHRcdFx0XHRcdGZvcm1hdFN0cmluZzogXCJTaG9ydEZsb2F0XCJcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdG9DaGFydFByb3BlcnRpZXMubGVnZW5kR3JvdXAgPSB7XG5cdFx0XHRcdGxheW91dDoge1xuXHRcdFx0XHRcdHBvc2l0aW9uOiBcImJvdHRvbVwiLFxuXHRcdFx0XHRcdGFsaWdubWVudDogXCJ0b3BMZWZ0XCJcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdG9DaGFydFByb3BlcnRpZXMuc2l6ZUxlZ2VuZCA9IHtcblx0XHRcdFx0dmlzaWJsZTogdHJ1ZVxuXHRcdFx0fTtcblx0XHRcdG9DaGFydFByb3BlcnRpZXMucGxvdEFyZWEuZGF0YUxhYmVsID0geyB2aXNpYmxlOiBmYWxzZSB9O1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFwic2NhdHRlclwiOlxuXHRcdFx0Ly8gRG8gbm90IHNob3cgZGF0YSBsYWJlbHMgYW5kIGF4aXMgdGl0bGVzXG5cdFx0XHRvQ2hhcnRQcm9wZXJ0aWVzLnZhbHVlQXhpcyA9IHtcblx0XHRcdFx0dGl0bGU6IHtcblx0XHRcdFx0XHR2aXNpYmxlOiBmYWxzZVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRsYWJlbDoge1xuXHRcdFx0XHRcdGZvcm1hdFN0cmluZzogXCJTaG9ydEZsb2F0XCJcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdG9DaGFydFByb3BlcnRpZXMudmFsdWVBeGlzMiA9IHtcblx0XHRcdFx0dGl0bGU6IHtcblx0XHRcdFx0XHR2aXNpYmxlOiBmYWxzZVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRsYWJlbDoge1xuXHRcdFx0XHRcdGZvcm1hdFN0cmluZzogXCJTaG9ydEZsb2F0XCJcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdG9DaGFydFByb3BlcnRpZXMucGxvdEFyZWEuZGF0YUxhYmVsID0geyB2aXNpYmxlOiBmYWxzZSB9O1xuXHRcdFx0YnJlYWs7XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0Ly8gRG8gbm90IHNob3cgZGF0YSBsYWJlbHMgYW5kIGF4aXMgdGl0bGVzXG5cdFx0XHRvQ2hhcnRQcm9wZXJ0aWVzLmNhdGVnb3J5QXhpcyA9IHtcblx0XHRcdFx0dGl0bGU6IHtcblx0XHRcdFx0XHR2aXNpYmxlOiBmYWxzZVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0b0NoYXJ0UHJvcGVydGllcy52YWx1ZUF4aXMgPSB7XG5cdFx0XHRcdHRpdGxlOiB7XG5cdFx0XHRcdFx0dmlzaWJsZTogZmFsc2Vcblx0XHRcdFx0fSxcblx0XHRcdFx0bGFiZWw6IHtcblx0XHRcdFx0XHRmb3JtYXRTdHJpbmc6IFwiU2hvcnRGbG9hdFwiXG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHRvQ2hhcnRQcm9wZXJ0aWVzLnBsb3RBcmVhLmRhdGFMYWJlbCA9IHsgdmlzaWJsZTogZmFsc2UgfTtcblx0fVxufVxuZnVuY3Rpb24gZmlsdGVyTWFwKGFPYmplY3RzOiB7IG5hbWU6IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgcm9sZT86IHN0cmluZyB9W10sIGFSb2xlcz86IChzdHJpbmcgfCB1bmRlZmluZWQpW10pOiBzdHJpbmdbXSB7XG5cdGlmIChhUm9sZXMgJiYgYVJvbGVzLmxlbmd0aCkge1xuXHRcdHJldHVybiBhT2JqZWN0c1xuXHRcdFx0LmZpbHRlcigoZGltZW5zaW9uKSA9PiB7XG5cdFx0XHRcdHJldHVybiBhUm9sZXMuaW5kZXhPZihkaW1lbnNpb24ucm9sZSkgPj0gMDtcblx0XHRcdH0pXG5cdFx0XHQubWFwKChkaW1lbnNpb24pID0+IHtcblx0XHRcdFx0cmV0dXJuIGRpbWVuc2lvbi5sYWJlbDtcblx0XHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBhT2JqZWN0cy5tYXAoKGRpbWVuc2lvbikgPT4ge1xuXHRcdFx0cmV0dXJuIGRpbWVuc2lvbi5sYWJlbDtcblx0XHR9KTtcblx0fVxufVxuXG5mdW5jdGlvbiBnZXRTY2F0dGVyQnViYmxlQ2hhcnRGZWVkcyhjaGFydERlZmluaXRpb246IEtQSUNoYXJ0RGVmaW5pdGlvbik6IHsgdWlkOiBzdHJpbmc7IHR5cGU6IHN0cmluZzsgdmFsdWVzOiBzdHJpbmdbXSB9W10ge1xuXHRjb25zdCBheGlzMU1lYXN1cmVzID0gZmlsdGVyTWFwKGNoYXJ0RGVmaW5pdGlvbi5tZWFzdXJlcywgW1wiQXhpczFcIl0pO1xuXHRjb25zdCBheGlzMk1lYXN1cmVzID0gZmlsdGVyTWFwKGNoYXJ0RGVmaW5pdGlvbi5tZWFzdXJlcywgW1wiQXhpczJcIl0pO1xuXHRjb25zdCBheGlzM01lYXN1cmVzID0gZmlsdGVyTWFwKGNoYXJ0RGVmaW5pdGlvbi5tZWFzdXJlcywgW1wiQXhpczNcIl0pO1xuXHRjb25zdCBvdGhlck1lYXN1cmVzID0gZmlsdGVyTWFwKGNoYXJ0RGVmaW5pdGlvbi5tZWFzdXJlcywgW3VuZGVmaW5lZF0pO1xuXHRjb25zdCBzZXJpZXNEaW1lbnNpb25zID0gZmlsdGVyTWFwKGNoYXJ0RGVmaW5pdGlvbi5kaW1lbnNpb25zLCBbXCJTZXJpZXNcIl0pO1xuXG5cdC8vIEdldCB0aGUgZmlyc3QgZGltZW5zaW9uIHdpdGggcm9sZSBcIkNhdGVnb3J5XCIgZm9yIHRoZSBzaGFwZVxuXHRjb25zdCBzaGFwZURpbWVuc2lvbiA9IGNoYXJ0RGVmaW5pdGlvbi5kaW1lbnNpb25zLmZpbmQoKGRpbWVuc2lvbikgPT4ge1xuXHRcdHJldHVybiBkaW1lbnNpb24ucm9sZSA9PT0gXCJDYXRlZ29yeVwiO1xuXHR9KTtcblxuXHQvLyBNZWFzdXJlIGZvciB0aGUgeC1BeGlzIDogZmlyc3QgbWVhc3VyZSBmb3IgQXhpczEsIG9yIGZvciBBeGlzMiBpZiBub3QgZm91bmQsIG9yIGZvciBBeGlzMyBpZiBub3QgZm91bmRcblx0Y29uc3QgeE1lYXN1cmUgPSBheGlzMU1lYXN1cmVzLnNoaWZ0KCkgfHwgYXhpczJNZWFzdXJlcy5zaGlmdCgpIHx8IGF4aXMzTWVhc3VyZXMuc2hpZnQoKSB8fCBvdGhlck1lYXN1cmVzLnNoaWZ0KCkgfHwgXCJcIjtcblx0Ly8gTWVhc3VyZSBmb3IgdGhlIHktQXhpcyA6IGZpcnN0IG1lYXN1cmUgZm9yIEF4aXMyLCBvciBzZWNvbmQgbWVhc3VyZSBmb3IgQXhpczEgaWYgbm90IGZvdW5kLCBvciBmaXJzdCBtZWFzdXJlIGZvciBBeGlzMyBpZiBub3QgZm91bmRcblx0Y29uc3QgeU1lYXN1cmUgPSBheGlzMk1lYXN1cmVzLnNoaWZ0KCkgfHwgYXhpczFNZWFzdXJlcy5zaGlmdCgpIHx8IGF4aXMzTWVhc3VyZXMuc2hpZnQoKSB8fCBvdGhlck1lYXN1cmVzLnNoaWZ0KCkgfHwgXCJcIjtcblx0Y29uc3QgcmVzID0gW1xuXHRcdHtcblx0XHRcdFwidWlkXCI6IFwidmFsdWVBeGlzXCIsXG5cdFx0XHRcInR5cGVcIjogXCJNZWFzdXJlXCIsXG5cdFx0XHRcInZhbHVlc1wiOiBbeE1lYXN1cmVdXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRcInVpZFwiOiBcInZhbHVlQXhpczJcIixcblx0XHRcdFwidHlwZVwiOiBcIk1lYXN1cmVcIixcblx0XHRcdFwidmFsdWVzXCI6IFt5TWVhc3VyZV1cblx0XHR9XG5cdF07XG5cblx0aWYgKGNoYXJ0RGVmaW5pdGlvbi5jaGFydFR5cGUgPT09IFwiYnViYmxlXCIpIHtcblx0XHQvLyBNZWFzdXJlIGZvciB0aGUgc2l6ZSBvZiB0aGUgYnViYmxlOiBmaXJzdCBtZWFzdXJlIGZvciBBeGlzMywgb3IgcmVtYWluaW5nIG1lYXN1cmUgZm9yIEF4aXMxL0F4aXMyIGlmIG5vdCBmb3VuZFxuXHRcdGNvbnN0IHNpemVNZWFzdXJlID0gYXhpczNNZWFzdXJlcy5zaGlmdCgpIHx8IGF4aXMxTWVhc3VyZXMuc2hpZnQoKSB8fCBheGlzMk1lYXN1cmVzLnNoaWZ0KCkgfHwgb3RoZXJNZWFzdXJlcy5zaGlmdCgpIHx8IFwiXCI7XG5cdFx0cmVzLnB1c2goe1xuXHRcdFx0XCJ1aWRcIjogXCJidWJibGVXaWR0aFwiLFxuXHRcdFx0XCJ0eXBlXCI6IFwiTWVhc3VyZVwiLFxuXHRcdFx0XCJ2YWx1ZXNcIjogW3NpemVNZWFzdXJlXVxuXHRcdH0pO1xuXHR9XG5cblx0Ly8gQ29sb3IgKG9wdGlvbmFsKVxuXHRpZiAoc2VyaWVzRGltZW5zaW9ucy5sZW5ndGgpIHtcblx0XHRyZXMucHVzaCh7XG5cdFx0XHRcInVpZFwiOiBcImNvbG9yXCIsXG5cdFx0XHRcInR5cGVcIjogXCJEaW1lbnNpb25cIixcblx0XHRcdFwidmFsdWVzXCI6IHNlcmllc0RpbWVuc2lvbnNcblx0XHR9KTtcblx0fVxuXHQvLyBTaGFwZSAob3B0aW9uYWwpXG5cdGlmIChzaGFwZURpbWVuc2lvbikge1xuXHRcdHJlcy5wdXNoKHtcblx0XHRcdFwidWlkXCI6IFwic2hhcGVcIixcblx0XHRcdFwidHlwZVwiOiBcIkRpbWVuc2lvblwiLFxuXHRcdFx0XCJ2YWx1ZXNcIjogW3NoYXBlRGltZW5zaW9uLmxhYmVsXVxuXHRcdH0pO1xuXHR9XG5cdHJldHVybiByZXM7XG59XG5cbmZ1bmN0aW9uIGdldENoYXJ0RmVlZHMoY2hhcnREZWZpbml0aW9uOiBLUElDaGFydERlZmluaXRpb24pOiB7IHVpZDogc3RyaW5nOyB0eXBlOiBzdHJpbmc7IHZhbHVlczogc3RyaW5nW10gfVtdIHtcblx0bGV0IHJlczogeyB1aWQ6IHN0cmluZzsgdHlwZTogc3RyaW5nOyB2YWx1ZXM6IHN0cmluZ1tdIH1bXTtcblxuXHRzd2l0Y2ggKGNoYXJ0RGVmaW5pdGlvbi5jaGFydFR5cGUpIHtcblx0XHRjYXNlIFwiRG9udXRcIjpcblx0XHRcdHJlcyA9IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdFwidWlkXCI6IFwic2l6ZVwiLFxuXHRcdFx0XHRcdFwidHlwZVwiOiBcIk1lYXN1cmVcIixcblx0XHRcdFx0XHRcInZhbHVlc1wiOiBmaWx0ZXJNYXAoY2hhcnREZWZpbml0aW9uLm1lYXN1cmVzKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0XCJ1aWRcIjogXCJjb2xvclwiLFxuXHRcdFx0XHRcdFwidHlwZVwiOiBcIkRpbWVuc2lvblwiLFxuXHRcdFx0XHRcdFwidmFsdWVzXCI6IGZpbHRlck1hcChjaGFydERlZmluaXRpb24uZGltZW5zaW9ucylcblx0XHRcdFx0fVxuXHRcdFx0XTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBcImJ1YmJsZVwiOlxuXHRcdGNhc2UgXCJzY2F0dGVyXCI6XG5cdFx0XHRyZXMgPSBnZXRTY2F0dGVyQnViYmxlQ2hhcnRGZWVkcyhjaGFydERlZmluaXRpb24pO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFwidmVydGljYWxfYnVsbGV0XCI6XG5cdFx0XHRyZXMgPSBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRcInVpZFwiOiBcImFjdHVhbFZhbHVlc1wiLFxuXHRcdFx0XHRcdFwidHlwZVwiOiBcIk1lYXN1cmVcIixcblx0XHRcdFx0XHRcInZhbHVlc1wiOiBmaWx0ZXJNYXAoY2hhcnREZWZpbml0aW9uLm1lYXN1cmVzLCBbdW5kZWZpbmVkLCBcIkF4aXMxXCJdKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0XCJ1aWRcIjogXCJ0YXJnZXRWYWx1ZXNcIixcblx0XHRcdFx0XHRcInR5cGVcIjogXCJNZWFzdXJlXCIsXG5cdFx0XHRcdFx0XCJ2YWx1ZXNcIjogZmlsdGVyTWFwKGNoYXJ0RGVmaW5pdGlvbi5tZWFzdXJlcywgW1wiQXhpczJcIl0pXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRcInVpZFwiOiBcImNhdGVnb3J5QXhpc1wiLFxuXHRcdFx0XHRcdFwidHlwZVwiOiBcIkRpbWVuc2lvblwiLFxuXHRcdFx0XHRcdFwidmFsdWVzXCI6IGZpbHRlck1hcChjaGFydERlZmluaXRpb24uZGltZW5zaW9ucywgW3VuZGVmaW5lZCwgXCJDYXRlZ29yeVwiXSlcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdFwidWlkXCI6IFwiY29sb3JcIixcblx0XHRcdFx0XHRcInR5cGVcIjogXCJEaW1lbnNpb25cIixcblx0XHRcdFx0XHRcInZhbHVlc1wiOiBmaWx0ZXJNYXAoY2hhcnREZWZpbml0aW9uLmRpbWVuc2lvbnMsIFtcIlNlcmllc1wiXSlcblx0XHRcdFx0fVxuXHRcdFx0XTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0ZGVmYXVsdDpcblx0XHRcdHJlcyA9IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdFwidWlkXCI6IFwidmFsdWVBeGlzXCIsXG5cdFx0XHRcdFx0XCJ0eXBlXCI6IFwiTWVhc3VyZVwiLFxuXHRcdFx0XHRcdFwidmFsdWVzXCI6IGZpbHRlck1hcChjaGFydERlZmluaXRpb24ubWVhc3VyZXMpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRcInVpZFwiOiBcImNhdGVnb3J5QXhpc1wiLFxuXHRcdFx0XHRcdFwidHlwZVwiOiBcIkRpbWVuc2lvblwiLFxuXHRcdFx0XHRcdFwidmFsdWVzXCI6IGZpbHRlck1hcChjaGFydERlZmluaXRpb24uZGltZW5zaW9ucywgW3VuZGVmaW5lZCwgXCJDYXRlZ29yeVwiXSlcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdFwidWlkXCI6IFwiY29sb3JcIixcblx0XHRcdFx0XHRcInR5cGVcIjogXCJEaW1lbnNpb25cIixcblx0XHRcdFx0XHRcInZhbHVlc1wiOiBmaWx0ZXJNYXAoY2hhcnREZWZpbml0aW9uLmRpbWVuc2lvbnMsIFtcIlNlcmllc1wiXSlcblx0XHRcdFx0fVxuXHRcdFx0XTtcblx0fVxuXG5cdHJldHVybiByZXM7XG59XG5cbmZ1bmN0aW9uIGdldE5hdmlnYXRpb25QYXJhbWV0ZXJzKFxuXHRuYXZJbmZvOiBOYXZpZ2F0aW9uSW5mbyxcblx0b1NoZWxsU2VydmljZTogYW55XG4pOiBQcm9taXNlPHsgc2VtYW50aWNPYmplY3Q/OiBzdHJpbmc7IGFjdGlvbj86IHN0cmluZzsgb3V0Ym91bmQ/OiBzdHJpbmcgfSB8IHVuZGVmaW5lZD4ge1xuXHRpZiAobmF2SW5mby5zZW1hbnRpY09iamVjdCkge1xuXHRcdGlmIChuYXZJbmZvLmFjdGlvbikge1xuXHRcdFx0Ly8gQWN0aW9uIGlzIGFscmVhZHkgc3BlY2lmaWVkOiBjaGVjayBpZiBpdCdzIGF2YWlsYWJsZSBpbiB0aGUgc2hlbGxcblx0XHRcdHJldHVybiBvU2hlbGxTZXJ2aWNlLmdldExpbmtzKHsgc2VtYW50aWNPYmplY3Q6IG5hdkluZm8uc2VtYW50aWNPYmplY3QsIGFjdGlvbjogbmF2SW5mby5hY3Rpb24gfSkudGhlbigoYUxpbmtzOiBhbnlbXSkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gYUxpbmtzLmxlbmd0aCA/IHsgc2VtYW50aWNPYmplY3Q6IG5hdkluZm8uc2VtYW50aWNPYmplY3QsIGFjdGlvbjogbmF2SW5mby5hY3Rpb24gfSA6IHVuZGVmaW5lZDtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBXZSBnZXQgdGhlIHByaW1hcnkgaW50ZW50IGZyb20gdGhlIHNoZWxsXG5cdFx0XHRyZXR1cm4gb1NoZWxsU2VydmljZS5nZXRQcmltYXJ5SW50ZW50KG5hdkluZm8uc2VtYW50aWNPYmplY3QpLnRoZW4oKG9MaW5rOiBhbnkpID0+IHtcblx0XHRcdFx0aWYgKCFvTGluaykge1xuXHRcdFx0XHRcdC8vIE5vIHByaW1hcnkgaW50ZW50Li4uXG5cdFx0XHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIENoZWNrIHRoYXQgdGhlIHByaW1hcnkgaW50ZW50IGlzIG5vdCBwYXJ0IG9mIHRoZSB1bmF2YWlsYWJsZSBhY3Rpb25zXG5cdFx0XHRcdGNvbnN0IG9JbmZvID0gb1NoZWxsU2VydmljZS5wYXJzZVNoZWxsSGFzaChvTGluay5pbnRlbnQpO1xuXHRcdFx0XHRyZXR1cm4gbmF2SW5mby51bmF2YWlsYWJsZUFjdGlvbnMgJiYgbmF2SW5mby51bmF2YWlsYWJsZUFjdGlvbnMuaW5kZXhPZihvSW5mby5hY3Rpb24pID49IDBcblx0XHRcdFx0XHQ/IHVuZGVmaW5lZFxuXHRcdFx0XHRcdDogeyBzZW1hbnRpY09iamVjdDogb0luZm8uc2VtYW50aWNPYmplY3QsIGFjdGlvbjogb0luZm8uYWN0aW9uIH07XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0Ly8gT3V0Ym91bmQgbmF2aWdhdGlvbiBzcGVjaWZpZWQgaW4gdGhlIG1hbmlmZXN0XG5cdFx0cmV0dXJuIG5hdkluZm8ub3V0Ym91bmROYXZpZ2F0aW9uID8gUHJvbWlzZS5yZXNvbHZlKHsgb3V0Ym91bmQ6IG5hdkluZm8ub3V0Ym91bmROYXZpZ2F0aW9uIH0pIDogUHJvbWlzZS5yZXNvbHZlKHVuZGVmaW5lZCk7XG5cdH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgQSBjb250cm9sbGVyIGV4dGVuc2lvbiBmb3IgbWFuYWdpbmcgdGhlIEtQSXMgaW4gYW4gYW5hbHl0aWNhbCBsaXN0IHBhZ2VcbiAqIEBuYW1lIHNhcC5mZS5jb3JlLmNvbnRyb2xsZXJleHRlbnNpb25zLktQSU1hbmFnZW1lbnRcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqIEBwcml2YXRlXG4gKiBAc2luY2UgMS45My4wXG4gKi9cbkBkZWZpbmVVSTVDbGFzcyhcInNhcC5mZS5jb3JlLmNvbnRyb2xsZXJleHRlbnNpb25zLktQSU1hbmFnZW1lbnRcIilcbmNsYXNzIEtQSU1hbmFnZW1lbnRDb250cm9sbGVyRXh0ZW5zaW9uIGV4dGVuZHMgQ29udHJvbGxlckV4dGVuc2lvbiB7XG5cdHByb3RlY3RlZCBhS1BJRGVmaW5pdGlvbnM/OiBLUElEZWZpbml0aW9uW107XG5cdHByb3RlY3RlZCBvQ2FyZDogYW55O1xuXHRwcm90ZWN0ZWQgb1BvcG92ZXIhOiBQb3BvdmVyO1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIHRoZSBjYXJkIG1hbmlmZXN0IGZvciBhIEtQSSBkZWZpbml0aW9uIGFuZCBzdG9yZXMgaXQgaW4gYSBKU09OIG1vZGVsLlxuXHQgKlxuXHQgKiBAcGFyYW0ga3BpRGVmaW5pdGlvbiBUaGUgS1BJIGRlZmluaXRpb25cblx0ICogQHBhcmFtIG9LUElNb2RlbCBUaGUgSlNPTiBtb2RlbCBpbiB3aGljaCB0aGUgbWFuaWZlc3Qgd2lsbCBiZSBzdG9yZWRcblx0ICovXG5cdHByb3RlY3RlZCBpbml0Q2FyZE1hbmlmZXN0KGtwaURlZmluaXRpb246IEtQSURlZmluaXRpb24sIG9LUElNb2RlbDogSlNPTk1vZGVsKTogdm9pZCB7XG5cdFx0Y29uc3Qgb0NhcmRNYW5pZmVzdDogYW55ID0ge1xuXHRcdFx0XCJzYXAuYXBwXCI6IHtcblx0XHRcdFx0aWQ6IFwic2FwLmZlXCIsXG5cdFx0XHRcdHR5cGU6IFwiY2FyZFwiXG5cdFx0XHR9LFxuXHRcdFx0XCJzYXAudWlcIjoge1xuXHRcdFx0XHR0ZWNobm9sb2d5OiBcIlVJNVwiXG5cdFx0XHR9LFxuXHRcdFx0XCJzYXAuY2FyZFwiOiB7XG5cdFx0XHRcdHR5cGU6IFwiQW5hbHl0aWNhbFwiLFxuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0anNvbjoge31cblx0XHRcdFx0fSxcblx0XHRcdFx0aGVhZGVyOiB7XG5cdFx0XHRcdFx0dHlwZTogXCJOdW1lcmljXCIsXG5cdFx0XHRcdFx0dGl0bGU6IGtwaURlZmluaXRpb24uZGF0YXBvaW50LnRpdGxlLFxuXHRcdFx0XHRcdHN1YlRpdGxlOiBrcGlEZWZpbml0aW9uLmRhdGFwb2ludC5kZXNjcmlwdGlvbixcblx0XHRcdFx0XHR1bml0T2ZNZWFzdXJlbWVudDogXCJ7bWFpblVuaXR9XCIsXG5cdFx0XHRcdFx0bWFpbkluZGljYXRvcjoge1xuXHRcdFx0XHRcdFx0bnVtYmVyOiBcInttYWluVmFsdWVOb1NjYWxlfVwiLFxuXHRcdFx0XHRcdFx0dW5pdDogXCJ7bWFpblZhbHVlU2NhbGV9XCIsXG5cdFx0XHRcdFx0XHRzdGF0ZTogXCJ7bWFpblN0YXRlfVwiLFxuXHRcdFx0XHRcdFx0dHJlbmQ6IFwie3RyZW5kfVwiXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb250ZW50OiB7XG5cdFx0XHRcdFx0bWluSGVpZ2h0OiBcIjI1cmVtXCIsXG5cdFx0XHRcdFx0Y2hhcnRQcm9wZXJ0aWVzOiB7XG5cdFx0XHRcdFx0XHRwbG90QXJlYToge30sXG5cdFx0XHRcdFx0XHR0aXRsZToge1xuXHRcdFx0XHRcdFx0XHR2aXNpYmxlOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRhbGlnbm1lbnQ6IFwibGVmdFwiXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0XHRwYXRoOiBcIi9jaGFydERhdGFcIlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHQvLyBBZGQgc2lkZSBpbmRpY2F0b3JzIGluIHRoZSBjYXJkIGhlYWRlciBpZiBhIHRhcmdldCBpcyBkZWZpbmVkIGZvciB0aGUgS1BJXG5cdFx0aWYgKGtwaURlZmluaXRpb24uZGF0YXBvaW50LnRhcmdldFBhdGggfHwga3BpRGVmaW5pdGlvbi5kYXRhcG9pbnQudGFyZ2V0VmFsdWUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29uc3QgcmVzQnVuZGxlID0gQ29yZS5nZXRMaWJyYXJ5UmVzb3VyY2VCdW5kbGUoXCJzYXAuZmUuY29yZVwiKTtcblx0XHRcdG9DYXJkTWFuaWZlc3RbXCJzYXAuY2FyZFwiXS5oZWFkZXIuc2lkZUluZGljYXRvcnMgPSBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0aXRsZTogcmVzQnVuZGxlLmdldFRleHQoXCJDX0tQSUNBUkRfSU5ESUNBVE9SX1RBUkdFVFwiKSxcblx0XHRcdFx0XHRudW1iZXI6IFwie3RhcmdldE51bWJlcn1cIixcblx0XHRcdFx0XHR1bml0OiBcInt0YXJnZXRVbml0fVwiXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0aXRsZTogcmVzQnVuZGxlLmdldFRleHQoXCJDX0tQSUNBUkRfSU5ESUNBVE9SX0RFVklBVElPTlwiKSxcblx0XHRcdFx0XHRudW1iZXI6IFwie2RldmlhdGlvbk51bWJlcn1cIixcblx0XHRcdFx0XHR1bml0OiBcIiVcIlxuXHRcdFx0XHR9XG5cdFx0XHRdO1xuXHRcdH1cblxuXHRcdC8vIERldGFpbHMgb2YgdGhlIGNhcmQ6IGZpbHRlciBkZXNjcmlwdGlvbnNcblx0XHRpZiAoa3BpRGVmaW5pdGlvbi5zZWxlY3Rpb25WYXJpYW50RmlsdGVyRGVmaW5pdGlvbnM/Lmxlbmd0aCkge1xuXHRcdFx0Y29uc3QgYURlc2NyaXB0aW9uczogc3RyaW5nW10gPSBbXTtcblx0XHRcdGtwaURlZmluaXRpb24uc2VsZWN0aW9uVmFyaWFudEZpbHRlckRlZmluaXRpb25zLmZvckVhY2goKGZpbHRlckRlZmluaXRpb24pID0+IHtcblx0XHRcdFx0Y29uc3QgZGVzYyA9IGdldEZpbHRlclN0cmluZ0Zyb21EZWZpbml0aW9uKGZpbHRlckRlZmluaXRpb24pO1xuXHRcdFx0XHRpZiAoZGVzYykge1xuXHRcdFx0XHRcdGFEZXNjcmlwdGlvbnMucHVzaChkZXNjKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdGlmIChhRGVzY3JpcHRpb25zLmxlbmd0aCkge1xuXHRcdFx0XHRvQ2FyZE1hbmlmZXN0W1wic2FwLmNhcmRcIl0uaGVhZGVyLmRldGFpbHMgPSBhRGVzY3JpcHRpb25zLmpvaW4oXCIsIFwiKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBDaGFydCBzZXR0aW5nczogdHlwZSwgdGl0bGUsIGRpbWVuc2lvbnMgYW5kIG1lYXN1cmVzIGluIHRoZSBtYW5pZmVzdFxuXHRcdG9DYXJkTWFuaWZlc3RbXCJzYXAuY2FyZFwiXS5jb250ZW50LmNoYXJ0VHlwZSA9IGtwaURlZmluaXRpb24uY2hhcnQuY2hhcnRUeXBlO1xuXHRcdHVwZGF0ZUNoYXJ0TGFiZWxTZXR0aW5ncyhrcGlEZWZpbml0aW9uLmNoYXJ0LCBvQ2FyZE1hbmlmZXN0W1wic2FwLmNhcmRcIl0uY29udGVudC5jaGFydFByb3BlcnRpZXMpO1xuXHRcdG9DYXJkTWFuaWZlc3RbXCJzYXAuY2FyZFwiXS5jb250ZW50LmNoYXJ0UHJvcGVydGllcy50aXRsZS50ZXh0ID0gZm9ybWF0Q2hhcnRUaXRsZShrcGlEZWZpbml0aW9uKTtcblx0XHRvQ2FyZE1hbmlmZXN0W1wic2FwLmNhcmRcIl0uY29udGVudC5kaW1lbnNpb25zID0ga3BpRGVmaW5pdGlvbi5jaGFydC5kaW1lbnNpb25zLm1hcCgoZGltZW5zaW9uKSA9PiB7XG5cdFx0XHRyZXR1cm4geyBsYWJlbDogZGltZW5zaW9uLmxhYmVsLCB2YWx1ZTogYHske2RpbWVuc2lvbi5uYW1lfX1gIH07XG5cdFx0fSk7XG5cdFx0b0NhcmRNYW5pZmVzdFtcInNhcC5jYXJkXCJdLmNvbnRlbnQubWVhc3VyZXMgPSBrcGlEZWZpbml0aW9uLmNoYXJ0Lm1lYXN1cmVzLm1hcCgobWVhc3VyZSkgPT4ge1xuXHRcdFx0cmV0dXJuIHsgbGFiZWw6IG1lYXN1cmUubGFiZWwsIHZhbHVlOiBgeyR7bWVhc3VyZS5uYW1lfX1gIH07XG5cdFx0fSk7XG5cdFx0b0NhcmRNYW5pZmVzdFtcInNhcC5jYXJkXCJdLmNvbnRlbnQuZmVlZHMgPSBnZXRDaGFydEZlZWRzKGtwaURlZmluaXRpb24uY2hhcnQpO1xuXG5cdFx0b0tQSU1vZGVsLnNldFByb3BlcnR5KGAvJHtrcGlEZWZpbml0aW9uLmlkfWAsIHtcblx0XHRcdG1hbmlmZXN0OiBvQ2FyZE1hbmlmZXN0XG5cdFx0fSk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgaW5pdE5hdmlnYXRpb25JbmZvKGtwaURlZmluaXRpb246IEtQSURlZmluaXRpb24sIG9LUElNb2RlbDogSlNPTk1vZGVsLCBvU2hlbGxTZXJ2aWNlOiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHQvLyBBZGQgbmF2aWdhdGlvblxuXHRcdGlmIChrcGlEZWZpbml0aW9uLm5hdmlnYXRpb24pIHtcblx0XHRcdHJldHVybiBnZXROYXZpZ2F0aW9uUGFyYW1ldGVycyhrcGlEZWZpbml0aW9uLm5hdmlnYXRpb24sIG9TaGVsbFNlcnZpY2UpLnRoZW4oKG9OYXZJbmZvKSA9PiB7XG5cdFx0XHRcdGlmIChvTmF2SW5mbykge1xuXHRcdFx0XHRcdG9LUElNb2RlbC5zZXRQcm9wZXJ0eShgLyR7a3BpRGVmaW5pdGlvbi5pZH0vbWFuaWZlc3Qvc2FwLmNhcmQvaGVhZGVyL2FjdGlvbnNgLCBbXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiTmF2aWdhdGlvblwiLFxuXHRcdFx0XHRcdFx0XHRwYXJhbWV0ZXJzOiBvTmF2SW5mb1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdF0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXHRcdH1cblx0fVxuXG5cdEBtZXRob2RPdmVycmlkZSgpXG5cdHB1YmxpYyBvbkluaXQoKTogdm9pZCB7XG5cdFx0dGhpcy5hS1BJRGVmaW5pdGlvbnMgPSAodGhpcy5nZXRWaWV3KCkuZ2V0Q29udHJvbGxlcigpIGFzIExpc3RSZXBvcnRDb250cm9sbGVyKS5fZ2V0UGFnZU1vZGVsKCk/LmdldFByb3BlcnR5KFwiL2twaURlZmluaXRpb25zXCIpO1xuXG5cdFx0aWYgKHRoaXMuYUtQSURlZmluaXRpb25zICYmIHRoaXMuYUtQSURlZmluaXRpb25zLmxlbmd0aCkge1xuXHRcdFx0Y29uc3Qgb1ZpZXcgPSB0aGlzLmdldFZpZXcoKTtcblx0XHRcdGNvbnN0IG9BcHBDb21wb25lbnQgPSAob1ZpZXcuZ2V0Q29udHJvbGxlcigpIGFzIEJhc2VDb250cm9sbGVyKS5nZXRBcHBDb21wb25lbnQoKSBhcyBhbnk7XG5cblx0XHRcdC8vIENyZWF0ZSBhIEpTT04gbW9kZWwgdG8gc3RvcmUgS1BJIGRhdGFcblx0XHRcdGNvbnN0IG9LUElNb2RlbCA9IG5ldyBKU09OTW9kZWwoKTtcblx0XHRcdG9WaWV3LnNldE1vZGVsKG9LUElNb2RlbCwgXCJrcGlNb2RlbFwiKTtcblxuXHRcdFx0dGhpcy5hS1BJRGVmaW5pdGlvbnMuZm9yRWFjaCgoa3BpRGVmaW5pdGlvbikgPT4ge1xuXHRcdFx0XHQvLyBDcmVhdGUgdGhlIG1hbmlmZXN0IGZvciB0aGUgS1BJIGNhcmQgYW5kIHN0b3JlIGl0IGluIHRoZSBLUEkgbW9kZWxcblx0XHRcdFx0dGhpcy5pbml0Q2FyZE1hbmlmZXN0KGtwaURlZmluaXRpb24sIG9LUElNb2RlbCk7XG5cblx0XHRcdFx0Ly8gU2V0IHRoZSBuYXZpZ2F0aW9uIGluZm9ybWF0aW9uIGluIHRoZSBtYW5pZmVzdFxuXHRcdFx0XHR0aGlzLmluaXROYXZpZ2F0aW9uSW5mbyhrcGlEZWZpbml0aW9uLCBvS1BJTW9kZWwsIG9BcHBDb21wb25lbnQuZ2V0U2hlbGxTZXJ2aWNlcygpKS5jYXRjaChmdW5jdGlvbiAoZXJyOiBhbnkpIHtcblx0XHRcdFx0XHRMb2cuZXJyb3IoZXJyKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Ly8gTG9hZCB0YWcgZGF0YSBmb3IgdGhlIEtQSVxuXHRcdFx0XHR0aGlzLmxvYWRLUElUYWdEYXRhKGtwaURlZmluaXRpb24sIG9BcHBDb21wb25lbnQuZ2V0TW9kZWwoKSBhcyBPRGF0YU1vZGVsLCBvS1BJTW9kZWwpLmNhdGNoKGZ1bmN0aW9uIChlcnI6IGFueSkge1xuXHRcdFx0XHRcdExvZy5lcnJvcihlcnIpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdEBtZXRob2RPdmVycmlkZSgpXG5cdHB1YmxpYyBvbkV4aXQoKTogdm9pZCB7XG5cdFx0Y29uc3Qgb0tQSU1vZGVsID0gdGhpcy5nZXRWaWV3KCkuZ2V0TW9kZWwoXCJrcGlNb2RlbFwiKSBhcyBKU09OTW9kZWw7XG5cblx0XHRpZiAob0tQSU1vZGVsKSB7XG5cdFx0XHRvS1BJTW9kZWwuZGVzdHJveSgpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgdXBkYXRlRGF0YXBvaW50VmFsdWVBbmRDdXJyZW5jeShrcGlEZWZpbml0aW9uOiBLUElEZWZpbml0aW9uLCBrcGlDb250ZXh0OiBDb250ZXh0LCBvS1BJTW9kZWw6IEpTT05Nb2RlbCkge1xuXHRcdGNvbnN0IGN1cnJlbnRMb2NhbGUgPSBuZXcgTG9jYWxlKHNhcC51aS5nZXRDb3JlKCkuZ2V0Q29uZmlndXJhdGlvbigpLmdldExhbmd1YWdlKCkpO1xuXHRcdGNvbnN0IHJhd1VuaXQgPSBrcGlEZWZpbml0aW9uLmRhdGFwb2ludC51bml0Py5pc1BhdGhcblx0XHRcdD8ga3BpQ29udGV4dC5nZXRQcm9wZXJ0eShrcGlEZWZpbml0aW9uLmRhdGFwb2ludC51bml0LnZhbHVlKVxuXHRcdFx0OiBrcGlEZWZpbml0aW9uLmRhdGFwb2ludC51bml0Py52YWx1ZTtcblxuXHRcdGNvbnN0IGlzUGVyY2VudGFnZSA9IGtwaURlZmluaXRpb24uZGF0YXBvaW50LnVuaXQ/LmlzQ3VycmVuY3kgPT09IGZhbHNlICYmIHJhd1VuaXQgPT09IFwiJVwiO1xuXG5cdFx0Ly8gLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cdFx0Ly8gTWFpbiBLUEkgdmFsdWVcblx0XHRjb25zdCByYXdWYWx1ZSA9IE51bWJlci5wYXJzZUZsb2F0KGtwaUNvbnRleHQuZ2V0UHJvcGVydHkoa3BpRGVmaW5pdGlvbi5kYXRhcG9pbnQucHJvcGVydHlQYXRoKSk7XG5cblx0XHQvLyBWYWx1ZSBmb3JtYXR0ZWQgd2l0aCBhIHNjYWxlXG5cdFx0Y29uc3Qga3BpVmFsdWUgPSBOdW1iZXJGb3JtYXQuZ2V0RmxvYXRJbnN0YW5jZShcblx0XHRcdHtcblx0XHRcdFx0c3R5bGU6IGlzUGVyY2VudGFnZSA/IHVuZGVmaW5lZCA6IFwic2hvcnRcIixcblx0XHRcdFx0bWluRnJhY3Rpb25EaWdpdHM6IDAsXG5cdFx0XHRcdG1heEZyYWN0aW9uRGlnaXRzOiAxLFxuXHRcdFx0XHRzaG93U2NhbGU6ICFpc1BlcmNlbnRhZ2Vcblx0XHRcdH0sXG5cdFx0XHRjdXJyZW50TG9jYWxlXG5cdFx0KS5mb3JtYXQocmF3VmFsdWUpO1xuXHRcdG9LUElNb2RlbC5zZXRQcm9wZXJ0eShgLyR7a3BpRGVmaW5pdGlvbi5pZH0vbWFuaWZlc3Qvc2FwLmNhcmQvZGF0YS9qc29uL21haW5WYWx1ZWAsIGtwaVZhbHVlKTtcblxuXHRcdC8vIFZhbHVlIHdpdGhvdXQgYSBzY2FsZVxuXHRcdGNvbnN0IGtwaVZhbHVlVW5zY2FsZWQgPSBOdW1iZXJGb3JtYXQuZ2V0RmxvYXRJbnN0YW5jZShcblx0XHRcdHtcblx0XHRcdFx0bWF4RnJhY3Rpb25EaWdpdHM6IDIsXG5cdFx0XHRcdHNob3dTY2FsZTogZmFsc2UsXG5cdFx0XHRcdGdyb3VwaW5nRW5hYmxlZDogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdGN1cnJlbnRMb2NhbGVcblx0XHQpLmZvcm1hdChyYXdWYWx1ZSk7XG5cdFx0b0tQSU1vZGVsLnNldFByb3BlcnR5KGAvJHtrcGlEZWZpbml0aW9uLmlkfS9tYW5pZmVzdC9zYXAuY2FyZC9kYXRhL2pzb24vbWFpblZhbHVlVW5zY2FsZWRgLCBrcGlWYWx1ZVVuc2NhbGVkKTtcblxuXHRcdC8vIFZhbHVlIGZvcm1hdHRlZCB3aXRoIHRoZSBzY2FsZSBvbWl0dGVkXG5cdFx0Y29uc3Qga3BpVmFsdWVOb1NjYWxlID0gTnVtYmVyRm9ybWF0LmdldEZsb2F0SW5zdGFuY2UoXG5cdFx0XHR7XG5cdFx0XHRcdHN0eWxlOiBpc1BlcmNlbnRhZ2UgPyB1bmRlZmluZWQgOiBcInNob3J0XCIsXG5cdFx0XHRcdG1pbkZyYWN0aW9uRGlnaXRzOiAwLFxuXHRcdFx0XHRtYXhGcmFjdGlvbkRpZ2l0czogMSxcblx0XHRcdFx0c2hvd1NjYWxlOiBmYWxzZVxuXHRcdFx0fSxcblx0XHRcdGN1cnJlbnRMb2NhbGVcblx0XHQpLmZvcm1hdChyYXdWYWx1ZSk7XG5cdFx0b0tQSU1vZGVsLnNldFByb3BlcnR5KGAvJHtrcGlEZWZpbml0aW9uLmlkfS9tYW5pZmVzdC9zYXAuY2FyZC9kYXRhL2pzb24vbWFpblZhbHVlTm9TY2FsZWAsIGtwaVZhbHVlTm9TY2FsZSk7XG5cblx0XHQvLyBTY2FsZSBvZiB0aGUgdmFsdWVcblx0XHRjb25zdCBrcGlWYWx1ZVNjYWxlID0gTnVtYmVyRm9ybWF0LmdldEZsb2F0SW5zdGFuY2UoXG5cdFx0XHR7XG5cdFx0XHRcdHN0eWxlOiBpc1BlcmNlbnRhZ2UgPyB1bmRlZmluZWQgOiBcInNob3J0XCIsXG5cdFx0XHRcdGRlY2ltYWxzOiAwLFxuXHRcdFx0XHRtYXhJbnRlZ2VyRGlnaXRzOiAwLFxuXHRcdFx0XHRzaG93U2NhbGU6IHRydWVcblx0XHRcdH0sXG5cdFx0XHRjdXJyZW50TG9jYWxlXG5cdFx0KS5mb3JtYXQocmF3VmFsdWUpO1xuXHRcdG9LUElNb2RlbC5zZXRQcm9wZXJ0eShgLyR7a3BpRGVmaW5pdGlvbi5pZH0vbWFuaWZlc3Qvc2FwLmNhcmQvZGF0YS9qc29uL21haW5WYWx1ZVNjYWxlYCwga3BpVmFsdWVTY2FsZSk7XG5cblx0XHQvLyAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cblx0XHQvLyBVbml0IG9yIGN1cnJlbmN5XG5cdFx0aWYgKGtwaURlZmluaXRpb24uZGF0YXBvaW50LnVuaXQgJiYgcmF3VW5pdCkge1xuXHRcdFx0aWYgKGtwaURlZmluaXRpb24uZGF0YXBvaW50LnVuaXQuaXNDdXJyZW5jeSkge1xuXHRcdFx0XHRvS1BJTW9kZWwuc2V0UHJvcGVydHkoYC8ke2twaURlZmluaXRpb24uaWR9L21hbmlmZXN0L3NhcC5jYXJkL2RhdGEvanNvbi9tYWluVW5pdGAsIHJhd1VuaXQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gSW4gY2FzZSBvZiB1bml0IG9mIG1lYXN1cmUsIHdlIGhhdmUgdG8gZm9ybWF0IGl0IHByb3Blcmx5XG5cdFx0XHRcdGNvbnN0IGtwaVVuaXQgPSBOdW1iZXJGb3JtYXQuZ2V0VW5pdEluc3RhbmNlKHsgc2hvd051bWJlcjogZmFsc2UgfSwgY3VycmVudExvY2FsZSkuZm9ybWF0KHJhd1ZhbHVlLCByYXdVbml0KTtcblx0XHRcdFx0b0tQSU1vZGVsLnNldFByb3BlcnR5KGAvJHtrcGlEZWZpbml0aW9uLmlkfS9tYW5pZmVzdC9zYXAuY2FyZC9kYXRhL2pzb24vbWFpblVuaXRgLCBrcGlVbml0KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHVwZGF0ZURhdGFwb2ludENyaXRpY2FsaXR5KGtwaURlZmluaXRpb246IEtQSURlZmluaXRpb24sIGtwaUNvbnRleHQ6IENvbnRleHQsIG9LUElNb2RlbDogSlNPTk1vZGVsKSB7XG5cdFx0Y29uc3QgcmF3VmFsdWUgPSBOdW1iZXIucGFyc2VGbG9hdChrcGlDb250ZXh0LmdldFByb3BlcnR5KGtwaURlZmluaXRpb24uZGF0YXBvaW50LnByb3BlcnR5UGF0aCkpO1xuXG5cdFx0bGV0IGNyaXRpY2FsaXR5VmFsdWUgPSBNZXNzYWdlVHlwZS5Ob25lO1xuXHRcdGlmIChrcGlEZWZpbml0aW9uLmRhdGFwb2ludC5jcml0aWNhbGl0eVZhbHVlKSB7XG5cdFx0XHQvLyBDcml0aWNhbGl0eSBpcyBhIGZpeGVkIHZhbHVlXG5cdFx0XHRjcml0aWNhbGl0eVZhbHVlID0ga3BpRGVmaW5pdGlvbi5kYXRhcG9pbnQuY3JpdGljYWxpdHlWYWx1ZTtcblx0XHR9IGVsc2UgaWYgKGtwaURlZmluaXRpb24uZGF0YXBvaW50LmNyaXRpY2FsaXR5UGF0aCkge1xuXHRcdFx0Ly8gQ3JpdGljYWxpdHkgY29tZXMgZnJvbSBhbm90aGVyIHByb3BlcnR5ICh2aWEgYSBwYXRoKVxuXHRcdFx0Y3JpdGljYWxpdHlWYWx1ZSA9XG5cdFx0XHRcdE1lc3NhZ2VUeXBlRnJvbUNyaXRpY2FsaXR5W2twaUNvbnRleHQuZ2V0UHJvcGVydHkoa3BpRGVmaW5pdGlvbi5kYXRhcG9pbnQuY3JpdGljYWxpdHlQYXRoKV0gfHwgTWVzc2FnZVR5cGUuTm9uZTtcblx0XHR9IGVsc2UgaWYgKGtwaURlZmluaXRpb24uZGF0YXBvaW50LmNyaXRpY2FsaXR5Q2FsY3VsYXRpb25UaHJlc2hvbGRzICYmIGtwaURlZmluaXRpb24uZGF0YXBvaW50LmNyaXRpY2FsaXR5Q2FsY3VsYXRpb25Nb2RlKSB7XG5cdFx0XHQvLyBDcml0aWNhbGl0eSBjYWxjdWxhdGlvblxuXHRcdFx0c3dpdGNoIChrcGlEZWZpbml0aW9uLmRhdGFwb2ludC5jcml0aWNhbGl0eUNhbGN1bGF0aW9uTW9kZSkge1xuXHRcdFx0XHRjYXNlIFwiVUkuSW1wcm92ZW1lbnREaXJlY3Rpb25UeXBlL1RhcmdldFwiOlxuXHRcdFx0XHRcdGNyaXRpY2FsaXR5VmFsdWUgPSBtZXNzYWdlVHlwZUZyb21UYXJnZXRDYWxjdWxhdGlvbihyYXdWYWx1ZSwga3BpRGVmaW5pdGlvbi5kYXRhcG9pbnQuY3JpdGljYWxpdHlDYWxjdWxhdGlvblRocmVzaG9sZHMpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgXCJVSS5JbXByb3ZlbWVudERpcmVjdGlvblR5cGUvTWluaW1pemVcIjpcblx0XHRcdFx0XHRjcml0aWNhbGl0eVZhbHVlID0gbWVzc2FnZVR5cGVGcm9tTWluaW1pemVDYWxjdWxhdGlvbihcblx0XHRcdFx0XHRcdHJhd1ZhbHVlLFxuXHRcdFx0XHRcdFx0a3BpRGVmaW5pdGlvbi5kYXRhcG9pbnQuY3JpdGljYWxpdHlDYWxjdWxhdGlvblRocmVzaG9sZHNcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgXCJVSS5JbXByb3ZlbWVudERpcmVjdGlvblR5cGUvTWF4aW1pemVcIjpcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRjcml0aWNhbGl0eVZhbHVlID0gbWVzc2FnZVR5cGVGcm9tTWF4aW1pemVDYWxjdWxhdGlvbihcblx0XHRcdFx0XHRcdHJhd1ZhbHVlLFxuXHRcdFx0XHRcdFx0a3BpRGVmaW5pdGlvbi5kYXRhcG9pbnQuY3JpdGljYWxpdHlDYWxjdWxhdGlvblRocmVzaG9sZHNcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdG9LUElNb2RlbC5zZXRQcm9wZXJ0eShgLyR7a3BpRGVmaW5pdGlvbi5pZH0vbWFuaWZlc3Qvc2FwLmNhcmQvZGF0YS9qc29uL21haW5Dcml0aWNhbGl0eWAsIGNyaXRpY2FsaXR5VmFsdWUpO1xuXHRcdG9LUElNb2RlbC5zZXRQcm9wZXJ0eShcblx0XHRcdGAvJHtrcGlEZWZpbml0aW9uLmlkfS9tYW5pZmVzdC9zYXAuY2FyZC9kYXRhL2pzb24vbWFpblN0YXRlYCxcblx0XHRcdFZhbHVlQ29sb3JGcm9tTWVzc2FnZVR5cGVbY3JpdGljYWxpdHlWYWx1ZV0gfHwgXCJOb25lXCJcblx0XHQpO1xuXHR9XG5cblx0cHJpdmF0ZSB1cGRhdGVEYXRhcG9pbnRUcmVuZChrcGlEZWZpbml0aW9uOiBLUElEZWZpbml0aW9uLCBrcGlDb250ZXh0OiBDb250ZXh0LCBvS1BJTW9kZWw6IEpTT05Nb2RlbCkge1xuXHRcdGNvbnN0IHJhd1ZhbHVlID0gTnVtYmVyLnBhcnNlRmxvYXQoa3BpQ29udGV4dC5nZXRQcm9wZXJ0eShrcGlEZWZpbml0aW9uLmRhdGFwb2ludC5wcm9wZXJ0eVBhdGgpKTtcblxuXHRcdGxldCB0cmVuZFZhbHVlID0gXCJOb25lXCI7XG5cblx0XHRpZiAoa3BpRGVmaW5pdGlvbi5kYXRhcG9pbnQudHJlbmRWYWx1ZSkge1xuXHRcdFx0Ly8gVHJlbmQgaXMgYSBmaXhlZCB2YWx1ZVxuXHRcdFx0dHJlbmRWYWx1ZSA9IGtwaURlZmluaXRpb24uZGF0YXBvaW50LnRyZW5kVmFsdWU7XG5cdFx0fSBlbHNlIGlmIChrcGlEZWZpbml0aW9uLmRhdGFwb2ludC50cmVuZFBhdGgpIHtcblx0XHRcdC8vIFRyZW5kIGNvbWVzIGZyb20gYW5vdGhlciBwcm9wZXJ0eSB2aWEgYSBwYXRoXG5cdFx0XHR0cmVuZFZhbHVlID0gZGV2aWF0aW9uSW5kaWNhdG9yRnJvbVRyZW5kVHlwZShrcGlDb250ZXh0LmdldFByb3BlcnR5KGtwaURlZmluaXRpb24uZGF0YXBvaW50LnRyZW5kUGF0aCkpO1xuXHRcdH0gZWxzZSBpZiAoXG5cdFx0XHRrcGlEZWZpbml0aW9uLmRhdGFwb2ludC50cmVuZENhbGN1bGF0aW9uUmVmZXJlbmNlVmFsdWUgIT09IHVuZGVmaW5lZCB8fFxuXHRcdFx0a3BpRGVmaW5pdGlvbi5kYXRhcG9pbnQudHJlbmRDYWxjdWxhdGlvblJlZmVyZW5jZVBhdGhcblx0XHQpIHtcblx0XHRcdC8vIENhbGN1bGF0ZWQgdHJlbmRcblx0XHRcdGxldCB0cmVuZFJlZmVyZW5jZVZhbHVlOiBudW1iZXI7XG5cdFx0XHRpZiAoa3BpRGVmaW5pdGlvbi5kYXRhcG9pbnQudHJlbmRDYWxjdWxhdGlvblJlZmVyZW5jZVZhbHVlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0dHJlbmRSZWZlcmVuY2VWYWx1ZSA9IGtwaURlZmluaXRpb24uZGF0YXBvaW50LnRyZW5kQ2FsY3VsYXRpb25SZWZlcmVuY2VWYWx1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRyZW5kUmVmZXJlbmNlVmFsdWUgPSBOdW1iZXIucGFyc2VGbG9hdChcblx0XHRcdFx0XHRrcGlDb250ZXh0LmdldFByb3BlcnR5KGtwaURlZmluaXRpb24uZGF0YXBvaW50LnRyZW5kQ2FsY3VsYXRpb25SZWZlcmVuY2VQYXRoIHx8IFwiXCIpXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0XHR0cmVuZFZhbHVlID0gZGV2aWF0aW9uSW5kaWNhdG9yRnJvbUNhbGN1bGF0aW9uKFxuXHRcdFx0XHRyYXdWYWx1ZSxcblx0XHRcdFx0dHJlbmRSZWZlcmVuY2VWYWx1ZSxcblx0XHRcdFx0ISFrcGlEZWZpbml0aW9uLmRhdGFwb2ludC50cmVuZENhbGN1bGF0aW9uSXNSZWxhdGl2ZSxcblx0XHRcdFx0a3BpRGVmaW5pdGlvbi5kYXRhcG9pbnQudHJlbmRDYWxjdWxhdGlvblRyZXNob2xkc1xuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRvS1BJTW9kZWwuc2V0UHJvcGVydHkoYC8ke2twaURlZmluaXRpb24uaWR9L21hbmlmZXN0L3NhcC5jYXJkL2RhdGEvanNvbi90cmVuZGAsIHRyZW5kVmFsdWUpO1xuXHR9XG5cblx0cHJpdmF0ZSB1cGRhdGVUYXJnZXRWYWx1ZShrcGlEZWZpbml0aW9uOiBLUElEZWZpbml0aW9uLCBrcGlDb250ZXh0OiBDb250ZXh0LCBvS1BJTW9kZWw6IEpTT05Nb2RlbCkge1xuXHRcdGlmIChrcGlEZWZpbml0aW9uLmRhdGFwb2ludC50YXJnZXRWYWx1ZSA9PT0gdW5kZWZpbmVkICYmIGtwaURlZmluaXRpb24uZGF0YXBvaW50LnRhcmdldFBhdGggPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuOyAvLyBObyB0YXJnZXQgc2V0IGZvciB0aGUgS1BJXG5cdFx0fVxuXHRcdGNvbnN0IHJhd1ZhbHVlID0gTnVtYmVyLnBhcnNlRmxvYXQoa3BpQ29udGV4dC5nZXRQcm9wZXJ0eShrcGlEZWZpbml0aW9uLmRhdGFwb2ludC5wcm9wZXJ0eVBhdGgpKTtcblx0XHRjb25zdCBjdXJyZW50TG9jYWxlID0gbmV3IExvY2FsZShzYXAudWkuZ2V0Q29yZSgpLmdldENvbmZpZ3VyYXRpb24oKS5nZXRMYW5ndWFnZSgpKTtcblxuXHRcdGxldCB0YXJnZXRSYXdWYWx1ZTogbnVtYmVyO1xuXHRcdGlmIChrcGlEZWZpbml0aW9uLmRhdGFwb2ludC50YXJnZXRWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0YXJnZXRSYXdWYWx1ZSA9IGtwaURlZmluaXRpb24uZGF0YXBvaW50LnRhcmdldFZhbHVlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0YXJnZXRSYXdWYWx1ZSA9IE51bWJlci5wYXJzZUZsb2F0KGtwaUNvbnRleHQuZ2V0UHJvcGVydHkoa3BpRGVmaW5pdGlvbi5kYXRhcG9pbnQudGFyZ2V0UGF0aCB8fCBcIlwiKSk7XG5cdFx0fVxuXHRcdGNvbnN0IGRldmlhdGlvblJhd1ZhbHVlID0gdGFyZ2V0UmF3VmFsdWUgIT09IDAgPyAoKHJhd1ZhbHVlIC0gdGFyZ2V0UmF3VmFsdWUpIC8gdGFyZ2V0UmF3VmFsdWUpICogMTAwIDogdW5kZWZpbmVkO1xuXG5cdFx0Ly8gRm9ybWF0dGluZ1xuXHRcdGNvbnN0IHRhcmdldFZhbHVlID0gTnVtYmVyRm9ybWF0LmdldEZsb2F0SW5zdGFuY2UoXG5cdFx0XHR7XG5cdFx0XHRcdHN0eWxlOiBcInNob3J0XCIsXG5cdFx0XHRcdG1pbkZyYWN0aW9uRGlnaXRzOiAwLFxuXHRcdFx0XHRtYXhGcmFjdGlvbkRpZ2l0czogMSxcblx0XHRcdFx0c2hvd1NjYWxlOiBmYWxzZVxuXHRcdFx0fSxcblx0XHRcdGN1cnJlbnRMb2NhbGVcblx0XHQpLmZvcm1hdCh0YXJnZXRSYXdWYWx1ZSk7XG5cdFx0Y29uc3QgdGFyZ2V0U2NhbGUgPSBOdW1iZXJGb3JtYXQuZ2V0RmxvYXRJbnN0YW5jZShcblx0XHRcdHtcblx0XHRcdFx0c3R5bGU6IFwic2hvcnRcIixcblx0XHRcdFx0ZGVjaW1hbHM6IDAsXG5cdFx0XHRcdG1heEludGVnZXJEaWdpdHM6IDAsXG5cdFx0XHRcdHNob3dTY2FsZTogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdGN1cnJlbnRMb2NhbGVcblx0XHQpLmZvcm1hdCh0YXJnZXRSYXdWYWx1ZSk7XG5cblx0XHRvS1BJTW9kZWwuc2V0UHJvcGVydHkoYC8ke2twaURlZmluaXRpb24uaWR9L21hbmlmZXN0L3NhcC5jYXJkL2RhdGEvanNvbi90YXJnZXROdW1iZXJgLCB0YXJnZXRWYWx1ZSk7XG5cdFx0b0tQSU1vZGVsLnNldFByb3BlcnR5KGAvJHtrcGlEZWZpbml0aW9uLmlkfS9tYW5pZmVzdC9zYXAuY2FyZC9kYXRhL2pzb24vdGFyZ2V0VW5pdGAsIHRhcmdldFNjYWxlKTtcblxuXHRcdGlmIChkZXZpYXRpb25SYXdWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb25zdCBkZXZpYXRpb25WYWx1ZSA9IE51bWJlckZvcm1hdC5nZXRGbG9hdEluc3RhbmNlKFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bWluRnJhY3Rpb25EaWdpdHM6IDAsXG5cdFx0XHRcdFx0bWF4RnJhY3Rpb25EaWdpdHM6IDEsXG5cdFx0XHRcdFx0c2hvd1NjYWxlOiBmYWxzZVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjdXJyZW50TG9jYWxlXG5cdFx0XHQpLmZvcm1hdChkZXZpYXRpb25SYXdWYWx1ZSk7XG5cdFx0XHRvS1BJTW9kZWwuc2V0UHJvcGVydHkoYC8ke2twaURlZmluaXRpb24uaWR9L21hbmlmZXN0L3NhcC5jYXJkL2RhdGEvanNvbi9kZXZpYXRpb25OdW1iZXJgLCBkZXZpYXRpb25WYWx1ZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG9LUElNb2RlbC5zZXRQcm9wZXJ0eShgLyR7a3BpRGVmaW5pdGlvbi5pZH0vbWFuaWZlc3Qvc2FwLmNhcmQvZGF0YS9qc29uL2RldmlhdGlvbk51bWJlcmAsIFwiTi9BXCIpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBMb2FkcyB0YWcgZGF0YSBmb3IgYSBLUEksIGFuZCBzdG9yZXMgaXQgaW4gdGhlIEpTT04gS1BJIG1vZGVsLlxuXHQgKlxuXHQgKiBAcGFyYW0ga3BpRGVmaW5pdGlvbiBUaGUgZGVmaW5pdGlvbiBvZiB0aGUgS1BJLlxuXHQgKiBAcGFyYW0gb01haW5Nb2RlbCBUaGUgbW9kZWwgdXNlZCB0byBsb2FkIHRoZSBkYXRhLlxuXHQgKiBAcGFyYW0gb0tQSU1vZGVsIFRoZSBKU09OIG1vZGVsIHdoZXJlIHRoZSBkYXRhIHdpbGwgYmUgc3RvcmVkXG5cdCAqIEBwYXJhbSBsb2FkRnVsbCBJZiBub3QgdHJ1ZSwgbG9hZHMgb25seSBkYXRhIGZvciB0aGUgS1BJIHRhZ1xuXHQgKiBAcmV0dXJucyBSZXR1cm5zIHRoZSBwcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2hlbiBkYXRhIGlzIGxvYWRlZC5cblx0ICovXG5cdHByb3RlY3RlZCBsb2FkS1BJVGFnRGF0YShrcGlEZWZpbml0aW9uOiBLUElEZWZpbml0aW9uLCBvTWFpbk1vZGVsOiBPRGF0YU1vZGVsLCBvS1BJTW9kZWw6IEpTT05Nb2RlbCwgbG9hZEZ1bGw/OiBib29sZWFuKTogYW55IHtcblx0XHQvLyBJZiBsb2FkRnVsbD1mYWxzZSwgdGhlbiB3ZSdyZSBqdXN0IGxvYWRpbmcgZGF0YSBmb3IgdGhlIHRhZyBhbmQgd2UgdXNlIHRoZSBcIiRhdXRvLkxvbmdSdW5uZXJzXCIgZ3JvdXBJRFxuXHRcdC8vIElmIGxvYWRGdWxsPXRydWUsIHdlJ3JlIGxvYWRpbmcgZGF0YSBmb3IgdGhlIHdob2xlIEtQSSAodGFnICsgY2FyZCkgYW5kIHdlIHVzZSB0aGUgZGVmYXVsdCAoXCIkYXV0b1wiKSBncm91cElEXG5cdFx0Y29uc3Qgb0xpc3RCaW5kaW5nID0gbG9hZEZ1bGxcblx0XHRcdD8gb01haW5Nb2RlbC5iaW5kTGlzdChgLyR7a3BpRGVmaW5pdGlvbi5lbnRpdHlTZXR9YClcblx0XHRcdDogb01haW5Nb2RlbC5iaW5kTGlzdChgLyR7a3BpRGVmaW5pdGlvbi5lbnRpdHlTZXR9YCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgeyAkJGdyb3VwSWQ6IFwiJGF1dG8uTG9uZ1J1bm5lcnNcIiB9KTtcblx0XHRjb25zdCBvQWdncmVnYXRlOiBSZWNvcmQ8c3RyaW5nLCB7IHVuaXQ/OiBzdHJpbmcgfT4gPSB7fTtcblxuXHRcdC8vIE1haW4gdmFsdWUgKyBjdXJyZW5jeS91bml0XG5cdFx0aWYgKGtwaURlZmluaXRpb24uZGF0YXBvaW50LnVuaXQ/LmlzUGF0aCkge1xuXHRcdFx0b0FnZ3JlZ2F0ZVtrcGlEZWZpbml0aW9uLmRhdGFwb2ludC5wcm9wZXJ0eVBhdGhdID0geyB1bml0OiBrcGlEZWZpbml0aW9uLmRhdGFwb2ludC51bml0LnZhbHVlIH07XG5cdFx0fSBlbHNlIHtcblx0XHRcdG9BZ2dyZWdhdGVba3BpRGVmaW5pdGlvbi5kYXRhcG9pbnQucHJvcGVydHlQYXRoXSA9IHt9O1xuXHRcdH1cblxuXHRcdC8vIFByb3BlcnR5IGZvciBjcml0aWNhbGl0eVxuXHRcdGlmIChrcGlEZWZpbml0aW9uLmRhdGFwb2ludC5jcml0aWNhbGl0eVBhdGgpIHtcblx0XHRcdG9BZ2dyZWdhdGVba3BpRGVmaW5pdGlvbi5kYXRhcG9pbnQuY3JpdGljYWxpdHlQYXRoXSA9IHt9O1xuXHRcdH1cblxuXHRcdC8vIFByb3BlcnRpZXMgZm9yIHRyZW5kIGFuZCB0cmVuZCBjYWxjdWxhdGlvblxuXHRcdGlmIChsb2FkRnVsbCkge1xuXHRcdFx0aWYgKGtwaURlZmluaXRpb24uZGF0YXBvaW50LnRyZW5kUGF0aCkge1xuXHRcdFx0XHRvQWdncmVnYXRlW2twaURlZmluaXRpb24uZGF0YXBvaW50LnRyZW5kUGF0aF0gPSB7fTtcblx0XHRcdH1cblx0XHRcdGlmIChrcGlEZWZpbml0aW9uLmRhdGFwb2ludC50cmVuZENhbGN1bGF0aW9uUmVmZXJlbmNlUGF0aCkge1xuXHRcdFx0XHRvQWdncmVnYXRlW2twaURlZmluaXRpb24uZGF0YXBvaW50LnRyZW5kQ2FsY3VsYXRpb25SZWZlcmVuY2VQYXRoXSA9IHt9O1xuXHRcdFx0fVxuXHRcdFx0aWYgKGtwaURlZmluaXRpb24uZGF0YXBvaW50LnRhcmdldFBhdGgpIHtcblx0XHRcdFx0b0FnZ3JlZ2F0ZVtrcGlEZWZpbml0aW9uLmRhdGFwb2ludC50YXJnZXRQYXRoXSA9IHt9O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdG9MaXN0QmluZGluZy5zZXRBZ2dyZWdhdGlvbih7IGFnZ3JlZ2F0ZTogb0FnZ3JlZ2F0ZSB9KTtcblxuXHRcdC8vIE1hbmFnZSBTZWxlY3Rpb25WYXJpYW50IGZpbHRlcnNcblx0XHRpZiAoa3BpRGVmaW5pdGlvbi5zZWxlY3Rpb25WYXJpYW50RmlsdGVyRGVmaW5pdGlvbnM/Lmxlbmd0aCkge1xuXHRcdFx0Y29uc3QgYUZpbHRlcnMgPSBrcGlEZWZpbml0aW9uLnNlbGVjdGlvblZhcmlhbnRGaWx0ZXJEZWZpbml0aW9ucy5tYXAoY3JlYXRlRmlsdGVyRnJvbURlZmluaXRpb24pLmZpbHRlcigoZmlsdGVyKSA9PiB7XG5cdFx0XHRcdHJldHVybiBmaWx0ZXIgIT09IHVuZGVmaW5lZDtcblx0XHRcdH0pIGFzIEZpbHRlcltdO1xuXHRcdFx0b0xpc3RCaW5kaW5nLmZpbHRlcihhRmlsdGVycyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG9MaXN0QmluZGluZy5yZXF1ZXN0Q29udGV4dHMoMCwgMSkudGhlbigoYUNvbnRleHRzOiBDb250ZXh0W10pID0+IHtcblx0XHRcdGlmIChhQ29udGV4dHMubGVuZ3RoKSB7XG5cdFx0XHRcdGNvbnN0IHJhd1VuaXQgPSBrcGlEZWZpbml0aW9uLmRhdGFwb2ludC51bml0Py5pc1BhdGhcblx0XHRcdFx0XHQ/IGFDb250ZXh0c1swXS5nZXRQcm9wZXJ0eShrcGlEZWZpbml0aW9uLmRhdGFwb2ludC51bml0LnZhbHVlKVxuXHRcdFx0XHRcdDoga3BpRGVmaW5pdGlvbi5kYXRhcG9pbnQudW5pdD8udmFsdWU7XG5cblx0XHRcdFx0aWYgKGtwaURlZmluaXRpb24uZGF0YXBvaW50LnVuaXQgJiYgIXJhd1VuaXQpIHtcblx0XHRcdFx0XHQvLyBBIHVuaXQvY3VycmVuY3kgaXMgZGVmaW5lZCwgYnV0IGl0cyB2YWx1ZSBpcyB1bmRlZmluZWQgLS0+IG11bHRpLXVuaXQgc2l0dWF0aW9uXG5cdFx0XHRcdFx0b0tQSU1vZGVsLnNldFByb3BlcnR5KGAvJHtrcGlEZWZpbml0aW9uLmlkfS9tYW5pZmVzdC9zYXAuY2FyZC9kYXRhL2pzb24vbWFpblZhbHVlYCwgXCIqXCIpO1xuXHRcdFx0XHRcdG9LUElNb2RlbC5zZXRQcm9wZXJ0eShgLyR7a3BpRGVmaW5pdGlvbi5pZH0vbWFuaWZlc3Qvc2FwLmNhcmQvZGF0YS9qc29uL21haW5WYWx1ZVVuc2NhbGVkYCwgXCIqXCIpO1xuXHRcdFx0XHRcdG9LUElNb2RlbC5zZXRQcm9wZXJ0eShgLyR7a3BpRGVmaW5pdGlvbi5pZH0vbWFuaWZlc3Qvc2FwLmNhcmQvZGF0YS9qc29uL21haW5WYWx1ZU5vU2NhbGVgLCBcIipcIik7XG5cdFx0XHRcdFx0b0tQSU1vZGVsLnNldFByb3BlcnR5KGAvJHtrcGlEZWZpbml0aW9uLmlkfS9tYW5pZmVzdC9zYXAuY2FyZC9kYXRhL2pzb24vbWFpblZhbHVlU2NhbGVgLCBcIlwiKTtcblx0XHRcdFx0XHRvS1BJTW9kZWwuc2V0UHJvcGVydHkoYC8ke2twaURlZmluaXRpb24uaWR9L21hbmlmZXN0L3NhcC5jYXJkL2RhdGEvanNvbi9tYWluVW5pdGAsIHVuZGVmaW5lZCk7XG5cdFx0XHRcdFx0b0tQSU1vZGVsLnNldFByb3BlcnR5KGAvJHtrcGlEZWZpbml0aW9uLmlkfS9tYW5pZmVzdC9zYXAuY2FyZC9kYXRhL2pzb24vbWFpbkNyaXRpY2FsaXR5YCwgTWVzc2FnZVR5cGUuTm9uZSk7XG5cdFx0XHRcdFx0b0tQSU1vZGVsLnNldFByb3BlcnR5KGAvJHtrcGlEZWZpbml0aW9uLmlkfS9tYW5pZmVzdC9zYXAuY2FyZC9kYXRhL2pzb24vbWFpblN0YXRlYCwgXCJOb25lXCIpO1xuXHRcdFx0XHRcdG9LUElNb2RlbC5zZXRQcm9wZXJ0eShgLyR7a3BpRGVmaW5pdGlvbi5pZH0vbWFuaWZlc3Qvc2FwLmNhcmQvZGF0YS9qc29uL3RyZW5kYCwgXCJOb25lXCIpO1xuXHRcdFx0XHRcdG9LUElNb2RlbC5zZXRQcm9wZXJ0eShgLyR7a3BpRGVmaW5pdGlvbi5pZH0vbWFuaWZlc3Qvc2FwLmNhcmQvZGF0YS9qc29uL3RhcmdldE51bWJlcmAsIHVuZGVmaW5lZCk7XG5cdFx0XHRcdFx0b0tQSU1vZGVsLnNldFByb3BlcnR5KGAvJHtrcGlEZWZpbml0aW9uLmlkfS9tYW5pZmVzdC9zYXAuY2FyZC9kYXRhL2pzb24vdGFyZ2V0VW5pdGAsIHVuZGVmaW5lZCk7XG5cdFx0XHRcdFx0b0tQSU1vZGVsLnNldFByb3BlcnR5KGAvJHtrcGlEZWZpbml0aW9uLmlkfS9tYW5pZmVzdC9zYXAuY2FyZC9kYXRhL2pzb24vZGV2aWF0aW9uTnVtYmVyYCwgdW5kZWZpbmVkKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLnVwZGF0ZURhdGFwb2ludFZhbHVlQW5kQ3VycmVuY3koa3BpRGVmaW5pdGlvbiwgYUNvbnRleHRzWzBdLCBvS1BJTW9kZWwpO1xuXHRcdFx0XHRcdHRoaXMudXBkYXRlRGF0YXBvaW50Q3JpdGljYWxpdHkoa3BpRGVmaW5pdGlvbiwgYUNvbnRleHRzWzBdLCBvS1BJTW9kZWwpO1xuXG5cdFx0XHRcdFx0aWYgKGxvYWRGdWxsKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnVwZGF0ZURhdGFwb2ludFRyZW5kKGtwaURlZmluaXRpb24sIGFDb250ZXh0c1swXSwgb0tQSU1vZGVsKTtcblx0XHRcdFx0XHRcdHRoaXMudXBkYXRlVGFyZ2V0VmFsdWUoa3BpRGVmaW5pdGlvbiwgYUNvbnRleHRzWzBdLCBvS1BJTW9kZWwpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIExvYWRzIGNhcmQgZGF0YSBmb3IgYSBLUEksIGFuZCBzdG9yZXMgaXQgaW4gdGhlIEpTT04gS1BJIG1vZGVsLlxuXHQgKlxuXHQgKiBAcGFyYW0ga3BpRGVmaW5pdGlvbiBUaGUgZGVmaW5pdGlvbiBvZiB0aGUgS1BJLlxuXHQgKiBAcGFyYW0gb01haW5Nb2RlbCBUaGUgbW9kZWwgdXNlZCB0byBsb2FkIHRoZSBkYXRhLlxuXHQgKiBAcGFyYW0gb0tQSU1vZGVsIFRoZSBKU09OIG1vZGVsIHdoZXJlIHRoZSBkYXRhIHdpbGwgYmUgc3RvcmVkXG5cdCAqIEByZXR1cm5zIFJldHVybnMgdGhlIHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aGVuIGRhdGEgaXMgbG9hZGVkLlxuXHQgKi9cblx0cHJvdGVjdGVkIGxvYWRLUElDYXJkRGF0YShrcGlEZWZpbml0aW9uOiBLUElEZWZpbml0aW9uLCBvTWFpbk1vZGVsOiBPRGF0YU1vZGVsLCBvS1BJTW9kZWw6IEpTT05Nb2RlbCk6IGFueSB7XG5cdFx0Y29uc3Qgb0xpc3RCaW5kaW5nID0gb01haW5Nb2RlbC5iaW5kTGlzdChgLyR7a3BpRGVmaW5pdGlvbi5lbnRpdHlTZXR9YCk7XG5cdFx0Y29uc3Qgb0dyb3VwOiBSZWNvcmQ8c3RyaW5nLCBPYmplY3Q+ID0ge307XG5cdFx0Y29uc3Qgb0FnZ3JlZ2F0ZTogUmVjb3JkPHN0cmluZywgT2JqZWN0PiA9IHt9O1xuXG5cdFx0a3BpRGVmaW5pdGlvbi5jaGFydC5kaW1lbnNpb25zLmZvckVhY2goKGRpbWVuc2lvbikgPT4ge1xuXHRcdFx0b0dyb3VwW2RpbWVuc2lvbi5uYW1lXSA9IHt9O1xuXHRcdH0pO1xuXHRcdGtwaURlZmluaXRpb24uY2hhcnQubWVhc3VyZXMuZm9yRWFjaCgobWVhc3VyZSkgPT4ge1xuXHRcdFx0b0FnZ3JlZ2F0ZVttZWFzdXJlLm5hbWVdID0ge307XG5cdFx0fSk7XG5cdFx0b0xpc3RCaW5kaW5nLnNldEFnZ3JlZ2F0aW9uKHtcblx0XHRcdGdyb3VwOiBvR3JvdXAsXG5cdFx0XHRhZ2dyZWdhdGU6IG9BZ2dyZWdhdGVcblx0XHR9KTtcblxuXHRcdC8vIE1hbmFnZSBTZWxlY3Rpb25WYXJpYW50IGZpbHRlcnNcblx0XHRpZiAoa3BpRGVmaW5pdGlvbi5zZWxlY3Rpb25WYXJpYW50RmlsdGVyRGVmaW5pdGlvbnM/Lmxlbmd0aCkge1xuXHRcdFx0Y29uc3QgYUZpbHRlcnMgPSBrcGlEZWZpbml0aW9uLnNlbGVjdGlvblZhcmlhbnRGaWx0ZXJEZWZpbml0aW9ucy5tYXAoY3JlYXRlRmlsdGVyRnJvbURlZmluaXRpb24pLmZpbHRlcigoZmlsdGVyKSA9PiB7XG5cdFx0XHRcdHJldHVybiBmaWx0ZXIgIT09IHVuZGVmaW5lZDtcblx0XHRcdH0pIGFzIEZpbHRlcltdO1xuXHRcdFx0b0xpc3RCaW5kaW5nLmZpbHRlcihhRmlsdGVycyk7XG5cdFx0fVxuXG5cdFx0Ly8gU29ydGluZ1xuXHRcdGlmIChrcGlEZWZpbml0aW9uLmNoYXJ0LnNvcnRPcmRlcikge1xuXHRcdFx0b0xpc3RCaW5kaW5nLnNvcnQoXG5cdFx0XHRcdGtwaURlZmluaXRpb24uY2hhcnQuc29ydE9yZGVyLm1hcCgoc29ydEluZm8pID0+IHtcblx0XHRcdFx0XHRyZXR1cm4gbmV3IFNvcnRlcihzb3J0SW5mby5uYW1lLCBzb3J0SW5mby5kZXNjZW5kaW5nKTtcblx0XHRcdFx0fSlcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG9MaXN0QmluZGluZy5yZXF1ZXN0Q29udGV4dHMoMCwga3BpRGVmaW5pdGlvbi5jaGFydC5tYXhJdGVtcykudGhlbigoYUNvbnRleHRzOiBDb250ZXh0W10pID0+IHtcblx0XHRcdGNvbnN0IGNoYXJ0RGF0YSA9IGFDb250ZXh0cy5tYXAoZnVuY3Rpb24gKG9Db250ZXh0KSB7XG5cdFx0XHRcdGNvbnN0IG9EYXRhOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG5cdFx0XHRcdGtwaURlZmluaXRpb24uY2hhcnQuZGltZW5zaW9ucy5mb3JFYWNoKChkaW1lbnNpb24pID0+IHtcblx0XHRcdFx0XHRvRGF0YVtkaW1lbnNpb24ubmFtZV0gPSBvQ29udGV4dC5nZXRQcm9wZXJ0eShkaW1lbnNpb24ubmFtZSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRrcGlEZWZpbml0aW9uLmNoYXJ0Lm1lYXN1cmVzLmZvckVhY2goKG1lYXN1cmUpID0+IHtcblx0XHRcdFx0XHRvRGF0YVttZWFzdXJlLm5hbWVdID0gb0NvbnRleHQuZ2V0UHJvcGVydHkobWVhc3VyZS5uYW1lKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0cmV0dXJuIG9EYXRhO1xuXHRcdFx0fSk7XG5cblx0XHRcdG9LUElNb2RlbC5zZXRQcm9wZXJ0eShgLyR7a3BpRGVmaW5pdGlvbi5pZH0vbWFuaWZlc3Qvc2FwLmNhcmQvZGF0YS9qc29uL2NoYXJ0RGF0YWAsIGNoYXJ0RGF0YSk7XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyB0aGUgcG9wb3ZlciB0byBkaXNwbGF5IHRoZSBLUEkgY2FyZFxuXHQgKiBUaGUgcG9wb3ZlciBhbmQgdGhlIGNvbnRhaW5lZCBjYXJkIGZvciB0aGUgS1BJcyBhcmUgY3JlYXRlZCBpZiBuZWNlc3NhcnkuXG5cdCAqIFRoZSBwb3BvdmVyIGlzIHNoYXJlZCBiZXR3ZWVuIGFsbCBLUElzLCBzbyBpdCdzIGNyZWF0ZWQgb25seSBvbmNlLlxuXHQgKlxuXHQgKiBAcGFyYW0gb0tQSVRhZyBUaGUgdGFnIHRoYXQgdHJpZ2dlcmVkIHRoZSBwb3BvdmVyIG9wZW5pbmcuXG5cdCAqIEByZXR1cm5zIFRoZSBzaGFyZWQgcG9wb3ZlciBhcyBhIHByb21pc2UuXG5cdCAqL1xuXHRwcm90ZWN0ZWQgZ2V0UG9wb3ZlcihvS1BJVGFnOiBHZW5lcmljVGFnKTogUHJvbWlzZTxQb3BvdmVyPiB7XG5cdFx0aWYgKCF0aGlzLm9Qb3BvdmVyKSB7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRDb3JlLmxvYWRMaWJyYXJ5KFwic2FwL3VpL2ludGVncmF0aW9uXCIsIHsgYXN5bmM6IHRydWUgfSlcblx0XHRcdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdFx0XHRzYXAudWkucmVxdWlyZShbXCJzYXAvdWkvaW50ZWdyYXRpb24vd2lkZ2V0cy9DYXJkXCIsIFwic2FwL3VpL2ludGVncmF0aW9uL0hvc3RcIl0sIChDYXJkOiBhbnksIEhvc3Q6IGFueSkgPT4ge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBvSG9zdCA9IG5ldyBIb3N0KCk7XG5cblx0XHRcdFx0XHRcdFx0b0hvc3QuYXR0YWNoQWN0aW9uKChvRXZlbnQ6IGFueSkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IHNUeXBlID0gb0V2ZW50LmdldFBhcmFtZXRlcihcInR5cGVcIik7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3Qgb1BhcmFtcyA9IG9FdmVudC5nZXRQYXJhbWV0ZXIoXCJwYXJhbWV0ZXJzXCIpO1xuXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHNUeXBlID09PSBcIk5hdmlnYXRpb25cIikge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKG9QYXJhbXMuc2VtYW50aWNPYmplY3QpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0KHRoaXMuZ2V0VmlldygpLmdldENvbnRyb2xsZXIoKSBhcyBhbnkpLl9pbnRlbnRCYXNlZE5hdmlnYXRpb24ubmF2aWdhdGUoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b1BhcmFtcy5zZW1hbnRpY09iamVjdCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvUGFyYW1zLmFjdGlvblxuXHRcdFx0XHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0KHRoaXMuZ2V0VmlldygpLmdldENvbnRyb2xsZXIoKSBhcyBhbnkpLl9pbnRlbnRCYXNlZE5hdmlnYXRpb24ubmF2aWdhdGVPdXRib3VuZChvUGFyYW1zLm91dGJvdW5kKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdHRoaXMub0NhcmQgPSBuZXcgQ2FyZCh7XG5cdFx0XHRcdFx0XHRcdFx0d2lkdGg6IFwiMjVyZW1cIixcblx0XHRcdFx0XHRcdFx0XHRoZWlnaHQ6IFwiYXV0b1wiXG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHR0aGlzLm9DYXJkLnNldEhvc3Qob0hvc3QpO1xuXG5cdFx0XHRcdFx0XHRcdHRoaXMub1BvcG92ZXIgPSBuZXcgUG9wb3ZlcihcImtwaS1Qb3BvdmVyXCIsIHtcblx0XHRcdFx0XHRcdFx0XHRzaG93SGVhZGVyOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0XHRwbGFjZW1lbnQ6IFwiQXV0b1wiLFxuXHRcdFx0XHRcdFx0XHRcdGNvbnRlbnQ6IFt0aGlzLm9DYXJkXVxuXHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0XHRvS1BJVGFnLmFkZERlcGVuZGVudCh0aGlzLm9Qb3BvdmVyKTsgLy8gVGhlIGZpcnN0IGNsaWNrZWQgdGFnIGdldHMgdGhlIHBvcG92ZXIgYXMgZGVwZW5kZW50XG5cblx0XHRcdFx0XHRcdFx0cmVzb2x2ZSh0aGlzLm9Qb3BvdmVyKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmNhdGNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdHJlamVjdCgpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5vUG9wb3Zlcik7XG5cdFx0fVxuXHR9XG5cblx0QHB1YmxpY0V4dGVuc2lvbigpXG5cdHB1YmxpYyBvbktQSVByZXNzZWQob0tQSVRhZzogYW55LCBrcGlJRDogc3RyaW5nKTogdm9pZCB7XG5cdFx0Y29uc3Qgb0tQSU1vZGVsID0gb0tQSVRhZy5nZXRNb2RlbChcImtwaU1vZGVsXCIpIGFzIEpTT05Nb2RlbDtcblxuXHRcdGlmICh0aGlzLmFLUElEZWZpbml0aW9ucyAmJiB0aGlzLmFLUElEZWZpbml0aW9ucy5sZW5ndGgpIHtcblx0XHRcdGNvbnN0IGtwaURlZmluaXRpb24gPSB0aGlzLmFLUElEZWZpbml0aW9ucy5maW5kKGZ1bmN0aW9uIChvRGVmKSB7XG5cdFx0XHRcdHJldHVybiBvRGVmLmlkID09PSBrcGlJRDtcblx0XHRcdH0pO1xuXG5cdFx0XHRpZiAoa3BpRGVmaW5pdGlvbikge1xuXHRcdFx0XHRjb25zdCBvTW9kZWwgPSBvS1BJVGFnLmdldE1vZGVsKCk7XG5cdFx0XHRcdGNvbnN0IGFQcm9taXNlcyA9IFtcblx0XHRcdFx0XHR0aGlzLmxvYWRLUElUYWdEYXRhKGtwaURlZmluaXRpb24sIG9Nb2RlbCwgb0tQSU1vZGVsLCB0cnVlKSxcblx0XHRcdFx0XHR0aGlzLmxvYWRLUElDYXJkRGF0YShrcGlEZWZpbml0aW9uLCBvTW9kZWwsIG9LUElNb2RlbCksXG5cdFx0XHRcdFx0dGhpcy5nZXRQb3BvdmVyKG9LUElUYWcpXG5cdFx0XHRcdF07XG5cblx0XHRcdFx0UHJvbWlzZS5hbGwoYVByb21pc2VzKVxuXHRcdFx0XHRcdC50aGVuKChhUmVzdWx0cykgPT4ge1xuXHRcdFx0XHRcdFx0dGhpcy5vQ2FyZC5zZXRNYW5pZmVzdChvS1BJTW9kZWwuZ2V0UHJvcGVydHkoYC8ke2twaUlEfS9tYW5pZmVzdGApKTtcblx0XHRcdFx0XHRcdHRoaXMub0NhcmQucmVmcmVzaCgpO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBvUG9wb3ZlciA9IGFSZXN1bHRzWzJdO1xuXHRcdFx0XHRcdFx0b1BvcG92ZXIub3BlbkJ5KG9LUElUYWcsIGZhbHNlKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5jYXRjaCgoZXJyKSA9PiB7XG5cdFx0XHRcdFx0XHRMb2cuZXJyb3IoZXJyKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1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