/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"sap/fe/core/controllerextensions/Routing",
		"sap/fe/core/controllerextensions/FlexibleColumnLayout",
		"sap/fe/core/controllerextensions/EditFlow",
		"sap/ui/model/odata/v4/ODataListBinding",
		"sap/fe/macros/field/FieldRuntime",
		"sap/base/Log",
		"sap/base/util/merge",
		"sap/fe/core/CommonUtils",
		"sap/fe/navigation/SelectionVariant",
		"sap/fe/macros/CommonHelper",
		"sap/m/MessageBox",
		"sap/fe/core/BusyLocker",
		"sap/fe/navigation/NavigationHelper",
		"sap/fe/core/actions/messageHandling",
		"sap/fe/core/FEHelper"
	],
	function(
		Controller,
		JSONModel,
		Routing,
		Fcl,
		EditFlow,
		ODataListBinding,
		FieldRuntime,
		Log,
		merge,
		CommonUtils,
		SelectionVariant,
		CommonHelper,
		MessageBox,
		BusyLocker,
		NavigationHelper,
		messageHandling,
		FEHelper
	) {
		"use strict";

		var iMessages;

		return Controller.extend("sap.fe.templates.ObjectPage.ObjectPageController", {
			routing: Routing,
			fcl: Fcl,
			editFlow: EditFlow,

			onInit: function() {
				//var oObjectPage = this.byId("fe::op");
				this.getView().setModel(this.editFlow.getUIStateModel(), "ui");
				this.getView().setModel(
					new JSONModel({
						sessionOn: false
					}),
					"localUI"
				);

				// Adding model to store related apps data
				var oRelatedAppsModel = new JSONModel({
					visibility: false,
					items: null
				});

				this.getView().setModel(oRelatedAppsModel, "relatedAppsModel");

				//Attaching the event to make the subsection context binding active when it is visible.

				/*
			oObjectPage.attachEvent("subSectionEnteredViewPort", function(oEvent) {
				var oObjectPage = oEvent.getSource();
				var oSubSection = oEvent.getParameter("subSection");
				oObjectPage.getHeaderTitle().setBindingContext(undefined);
				oObjectPage.getHeaderContent()[0].setBindingContext(undefined);//The 0 is used because header content will have only one content (FlexBox).
				oSubSection.setBindingContext(undefined);
			});
			*/
			},

			getTableBinding: function(oTable) {
				return oTable && oTable._getRowBinding();
			},

			onBeforeBinding: function(oContext, mParameters) {
				// TODO: we should check how this comes together with the transaction helper, same to the change in the afterBinding
				var that = this,
					aTables = this._findTables(),
					oFastCreationRow,
					oObjectPage = this.byId("fe::op"),
					oBinding = mParameters.listBinding;

				if (
					oObjectPage.getBindingContext() &&
					oObjectPage.getBindingContext().hasPendingChanges() &&
					!(
						oObjectPage
							.getBindingContext()
							.getModel()
							.hasPendingChanges("$auto") ||
						oObjectPage
							.getBindingContext()
							.getModel()
							.hasPendingChanges("$auto.associations")
					)
				) {
					/* 	In case there are pending changes for the creation row and no others we need to reset the changes
						TODO: this is just a quick solution, this needs to be reworked
				 	*/

					oObjectPage
						.getBindingContext()
						.getBinding()
						.resetChanges();
				}

				// For now we have to set the binding context to null for every fast creation row
				// TODO: Get rid of this coding or move it to another layer - to be discussed with MDC and model
				for (var i = 0; i < aTables.length; i++) {
					oFastCreationRow = aTables[i].getCreationRow();
					if (oFastCreationRow) {
						oFastCreationRow.setBindingContext(null);
					}
				}

				// Scroll to present Section so that bindings are enabled during navigation through paginator buttons, as there is no view rerendering/rebind
				var fnScrollToPresentSection = function(oEvent) {
					if (!mParameters.bPersistOPScroll) {
						oObjectPage.setSelectedSection(null);
						oObjectPage.detachModelContextChange(fnScrollToPresentSection);
					}
				};

				oObjectPage.attachModelContextChange(fnScrollToPresentSection);

				//Set the Binding for Paginators using ListBinding ID
				if (oBinding && oBinding.isA("sap.ui.model.odata.v4.ODataListBinding")) {
					var oPaginator = that.byId("fe::paginator");
					if (oPaginator) {
						oPaginator.setListBinding(oBinding);
					}
				}

				if (!mParameters.editable) {
					var oLocalUIModel = this.getView().getModel("localUI");
					if (oLocalUIModel.getProperty("/sessionOn") === true) {
						oLocalUIModel.setProperty("/sessionOn", false);
					}
				}

				//Setting the context binding to inactive state for all object page components.
				/*
			oObjectPage.getHeaderTitle().setBindingContext(null);
			oObjectPage.getHeaderContent()[0].setBindingContext(null);//The 0 is used because header content will have only one content (FlexBox).
			oObjectPage.getSections().forEach(function(oSection){
				oSection.getSubSections().forEach(function(oSubSection){
					oSubSection.setBindingContext(null);
				});
			});
			*/
			},

			onAfterBinding: function(oBindingContext, mParameters) {
				var oObjectPage = this.byId("fe::op"),
					that = this,
					oModel = oBindingContext.getModel(),
					aTables = this._findTables(),
					oFinalUIState;

				// TODO: this is only a temp solution as long as the model fix the cache issue and we use this additional
				// binding with ownRequest
				oBindingContext = oObjectPage.getBindingContext();

				// Compute Edit Mode
				oFinalUIState = this.editFlow.computeEditMode(oBindingContext);

				// update related apps once Data is received
				// TODO: this is only a temp solution since need to call _updateRelatedApps method only after data for Object Page is received
				var fnUpdateRelatedApps = function() {
					that._updateRelatedApps();
					oBindingContext.getBinding().detachDataReceived(fnUpdateRelatedApps);
				};
				oBindingContext.getBinding().attachDataReceived(fnUpdateRelatedApps);

				// TODO: this should be moved into an init event of the MDC tables (not yet existing) and should be part
				// of any controller extension
				function enableFastCreationRow(oTable, oListBinding) {
					var oFastCreationRow = oTable.getCreationRow(),
						oFastCreationListBinding,
						oFastCreationContext;

					if (oFastCreationRow) {
						oFinalUIState.then(function() {
							if (oFastCreationRow.getVisible()) {
								oFastCreationListBinding = oModel.bindList(oListBinding.getPath(), oListBinding.getContext(), [], [], {
									$$updateGroupId: "doNotSubmit",
									$$groupId: "doNotSubmit"
								});

								// Workaround suggested by OData model v4 colleagues
								oFastCreationListBinding.refreshInternal = function() {};

								oFastCreationContext = oFastCreationListBinding.create();
								oFastCreationRow.setBindingContext(oFastCreationContext);

								// this is needed to avoid console
								oFastCreationContext.created().then(undefined, function() {
									Log.trace("transient fast creation context deleted");
								});
							}
						});
					}
				}

				// should be called only after binding is ready hence calling it in onAfterBinding
				oObjectPage._triggerVisibleSubSectionsEvents();

				// this should not be needed at the all
				function handleTableModifications(oTable) {
					var oBinding = that.getTableBinding(oTable);
					that.editFlow.handlePatchEvents(oBinding);
					// Inform macro field to handle patch events for failed side effects fallback
					FieldRuntime.handlePatchEvents(oBinding);
					enableFastCreationRow(oTable, oBinding);
				}

				// take care on message handling, draft indicator (in case of draft)
				//Attach the patch sent and patch completed event to the object page binding so that we can react
				this.editFlow.handlePatchEvents(oBindingContext).then(function() {
					// same needs to be done for the tables as well
					aTables.forEach(function(oTable) {
						oTable.done().then(handleTableModifications);
					});
				});

				// Inform macro field to handle patch events for failed side effects fallback
				FieldRuntime.handlePatchEvents(oBindingContext);
			},

			onPageReady: function(mParameters) {
				var oLastFocusedControl = mParameters.lastFocusedControl;
				if (oLastFocusedControl && oLastFocusedControl.controlId && oLastFocusedControl.focusInfo) {
					var oView = this.getView();
					var oFocusControl = oView.byId(oLastFocusedControl.controlId);
					if (oFocusControl) {
						oFocusControl.applyFocusInfo(oLastFocusedControl.focusInfo);
						return;
					}
				}
				var oObjectPage = this.byId("fe::op");
				// set the focus to the first action button, or to the first editable input if in editable mode
				var isInDisplayMode = oObjectPage.getModel("ui").getProperty("/editable") === "Display";
				var firstElementClickable;
				if (isInDisplayMode) {
					var aActions = oObjectPage.getHeaderTitle().getActions();
					if (aActions.length) {
						firstElementClickable = aActions.find(function(action) {
							// do we need && action.mProperties["enabled"] ?
							return action.mProperties["visible"];
						});
						if (firstElementClickable) {
							firstElementClickable.focus();
						}
					}
				} else {
					var firstEditableInput = oObjectPage._getFirstEditableInput();
					if (firstEditableInput) {
						firstEditableInput.focus();
					}
				}
			},
			getPageTitleInformation: function() {
				var that = this;

				return new Promise(function(resolve, reject) {
					var oObjectPage = that.byId("fe::op");
					var oTitleInfo = { title: "", subtitle: "", intent: "", icon: "" };

					var iObjectPageTitleIndex = oObjectPage.getCustomData().findIndex(function(oCustomData) {
						return oCustomData.mProperties.key === "ObjectPageTitle";
					});

					var iObjectPageSubtitleIndex = oObjectPage.getCustomData().findIndex(function(oCustomData) {
						return oCustomData.mProperties.key === "ObjectPageSubtitle";
					});

					if (oObjectPage.getCustomData()[iObjectPageTitleIndex].mProperties.value) {
						oTitleInfo.title = oObjectPage.getCustomData()[iObjectPageTitleIndex].mProperties.value;
					}

					if (
						iObjectPageSubtitleIndex > -1 &&
						oObjectPage.getCustomData()[iObjectPageSubtitleIndex].getBinding("value") !== undefined
					) {
						oObjectPage
							.getCustomData()
							[iObjectPageSubtitleIndex].getBinding("value")
							.requestValue()
							.then(function(sValue) {
								oTitleInfo.subtitle = sValue;
								resolve(oTitleInfo);
							})
							.catch(function() {
								reject();
							});
					} else {
						resolve(oTitleInfo);
					}
				});
			},

			executeHeaderShortcut: function(sId) {
				var sButtonId = this.getView().getId() + "--" + sId,
					oButton = this.byId("fe::op")
						.getHeaderTitle()
						.getActions()
						.find(function(oElement) {
							return oElement.getId() === sButtonId;
						});
				CommonUtils.fireButtonPress(oButton);
			},

			executeFooterShortcut: function(sId) {
				var sButtonId = this.getView().getId() + "--" + sId,
					oButton = this.byId("fe::op")
						.getFooter()
						.getContent()
						.find(function(oElement) {
							return oElement.getMetadata().getName() === "sap.m.Button" && oElement.getId() === sButtonId;
						});
				CommonUtils.fireButtonPress(oButton);
			},

			executeTabShortCut: function(oExecution) {
				var oObjectPage = this.byId("fe::op"),
					iSelectedSectionIndex = oObjectPage.indexOfSection(this.byId(oObjectPage.getSelectedSection())),
					aSections = oObjectPage.getSections(),
					iSectionIndexMax = aSections.length - 1,
					sCommand = oExecution.oSource.getCommand(),
					newSection;
				if (iSelectedSectionIndex !== -1 && iSectionIndexMax > 0) {
					if (sCommand === "NextTab") {
						if (iSelectedSectionIndex <= iSectionIndexMax - 1) {
							newSection = aSections[++iSelectedSectionIndex];
						}
					} else {
						// PreviousTab
						if (iSelectedSectionIndex !== 0) {
							newSection = aSections[--iSelectedSectionIndex];
						}
					}
					if (newSection) {
						oObjectPage.setSelectedSection(newSection);
						newSection.focus();
					}
				}
			},

			getFooterVisiblity: function(oEvent) {
				iMessages = oEvent.getParameter("iMessageLength");
				var oLocalUIModel = this.getView().getModel("localUI");
				iMessages > 0
					? oLocalUIModel.setProperty("/showMessageFooter", true)
					: oLocalUIModel.setProperty("/showMessageFooter", false);
			},

			showMessagePopover: function(oMessageButton) {
				var oMessagePopover = oMessageButton.oMessagePopover,
					oItemBinding = oMessagePopover.getBinding("items");
				if (oItemBinding.getLength() > 0) {
					oMessagePopover.openBy(oMessageButton);
				}
			},

			editDocument: function() {
				var oModel = this.getView().getModel("ui");
				BusyLocker.lock(oModel);
				return this.editFlow.editDocument.apply(this.editFlow, arguments).finally(function() {
					BusyLocker.unlock(oModel);
				});
			},

			saveDocument: function(oContext) {
				var that = this,
					oModel = this.getView().getModel("ui");

				BusyLocker.lock(oModel);
				return this.editFlow
					.saveDocument(oContext)
					.then(function() {
						var oMessageButton = that.getView().byId("MessageButton");
						var oDelegateOnAfter = {
							onAfterRendering: function(oEvent) {
								that.showMessagePopover(oMessageButton);
								oMessageButton.removeEventDelegate(that._oDelegateOnAfter);
								delete that._oDelegateOnAfter;
							}
						};
						that._oDelegateOnAfter = oDelegateOnAfter;
						oMessageButton.addEventDelegate(oDelegateOnAfter, that);
					})
					.catch(function(err) {
						var oMessageButton = that.getView().byId("MessageButton");
						if (oMessageButton) {
							that.showMessagePopover(oMessageButton);
						}
					})
					.finally(function() {
						BusyLocker.unlock(oModel);
					});
			},

			_updateRelatedApps: function() {
				var oObjectPage = this.byId("fe::op");
				if (CommonUtils.resolveStringtoBoolean(oObjectPage.data("showRelatedApps"))) {
					CommonUtils.updateRelatedAppsDetails(oObjectPage);
				}
			},

			//TODO: This is needed for two workarounds - to be removed again
			_findTables: function() {
				var oObjectPage = this.byId("fe::op"),
					aTables = [];

				function findTableInSubSection(aParentElement, aSubsection) {
					for (var element = 0; element < aParentElement.length; element++) {
						var oParent = aParentElement[element].getAggregation("items") && aParentElement[element].getAggregation("items")[0],
							oElement = oParent && oParent.getAggregation("content");

						if (oElement && oElement.isA("sap.ui.mdc.Table")) {
							aTables.push(oElement);
							if (
								oElement.getType().isA("sap.ui.mdc.table.GridTableType") &&
								!aSubsection.hasStyleClass("sapUxAPObjectPageSubSectionFitContainer")
							) {
								aSubsection.addStyleClass("sapUxAPObjectPageSubSectionFitContainer");
							}
						}
					}
				}

				var aSections = oObjectPage.getSections();
				for (var section = 0; section < aSections.length; section++) {
					var aSubsections = aSections[section].getSubSections();
					for (var subSection = 0; subSection < aSubsections.length; subSection++) {
						findTableInSubSection(aSubsections[subSection].getBlocks(), aSubsections[subSection]);
						findTableInSubSection(aSubsections[subSection].getMoreBlocks(), aSubsections[subSection]);
					}
				}

				return aTables;
			},

			_mergePageAndLineContext: function(oPageContext, oLineContext) {
				var oMixedContext = merge({}, oPageContext, oLineContext),
					oSelectionVariant = NavigationHelper.mixAttributesAndSelectionVariant(oMixedContext, new SelectionVariant());
				return oSelectionVariant;
			},

			handlers: {
				onFieldValueChange: function(oEvent) {
					this.editFlow.syncTask(oEvent.getParameter("promise"));
					FieldRuntime.handleChange(oEvent);
				},
				onRelatedAppsItemPressed: function(oEvent, oController) {
					var oControl = oEvent.getSource(),
						oBindingContext = oController && oController.getView() && oController.getView().getBindingContext();

					oController.editFlow.getProgrammingModel(oBindingContext).then(function(programmingModel) {
						var fnProcess = function() {
							var aCustomData = oControl.getCustomData(),
								targetSemObject,
								targetAction,
								targetParams;

							for (var i = 0; i < aCustomData.length; i++) {
								var key = aCustomData[i].getKey();
								var value = aCustomData[i].getValue();
								if (key == "targetSemObject") {
									targetSemObject = value;
								} else if (key == "targetAction") {
									targetAction = value;
								} else if (key == "targetParams") {
									targetParams = value;
								}
							}

							targetParams = NavigationHelper.removeSensitiveData(oBindingContext, targetParams);

							var oNavArguments = {
								target: {
									semanticObject: targetSemObject,
									action: targetAction
								},
								params: targetParams
							};

							sap.ushell.Container.getService("CrossApplicationNavigation").toExternal(oNavArguments);
						};

						CommonUtils.processDataLossConfirmation(fnProcess, oControl, programmingModel);
					});
				},
				/**
				 * Invokes an action - bound/unbound and sets the page dirty
				 * @function
				 * @static
				 * @param {string} sActionName The name of the action to be called
				 * @param {map} [mParameters] contains the following attributes:
				 * @param {sap.ui.model.odata.v4.Context} [mParameters.contexts] contexts Mandatory for a bound action, Either one context or an array with contexts for which the action shall be called
				 * @param {sap.ui.model.odata.v4.ODataModel} [mParameters.model] oModel Mandatory for an unbound action, An instance of an OData v4 model
				 * @sap-restricted
				 * @final
				 **/
				onCallActionFromFooter: function(oView, sActionName, mParameters) {
					var oController = oView.getController();
					var that = oController;
					return oController.editFlow
						.onCallAction(sActionName, mParameters)
						.then(function() {
							var oMessageButton = that.getView().byId("MessageButton");
							if (oMessageButton.isActive()) {
								that.showMessagePopover(oMessageButton);
							} else if (iMessages) {
								that._oDelegateOnAfter = {
									onAfterRendering: function(oEvent) {
										that.showMessagePopover(oMessageButton);
										oMessageButton.removeEventDelegate(that._oDelegateOnAfter);
										delete that._oDelegateOnAfter;
									}
								};
								oMessageButton.addEventDelegate(that._oDelegateOnAfter, that);
							}
						})
						.catch(function(err) {
							var oMessageButton = that.getView().byId("MessageButton");
							if (oMessageButton) {
								that.showMessagePopover(oMessageButton);
							}
						});
				},

				onDataFieldForIntentBasedNavigation: function(
					oController,
					sSemanticObject,
					sAction,
					sMappings,
					aLineContext,
					bRequiresContext
				) {
					var oControl = oController && oController.getView(),
						oBindingContext = oControl && oControl.getBindingContext();

					oController.editFlow.getProgrammingModel(oBindingContext).then(function(programmingModel) {
						var fnProcess = function() {
							var oSelectionVariant;
							var mPageContextData = {};
							var mLineContextData = {};
							if (bRequiresContext || aLineContext) {
								//If requirescontext is true then only consider passing contexts
								if (
									oController
										.getView()
										.getAggregation("content")[0]
										.getBindingContext()
								) {
									mPageContextData = NavigationHelper.removeSensitiveData(
										oController
											.getView()
											.getAggregation("content")[0]
											.getBindingContext()
									); // In OP we will always pass pagecontext when requirescontext is true
								}
								if (aLineContext) {
									mLineContextData = NavigationHelper.removeSensitiveData(aLineContext[0]); // Line context is considered if a context is selected in the table and also requirescontext is true
								}
								// If Line context exists then we merge it with page context and pass it and if line context does not exist then we pass only page context
								oSelectionVariant = oController._mergePageAndLineContext(mPageContextData, mLineContextData);
							}

							if (sMappings != "undefined") {
								oSelectionVariant = FEHelper.setSemanticObjectMappings(oSelectionVariant, sMappings);
							}

							CommonUtils.navigateToExternalApp(oController.getView(), oSelectionVariant, sSemanticObject, sAction);
						};

						CommonUtils.processDataLossConfirmation(fnProcess, oControl, programmingModel);
					});
				},

				/**
				 * Triggers an outbound navigation on Chevron Press
				 * @param {string} outboundTarget name of the outbound target (needs to be defined in the manifest)
				 * @param {sap.ui.model.odata.v4.Context} Context that contain the data for the target app
				 * @returns {Promise} Promise which is resolved once the navigation is triggered (??? maybe only once finished?)
				 */
				onChevronPressNavigateOutBound: function(oController, sOutboundTarget, oContext) {
					var oControl = oController && oController.getView(),
						oBindingContext = oControl && oControl.getBindingContext();

					return oController.editFlow.getProgrammingModel(oBindingContext).then(function(programmingModel) {
						var fnProcess = function() {
							var oOutbounds = oController.routing.getOutbounds(),
								oSelectionVariant,
								oDisplayOutbound = oOutbounds[sOutboundTarget],
								mPageContextData = NavigationHelper.removeSensitiveData(
									oController
										.getView()
										.getAggregation("content")[0]
										.getBindingContext()
								),
								mLineContextData = NavigationHelper.removeSensitiveData(oContext);

							if (oDisplayOutbound) {
								if (oContext) {
									oSelectionVariant = oController._mergePageAndLineContext(mPageContextData, mLineContextData);
								}
								CommonUtils.navigateToExternalApp(
									oController.getView(),
									oSelectionVariant,
									oDisplayOutbound.semanticObject,
									oDisplayOutbound.action,
									CommonHelper.showNavigateErrorMessage
								);

								return Promise.resolve();
							} else {
								throw new Error(
									"outbound target " + sOutboundTarget + " not found in cross navigation definition of manifest"
								);
							}
						};

						CommonUtils.processDataLossConfirmation(fnProcess, oControl, programmingModel);
					});
				}
			}
		});
	}
);
