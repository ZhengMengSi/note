/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/fe/macros/ResourceModel",
		"sap/ui/model/odata/v4/AnnotationHelper",
		"sap/base/Log",
		"./StableIdHelper",
		"sap/ui/mdc/condition/ConditionModel",
		"sap/fe/core/CommonUtils",
		"sap/ui/mdc/odata/v4/FieldBaseDelegate",
		"sap/ui/mdc/condition/FilterOperatorUtil"
	],
	function(
		ResourceModel,
		ODataModelAnnotationHelper,
		Log,
		StableIdHelper,
		ConditionModel,
		CommonUtils,
		FieldBaseDelegate,
		FilterOperatorUtil
	) {
		"use strict";

		var Helper = {
			/**
			 * Determine if field is visible (= not hidden)
			 * @param {Object} target Target instance
			 * @param {Object} oInterface Interface instance
			 * @return {String/Boolean} - returns true, false, or expression with path, for example "{= !${IsActiveEntity} }"
			 */
			isVisible: function(target, oInterface) {
				var oModel = oInterface.context.getModel(),
					sPropertyPath = oInterface.context.getPath(),
					oAnnotations = oModel.getObject(sPropertyPath + "@"),
					hidden = oAnnotations["@com.sap.vocabularies.UI.v1.Hidden"];

				return typeof hidden === "object" ? "{= !${" + hidden.$Path + "} }" : !hidden;
			},
			fireButtonPress: function(oButton) {
				return CommonUtils.fireButtonPress(oButton);
			},
			/**
			 * Determine if field is editable
			 * @param {Object} target Target instance
			 * @param {Object} oInterface Interface instance
			 * @return {String} - returns sap.ui.mdc.EditMode.Editable, sap.ui.mdc.EditMode.ReadOnly
			 * 					  or expression with path, for example "{= %{HasDraftEntity} ? 'ReadOnly' : 'Editable' }"
			 */
			getParameterEditMode: function(target, oInterface) {
				var oModel = oInterface.context.getModel(),
					sPropertyPath = oInterface.context.getPath(),
					oAnnotations = oModel.getObject(sPropertyPath + "@"),
					fieldControl = oAnnotations["@com.sap.vocabularies.Common.v1.FieldControl"],
					immutable = oAnnotations["@Org.OData.Core.V1.Immutable"],
					computed = oAnnotations["@Org.OData.Core.V1.Computed"];

				if (fieldControl && fieldControl.$Path) {
					if (fieldControl.$Path === "ReadOnly") {
						return sap.ui.mdc.EditMode.ReadOnly;
					} else {
						return (
							"{= %{" +
							fieldControl.$Path +
							"} ? " +
							"'" +
							sap.ui.mdc.EditMode.ReadOnly +
							"'" +
							" : " +
							"'" +
							sap.ui.mdc.EditMode.Editable +
							"'" +
							" }"
						);
					}
				}

				if (fieldControl && fieldControl.$EnumMember) {
					if (fieldControl.$EnumMember === "com.sap.vocabularies.Common.v1.FieldControlType/ReadOnly") {
						return sap.ui.mdc.EditMode.ReadOnly;
					}
				}

				if (immutable || computed) {
					return sap.ui.mdc.EditMode.ReadOnly;
				}

				return sap.ui.mdc.EditMode.Editable;
			},
			/**
			 *  get the complete metapath to the target
			 */
			getMetaPath: function(target, oInterface) {
				return (oInterface && oInterface.context && oInterface.context.getPath()) || undefined;
			},
			getStableId: StableIdHelper.generate,
			getTargetCollection: function(oContext, navCollection) {
				var sPath = oContext.getPath(),
					aParts,
					entitySet,
					navigationCollection;
				if (oContext.getMetadata().getName() === "sap.ui.model.Context" && oContext.getObject("$kind") === "EntitySet") {
					return sPath;
				}
				if (oContext.getModel) {
					sPath =
						(oContext.getModel().getMetaPath && oContext.getModel().getMetaPath(sPath)) ||
						oContext
							.getModel()
							.getMetaModel()
							.getMetaPath(sPath);
				}
				aParts = sPath.split("/").filter(Boolean); //filter out empty strings from array
				//Supporting sPath of any format, either '/<entitySet>/<navigationCollection>' <OR> '/<entitySet>/$Type/<navigationCollection>'
				entitySet = "/" + aParts[0];
				if (aParts.length === 1) {
					return entitySet;
				}
				navigationCollection = typeof navCollection === "undefined" ? aParts[aParts.length - 1] : navCollection;
				return entitySet + "/$NavigationPropertyBinding/" + navigationCollection; // used in gotoTargetEntitySet method in the same file
			},
			isPropertyFilterable: function(property, oInterface) {
				var sEntitySetPath,
					sProperty,
					bIsNotFilterable = false,
					oModel = oInterface.context.getModel(),
					sPropertyPath = oInterface.context.getPath();

				if (oModel.getObject(sPropertyPath + "@com.sap.vocabularies.UI.v1.Hidden")) {
					return false;
				}
				if (oModel.getObject(sPropertyPath + "@com.sap.vocabularies.UI.v1.HiddenFilter")) {
					return false;
				}

				sEntitySetPath = Helper._getEntitySetPath(oModel, sPropertyPath);
				if (typeof property === "string") {
					sProperty = property;
				} else {
					sProperty = oModel.getObject(sPropertyPath + "@sapui.name");
				}
				if (sProperty.indexOf("/") < 0) {
					bIsNotFilterable = Helper._isInNonFilterableProperties(oModel, sEntitySetPath, sProperty);
				} else {
					bIsNotFilterable = Helper._isContextPathFilterable(oModel, sEntitySetPath, sProperty);
				}

				return !bIsNotFilterable;
			},

			_isInNonFilterableProperties: function(oModel, sEntitySetPath, sContextPath) {
				var bIsNotFilterable = false;
				var oAnnotation = oModel.getObject(sEntitySetPath + "@Org.OData.Capabilities.V1.FilterRestrictions");
				if (oAnnotation && oAnnotation.NonFilterableProperties) {
					bIsNotFilterable = oAnnotation.NonFilterableProperties.some(function(property) {
						return property.$NavigationPropertyPath === sContextPath || property.$PropertyPath === sContextPath;
					});
				}
				return bIsNotFilterable;
			},

			_isContextPathFilterable: function(oModel, sEntitySetPath, sContexPath) {
				var aContext = sContexPath.split("/"),
					bIsNotFilterable = false,
					sContext = "";

				aContext.some(function(item, index, array) {
					if (sContext.length > 0) {
						sContext += "/" + item;
					} else {
						sContext = item;
					}
					if (index === array.length - 1) {
						//last path segment
						bIsNotFilterable = Helper._isInNonFilterableProperties(oModel, sEntitySetPath, sContext);
					} else if (oModel.getObject(sEntitySetPath + "/$NavigationPropertyBinding/" + item)) {
						//check existing context path and initialize it
						bIsNotFilterable = Helper._isInNonFilterableProperties(oModel, sEntitySetPath, sContext);
						sContext = "";
						//set the new EntitySet
						sEntitySetPath = "/" + oModel.getObject(sEntitySetPath + "/$NavigationPropertyBinding/" + item);
					}
					return bIsNotFilterable === true;
				});
				return bIsNotFilterable;
			},

			replaceSpecialCharsInId: function(sId) {
				if (sId.indexOf(" ") >= 0) {
					Log.error(
						"Annotation Helper: Spaces are not allowed in ID parts. Please check the annotations, probably something is wrong there."
					);
				}
				return sId
					.replace(/@/g, "")
					.replace(/\//g, "::")
					.replace(/#/g, "::");
			},

			formatDraftLockText: function(IsActiveEntity, HasDraftEntity, LockedBy) {
				if (!IsActiveEntity) {
					return ResourceModel.getText("draft.DRAFT_OBJECT");
				} else if (HasDraftEntity) {
					if (LockedBy) {
						return ResourceModel.getText("draft.LOCKED_OBJECT");
					} else {
						return ResourceModel.getText("draft.UNSAVED_CHANGES");
					}
				} else {
					return ""; // not visible
				}
			},

			_getEntitySetPath: function(oModel, sPropertyPath) {
				var iLength;
				var sEntitySetPath = sPropertyPath.slice(0, sPropertyPath.indexOf("/", 1));
				if (oModel.getObject(sEntitySetPath + "/$kind") === "EntityContainer") {
					iLength = sEntitySetPath.length + 1;
					sEntitySetPath = sPropertyPath.slice(iLength, sPropertyPath.indexOf("/", iLength));
				}
				return sEntitySetPath;
			},

			_resolveValueHelpField: function(oContext) {
				// context is a value list property - we need to jump to its value list model to return context to the field
				var oValueListModel = oContext.getModel();
				var oValueListData = oValueListModel.getObject("/");
				return oValueListData.$model
					.getMetaModel()
					.createBindingContext("/" + oValueListData.CollectionPath + "/" + oContext.getObject());
			},
			/**
				Method to fetch the boolean property value from an annotation.
				@param{object} Annotation
				@returns {boolean} Value of the annotation
			 */
			getBoolAnnotationValue: function(oAnnotation) {
				var bValue = oAnnotation || false;
				bValue = bValue === true || (bValue && bValue["Bool"] !== "false");
				return bValue;
			},
			gotoTargetEntitySet: function(oContext) {
				var sPath = Helper.getTargetCollection.call(Helper, oContext);
				return sPath + "/$";
			},
			gotoActionParameter: function(oContext) {
				var sPath = oContext.getPath(),
					sPropertyName = oContext.getObject(sPath + "/$Name"),
					aContext = sPath.indexOf("@$ui5.overload") > -1 ? sPath.split("@$ui5.overload") : sPath.split("0");
				return aContext[0] + sPropertyName;
			},

			showNavigateErrorMessage: function(oError) {
				sap.m.MessageBox.show(ResourceModel.getText("navigation.ERROR_MESSAGE"), {
					title: ResourceModel.getText("navigation.ERROR_TITLE")
				});
			},

			/**
			 * Returns the entity set name from the entity type name.
			 *
			 * @param {object} oMetaModel - OData v4 metamodel instance
			 * @param {string} sEntity - EntityType of the actiom
			 * @returns {string} - EntitySet of the bound action
			 * @private
			 * @sap-restricted
			 */
			getEntitySetName: function(oMetaModel, sEntityType) {
				var oEntityContainer = oMetaModel.getObject("/");
				for (var key in oEntityContainer) {
					if (typeof oEntityContainer[key] === "object" && oEntityContainer[key].$Type === sEntityType) {
						return key;
					}
				}
			},
			/**
			 * Returns the metamodel path correctly for bound actions if used with bReturnOnlyPath as true,
			 * else returns an object which has 3 properties related to the action. They are the entity set name,
			 * the $Path value of the OperationAvailable annotation and the binding parameter name. If
			 * bCheckStaticValue is true, returns the static value of OperationAvailable annotation, if present.
			 * e.g. for bound action someNameSpace.SomeBoundAction
			 * of entity set SomeEntitySet, the string "/SomeEntitySet/someNameSpace.SomeBoundAction" is returned.
			 *
			 * @param {oAction} oAction - context object of the action
			 * @param {boolean} bReturnOnlyPath - if false, additional info is returned along with metamodel path to the bound action
			 * @param {string} sActionName - name of the bound action of the form someNameSpace.SomeBoundAction
			 * @param {boolean} bCheckStaticValue - if true, the static value of OperationAvailable is returned, if present
			 * @returns {string|object} - string or object as specified by bReturnOnlyPath
			 * @private
			 * @sap-restricted
			 */
			getActionPath: function(oAction, bReturnOnlyPath, sActionName, bCheckStaticValue) {
				sActionName = !sActionName ? oAction.getObject(oAction.getPath()) : sActionName;
				var sEntityName = oAction.getPath().split("/@")[0];
				sEntityName = oAction.getObject(sEntityName).$Type;
				sEntityName = this.getEntitySetName(oAction.getModel(), sEntityName);
				if (bCheckStaticValue) {
					return oAction.getObject("/" + sEntityName + "/" + sActionName + "@Org.OData.Core.V1.OperationAvailable");
				}
				if (bReturnOnlyPath) {
					return "/" + sEntityName + "/" + sActionName;
				} else {
					return {
						sEntityName: sEntityName,
						sProperty: oAction.getObject("/" + sEntityName + "/" + sActionName + "@Org.OData.Core.V1.OperationAvailable/$Path"),
						sBindingParameter: oAction.getObject("/" + sEntityName + "/" + sActionName + "/@$ui5.overload/0/$Parameter/0/$Name")
					};
				}
			},
			/**
			 * Helper to get Edit Mode for a DataField or Rating Indicator
			 * @function
			 * @name getEditMode
			 * @memberof sap.fe.macros.CommonHelper
			 * @param  {Object} oAnnotations Object containing all the Annotations of a Field
			 * @param  {String} sDataFieldType Type of the Field
			 * @param  {Object} oFieldControl Object containing FieldControl Type for a Field
			 * @param  {Object} oDraft Object containing Draft Root or Draft Node for a Draft service and for others will be undefined
			 * @param  {String} sEditMode Edit Mode fetched from the parent of the field
			 * @param  {String} sCreateMode Create Mode fetched from the parent of the field. This is used to check if the object is in create mode or edit mode so as to correcltly render the immutable fields
			 * @param  {String} sParentControl Parent control of the Field
			 * @param  {Bool} bReturnBoolean Indicates what should be the return value for the function. For a DataField it should be String and for Rating Indicator it should be Boolean.
			 *  But in some scenarios it can be Expression Binding which will resolve to Bool value during runtime. The Expression Binding is necessary because it consists of the transaction model which cannot be reolved during the templating time.
			 * @param  {String} sSampleSize Sample size for a Rating Indicator
			 * @returns {String/Boolean} the edit Mode
			 * 	A runtime binding or fixed string value for Field
			 *	true/false for Rating Indicator
			 */
			getEditMode: function(
				oAnnotations,
				sDataFieldType,
				oFieldControl,
				oDraft,
				sEditMode,
				sCreateMode,
				sParentControl,
				bReturnBoolean,
				sSampleSize,
				oUoMFieldControl
			) {
				if (sSampleSize) {
					return false;
				}
				if (sEditMode === "Display" || sEditMode === "ReadOnly" || sEditMode === "Disabled") {
					// the edit mode is hardcoded to a non-editable mode so no need to check any annotations
					return sEditMode;
				}
				var bComputed,
					bImmutable,
					bReadOnly,
					sSemiExpression,
					sExpression,
					sCheckUiEditMode,
					sFieldControlForUoM,
					sEditableReadOnly,
					bCanCreateProperty,
					sIsFieldControlPathReadOnly,
					sIsFieldControlPathDisabled;
				if (
					sDataFieldType === "com.sap.vocabularies.UI.v1.DataFieldWithUrl" ||
					(oAnnotations &&
						oAnnotations["@com.sap.vocabularies.Common.v1.SemanticObject"] &&
						!(
							oAnnotations["@com.sap.vocabularies.Common.v1.ValueListReferences"] ||
							oAnnotations["@com.sap.vocabularies.Common.v1.ValueListMapping"] ||
							oAnnotations["@com.sap.vocabularies.Common.v1.ValueList"] ||
							oAnnotations["@com.sap.vocabularies.Common.v1.ValueListWithFixedValues"]
						))
				) {
					return "Display";
				}
				if (oAnnotations && oAnnotations["@Org.OData.Core.V1.Computed"]) {
					bComputed = oAnnotations["@Org.OData.Core.V1.Computed"].Bool
						? oAnnotations["@Org.OData.Core.V1.Computed"].Bool == "true"
						: true;
				}
				if (oAnnotations && oAnnotations["@Org.OData.Core.V1.Immutable"]) {
					bImmutable = oAnnotations["@Org.OData.Core.V1.Immutable"].Bool
						? oAnnotations["@Org.OData.Core.V1.Immutable"].Bool == "true"
						: true;
				}
				bReadOnly = bComputed || bImmutable;
				sCreateMode = "$" + sCreateMode;
				bCanCreateProperty = typeof bComputed === "undefined" ? typeof bImmutable === "undefined" || bImmutable : !bComputed;
				if (oFieldControl) {
					if (oFieldControl.indexOf("{") === 0) {
						sIsFieldControlPathReadOnly = "$" + oFieldControl + " === '1'";
						sIsFieldControlPathDisabled = "$" + oFieldControl + " === '0'";
					} else {
						bReadOnly = bReadOnly || oFieldControl == "com.sap.vocabularies.Common.v1.FieldControlType/ReadOnly";
					}
				}
				var sEditableExpression;
				var sDisplayOrReadOnly;
				var sDisplayOrDisabled;
				var sFieldControlDisplayOrReadOnly;

				if (sParentControl === "Form") {
					sFieldControlDisplayOrReadOnly =
						sEditMode === "Editable" ? "'ReadOnly'" :
						"$" + sEditMode + " === 'Editable' ? 'ReadOnly'  : 'Display'";
					if (bCanCreateProperty) {
						sDisplayOrReadOnly =
							sEditMode === "Editable"
								? sCreateMode + " ? 'Editable' : 'ReadOnly'"
								: "$" + sEditMode + " === 'Editable' ? " + sCreateMode + "? 'Editable' : 'ReadOnly'  : 'Display'";
						sDisplayOrDisabled =
							sEditMode === "Editable" ? "'Disabled'" : "$" + sEditMode + " === 'Editable' ? 'Disabled' : 'Display'";
					} else {
						sDisplayOrReadOnly =
							sEditMode === "Editable" ? "'ReadOnly'" : "$" + sEditMode + " === 'Editable' ? 'ReadOnly' : 'Display'";
						sDisplayOrDisabled =
							sEditMode === "Editable" ? "'Disabled'" : "$" + sEditMode + " === 'Editable' ? 'Disabled' : 'Display'";
					}
				} else {
					sDisplayOrReadOnly = "'Display'";
					sDisplayOrDisabled = "'Display'";
					sFieldControlDisplayOrReadOnly = "'Display'";
				}
				sCheckUiEditMode = sEditMode && sEditMode.indexOf("{") === 0 ? "$" + sEditMode : "'" + sEditMode + "'";
				if (bReadOnly) {
					if (!bCanCreateProperty || !oDraft) {
						if (sEditMode && sEditMode.indexOf("{") === 0 && sParentControl === "Form") {
							return bReturnBoolean ? false : "{= " + sDisplayOrReadOnly + "}";
						}
						sDisplayOrReadOnly = sDisplayOrReadOnly.split("'") && sDisplayOrReadOnly.split("'")[1];
						return bReturnBoolean ? false : sDisplayOrReadOnly;
					} else {
						if (sIsFieldControlPathReadOnly) {
							return (
								"{= !%{IsActiveEntity} && !%{HasActiveEntity} ? (" +
								sIsFieldControlPathDisabled +
								"? " +
								(bReturnBoolean ? "false" : "Disabled") +
								" : " +
								sIsFieldControlPathReadOnly +
								"? " +
								(bReturnBoolean ? "false" : "ReadOnly") +
								" : " +
								(bReturnBoolean ? "${ui>/editable} === 'Editable'" : sCheckUiEditMode) +
								") : " +
								(bReturnBoolean ? "false" : sDisplayOrReadOnly) +
								"}"
							);
						} else if (oFieldControl == "com.sap.vocabularies.Common.v1.FieldControlType/ReadOnly") {
							sCheckUiEditMode = "'ReadOnly'";
						}
						return (
							"{= !%{IsActiveEntity} && !%{HasActiveEntity} ?" +
							(bReturnBoolean ? "${ui>/editable} === 'Editable'" : sCheckUiEditMode) +
							" : " +
							(bReturnBoolean ? "false" : sDisplayOrReadOnly) +
							"}"
						);
					}
				}
				if (sIsFieldControlPathReadOnly) {
					if (oUoMFieldControl) {
						sCheckUiEditMode = "$" + oUoMFieldControl + " === '1' ? 'EditableReadOnly' : " + sCheckUiEditMode;
					}
					sSemiExpression =
						sIsFieldControlPathDisabled +
						" ? " +
						(bReturnBoolean ? "false" : sDisplayOrDisabled) +
						" :" +
						sIsFieldControlPathReadOnly +
						" ? " +
						(bReturnBoolean ? "false" : sFieldControlDisplayOrReadOnly) +
						" :" +
						(bReturnBoolean ? "${ui>/editable} === 'Editable'" : sCheckUiEditMode);
					sEditableExpression = "{= " + sSemiExpression + "}";
				} else if (oUoMFieldControl) {
					sFieldControlForUoM = "$" + oUoMFieldControl + " === '1'";
					sEditableReadOnly =
						sEditMode === "Editable"
							? "'EditableReadOnly'"
							: "$" + sEditMode + " === 'Editable' ? 'EditableReadOnly' : 'Display'";
					sSemiExpression = sFieldControlForUoM + " ? " + sEditableReadOnly + " :" + sCheckUiEditMode;
					sEditableExpression = "{= " + sSemiExpression + "}";
				} else {
					sSemiExpression = sCheckUiEditMode;
					sEditableExpression = bReturnBoolean ? "{= ${ui>/editable} === 'Editable'}" : sEditMode;
				}

				sExpression =
					bCanCreateProperty || !oDraft
						? sEditableExpression
						: "{= !%{IsActiveEntity} && !%{HasActiveEntity} ? " +
						  (bReturnBoolean ? "false" : sDisplayOrReadOnly) +
						  " : " +
						  sSemiExpression +
						  "}";
				return sExpression;
			},
			getNavigationContext: function(oContext) {
				return ODataModelAnnotationHelper.getNavigationPath(oContext.getPath());
			},
			/**
			 * Method to get the Hidden Value Expression property from a DataField or a DataFieldforAnnotation
			 * 1. If UI.Hidden has '$Path', then we take the value at '$Path' directly for same entity set.
			 * 2. Else, value at navigationEntity then check if it is 1:1 assosciation for the entityset and allow to take the correspoind '$Path'
			 * @param {Object} oDataField - context from which DataField needs to be extracted.
			 * @param {Object} oDetails - context from which EntitySet needs to be extracted.
			 * @return {String/Boolean} - if Hidden is a path string is been returned if the association is not collection then it returns true by default
			 */
			getHiddenPathExpression: function(oDataField, oDetails) {
				var oContext = oDetails.context,
					sHiddenExpression,
					sPropertyPath = oContext.getPath(),
					sEntitySetPath = ODataModelAnnotationHelper.getNavigationPath(sPropertyPath),
					sHiddenPath,
					sPropertyHiddenPath;
				// get sHiddenPath at DataField Level
				if (oContext.getObject(sPropertyPath + "@com.sap.vocabularies.UI.v1.Hidden")) {
					sHiddenPath = oContext.getObject(sPropertyPath + "@com.sap.vocabularies.UI.v1.Hidden");
				} else {
					// get sHiddenPath at referenced Property Level
					if (sPropertyPath.lastIndexOf("/") === sPropertyPath.length - 1) {
						sPropertyHiddenPath = "Value/$Path@com.sap.vocabularies.UI.v1.Hidden";
					} else {
						sPropertyHiddenPath = "/Value/$Path@com.sap.vocabularies.UI.v1.Hidden";
					}
					sHiddenPath = oContext.getObject(sPropertyPath + sPropertyHiddenPath);
				}
				if (sHiddenPath) {
					if (sHiddenPath.$Path) {
						if (sHiddenPath.$Path.indexOf("/") > 0) {
							var sNavigationPath = sHiddenPath.$Path.split("/")[0];
							if (
								oContext.getObject(sEntitySetPath + "/" + sNavigationPath) &&
								!oContext.getObject(sEntitySetPath + "/" + sNavigationPath).$isCollection
							) {
								sHiddenExpression = "%{" + sHiddenPath.$Path + "}";
							} else {
								return true;
							}
						} else {
							sHiddenExpression = "%{" + sHiddenPath.$Path + "}";
						}
						return "{= " + sHiddenExpression + "=== true ? false : true }";
					} else {
						return "{= " + sHiddenPath + "=== true ? false : true }";
					}
				}
				return true;
			},
			operators: function(sProperty, oInterface) {
				// Complete possible set of Operators for AllowedExpression Types
				var aEqualsOps = ["EQ"];
				var aSingleRangeOps = ["EQ", "BT", "BTEX", "LT", "NOTLT", "GT", "NOTGT", "LE", "NOTLE", "GE", "NOTGE"];
				var aMultiRangeOps = [
					"EQ",
					"BT",
					"BTEX",
					"NOTBT",
					"NOTBTEX",
					"LT",
					"NOTLT",
					"GT",
					"NOTGT",
					"LE",
					"NOTLE",
					"GE",
					"NOTGE",
					"NE"
				];
				var aSeachExpressionOps = ["StartsWith", "NotStartsWith", "EndsWith", "NotEndsWith", "Contains", "NotContains"];

				var oContext = oInterface.context,
					oModel = oContext.getModel(),
					sPropertyPath = oContext.getPath(),
					sEntitySetPath = Helper._getEntitySetPath(oModel, sPropertyPath),
					oFilterRestrictions = oModel.getObject(sEntitySetPath + "@Org.OData.Capabilities.V1.FilterRestrictions");

				// Is there a Filter Restriction defined for this property?
				if (
					oFilterRestrictions &&
					oFilterRestrictions.FilterExpressionRestrictions &&
					oFilterRestrictions.FilterExpressionRestrictions.some(function(oRestriction) {
						return oRestriction.Property.$PropertyPath === sProperty;
					})
				) {
					var oRealProperty = oModel.getObject(sPropertyPath + "/$Type");
					// Get the default Operators for this Property Type
					var aDefaultOperators = Helper._getDefaultOperators(oRealProperty);

					var aRestriction = oFilterRestrictions.FilterExpressionRestrictions.filter(function(oRestriction) {
						return oRestriction.Property.$PropertyPath === sProperty;
					});

					// In case more than one Allowed Expressions has been defined for a property
					// choose the most restrictive Allowed Expression

					// MultiValue has same Operator as SingleValue, but there can be more than one (maxConditions)
					if (
						aRestriction.some(function(oRestriction) {
							return oRestriction.AllowedExpressions === "SingleValue" || oRestriction.AllowedExpressions === "MultiValue";
						})
					) {
						return Helper._getRestrictions(aDefaultOperators, aEqualsOps);
					}

					if (
						aRestriction.some(function(oRestriction) {
							return oRestriction.AllowedExpressions === "SingleRange";
						})
					) {
						return Helper._getRestrictions(aDefaultOperators, aSingleRangeOps);
					}

					if (
						aRestriction.some(function(oRestriction) {
							return oRestriction.AllowedExpressions === "MultiRange";
						})
					) {
						return Helper._getRestrictions(aDefaultOperators, aMultiRangeOps);
					}

					if (
						aRestriction.some(function(oRestriction) {
							return oRestriction.AllowedExpressions === "SearchExpression";
						})
					) {
						return Helper._getRestrictions(aDefaultOperators, aSeachExpressionOps);
					}

					if (
						aRestriction.some(function(oRestriction) {
							return oRestriction.AllowedExpressions === "MultiRangeOrSearchExpression";
						})
					) {
						return Helper._getRestrictions(aDefaultOperators, aSeachExpressionOps.concat(aMultiRangeOps));
					}
					// In case AllowedExpressions is not recognised, undefined in return results in the default set of
					// operators for the type.
					return undefined;
				}
			},
			_getDefaultOperators: function(oRealProperty) {
				// mdc defines the full set of operations that are meaningful for each Edm Type
				var oDataClass = FieldBaseDelegate.getDataTypeClass(null, oRealProperty);
				var oBaseType = FieldBaseDelegate.getBaseType(null, oDataClass);
				return FilterOperatorUtil.getOperatorsForType(oBaseType);
			},
			_getRestrictions: function(aDefaultOps, aExpressionOps) {
				// From the default set of Operators for the Base Type, select those that are defined in the Allowed Value.
				// In case that no operators are found, return undefined so that the default set is used.
				var aOperators = aDefaultOps.filter(function(sElement) {
					return aExpressionOps.indexOf(sElement) > -1;
				});
				return aOperators.toString() || undefined;
			}
		};

		Helper.isPropertyFilterable.requiresIContext = true;

		return Helper;
	},
	/* bExport= */ true
);
