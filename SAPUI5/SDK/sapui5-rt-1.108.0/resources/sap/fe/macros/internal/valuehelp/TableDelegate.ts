import { NavigationProperty, Property } from "@sap-ux/vocabularies-types";
import { DataField } from "@sap-ux/vocabularies-types/vocabularies/UI";
import Log from "sap/base/Log";
import deepEqual from "sap/base/util/deepEqual";
import CommonUtils from "sap/fe/core/CommonUtils";
import { fetchTypeConfig } from "sap/fe/core/converters/controls/ListReport/FilterBar";
import { getInvolvedDataModelObjects } from "sap/fe/core/converters/MetaModelConverter";
import ModelHelper from "sap/fe/core/helpers/ModelHelper";
import { getDisplayMode } from "sap/fe/core/templating/DisplayModeFormatter";
import {
	getAssociatedCurrencyProperty,
	getAssociatedCurrencyPropertyPath,
	getAssociatedTextProperty,
	getAssociatedTextPropertyPath,
	getAssociatedTimezoneProperty,
	getAssociatedTimezonePropertyPath,
	getAssociatedUnitProperty,
	getAssociatedUnitPropertyPath,
	getLabel
} from "sap/fe/core/templating/PropertyHelper";
import TypeUtil from "sap/fe/core/type/TypeUtil";
import MacrosDelegateUtil from "sap/fe/macros/DelegateUtil";
import ODataMetaModelUtil from "sap/fe/macros/ODataMetaModelUtil";
import type Event from "sap/ui/base/Event";
import Core from "sap/ui/core/Core";
import TableDelegate from "sap/ui/mdc/odata/v4/TableDelegate";
import DelegateUtil from "sap/ui/mdc/odata/v4/util/DelegateUtil";
import type Table from "sap/ui/mdc/Table";
import FilterUtil from "sap/ui/mdc/util/FilterUtil";
import MDCTable from "sap/ui/mdc/valuehelp/content/MDCTable";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import Sorter from "sap/ui/model/Sorter";

export type ValueHelpTableColumn = {
	name: string;
	propertyInfos?: string[];
	sortable?: boolean;
	path?: string;
	label?: string;
	filterable?: boolean;
	typeConfig?: Object;
	maxConditions?: number;
};
export type ComplexPropertyInfo = {
	properties: Record<string, ValueHelpTableColumn>;
};

/**
 * Test delegate for OData V4.
 */
const ODataTableDelegate = Object.assign({}, TableDelegate);

ODataTableDelegate.fetchProperties = function (oTable: Table) {
	const oModel = this._getModel(oTable);
	let pCreatePropertyInfos;

	if (!oModel) {
		pCreatePropertyInfos = new Promise((resolve) => {
			oTable.attachModelContextChange(
				{
					resolver: resolve
				},
				onModelContextChange as any,
				this
			);
		}).then((oSubModel) => {
			return this._createPropertyInfos(oTable, oSubModel);
		});
	} else {
		pCreatePropertyInfos = this._createPropertyInfos(oTable, oModel);
	}

	return pCreatePropertyInfos.then(function (aProperties: any) {
		if (oTable.data) {
			oTable.data("$tablePropertyInfo", aProperties);
		}
		return aProperties;
	});
};

function onModelContextChange(this: typeof ODataTableDelegate, oEvent: Event, oData: any) {
	const oTable = oEvent.getSource() as Table;
	const oModel = this._getModel(oTable);

	if (oModel) {
		oTable.detachModelContextChange(onModelContextChange as any);
		oData.resolver(oModel);
	}
}
/**
 * Collect related properties from a property's annotations.
 *
 * @param oProperty The property to be considered
 * @param oAdditionalProperty The additional property could refer to the text, currency, unit or timezone.
 * @param oColumn The column already available on the ValueHelpTable.
 * It contains only basic property attributes needed for the ValueHelp.
 * @returns The related properties that were identified.
 */
function _collectRelatedProperties(oProperty: Property, oAdditionalProperty: Property | undefined, oColumn: ValueHelpTableColumn) {
	const relatedProperties: ComplexPropertyInfo = { properties: {} },
		textAnnotation = oProperty.annotations?.Common?.Text,
		textArrangement = textAnnotation?.annotations?.UI?.TextArrangement?.toString(),
		displayMode = textAnnotation && textArrangement && getDisplayMode(oProperty);
	if (oAdditionalProperty) {
		if (displayMode === "Description") {
			relatedProperties.properties[oAdditionalProperty.name] = oAdditionalProperty;
		} else if ((displayMode && displayMode !== "Value") || !textAnnotation) {
			relatedProperties.properties[oProperty.name] = oColumn;
			relatedProperties.properties[oAdditionalProperty.name] = oAdditionalProperty;
		}
	}
	return relatedProperties;
}

ODataTableDelegate._createPropertyInfos = function (oTable: any, oModel: any) {
	const oMetadataInfo = oTable.getDelegate().payload;
	const aProperties: ValueHelpTableColumn[] = [];
	const sEntitySetPath = `/${oMetadataInfo.collectionName}`;
	const oMetaModel = oModel.getMetaModel();

	return oMetaModel.requestObject(`${sEntitySetPath}@`).then(function (mEntitySetAnnotations: any) {
		const oSortRestrictions = mEntitySetAnnotations["@Org.OData.Capabilities.V1.SortRestrictions"];
		const oSortRestrictionsInfo = ODataMetaModelUtil.getSortRestrictionsInfo(oSortRestrictions);
		const oFilterRestrictions = mEntitySetAnnotations["@Org.OData.Capabilities.V1.FilterRestrictions"];
		const oFilterRestrictionsInfo = ODataMetaModelUtil.getFilterRestrictionsInfo(oFilterRestrictions);

		const customDataForColumns = MacrosDelegateUtil.getCustomData(oTable, "columns");
		const propertiesToBeCreated: Record<string, ValueHelpTableColumn> = {};
		const targetEntityType = getInvolvedDataModelObjects(oTable.getModel().getMetaModel().getContext(sEntitySetPath)).targetEntityType;
		customDataForColumns.customData.forEach(function (columnDef: any) {
			const oPropertyInfo: ValueHelpTableColumn = {
				name: columnDef.path,
				label: columnDef.label,
				sortable: _isSortableProperty(oSortRestrictionsInfo, columnDef),
				filterable: _isFilterableProperty(oFilterRestrictionsInfo, columnDef),
				maxConditions: _getPropertyMaxConditions(oFilterRestrictionsInfo, columnDef),
				typeConfig: MacrosDelegateUtil.isTypeFilterable(columnDef.$Type)
					? oTable.getTypeUtil().getTypeConfig(columnDef.$Type)
					: undefined
			};
			let oProperty = targetEntityType.entityProperties.find((prop) => prop.name === columnDef.path);
			// Check if it's a navigation property and get the corresponding property from the navigationProperty
			if (!oProperty) {
				oProperty = _getNavigationProperty(targetEntityType.navigationProperties, columnDef);
			}
			if (oProperty) {
				const propertyTypeConfig = fetchTypeConfig(oProperty);
				const oTypeConfig =
					TypeUtil.getTypeConfig(propertyTypeConfig.type, propertyTypeConfig.formatOptions, propertyTypeConfig.constraints) ||
					oTable.getTypeUtil().getTypeConfig(columnDef.$Type);
				//Check if there is an additional property linked to the property as a Unit, Currency, Timezone or textArrangement
				const additionalProperty = _getAdditionalProperty(oProperty);
				const relatedPropertiesInfo: ComplexPropertyInfo = _collectRelatedProperties(oProperty, additionalProperty, columnDef);
				const relatedPropertyNames: string[] = Object.keys(relatedPropertiesInfo.properties);

				if (relatedPropertyNames.length > 0) {
					oPropertyInfo.propertyInfos = relatedPropertyNames;
					//Complex properties must be hidden for sorting and filtering
					oPropertyInfo.sortable = false;
					oPropertyInfo.filterable = false;
					// Collect information of related columns to be created.
					relatedPropertyNames.forEach((name) => {
						propertiesToBeCreated[name] = relatedPropertiesInfo.properties[name];
					});
					// Also add property for the inOut Parameters on the ValueHelp when textArrangement is set to #TextOnly
					// It will not be linked to the complex Property (BCP 2270141154)
					if (
						relatedPropertyNames.some((name: string) => {
							return name !== oProperty?.name;
						})
					) {
						propertiesToBeCreated[oProperty.name] = oProperty;
					}
				} else {
					oPropertyInfo.path = columnDef.path;
				}
				oPropertyInfo.typeConfig = oPropertyInfo.typeConfig ? oTypeConfig : undefined;
			} else {
				oPropertyInfo.path = columnDef.path;
			}
			aProperties.push(oPropertyInfo);
		});
		const relatedColumns = _createRelatedProperties(propertiesToBeCreated, aProperties, oSortRestrictionsInfo, oFilterRestrictionsInfo);

		return aProperties.concat(relatedColumns);
	});
};

/**
 * Updates the binding info with the relevant path and model from the metadata.
 *
 * @param oMDCTable The MDCTable instance
 * @param oBindingInfo The bindingInfo of the table
 */
ODataTableDelegate.updateBindingInfo = function (oMDCTable: any, oBindingInfo: any) {
	TableDelegate.updateBindingInfo.apply(this, [oMDCTable, oBindingInfo]);
	if (!oMDCTable) {
		return;
	}

	const oMetadataInfo = oMDCTable.getDelegate().payload;

	if (oMetadataInfo && oBindingInfo) {
		oBindingInfo.path = oBindingInfo.path || oMetadataInfo.collectionPath || `/${oMetadataInfo.collectionName}`;
		oBindingInfo.model = oBindingInfo.model || oMetadataInfo.model;
	}

	if (!oBindingInfo) {
		oBindingInfo = {};
	}

	const oFilter = Core.byId(oMDCTable.getFilter()) as any,
		bFilterEnabled = oMDCTable.isFilteringEnabled();
	let mConditions: any;
	let oInnerFilterInfo, oOuterFilterInfo: any;
	const aFilters = [];
	const aTableProperties = oMDCTable.data("$tablePropertyInfo");

	//TODO: consider a mechanism ('FilterMergeUtil' or enhance 'FilterUtil') to allow the connection between different filters)
	if (bFilterEnabled) {
		mConditions = oMDCTable.getConditions();
		oInnerFilterInfo = FilterUtil.getFilterInfo(oMDCTable, mConditions, aTableProperties, []) as any;
		if (oInnerFilterInfo.filters) {
			aFilters.push(oInnerFilterInfo.filters);
		}
	}

	if (oFilter) {
		mConditions = oFilter.getConditions();
		if (mConditions) {
			const aParameterNames = DelegateUtil.getParameterNames(oFilter);
			// The table properties needs to updated with the filter field if no Selectionfierlds are annotated and not part as value help parameter
			ODataTableDelegate._updatePropertyInfo(aTableProperties, oMDCTable, mConditions, oMetadataInfo);
			oOuterFilterInfo = FilterUtil.getFilterInfo(oFilter, mConditions, aTableProperties, aParameterNames);

			if (oOuterFilterInfo.filters) {
				aFilters.push(oOuterFilterInfo.filters);
			}

			const sParameterPath = DelegateUtil.getParametersInfo(oFilter, mConditions);
			if (sParameterPath) {
				oBindingInfo.path = sParameterPath;
			}
		}

		// get the basic search
		oBindingInfo.parameters.$search = CommonUtils.normalizeSearchTerm(oFilter.getSearch()) || undefined;
	}

	this._applyDefaultSorting(oBindingInfo, oMDCTable.getDelegate().payload);
	// add select to oBindingInfo (BCP 2170163012)
	oBindingInfo.parameters.$select = aTableProperties.reduce(function (sQuery: string, oProperty: any) {
		// Navigation properties (represented by X/Y) should not be added to $select.
		// ToDo : They should be added as $expand=X($select=Y) instead
		if (oProperty.path && oProperty.path.indexOf("/") === -1) {
			sQuery = sQuery ? `${sQuery},${oProperty.path}` : oProperty.path;
		}
		return sQuery;
	}, "");

	// Add $count
	oBindingInfo.parameters.$count = true;

	//If the entity is DraftEnabled add a DraftFilter
	if (ModelHelper.isDraftSupported(oMDCTable.getModel().getMetaModel(), oBindingInfo.path)) {
		aFilters.push(new Filter("IsActiveEntity", FilterOperator.EQ, true));
	}

	oBindingInfo.filters = new Filter(aFilters, true);
};

ODataTableDelegate.getTypeUtil = function (/*oPayload*/) {
	return TypeUtil;
};

ODataTableDelegate._getModel = function (oTable: Table) {
	const oMetadataInfo = (oTable.getDelegate() as any).payload;
	return oTable.getModel(oMetadataInfo.model);
};

/**
 * Applies a default sort order if needed. This is only the case if the request is not a $search request
 * (means the parameter $search of the bindingInfo is undefined) and if not already a sort order is set,
 * e.g. via presentation variant or manual by the user.
 *
 * @param oBindingInfo The bindingInfo of the table
 * @param oPayload The payload of the TableDelegate
 */
ODataTableDelegate._applyDefaultSorting = function (oBindingInfo: any, oPayload: any) {
	if (oBindingInfo.parameters && oBindingInfo.parameters.$search == undefined && oBindingInfo.sorter && oBindingInfo.sorter.length == 0) {
		const defaultSortPropertyName = oPayload ? oPayload.defaultSortPropertyName : undefined;
		if (defaultSortPropertyName) {
			oBindingInfo.sorter.push(new Sorter(defaultSortPropertyName, false));
		}
	}
};

/**
 * Updates the table properties with filter field infos.
 *
 * @param aTableProperties Array with table properties
 * @param oMDCTable The MDCTable instance
 * @param mConditions The conditions of the table
 * @param oMetadataInfo The metadata info of the filter field
 */
ODataTableDelegate._updatePropertyInfo = function (
	aTableProperties: any[],
	oMDCTable: MDCTable,
	mConditions: Record<string, any>,
	oMetadataInfo: any
) {
	const aConditionKey = Object.keys(mConditions),
		oMetaModel = oMDCTable.getModel().getMetaModel();
	aConditionKey.forEach(function (conditionKey: any) {
		if (
			aTableProperties.findIndex(function (tableProperty: any) {
				return tableProperty.path === conditionKey;
			}) === -1
		) {
			const oColumnDef = {
				path: conditionKey,
				typeConfig: oMDCTable
					.getTypeUtil()
					.getTypeConfig(oMetaModel.getObject(`/${oMetadataInfo.collectionName}/${conditionKey}`).$Type)
			};
			aTableProperties.push(oColumnDef);
		}
	});
};

ODataTableDelegate.updateBinding = function (oTable: any, oBindingInfo: any, oBinding: any) {
	let bNeedManualRefresh = false;
	const oInternalBindingContext = oTable.getBindingContext("internal");
	const sManualUpdatePropertyKey = "pendingManualBindingUpdate";
	const bPendingManualUpdate = oInternalBindingContext?.getProperty(sManualUpdatePropertyKey);
	let oRowBinding = oTable.getRowBinding();
	if (oRowBinding) {
		/**
		 * Manual refresh if filters are not changed by binding.refresh() since updating the bindingInfo
		 * is not enough to trigger a batch request.
		 * Removing columns creates one batch request that was not executed before
		 */
		const oldFilters = oRowBinding.getFilters("Application");
		bNeedManualRefresh =
			deepEqual(oBindingInfo.filters, oldFilters[0]) &&
			oRowBinding.getQueryOptionsFromParameters().$search === oBindingInfo.parameters.$search &&
			!bPendingManualUpdate;
	}
	TableDelegate.updateBinding.apply(ODataTableDelegate, [oTable, oBindingInfo, oBinding]);
	if (!oRowBinding) {
		oRowBinding = oTable.getRowBinding();
	} //get row binding after rebind from TableDelegate.updateBinding in case oBinding was undefined
	if (bNeedManualRefresh && oTable.getFilter() && oBinding) {
		oInternalBindingContext?.setProperty(sManualUpdatePropertyKey, true);
		oRowBinding
			.requestRefresh(oRowBinding.getGroupId())
			.finally(function () {
				oInternalBindingContext?.setProperty(sManualUpdatePropertyKey, false);
			})
			.catch(function (oError: any) {
				Log.error("Error while refreshing a filterBar VH table", oError);
			});
	}
	oTable.fireEvent("bindingUpdated");
	//no need to check for semantic targets here since we are in a VH and don't want to allow further navigation
};

/**
 * Creates a simple property for each identified complex property.
 *
 * @param propertiesToBeCreated Identified properties.
 * @param existingColumns The list of columns created for properties defined on the Value List.
 * @param oSortRestrictionsInfo An object containing the sort restriction information
 * @param oFilterRestrictionsInfo An object containing the filter restriction information
 * @returns The array of properties created.
 */
function _createRelatedProperties(
	propertiesToBeCreated: Record<string, ValueHelpTableColumn>,
	existingColumns: ValueHelpTableColumn[],
	oSortRestrictionsInfo: any,
	oFilterRestrictionsInfo: any
) {
	const relatedPropertyNameMap: Record<string, string> = {},
		relatedColumns: ValueHelpTableColumn[] = [];
	Object.keys(propertiesToBeCreated).forEach((name) => {
		const property = propertiesToBeCreated[name],
			relatedColumn = existingColumns.find((column) => column.name === name);
		if (!relatedColumn || relatedColumn?.propertyInfos) {
			const newName = `Property::${name}`;
			relatedPropertyNameMap[name] = newName;
			if (!property.path || property.path.indexOf("/") > 1) {
				// In this case the related property does not exist because it wasn't created on last iteration or we have a navigation property,
				// then we need to retrieve the corresponding propertyInfo
				const propertyValue = ((property as Property).annotations?.UI?.DataFieldDefault as DataField)?.Value;
				property.path = property.path || propertyValue.path;
				property.label = getLabel(property as Property);
				if (MacrosDelegateUtil.isTypeFilterable(propertyValue?.$target.type)) {
					const propertyTypeConfig = fetchTypeConfig(property as Property);
					property.typeConfig = TypeUtil.getTypeConfig(
						propertyTypeConfig.type,
						propertyTypeConfig.formatOptions,
						propertyTypeConfig.constraints
					);
				}
			}
			if (property.path) {
				relatedColumns.push({
					name: newName,
					label: property.label,
					path: property.path,
					sortable: _isSortableProperty(oSortRestrictionsInfo, property),
					filterable: _isFilterableProperty(oFilterRestrictionsInfo, property),
					typeConfig: relatedColumn?.typeConfig || property.typeConfig,
					maxConditions: _getPropertyMaxConditions(oFilterRestrictionsInfo, property)
				});
			}
		}
	});
	// The property 'name' has been prefixed with 'Property::' for uniqueness.
	// Update the same in other propertyInfos[] references which point to this property.
	existingColumns.forEach((column) => {
		if (column.propertyInfos) {
			column.propertyInfos = column.propertyInfos?.map((propertyInfo) => relatedPropertyNameMap[propertyInfo] ?? propertyInfo);
		}
	});
	return relatedColumns;
}
/**
 * Identifies if the given property is sortable based on the sort restriction information.
 *
 * @param oSortRestrictionsInfo The sort restriction information from the restriction annotation.
 * @param property The target property.
 * @returns `true` if the given property is sortable.
 */
function _isSortableProperty(oSortRestrictionsInfo: any, property: ValueHelpTableColumn): boolean | undefined {
	return property.path && oSortRestrictionsInfo[property.path] ? oSortRestrictionsInfo[property.path].sortable : property.sortable;
}

/**
 * Identifies if the given property is filterable based on the sort restriction information.
 *
 * @param oFilterRestrictionsInfo The filter restriction information from the restriction annotation.
 * @param property The target property.
 * @returns `true` if the given property is filterable.
 */
function _isFilterableProperty(oFilterRestrictionsInfo: any, property: ValueHelpTableColumn): boolean | undefined {
	return property.path && oFilterRestrictionsInfo[property.path]
		? oFilterRestrictionsInfo[property.path].filterable
		: property.filterable;
}

/**
 * Identifies the maxConditions for a given property.
 *
 * @param oFilterRestrictionsInfo The filter restriction information from the restriction annotation.
 * @param property The target property.
 * @returns `-1` or `1` if the property is a MultiValueFilterExpression.
 */
function _getPropertyMaxConditions(oFilterRestrictionsInfo: any, property: ValueHelpTableColumn): number {
	return property.path && ODataMetaModelUtil.isMultiValueFilterExpression(oFilterRestrictionsInfo.propertyInfo[property.path]) ? -1 : 1;
}

/**
 * Idenfifies if there is a navigation property and provides the corresponding entity property.
 *
 * @param navigationProperties The navigation Properties for the target entity type.
 * @param columnDef The target column.
 * @returns The navigation Property if it exists.
 */
function _getNavigationProperty(navigationProperties: NavigationProperty[], columnDef: ValueHelpTableColumn): Property | undefined {
	return navigationProperties.length > 0
		? navigationProperties.map((navProp) =>
				navProp.targetType.entityProperties.find((prop) => columnDef.path && columnDef.path.indexOf(prop.name) > -1)
		  )?.[0]
		: undefined;
}

/**
 * Identifies the additional property which references to the unit, timezone, textArrangement or currency.
 *
 * @param oProperty The target property.
 * @returns The additional property.
 */
function _getAdditionalProperty(oProperty: Property) {
	//Additional Property could refer to a navigation property, keep the name and path as navigation property
	const additionalPropertyPath =
		getAssociatedTextPropertyPath(oProperty) ||
		getAssociatedCurrencyPropertyPath(oProperty) ||
		getAssociatedUnitPropertyPath(oProperty) ||
		getAssociatedTimezonePropertyPath(oProperty);
	const associatedProperty =
		getAssociatedTextProperty(oProperty) ||
		getAssociatedCurrencyProperty(oProperty) ||
		getAssociatedUnitProperty(oProperty) ||
		getAssociatedTimezoneProperty(oProperty);
	if (associatedProperty && additionalPropertyPath && additionalPropertyPath?.indexOf("/") > -1) {
		associatedProperty.name = additionalPropertyPath;
		(associatedProperty as ValueHelpTableColumn).path = additionalPropertyPath;
	}
	return associatedProperty;
}

export default ODataTableDelegate;
