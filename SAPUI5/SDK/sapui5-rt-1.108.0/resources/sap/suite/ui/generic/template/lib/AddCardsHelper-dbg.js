sap.ui.define(["sap/base/util/ObjectPath", "sap/ui/integration/widgets/Card",
	"sap/m/p13n/Popup",
	"sap/m/p13n/SelectionPanel"
], function (ObjectPath, Card, Popup, SelectionPanel) {
	"use strict";

	var AddCardsHelper = {};

	AddCardsHelper.showColumnsForCardGeneration = function (oCardDefinition, oButton) {
		return new Promise(function (fnResolve, fnReject) {
			var oEntityType = oCardDefinition['entityType'];
			var oMetaModel = oCardDefinition['currentControlHandler'].getModel().getMetaModel();
			var aColumns = [];
			oCardDefinition['currentControlHandler'].getVisibleProperties().filter(function (oColumn) {
				var sColumnKey = oColumn.data("p13nData") && oColumn.data("p13nData").columnKey;
				var oProperty = oMetaModel.getODataProperty(oEntityType, oColumn.data("p13nData").leadingProperty);
				if (oProperty &&  oProperty["sap:label"]) {
					if (oColumn.getVisible() && ((sColumnKey.indexOf("DataFieldForAnnotation") < 0) && !oColumn.data("p13nData").actionButton && !!oColumn.data("p13nData").leadingProperty)) {
						var oColumnObject = {
							visible: false,
							name: oProperty.name,
							label: oProperty["sap:label"]
						};
						aColumns.push(oColumnObject);
					}
				}
			});
			fnCreateP13nDialogBeforeCardGeneration(aColumns, oButton, oCardDefinition, fnResolve);
		});
	};

	AddCardsHelper.createAnalyticalCardForPreview = function (oCardDefinition) {
		return createIntegrationCardForPreview(oCardDefinition);
	};

	var createIntegrationCardForPreview = function (oCardDefinition, aSelectedColumns) {
		var oCard = new Card({ height: "533px", width: "314px" });
		var oCardManifest = createCardManifest(oCardDefinition, aSelectedColumns);
		oCard.setManifest(oCardManifest);
		return oCard;
	};

	var createCardManifest = function (oCardDefinition, aSelectedColumns) {
		var oComponent = oCardDefinition['component'];
		var oMetadata = oComponent.getAppComponent().getMetadata();
		var oUIManifest = oMetadata.getManifestEntry("sap.ui");
		var oAppManifest = oMetadata.getManifestEntry("sap.app");
		var oManifest = {};
		var sSapAppId = "user." + oAppManifest.id + "." + Date.now();
		oAppManifest.type = "card";
		oAppManifest.id = sSapAppId;
		oManifest["sap.app"] = oAppManifest;
		oManifest["sap.ui"] = oUIManifest;
		oManifest["sap.card"] = fnCreateManifestSapCard(oCardDefinition, aSelectedColumns);
		oManifest["sap.insights"] = fnCreateManifestSapInsight(oCardDefinition);
		return oManifest;
	};

	var fnCreateManifestSapCard = function (oCardDefinition, aSelectedColumns) {
		var oCardConfig = {};
		var sComponentName = oCardDefinition['component'].getMetadata().getName();
		oCardConfig["type"] = getCardType(sComponentName);
		oCardConfig["configuration"] = fnCreateManifestSapCardConfig(oCardDefinition);
		oCardConfig["header"] = fnCreateManifestSapCardHeader(oCardDefinition, oCardConfig);
		oCardConfig["data"] = fnCreateManifestSapCardData(oCardDefinition, oCardConfig);
		if (oCardConfig.type === "Analytical") {
			oCardConfig["content"] = fnCreateManifestSapAnalyticalCardContent(oCardDefinition, oCardConfig);
		} else {
			oCardConfig["content"] = fnCreateManifestSapCardContent(oCardDefinition, oCardConfig, aSelectedColumns);
		}
		return oCardConfig;
	};

	/**
		 * Create Manifest for Sap.insight component with the given card defination
		 *
		 * @param {Object} oCardDefinition
		 * @returns {Object}
		 */
	var fnCreateManifestSapInsight = function (oCardDefinition) {
		var oComponent = oCardDefinition['component'],
			oMetadata = oComponent.getAppComponent().getMetadata(),
			oAppManifest = oMetadata.getManifestEntry("sap.app"),
			sAppId = oAppManifest.id,
			bRTMode = "RT";

		return {
			parentAppId: sAppId,
			cardType: bRTMode,
			"versions": {
				"ui5": sap.ui.version + "-" + sap.ui.getVersionInfo().buildTimestamp
			}
		};
	};

	var getCardType = function (sComponentName) {
		switch (sComponentName) {
			case "sap.suite.ui.generic.template.ListReport.Component":
				return "Table";
			case "sap.suite.ui.generic.template.AnalyticalListPage.Component":
				return "Analytical";
			default:
				return "List";
		}
	};

	var fnCreateManifestSapCardConfig = function (oCardDefinition) {
		var oCardConfiguration = {};
		var oComponent = oCardDefinition['component'];
		var sServiceUrl = oComponent.getModel().sServiceUrl;
		// oCardConfiguration["parameters"] = getFilterDetails(oCardDefinition)["filters"];
		oCardConfiguration["destinations"] = { service: { name: "(default)", defaultUrl: "/" } };
		oCardConfiguration["csrfTokens"] = {
			token1: {
				data: {
					request: {
						url: "{{destinations.service}}" + sServiceUrl,
						method: "HEAD",
						headers: {
							"X-CSRF-Token": "Fetch"
						}
					}
				}
			}
		};
		return oCardConfiguration;
	};

	/**
	* Create Manifest for Data Property of Sap.Card component with the given card defination
	*
	* @param {Object} oCardDefinition
	* @param {Object} oSapCard
	* @returns {Object} oSapCardData Data property for Sap.Card component of the Manifest
	*/
	var fnCreateManifestSapCardData = function (oCardDefinition, oSapCard) {
		var oSapCardData = {};
		// var oBatchObject = BatchHelper.getBatchObject(oCardDefinition, oSapCard["configuration"]);
		var oComponent = oCardDefinition['component'];
		var sServiceUrl = oComponent.getModel().sServiceUrl;
		var dataSource = sServiceUrl;
		var oCurrentControlHandler = oCardDefinition['currentControlHandler'];
		//  var isMTable = oCurrentControlHandler.isMTable();
		var sContentURL = '';
		if (oCurrentControlHandler.getBinding()) {
			sContentURL = oCurrentControlHandler.getBinding().getDownloadUrl();
		}

		var oBatch = {};
		oBatch.content = {
			method: "GET",
			url: sContentURL,
			headers: {
				Accept: "application/json"
			}
		};
		oSapCardData["request"] = {
			url: "{{destinations.service}}" + dataSource + "/$batch",
			method: "POST",
			headers: {
				"X-CSRF-Token": "{{csrfTokens.token1}}"
			},
			batch: oBatch
		};
		return oSapCardData;
	};

	/**
	* Create Manifest for Header property of Sap.Card component with the given card defination
	*
	* @param {Object} oCardDefinition
	* @param {Object} oSapCard
	* @returns {Object} oSapCardHeader Header property for Sap.Card component of the Manifest
	*/
	var fnCreateManifestSapCardHeader = function (oCardDefinition, oSapCard) {
		var oToolbar = oCardDefinition['currentControlHandler'].getToolbar();
		var sComponentName = oCardDefinition['component'].getMetadata().getName(), sTitleText = oToolbar.getTitleControl() && oToolbar.getTitleControl().getText(), sText = '';
		if (sTitleText && sComponentName === "sap.suite.ui.generic.template.ListReport.Component") {
			var aTitleText = sTitleText.split('(');
			sTitleText = aTitleText[0].trim();
			sText = aTitleText[1].split(')')[0].trim();
		}
		var oSapCardHeader = {
			"title": sTitleText,
			"subTitle": "",
			"actions": fnGetActionObject(oCardDefinition['oSmartFilterbar']),
			"status": {
				"text": sText
			}
		};
		return oSapCardHeader;
	};

	/**
  * Create Manifest for Content property of Sap.Card component with the given card defination
  *
  * @param {Object} oCardDefinition
  * @param {Object} oSapCard
  * @returns {Object} oSapCardContent Header property for Sap.Card component of the Manifest
  */
	var fnCreateManifestSapCardContent = function (oCardDefinition, oSapCard, aSelectedColumns) {
		var aColumns = fnGetColumnsToShow(oCardDefinition, aSelectedColumns);
		var oSapCardContent = {
			"data": {
				"path": "/content/d/results"
			},
			"maxItems": 5,
			"row": {
				"columns": aColumns,
				"actions": fnGetActionObject(oCardDefinition['oSmartFilterbar'])
			}
		};
		return oSapCardContent;
	};

	/**
 * Create Manifest for Content property of Sap.Card component with the given card defination
 *
 * @param {Object} oCardDefinition
 * @param {Object} oSapCard
 * @returns {Object} oSapCardContent Header property for Sap.Card component of the Manifest
 */
	var fnCreateManifestSapAnalyticalCardContent = function (oCardDefinition, oCardConfig) {
		var oSapCardContent = {},
			oCurrentControlHandler = oCardDefinition['currentControlHandler'],
			oInnerChart = oCurrentControlHandler.getInnerChart(),
			oMeasureDetails = oCurrentControlHandler.getBinding().getMeasureDetails(),
			oDimensionDetails = oCurrentControlHandler.getBinding().getDimensionDetails();
		oSapCardContent["data"] = {
			path: "/content/d/results"
		};
		oSapCardContent["chartType"] = fnResolveChartType(oInnerChart);
		oSapCardContent["measures"] = fnResolveChartMeasures(oMeasureDetails);
		oSapCardContent["dimensions"] = fnResolveChartDimensions(oDimensionDetails);
		oSapCardContent["feeds"] = fnResolveChartFeeds(oSapCardContent);
		oSapCardContent["chartProperties"] = fnResolveChartProperties(oInnerChart);
		oSapCardContent["actionableArea"] = "Chart";
		oSapCardContent["actions"] = fnGetActionObject(oCardDefinition['oSmartFilterbar']);
		return oSapCardContent;
	};

	var fnResolveChartProperties = function (oInnerChart) {
		var oChartVizProperties = oInnerChart.mProperties.vizProperties;
		oChartVizProperties["categoryAxis"]["title"]["visible"] = true;
		oChartVizProperties["valueAxis"]["title"]["visible"] = true;
		return oChartVizProperties;
	};

	var fnResolveChartFeeds = function (oSapCardContent) {
		var aMeasureValues = [], aDimensionValues = [];

		for (var sKey in oSapCardContent["measures"]) {
			aMeasureValues.push(oSapCardContent["measures"][sKey].name);
		}

		for (var sKey in oSapCardContent["dimensions"]) {
			aDimensionValues.push(oSapCardContent["dimensions"][sKey].name);
		}

		return [
			{
				"type": "Dimension",
				"uid": oSapCardContent.chartType === 'Donut' ? "color" : "categoryAxis",
				"values": aDimensionValues
			},
			{
				"type": "Measure",
				"uid": oSapCardContent.chartType === 'Donut' ? "size" : "valueAxis",
				"values": aMeasureValues
			}
		];
	};

	var fnResolveChartType = function (oInnerChart) {
		var sResultChartType;
		switch (oInnerChart.getChartType()) {
			case "line":
				sResultChartType = "Line";
				break;
			case "donut":
				sResultChartType = "Donut";
				break;
			case "stacked_column":
				sResultChartType = "stacked_column";
				break;
			default:
				sResultChartType = "Line";
				break;
		}
		return sResultChartType;
	};

	var fnResolveChartMeasures = function (oMeasureDetails) {
		var aMeasures = [];
		for (var prop in oMeasureDetails) {
			var elem = oMeasureDetails[prop];
			aMeasures.push({ "name": elem.analyticalInfo.name, "value": "{" + elem.analyticalInfo.measurePropertyName + "}" });
		}
		return aMeasures;
	};

	var fnResolveChartDimensions = function (oDimensionDetails) {
		var aDimensions = [];
		for (var prop in oDimensionDetails) {
			var elem = oDimensionDetails[prop];
			aDimensions.push({ "name": elem.name, "value": "{" + elem.analyticalInfo.name + "}" });
		}
		return aDimensions;
	};

	var fnResolveFilterValues = function (aFilterItems, key) {
		var result = [];
		for (var sFilterItemKey in aFilterItems) {
			result.push(aFilterItems[sFilterItemKey][key]);
		}
		return result.length > 1 ? result : result[0];
	};

	var fnGetActionObject = function (oSmartFilterbar) {
		var sHash = window.hasher.getHash(), aSemanticObjAction = sHash.split('&/')[0].split('-'), oFilterData = oSmartFilterbar.getFilterData(), oIBNParams = {};
		for ( var sKey in oFilterData) {
			if (!oFilterData[sKey].hasOwnProperty("conditionTypeInfo")) {
				if (oFilterData[sKey].items && oFilterData[sKey].items.length) {
					oIBNParams[sKey] = fnResolveFilterValues(oFilterData[sKey].items, "key");
				}
				if (oFilterData[sKey].ranges && oFilterData[sKey].ranges.length) {
					oIBNParams[sKey] = fnResolveFilterValues(oFilterData[sKey].ranges, "value1");
				}
			}
		}

		var oActionObject = [
			{
				"type": "Navigation",
				"parameters": {
					"ibnTarget": {
						"semanticObject": aSemanticObjAction[0],
						"action": aSemanticObjAction[1]
					},
					"ibnParams": oIBNParams
				}
			}
		];
		return oActionObject;
	};

	var fnGetColumnsToShow = function (oCardDefinition, aSelectedColumns) {
		var oEntityType = oCardDefinition['entityType'];
		var oMetaModel = oCardDefinition['currentControlHandler'].getModel().getMetaModel();
		var oColumns = [];
		oCardDefinition['currentControlHandler'].getVisibleProperties().filter(function (oColumn) {
			var sColumnKey = oColumn.data("p13nData") && oColumn.data("p13nData").columnKey;
			var oProperty = oMetaModel.getODataProperty(oEntityType, oColumn.data("p13nData").leadingProperty);
			if (oProperty && aSelectedColumns.indexOf(oProperty.name) > -1) {
				if (oColumn.getVisible() && ((sColumnKey.indexOf("DataFieldForAnnotation") < 0) && !oColumn.data("p13nData").actionButton && !!oColumn.data("p13nData").leadingProperty)) {
					var oColumnObject = {};
					var sColumnValue = "{" + oProperty.name + "}";
					var sNavigation = ""; //need to improve
					// if (oProperty["com.sap.vocabularies.Common.v1.Text"] && oProperty["com.sap.vocabularies.Common.v1.Text"].Path) {
					//     sColumnValue = sColumnValue.concat(" " + "{" + sNavigation + oProperty["com.sap.vocabularies.Common.v1.Text"].Path + "}");
					// }
					if (oProperty["Org.OData.Measures.V1.ISOCurrency"] && oProperty["Org.OData.Measures.V1.ISOCurrency"].Path) {
						sColumnValue = sColumnValue.concat(" " + "{" + sNavigation + oProperty["Org.OData.Measures.V1.ISOCurrency"].Path + "}");
					}
					if (oProperty["Org.OData.Measures.V1.Unit"] && oProperty["Org.OData.Measures.V1.Unit"].Path) {
						sColumnValue = sColumnValue.concat(" " + "{" + sNavigation + oProperty["Org.OData.Measures.V1.Unit"].Path + "}");
					}

					if (oProperty['com.sap.vocabularies.UI.v1.IsImageURL'] && oProperty['com.sap.vocabularies.UI.v1.IsImageURL'].Bool === "true") {
						oColumnObject['title'] = oProperty['com.sap.vocabularies.Common.v1.Label'].String || oProperty['sap:label'];
						oColumnObject['icon'] = {
							src: "{" + oProperty.name + "}"
						};
					} else {
						oColumnObject['title'] = oProperty['com.sap.vocabularies.Common.v1.Label'].String || oProperty['sap:label'];
						oColumnObject['value'] = sColumnValue;
					}
					oColumns.push(oColumnObject);
				}
			}
		});
		return oColumns;
	};

	function fnCreateP13nDialogBeforeCardGeneration(aColumns, oButton, oCardDefinition, fnResolve) {
		var oResourceModel = oCardDefinition['component'].getModel("i18n").getResourceBundle();
		var oSelectionPanel = new SelectionPanel({
			title: oResourceModel.getText("ST_CARDS_SELECTIONPANEL_TITLE"),
			showHeader: true,
			messageStrip: new sap.m.MessageStrip({
				text: oResourceModel.getText("ST_CARDS_SELECTIONPANEL_MESSAGESTRIP")
			}),
			change: function (oEvt) {					
				var aItems = oSelectionPanel.getP13nData();
				var iSelectedItems = oSelectionPanel.getP13nData(true).length;
					
				if (iSelectedItems > 3) {
					var oAffectedItem = aItems.find(function(oItem) {
						return oItem.name === oEvt.getParameter("item").name;
					});
					oAffectedItem.visible = false;
				}	
				oSelectionPanel.setP13nData(aItems);		
			}
		});
		oSelectionPanel.setP13nData(aColumns);
		var oPopup = new Popup({
			title: oResourceModel.getText("ST_CARDS_SELECTIONPOPUP_TITLE"),
			panels: [
				oSelectionPanel
			],
			close: function (oEvent) {
				if (oEvent.getParameter("reason") === "Ok") {
					var aSelectedColumns = oEvent.getSource().getPanels()[0].getSelectedFields();
					fnResolve(createIntegrationCardForPreview(oCardDefinition, aSelectedColumns));
				}
			}
		});
		oPopup.open(oButton);
	}

	return AddCardsHelper;
});

