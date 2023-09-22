/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/CommonUtils", "sap/fe/macros/internal/valuehelp/ValueListHelper", "sap/ui/core/Fragment", "sap/ui/core/util/XMLPreprocessor", "sap/ui/core/XMLTemplateProcessor", "sap/ui/Device", "sap/ui/dom/units/Rem", "sap/ui/mdc/valuehelp/content/Conditions", "sap/ui/mdc/valuehelp/content/MDCTable", "sap/ui/mdc/valuehelp/content/MTable", "sap/ui/model/json/JSONModel"], function (Log, CommonUtils, ValueListHelperCommon, Fragment, XMLPreprocessor, XMLTemplateProcessor, Device, Rem, Conditions, MDCTable, MTable, JSONModel) {
  "use strict";

  var system = Device.system;
  var Level = Log.Level;

  function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function () {}; return { s: F, n: function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function (e) { throw e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function () { it = it.call(o); }, n: function () { var step = it.next(); normalCompletion = step.done; return step; }, e: function (e) { didErr = true; err = e; }, f: function () { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _catch(body, recover) {
    try {
      var result = body();
    } catch (e) {
      return recover(e);
    }

    if (result && result.then) {
      return result.then(void 0, recover);
    }

    return result;
  }

  //was in helpers.d.ts:
  //declare module "sap/ui/dom/units/Rem" {
  //	function fromPx(vPx: string | float): float;
  //}
  var AnnotationLabel = "@com.sap.vocabularies.Common.v1.Label",
      AnnotationText = "@com.sap.vocabularies.Common.v1.Text",
      AnnotationTextUITextArrangement = "@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement",
      AnnotationValueListParameterIn = "com.sap.vocabularies.Common.v1.ValueListParameterIn",
      AnnotationValueListParameterConstant = "com.sap.vocabularies.Common.v1.ValueListParameterConstant",
      AnnotationValueListParameterOut = "com.sap.vocabularies.Common.v1.ValueListParameterOut",
      AnnotationValueListParameterInOut = "com.sap.vocabularies.Common.v1.ValueListParameterInOut",
      AnnotationValueListWithFixedValues = "@com.sap.vocabularies.Common.v1.ValueListWithFixedValues";
  var ValueListHelper = {
    entityIsSearchable: function (propertyAnnotations, collectionAnnotations) {
      var _propertyAnnotations$, _collectionAnnotation;

      var searchSupported = (_propertyAnnotations$ = propertyAnnotations["@com.sap.vocabularies.Common.v1.ValueList"]) === null || _propertyAnnotations$ === void 0 ? void 0 : _propertyAnnotations$.SearchSupported,
          searchable = (_collectionAnnotation = collectionAnnotations["@Org.OData.Capabilities.V1.SearchRestrictions"]) === null || _collectionAnnotation === void 0 ? void 0 : _collectionAnnotation.Searchable;

      if (searchable === undefined && searchSupported === false || searchable === true && searchSupported === false || searchable === false) {
        return false;
      }

      return true;
    },

    /**
     * Returns the condition path required for the condition model.
     * For e.g. <1:N-PropertyName>*\/<1:1-PropertyName>/<PropertyName>.
     *
     * @param metaModel The metamodel instance
     * @param entitySet The entity set path
     * @param propertyPath The property path
     * @returns The formatted condition path
     * @private
     */
    _getConditionPath: function (metaModel, entitySet, propertyPath) {
      // (see also: sap/fe/core/converters/controls/ListReport/FilterBar.ts)
      var parts = propertyPath.split("/");
      var conditionPath = "",
          partialPath;

      while (parts.length) {
        var part = parts.shift();
        partialPath = partialPath ? "".concat(partialPath, "/").concat(part) : part;
        var property = metaModel.getObject("".concat(entitySet, "/").concat(partialPath));

        if (property && property.$kind === "NavigationProperty" && property.$isCollection) {
          part += "*";
        }

        conditionPath = conditionPath ? "".concat(conditionPath, "/").concat(part) : part;
      }

      return conditionPath;
    },

    /**
     * Returns array of column definitions corresponding to properties defined as Selection Fields on the CollectionPath entity set in a ValueHelp.
     *
     * @param metaModel The metamodel instance
     * @param entitySet The entity set path
     * @returns Array of column definitions
     * @private
     */
    _getColumnDefinitionFromSelectionFields: function (metaModel, entitySet) {
      var columnDefs = [],
          //selectionFields = metaModel.getObject(entitySet + "/@com.sap.vocabularies.UI.v1.SelectionFields") as SelectionField[] | undefined;
      entityTypeAnnotations = metaModel.getObject("".concat(entitySet, "/@")),
          selectionFields = entityTypeAnnotations["@com.sap.vocabularies.UI.v1.SelectionFields"];

      if (selectionFields) {
        selectionFields.forEach(function (selectionField) {
          var selectionFieldPath = "".concat(entitySet, "/").concat(selectionField.$PropertyPath),
              conditionPath = ValueListHelper._getConditionPath(metaModel, entitySet, selectionField.$PropertyPath),
              propertyAnnotations = metaModel.getObject("".concat(selectionFieldPath, "@")),
              columnDef = {
            path: conditionPath,
            label: propertyAnnotations[AnnotationLabel] || selectionFieldPath,
            sortable: true,
            filterable: CommonUtils.isPropertyFilterable(metaModel, entitySet, selectionField.$PropertyPath, false),
            $Type: metaModel.getObject(selectionFieldPath).$Type
          };

          columnDefs.push(columnDef);
        });
      }

      return columnDefs;
    },
    _mergeColumnDefinitionsFromProperties: function (columnDefs, valueListInfo, valueListProperty, property, propertyAnnotations) {
      var _propertyAnnotations$2;

      var columnPath = valueListProperty,
          columnPropertyType = property.$Type;
      var label = propertyAnnotations[AnnotationLabel] || columnPath,
          textAnnotation = propertyAnnotations[AnnotationText];

      if (textAnnotation && ((_propertyAnnotations$2 = propertyAnnotations[AnnotationTextUITextArrangement]) === null || _propertyAnnotations$2 === void 0 ? void 0 : _propertyAnnotations$2.$EnumMember) === "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly") {
        // the column property is the one coming from the text annotation
        columnPath = textAnnotation.$Path;
        var textPropertyPath = "/".concat(valueListInfo.CollectionPath, "/").concat(columnPath);
        columnPropertyType = valueListInfo.$model.getMetaModel().getObject(textPropertyPath).$Type;
      }

      var columnNotAlreadyDefined = columnDefs.findIndex(function (col) {
        return col.path === columnPath;
      }) === -1;

      if (columnNotAlreadyDefined) {
        var columnDef = {
          path: columnPath,
          label: label,
          sortable: true,
          filterable: !propertyAnnotations["@com.sap.vocabularies.UI.v1.HiddenFilter"],
          $Type: columnPropertyType
        };
        columnDefs.push(columnDef);
      }
    },
    filterInOutParameters: function (vhParameters, typeFilter) {
      return vhParameters.filter(function (parameter) {
        return typeFilter.indexOf(parameter.parmeterType) > -1;
      });
    },
    getInParameters: function (vhParameters) {
      return ValueListHelper.filterInOutParameters(vhParameters, [AnnotationValueListParameterIn, AnnotationValueListParameterConstant, AnnotationValueListParameterInOut]);
    },
    getOutParameters: function (vhParameters) {
      return ValueListHelper.filterInOutParameters(vhParameters, [AnnotationValueListParameterOut, AnnotationValueListParameterInOut]);
    },
    createVHUIModel: function (valueHelp, propertyPath, metaModel) {
      // setting the _VHUI model evaluated in the ValueListTable fragment
      var vhUIModel = new JSONModel({}),
          propertyAnnotations = metaModel.getObject("".concat(propertyPath, "@"));
      valueHelp.setModel(vhUIModel, "_VHUI"); // Identifies the "ContextDependent-Scenario"

      vhUIModel.setProperty("/hasValueListRelevantQualifiers", !!propertyAnnotations["@com.sap.vocabularies.Common.v1.ValueListRelevantQualifiers"]);
      return vhUIModel;
    },
    destroyVHContent: function (valueHelp) {
      if (valueHelp.getDialog()) {
        valueHelp.getDialog().destroyContent();
      }

      if (valueHelp.getTypeahead()) {
        valueHelp.getTypeahead().destroyContent();
      }
    },
    putDefaultQualifierFirst: function (qualifiers) {
      var indexDefaultVH = qualifiers.indexOf(""); // default ValueHelp without qualifier should be the first

      if (indexDefaultVH > 0) {
        qualifiers.unshift(qualifiers[indexDefaultVH]);
        qualifiers.splice(indexDefaultVH + 1, 1);
      }

      return qualifiers;
    },
    getValueListInfo: function (valueHelp, propertyPath, payload) {
      try {
        var _this2 = this;

        var bindingContext = valueHelp.getBindingContext(),
            conditionModel = payload.conditionModel,
            vhMetaModel = valueHelp.getModel().getMetaModel(),
            valueListInfos = [];

        var _temp2 = _catch(function () {
          return Promise.resolve(vhMetaModel.requestValueListInfo(propertyPath, true, bindingContext)).then(function (_vhMetaModel$requestV) {
            var valueListByQualifier = _vhMetaModel$requestV;

            var valueHelpQualifiers = _this2.putDefaultQualifierFirst(Object.keys(valueListByQualifier)),
                propertyName = propertyPath.split("/").pop();

            var contextPrefix = "";

            if (payload.useMultiValueField && bindingContext && bindingContext.getPath()) {
              var aBindigContextParts = bindingContext.getPath().split("/");
              var aPropertyBindingParts = propertyPath.split("/");

              if (aPropertyBindingParts.length - aBindigContextParts.length > 1) {
                var aContextPrefixParts = [];

                for (var i = aBindigContextParts.length; i < aPropertyBindingParts.length - 1; i++) {
                  aContextPrefixParts.push(aPropertyBindingParts[i]);
                }

                contextPrefix = "".concat(aContextPrefixParts.join("/"), "/");
              }
            }

            valueHelpQualifiers.forEach(function (valueHelpQualifier) {
              var _metaModel$getObject;

              // Add column definitions for properties defined as Selection fields on the CollectionPath entity set.
              var annotationValueListType = valueListByQualifier[valueHelpQualifier],
                  metaModel = annotationValueListType.$model.getMetaModel(),
                  entitySetPath = "/".concat(annotationValueListType.CollectionPath),
                  columnDefs = ValueListHelper._getColumnDefinitionFromSelectionFields(metaModel, entitySetPath),
                  vhParameters = [],
                  vhKeys = (_metaModel$getObject = metaModel.getObject(entitySetPath + "/")) !== null && _metaModel$getObject !== void 0 && _metaModel$getObject.$Key ? _toConsumableArray(metaModel.getObject(entitySetPath + "/").$Key) : [];

              var fieldPropertyPath = "",
                  descriptionPath = "",
                  key = "";
              annotationValueListType.Parameters.forEach(function (parameter) {
                //All String fields are allowed for filter
                var propertyPath2 = "/".concat(annotationValueListType.CollectionPath, "/").concat(parameter.ValueListProperty),
                    property = metaModel.getObject(propertyPath2),
                    propertyAnnotations = metaModel.getObject("".concat(propertyPath2, "@")) || {}; // If property is undefined, then the property coming for the entry isn't defined in
                // the metamodel, therefore we don't need to add it in the in/out parameters

                if (property) {
                  // Search for the *out Parameter mapped to the local property
                  if (!key && (parameter.$Type === AnnotationValueListParameterOut || parameter.$Type === AnnotationValueListParameterInOut) && parameter.LocalDataProperty.$PropertyPath === propertyName) {
                    var _propertyAnnotations$3;

                    fieldPropertyPath = propertyPath2;
                    key = parameter.ValueListProperty; //Only the text annotation of the key can specify the description

                    descriptionPath = ((_propertyAnnotations$3 = propertyAnnotations[AnnotationText]) === null || _propertyAnnotations$3 === void 0 ? void 0 : _propertyAnnotations$3.$Path) || "";
                  }

                  var valueListProperty = parameter.ValueListProperty;

                  ValueListHelper._mergeColumnDefinitionsFromProperties(columnDefs, annotationValueListType, valueListProperty, property, propertyAnnotations);
                } //In and InOut


                if ((parameter.$Type === AnnotationValueListParameterIn || parameter.$Type === AnnotationValueListParameterInOut || parameter.$Type === AnnotationValueListParameterOut) && parameter.LocalDataProperty.$PropertyPath !== propertyName) {
                  var valuePath = "";

                  if (conditionModel && conditionModel.length > 0) {
                    if (valueHelp.getParent().isA("sap.ui.mdc.Table") && valueHelp.getBindingContext() && (parameter.$Type === AnnotationValueListParameterIn || parameter.$Type === AnnotationValueListParameterInOut)) {
                      // Special handling for value help used in filter dialog
                      var parts = parameter.LocalDataProperty.$PropertyPath.split("/");

                      if (parts.length > 1) {
                        var firstNavigationProperty = parts[0];
                        var oBoundEntity = vhMetaModel.getMetaContext(bindingContext.getPath());
                        var sPathOfTable = valueHelp.getParent().getRowBinding().getPath(); //TODO

                        if (oBoundEntity.getObject("".concat(sPathOfTable, "/$Partner")) === firstNavigationProperty) {
                          // Using the condition model doesn't make any sense in case an in-parameter uses a navigation property
                          // referring to the partner. Therefore reducing the path and using the FVH context instead of the condition model
                          valuePath = parameter.LocalDataProperty.$PropertyPath.replace(firstNavigationProperty + "/", "");
                        }
                      }
                    }

                    if (!valuePath) {
                      valuePath = conditionModel + ">/conditions/" + parameter.LocalDataProperty.$PropertyPath;
                    }
                  } else {
                    valuePath = contextPrefix + parameter.LocalDataProperty.$PropertyPath;
                  }

                  vhParameters.push({
                    parmeterType: parameter.$Type,
                    source: valuePath,
                    helpPath: parameter.ValueListProperty,
                    constantValue: parameter.Constant,
                    initialValueFilterEmpty: parameter.InitialValueIsSignificant
                  });
                } //Constant as InParamter for filtering


                if (parameter.$Type === AnnotationValueListParameterConstant) {
                  vhParameters.push({
                    parmeterType: parameter.$Type,
                    source: parameter.ValueListProperty,
                    helpPath: parameter.ValueListProperty,
                    constantValue: parameter.Constant,
                    initialValueFilterEmpty: parameter.InitialValueIsSignificant
                  });
                } // Enrich keys with out-parameters


                if ((parameter.$Type === AnnotationValueListParameterInOut || parameter.$Type === AnnotationValueListParameterOut) && !vhKeys.includes(parameter.ValueListProperty)) {
                  vhKeys.push(parameter.ValueListProperty);
                }
              });
              /* Ensure that vhKeys are part of the columnDefs, otherwise it is not considered in $select (BCP 2270141154) */

              var _iterator = _createForOfIteratorHelper(vhKeys),
                  _step;

              try {
                var _loop = function () {
                  var vhKey = _step.value;

                  if (columnDefs.findIndex(function (column) {
                    return column.path === vhKey;
                  }) === -1) {
                    var columnDef = {
                      path: vhKey,
                      $Type: metaModel.getObject("/".concat(annotationValueListType.CollectionPath, "/").concat(key)).$Type,
                      label: "",
                      sortable: false,
                      filterable: undefined
                    };
                    columnDefs.push(columnDef);
                  }
                };

                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  _loop();
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }

              ;
              var valueListInfo = {
                keyValue: key,
                descriptionValue: descriptionPath,
                fieldPropertyPath: fieldPropertyPath,
                vhKeys: vhKeys,
                vhParameters: vhParameters,
                valueListInfo: annotationValueListType,
                columnDefs: columnDefs,
                valueHelpQualifier: valueHelpQualifier
              };
              valueListInfos.push(valueListInfo);
            });
          });
        }, function (err) {
          var errStatus = err.status,
              msg = errStatus && errStatus === 404 ? "Metadata not found (".concat(errStatus, ") for value help of property ").concat(propertyPath) : err.message;
          Log.error(msg);
          ValueListHelper.destroyVHContent(valueHelp);
        });

        return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {
          return valueListInfos;
        }) : valueListInfos);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    ALLFRAGMENTS: undefined,
    logFragment: undefined,
    _logTemplatedFragments: function (propertyPath, fragmentName, fragmentDefinition) {
      var logInfo = {
        path: propertyPath,
        fragmentName: fragmentName,
        fragment: fragmentDefinition
      };

      if (Log.getLevel() === Level.DEBUG) {
        //In debug mode we log all generated fragments
        ValueListHelper.ALLFRAGMENTS = ValueListHelper.ALLFRAGMENTS || [];
        ValueListHelper.ALLFRAGMENTS.push(logInfo);
      }

      if (ValueListHelper.logFragment) {
        //One Tool Subscriber allowed
        setTimeout(function () {
          ValueListHelper.logFragment(logInfo);
        }, 0);
      }
    },
    _templateFragment: function (fragmentName, valueListInfo, sourceModel, propertyPath, additionalViewData) {
      try {
        var mValueListInfo = valueListInfo.valueListInfo,
            valueListModel = new JSONModel(mValueListInfo),
            valueListServiceMetaModel = mValueListInfo.$model.getMetaModel(),
            viewData = new JSONModel(Object.assign({
          converterType: "ListReport",
          columns: valueListInfo.columnDefs || null
        }, additionalViewData));
        return Promise.resolve(Promise.resolve(XMLPreprocessor.process(XMLTemplateProcessor.loadTemplate(fragmentName, "fragment"), {
          name: fragmentName
        }, {
          bindingContexts: {
            valueList: valueListModel.createBindingContext("/"),
            contextPath: valueListServiceMetaModel.createBindingContext("/".concat(mValueListInfo.CollectionPath, "/")),
            source: sourceModel.createBindingContext("/")
          },
          models: {
            valueList: valueListModel,
            contextPath: valueListServiceMetaModel,
            source: sourceModel,
            metaModel: valueListServiceMetaModel,
            viewData: viewData
          }
        }))).then(function (fragmentDefinition) {
          ValueListHelper._logTemplatedFragments(propertyPath, fragmentName, fragmentDefinition);

          return Promise.resolve(Fragment.load({
            definition: fragmentDefinition
          }));
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    _getContentId: function (valueHelpId, valueHelpQualifier, isTypeahead) {
      var contentType = isTypeahead ? "Popover" : "Dialog";
      return "".concat(valueHelpId, "::").concat(contentType, "::qualifier::").concat(valueHelpQualifier);
    },
    _addInOutParametersToPayload: function (payload, valueListInfo) {
      var valueHelpQualifier = valueListInfo.valueHelpQualifier;

      if (!payload.qualifiers) {
        payload.qualifiers = {};
      }

      if (!payload.qualifiers[valueHelpQualifier]) {
        payload.qualifiers[valueHelpQualifier] = {
          vhKeys: valueListInfo.vhKeys,
          vhParameters: valueListInfo.vhParameters
        };
      }
    },
    _getValueHelpColumnDisplayFormat: function (propertyAnnotations, isValueHelpWithFixedValues) {
      var displayMode = CommonUtils.computeDisplayMode(propertyAnnotations, undefined),
          textAnnotation = propertyAnnotations && propertyAnnotations[AnnotationText],
          textArrangementAnnotation = textAnnotation && propertyAnnotations[AnnotationTextUITextArrangement];

      if (isValueHelpWithFixedValues) {
        return textAnnotation && typeof textAnnotation !== "string" && textAnnotation.$Path ? displayMode : "Value";
      } else {
        // Only explicit defined TextArrangements in a Value Help with Dialog are considered
        return textArrangementAnnotation ? displayMode : "Value";
      }
    },
    _getWidthInRem: function (control, isUnitValueHelp) {
      var width = control.$().width(); // JQuery

      if (isUnitValueHelp && width) {
        width = 0.3 * width;
      }

      var floatWidth = width ? parseFloat(String(Rem.fromPx(width))) : 0;
      return isNaN(floatWidth) ? 0 : floatWidth;
    },
    getTableWidth: function (table, minWidth) {
      var width;
      var columns = table.getColumns(),
          visibleColumns = columns && columns.filter(function (column) {
        return column && column.getVisible && column.getVisible();
      }) || [],
          sumWidth = visibleColumns.reduce(function (sum, column) {
        width = column.getWidth();

        if (width && width.endsWith("px")) {
          width = String(Rem.fromPx(width));
        }

        var floatWidth = parseFloat(width);
        return sum + (isNaN(floatWidth) ? 9 : floatWidth);
      }, visibleColumns.length);
      return "".concat(Math.max(sumWidth, minWidth), "em");
    },
    createValueHelpTypeahead: function (propertyPath, valueHelp, content, valueListInfo, payload) {
      var contentId = content.getId(),
          propertyAnnotations = valueHelp.getModel().getMetaModel().getObject("".concat(propertyPath, "@")),
          valueHelpWithFixedValues = propertyAnnotations[AnnotationValueListWithFixedValues] || false,
          isDialogTable = false,
          columnInfo = ValueListHelperCommon.getColumnVisibilityInfo(valueListInfo.valueListInfo, propertyPath, valueHelpWithFixedValues, isDialogTable),
          sourceModel = new JSONModel({
        id: contentId,
        groupId: payload.requestGroupId || undefined,
        bSuggestion: true,
        propertyPath: propertyPath,
        columnInfo: columnInfo,
        valueHelpWithFixedValues: propertyAnnotations[AnnotationValueListWithFixedValues]
      });
      content.setKeyPath(valueListInfo.keyValue);
      content.setDescriptionPath(valueListInfo.descriptionValue);
      var collectionAnnotations = valueListInfo.valueListInfo.$model.getMetaModel().getObject("/".concat(valueListInfo.valueListInfo.CollectionPath, "@")) || {};
      content.setFilterFields(ValueListHelper.entityIsSearchable(propertyAnnotations, collectionAnnotations) ? "$search" : "");

      var tableOrPromise = content.getTable() || ValueListHelper._templateFragment("sap.fe.macros.internal.valuehelp.ValueListTable", valueListInfo, sourceModel, propertyPath);

      return Promise.all([tableOrPromise]).then(function (controls) {
        var table = controls[0];
        table.setModel(valueListInfo.valueListInfo.$model);
        Log.info("Value List- suggest Table XML content created [".concat(propertyPath, "]"), table.getMetadata().getName(), "MDC Templating");
        content.setTable(table);
        var field = valueHelp.getControl();

        if (field && (field.isA("sap.ui.mdc.FilterField") || field.isA("sap.ui.mdc.Field") || field.isA("sap.ui.mdc.MultiValueField"))) {
          //Can the filterfield be something else that we need the .isA() check?
          var reduceWidthForUnitValueHelp = Boolean(payload.isUnitValueHelp);
          var tableWidth = ValueListHelper.getTableWidth(table, ValueListHelper._getWidthInRem(field, reduceWidthForUnitValueHelp));
          table.setWidth(tableWidth);

          if (valueHelpWithFixedValues) {
            table.setMode(field.getMaxConditions() === 1 ? "SingleSelectMaster" : "MultiSelect");
          } else {
            table.setMode("SingleSelectMaster");
          }
        }
      });
    },
    createValueHelpDialog: function (propertyPath, valueHelp, content, valueListInfo, payload) {
      var propertyAnnotations = valueHelp.getModel().getMetaModel().getObject("".concat(propertyPath, "@")),
          isDropDownListe = false,
          isDialogTable = true,
          columnInfo = ValueListHelperCommon.getColumnVisibilityInfo(valueListInfo.valueListInfo, propertyPath, isDropDownListe, isDialogTable),
          sourceModel = new JSONModel({
        id: content.getId(),
        groupId: payload.requestGroupId || undefined,
        bSuggestion: false,
        columnInfo: columnInfo,
        valueHelpWithFixedValues: isDropDownListe
      });
      content.setKeyPath(valueListInfo.keyValue);
      content.setDescriptionPath(valueListInfo.descriptionValue);
      var collectionAnnotations = valueListInfo.valueListInfo.$model.getMetaModel().getObject("/".concat(valueListInfo.valueListInfo.CollectionPath, "@")) || {};
      content.setFilterFields(ValueListHelper.entityIsSearchable(propertyAnnotations, collectionAnnotations) ? "$search" : "");

      var tableOrPromise = content.getTable() || ValueListHelper._templateFragment("sap.fe.macros.internal.valuehelp.ValueListDialogTable", valueListInfo, sourceModel, propertyPath, {
        enableAutoColumnWidth: !system.phone
      });

      var filterBarOrPromise = content.getFilterBar() || ValueListHelper._templateFragment("sap.fe.macros.internal.valuehelp.ValueListFilterBar", valueListInfo, sourceModel, propertyPath);

      return Promise.all([tableOrPromise, filterBarOrPromise]).then(function (controls) {
        var table = controls[0],
            filterBar = controls[1];
        table.setModel(valueListInfo.valueListInfo.$model);
        filterBar.setModel(valueListInfo.valueListInfo.$model);
        content.setFilterBar(filterBar);
        content.setTable(table);
        table.setFilter(filterBar.getId());
        table.initialized();
        var field = valueHelp.getControl();

        if (field) {
          table.setSelectionMode(field.getMaxConditions() === 1 ? "Single" : "Multi");
        }

        table.setWidth("100%"); //This is a temporary workarround - provided by MDC (see FIORITECHP1-24002)

        var mdcTable = table;

        mdcTable._setShowP13nButton(false);
      });
    },
    _getContentById: function (contentList, contentId) {
      return contentList.find(function (item) {
        return item.getId() === contentId;
      });
    },
    _createPopoverContent: function (contentId, caseSensitive) {
      return new MTable({
        id: contentId,
        group: "group1",
        caseSensitive: caseSensitive
      }); //as $MTableSettings
    },
    _createDialogContent: function (contentId, caseSensitive, forceBind) {
      return new MDCTable({
        id: contentId,
        group: "group1",
        caseSensitive: caseSensitive,
        forceBind: forceBind
      }); //as $MDCTableSettings
    },
    showValueList: function (payload, container, selectedContentId) {
      var valueHelp = container.getParent(),
          isTypeahead = container.isTypeahead(),
          propertyPath = payload.propertyPath,
          metaModel = valueHelp.getModel().getMetaModel(),
          vhUIModel = valueHelp.getModel("_VHUI") || ValueListHelper.createVHUIModel(valueHelp, propertyPath, metaModel),
          showConditionPanel = valueHelp.data("showConditionPanel") && valueHelp.data("showConditionPanel") !== "false";

      if (!payload.qualifiers) {
        payload.qualifiers = {};
      }

      vhUIModel.setProperty("/isSuggestion", isTypeahead);
      vhUIModel.setProperty("/minScreenWidth", !isTypeahead ? "418px" : undefined);
      return ValueListHelper.getValueListInfo(valueHelp, propertyPath, payload).then(function (valueListInfos) {
        var caseSensitive = valueHelp.getTypeahead().getContent()[0].getCaseSensitive(); // take caseSensitive from first Typeahead content

        var contentList = container.getContent();

        if (isTypeahead) {
          var qualifierForTypeahead = valueHelp.data("valuelistForValidation") || ""; // can also be null

          if (qualifierForTypeahead === " ") {
            qualifierForTypeahead = "";
          }

          var valueListInfo = qualifierForTypeahead ? valueListInfos.filter(function (subValueListInfo) {
            return subValueListInfo.valueHelpQualifier === qualifierForTypeahead;
          })[0] : valueListInfos[0];

          ValueListHelper._addInOutParametersToPayload(payload, valueListInfo);

          var contentId = ValueListHelper._getContentId(valueHelp.getId(), valueListInfo.valueHelpQualifier, isTypeahead);

          var content = ValueListHelper._getContentById(contentList, contentId);

          if (!content) {
            content = ValueListHelper._createPopoverContent(contentId, caseSensitive);
            container.insertContent(content, 0); // insert content as first content

            contentList = container.getContent();
          } else if (contentId !== contentList[0].getId()) {
            // content already available but not as first content?
            container.removeContent(content);
            container.insertContent(content, 0); // move content to first position

            contentList = container.getContent();
          }

          payload.valueHelpQualifier = valueListInfo.valueHelpQualifier;
          content.setTitle(valueListInfo.valueListInfo.Label);
          return ValueListHelper.createValueHelpTypeahead(propertyPath, valueHelp, content, valueListInfo, payload);
        } else {
          // Dialog
          // set all contents to invisible
          for (var i = 0; i < contentList.length; i += 1) {
            contentList[i].setVisible(false);
          }

          if (showConditionPanel) {
            var conditionsContent = contentList.length && contentList[contentList.length - 1].getMetadata().getName() === "sap.ui.mdc.valuehelp.content.Conditions" ? contentList[contentList.length - 1] : undefined;

            if (conditionsContent) {
              conditionsContent.setVisible(true);
            } else {
              conditionsContent = new Conditions();
              container.addContent(conditionsContent);
              contentList = container.getContent();
            }
          }

          var selectedInfo, selectedContent; // Create or reuse contents for the current context

          for (var _i = 0; _i < valueListInfos.length; _i += 1) {
            var _valueListInfo = valueListInfos[_i],
                valueHelpQualifier = _valueListInfo.valueHelpQualifier;

            ValueListHelper._addInOutParametersToPayload(payload, _valueListInfo);

            var _contentId = ValueListHelper._getContentId(valueHelp.getId(), valueHelpQualifier, isTypeahead);

            var _content = ValueListHelper._getContentById(contentList, _contentId);

            if (!_content) {
              var forceBind = _valueListInfo.valueListInfo.FetchValues == 2 ? false : true;
              _content = ValueListHelper._createDialogContent(_contentId, caseSensitive, forceBind);

              if (!showConditionPanel) {
                container.addContent(_content);
              } else {
                container.insertContent(_content, contentList.length - 1); // insert content before conditions content
              }

              contentList = container.getContent();
            } else {
              _content.setVisible(true);
            }

            _content.setTitle(_valueListInfo.valueListInfo.Label);

            if (!selectedContent || selectedContentId && selectedContentId === _contentId) {
              selectedContent = _content;
              selectedInfo = _valueListInfo;
            }
          }

          if (!selectedInfo || !selectedContent) {
            throw new Error("selectedInfo or selectedContent undefined");
          }

          payload.valueHelpQualifier = selectedInfo.valueHelpQualifier;
          container.setTitle(selectedInfo.valueListInfo.Label);
          return ValueListHelper.createValueHelpDialog(propertyPath, valueHelp, selectedContent, selectedInfo, payload);
        }
      }).catch(function (err) {
        var errStatus = err.status,
            msg = errStatus && errStatus === 404 ? "Metadata not found (".concat(errStatus, ") for value help of property ").concat(propertyPath) : err.message;
        Log.error(msg);
        ValueListHelper.destroyVHContent(valueHelp);
      });
    }
  };
  return ValueListHelper;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJib2R5IiwicmVjb3ZlciIsInJlc3VsdCIsImUiLCJ0aGVuIiwiQW5ub3RhdGlvbkxhYmVsIiwiQW5ub3RhdGlvblRleHQiLCJBbm5vdGF0aW9uVGV4dFVJVGV4dEFycmFuZ2VtZW50IiwiQW5ub3RhdGlvblZhbHVlTGlzdFBhcmFtZXRlckluIiwiQW5ub3RhdGlvblZhbHVlTGlzdFBhcmFtZXRlckNvbnN0YW50IiwiQW5ub3RhdGlvblZhbHVlTGlzdFBhcmFtZXRlck91dCIsIkFubm90YXRpb25WYWx1ZUxpc3RQYXJhbWV0ZXJJbk91dCIsIkFubm90YXRpb25WYWx1ZUxpc3RXaXRoRml4ZWRWYWx1ZXMiLCJWYWx1ZUxpc3RIZWxwZXIiLCJlbnRpdHlJc1NlYXJjaGFibGUiLCJwcm9wZXJ0eUFubm90YXRpb25zIiwiY29sbGVjdGlvbkFubm90YXRpb25zIiwic2VhcmNoU3VwcG9ydGVkIiwiU2VhcmNoU3VwcG9ydGVkIiwic2VhcmNoYWJsZSIsIlNlYXJjaGFibGUiLCJ1bmRlZmluZWQiLCJfZ2V0Q29uZGl0aW9uUGF0aCIsIm1ldGFNb2RlbCIsImVudGl0eVNldCIsInByb3BlcnR5UGF0aCIsInBhcnRzIiwic3BsaXQiLCJjb25kaXRpb25QYXRoIiwicGFydGlhbFBhdGgiLCJsZW5ndGgiLCJwYXJ0Iiwic2hpZnQiLCJwcm9wZXJ0eSIsImdldE9iamVjdCIsIiRraW5kIiwiJGlzQ29sbGVjdGlvbiIsIl9nZXRDb2x1bW5EZWZpbml0aW9uRnJvbVNlbGVjdGlvbkZpZWxkcyIsImNvbHVtbkRlZnMiLCJlbnRpdHlUeXBlQW5ub3RhdGlvbnMiLCJzZWxlY3Rpb25GaWVsZHMiLCJmb3JFYWNoIiwic2VsZWN0aW9uRmllbGQiLCJzZWxlY3Rpb25GaWVsZFBhdGgiLCIkUHJvcGVydHlQYXRoIiwiY29sdW1uRGVmIiwicGF0aCIsImxhYmVsIiwic29ydGFibGUiLCJmaWx0ZXJhYmxlIiwiQ29tbW9uVXRpbHMiLCJpc1Byb3BlcnR5RmlsdGVyYWJsZSIsIiRUeXBlIiwicHVzaCIsIl9tZXJnZUNvbHVtbkRlZmluaXRpb25zRnJvbVByb3BlcnRpZXMiLCJ2YWx1ZUxpc3RJbmZvIiwidmFsdWVMaXN0UHJvcGVydHkiLCJjb2x1bW5QYXRoIiwiY29sdW1uUHJvcGVydHlUeXBlIiwidGV4dEFubm90YXRpb24iLCIkRW51bU1lbWJlciIsIiRQYXRoIiwidGV4dFByb3BlcnR5UGF0aCIsIkNvbGxlY3Rpb25QYXRoIiwiJG1vZGVsIiwiZ2V0TWV0YU1vZGVsIiwiY29sdW1uTm90QWxyZWFkeURlZmluZWQiLCJmaW5kSW5kZXgiLCJjb2wiLCJmaWx0ZXJJbk91dFBhcmFtZXRlcnMiLCJ2aFBhcmFtZXRlcnMiLCJ0eXBlRmlsdGVyIiwiZmlsdGVyIiwicGFyYW1ldGVyIiwiaW5kZXhPZiIsInBhcm1ldGVyVHlwZSIsImdldEluUGFyYW1ldGVycyIsImdldE91dFBhcmFtZXRlcnMiLCJjcmVhdGVWSFVJTW9kZWwiLCJ2YWx1ZUhlbHAiLCJ2aFVJTW9kZWwiLCJKU09OTW9kZWwiLCJzZXRNb2RlbCIsInNldFByb3BlcnR5IiwiZGVzdHJveVZIQ29udGVudCIsImdldERpYWxvZyIsImRlc3Ryb3lDb250ZW50IiwiZ2V0VHlwZWFoZWFkIiwicHV0RGVmYXVsdFF1YWxpZmllckZpcnN0IiwicXVhbGlmaWVycyIsImluZGV4RGVmYXVsdFZIIiwidW5zaGlmdCIsInNwbGljZSIsImdldFZhbHVlTGlzdEluZm8iLCJwYXlsb2FkIiwiYmluZGluZ0NvbnRleHQiLCJnZXRCaW5kaW5nQ29udGV4dCIsImNvbmRpdGlvbk1vZGVsIiwidmhNZXRhTW9kZWwiLCJnZXRNb2RlbCIsInZhbHVlTGlzdEluZm9zIiwicmVxdWVzdFZhbHVlTGlzdEluZm8iLCJ2YWx1ZUxpc3RCeVF1YWxpZmllciIsInZhbHVlSGVscFF1YWxpZmllcnMiLCJPYmplY3QiLCJrZXlzIiwicHJvcGVydHlOYW1lIiwicG9wIiwiY29udGV4dFByZWZpeCIsInVzZU11bHRpVmFsdWVGaWVsZCIsImdldFBhdGgiLCJhQmluZGlnQ29udGV4dFBhcnRzIiwiYVByb3BlcnR5QmluZGluZ1BhcnRzIiwiYUNvbnRleHRQcmVmaXhQYXJ0cyIsImkiLCJqb2luIiwidmFsdWVIZWxwUXVhbGlmaWVyIiwiYW5ub3RhdGlvblZhbHVlTGlzdFR5cGUiLCJlbnRpdHlTZXRQYXRoIiwidmhLZXlzIiwiJEtleSIsImZpZWxkUHJvcGVydHlQYXRoIiwiZGVzY3JpcHRpb25QYXRoIiwia2V5IiwiUGFyYW1ldGVycyIsInByb3BlcnR5UGF0aDIiLCJWYWx1ZUxpc3RQcm9wZXJ0eSIsIkxvY2FsRGF0YVByb3BlcnR5IiwidmFsdWVQYXRoIiwiZ2V0UGFyZW50IiwiaXNBIiwiZmlyc3ROYXZpZ2F0aW9uUHJvcGVydHkiLCJvQm91bmRFbnRpdHkiLCJnZXRNZXRhQ29udGV4dCIsInNQYXRoT2ZUYWJsZSIsImdldFJvd0JpbmRpbmciLCJyZXBsYWNlIiwic291cmNlIiwiaGVscFBhdGgiLCJjb25zdGFudFZhbHVlIiwiQ29uc3RhbnQiLCJpbml0aWFsVmFsdWVGaWx0ZXJFbXB0eSIsIkluaXRpYWxWYWx1ZUlzU2lnbmlmaWNhbnQiLCJpbmNsdWRlcyIsInZoS2V5IiwiY29sdW1uIiwia2V5VmFsdWUiLCJkZXNjcmlwdGlvblZhbHVlIiwiZXJyIiwiZXJyU3RhdHVzIiwic3RhdHVzIiwibXNnIiwibWVzc2FnZSIsIkxvZyIsImVycm9yIiwiQUxMRlJBR01FTlRTIiwibG9nRnJhZ21lbnQiLCJfbG9nVGVtcGxhdGVkRnJhZ21lbnRzIiwiZnJhZ21lbnROYW1lIiwiZnJhZ21lbnREZWZpbml0aW9uIiwibG9nSW5mbyIsImZyYWdtZW50IiwiZ2V0TGV2ZWwiLCJMZXZlbCIsIkRFQlVHIiwic2V0VGltZW91dCIsIl90ZW1wbGF0ZUZyYWdtZW50Iiwic291cmNlTW9kZWwiLCJhZGRpdGlvbmFsVmlld0RhdGEiLCJtVmFsdWVMaXN0SW5mbyIsInZhbHVlTGlzdE1vZGVsIiwidmFsdWVMaXN0U2VydmljZU1ldGFNb2RlbCIsInZpZXdEYXRhIiwiYXNzaWduIiwiY29udmVydGVyVHlwZSIsImNvbHVtbnMiLCJQcm9taXNlIiwicmVzb2x2ZSIsIlhNTFByZXByb2Nlc3NvciIsInByb2Nlc3MiLCJYTUxUZW1wbGF0ZVByb2Nlc3NvciIsImxvYWRUZW1wbGF0ZSIsIm5hbWUiLCJiaW5kaW5nQ29udGV4dHMiLCJ2YWx1ZUxpc3QiLCJjcmVhdGVCaW5kaW5nQ29udGV4dCIsImNvbnRleHRQYXRoIiwibW9kZWxzIiwiRnJhZ21lbnQiLCJsb2FkIiwiZGVmaW5pdGlvbiIsIl9nZXRDb250ZW50SWQiLCJ2YWx1ZUhlbHBJZCIsImlzVHlwZWFoZWFkIiwiY29udGVudFR5cGUiLCJfYWRkSW5PdXRQYXJhbWV0ZXJzVG9QYXlsb2FkIiwiX2dldFZhbHVlSGVscENvbHVtbkRpc3BsYXlGb3JtYXQiLCJpc1ZhbHVlSGVscFdpdGhGaXhlZFZhbHVlcyIsImRpc3BsYXlNb2RlIiwiY29tcHV0ZURpc3BsYXlNb2RlIiwidGV4dEFycmFuZ2VtZW50QW5ub3RhdGlvbiIsIl9nZXRXaWR0aEluUmVtIiwiY29udHJvbCIsImlzVW5pdFZhbHVlSGVscCIsIndpZHRoIiwiJCIsImZsb2F0V2lkdGgiLCJwYXJzZUZsb2F0IiwiU3RyaW5nIiwiUmVtIiwiZnJvbVB4IiwiaXNOYU4iLCJnZXRUYWJsZVdpZHRoIiwidGFibGUiLCJtaW5XaWR0aCIsImdldENvbHVtbnMiLCJ2aXNpYmxlQ29sdW1ucyIsImdldFZpc2libGUiLCJzdW1XaWR0aCIsInJlZHVjZSIsInN1bSIsImdldFdpZHRoIiwiZW5kc1dpdGgiLCJNYXRoIiwibWF4IiwiY3JlYXRlVmFsdWVIZWxwVHlwZWFoZWFkIiwiY29udGVudCIsImNvbnRlbnRJZCIsImdldElkIiwidmFsdWVIZWxwV2l0aEZpeGVkVmFsdWVzIiwiaXNEaWFsb2dUYWJsZSIsImNvbHVtbkluZm8iLCJWYWx1ZUxpc3RIZWxwZXJDb21tb24iLCJnZXRDb2x1bW5WaXNpYmlsaXR5SW5mbyIsImlkIiwiZ3JvdXBJZCIsInJlcXVlc3RHcm91cElkIiwiYlN1Z2dlc3Rpb24iLCJzZXRLZXlQYXRoIiwic2V0RGVzY3JpcHRpb25QYXRoIiwic2V0RmlsdGVyRmllbGRzIiwidGFibGVPclByb21pc2UiLCJnZXRUYWJsZSIsImFsbCIsImNvbnRyb2xzIiwiaW5mbyIsImdldE1ldGFkYXRhIiwiZ2V0TmFtZSIsInNldFRhYmxlIiwiZmllbGQiLCJnZXRDb250cm9sIiwicmVkdWNlV2lkdGhGb3JVbml0VmFsdWVIZWxwIiwiQm9vbGVhbiIsInRhYmxlV2lkdGgiLCJzZXRXaWR0aCIsInNldE1vZGUiLCJnZXRNYXhDb25kaXRpb25zIiwiY3JlYXRlVmFsdWVIZWxwRGlhbG9nIiwiaXNEcm9wRG93bkxpc3RlIiwiZW5hYmxlQXV0b0NvbHVtbldpZHRoIiwic3lzdGVtIiwicGhvbmUiLCJmaWx0ZXJCYXJPclByb21pc2UiLCJnZXRGaWx0ZXJCYXIiLCJmaWx0ZXJCYXIiLCJzZXRGaWx0ZXJCYXIiLCJzZXRGaWx0ZXIiLCJpbml0aWFsaXplZCIsInNldFNlbGVjdGlvbk1vZGUiLCJtZGNUYWJsZSIsIl9zZXRTaG93UDEzbkJ1dHRvbiIsIl9nZXRDb250ZW50QnlJZCIsImNvbnRlbnRMaXN0IiwiZmluZCIsIml0ZW0iLCJfY3JlYXRlUG9wb3ZlckNvbnRlbnQiLCJjYXNlU2Vuc2l0aXZlIiwiTVRhYmxlIiwiZ3JvdXAiLCJfY3JlYXRlRGlhbG9nQ29udGVudCIsImZvcmNlQmluZCIsIk1EQ1RhYmxlIiwic2hvd1ZhbHVlTGlzdCIsImNvbnRhaW5lciIsInNlbGVjdGVkQ29udGVudElkIiwic2hvd0NvbmRpdGlvblBhbmVsIiwiZGF0YSIsImdldENvbnRlbnQiLCJnZXRDYXNlU2Vuc2l0aXZlIiwicXVhbGlmaWVyRm9yVHlwZWFoZWFkIiwic3ViVmFsdWVMaXN0SW5mbyIsImluc2VydENvbnRlbnQiLCJyZW1vdmVDb250ZW50Iiwic2V0VGl0bGUiLCJMYWJlbCIsInNldFZpc2libGUiLCJjb25kaXRpb25zQ29udGVudCIsIkNvbmRpdGlvbnMiLCJhZGRDb250ZW50Iiwic2VsZWN0ZWRJbmZvIiwic2VsZWN0ZWRDb250ZW50IiwiRmV0Y2hWYWx1ZXMiLCJFcnJvciIsImNhdGNoIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJWYWx1ZUxpc3RIZWxwZXJOZXcudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvZywgeyBMZXZlbCB9IGZyb20gXCJzYXAvYmFzZS9Mb2dcIjtcbmltcG9ydCBDb21tb25VdGlscyBmcm9tIFwic2FwL2ZlL2NvcmUvQ29tbW9uVXRpbHNcIjtcbmltcG9ydCB0eXBlIHsgQ29tcGlsZWRCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb24gfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9CaW5kaW5nVG9vbGtpdFwiO1xuaW1wb3J0IFZhbHVlTGlzdEhlbHBlckNvbW1vbiBmcm9tIFwic2FwL2ZlL21hY3Jvcy9pbnRlcm5hbC92YWx1ZWhlbHAvVmFsdWVMaXN0SGVscGVyXCI7XG5pbXBvcnQgdHlwZSBUYWJsZSBmcm9tIFwic2FwL20vVGFibGVcIjtcbmltcG9ydCB0eXBlIENvbnRyb2wgZnJvbSBcInNhcC91aS9jb3JlL0NvbnRyb2xcIjtcbmltcG9ydCBGcmFnbWVudCBmcm9tIFwic2FwL3VpL2NvcmUvRnJhZ21lbnRcIjtcbmltcG9ydCBYTUxQcmVwcm9jZXNzb3IgZnJvbSBcInNhcC91aS9jb3JlL3V0aWwvWE1MUHJlcHJvY2Vzc29yXCI7XG5pbXBvcnQgWE1MVGVtcGxhdGVQcm9jZXNzb3IgZnJvbSBcInNhcC91aS9jb3JlL1hNTFRlbXBsYXRlUHJvY2Vzc29yXCI7XG5pbXBvcnQgeyBzeXN0ZW0gfSBmcm9tIFwic2FwL3VpL0RldmljZVwiO1xuaW1wb3J0IFJlbSBmcm9tIFwic2FwL3VpL2RvbS91bml0cy9SZW1cIjtcbmltcG9ydCB0eXBlIEZpZWxkQmFzZSBmcm9tIFwic2FwL3VpL21kYy9maWVsZC9GaWVsZEJhc2VcIjtcbmltcG9ydCB0eXBlIFZhbHVlSGVscCBmcm9tIFwic2FwL3VpL21kYy9WYWx1ZUhlbHBcIjtcbmltcG9ydCB0eXBlIENvbnRhaW5lciBmcm9tIFwic2FwL3VpL21kYy92YWx1ZWhlbHAvYmFzZS9Db250YWluZXJcIjtcbmltcG9ydCB0eXBlIENvbnRlbnQgZnJvbSBcInNhcC91aS9tZGMvdmFsdWVoZWxwL2Jhc2UvQ29udGVudFwiO1xuaW1wb3J0IENvbmRpdGlvbnMgZnJvbSBcInNhcC91aS9tZGMvdmFsdWVoZWxwL2NvbnRlbnQvQ29uZGl0aW9uc1wiO1xuaW1wb3J0IE1EQ1RhYmxlIGZyb20gXCJzYXAvdWkvbWRjL3ZhbHVlaGVscC9jb250ZW50L01EQ1RhYmxlXCI7XG5pbXBvcnQgTVRhYmxlIGZyb20gXCJzYXAvdWkvbWRjL3ZhbHVlaGVscC9jb250ZW50L01UYWJsZVwiO1xuaW1wb3J0IEpTT05Nb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL2pzb24vSlNPTk1vZGVsXCI7XG5pbXBvcnQgdHlwZSBDb250ZXh0IGZyb20gXCJzYXAvdWkvbW9kZWwvb2RhdGEvdjQvQ29udGV4dFwiO1xuaW1wb3J0IHR5cGUgT0RhdGFNZXRhTW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NC9PRGF0YU1ldGFNb2RlbFwiO1xuaW1wb3J0IHR5cGUgT0RhdGFNb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0L09EYXRhTW9kZWxcIjtcblxuLy93YXMgaW4gaGVscGVycy5kLnRzOlxuLy9kZWNsYXJlIG1vZHVsZSBcInNhcC91aS9kb20vdW5pdHMvUmVtXCIge1xuLy9cdGZ1bmN0aW9uIGZyb21QeCh2UHg6IHN0cmluZyB8IGZsb2F0KTogZmxvYXQ7XG4vL31cblxuY29uc3QgQW5ub3RhdGlvbkxhYmVsID0gXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkxhYmVsXCIsXG5cdEFubm90YXRpb25UZXh0ID0gXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlRleHRcIixcblx0QW5ub3RhdGlvblRleHRVSVRleHRBcnJhbmdlbWVudCA9IFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5UZXh0QGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlRleHRBcnJhbmdlbWVudFwiLFxuXHRBbm5vdGF0aW9uVmFsdWVMaXN0UGFyYW1ldGVySW4gPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5WYWx1ZUxpc3RQYXJhbWV0ZXJJblwiLFxuXHRBbm5vdGF0aW9uVmFsdWVMaXN0UGFyYW1ldGVyQ29uc3RhbnQgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5WYWx1ZUxpc3RQYXJhbWV0ZXJDb25zdGFudFwiLFxuXHRBbm5vdGF0aW9uVmFsdWVMaXN0UGFyYW1ldGVyT3V0ID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuVmFsdWVMaXN0UGFyYW1ldGVyT3V0XCIsXG5cdEFubm90YXRpb25WYWx1ZUxpc3RQYXJhbWV0ZXJJbk91dCA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlZhbHVlTGlzdFBhcmFtZXRlckluT3V0XCIsXG5cdEFubm90YXRpb25WYWx1ZUxpc3RXaXRoRml4ZWRWYWx1ZXMgPSBcIkBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuVmFsdWVMaXN0V2l0aEZpeGVkVmFsdWVzXCI7XG5cbnR5cGUgQW5ub3RhdGlvbnNGb3JDb2xsZWN0aW9uID0ge1xuXHRcIkBPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLlNlYXJjaFJlc3RyaWN0aW9uc1wiPzoge1xuXHRcdFNlYXJjaGFibGU/OiBib29sZWFuO1xuXHR9O1xufTtcblxudHlwZSBBbm5vdGF0aW9uc0ZvclByb3BlcnR5ID0ge1xuXHRcIkBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuVmFsdWVMaXN0XCI/OiB7XG5cdFx0U2VhcmNoU3VwcG9ydGVkPzogYm9vbGVhbjtcblx0fTtcblx0XCJAY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkxhYmVsXCI/OiBzdHJpbmc7IC8vIEFubm90YXRpb25MYWJlbFxuXHRcIkBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuVGV4dFwiPzoge1xuXHRcdC8vIEFubm90YXRpb25UZXh0XG5cdFx0JFBhdGg6IHN0cmluZztcblx0fTtcblx0XCJAY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlRleHRAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuVGV4dEFycmFuZ2VtZW50XCI/OiB7XG5cdFx0Ly8gQW5ub3RhdGlvblRleHRVSVRleHRBcnJhbmdlbWVudFxuXHRcdCRFbnVtTWVtYmVyPzogc3RyaW5nO1xuXHR9O1xuXHRcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5IaWRkZW5GaWx0ZXJcIj86IGJvb2xlYW47XG5cdFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5WYWx1ZUxpc3RXaXRoRml4ZWRWYWx1ZXNcIj86IGJvb2xlYW47IC8vIEFubm90YXRpb25WYWx1ZUxpc3RXaXRoRml4ZWRWYWx1ZXNcblx0XCJAY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlZhbHVlTGlzdFJlbGV2YW50UXVhbGlmaWVyc1wiPzogc3RyaW5nW107XG5cdFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkhpZGRlblwiPzogc3RyaW5nO1xufTtcblxudHlwZSBBbm5vdGF0aW9uU2VsZWN0aW9uRmllbGQgPSB7XG5cdCRQcm9wZXJ0eVBhdGg6IHN0cmluZztcbn07XG5cbnR5cGUgQW5ub3RhdGlvbnNGb3JFbnRpdHlUeXBlID0ge1xuXHRcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5TZWxlY3Rpb25GaWVsZHNcIj86IEFubm90YXRpb25TZWxlY3Rpb25GaWVsZFtdO1xufTtcblxuZXhwb3J0IHR5cGUgQW5ub3RhdGlvblZhbHVlTGlzdFBhcmFtZXRlciA9IHtcblx0JFR5cGU6IHN0cmluZztcblx0VmFsdWVMaXN0UHJvcGVydHk6IHN0cmluZztcblx0TG9jYWxEYXRhUHJvcGVydHk6IHtcblx0XHQkUHJvcGVydHlQYXRoOiBzdHJpbmc7XG5cdH07XG5cdENvbnN0YW50OiBzdHJpbmc7XG5cdEluaXRpYWxWYWx1ZUlzU2lnbmlmaWNhbnQ6IGJvb2xlYW47XG59O1xuXG4vLyBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuVmFsdWVMaXN0VHlwZVxudHlwZSBBbm5vdGF0aW9uVmFsdWVMaXN0VHlwZSA9IHtcblx0TGFiZWw6IHN0cmluZztcblx0Q29sbGVjdGlvblBhdGg6IHN0cmluZztcblx0Q29sbGVjdGlvblJvb3Q6IHN0cmluZztcblx0RGlzdGluY3RWYWx1ZXNTdXBwb3J0ZWQ6IGJvb2xlYW47XG5cdFNlYXJjaFN1cHBvcnRlZDogYm9vbGVhbjtcblx0RmV0Y2hWYWx1ZXM6IG51bWJlcjtcblx0UHJlc2VudGF0aW9uVmFyaWFudFF1YWxpZmllcjogc3RyaW5nO1xuXHRTZWxlY3Rpb25WYXJpYW50UXVhbGlmaWVyOiBzdHJpbmc7XG5cdFBhcmFtZXRlcnM6IFtBbm5vdGF0aW9uVmFsdWVMaXN0UGFyYW1ldGVyXTtcblx0JG1vZGVsOiBPRGF0YU1vZGVsO1xufTtcblxudHlwZSBBbm5vdGF0aW9uVmFsdWVMaXN0VHlwZUJ5UXVhbGlmaWVyID0geyBbcXVhbGlmaWVyIGluIHN0cmluZ106IEFubm90YXRpb25WYWx1ZUxpc3RUeXBlIH07XG5cbnR5cGUgUHJvcGVydHkgPSB7XG5cdCRUeXBlOiBzdHJpbmc7XG5cdCRraW5kOiBzdHJpbmc7XG5cdCRpc0NvbGxlY3Rpb246IGJvb2xlYW47XG59O1xuXG5leHBvcnQgdHlwZSBJbk91dFBhcmFtZXRlciA9IHtcblx0cGFybWV0ZXJUeXBlOiBzdHJpbmc7XG5cdHNvdXJjZTogc3RyaW5nO1xuXHRoZWxwUGF0aDogc3RyaW5nO1xuXHRpbml0aWFsVmFsdWVGaWx0ZXJFbXB0eTogYm9vbGVhbjtcblx0Y29uc3RhbnRWYWx1ZT86IHN0cmluZyB8IGJvb2xlYW47XG59O1xuXG50eXBlIFZhbHVlSGVscFBheWxvYWRJbmZvID0ge1xuXHR2aEtleXM/OiBzdHJpbmdbXTtcblx0dmhQYXJhbWV0ZXJzPzogSW5PdXRQYXJhbWV0ZXJbXTtcbn07XG5cbnR5cGUgVmFsdWVIZWxwUXVhbGlmaWVyTWFwID0gUmVjb3JkPHN0cmluZywgVmFsdWVIZWxwUGF5bG9hZEluZm8+O1xuXG5leHBvcnQgdHlwZSBWYWx1ZUhlbHBQYXlsb2FkID0ge1xuXHRwcm9wZXJ0eVBhdGg6IHN0cmluZztcblx0cXVhbGlmaWVyczogVmFsdWVIZWxwUXVhbGlmaWVyTWFwO1xuXHR2YWx1ZUhlbHBRdWFsaWZpZXI6IHN0cmluZztcblx0Y29uZGl0aW9uTW9kZWw/OiBhbnk7XG5cdGlzQWN0aW9uUGFyYW1ldGVyRGlhbG9nPzogYm9vbGVhbjtcblx0aXNVbml0VmFsdWVIZWxwPzogYm9vbGVhbjtcblx0cmVxdWVzdEdyb3VwSWQ/OiBzdHJpbmc7XG5cdHVzZU11bHRpVmFsdWVGaWVsZD86IGJvb2xlYW47XG59O1xuXG50eXBlIENvbHVtbkRlZiA9IHtcblx0cGF0aDogc3RyaW5nO1xuXHRsYWJlbDogc3RyaW5nO1xuXHRzb3J0YWJsZTogYm9vbGVhbjtcblx0ZmlsdGVyYWJsZTogYm9vbGVhbiB8IENvbXBpbGVkQmluZGluZ1Rvb2xraXRFeHByZXNzaW9uO1xuXHQkVHlwZTogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgVmFsdWVMaXN0SW5mbyA9IHtcblx0a2V5VmFsdWU6IHN0cmluZztcblx0ZGVzY3JpcHRpb25WYWx1ZTogc3RyaW5nO1xuXHRmaWVsZFByb3BlcnR5UGF0aDogc3RyaW5nO1xuXHR2aEtleXM6IHN0cmluZ1tdO1xuXHR2aFBhcmFtZXRlcnM6IEluT3V0UGFyYW1ldGVyW107XG5cdHZhbHVlTGlzdEluZm86IEFubm90YXRpb25WYWx1ZUxpc3RUeXBlO1xuXHRjb2x1bW5EZWZzOiBDb2x1bW5EZWZbXTtcblx0dmFsdWVIZWxwUXVhbGlmaWVyOiBzdHJpbmc7XG59O1xuXG50eXBlIERpc3BsYXlGb3JtYXQgPSBcIkRlc2NyaXB0aW9uXCIgfCBcIlZhbHVlRGVzY3JpcHRpb25cIiB8IFwiVmFsdWVcIiB8IFwiRGVzY3JpcHRpb25WYWx1ZVwiO1xuXG50eXBlIEFkZGl0aW9uYWxWaWV3RGF0YSA9IHtcblx0ZW5hYmxlQXV0b0NvbHVtbldpZHRoPzogYm9vbGVhbjtcbn07XG5cbmNvbnN0IFZhbHVlTGlzdEhlbHBlciA9IHtcblx0ZW50aXR5SXNTZWFyY2hhYmxlOiBmdW5jdGlvbiAocHJvcGVydHlBbm5vdGF0aW9uczogQW5ub3RhdGlvbnNGb3JQcm9wZXJ0eSwgY29sbGVjdGlvbkFubm90YXRpb25zOiBBbm5vdGF0aW9uc0ZvckNvbGxlY3Rpb24pOiBib29sZWFuIHtcblx0XHRjb25zdCBzZWFyY2hTdXBwb3J0ZWQgPSBwcm9wZXJ0eUFubm90YXRpb25zW1wiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5WYWx1ZUxpc3RcIl0/LlNlYXJjaFN1cHBvcnRlZCxcblx0XHRcdHNlYXJjaGFibGUgPSBjb2xsZWN0aW9uQW5ub3RhdGlvbnNbXCJAT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5TZWFyY2hSZXN0cmljdGlvbnNcIl0/LlNlYXJjaGFibGU7XG5cblx0XHRpZiAoXG5cdFx0XHQoc2VhcmNoYWJsZSA9PT0gdW5kZWZpbmVkICYmIHNlYXJjaFN1cHBvcnRlZCA9PT0gZmFsc2UpIHx8XG5cdFx0XHQoc2VhcmNoYWJsZSA9PT0gdHJ1ZSAmJiBzZWFyY2hTdXBwb3J0ZWQgPT09IGZhbHNlKSB8fFxuXHRcdFx0c2VhcmNoYWJsZSA9PT0gZmFsc2Vcblx0XHQpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0cmV0dXJuIHRydWU7XG5cdH0sXG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGNvbmRpdGlvbiBwYXRoIHJlcXVpcmVkIGZvciB0aGUgY29uZGl0aW9uIG1vZGVsLlxuXHQgKiBGb3IgZS5nLiA8MTpOLVByb3BlcnR5TmFtZT4qXFwvPDE6MS1Qcm9wZXJ0eU5hbWU+LzxQcm9wZXJ0eU5hbWU+LlxuXHQgKlxuXHQgKiBAcGFyYW0gbWV0YU1vZGVsIFRoZSBtZXRhbW9kZWwgaW5zdGFuY2Vcblx0ICogQHBhcmFtIGVudGl0eVNldCBUaGUgZW50aXR5IHNldCBwYXRoXG5cdCAqIEBwYXJhbSBwcm9wZXJ0eVBhdGggVGhlIHByb3BlcnR5IHBhdGhcblx0ICogQHJldHVybnMgVGhlIGZvcm1hdHRlZCBjb25kaXRpb24gcGF0aFxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X2dldENvbmRpdGlvblBhdGg6IGZ1bmN0aW9uIChtZXRhTW9kZWw6IE9EYXRhTWV0YU1vZGVsLCBlbnRpdHlTZXQ6IHN0cmluZywgcHJvcGVydHlQYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRcdC8vIChzZWUgYWxzbzogc2FwL2ZlL2NvcmUvY29udmVydGVycy9jb250cm9scy9MaXN0UmVwb3J0L0ZpbHRlckJhci50cylcblx0XHRjb25zdCBwYXJ0cyA9IHByb3BlcnR5UGF0aC5zcGxpdChcIi9cIik7XG5cdFx0bGV0IGNvbmRpdGlvblBhdGggPSBcIlwiLFxuXHRcdFx0cGFydGlhbFBhdGg6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuXHRcdHdoaWxlIChwYXJ0cy5sZW5ndGgpIHtcblx0XHRcdGxldCBwYXJ0ID0gcGFydHMuc2hpZnQoKSBhcyBzdHJpbmc7XG5cdFx0XHRwYXJ0aWFsUGF0aCA9IHBhcnRpYWxQYXRoID8gYCR7cGFydGlhbFBhdGh9LyR7cGFydH1gIDogcGFydDtcblx0XHRcdGNvbnN0IHByb3BlcnR5ID0gbWV0YU1vZGVsLmdldE9iamVjdChgJHtlbnRpdHlTZXR9LyR7cGFydGlhbFBhdGh9YCkgYXMgUHJvcGVydHk7XG5cdFx0XHRpZiAocHJvcGVydHkgJiYgcHJvcGVydHkuJGtpbmQgPT09IFwiTmF2aWdhdGlvblByb3BlcnR5XCIgJiYgcHJvcGVydHkuJGlzQ29sbGVjdGlvbikge1xuXHRcdFx0XHRwYXJ0ICs9IFwiKlwiO1xuXHRcdFx0fVxuXHRcdFx0Y29uZGl0aW9uUGF0aCA9IGNvbmRpdGlvblBhdGggPyBgJHtjb25kaXRpb25QYXRofS8ke3BhcnR9YCA6IHBhcnQ7XG5cdFx0fVxuXHRcdHJldHVybiBjb25kaXRpb25QYXRoO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGFycmF5IG9mIGNvbHVtbiBkZWZpbml0aW9ucyBjb3JyZXNwb25kaW5nIHRvIHByb3BlcnRpZXMgZGVmaW5lZCBhcyBTZWxlY3Rpb24gRmllbGRzIG9uIHRoZSBDb2xsZWN0aW9uUGF0aCBlbnRpdHkgc2V0IGluIGEgVmFsdWVIZWxwLlxuXHQgKlxuXHQgKiBAcGFyYW0gbWV0YU1vZGVsIFRoZSBtZXRhbW9kZWwgaW5zdGFuY2Vcblx0ICogQHBhcmFtIGVudGl0eVNldCBUaGUgZW50aXR5IHNldCBwYXRoXG5cdCAqIEByZXR1cm5zIEFycmF5IG9mIGNvbHVtbiBkZWZpbml0aW9uc1xuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X2dldENvbHVtbkRlZmluaXRpb25Gcm9tU2VsZWN0aW9uRmllbGRzOiBmdW5jdGlvbiAobWV0YU1vZGVsOiBPRGF0YU1ldGFNb2RlbCwgZW50aXR5U2V0OiBzdHJpbmcpOiBDb2x1bW5EZWZbXSB7XG5cdFx0Y29uc3QgY29sdW1uRGVmczogQ29sdW1uRGVmW10gPSBbXSxcblx0XHRcdC8vc2VsZWN0aW9uRmllbGRzID0gbWV0YU1vZGVsLmdldE9iamVjdChlbnRpdHlTZXQgKyBcIi9AY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuU2VsZWN0aW9uRmllbGRzXCIpIGFzIFNlbGVjdGlvbkZpZWxkW10gfCB1bmRlZmluZWQ7XG5cdFx0XHRlbnRpdHlUeXBlQW5ub3RhdGlvbnMgPSBtZXRhTW9kZWwuZ2V0T2JqZWN0KGAke2VudGl0eVNldH0vQGApIGFzIEFubm90YXRpb25zRm9yRW50aXR5VHlwZSxcblx0XHRcdHNlbGVjdGlvbkZpZWxkcyA9IGVudGl0eVR5cGVBbm5vdGF0aW9uc1tcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5TZWxlY3Rpb25GaWVsZHNcIl07XG5cblx0XHRpZiAoc2VsZWN0aW9uRmllbGRzKSB7XG5cdFx0XHRzZWxlY3Rpb25GaWVsZHMuZm9yRWFjaChmdW5jdGlvbiAoc2VsZWN0aW9uRmllbGQpIHtcblx0XHRcdFx0Y29uc3Qgc2VsZWN0aW9uRmllbGRQYXRoID0gYCR7ZW50aXR5U2V0fS8ke3NlbGVjdGlvbkZpZWxkLiRQcm9wZXJ0eVBhdGh9YCxcblx0XHRcdFx0XHRjb25kaXRpb25QYXRoID0gVmFsdWVMaXN0SGVscGVyLl9nZXRDb25kaXRpb25QYXRoKG1ldGFNb2RlbCwgZW50aXR5U2V0LCBzZWxlY3Rpb25GaWVsZC4kUHJvcGVydHlQYXRoKSxcblx0XHRcdFx0XHRwcm9wZXJ0eUFubm90YXRpb25zID0gbWV0YU1vZGVsLmdldE9iamVjdChgJHtzZWxlY3Rpb25GaWVsZFBhdGh9QGApIGFzIEFubm90YXRpb25zRm9yUHJvcGVydHksXG5cdFx0XHRcdFx0Y29sdW1uRGVmID0ge1xuXHRcdFx0XHRcdFx0cGF0aDogY29uZGl0aW9uUGF0aCxcblx0XHRcdFx0XHRcdGxhYmVsOiBwcm9wZXJ0eUFubm90YXRpb25zW0Fubm90YXRpb25MYWJlbF0gfHwgc2VsZWN0aW9uRmllbGRQYXRoLFxuXHRcdFx0XHRcdFx0c29ydGFibGU6IHRydWUsXG5cdFx0XHRcdFx0XHRmaWx0ZXJhYmxlOiBDb21tb25VdGlscy5pc1Byb3BlcnR5RmlsdGVyYWJsZShtZXRhTW9kZWwsIGVudGl0eVNldCwgc2VsZWN0aW9uRmllbGQuJFByb3BlcnR5UGF0aCwgZmFsc2UpLFxuXHRcdFx0XHRcdFx0JFR5cGU6IG1ldGFNb2RlbC5nZXRPYmplY3Qoc2VsZWN0aW9uRmllbGRQYXRoKS4kVHlwZVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdGNvbHVtbkRlZnMucHVzaChjb2x1bW5EZWYpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNvbHVtbkRlZnM7XG5cdH0sXG5cblx0X21lcmdlQ29sdW1uRGVmaW5pdGlvbnNGcm9tUHJvcGVydGllczogZnVuY3Rpb24gKFxuXHRcdGNvbHVtbkRlZnM6IENvbHVtbkRlZltdLFxuXHRcdHZhbHVlTGlzdEluZm86IEFubm90YXRpb25WYWx1ZUxpc3RUeXBlLFxuXHRcdHZhbHVlTGlzdFByb3BlcnR5OiBzdHJpbmcsXG5cdFx0cHJvcGVydHk6IFByb3BlcnR5LFxuXHRcdHByb3BlcnR5QW5ub3RhdGlvbnM6IEFubm90YXRpb25zRm9yUHJvcGVydHlcblx0KTogdm9pZCB7XG5cdFx0bGV0IGNvbHVtblBhdGggPSB2YWx1ZUxpc3RQcm9wZXJ0eSxcblx0XHRcdGNvbHVtblByb3BlcnR5VHlwZSA9IHByb3BlcnR5LiRUeXBlO1xuXHRcdGNvbnN0IGxhYmVsID0gcHJvcGVydHlBbm5vdGF0aW9uc1tBbm5vdGF0aW9uTGFiZWxdIHx8IGNvbHVtblBhdGgsXG5cdFx0XHR0ZXh0QW5ub3RhdGlvbiA9IHByb3BlcnR5QW5ub3RhdGlvbnNbQW5ub3RhdGlvblRleHRdO1xuXG5cdFx0aWYgKFxuXHRcdFx0dGV4dEFubm90YXRpb24gJiZcblx0XHRcdHByb3BlcnR5QW5ub3RhdGlvbnNbQW5ub3RhdGlvblRleHRVSVRleHRBcnJhbmdlbWVudF0/LiRFbnVtTWVtYmVyID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlRleHRBcnJhbmdlbWVudFR5cGUvVGV4dE9ubHlcIlxuXHRcdCkge1xuXHRcdFx0Ly8gdGhlIGNvbHVtbiBwcm9wZXJ0eSBpcyB0aGUgb25lIGNvbWluZyBmcm9tIHRoZSB0ZXh0IGFubm90YXRpb25cblx0XHRcdGNvbHVtblBhdGggPSB0ZXh0QW5ub3RhdGlvbi4kUGF0aDtcblx0XHRcdGNvbnN0IHRleHRQcm9wZXJ0eVBhdGggPSBgLyR7dmFsdWVMaXN0SW5mby5Db2xsZWN0aW9uUGF0aH0vJHtjb2x1bW5QYXRofWA7XG5cdFx0XHRjb2x1bW5Qcm9wZXJ0eVR5cGUgPSB2YWx1ZUxpc3RJbmZvLiRtb2RlbC5nZXRNZXRhTW9kZWwoKS5nZXRPYmplY3QodGV4dFByb3BlcnR5UGF0aCkuJFR5cGUgYXMgc3RyaW5nO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNvbHVtbk5vdEFscmVhZHlEZWZpbmVkID1cblx0XHRcdGNvbHVtbkRlZnMuZmluZEluZGV4KGZ1bmN0aW9uIChjb2wpIHtcblx0XHRcdFx0cmV0dXJuIGNvbC5wYXRoID09PSBjb2x1bW5QYXRoO1xuXHRcdFx0fSkgPT09IC0xO1xuXG5cdFx0aWYgKGNvbHVtbk5vdEFscmVhZHlEZWZpbmVkKSB7XG5cdFx0XHRjb25zdCBjb2x1bW5EZWY6IENvbHVtbkRlZiA9IHtcblx0XHRcdFx0cGF0aDogY29sdW1uUGF0aCxcblx0XHRcdFx0bGFiZWw6IGxhYmVsLFxuXHRcdFx0XHRzb3J0YWJsZTogdHJ1ZSxcblx0XHRcdFx0ZmlsdGVyYWJsZTogIXByb3BlcnR5QW5ub3RhdGlvbnNbXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuSGlkZGVuRmlsdGVyXCJdLFxuXHRcdFx0XHQkVHlwZTogY29sdW1uUHJvcGVydHlUeXBlXG5cdFx0XHR9O1xuXHRcdFx0Y29sdW1uRGVmcy5wdXNoKGNvbHVtbkRlZik7XG5cdFx0fVxuXHR9LFxuXG5cdGZpbHRlckluT3V0UGFyYW1ldGVyczogZnVuY3Rpb24gKHZoUGFyYW1ldGVyczogSW5PdXRQYXJhbWV0ZXJbXSwgdHlwZUZpbHRlcjogc3RyaW5nW10pIHtcblx0XHRyZXR1cm4gdmhQYXJhbWV0ZXJzLmZpbHRlcihmdW5jdGlvbiAocGFyYW1ldGVyKSB7XG5cdFx0XHRyZXR1cm4gdHlwZUZpbHRlci5pbmRleE9mKHBhcmFtZXRlci5wYXJtZXRlclR5cGUpID4gLTE7XG5cdFx0fSk7XG5cdH0sXG5cblx0Z2V0SW5QYXJhbWV0ZXJzOiBmdW5jdGlvbiAodmhQYXJhbWV0ZXJzOiBJbk91dFBhcmFtZXRlcltdKSB7XG5cdFx0cmV0dXJuIFZhbHVlTGlzdEhlbHBlci5maWx0ZXJJbk91dFBhcmFtZXRlcnModmhQYXJhbWV0ZXJzLCBbXG5cdFx0XHRBbm5vdGF0aW9uVmFsdWVMaXN0UGFyYW1ldGVySW4sXG5cdFx0XHRBbm5vdGF0aW9uVmFsdWVMaXN0UGFyYW1ldGVyQ29uc3RhbnQsXG5cdFx0XHRBbm5vdGF0aW9uVmFsdWVMaXN0UGFyYW1ldGVySW5PdXRcblx0XHRdKTtcblx0fSxcblxuXHRnZXRPdXRQYXJhbWV0ZXJzOiBmdW5jdGlvbiAodmhQYXJhbWV0ZXJzOiBJbk91dFBhcmFtZXRlcltdKSB7XG5cdFx0cmV0dXJuIFZhbHVlTGlzdEhlbHBlci5maWx0ZXJJbk91dFBhcmFtZXRlcnModmhQYXJhbWV0ZXJzLCBbQW5ub3RhdGlvblZhbHVlTGlzdFBhcmFtZXRlck91dCwgQW5ub3RhdGlvblZhbHVlTGlzdFBhcmFtZXRlckluT3V0XSk7XG5cdH0sXG5cblx0Y3JlYXRlVkhVSU1vZGVsOiBmdW5jdGlvbiAodmFsdWVIZWxwOiBWYWx1ZUhlbHAsIHByb3BlcnR5UGF0aDogc3RyaW5nLCBtZXRhTW9kZWw6IE9EYXRhTWV0YU1vZGVsKTogSlNPTk1vZGVsIHtcblx0XHQvLyBzZXR0aW5nIHRoZSBfVkhVSSBtb2RlbCBldmFsdWF0ZWQgaW4gdGhlIFZhbHVlTGlzdFRhYmxlIGZyYWdtZW50XG5cdFx0Y29uc3QgdmhVSU1vZGVsID0gbmV3IEpTT05Nb2RlbCh7fSksXG5cdFx0XHRwcm9wZXJ0eUFubm90YXRpb25zID0gbWV0YU1vZGVsLmdldE9iamVjdChgJHtwcm9wZXJ0eVBhdGh9QGApIGFzIEFubm90YXRpb25zRm9yUHJvcGVydHk7XG5cblx0XHR2YWx1ZUhlbHAuc2V0TW9kZWwodmhVSU1vZGVsLCBcIl9WSFVJXCIpO1xuXHRcdC8vIElkZW50aWZpZXMgdGhlIFwiQ29udGV4dERlcGVuZGVudC1TY2VuYXJpb1wiXG5cdFx0dmhVSU1vZGVsLnNldFByb3BlcnR5KFxuXHRcdFx0XCIvaGFzVmFsdWVMaXN0UmVsZXZhbnRRdWFsaWZpZXJzXCIsXG5cdFx0XHQhIXByb3BlcnR5QW5ub3RhdGlvbnNbXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlZhbHVlTGlzdFJlbGV2YW50UXVhbGlmaWVyc1wiXVxuXHRcdCk7XG5cdFx0cmV0dXJuIHZoVUlNb2RlbDtcblx0fSxcblxuXHRkZXN0cm95VkhDb250ZW50OiBmdW5jdGlvbiAodmFsdWVIZWxwOiBWYWx1ZUhlbHApOiB2b2lkIHtcblx0XHRpZiAodmFsdWVIZWxwLmdldERpYWxvZygpKSB7XG5cdFx0XHR2YWx1ZUhlbHAuZ2V0RGlhbG9nKCkuZGVzdHJveUNvbnRlbnQoKTtcblx0XHR9XG5cdFx0aWYgKHZhbHVlSGVscC5nZXRUeXBlYWhlYWQoKSkge1xuXHRcdFx0dmFsdWVIZWxwLmdldFR5cGVhaGVhZCgpLmRlc3Ryb3lDb250ZW50KCk7XG5cdFx0fVxuXHR9LFxuXG5cdHB1dERlZmF1bHRRdWFsaWZpZXJGaXJzdDogZnVuY3Rpb24gKHF1YWxpZmllcnM6IHN0cmluZ1tdKSB7XG5cdFx0Y29uc3QgaW5kZXhEZWZhdWx0VkggPSBxdWFsaWZpZXJzLmluZGV4T2YoXCJcIik7XG5cblx0XHQvLyBkZWZhdWx0IFZhbHVlSGVscCB3aXRob3V0IHF1YWxpZmllciBzaG91bGQgYmUgdGhlIGZpcnN0XG5cdFx0aWYgKGluZGV4RGVmYXVsdFZIID4gMCkge1xuXHRcdFx0cXVhbGlmaWVycy51bnNoaWZ0KHF1YWxpZmllcnNbaW5kZXhEZWZhdWx0VkhdKTtcblx0XHRcdHF1YWxpZmllcnMuc3BsaWNlKGluZGV4RGVmYXVsdFZIICsgMSwgMSk7XG5cdFx0fVxuXHRcdHJldHVybiBxdWFsaWZpZXJzO1xuXHR9LFxuXG5cdGdldFZhbHVlTGlzdEluZm86IGFzeW5jIGZ1bmN0aW9uICh2YWx1ZUhlbHA6IFZhbHVlSGVscCwgcHJvcGVydHlQYXRoOiBzdHJpbmcsIHBheWxvYWQ6IFZhbHVlSGVscFBheWxvYWQpOiBQcm9taXNlPFZhbHVlTGlzdEluZm9bXT4ge1xuXHRcdGNvbnN0IGJpbmRpbmdDb250ZXh0ID0gdmFsdWVIZWxwLmdldEJpbmRpbmdDb250ZXh0KCkgYXMgQ29udGV4dCxcblx0XHRcdGNvbmRpdGlvbk1vZGVsID0gcGF5bG9hZC5jb25kaXRpb25Nb2RlbCxcblx0XHRcdHZoTWV0YU1vZGVsID0gdmFsdWVIZWxwLmdldE1vZGVsKCkuZ2V0TWV0YU1vZGVsKCkgYXMgT0RhdGFNZXRhTW9kZWwsXG5cdFx0XHR2YWx1ZUxpc3RJbmZvczogVmFsdWVMaXN0SW5mb1tdID0gW107XG5cblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgdmFsdWVMaXN0QnlRdWFsaWZpZXIgPSAoYXdhaXQgdmhNZXRhTW9kZWwucmVxdWVzdFZhbHVlTGlzdEluZm8oXG5cdFx0XHRcdHByb3BlcnR5UGF0aCxcblx0XHRcdFx0dHJ1ZSxcblx0XHRcdFx0YmluZGluZ0NvbnRleHRcblx0XHRcdCkpIGFzIEFubm90YXRpb25WYWx1ZUxpc3RUeXBlQnlRdWFsaWZpZXI7XG5cdFx0XHRjb25zdCB2YWx1ZUhlbHBRdWFsaWZpZXJzID0gdGhpcy5wdXREZWZhdWx0UXVhbGlmaWVyRmlyc3QoT2JqZWN0LmtleXModmFsdWVMaXN0QnlRdWFsaWZpZXIpKSxcblx0XHRcdFx0cHJvcGVydHlOYW1lID0gcHJvcGVydHlQYXRoLnNwbGl0KFwiL1wiKS5wb3AoKTtcblxuXHRcdFx0bGV0IGNvbnRleHRQcmVmaXggPSBcIlwiO1xuXG5cdFx0XHRpZiAocGF5bG9hZC51c2VNdWx0aVZhbHVlRmllbGQgJiYgYmluZGluZ0NvbnRleHQgJiYgYmluZGluZ0NvbnRleHQuZ2V0UGF0aCgpKSB7XG5cdFx0XHRcdGNvbnN0IGFCaW5kaWdDb250ZXh0UGFydHMgPSBiaW5kaW5nQ29udGV4dC5nZXRQYXRoKCkuc3BsaXQoXCIvXCIpO1xuXHRcdFx0XHRjb25zdCBhUHJvcGVydHlCaW5kaW5nUGFydHMgPSBwcm9wZXJ0eVBhdGguc3BsaXQoXCIvXCIpO1xuXHRcdFx0XHRpZiAoYVByb3BlcnR5QmluZGluZ1BhcnRzLmxlbmd0aCAtIGFCaW5kaWdDb250ZXh0UGFydHMubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRcdGNvbnN0IGFDb250ZXh0UHJlZml4UGFydHMgPSBbXTtcblx0XHRcdFx0XHRmb3IgKGxldCBpID0gYUJpbmRpZ0NvbnRleHRQYXJ0cy5sZW5ndGg7IGkgPCBhUHJvcGVydHlCaW5kaW5nUGFydHMubGVuZ3RoIC0gMTsgaSsrKSB7XG5cdFx0XHRcdFx0XHRhQ29udGV4dFByZWZpeFBhcnRzLnB1c2goYVByb3BlcnR5QmluZGluZ1BhcnRzW2ldKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y29udGV4dFByZWZpeCA9IGAke2FDb250ZXh0UHJlZml4UGFydHMuam9pbihcIi9cIil9L2A7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0dmFsdWVIZWxwUXVhbGlmaWVycy5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZUhlbHBRdWFsaWZpZXIpIHtcblx0XHRcdFx0Ly8gQWRkIGNvbHVtbiBkZWZpbml0aW9ucyBmb3IgcHJvcGVydGllcyBkZWZpbmVkIGFzIFNlbGVjdGlvbiBmaWVsZHMgb24gdGhlIENvbGxlY3Rpb25QYXRoIGVudGl0eSBzZXQuXG5cdFx0XHRcdGNvbnN0IGFubm90YXRpb25WYWx1ZUxpc3RUeXBlID0gdmFsdWVMaXN0QnlRdWFsaWZpZXJbdmFsdWVIZWxwUXVhbGlmaWVyXSxcblx0XHRcdFx0XHRtZXRhTW9kZWwgPSBhbm5vdGF0aW9uVmFsdWVMaXN0VHlwZS4kbW9kZWwuZ2V0TWV0YU1vZGVsKCksXG5cdFx0XHRcdFx0ZW50aXR5U2V0UGF0aCA9IGAvJHthbm5vdGF0aW9uVmFsdWVMaXN0VHlwZS5Db2xsZWN0aW9uUGF0aH1gLFxuXHRcdFx0XHRcdGNvbHVtbkRlZnMgPSBWYWx1ZUxpc3RIZWxwZXIuX2dldENvbHVtbkRlZmluaXRpb25Gcm9tU2VsZWN0aW9uRmllbGRzKG1ldGFNb2RlbCwgZW50aXR5U2V0UGF0aCksXG5cdFx0XHRcdFx0dmhQYXJhbWV0ZXJzOiBJbk91dFBhcmFtZXRlcltdID0gW10sXG5cdFx0XHRcdFx0dmhLZXlzOiBzdHJpbmdbXSA9IG1ldGFNb2RlbC5nZXRPYmplY3QoZW50aXR5U2V0UGF0aCArIGAvYCk/LiRLZXlcblx0XHRcdFx0XHRcdD8gWy4uLm1ldGFNb2RlbC5nZXRPYmplY3QoZW50aXR5U2V0UGF0aCArIGAvYCkuJEtleV1cblx0XHRcdFx0XHRcdDogW107XG5cdFx0XHRcdGxldCBmaWVsZFByb3BlcnR5UGF0aCA9IFwiXCIsXG5cdFx0XHRcdFx0ZGVzY3JpcHRpb25QYXRoID0gXCJcIixcblx0XHRcdFx0XHRrZXkgPSBcIlwiO1xuXG5cdFx0XHRcdGFubm90YXRpb25WYWx1ZUxpc3RUeXBlLlBhcmFtZXRlcnMuZm9yRWFjaChmdW5jdGlvbiAocGFyYW1ldGVyKSB7XG5cdFx0XHRcdFx0Ly9BbGwgU3RyaW5nIGZpZWxkcyBhcmUgYWxsb3dlZCBmb3IgZmlsdGVyXG5cdFx0XHRcdFx0Y29uc3QgcHJvcGVydHlQYXRoMiA9IGAvJHthbm5vdGF0aW9uVmFsdWVMaXN0VHlwZS5Db2xsZWN0aW9uUGF0aH0vJHtwYXJhbWV0ZXIuVmFsdWVMaXN0UHJvcGVydHl9YCxcblx0XHRcdFx0XHRcdHByb3BlcnR5ID0gbWV0YU1vZGVsLmdldE9iamVjdChwcm9wZXJ0eVBhdGgyKSxcblx0XHRcdFx0XHRcdHByb3BlcnR5QW5ub3RhdGlvbnMgPSAobWV0YU1vZGVsLmdldE9iamVjdChgJHtwcm9wZXJ0eVBhdGgyfUBgKSB8fCB7fSkgYXMgQW5ub3RhdGlvbnNGb3JQcm9wZXJ0eTtcblxuXHRcdFx0XHRcdC8vIElmIHByb3BlcnR5IGlzIHVuZGVmaW5lZCwgdGhlbiB0aGUgcHJvcGVydHkgY29taW5nIGZvciB0aGUgZW50cnkgaXNuJ3QgZGVmaW5lZCBpblxuXHRcdFx0XHRcdC8vIHRoZSBtZXRhbW9kZWwsIHRoZXJlZm9yZSB3ZSBkb24ndCBuZWVkIHRvIGFkZCBpdCBpbiB0aGUgaW4vb3V0IHBhcmFtZXRlcnNcblx0XHRcdFx0XHRpZiAocHJvcGVydHkpIHtcblx0XHRcdFx0XHRcdC8vIFNlYXJjaCBmb3IgdGhlICpvdXQgUGFyYW1ldGVyIG1hcHBlZCB0byB0aGUgbG9jYWwgcHJvcGVydHlcblx0XHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdFx0IWtleSAmJlxuXHRcdFx0XHRcdFx0XHQocGFyYW1ldGVyLiRUeXBlID09PSBBbm5vdGF0aW9uVmFsdWVMaXN0UGFyYW1ldGVyT3V0IHx8XG5cdFx0XHRcdFx0XHRcdFx0cGFyYW1ldGVyLiRUeXBlID09PSBBbm5vdGF0aW9uVmFsdWVMaXN0UGFyYW1ldGVySW5PdXQpICYmXG5cdFx0XHRcdFx0XHRcdHBhcmFtZXRlci5Mb2NhbERhdGFQcm9wZXJ0eS4kUHJvcGVydHlQYXRoID09PSBwcm9wZXJ0eU5hbWVcblx0XHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0XHRmaWVsZFByb3BlcnR5UGF0aCA9IHByb3BlcnR5UGF0aDI7XG5cdFx0XHRcdFx0XHRcdGtleSA9IHBhcmFtZXRlci5WYWx1ZUxpc3RQcm9wZXJ0eTtcblxuXHRcdFx0XHRcdFx0XHQvL09ubHkgdGhlIHRleHQgYW5ub3RhdGlvbiBvZiB0aGUga2V5IGNhbiBzcGVjaWZ5IHRoZSBkZXNjcmlwdGlvblxuXHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvblBhdGggPSBwcm9wZXJ0eUFubm90YXRpb25zW0Fubm90YXRpb25UZXh0XT8uJFBhdGggfHwgXCJcIjtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Y29uc3QgdmFsdWVMaXN0UHJvcGVydHkgPSBwYXJhbWV0ZXIuVmFsdWVMaXN0UHJvcGVydHk7XG5cdFx0XHRcdFx0XHRWYWx1ZUxpc3RIZWxwZXIuX21lcmdlQ29sdW1uRGVmaW5pdGlvbnNGcm9tUHJvcGVydGllcyhcblx0XHRcdFx0XHRcdFx0Y29sdW1uRGVmcyxcblx0XHRcdFx0XHRcdFx0YW5ub3RhdGlvblZhbHVlTGlzdFR5cGUsXG5cdFx0XHRcdFx0XHRcdHZhbHVlTGlzdFByb3BlcnR5LFxuXHRcdFx0XHRcdFx0XHRwcm9wZXJ0eSxcblx0XHRcdFx0XHRcdFx0cHJvcGVydHlBbm5vdGF0aW9uc1xuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvL0luIGFuZCBJbk91dFxuXHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdChwYXJhbWV0ZXIuJFR5cGUgPT09IEFubm90YXRpb25WYWx1ZUxpc3RQYXJhbWV0ZXJJbiB8fFxuXHRcdFx0XHRcdFx0XHRwYXJhbWV0ZXIuJFR5cGUgPT09IEFubm90YXRpb25WYWx1ZUxpc3RQYXJhbWV0ZXJJbk91dCB8fFxuXHRcdFx0XHRcdFx0XHRwYXJhbWV0ZXIuJFR5cGUgPT09IEFubm90YXRpb25WYWx1ZUxpc3RQYXJhbWV0ZXJPdXQpICYmXG5cdFx0XHRcdFx0XHRwYXJhbWV0ZXIuTG9jYWxEYXRhUHJvcGVydHkuJFByb3BlcnR5UGF0aCAhPT0gcHJvcGVydHlOYW1lXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRsZXQgdmFsdWVQYXRoID0gXCJcIjtcblx0XHRcdFx0XHRcdGlmIChjb25kaXRpb25Nb2RlbCAmJiBjb25kaXRpb25Nb2RlbC5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZUhlbHAuZ2V0UGFyZW50KCkuaXNBKFwic2FwLnVpLm1kYy5UYWJsZVwiKSAmJlxuXHRcdFx0XHRcdFx0XHRcdHZhbHVlSGVscC5nZXRCaW5kaW5nQ29udGV4dCgpICYmXG5cdFx0XHRcdFx0XHRcdFx0KHBhcmFtZXRlci4kVHlwZSA9PT0gQW5ub3RhdGlvblZhbHVlTGlzdFBhcmFtZXRlckluIHx8XG5cdFx0XHRcdFx0XHRcdFx0XHRwYXJhbWV0ZXIuJFR5cGUgPT09IEFubm90YXRpb25WYWx1ZUxpc3RQYXJhbWV0ZXJJbk91dClcblx0XHRcdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRcdFx0Ly8gU3BlY2lhbCBoYW5kbGluZyBmb3IgdmFsdWUgaGVscCB1c2VkIGluIGZpbHRlciBkaWFsb2dcblx0XHRcdFx0XHRcdFx0XHRjb25zdCBwYXJ0cyA9IHBhcmFtZXRlci5Mb2NhbERhdGFQcm9wZXJ0eS4kUHJvcGVydHlQYXRoLnNwbGl0KFwiL1wiKTtcblx0XHRcdFx0XHRcdFx0XHRpZiAocGFydHMubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgZmlyc3ROYXZpZ2F0aW9uUHJvcGVydHkgPSBwYXJ0c1swXTtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IG9Cb3VuZEVudGl0eSA9IHZoTWV0YU1vZGVsLmdldE1ldGFDb250ZXh0KGJpbmRpbmdDb250ZXh0LmdldFBhdGgoKSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBzUGF0aE9mVGFibGUgPSAodmFsdWVIZWxwLmdldFBhcmVudCgpIGFzIGFueSkuZ2V0Um93QmluZGluZygpLmdldFBhdGgoKTsgLy9UT0RPXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoKG9Cb3VuZEVudGl0eS5nZXRPYmplY3QoYCR7c1BhdGhPZlRhYmxlfS8kUGFydG5lcmApIGFzIGFueSkgPT09IGZpcnN0TmF2aWdhdGlvblByb3BlcnR5KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFVzaW5nIHRoZSBjb25kaXRpb24gbW9kZWwgZG9lc24ndCBtYWtlIGFueSBzZW5zZSBpbiBjYXNlIGFuIGluLXBhcmFtZXRlciB1c2VzIGEgbmF2aWdhdGlvbiBwcm9wZXJ0eVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyByZWZlcnJpbmcgdG8gdGhlIHBhcnRuZXIuIFRoZXJlZm9yZSByZWR1Y2luZyB0aGUgcGF0aCBhbmQgdXNpbmcgdGhlIEZWSCBjb250ZXh0IGluc3RlYWQgb2YgdGhlIGNvbmRpdGlvbiBtb2RlbFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZVBhdGggPSBwYXJhbWV0ZXIuTG9jYWxEYXRhUHJvcGVydHkuJFByb3BlcnR5UGF0aC5yZXBsYWNlKGZpcnN0TmF2aWdhdGlvblByb3BlcnR5ICsgXCIvXCIsIFwiXCIpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZiAoIXZhbHVlUGF0aCkge1xuXHRcdFx0XHRcdFx0XHRcdHZhbHVlUGF0aCA9IGNvbmRpdGlvbk1vZGVsICsgXCI+L2NvbmRpdGlvbnMvXCIgKyBwYXJhbWV0ZXIuTG9jYWxEYXRhUHJvcGVydHkuJFByb3BlcnR5UGF0aDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0dmFsdWVQYXRoID0gY29udGV4dFByZWZpeCArIHBhcmFtZXRlci5Mb2NhbERhdGFQcm9wZXJ0eS4kUHJvcGVydHlQYXRoO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dmhQYXJhbWV0ZXJzLnB1c2goe1xuXHRcdFx0XHRcdFx0XHRwYXJtZXRlclR5cGU6IHBhcmFtZXRlci4kVHlwZSxcblx0XHRcdFx0XHRcdFx0c291cmNlOiB2YWx1ZVBhdGgsXG5cdFx0XHRcdFx0XHRcdGhlbHBQYXRoOiBwYXJhbWV0ZXIuVmFsdWVMaXN0UHJvcGVydHksXG5cdFx0XHRcdFx0XHRcdGNvbnN0YW50VmFsdWU6IHBhcmFtZXRlci5Db25zdGFudCxcblx0XHRcdFx0XHRcdFx0aW5pdGlhbFZhbHVlRmlsdGVyRW1wdHk6IHBhcmFtZXRlci5Jbml0aWFsVmFsdWVJc1NpZ25pZmljYW50XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvL0NvbnN0YW50IGFzIEluUGFyYW10ZXIgZm9yIGZpbHRlcmluZ1xuXHRcdFx0XHRcdGlmIChwYXJhbWV0ZXIuJFR5cGUgPT09IEFubm90YXRpb25WYWx1ZUxpc3RQYXJhbWV0ZXJDb25zdGFudCkge1xuXHRcdFx0XHRcdFx0dmhQYXJhbWV0ZXJzLnB1c2goe1xuXHRcdFx0XHRcdFx0XHRwYXJtZXRlclR5cGU6IHBhcmFtZXRlci4kVHlwZSxcblx0XHRcdFx0XHRcdFx0c291cmNlOiBwYXJhbWV0ZXIuVmFsdWVMaXN0UHJvcGVydHksXG5cdFx0XHRcdFx0XHRcdGhlbHBQYXRoOiBwYXJhbWV0ZXIuVmFsdWVMaXN0UHJvcGVydHksXG5cdFx0XHRcdFx0XHRcdGNvbnN0YW50VmFsdWU6IHBhcmFtZXRlci5Db25zdGFudCxcblx0XHRcdFx0XHRcdFx0aW5pdGlhbFZhbHVlRmlsdGVyRW1wdHk6IHBhcmFtZXRlci5Jbml0aWFsVmFsdWVJc1NpZ25pZmljYW50XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly8gRW5yaWNoIGtleXMgd2l0aCBvdXQtcGFyYW1ldGVyc1xuXHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdChwYXJhbWV0ZXIuJFR5cGUgPT09IEFubm90YXRpb25WYWx1ZUxpc3RQYXJhbWV0ZXJJbk91dCB8fCBwYXJhbWV0ZXIuJFR5cGUgPT09IEFubm90YXRpb25WYWx1ZUxpc3RQYXJhbWV0ZXJPdXQpICYmXG5cdFx0XHRcdFx0XHQhdmhLZXlzLmluY2x1ZGVzKHBhcmFtZXRlci5WYWx1ZUxpc3RQcm9wZXJ0eSlcblx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdHZoS2V5cy5wdXNoKHBhcmFtZXRlci5WYWx1ZUxpc3RQcm9wZXJ0eSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0LyogRW5zdXJlIHRoYXQgdmhLZXlzIGFyZSBwYXJ0IG9mIHRoZSBjb2x1bW5EZWZzLCBvdGhlcndpc2UgaXQgaXMgbm90IGNvbnNpZGVyZWQgaW4gJHNlbGVjdCAoQkNQIDIyNzAxNDExNTQpICovXG5cdFx0XHRcdGZvciAoY29uc3QgdmhLZXkgb2YgdmhLZXlzKSB7XG5cdFx0XHRcdFx0aWYgKGNvbHVtbkRlZnMuZmluZEluZGV4KGZ1bmN0aW9uIChjb2x1bW4pIHtcblx0XHRcdFx0XHRcdHJldHVybiBjb2x1bW4ucGF0aCA9PT0gdmhLZXk7XG5cdFx0XHRcdFx0fSkgPT09IC0xXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRjb25zdCBjb2x1bW5EZWY6IENvbHVtbkRlZiA9IHtcblx0XHRcdFx0XHRcdFx0cGF0aDogdmhLZXksXG5cdFx0XHRcdFx0XHRcdCRUeXBlOiBtZXRhTW9kZWwuZ2V0T2JqZWN0KGAvJHthbm5vdGF0aW9uVmFsdWVMaXN0VHlwZS5Db2xsZWN0aW9uUGF0aH0vJHtrZXl9YCkuJFR5cGUsXG5cdFx0XHRcdFx0XHRcdGxhYmVsOiBcIlwiLFxuXHRcdFx0XHRcdFx0XHRzb3J0YWJsZTogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdGZpbHRlcmFibGU6IHVuZGVmaW5lZFxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdGNvbHVtbkRlZnMucHVzaChjb2x1bW5EZWYpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0XHRjb25zdCB2YWx1ZUxpc3RJbmZvOiBWYWx1ZUxpc3RJbmZvID0ge1xuXHRcdFx0XHRcdGtleVZhbHVlOiBrZXksXG5cdFx0XHRcdFx0ZGVzY3JpcHRpb25WYWx1ZTogZGVzY3JpcHRpb25QYXRoLFxuXHRcdFx0XHRcdGZpZWxkUHJvcGVydHlQYXRoOiBmaWVsZFByb3BlcnR5UGF0aCxcblx0XHRcdFx0XHR2aEtleXM6IHZoS2V5cyxcblx0XHRcdFx0XHR2aFBhcmFtZXRlcnM6IHZoUGFyYW1ldGVycyxcblx0XHRcdFx0XHR2YWx1ZUxpc3RJbmZvOiBhbm5vdGF0aW9uVmFsdWVMaXN0VHlwZSxcblx0XHRcdFx0XHRjb2x1bW5EZWZzOiBjb2x1bW5EZWZzLFxuXHRcdFx0XHRcdHZhbHVlSGVscFF1YWxpZmllcjogdmFsdWVIZWxwUXVhbGlmaWVyXG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhbHVlTGlzdEluZm9zLnB1c2godmFsdWVMaXN0SW5mbyk7XG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoIChlcnI6IGFueSkge1xuXHRcdFx0Y29uc3QgZXJyU3RhdHVzID0gZXJyLnN0YXR1cyxcblx0XHRcdFx0bXNnID1cblx0XHRcdFx0XHRlcnJTdGF0dXMgJiYgZXJyU3RhdHVzID09PSA0MDRcblx0XHRcdFx0XHRcdD8gYE1ldGFkYXRhIG5vdCBmb3VuZCAoJHtlcnJTdGF0dXN9KSBmb3IgdmFsdWUgaGVscCBvZiBwcm9wZXJ0eSAke3Byb3BlcnR5UGF0aH1gXG5cdFx0XHRcdFx0XHQ6IGVyci5tZXNzYWdlO1xuXHRcdFx0TG9nLmVycm9yKG1zZyk7XG5cdFx0XHRWYWx1ZUxpc3RIZWxwZXIuZGVzdHJveVZIQ29udGVudCh2YWx1ZUhlbHApO1xuXHRcdH1cblx0XHRyZXR1cm4gdmFsdWVMaXN0SW5mb3M7XG5cdH0sXG5cblx0QUxMRlJBR01FTlRTOiB1bmRlZmluZWQgYXMgYW55LFxuXHRsb2dGcmFnbWVudDogdW5kZWZpbmVkIGFzIGFueSxcblxuXHRfbG9nVGVtcGxhdGVkRnJhZ21lbnRzOiBmdW5jdGlvbiAocHJvcGVydHlQYXRoOiBzdHJpbmcsIGZyYWdtZW50TmFtZTogc3RyaW5nLCBmcmFnbWVudERlZmluaXRpb246IGFueSk6IHZvaWQge1xuXHRcdGNvbnN0IGxvZ0luZm8gPSB7XG5cdFx0XHRwYXRoOiBwcm9wZXJ0eVBhdGgsXG5cdFx0XHRmcmFnbWVudE5hbWU6IGZyYWdtZW50TmFtZSxcblx0XHRcdGZyYWdtZW50OiBmcmFnbWVudERlZmluaXRpb25cblx0XHR9O1xuXHRcdGlmIChMb2cuZ2V0TGV2ZWwoKSA9PT0gTGV2ZWwuREVCVUcpIHtcblx0XHRcdC8vSW4gZGVidWcgbW9kZSB3ZSBsb2cgYWxsIGdlbmVyYXRlZCBmcmFnbWVudHNcblx0XHRcdFZhbHVlTGlzdEhlbHBlci5BTExGUkFHTUVOVFMgPSBWYWx1ZUxpc3RIZWxwZXIuQUxMRlJBR01FTlRTIHx8IFtdO1xuXHRcdFx0VmFsdWVMaXN0SGVscGVyLkFMTEZSQUdNRU5UUy5wdXNoKGxvZ0luZm8pO1xuXHRcdH1cblx0XHRpZiAoVmFsdWVMaXN0SGVscGVyLmxvZ0ZyYWdtZW50KSB7XG5cdFx0XHQvL09uZSBUb29sIFN1YnNjcmliZXIgYWxsb3dlZFxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFZhbHVlTGlzdEhlbHBlci5sb2dGcmFnbWVudChsb2dJbmZvKTtcblx0XHRcdH0sIDApO1xuXHRcdH1cblx0fSxcblxuXHRfdGVtcGxhdGVGcmFnbWVudDogYXN5bmMgZnVuY3Rpb24gKFxuXHRcdGZyYWdtZW50TmFtZTogc3RyaW5nLFxuXHRcdHZhbHVlTGlzdEluZm86IFZhbHVlTGlzdEluZm8sXG5cdFx0c291cmNlTW9kZWw6IEpTT05Nb2RlbCxcblx0XHRwcm9wZXJ0eVBhdGg6IHN0cmluZyxcblx0XHRhZGRpdGlvbmFsVmlld0RhdGE/OiBBZGRpdGlvbmFsVmlld0RhdGFcblx0KTogUHJvbWlzZTxvYmplY3Q+IHtcblx0XHRjb25zdCBtVmFsdWVMaXN0SW5mbyA9IHZhbHVlTGlzdEluZm8udmFsdWVMaXN0SW5mbyxcblx0XHRcdHZhbHVlTGlzdE1vZGVsID0gbmV3IEpTT05Nb2RlbChtVmFsdWVMaXN0SW5mbyksXG5cdFx0XHR2YWx1ZUxpc3RTZXJ2aWNlTWV0YU1vZGVsID0gbVZhbHVlTGlzdEluZm8uJG1vZGVsLmdldE1ldGFNb2RlbCgpLFxuXHRcdFx0dmlld0RhdGEgPSBuZXcgSlNPTk1vZGVsKFxuXHRcdFx0XHRPYmplY3QuYXNzaWduKFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGNvbnZlcnRlclR5cGU6IFwiTGlzdFJlcG9ydFwiLFxuXHRcdFx0XHRcdFx0Y29sdW1uczogdmFsdWVMaXN0SW5mby5jb2x1bW5EZWZzIHx8IG51bGxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGFkZGl0aW9uYWxWaWV3RGF0YVxuXHRcdFx0XHQpXG5cdFx0XHQpO1xuXG5cdFx0Y29uc3QgZnJhZ21lbnREZWZpbml0aW9uID0gYXdhaXQgUHJvbWlzZS5yZXNvbHZlKFxuXHRcdFx0WE1MUHJlcHJvY2Vzc29yLnByb2Nlc3MoXG5cdFx0XHRcdFhNTFRlbXBsYXRlUHJvY2Vzc29yLmxvYWRUZW1wbGF0ZShmcmFnbWVudE5hbWUsIFwiZnJhZ21lbnRcIiksXG5cdFx0XHRcdHsgbmFtZTogZnJhZ21lbnROYW1lIH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRiaW5kaW5nQ29udGV4dHM6IHtcblx0XHRcdFx0XHRcdHZhbHVlTGlzdDogdmFsdWVMaXN0TW9kZWwuY3JlYXRlQmluZGluZ0NvbnRleHQoXCIvXCIpLFxuXHRcdFx0XHRcdFx0Y29udGV4dFBhdGg6IHZhbHVlTGlzdFNlcnZpY2VNZXRhTW9kZWwuY3JlYXRlQmluZGluZ0NvbnRleHQoYC8ke21WYWx1ZUxpc3RJbmZvLkNvbGxlY3Rpb25QYXRofS9gKSxcblx0XHRcdFx0XHRcdHNvdXJjZTogc291cmNlTW9kZWwuY3JlYXRlQmluZGluZ0NvbnRleHQoXCIvXCIpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRtb2RlbHM6IHtcblx0XHRcdFx0XHRcdHZhbHVlTGlzdDogdmFsdWVMaXN0TW9kZWwsXG5cdFx0XHRcdFx0XHRjb250ZXh0UGF0aDogdmFsdWVMaXN0U2VydmljZU1ldGFNb2RlbCxcblx0XHRcdFx0XHRcdHNvdXJjZTogc291cmNlTW9kZWwsXG5cdFx0XHRcdFx0XHRtZXRhTW9kZWw6IHZhbHVlTGlzdFNlcnZpY2VNZXRhTW9kZWwsXG5cdFx0XHRcdFx0XHR2aWV3RGF0YTogdmlld0RhdGFcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdClcblx0XHQpO1xuXHRcdFZhbHVlTGlzdEhlbHBlci5fbG9nVGVtcGxhdGVkRnJhZ21lbnRzKHByb3BlcnR5UGF0aCwgZnJhZ21lbnROYW1lLCBmcmFnbWVudERlZmluaXRpb24pO1xuXHRcdHJldHVybiBhd2FpdCBGcmFnbWVudC5sb2FkKHsgZGVmaW5pdGlvbjogZnJhZ21lbnREZWZpbml0aW9uIH0pO1xuXHR9LFxuXG5cdF9nZXRDb250ZW50SWQ6IGZ1bmN0aW9uICh2YWx1ZUhlbHBJZDogc3RyaW5nLCB2YWx1ZUhlbHBRdWFsaWZpZXI6IHN0cmluZywgaXNUeXBlYWhlYWQ6IGJvb2xlYW4pOiBzdHJpbmcge1xuXHRcdGNvbnN0IGNvbnRlbnRUeXBlID0gaXNUeXBlYWhlYWQgPyBcIlBvcG92ZXJcIiA6IFwiRGlhbG9nXCI7XG5cblx0XHRyZXR1cm4gYCR7dmFsdWVIZWxwSWR9Ojoke2NvbnRlbnRUeXBlfTo6cXVhbGlmaWVyOjoke3ZhbHVlSGVscFF1YWxpZmllcn1gO1xuXHR9LFxuXG5cdF9hZGRJbk91dFBhcmFtZXRlcnNUb1BheWxvYWQ6IGZ1bmN0aW9uIChwYXlsb2FkOiBWYWx1ZUhlbHBQYXlsb2FkLCB2YWx1ZUxpc3RJbmZvOiBWYWx1ZUxpc3RJbmZvKTogdm9pZCB7XG5cdFx0Y29uc3QgdmFsdWVIZWxwUXVhbGlmaWVyID0gdmFsdWVMaXN0SW5mby52YWx1ZUhlbHBRdWFsaWZpZXI7XG5cblx0XHRpZiAoIXBheWxvYWQucXVhbGlmaWVycykge1xuXHRcdFx0cGF5bG9hZC5xdWFsaWZpZXJzID0ge307XG5cdFx0fVxuXG5cdFx0aWYgKCFwYXlsb2FkLnF1YWxpZmllcnNbdmFsdWVIZWxwUXVhbGlmaWVyXSkge1xuXHRcdFx0cGF5bG9hZC5xdWFsaWZpZXJzW3ZhbHVlSGVscFF1YWxpZmllcl0gPSB7XG5cdFx0XHRcdHZoS2V5czogdmFsdWVMaXN0SW5mby52aEtleXMsXG5cdFx0XHRcdHZoUGFyYW1ldGVyczogdmFsdWVMaXN0SW5mby52aFBhcmFtZXRlcnNcblx0XHRcdH07XG5cdFx0fVxuXHR9LFxuXG5cdF9nZXRWYWx1ZUhlbHBDb2x1bW5EaXNwbGF5Rm9ybWF0OiBmdW5jdGlvbiAoXG5cdFx0cHJvcGVydHlBbm5vdGF0aW9uczogQW5ub3RhdGlvbnNGb3JQcm9wZXJ0eSxcblx0XHRpc1ZhbHVlSGVscFdpdGhGaXhlZFZhbHVlczogYm9vbGVhblxuXHQpOiBEaXNwbGF5Rm9ybWF0IHtcblx0XHRjb25zdCBkaXNwbGF5TW9kZSA9IENvbW1vblV0aWxzLmNvbXB1dGVEaXNwbGF5TW9kZShwcm9wZXJ0eUFubm90YXRpb25zLCB1bmRlZmluZWQpLFxuXHRcdFx0dGV4dEFubm90YXRpb24gPSBwcm9wZXJ0eUFubm90YXRpb25zICYmIHByb3BlcnR5QW5ub3RhdGlvbnNbQW5ub3RhdGlvblRleHRdLFxuXHRcdFx0dGV4dEFycmFuZ2VtZW50QW5ub3RhdGlvbiA9IHRleHRBbm5vdGF0aW9uICYmIHByb3BlcnR5QW5ub3RhdGlvbnNbQW5ub3RhdGlvblRleHRVSVRleHRBcnJhbmdlbWVudF07XG5cblx0XHRpZiAoaXNWYWx1ZUhlbHBXaXRoRml4ZWRWYWx1ZXMpIHtcblx0XHRcdHJldHVybiB0ZXh0QW5ub3RhdGlvbiAmJiB0eXBlb2YgdGV4dEFubm90YXRpb24gIT09IFwic3RyaW5nXCIgJiYgdGV4dEFubm90YXRpb24uJFBhdGggPyBkaXNwbGF5TW9kZSA6IFwiVmFsdWVcIjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gT25seSBleHBsaWNpdCBkZWZpbmVkIFRleHRBcnJhbmdlbWVudHMgaW4gYSBWYWx1ZSBIZWxwIHdpdGggRGlhbG9nIGFyZSBjb25zaWRlcmVkXG5cdFx0XHRyZXR1cm4gdGV4dEFycmFuZ2VtZW50QW5ub3RhdGlvbiA/IGRpc3BsYXlNb2RlIDogXCJWYWx1ZVwiO1xuXHRcdH1cblx0fSxcblxuXHRfZ2V0V2lkdGhJblJlbTogZnVuY3Rpb24gKGNvbnRyb2w6IENvbnRyb2wsIGlzVW5pdFZhbHVlSGVscDogYm9vbGVhbik6IG51bWJlciB7XG5cdFx0bGV0IHdpZHRoID0gY29udHJvbC4kKCkud2lkdGgoKTsgLy8gSlF1ZXJ5XG5cdFx0aWYgKGlzVW5pdFZhbHVlSGVscCAmJiB3aWR0aCkge1xuXHRcdFx0d2lkdGggPSAwLjMgKiB3aWR0aDtcblx0XHR9XG5cdFx0Y29uc3QgZmxvYXRXaWR0aCA9IHdpZHRoID8gcGFyc2VGbG9hdChTdHJpbmcoUmVtLmZyb21QeCh3aWR0aCkpKSA6IDA7XG5cblx0XHRyZXR1cm4gaXNOYU4oZmxvYXRXaWR0aCkgPyAwIDogZmxvYXRXaWR0aDtcblx0fSxcblxuXHRnZXRUYWJsZVdpZHRoOiBmdW5jdGlvbiAodGFibGU6IFRhYmxlLCBtaW5XaWR0aDogbnVtYmVyKTogc3RyaW5nIHtcblx0XHRsZXQgd2lkdGg6IHN0cmluZztcblx0XHRjb25zdCBjb2x1bW5zID0gdGFibGUuZ2V0Q29sdW1ucygpLFxuXHRcdFx0dmlzaWJsZUNvbHVtbnMgPVxuXHRcdFx0XHQoY29sdW1ucyAmJlxuXHRcdFx0XHRcdGNvbHVtbnMuZmlsdGVyKGZ1bmN0aW9uIChjb2x1bW4pIHtcblx0XHRcdFx0XHRcdHJldHVybiBjb2x1bW4gJiYgY29sdW1uLmdldFZpc2libGUgJiYgY29sdW1uLmdldFZpc2libGUoKTtcblx0XHRcdFx0XHR9KSkgfHxcblx0XHRcdFx0W10sXG5cdFx0XHRzdW1XaWR0aCA9IHZpc2libGVDb2x1bW5zLnJlZHVjZShmdW5jdGlvbiAoc3VtLCBjb2x1bW4pIHtcblx0XHRcdFx0d2lkdGggPSBjb2x1bW4uZ2V0V2lkdGgoKTtcblx0XHRcdFx0aWYgKHdpZHRoICYmIHdpZHRoLmVuZHNXaXRoKFwicHhcIikpIHtcblx0XHRcdFx0XHR3aWR0aCA9IFN0cmluZyhSZW0uZnJvbVB4KHdpZHRoKSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc3QgZmxvYXRXaWR0aCA9IHBhcnNlRmxvYXQod2lkdGgpO1xuXG5cdFx0XHRcdHJldHVybiBzdW0gKyAoaXNOYU4oZmxvYXRXaWR0aCkgPyA5IDogZmxvYXRXaWR0aCk7XG5cdFx0XHR9LCB2aXNpYmxlQ29sdW1ucy5sZW5ndGgpO1xuXHRcdHJldHVybiBgJHtNYXRoLm1heChzdW1XaWR0aCwgbWluV2lkdGgpfWVtYDtcblx0fSxcblxuXHRjcmVhdGVWYWx1ZUhlbHBUeXBlYWhlYWQ6IGZ1bmN0aW9uIChcblx0XHRwcm9wZXJ0eVBhdGg6IHN0cmluZyxcblx0XHR2YWx1ZUhlbHA6IFZhbHVlSGVscCxcblx0XHRjb250ZW50OiBNVGFibGUsXG5cdFx0dmFsdWVMaXN0SW5mbzogVmFsdWVMaXN0SW5mbyxcblx0XHRwYXlsb2FkOiBWYWx1ZUhlbHBQYXlsb2FkXG5cdCk6IFByb21pc2U8YW55PiB7XG5cdFx0Y29uc3QgY29udGVudElkID0gY29udGVudC5nZXRJZCgpLFxuXHRcdFx0cHJvcGVydHlBbm5vdGF0aW9ucyA9IHZhbHVlSGVscC5nZXRNb2RlbCgpLmdldE1ldGFNb2RlbCgpLmdldE9iamVjdChgJHtwcm9wZXJ0eVBhdGh9QGApIGFzIEFubm90YXRpb25zRm9yUHJvcGVydHksXG5cdFx0XHR2YWx1ZUhlbHBXaXRoRml4ZWRWYWx1ZXMgPSBwcm9wZXJ0eUFubm90YXRpb25zW0Fubm90YXRpb25WYWx1ZUxpc3RXaXRoRml4ZWRWYWx1ZXNdIHx8IGZhbHNlLFxuXHRcdFx0aXNEaWFsb2dUYWJsZSA9IGZhbHNlLFxuXHRcdFx0Y29sdW1uSW5mbyA9IFZhbHVlTGlzdEhlbHBlckNvbW1vbi5nZXRDb2x1bW5WaXNpYmlsaXR5SW5mbyhcblx0XHRcdFx0dmFsdWVMaXN0SW5mby52YWx1ZUxpc3RJbmZvLFxuXHRcdFx0XHRwcm9wZXJ0eVBhdGgsXG5cdFx0XHRcdHZhbHVlSGVscFdpdGhGaXhlZFZhbHVlcyxcblx0XHRcdFx0aXNEaWFsb2dUYWJsZVxuXHRcdFx0KSxcblx0XHRcdHNvdXJjZU1vZGVsID0gbmV3IEpTT05Nb2RlbCh7XG5cdFx0XHRcdGlkOiBjb250ZW50SWQsXG5cdFx0XHRcdGdyb3VwSWQ6IHBheWxvYWQucmVxdWVzdEdyb3VwSWQgfHwgdW5kZWZpbmVkLFxuXHRcdFx0XHRiU3VnZ2VzdGlvbjogdHJ1ZSxcblx0XHRcdFx0cHJvcGVydHlQYXRoOiBwcm9wZXJ0eVBhdGgsXG5cdFx0XHRcdGNvbHVtbkluZm86IGNvbHVtbkluZm8sXG5cdFx0XHRcdHZhbHVlSGVscFdpdGhGaXhlZFZhbHVlczogcHJvcGVydHlBbm5vdGF0aW9uc1tBbm5vdGF0aW9uVmFsdWVMaXN0V2l0aEZpeGVkVmFsdWVzXVxuXHRcdFx0fSk7XG5cblx0XHRjb250ZW50LnNldEtleVBhdGgodmFsdWVMaXN0SW5mby5rZXlWYWx1ZSk7XG5cdFx0Y29udGVudC5zZXREZXNjcmlwdGlvblBhdGgodmFsdWVMaXN0SW5mby5kZXNjcmlwdGlvblZhbHVlKTtcblxuXHRcdGNvbnN0IGNvbGxlY3Rpb25Bbm5vdGF0aW9ucyA9ICh2YWx1ZUxpc3RJbmZvLnZhbHVlTGlzdEluZm8uJG1vZGVsXG5cdFx0XHQuZ2V0TWV0YU1vZGVsKClcblx0XHRcdC5nZXRPYmplY3QoYC8ke3ZhbHVlTGlzdEluZm8udmFsdWVMaXN0SW5mby5Db2xsZWN0aW9uUGF0aH1AYCkgfHwge30pIGFzIEFubm90YXRpb25zRm9yQ29sbGVjdGlvbjtcblxuXHRcdGNvbnRlbnQuc2V0RmlsdGVyRmllbGRzKFZhbHVlTGlzdEhlbHBlci5lbnRpdHlJc1NlYXJjaGFibGUocHJvcGVydHlBbm5vdGF0aW9ucywgY29sbGVjdGlvbkFubm90YXRpb25zKSA/IFwiJHNlYXJjaFwiIDogXCJcIik7XG5cblx0XHRjb25zdCB0YWJsZU9yUHJvbWlzZSA9XG5cdFx0XHRjb250ZW50LmdldFRhYmxlKCkgfHxcblx0XHRcdFZhbHVlTGlzdEhlbHBlci5fdGVtcGxhdGVGcmFnbWVudChcInNhcC5mZS5tYWNyb3MuaW50ZXJuYWwudmFsdWVoZWxwLlZhbHVlTGlzdFRhYmxlXCIsIHZhbHVlTGlzdEluZm8sIHNvdXJjZU1vZGVsLCBwcm9wZXJ0eVBhdGgpO1xuXG5cdFx0cmV0dXJuIFByb21pc2UuYWxsKFt0YWJsZU9yUHJvbWlzZV0pLnRoZW4oZnVuY3Rpb24gKGNvbnRyb2xzKSB7XG5cdFx0XHRjb25zdCB0YWJsZSA9IGNvbnRyb2xzWzBdO1xuXG5cdFx0XHR0YWJsZS5zZXRNb2RlbCh2YWx1ZUxpc3RJbmZvLnZhbHVlTGlzdEluZm8uJG1vZGVsKTtcblxuXHRcdFx0TG9nLmluZm8oYFZhbHVlIExpc3QtIHN1Z2dlc3QgVGFibGUgWE1MIGNvbnRlbnQgY3JlYXRlZCBbJHtwcm9wZXJ0eVBhdGh9XWAsIHRhYmxlLmdldE1ldGFkYXRhKCkuZ2V0TmFtZSgpLCBcIk1EQyBUZW1wbGF0aW5nXCIpO1xuXG5cdFx0XHRjb250ZW50LnNldFRhYmxlKHRhYmxlKTtcblxuXHRcdFx0Y29uc3QgZmllbGQgPSB2YWx1ZUhlbHAuZ2V0Q29udHJvbCgpO1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRmaWVsZCAmJlxuXHRcdFx0XHQoZmllbGQuaXNBKFwic2FwLnVpLm1kYy5GaWx0ZXJGaWVsZFwiKSB8fCBmaWVsZC5pc0EoXCJzYXAudWkubWRjLkZpZWxkXCIpIHx8IGZpZWxkLmlzQShcInNhcC51aS5tZGMuTXVsdGlWYWx1ZUZpZWxkXCIpKVxuXHRcdFx0KSB7XG5cdFx0XHRcdC8vQ2FuIHRoZSBmaWx0ZXJmaWVsZCBiZSBzb21ldGhpbmcgZWxzZSB0aGF0IHdlIG5lZWQgdGhlIC5pc0EoKSBjaGVjaz9cblx0XHRcdFx0Y29uc3QgcmVkdWNlV2lkdGhGb3JVbml0VmFsdWVIZWxwID0gQm9vbGVhbihwYXlsb2FkLmlzVW5pdFZhbHVlSGVscCk7XG5cdFx0XHRcdGNvbnN0IHRhYmxlV2lkdGggPSBWYWx1ZUxpc3RIZWxwZXIuZ2V0VGFibGVXaWR0aCh0YWJsZSwgVmFsdWVMaXN0SGVscGVyLl9nZXRXaWR0aEluUmVtKGZpZWxkLCByZWR1Y2VXaWR0aEZvclVuaXRWYWx1ZUhlbHApKTtcblx0XHRcdFx0dGFibGUuc2V0V2lkdGgodGFibGVXaWR0aCk7XG5cblx0XHRcdFx0aWYgKHZhbHVlSGVscFdpdGhGaXhlZFZhbHVlcykge1xuXHRcdFx0XHRcdHRhYmxlLnNldE1vZGUoKGZpZWxkIGFzIEZpZWxkQmFzZSkuZ2V0TWF4Q29uZGl0aW9ucygpID09PSAxID8gXCJTaW5nbGVTZWxlY3RNYXN0ZXJcIiA6IFwiTXVsdGlTZWxlY3RcIik7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGFibGUuc2V0TW9kZShcIlNpbmdsZVNlbGVjdE1hc3RlclwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXG5cdGNyZWF0ZVZhbHVlSGVscERpYWxvZzogZnVuY3Rpb24gKFxuXHRcdHByb3BlcnR5UGF0aDogc3RyaW5nLFxuXHRcdHZhbHVlSGVscDogVmFsdWVIZWxwLFxuXHRcdGNvbnRlbnQ6IE1EQ1RhYmxlLFxuXHRcdHZhbHVlTGlzdEluZm86IFZhbHVlTGlzdEluZm8sXG5cdFx0cGF5bG9hZDogVmFsdWVIZWxwUGF5bG9hZFxuXHQpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRjb25zdCBwcm9wZXJ0eUFubm90YXRpb25zID0gdmFsdWVIZWxwLmdldE1vZGVsKCkuZ2V0TWV0YU1vZGVsKCkuZ2V0T2JqZWN0KGAke3Byb3BlcnR5UGF0aH1AYCkgYXMgQW5ub3RhdGlvbnNGb3JQcm9wZXJ0eSxcblx0XHRcdGlzRHJvcERvd25MaXN0ZSA9IGZhbHNlLFxuXHRcdFx0aXNEaWFsb2dUYWJsZSA9IHRydWUsXG5cdFx0XHRjb2x1bW5JbmZvID0gVmFsdWVMaXN0SGVscGVyQ29tbW9uLmdldENvbHVtblZpc2liaWxpdHlJbmZvKFxuXHRcdFx0XHR2YWx1ZUxpc3RJbmZvLnZhbHVlTGlzdEluZm8sXG5cdFx0XHRcdHByb3BlcnR5UGF0aCxcblx0XHRcdFx0aXNEcm9wRG93bkxpc3RlLFxuXHRcdFx0XHRpc0RpYWxvZ1RhYmxlXG5cdFx0XHQpLFxuXHRcdFx0c291cmNlTW9kZWwgPSBuZXcgSlNPTk1vZGVsKHtcblx0XHRcdFx0aWQ6IGNvbnRlbnQuZ2V0SWQoKSxcblx0XHRcdFx0Z3JvdXBJZDogcGF5bG9hZC5yZXF1ZXN0R3JvdXBJZCB8fCB1bmRlZmluZWQsXG5cdFx0XHRcdGJTdWdnZXN0aW9uOiBmYWxzZSxcblx0XHRcdFx0Y29sdW1uSW5mbzogY29sdW1uSW5mbyxcblx0XHRcdFx0dmFsdWVIZWxwV2l0aEZpeGVkVmFsdWVzOiBpc0Ryb3BEb3duTGlzdGVcblx0XHRcdH0pO1xuXG5cdFx0Y29udGVudC5zZXRLZXlQYXRoKHZhbHVlTGlzdEluZm8ua2V5VmFsdWUpO1xuXHRcdGNvbnRlbnQuc2V0RGVzY3JpcHRpb25QYXRoKHZhbHVlTGlzdEluZm8uZGVzY3JpcHRpb25WYWx1ZSk7XG5cblx0XHRjb25zdCBjb2xsZWN0aW9uQW5ub3RhdGlvbnMgPSAodmFsdWVMaXN0SW5mby52YWx1ZUxpc3RJbmZvLiRtb2RlbFxuXHRcdFx0LmdldE1ldGFNb2RlbCgpXG5cdFx0XHQuZ2V0T2JqZWN0KGAvJHt2YWx1ZUxpc3RJbmZvLnZhbHVlTGlzdEluZm8uQ29sbGVjdGlvblBhdGh9QGApIHx8IHt9KSBhcyBBbm5vdGF0aW9uc0ZvckNvbGxlY3Rpb247XG5cblx0XHRjb250ZW50LnNldEZpbHRlckZpZWxkcyhWYWx1ZUxpc3RIZWxwZXIuZW50aXR5SXNTZWFyY2hhYmxlKHByb3BlcnR5QW5ub3RhdGlvbnMsIGNvbGxlY3Rpb25Bbm5vdGF0aW9ucykgPyBcIiRzZWFyY2hcIiA6IFwiXCIpO1xuXG5cdFx0Y29uc3QgdGFibGVPclByb21pc2UgPVxuXHRcdFx0Y29udGVudC5nZXRUYWJsZSgpIHx8XG5cdFx0XHRWYWx1ZUxpc3RIZWxwZXIuX3RlbXBsYXRlRnJhZ21lbnQoXG5cdFx0XHRcdFwic2FwLmZlLm1hY3Jvcy5pbnRlcm5hbC52YWx1ZWhlbHAuVmFsdWVMaXN0RGlhbG9nVGFibGVcIixcblx0XHRcdFx0dmFsdWVMaXN0SW5mbyxcblx0XHRcdFx0c291cmNlTW9kZWwsXG5cdFx0XHRcdHByb3BlcnR5UGF0aCxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGVuYWJsZUF1dG9Db2x1bW5XaWR0aDogIXN5c3RlbS5waG9uZVxuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXG5cdFx0Y29uc3QgZmlsdGVyQmFyT3JQcm9taXNlID1cblx0XHRcdGNvbnRlbnQuZ2V0RmlsdGVyQmFyKCkgfHxcblx0XHRcdFZhbHVlTGlzdEhlbHBlci5fdGVtcGxhdGVGcmFnbWVudChcblx0XHRcdFx0XCJzYXAuZmUubWFjcm9zLmludGVybmFsLnZhbHVlaGVscC5WYWx1ZUxpc3RGaWx0ZXJCYXJcIixcblx0XHRcdFx0dmFsdWVMaXN0SW5mbyxcblx0XHRcdFx0c291cmNlTW9kZWwsXG5cdFx0XHRcdHByb3BlcnR5UGF0aFxuXHRcdFx0KTtcblxuXHRcdHJldHVybiBQcm9taXNlLmFsbChbdGFibGVPclByb21pc2UsIGZpbHRlckJhck9yUHJvbWlzZV0pLnRoZW4oZnVuY3Rpb24gKGNvbnRyb2xzKSB7XG5cdFx0XHRjb25zdCB0YWJsZSA9IGNvbnRyb2xzWzBdLFxuXHRcdFx0XHRmaWx0ZXJCYXIgPSBjb250cm9sc1sxXTtcblxuXHRcdFx0dGFibGUuc2V0TW9kZWwodmFsdWVMaXN0SW5mby52YWx1ZUxpc3RJbmZvLiRtb2RlbCk7XG5cdFx0XHRmaWx0ZXJCYXIuc2V0TW9kZWwodmFsdWVMaXN0SW5mby52YWx1ZUxpc3RJbmZvLiRtb2RlbCk7XG5cblx0XHRcdGNvbnRlbnQuc2V0RmlsdGVyQmFyKGZpbHRlckJhcik7XG5cdFx0XHRjb250ZW50LnNldFRhYmxlKHRhYmxlKTtcblxuXHRcdFx0dGFibGUuc2V0RmlsdGVyKGZpbHRlckJhci5nZXRJZCgpKTtcblx0XHRcdHRhYmxlLmluaXRpYWxpemVkKCk7XG5cblx0XHRcdGNvbnN0IGZpZWxkID0gdmFsdWVIZWxwLmdldENvbnRyb2woKTtcblx0XHRcdGlmIChmaWVsZCkge1xuXHRcdFx0XHR0YWJsZS5zZXRTZWxlY3Rpb25Nb2RlKChmaWVsZCBhcyBGaWVsZEJhc2UpLmdldE1heENvbmRpdGlvbnMoKSA9PT0gMSA/IFwiU2luZ2xlXCIgOiBcIk11bHRpXCIpO1xuXHRcdFx0fVxuXHRcdFx0dGFibGUuc2V0V2lkdGgoXCIxMDAlXCIpO1xuXG5cdFx0XHQvL1RoaXMgaXMgYSB0ZW1wb3Jhcnkgd29ya2Fycm91bmQgLSBwcm92aWRlZCBieSBNREMgKHNlZSBGSU9SSVRFQ0hQMS0yNDAwMilcblx0XHRcdGNvbnN0IG1kY1RhYmxlID0gdGFibGUgYXMgYW55O1xuXHRcdFx0bWRjVGFibGUuX3NldFNob3dQMTNuQnV0dG9uKGZhbHNlKTtcblx0XHR9KTtcblx0fSxcblxuXHRfZ2V0Q29udGVudEJ5SWQ6IGZ1bmN0aW9uIChjb250ZW50TGlzdDogQ29udGVudFtdLCBjb250ZW50SWQ6IHN0cmluZyk6IENvbnRlbnQgfCB1bmRlZmluZWQge1xuXHRcdHJldHVybiBjb250ZW50TGlzdC5maW5kKGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHRyZXR1cm4gaXRlbS5nZXRJZCgpID09PSBjb250ZW50SWQ7XG5cdFx0fSk7XG5cdH0sXG5cblx0X2NyZWF0ZVBvcG92ZXJDb250ZW50OiBmdW5jdGlvbiAoY29udGVudElkOiBzdHJpbmcsIGNhc2VTZW5zaXRpdmU6IGJvb2xlYW4pIHtcblx0XHRyZXR1cm4gbmV3IE1UYWJsZSh7XG5cdFx0XHRpZDogY29udGVudElkLFxuXHRcdFx0Z3JvdXA6IFwiZ3JvdXAxXCIsXG5cdFx0XHRjYXNlU2Vuc2l0aXZlOiBjYXNlU2Vuc2l0aXZlXG5cdFx0fSBhcyBhbnkpOyAvL2FzICRNVGFibGVTZXR0aW5nc1xuXHR9LFxuXG5cdF9jcmVhdGVEaWFsb2dDb250ZW50OiBmdW5jdGlvbiAoY29udGVudElkOiBzdHJpbmcsIGNhc2VTZW5zaXRpdmU6IGJvb2xlYW4sIGZvcmNlQmluZDogYm9vbGVhbikge1xuXHRcdHJldHVybiBuZXcgTURDVGFibGUoe1xuXHRcdFx0aWQ6IGNvbnRlbnRJZCxcblx0XHRcdGdyb3VwOiBcImdyb3VwMVwiLFxuXHRcdFx0Y2FzZVNlbnNpdGl2ZTogY2FzZVNlbnNpdGl2ZSxcblx0XHRcdGZvcmNlQmluZDogZm9yY2VCaW5kXG5cdFx0fSBhcyBhbnkpOyAvL2FzICRNRENUYWJsZVNldHRpbmdzXG5cdH0sXG5cblx0c2hvd1ZhbHVlTGlzdDogZnVuY3Rpb24gKHBheWxvYWQ6IFZhbHVlSGVscFBheWxvYWQsIGNvbnRhaW5lcjogQ29udGFpbmVyLCBzZWxlY3RlZENvbnRlbnRJZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0Y29uc3QgdmFsdWVIZWxwID0gY29udGFpbmVyLmdldFBhcmVudCgpIGFzIFZhbHVlSGVscCxcblx0XHRcdGlzVHlwZWFoZWFkID0gY29udGFpbmVyLmlzVHlwZWFoZWFkKCksXG5cdFx0XHRwcm9wZXJ0eVBhdGggPSBwYXlsb2FkLnByb3BlcnR5UGF0aCxcblx0XHRcdG1ldGFNb2RlbCA9IHZhbHVlSGVscC5nZXRNb2RlbCgpLmdldE1ldGFNb2RlbCgpIGFzIE9EYXRhTWV0YU1vZGVsLFxuXHRcdFx0dmhVSU1vZGVsID0gKHZhbHVlSGVscC5nZXRNb2RlbChcIl9WSFVJXCIpIGFzIEpTT05Nb2RlbCkgfHwgVmFsdWVMaXN0SGVscGVyLmNyZWF0ZVZIVUlNb2RlbCh2YWx1ZUhlbHAsIHByb3BlcnR5UGF0aCwgbWV0YU1vZGVsKSxcblx0XHRcdHNob3dDb25kaXRpb25QYW5lbCA9IHZhbHVlSGVscC5kYXRhKFwic2hvd0NvbmRpdGlvblBhbmVsXCIpICYmIHZhbHVlSGVscC5kYXRhKFwic2hvd0NvbmRpdGlvblBhbmVsXCIpICE9PSBcImZhbHNlXCI7XG5cblx0XHRpZiAoIXBheWxvYWQucXVhbGlmaWVycykge1xuXHRcdFx0cGF5bG9hZC5xdWFsaWZpZXJzID0ge307XG5cdFx0fVxuXG5cdFx0dmhVSU1vZGVsLnNldFByb3BlcnR5KFwiL2lzU3VnZ2VzdGlvblwiLCBpc1R5cGVhaGVhZCk7XG5cdFx0dmhVSU1vZGVsLnNldFByb3BlcnR5KFwiL21pblNjcmVlbldpZHRoXCIsICFpc1R5cGVhaGVhZCA/IFwiNDE4cHhcIiA6IHVuZGVmaW5lZCk7XG5cblx0XHRyZXR1cm4gVmFsdWVMaXN0SGVscGVyLmdldFZhbHVlTGlzdEluZm8odmFsdWVIZWxwLCBwcm9wZXJ0eVBhdGgsIHBheWxvYWQpXG5cdFx0XHQudGhlbihmdW5jdGlvbiAodmFsdWVMaXN0SW5mb3MpIHtcblx0XHRcdFx0Y29uc3QgY2FzZVNlbnNpdGl2ZSA9IHZhbHVlSGVscC5nZXRUeXBlYWhlYWQoKS5nZXRDb250ZW50KClbMF0uZ2V0Q2FzZVNlbnNpdGl2ZSgpOyAvLyB0YWtlIGNhc2VTZW5zaXRpdmUgZnJvbSBmaXJzdCBUeXBlYWhlYWQgY29udGVudFxuXHRcdFx0XHRsZXQgY29udGVudExpc3QgPSBjb250YWluZXIuZ2V0Q29udGVudCgpO1xuXG5cdFx0XHRcdGlmIChpc1R5cGVhaGVhZCkge1xuXHRcdFx0XHRcdGxldCBxdWFsaWZpZXJGb3JUeXBlYWhlYWQgPSB2YWx1ZUhlbHAuZGF0YShcInZhbHVlbGlzdEZvclZhbGlkYXRpb25cIikgfHwgXCJcIjsgLy8gY2FuIGFsc28gYmUgbnVsbFxuXHRcdFx0XHRcdGlmIChxdWFsaWZpZXJGb3JUeXBlYWhlYWQgPT09IFwiIFwiKSB7XG5cdFx0XHRcdFx0XHRxdWFsaWZpZXJGb3JUeXBlYWhlYWQgPSBcIlwiO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjb25zdCB2YWx1ZUxpc3RJbmZvID0gcXVhbGlmaWVyRm9yVHlwZWFoZWFkXG5cdFx0XHRcdFx0XHQ/IHZhbHVlTGlzdEluZm9zLmZpbHRlcihmdW5jdGlvbiAoc3ViVmFsdWVMaXN0SW5mbykge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBzdWJWYWx1ZUxpc3RJbmZvLnZhbHVlSGVscFF1YWxpZmllciA9PT0gcXVhbGlmaWVyRm9yVHlwZWFoZWFkO1xuXHRcdFx0XHRcdFx0ICB9KVswXVxuXHRcdFx0XHRcdFx0OiB2YWx1ZUxpc3RJbmZvc1swXTtcblxuXHRcdFx0XHRcdFZhbHVlTGlzdEhlbHBlci5fYWRkSW5PdXRQYXJhbWV0ZXJzVG9QYXlsb2FkKHBheWxvYWQsIHZhbHVlTGlzdEluZm8pO1xuXG5cdFx0XHRcdFx0Y29uc3QgY29udGVudElkID0gVmFsdWVMaXN0SGVscGVyLl9nZXRDb250ZW50SWQodmFsdWVIZWxwLmdldElkKCksIHZhbHVlTGlzdEluZm8udmFsdWVIZWxwUXVhbGlmaWVyLCBpc1R5cGVhaGVhZCk7XG5cdFx0XHRcdFx0bGV0IGNvbnRlbnQgPSBWYWx1ZUxpc3RIZWxwZXIuX2dldENvbnRlbnRCeUlkKGNvbnRlbnRMaXN0LCBjb250ZW50SWQpO1xuXG5cdFx0XHRcdFx0aWYgKCFjb250ZW50KSB7XG5cdFx0XHRcdFx0XHRjb250ZW50ID0gVmFsdWVMaXN0SGVscGVyLl9jcmVhdGVQb3BvdmVyQ29udGVudChjb250ZW50SWQsIGNhc2VTZW5zaXRpdmUpO1xuXG5cdFx0XHRcdFx0XHRjb250YWluZXIuaW5zZXJ0Q29udGVudChjb250ZW50LCAwKTsgLy8gaW5zZXJ0IGNvbnRlbnQgYXMgZmlyc3QgY29udGVudFxuXHRcdFx0XHRcdFx0Y29udGVudExpc3QgPSBjb250YWluZXIuZ2V0Q29udGVudCgpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoY29udGVudElkICE9PSBjb250ZW50TGlzdFswXS5nZXRJZCgpKSB7XG5cdFx0XHRcdFx0XHQvLyBjb250ZW50IGFscmVhZHkgYXZhaWxhYmxlIGJ1dCBub3QgYXMgZmlyc3QgY29udGVudD9cblx0XHRcdFx0XHRcdGNvbnRhaW5lci5yZW1vdmVDb250ZW50KGNvbnRlbnQpO1xuXHRcdFx0XHRcdFx0Y29udGFpbmVyLmluc2VydENvbnRlbnQoY29udGVudCwgMCk7IC8vIG1vdmUgY29udGVudCB0byBmaXJzdCBwb3NpdGlvblxuXHRcdFx0XHRcdFx0Y29udGVudExpc3QgPSBjb250YWluZXIuZ2V0Q29udGVudCgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHBheWxvYWQudmFsdWVIZWxwUXVhbGlmaWVyID0gdmFsdWVMaXN0SW5mby52YWx1ZUhlbHBRdWFsaWZpZXI7XG5cblx0XHRcdFx0XHRjb250ZW50LnNldFRpdGxlKHZhbHVlTGlzdEluZm8udmFsdWVMaXN0SW5mby5MYWJlbCk7XG5cblx0XHRcdFx0XHRyZXR1cm4gVmFsdWVMaXN0SGVscGVyLmNyZWF0ZVZhbHVlSGVscFR5cGVhaGVhZChwcm9wZXJ0eVBhdGgsIHZhbHVlSGVscCwgY29udGVudCBhcyBNVGFibGUsIHZhbHVlTGlzdEluZm8sIHBheWxvYWQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIERpYWxvZ1xuXG5cdFx0XHRcdFx0Ly8gc2V0IGFsbCBjb250ZW50cyB0byBpbnZpc2libGVcblx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNvbnRlbnRMaXN0Lmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0XHRcdFx0XHRjb250ZW50TGlzdFtpXS5zZXRWaXNpYmxlKGZhbHNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHNob3dDb25kaXRpb25QYW5lbCkge1xuXHRcdFx0XHRcdFx0bGV0IGNvbmRpdGlvbnNDb250ZW50ID1cblx0XHRcdFx0XHRcdFx0Y29udGVudExpc3QubGVuZ3RoICYmXG5cdFx0XHRcdFx0XHRcdGNvbnRlbnRMaXN0W2NvbnRlbnRMaXN0Lmxlbmd0aCAtIDFdLmdldE1ldGFkYXRhKCkuZ2V0TmFtZSgpID09PSBcInNhcC51aS5tZGMudmFsdWVoZWxwLmNvbnRlbnQuQ29uZGl0aW9uc1wiXG5cdFx0XHRcdFx0XHRcdFx0PyBjb250ZW50TGlzdFtjb250ZW50TGlzdC5sZW5ndGggLSAxXVxuXHRcdFx0XHRcdFx0XHRcdDogdW5kZWZpbmVkO1xuXG5cdFx0XHRcdFx0XHRpZiAoY29uZGl0aW9uc0NvbnRlbnQpIHtcblx0XHRcdFx0XHRcdFx0Y29uZGl0aW9uc0NvbnRlbnQuc2V0VmlzaWJsZSh0cnVlKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGNvbmRpdGlvbnNDb250ZW50ID0gbmV3IENvbmRpdGlvbnMoKTtcblx0XHRcdFx0XHRcdFx0Y29udGFpbmVyLmFkZENvbnRlbnQoY29uZGl0aW9uc0NvbnRlbnQpO1xuXHRcdFx0XHRcdFx0XHRjb250ZW50TGlzdCA9IGNvbnRhaW5lci5nZXRDb250ZW50KCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0bGV0IHNlbGVjdGVkSW5mbzogVmFsdWVMaXN0SW5mbyB8IHVuZGVmaW5lZCwgc2VsZWN0ZWRDb250ZW50OiBDb250ZW50IHwgdW5kZWZpbmVkO1xuXG5cdFx0XHRcdFx0Ly8gQ3JlYXRlIG9yIHJldXNlIGNvbnRlbnRzIGZvciB0aGUgY3VycmVudCBjb250ZXh0XG5cdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZUxpc3RJbmZvcy5sZW5ndGg7IGkgKz0gMSkge1xuXHRcdFx0XHRcdFx0Y29uc3QgdmFsdWVMaXN0SW5mbyA9IHZhbHVlTGlzdEluZm9zW2ldLFxuXHRcdFx0XHRcdFx0XHR2YWx1ZUhlbHBRdWFsaWZpZXIgPSB2YWx1ZUxpc3RJbmZvLnZhbHVlSGVscFF1YWxpZmllcjtcblxuXHRcdFx0XHRcdFx0VmFsdWVMaXN0SGVscGVyLl9hZGRJbk91dFBhcmFtZXRlcnNUb1BheWxvYWQocGF5bG9hZCwgdmFsdWVMaXN0SW5mbyk7XG5cblx0XHRcdFx0XHRcdGNvbnN0IGNvbnRlbnRJZCA9IFZhbHVlTGlzdEhlbHBlci5fZ2V0Q29udGVudElkKHZhbHVlSGVscC5nZXRJZCgpLCB2YWx1ZUhlbHBRdWFsaWZpZXIsIGlzVHlwZWFoZWFkKTtcblx0XHRcdFx0XHRcdGxldCBjb250ZW50ID0gVmFsdWVMaXN0SGVscGVyLl9nZXRDb250ZW50QnlJZChjb250ZW50TGlzdCwgY29udGVudElkKTtcblxuXHRcdFx0XHRcdFx0aWYgKCFjb250ZW50KSB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGZvcmNlQmluZCA9IHZhbHVlTGlzdEluZm8udmFsdWVMaXN0SW5mby5GZXRjaFZhbHVlcyA9PSAyID8gZmFsc2UgOiB0cnVlO1xuXG5cdFx0XHRcdFx0XHRcdGNvbnRlbnQgPSBWYWx1ZUxpc3RIZWxwZXIuX2NyZWF0ZURpYWxvZ0NvbnRlbnQoY29udGVudElkLCBjYXNlU2Vuc2l0aXZlLCBmb3JjZUJpbmQpO1xuXG5cdFx0XHRcdFx0XHRcdGlmICghc2hvd0NvbmRpdGlvblBhbmVsKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29udGFpbmVyLmFkZENvbnRlbnQoY29udGVudCk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29udGFpbmVyLmluc2VydENvbnRlbnQoY29udGVudCwgY29udGVudExpc3QubGVuZ3RoIC0gMSk7IC8vIGluc2VydCBjb250ZW50IGJlZm9yZSBjb25kaXRpb25zIGNvbnRlbnRcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRjb250ZW50TGlzdCA9IGNvbnRhaW5lci5nZXRDb250ZW50KCk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRjb250ZW50LnNldFZpc2libGUodHJ1ZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRjb250ZW50LnNldFRpdGxlKHZhbHVlTGlzdEluZm8udmFsdWVMaXN0SW5mby5MYWJlbCk7XG5cblx0XHRcdFx0XHRcdGlmICghc2VsZWN0ZWRDb250ZW50IHx8IChzZWxlY3RlZENvbnRlbnRJZCAmJiBzZWxlY3RlZENvbnRlbnRJZCA9PT0gY29udGVudElkKSkge1xuXHRcdFx0XHRcdFx0XHRzZWxlY3RlZENvbnRlbnQgPSBjb250ZW50O1xuXHRcdFx0XHRcdFx0XHRzZWxlY3RlZEluZm8gPSB2YWx1ZUxpc3RJbmZvO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICghc2VsZWN0ZWRJbmZvIHx8ICFzZWxlY3RlZENvbnRlbnQpIHtcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcInNlbGVjdGVkSW5mbyBvciBzZWxlY3RlZENvbnRlbnQgdW5kZWZpbmVkXCIpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHBheWxvYWQudmFsdWVIZWxwUXVhbGlmaWVyID0gc2VsZWN0ZWRJbmZvLnZhbHVlSGVscFF1YWxpZmllcjtcblx0XHRcdFx0XHRjb250YWluZXIuc2V0VGl0bGUoc2VsZWN0ZWRJbmZvLnZhbHVlTGlzdEluZm8uTGFiZWwpO1xuXG5cdFx0XHRcdFx0cmV0dXJuIFZhbHVlTGlzdEhlbHBlci5jcmVhdGVWYWx1ZUhlbHBEaWFsb2coXG5cdFx0XHRcdFx0XHRwcm9wZXJ0eVBhdGgsXG5cdFx0XHRcdFx0XHR2YWx1ZUhlbHAsXG5cdFx0XHRcdFx0XHRzZWxlY3RlZENvbnRlbnQgYXMgTURDVGFibGUsXG5cdFx0XHRcdFx0XHRzZWxlY3RlZEluZm8sXG5cdFx0XHRcdFx0XHRwYXlsb2FkXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5jYXRjaChmdW5jdGlvbiAoZXJyOiBFcnJvcikge1xuXHRcdFx0XHRjb25zdCBlcnJTdGF0dXMgPSAoZXJyIGFzIGFueSkuc3RhdHVzLFxuXHRcdFx0XHRcdG1zZyA9XG5cdFx0XHRcdFx0XHRlcnJTdGF0dXMgJiYgZXJyU3RhdHVzID09PSA0MDRcblx0XHRcdFx0XHRcdFx0PyBgTWV0YWRhdGEgbm90IGZvdW5kICgke2VyclN0YXR1c30pIGZvciB2YWx1ZSBoZWxwIG9mIHByb3BlcnR5ICR7cHJvcGVydHlQYXRofWBcblx0XHRcdFx0XHRcdFx0OiBlcnIubWVzc2FnZTtcblx0XHRcdFx0TG9nLmVycm9yKG1zZyk7XG5cdFx0XHRcdFZhbHVlTGlzdEhlbHBlci5kZXN0cm95VkhDb250ZW50KHZhbHVlSGVscCk7XG5cdFx0XHR9KTtcblx0fVxufTtc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