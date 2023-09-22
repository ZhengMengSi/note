/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/mdc/field/FieldInfoBase",
	"sap/ui/thirdparty/jquery",
	"sap/ui/core/InvisibleText",
	"sap/ui/model/json/JSONModel",
	"sap/ui/mdc/link/Log",
	"sap/base/Log",
	"sap/ui/mdc/link/Panel",
	"sap/ui/mdc/link/PanelItem",
	"sap/ui/layout/form/SimpleForm",
	"sap/ui/core/Title",
	"sap/ui/layout/library"
], function(FieldInfoBase,
	jQuery,
	InvisibleText,
	JSONModel,
	Log,
	SapBaseLog,
	Panel,
	PanelItem,
	SimpleForm,
	CoreTitle,
	layoutLibrary) {
	"use strict";

	// shortcut for sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout
	var ResponsiveGridLayout = layoutLibrary.form.SimpleFormLayout.ResponsiveGridLayout;

	var Link = FieldInfoBase.extend("sap.ui.mdc.Link", /** @lends sap.ui.mdc.Link.prototype */
		{
			metadata: {
				library: "sap.ui.mdc",
				properties: {
                    /**
                     * Could be changed in the future to enable / disable USER / KEYUSER personalization
                     */
					enablePersonalization: {
						type: "boolean",
						defaultValue: true
					},
                    /**
                     * Path to <code>LinkDelegate</code> module that provides the required APIs to create Link content.<br>
                     * <b>Note:</b> Ensure that the related file can be requested (any required library has to be loaded before that).<br>
                     * Do not bind or modify the module. Once the required module is associated, this property might not be needed any longer.
                     *
                     * @experimental
                     */
					delegate: {
						type: "object",
						defaultValue: { name: "sap/ui/mdc/LinkDelegate", payload: {} }
					}
				},
				associations: {
                    /**
                     * Mostly the source control is used in order to get the AppComponent which is required for
                     * link personalization. Additionally the source control is used to get the binding context.
                     */
					sourceControl: {
						type: "sap.ui.core.Control",
						multiple: false
					}
				}
			}
		});

	Link.prototype.applySettings = function() {
		FieldInfoBase.prototype.applySettings.apply(this, arguments);
		if (!this.oDelegatePromise) {
			this.setDelegate(this.getDelegate());
		}
	};

	Link.prototype.init = function() {
		var oModel = new JSONModel({
			contentTitle: undefined,
			bHasPotentialContent: undefined,
			linkItems: []
		});
		oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
		oModel.setSizeLimit(1000);
		this.setModel(oModel, "$sapuimdcLink");
		this.attachEvent("modelContextChange", this._handleModelContextChange, this);
		this._bLinkItemsFetched = false;
		this._aLinkItems = [];
	};

	/**
	 * Returns an object containing the <code>href</code> and <code>target</code> of the getDirectLink
	 * Returns null if there is no direct link
	 * @returns {Promise} {Object | null}
	 */
	Link.prototype.getDirectLinkHrefAndTarget = function() {
		return this.getDirectLink().then(function(oLink) {
			return oLink ? {
				target: oLink.getTarget(),
				href: oLink.getHref()
			} : null;
		});
	};

	// ----------------------- Implementation of 'IFieldInfo' interface --------------------------------------------

	/**
	 * In the first step we have just to decide whether the FieldInfo is clickable i.e. has to be rendered as a link.
	 * @returns {Promise} <code>true</code> if the FieldInfo is clickable
	 */
	Link.prototype.isTriggerable = function() {
		return this.oDelegatePromise.then(function() {
			var oPayload = Object.assign({}, this.getDelegate().payload);
			return this.DELEGATE._isTriggerable(oPayload).then(function(isTriggerable) {
				if (isTriggerable === true) {
					return true;
				}
				return this.hasPotentialContent();
			}.bind(this));
		}.bind(this));
	};
	/**
	 * Returns as promise result href of direct link navigation, else null.
	 * @returns {Promise} <code>href</code> of direct link navigation, else null
	 */
	Link.prototype.getTriggerHref = function() {
		return this.getDirectLinkHrefAndTarget().then(function(oLinkItem) {
			return oLinkItem ? oLinkItem.href : null;
		});
	};

    /**
     * Retrieves the relevant metadata for the table and returns property info array
     *
     * @param {sap.ui.mdc.link.Panel} oPanel The instance Panel control
     * @returns {object[]} Array of copied property info
     */
	Link.retrieveAllMetadata = function(oPanel) {
		if (!oPanel.getModel || !oPanel.getModel("$sapuimdcLink")) {
			return [];
		}
		var oModel = oPanel.getModel("$sapuimdcLink");
		return oModel.getProperty("/metadata").map(function(oMLinkItem) {
			return {
				id: oMLinkItem.key,
				text: oMLinkItem.text,
				description: oMLinkItem.description,
				href: oMLinkItem.href,
				target: oMLinkItem.target,
				visible: oMLinkItem.visible
			};
		});
	};

	/**
	 * Retrieves the initial items belonging to the baseline which is used when reset is executed.
	 * @param {sap.ui.mdc.link.Panel} oPanel The instance Panel control
	 * @returns {object[]} Array of copied property info
	 */
	Link.retrieveBaseline = function(oPanel) {
		if (!oPanel.getModel || !oPanel.getModel("$sapuimdcLink")) {
			return [];
		}
		var oModel = oPanel.getModel("$sapuimdcLink");
		return oModel.getProperty("/baseline").map(function(oMLinkItem) {
			return {
				id: oMLinkItem.key,
				visible: true
			};
		});
	};

    /**
     * Returns a promise reslove a Boolean if the Link has any Content (additionalContent or linkItems).
     * This is mainly used to check if the Link is clickable or not
     * @returns {Promise} resolve Boolean
     */
	Link.prototype.hasPotentialContent = function() {
		// Additional content should be shown always
		return this.retrieveAdditionalContent().then(function(aAdditionalContent) {
			if (!!aAdditionalContent.length) {
				return Promise.resolve(true);
			}
			return Promise.resolve(this.hasPotentialLinks());
		}.bind(this));
	};

	/**
	 * Returns as promise resolve a LinkItem as a direct link navigation if exist, else null.
	 * @returns {Promise} Resolve LinkItem of type sap.ui.mdc.link.LinkItem of direct link navigation, else null
	 */
	Link.prototype.getDirectLink = function() {
		return this.retrieveAdditionalContent().then(function(aAdditionalContent) {
			// Additional content should be shown always, no direct navigation possible
			// If additional content exists, return [] as the determination of LinkItems is not needed yet
			if (!aAdditionalContent.length) {
				return this.retrieveLinkItems().then(function(aLinkItems) {
					// If only one action exists (independent whether it is visible or not), direct navigation is
					// possible. Reason is that the visibility can be personalized. So e.g. if only one action is
					// visible and some actions are not visible the end user should be able to personalize the actions
					// again. This can the end user only do when the direct navigation is not executed.
					var aTriggerableItems = aLinkItems.filter(function(oItem) {
						return !!oItem.getHref();
					});
					if (aTriggerableItems.length !== 1) {
						return null;
					}
					return aTriggerableItems[0];
				});
			}
			return null;
		}.bind(this));
	};

	// ----------------------- Implementation of 'ICreatePopover' interface --------------------------------------------

	Link.prototype.getContentTitle = function() {
		return new InvisibleText({
			text: this._getContentTitle()
		});
	};

	Link.prototype.getContent = function(fnGetAutoClosedControl) {
		var oLinkItemsPromise = this.retrieveLinkItems();
		var oAdditionalContentPromise = this.retrieveAdditionalContent();
		return Promise.all([oLinkItemsPromise, oAdditionalContentPromise]).then(function(values) {
			var aLinkItems = values[0];
			var aAdditionalContent = values[1];
			return new Promise(function(resolve) {
				sap.ui.require([
					'sap/ui/fl/Utils',
					'sap/ui/fl/apply/api/FlexRuntimeInfoAPI'
				], function(Utils, FlexRuntimeInfoAPI) {
					this._setConvertedLinkItems(aLinkItems);
					var aMLinkItems = this._getInternalModel().getProperty("/linkItems");
					var aMBaselineLinkItems = this._getInternalModel().getProperty("/baselineLinkItems");

					var oPanel = new Panel(this._createPanelId(Utils, FlexRuntimeInfoAPI), {
						enablePersonalization: this.getEnablePersonalization(), // brake the binding chain
						items: aMBaselineLinkItems.map(function(oMLinkItem) {
							return new PanelItem(oMLinkItem.key, {
								text: oMLinkItem.text,
								description: oMLinkItem.description,
								href: oMLinkItem.href,
								target: oMLinkItem.target,
								icon: oMLinkItem.icon,
								visible: true
							});
						}),
						additionalContent: !aAdditionalContent.length && !aMLinkItems.length ? Link._getNoContent() : aAdditionalContent,
						beforeSelectionDialogOpen: function() {
							if (fnGetAutoClosedControl && fnGetAutoClosedControl()) {
								fnGetAutoClosedControl().setModal(true);
							}
						},
						afterSelectionDialogClose: function() {
							if (fnGetAutoClosedControl && fnGetAutoClosedControl()) {
								fnGetAutoClosedControl().setModal(false);
							}
						},
						metadataHelperPath: "sap/ui/mdc/Link"
					});

					oPanel.setModel(new JSONModel({
						metadata: jQuery.extend(true, [], this._getInternalModel().getProperty("/linkItems")),
						baseline: jQuery.extend(true, [], this._getInternalModel().getProperty("/baselineLinkItems"))
					}), "$sapuimdcLink");
					return resolve(oPanel);
				}.bind(this));
			}.bind(this));
		}.bind(this));
	};

    /**
     * Returns a promise resolve a Boolean if the Link has any potential LinkItems.
     * This is mainly used to check if the Link is clickable or not
     * @returns {Promise} resolve Boolean
     */
	Link.prototype.hasPotentialLinks = function() {
		return this.retrieveLinkItems().then(function(aLinkItems) {
			return !!aLinkItems.length;
		});
	};

    /**
     * @returns {Object[]} of type sap.ui.mdc.link.LinkItem
     */
	Link.prototype.retrieveLinkItems = function() {
		if (this._bLinkItemsFetched) {
			return Promise.resolve(this._aLinkItems);
		} else {
			this.oUseDelegateItemsPromise = this._useDelegateItems();
			return this.oUseDelegateItemsPromise.then(function() {
				this._bLinkItemsFetched = true;
				return Promise.resolve(this._aLinkItems);
			}.bind(this));
		}
	};

    /**
     * @returns {Object[]} of type sap.ui.base.Control
     */
	Link.prototype.retrieveAdditionalContent = function() {
		if (this.oDelegatePromise) {
			return this.oDelegatePromise.then(function() {
				var oPayload = Object.assign({}, this.getDelegate().payload);
				var oBindingContext = this._getControlBindingContext();
				return this.DELEGATE.fetchAdditionalContent(oPayload, oBindingContext).then(function(aAdditionalContent) {
					return aAdditionalContent;
				});
			}.bind(this));
		}
		return Promise.resolve([]);
	};

    /**
     * @returns {String} ID of the SourceControl
     */
	Link.prototype.getSourceControl = function() {
		return this.getAssociation("sourceControl");
	};

    /**
     * Adds a given LinkItem to the private parameter _aLinkItems.
     * @param {sap.ui.mdc.link.LinkItem} oLinkItem LinkItem that shall be added to the Panel
     */
	Link.prototype.addLinkItem = function(oLinkItem) {
		if (oLinkItem && oLinkItem.isA("sap.ui.mdc.link.LinkItem")) {
			return this.retrieveLinkItems().then(function(aLinkItems) {
				aLinkItems.push(oLinkItem);
				this.addDependent(oLinkItem);
				this.fireDataUpdate();
				this._determineContent();
			}.bind(this));
		} else {
			SapBaseLog.error("Link: addLinkItem for " + oLinkItem + " failed. Please make sure that it's a 'sap.ui.mdc.link.LinkItem'.");
		}
	};

    /**
     * Removes all LinkItems.
     */
	Link.prototype.removeAllLinkItems = function() {
		this.retrieveLinkItems().then(function(aLinkItems) {
			aLinkItems.forEach(function(oLinkItem) {
				oLinkItem.destroy();
				oLinkItem = undefined;
			});
			this._setLinkItems([]);
			this._determineContent();
		}.bind(this));
	};

    /**
     * @private
     * @returns {String} sContentTitle which is saved in the internal model
     */
	Link.prototype._getContentTitle = function() {
		return this._getInternalModel().getProperty("/contentTitle");
	};

	/**
	 * Returns the binding context of the source control or of the link itselfe
	 * @private
	 * @returns {Object} the binding context of the SourceControl / link
	 */
	Link.prototype._getControlBindingContext = function() {
		var oControl = sap.ui.getCore().byId(this.getSourceControl());
		return oControl && oControl.getBindingContext() || this.getBindingContext();
	};

    /**
	 * Returns the object of a given binding context
     * @private
	 * @param {Object} oBindingContext
     * @returns {Object | undefined} object of the BindingContext
     */
	Link.prototype._getContextObject = function(oBindingContext) {
		return oBindingContext ? oBindingContext.getObject(oBindingContext.getPath()) : undefined;
	};

    /**
     * Generates a new sap.bas.log if the payload contains SemanticObjects (this log is required for the sap.ui.mdc.flp.FlpLinkDelegate)
     * @private
     * @returns {sap.base.Log | undefined}
     */
	Link.prototype._getInfoLog = function() {
		if (this.getDelegate().payload && this.getDelegate().payload.semanticObjects) {
			if (this._oInfoLog) {
				return this._oInfoLog;
			}
			if (SapBaseLog.getLevel() >= SapBaseLog.Level.INFO) {
				this._oInfoLog = new Log();
				this._oInfoLog.initialize(this.getDelegate().payload.semanticObjects, this._getContextObject(this._getControlBindingContext()));
				return this._oInfoLog;
			}
		}
		return undefined;
	};

    /**
     * @private
     */
	Link.prototype._getInternalModel = function() {
		return this.getModel("$sapuimdcLink");
	};

    /**
     * @private
     * @returns {String}
     */
	Link.prototype._getLogFormattedText = function() {
		return (this._oInfoLog && !this._oInfoLog.isEmpty()) ? "---------------------------------------------\nsap.ui.mdc.Link:\nBelow you can see detailed information regarding semantic attributes which have been calculated for one or more semantic objects defined in a Link control. Semantic attributes are used to create the URL parameters. Additionally you can see all links containing the URL parameters.\n" + this._oInfoLog.getFormattedText() : "No logging data available";
	};

    /**
     * @private
     * @returns {sap.ui.layout.form.SimpleForm} a form containing a title which notices the user that there is no content for this Link
     */
	Link._getNoContent = function() {
		var oSimpleForm = new SimpleForm({
			layout: ResponsiveGridLayout,
			content: [
				new CoreTitle({
					text: sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc").getText("info.POPOVER_MSG_NO_CONTENT")
				})
			]
		});
		oSimpleForm.addStyleClass("mdcbaseinfoPanelDefaultAdditionalContent");
		return oSimpleForm;
	};

    /**
     * @private
     * @param {sap.ui.fl.Utils} Utils flex utility class
     * @returns {Object} view of the sourceControl / sourceControl of the parent
     */
	Link.prototype._getView = function(Utils) {
		var oField;
		if (this.getParent()) {
			oField = this.getParent();
		}
		var oControl = sap.ui.getCore().byId(this.getSourceControl());
		if (!oControl) {
			//SapBaseLog.error("Invalid source control: " + this.getSourceControl() + ". The mandatory 'sourceControl' association should be defined due to personalization reasons, parent: " + oField + " used instead.");
			this.setSourceControl(oField);
		}
		return Utils.getViewForControl(oControl) || Utils.getViewForControl(oField);
	};

    /**
     * @private
     * @param {String} sTitle
     */
	Link.prototype._setContentTitle = function(sTitle) {
		return this._getInternalModel().setProperty("/contentTitle", sTitle);
	};

    /**
     * @private
     * @param {sap.ui.mdc.link.LinkItem[]} aLinkItems
     */
	Link.prototype._setConvertedLinkItems = function(aLinkItems) {
		var oModel = this._getInternalModel();
		var aMLinkItems = aLinkItems.map(function(oLinkItem) {
			if (!oLinkItem.getKey()) {
				SapBaseLog.error("sap.ui.mdc.Link: undefined 'key' property of the LinkItem " + oLinkItem.getId() + ". The mandatory 'key' property should be defined due to personalization reasons.");
			}
			return {
				key: oLinkItem.getKey(),
				text: oLinkItem.getText(),
				description: oLinkItem.getDescription(),
				href: oLinkItem.getHref(),
				target: oLinkItem.getTarget(),
				icon: oLinkItem.getIcon(),
				isSuperior: oLinkItem.getIsSuperior(),
				visible: false
			};
		});
		oModel.setProperty("/linkItems/", aMLinkItems);

		// As default we do not show any items initially (the baseline is empty)
		var aMBaselineLinkItems = aMLinkItems.filter(function(oMLinkItem) {
			return !oMLinkItem.key;
		});
		oModel.setProperty("/baselineLinkItems/", aMBaselineLinkItems);
	};

    /**
     * @private
     * @param {sap.ui.mdc.link.LinkItem[]} aLinkItems
     */
	Link.prototype._setLinkItems = function(aLinkItems) {
		var aLinkItemsMissingParent = aLinkItems.filter(function(oLinkItem) {
			return oLinkItem.getParent() === null;
		});
		aLinkItemsMissingParent.forEach(function(oLinkItem) {
			this.addDependent(oLinkItem);
		}.bind(this));
		this._aLinkItems = aLinkItems;
	};

    /**
     * Generates a ID for the panel of the Link. The result is depending on the fact that the Link supports Flex or not.
     * @private
     * @param {sap.ui.fl.Utils} Utils Flex utility class
     * @param {sap.ui.fl.apply.api.FlexRuntimeInfoAPI} FlexRuntimeInfoAPI Flex runtime info api
     * @returns {String} generated Id of the panel
     */
	Link.prototype._createPanelId = function(Utils, FlexRuntimeInfoAPI) {
		var oField;
		if (this.getParent()) {
			oField = this.getParent();
		}
		var oControl = sap.ui.getCore().byId(this.getSourceControl());
		if (!oControl) {
			//SapBaseLog.error("Invalid source control: " + this.getSourceControl() + ". The mandatory 'sourceControl' association should be defined due to personalization reasons, parent: " + oField + " used instead.");
			this.setSourceControl(oField);
		}
		if (!FlexRuntimeInfoAPI.isFlexSupported({ element: this })) {
			SapBaseLog.error("Invalid component. The mandatory 'sourceControl' association should be assigned to the app component due to personalization reasons.");
			return this.getId() + "-idInfoPanel";
		}
		var oAppComponent = Utils.getAppComponentForControl(oControl) || Utils.getAppComponentForControl(oField);
		return oAppComponent.createId("idInfoPanel");
	};

	Link.prototype._determineContent = function() {
		this.hasPotentialContent().then(function(bHasPotentialContent) {
			if (this._getInternalModel().getProperty('/bHasPotentialContent') !== bHasPotentialContent) {
				this._getInternalModel().setProperty('/bHasPotentialContent', bHasPotentialContent);
			}
		}.bind(this));
	};

	Link.prototype._handleModelContextChange = function(oEvent) {
		this.fireDataUpdate();
	};

    /**
     * Determines the LinkItems depending on the given LinkDelegate.
     * @private
     * @returns {Promise} which resolves once the LinkItems are fetched by the delegate. This also sets this._aLinkItems.
     */
	Link.prototype._useDelegateItems = function() {
		if (this.oDelegatePromise) {
			return this.oDelegatePromise.then(function() {
				// Assign new Object so payload.id won't get set for the whole Link class
				var oPayload = Object.assign({}, this.getDelegate().payload);
				var oBindingContext = this._getControlBindingContext();
				var oInfoLog = this._getInfoLog();
				return new Promise(function(resolve) {
					this.DELEGATE.fetchLinkItems(oPayload, oBindingContext, oInfoLog).then(function(aLinkItems) {
						this._setLinkItems(aLinkItems);
						resolve();
					}.bind(this));
				}.bind(this));
			}.bind(this));
		}
		SapBaseLog.error("mdc.Link _useDelegateItems: oDelegatePromise is not set - could not load LinkItems from delegate.");
		return Promise.resolve();
	};

	return Link;
});
