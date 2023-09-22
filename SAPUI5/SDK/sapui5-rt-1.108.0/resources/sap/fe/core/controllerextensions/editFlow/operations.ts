import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Log from "sap/base/Log";
import ActionRuntime from "sap/fe/core/ActionRuntime";
import CommonUtils from "sap/fe/core/CommonUtils";
import BusyLocker from "sap/fe/core/controllerextensions/BusyLocker";
import messageHandling from "sap/fe/core/controllerextensions/messageHandler/messageHandling";
import FPMHelper from "sap/fe/core/helpers/FPMHelper";
import { generate } from "sap/fe/core/helpers/StableIdHelper";
import FELibrary from "sap/fe/core/library";
import Button from "sap/m/Button";
import Dialog from "sap/m/Dialog";
import MessageBox from "sap/m/MessageBox";
import type Control from "sap/ui/core/Control";
import Core from "sap/ui/core/Core";
import Fragment from "sap/ui/core/Fragment";
import { MessageType } from "sap/ui/core/library";
import Message from "sap/ui/core/message/Message";
import XMLPreprocessor from "sap/ui/core/util/XMLPreprocessor";
import XMLTemplateProcessor from "sap/ui/core/XMLTemplateProcessor";
import JSONModel from "sap/ui/model/json/JSONModel";
import operationsHelper from "../../operationsHelper";
import MessageHandler from "../MessageHandler";

const Constants = FELibrary.Constants,
	InvocationGrouping = FELibrary.InvocationGrouping;
const Action = (MessageBox as any).Action;

/**
 * Calls a bound action for one or multiple contexts.
 *
 * @function
 * @static
 * @name sap.fe.core.actions.operations.callBoundAction
 * @memberof sap.fe.core.actions.operations
 * @param sActionName The name of the action to be called
 * @param contexts Either one context or an array with contexts for which the action is to be be called
 * @param oModel OData Model
 * @param oAppComponent The AppComponent
 * @param [mParameters] Optional, can contain the following attributes:
 * @param [mParameters.parameterValues] A map of action parameter names and provided values
 * @param [mParameters.mBindingParameters] A map of binding parameters that would be part of $select and $expand coming from side effects for bound actions
 * @param [mParameters.additionalSideEffect] Array of property paths to be requested in addition to actual target properties of the side effect
 * @param [mParameters.showActionParameterDialog] If set and if parameters exist the user retrieves a dialog to fill in parameters, if actionParameters are passed they are shown to the user
 * @param [mParameters.label] A human-readable label for the action
 * @param [mParameters.invocationGrouping] Mode how actions are to be called: Changeset to put all action calls into one changeset, Isolated to put them into separate changesets, defaults to Isolated
 * @param [mParameters.onSubmitted] Function which is called once the actions are submitted with an array of promises
 * @param [mParameters.defaultParameters] Can contain default parameters from FLP user defaults
 * @param [mParameters.parentControl] If specified, the dialogs are added as dependent of the parent control
 * @param [mParameters.bGetBoundContext] If specified, the action promise returns the bound context
 * @returns Promise resolves with an array of response objects (TODO: to be changed)
 * @private
 * @ui5-restricted
 */
function callBoundAction(sActionName: string, contexts: any, oModel: any, oAppComponent: object, mParameters: any) {
	if (!contexts || contexts.length === 0) {
		//In Freestyle apps bound actions can have no context
		return Promise.reject("Bound actions always requires at least one context");
	}
	// this method either accepts single context or an array of contexts
	// TODO: Refactor to an unambiguos API
	const isCalledWithArray = Array.isArray(contexts);

	// in case of single context wrap into an array for called methods (esp. callAction)
	mParameters.aContexts = isCalledWithArray ? contexts : [contexts];

	const oMetaModel = oModel.getMetaModel(),
		// Analyzing metaModelPath for action only from first context seems weird, but probably works in all existing szenarios - if several contexts are passed, they probably
		// belong to the same metamodelpath. TODO: Check, whether this can be improved / szenarios with different metaModelPaths might exist
		sActionPath = `${oMetaModel.getMetaPath(mParameters.aContexts[0].getPath())}/${sActionName}`,
		oBoundAction = oMetaModel.createBindingContext(`${sActionPath}/@$ui5.overload/0`);
	mParameters.isCriticalAction = getIsActionCritical(oMetaModel, sActionPath, mParameters.aContexts, oBoundAction);

	// Promise returned by callAction currently is rejected in case of execution for multiple contexts partly failing. This should be changed (some failing contexts do not mean
	// that function did not fulfill its task), but as this is a bigger refactoring, for the time being we need to deal with that at the calling place (i.e. here)
	// => provide the same handler (mapping back from array to single result/error if needed) for resolved/rejected case
	const extractSingleResult = function (result: any) {
		// single action could be resolved or rejected
		if (result[0].status === "fulfilled") {
			return result[0].value;
		} else {
			// In case of dialog cancellation, no array is returned => throw the result.
			// Ideally, differentiating should not be needed here => TODO: Find better solution when separating dialog handling (single object with single result) from backend
			// execution (potentially multiple objects)
			throw result[0].reason || result;
		}
	};

	return callAction(sActionName, oModel, oBoundAction, oAppComponent, mParameters).then(
		(result: any) => {
			if (isCalledWithArray) {
				return result;
			} else {
				return extractSingleResult(result);
			}
		},
		(result: any) => {
			if (isCalledWithArray) {
				throw result;
			} else {
				return extractSingleResult(result);
			}
		}
	);
}
/**
 * Calls an action import.
 *
 * @function
 * @static
 * @name sap.fe.core.actions.operations.callActionImport
 * @memberof sap.fe.core.actions.operations
 * @param sActionName The name of the action import to be called
 * @param oModel An instance of an OData V4 model
 * @param oAppComponent The AppComponent
 * @param [mParameters] Optional, can contain the following attributes:
 * @param [mParameters.parameterValues] A map of action parameter names and provided values
 * @param [mParameters.label] A human-readable label for the action
 * @param [mParameters.showActionParameterDialog] If set and if parameters exist the user retrieves a dialog to fill in parameters, if actionParameters are passed they are shown to the user
 * @param [mParameters.onSubmitted] Function which is called once the actions are submitted with an array of promises
 * @param [mParameters.defaultParameters] Can contain default parameters from FLP user defaults
 * @returns Promise resolves with an array of response objects (TODO: to be changed)
 * @private
 * @ui5-restricted
 */
function callActionImport(sActionName: string, oModel: any, oAppComponent: object, mParameters: any) {
	if (!oModel) {
		return Promise.reject("Action expects a model/context for execution");
	}
	const oMetaModel = oModel.getMetaModel(),
		sActionPath = oModel.bindContext(`/${sActionName}`).getPath(),
		oActionImport = oMetaModel.createBindingContext(`/${oMetaModel.createBindingContext(sActionPath).getObject("$Action")}/0`);
	mParameters.isCriticalAction = getIsActionCritical(oMetaModel, `${sActionPath}/@$ui5.overload`);
	return callAction(sActionName, oModel, oActionImport, oAppComponent, mParameters);
}
function callBoundFunction(sFunctionName: string, context: any, oModel: any) {
	if (!context) {
		return Promise.reject("Bound functions always requires a context");
	}
	const oMetaModel = oModel.getMetaModel(),
		sFunctionPath = `${oMetaModel.getMetaPath(context.getPath())}/${sFunctionName}`,
		oBoundFunction = oMetaModel.createBindingContext(sFunctionPath);
	return _executeFunction(sFunctionName, oModel, oBoundFunction, context);
}
/**
 * Calls a function import.
 *
 * @function
 * @static
 * @name sap.fe.core.actions.operations.callFunctionImport
 * @memberof sap.fe.core.actions.operations
 * @param sFunctionName The name of the function to be called
 * @param oModel An instance of an OData v4 model
 * @returns Promise resolves
 * @private
 */
function callFunctionImport(sFunctionName: string, oModel: any) {
	if (!sFunctionName) {
		return Promise.resolve();
	}
	const oMetaModel = oModel.getMetaModel(),
		sFunctionPath = oModel.bindContext(`/${sFunctionName}`).getPath(),
		oFunctionImport = oMetaModel.createBindingContext(`/${oMetaModel.createBindingContext(sFunctionPath).getObject("$Function")}/0`);
	return _executeFunction(sFunctionName, oModel, oFunctionImport);
}
function _executeFunction(sFunctionName: any, oModel: any, oFunction: any, context?: any) {
	let sGroupId;
	if (!oFunction || !oFunction.getObject()) {
		return Promise.reject(new Error(`Function ${sFunctionName} not found`));
	}
	if (context) {
		oFunction = oModel.bindContext(`${sFunctionName}(...)`, context);
		sGroupId = "functionGroup";
	} else {
		oFunction = oModel.bindContext(`/${sFunctionName}(...)`);
		sGroupId = "functionImport";
	}
	const oFunctionPromise = oFunction.execute(sGroupId);
	oModel.submitBatch(sGroupId);
	return oFunctionPromise.then(function () {
		return oFunction.getBoundContext();
	});
}
function callAction(sActionName: any, oModel: any, oAction: any, oAppComponent: any, mParameters: any) {
	return new Promise(async function (resolve: (value: any) => void, reject: (reason?: any) => void) {
		let mActionExecutionParameters: any = {};
		let fnDialog;
		let oActionPromise;
		//let failedActionPromise: any;
		const sActionLabel = mParameters.label;
		const bSkipParameterDialog = mParameters.skipParameterDialog;
		const aContexts = mParameters.aContexts;
		const bIsCreateAction = mParameters.bIsCreateAction;
		const bIsCriticalAction = mParameters.isCriticalAction;
		let oMetaModel;
		let sMetaPath;
		let sMessagesPath: any;
		let iMessageSideEffect;
		let bIsSameEntity;
		let oReturnType;
		let bValuesProvidedForAllParameters;
		const actionDefinition = oAction.getObject();
		if (!oAction || !oAction.getObject()) {
			return reject(new Error(`Action ${sActionName} not found`));
		}

		// Get the parameters of the action
		const aActionParameters = getActionParameters(oAction);

		// Check if the action has parameters and would need a parameter dialog
		// The parameter ResultIsActiveEntity is always hidden in the dialog! Hence if
		// this is the only parameter, this is treated as no parameter here because the
		// dialog would be empty!
		const bActionNeedsParameterDialog =
			aActionParameters.length > 0 && !(aActionParameters.length === 1 && aActionParameters[0].$Name === "ResultIsActiveEntity");

		// Provided values for the action parameters from invokeAction call
		const aParameterValues = mParameters.parameterValues;

		// Determine startup parameters if provided
		const oComponentData = oAppComponent.getComponentData();
		const oStartupParameters = (oComponentData && oComponentData.startupParameters) || {};

		// In case an action parameter is needed, and we shall skip the dialog, check if values are provided for all parameters
		if (bActionNeedsParameterDialog && bSkipParameterDialog) {
			bValuesProvidedForAllParameters = _valuesProvidedForAllParameters(
				bIsCreateAction,
				aActionParameters,
				aParameterValues,
				oStartupParameters
			);
		}

		// Depending on the previously determined data, either set a dialog or leave it empty which
		// will lead to direct execution of the action without a dialog
		fnDialog = null;
		if (bActionNeedsParameterDialog) {
			if (!(bSkipParameterDialog && bValuesProvidedForAllParameters)) {
				fnDialog = showActionParameterDialog;
			}
		} else if (bIsCriticalAction) {
			fnDialog = confirmCriticalAction;
		}

		mActionExecutionParameters = {
			fnOnSubmitted: mParameters.onSubmitted,
			fnOnResponse: mParameters.onResponse,
			actionName: sActionName,
			model: oModel,
			aActionParameters: aActionParameters,
			bGetBoundContext: mParameters.bGetBoundContext,
			defaultValuesExtensionFunction: mParameters.defaultValuesExtensionFunction,
			label: mParameters.label,
			selectedItems: mParameters.selectedItems
		};
		if (oAction.getObject("$IsBound")) {
			if (mParameters.additionalSideEffect && mParameters.additionalSideEffect.pathExpressions) {
				oMetaModel = oModel.getMetaModel();
				sMetaPath = oMetaModel.getMetaPath(aContexts[0].getPath());
				sMessagesPath = oMetaModel.getObject(`${sMetaPath}/@com.sap.vocabularies.Common.v1.Messages/$Path`);

				if (sMessagesPath) {
					iMessageSideEffect = mParameters.additionalSideEffect.pathExpressions.findIndex(function (exp: any) {
						return typeof exp === "string" && exp === sMessagesPath;
					});

					// Add SAP_Messages by default if not annotated by side effects, action does not return a collection and
					// the return type is the same as the bound type
					oReturnType = oAction.getObject("$ReturnType");
					bIsSameEntity =
						oReturnType && !oReturnType.$isCollection && oAction.getModel().getObject(sMetaPath).$Type === oReturnType.$Type;

					if (iMessageSideEffect > -1 || bIsSameEntity) {
						// the message path is annotated as side effect. As there's no binding for it and the model does currently not allow
						// to add it at a later point of time we have to take care it's part of the $select of the POST, therefore moving it.
						mParameters.mBindingParameters = mParameters.mBindingParameters || {};

						if (
							oAction.getObject(`$ReturnType/$Type/${sMessagesPath}`) &&
							(!mParameters.mBindingParameters.$select ||
								mParameters.mBindingParameters.$select.split(",").indexOf(sMessagesPath) === -1)
						) {
							mParameters.mBindingParameters.$select = mParameters.mBindingParameters.$select
								? `${mParameters.mBindingParameters.$select},${sMessagesPath}`
								: sMessagesPath;
							// Add side effects at entity level because $select stops these being returned by the action
							// Only if no other side effects were added for Messages
							if (iMessageSideEffect === -1) {
								mParameters.additionalSideEffect.pathExpressions.push("*");
							}

							if (mParameters.additionalSideEffect.triggerActions.length === 0 && iMessageSideEffect > -1) {
								// no trigger action therefore no need to request messages again
								mParameters.additionalSideEffect.pathExpressions.splice(iMessageSideEffect, 1);
							}
						}
					}
				}
			}

			mActionExecutionParameters.aContexts = aContexts;
			mActionExecutionParameters.mBindingParameters = mParameters.mBindingParameters;
			mActionExecutionParameters.additionalSideEffect = mParameters.additionalSideEffect;
			mActionExecutionParameters.bGrouped = mParameters.invocationGrouping === InvocationGrouping.ChangeSet;
			mActionExecutionParameters.internalModelContext = mParameters.internalModelContext;
			mActionExecutionParameters.operationAvailableMap = mParameters.operationAvailableMap;
			mActionExecutionParameters.isCreateAction = bIsCreateAction;
			mActionExecutionParameters.bObjectPage = mParameters.bObjectPage;
			if (mParameters.controlId) {
				mActionExecutionParameters.control = mParameters.parentControl.byId(mParameters.controlId);
			} else {
				mActionExecutionParameters.control = mParameters.parentControl;
			}
		}
		if (bIsCreateAction) {
			mActionExecutionParameters.bIsCreateAction = bIsCreateAction;
		}
		//check for skipping static actions
		const isStatic = (actionDefinition.$Parameter || []).some((aParameter: any) => {
			return (
				((actionDefinition.$EntitySetPath && actionDefinition.$EntitySetPath === aParameter.$Name) || actionDefinition.$IsBound) &&
				aParameter.$isCollection
			);
		});
		mActionExecutionParameters.isStatic = isStatic;
		if (fnDialog) {
			oActionPromise = fnDialog(
				sActionName,
				oAppComponent,
				sActionLabel,
				mActionExecutionParameters,
				aActionParameters,
				aParameterValues,
				oAction,
				mParameters.parentControl,
				mParameters.entitySetName,
				mParameters.messageHandler
			);
			return oActionPromise
				.then(function (oOperationResult: any) {
					afterActionResolution(mParameters, mActionExecutionParameters, actionDefinition);
					resolve(oOperationResult);
				})
				.catch(function (oOperationResult: any) {
					reject(oOperationResult);
				});
		} else {
			// Take over all provided parameter values and call the action.
			// This shall only happen if values are provided for all the parameters, otherwise the parameter dialog shall be shown which is ensured earlier
			if (aParameterValues) {
				for (const i in mActionExecutionParameters.aActionParameters) {
					mActionExecutionParameters.aActionParameters[i].value = aParameterValues?.find(
						(element: any) => element.name === mActionExecutionParameters.aActionParameters[i].$Name
					)?.value;
				}
			} else if (oStartupParameters) {
				for (const i in mActionExecutionParameters.aActionParameters) {
					mActionExecutionParameters.aActionParameters[i].value =
						oStartupParameters[mActionExecutionParameters.aActionParameters[i].$Name][0];
				}
			}
			let oOperationResult: any;
			try {
				mActionExecutionParameters?.internalModelContext?.setProperty("412Executed", false);
				oOperationResult = await _executeAction(
					oAppComponent,
					mActionExecutionParameters,
					mParameters.parentControl,
					mParameters.messageHandler
				);

				const messages = sap.ui.getCore().getMessageManager().getMessageModel().getData();
				if (
					mActionExecutionParameters.internalModelContext &&
					mActionExecutionParameters.internalModelContext.getProperty("412Executed") &&
					mActionExecutionParameters.internalModelContext.getProperty("strictHandlingFails")?.length
				) {
					mActionExecutionParameters.internalModelContext.setProperty(
						"DelayMessages",
						mActionExecutionParameters.internalModelContext.getProperty("DelayMessages").concat(messages)
					);
				}
				afterActionResolution(mParameters, mActionExecutionParameters, actionDefinition);
				resolve(oOperationResult);
			} catch {
				reject(oOperationResult);
			} finally {
				if (
					mActionExecutionParameters.internalModelContext &&
					mActionExecutionParameters.internalModelContext.getProperty("412Executed") &&
					mActionExecutionParameters.internalModelContext.getProperty("strictHandlingFails")?.length
				) {
					try {
						const strictHandlingFails = mActionExecutionParameters.internalModelContext.getProperty("strictHandlingFails");
						const aFailedContexts = [] as any;
						strictHandlingFails.forEach(function (fail: any) {
							aFailedContexts.push(fail.oAction.getContext());
						});
						mActionExecutionParameters.aContexts = aFailedContexts;
						const oFailedOperationResult = await _executeAction(
							oAppComponent,
							mActionExecutionParameters,
							mParameters.parentControl,
							mParameters.messageHandler
						);
						Core.getMessageManager().addMessages(mActionExecutionParameters.internalModelContext.getProperty("DelayMessages"));
						mActionExecutionParameters.internalModelContext.setProperty("strictHandlingFails", []);
						mActionExecutionParameters.internalModelContext.setProperty("processedMessageIds", []);
						afterActionResolution(mParameters, mActionExecutionParameters, actionDefinition);
						resolve(oFailedOperationResult);
					} catch (oFailedOperationResult) {
						reject(oFailedOperationResult);
					}
				}
				mParameters?.messageHandler?.showMessageDialog();
			}
		}
	});
}
function confirmCriticalAction(
	sActionName: any,
	oAppComponent: any,
	sActionLabel: any,
	mParameters: any,
	aActionParameters: any,
	aParameterValues: any,
	oActionContext: any,
	oParentControl: any,
	entitySetName: any,
	messageHandler: any
) {
	return new Promise<void>((resolve, reject) => {
		let boundActionName = sActionName ? sActionName : null;
		boundActionName =
			boundActionName.indexOf(".") >= 0 ? boundActionName.split(".")[boundActionName.split(".").length - 1] : boundActionName;
		const suffixResourceKey = boundActionName && entitySetName ? `${entitySetName}|${boundActionName}` : "";
		const oResourceBundle = oParentControl.getController().oResourceBundle;
		const sConfirmationText = CommonUtils.getTranslatedText(
			"C_OPERATIONS_ACTION_CONFIRM_MESSAGE",
			oResourceBundle,
			null,
			suffixResourceKey
		);

		MessageBox.confirm(sConfirmationText, {
			onClose: async function (sAction: any) {
				if (sAction === Action.OK) {
					try {
						const oOperation = await _executeAction(oAppComponent, mParameters, oParentControl, messageHandler);
						resolve(oOperation);
					} catch (oError: any) {
						try {
							await messageHandler.showMessageDialog();
							reject(oError);
						} catch (e) {
							reject(oError);
						}
					}
				} else {
					resolve();
				}
			}
		});
	});
}

async function executeAPMAction(
	oAppComponent: any,
	mParameters: any,
	oParentControl: any,
	messageHandler: MessageHandler,
	aContexts: any,
	oDialog: any,
	after412: boolean
) {
	const aResult = await _executeAction(oAppComponent, mParameters, oParentControl, messageHandler);
	// If some entries were successful, and others have failed, the overall process is still successful. However, this was treated as rejection
	// before, and this currently is still kept, as long as dialog handling is mixed with backend process handling.
	// TODO: Refactor to only reject in case of overall process error.
	// For the time being: map to old logic to reject if at least one entry has failed
	if (aResult?.some((oSingleResult: any) => oSingleResult.status === "rejected")) {
		throw aResult;
	}

	const messages = sap.ui.getCore().getMessageManager().getMessageModel().getData();
	if (
		mParameters.internalModelContext &&
		mParameters.internalModelContext.getProperty("412Executed") &&
		mParameters.internalModelContext.getProperty("strictHandlingFails")?.length
	) {
		if (!after412) {
			mParameters.internalModelContext.setProperty(
				"DelayMessages",
				mParameters.internalModelContext.getProperty("DelayMessages").concat(messages)
			);
		} else {
			Core.getMessageManager().addMessages(mParameters.internalModelContext.getProperty("DelayMessages"));
			if (messages.length) {
				// BOUND TRANSITION AS PART OF SAP_MESSAGE
				messageHandler.showMessageDialog({
					onBeforeShowMessage: function (aMessages: any, showMessageParametersIn: any) {
						return actionParameterShowMessageCallback(mParameters, aContexts, oDialog, aMessages, showMessageParametersIn);
					}
				});
			}
		}
	} else if (messages.length) {
		// BOUND TRANSITION AS PART OF SAP_MESSAGE
		messageHandler.showMessageDialog({
			isActionParameterDialogOpen: mParameters?.oDialog.isOpen(),
			onBeforeShowMessage: function (aMessages: any, showMessageParametersIn: any) {
				return actionParameterShowMessageCallback(mParameters, aContexts, oDialog, aMessages, showMessageParametersIn);
			}
		});
	}

	return aResult;
}

function afterActionResolution(mParameters: any, mActionExecutionParameters: any, actionDefinition: any) {
	if (
		mActionExecutionParameters.internalModelContext &&
		mActionExecutionParameters.operationAvailableMap &&
		mActionExecutionParameters.aContexts &&
		mActionExecutionParameters.aContexts.length &&
		actionDefinition.$IsBound
	) {
		//check for skipping static actions
		const isStatic = mActionExecutionParameters.isStatic;
		if (!isStatic) {
			ActionRuntime.setActionEnablement(
				mActionExecutionParameters.internalModelContext,
				JSON.parse(mActionExecutionParameters.operationAvailableMap),
				mParameters.selectedItems,
				"table"
			);
		} else if (mActionExecutionParameters.control) {
			const oControl = mActionExecutionParameters.control;
			if (oControl.isA("sap.ui.mdc.Table")) {
				const aSelectedContexts = oControl.getSelectedContexts();
				ActionRuntime.setActionEnablement(
					mActionExecutionParameters.internalModelContext,
					JSON.parse(mActionExecutionParameters.operationAvailableMap),
					aSelectedContexts,
					"table"
				);
			}
		}
	}
}

function actionParameterShowMessageCallback(
	mParameters: any,
	aContexts: any,
	oDialog: any,
	messages: any,
	showMessageParametersIn: { showMessageBox: boolean; showMessageDialog: boolean }
): { fnGetMessageSubtitle: Function | undefined; showMessageBox: boolean; showMessageDialog: boolean; filteredMessages: any[] } {
	let showMessageBox = showMessageParametersIn.showMessageBox,
		showMessageDialog = showMessageParametersIn.showMessageDialog;
	const oControl = mParameters.control;
	const unboundMessages = messages.filter(function (message: any) {
		return message.getTarget() === "";
	});
	const APDmessages = messages.filter(function (message: any) {
		return (
			message.getTarget &&
			message.getTarget().indexOf(mParameters.actionName) !== -1 &&
			mParameters.aActionParameters.some(function (actionParam: any) {
				return message.getTarget().indexOf(actionParam.$Name) !== -1;
			})
		);
	});
	APDmessages.forEach(function (APDMessage: any) {
		APDMessage.isAPDTarget = true;
	});

	const errorTargetsInAPD = APDmessages.length ? true : false;
	if (oDialog.isOpen() && aContexts.length !== 0 && !mParameters.isStatic) {
		if (!mParameters.bGrouped) {
			//isolated
			if (aContexts.length > 1 || !errorTargetsInAPD) {
				// does not matter if error is in APD or not, if there are multiple contexts selected or if the error is not the APD, we close it.
				// TODO: Dilaog handling should not be part of message handling. Refactor accordingly - dialog should not be needed inside this method - neither
				// to ask whether it's open, nor to close/destroy it!
				oDialog.close();
				oDialog.destroy();
			}
		} else if (!errorTargetsInAPD) {
			//changeset
			oDialog.close();
			oDialog.destroy();
		}
	}
	let filteredMessages: any[] = [];
	const bIsAPDOpen = oDialog.isOpen();
	if (messages.length === 1 && messages[0].getTarget && messages[0].getTarget() !== undefined && messages[0].getTarget() !== "") {
		if ((oControl && oControl.getModel("ui").getProperty("/isEditable") === false) || !oControl) {
			// OP edit or LR
			showMessageBox = !errorTargetsInAPD;
			showMessageDialog = false;
		} else if (oControl && oControl.getModel("ui").getProperty("/isEditable") === true) {
			showMessageBox = false;
			showMessageDialog = false;
		}
	} else if (oControl) {
		if (oControl.getModel("ui").getProperty("/isEditable") === false) {
			if (bIsAPDOpen && errorTargetsInAPD) {
				showMessageDialog = false;
			}
		} else if (oControl.getModel("ui").getProperty("/isEditable") === true) {
			if (!bIsAPDOpen && errorTargetsInAPD) {
				showMessageDialog = true;
				filteredMessages = unboundMessages.concat(APDmessages);
			} else if (!bIsAPDOpen && unboundMessages.length === 0) {
				// error targets in APD => there is atleast one bound message. If there are unbound messages, dialog must be shown.
				// for draft entity, we already closed the APD
				showMessageDialog = false;
			}
		}
	}

	return {
		showMessageBox: showMessageBox,
		showMessageDialog: showMessageDialog,
		filteredMessages: filteredMessages.length ? filteredMessages : messages,
		fnGetMessageSubtitle:
			oControl && oControl.isA("sap.ui.mdc.Table") && messageHandling.setMessageSubtitle.bind({}, oControl, aContexts)
	};
}

/*
 * Currently, this method is responsible for showing the dialog and executing the action. The promise returned is pending while waiting for user input, as well as while the
 * back-end request is running. The promise is rejected when the user cancels the dialog and also when the back-end request fails.
 * TODO: Refactoring: Separate dialog handling from backend processing. Dialog handling should return a Promise resolving to parameters to be provided to backend. If dialog is
 * cancelled, that promise can be rejected. Method responsible for backend processing need to deal with multiple contexts - i.e. it should either return an array of Promises or
 * a Promise resolving to an array. In the latter case, that Promise should be resolved also when some or even all contexts failed in backend - the overall process still was
 * successful.
 *
 */

function showActionParameterDialog(
	sActionName: any,
	oAppComponent: any,
	sActionLabel: any,
	mParameters: any,
	aActionParameters: any,
	aParameterValues: any,
	oActionContext: any,
	oParentControl: any,
	entitySetName: any,
	messageHandler: any
) {
	const sPath = _getPath(oActionContext, sActionName),
		metaModel = oActionContext.getModel().oModel.getMetaModel(),
		entitySetContext = metaModel.createBindingContext(sPath),
		sActionNamePath = oActionContext.getObject("$IsBound")
			? oActionContext.getPath().split("/@$ui5.overload/0")[0]
			: oActionContext.getPath().split("/0")[0],
		actionNameContext = metaModel.createBindingContext(sActionNamePath),
		bIsCreateAction = mParameters.isCreateAction,
		sFragmentName = "sap/fe/core/controls/ActionParameterDialog";
	return new Promise(async function (resolve, reject) {
		const oFragment = XMLTemplateProcessor.loadTemplate(sFragmentName, "fragment");
		const oParameterModel = new JSONModel({
			$displayMode: {}
		});
		let aFieldInvalid: any[] = [];
		let aFormElements: any[] = [];
		const mFieldValueMap: any = {};
		const validateRequiredProperties = async function () {
			const aResults = await Promise.all(
				aFormElements
					.filter(function (oFormElement: any) {
						const oField = oFormElement.getFields()[0];
						return oField.getRequired();
					})
					.map(function (oFormElement: any) {
						const value = oFormElement.getFields()[0].isA("sap.ui.mdc.MultiValueField")
							? oFormElement.getFields()[0].getItems()
							: oFormElement.getFields()[0].getValue();
						if (value === undefined || value === null || value === "" || (Array.isArray(value) && !value.length)) {
							return oFormElement;
						}
					})
			);
			return aResults.filter(function (result: any) {
				return result !== undefined;
			});
		};
		const _validateMessages = function (actionParameters: any, invalidFields: any, bClearTarget?: boolean) {
			const oMessageManager = Core.getMessageManager();
			const aMessages = oMessageManager.getMessageModel().getData();

			invalidFields = invalidFields || [];

			if (!aMessages.length) {
				invalidFields = [];
			}
			actionParameters.forEach(function (oActionParameters: any) {
				const sParameter = oActionParameters.$Name;
				aMessages.forEach(function (oMessage: any) {
					const sParam = sParameter.replace("-inner", "");
					if (
						oMessage.controlIds.length > 0 &&
						(oMessage.getControlId().includes(`APD_::${sParameter}`) ||
							(oMessage.getControlId().includes(`APD_::${sParameter}inner`) && invalidFields.indexOf(`APD_::${sParam}`) < 0))
					) {
						if (bClearTarget) {
							oMessageManager.removeMessages(oMessage);
						} else {
							invalidFields.push(`APD_::${sParam}`);
						}
					}
					// Handle messages related to input with invalid token
					if (oMessage.target.includes(`APD_::${sParameter}`)) {
						invalidFields.push(`APD_::${sParam}`);
						oMessage.target = bClearTarget ? "" : oMessage.target;
						if (bClearTarget) {
							oMessageManager.removeMessages(oMessage);
						}
					}
				});
			});
			return invalidFields;
		};
		const oController = {
			handleChange: function (oEvent: any) {
				messageHandler.removeTransitionMessages();
				const oField = oEvent.getSource();
				const sFieldId = oEvent.getParameter("id");
				const oFieldPromise = oEvent.getParameter("promise");
				if (oFieldPromise) {
					mFieldValueMap[sFieldId] = oFieldPromise.then(function () {
						return oField.getValue();
					});
				}
				_validateMessages(aActionParameters, aFieldInvalid);
			}
		};

		try {
			const createdFragment = await XMLPreprocessor.process(
				oFragment,
				{ name: sFragmentName },
				{
					bindingContexts: {
						action: oActionContext,
						actionName: actionNameContext,
						entitySet: entitySetContext
					},
					models: {
						action: oActionContext.getModel(),
						actionName: actionNameContext.getModel(),
						entitySet: entitySetContext.getModel(),
						metaModel: entitySetContext.getModel()
					}
				}
			);
			// TODO: move the dialog into the fragment and move the handlers to the oController
			const aContexts: any[] = mParameters.aContexts || [];
			const aFunctionParams: any[] = [];
			// eslint-disable-next-line prefer-const
			let oOperationBinding: any;
			await CommonUtils.setUserDefaults(oAppComponent, aActionParameters, oParameterModel, true);
			const oDialogContent = (await Fragment.load({ definition: createdFragment, controller: oController })) as Control;
			const oResourceBundle = oParentControl.getController().oResourceBundle;
			const oDialog = new Dialog(undefined, {
				title: sActionLabel || CommonUtils.getTranslatedText("C_OPERATIONS_ACTION_PARAMETER_DIALOG_TITLE", oResourceBundle),
				content: [oDialogContent],
				escapeHandler: function () {
					// escape handler is meant to possibly suppress or postpone closing the dialog on escape (by calling "reject" on the provided object, or "resolve" only when
					// done with all tasks to happen before dialog can be closed). It's not intended to explicetly close the dialog here (that happens automatically when no
					// escapeHandler is provided or the resolve-calllback is calle) or for own wrap up tasks (like removing validition messages - this should happen in the
					// afterClose).
					// TODO: Move wrap up tasks to afterClose, and remove this method completely. Take care to also adapt end button press handler accordingly.
					oDialog.close();
					messageHandler.removeTransitionMessages();
					reject(Constants.CancelActionDialog);
				},
				beginButton: new Button(generate(["fe", "APD_", sActionName, "Action", "Ok"]), {
					text: bIsCreateAction
						? CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_SAPFE_ACTION_CREATE_BUTTON", oResourceBundle)
						: _getActionParameterActionName(oResourceBundle, sActionLabel, sActionName, entitySetName),
					type: "Emphasized",
					press: async function () {
						try {
							const aEmptyMandatoryFields = await validateRequiredProperties();
							if (aEmptyMandatoryFields.length) {
								for (let i = 0; i < aEmptyMandatoryFields.length; i++) {
									aEmptyMandatoryFields[i].getFields()[0].setValueState("Error");
									aEmptyMandatoryFields[i]
										.getFields()[0]
										.setValueStateText(
											CommonUtils.getTranslatedText(
												"C_OPERATIONS_ACTION_PARAMETER_DIALOG_MISSING_MANDATORY_MSG",
												oResourceBundle,
												aEmptyMandatoryFields[i].getLabel().getText()
											)
										);
								}
								return;
							}

							aFieldInvalid = _validateMessages(aActionParameters, aFieldInvalid);

							if (aFieldInvalid.length > 0) {
								await messageHandling.showUnboundMessages();
								return;
							}
							BusyLocker.lock(oDialog);

							try {
								await Promise.all(
									Object.keys(mFieldValueMap).map(function (sKey: string) {
										return mFieldValueMap[sKey];
									})
								);
								// TODO: due to using the search and value helps on the action dialog transient messages could appear
								// we need an UX design for those to show them to the user - for now remove them before continuing
								messageHandler.removeTransitionMessages();
								// move parameter values from Dialog (SimpleForm) to mParameters.actionParameters so that they are available in the operation bindings for all contexts
								let vParameterValue;
								const oParameterContext = oOperationBinding && oOperationBinding.getParameterContext();
								for (const i in aActionParameters) {
									if (aActionParameters[i].$isCollection) {
										const aMVFContent = oDialog.getModel("mvfview").getProperty(`/${aActionParameters[i].$Name}`),
											aKeyValues = [];
										for (const j in aMVFContent) {
											aKeyValues.push(aMVFContent[j].Key);
										}
										vParameterValue = aKeyValues;
									} else {
										vParameterValue = oParameterContext.getProperty(aActionParameters[i].$Name);
									}
									aActionParameters[i].value = vParameterValue;
									vParameterValue = undefined;
								}
								mParameters.label = sActionLabel;
								try {
									mParameters?.internalModelContext?.setProperty("412Executed", false);
									const aResult = await executeAPMAction(
										oAppComponent,
										mParameters,
										oParentControl,
										messageHandler,
										aContexts,
										oDialog,
										false
									);
									oDialog.close();
									resolve(aResult);
								} catch (oError: any) {
									const messages = sap.ui.getCore().getMessageManager().getMessageModel().getData();
									if (
										mParameters.internalModelContext &&
										mParameters.internalModelContext.getProperty("412Executed") &&
										mParameters.internalModelContext.getProperty("strictHandlingFails")?.length
									) {
										mParameters.internalModelContext.setProperty(
											"DelayMessages",
											mParameters.internalModelContext.getProperty("DelayMessages").concat(messages)
										);
									}
									throw oError;
								} finally {
									if (
										mParameters.internalModelContext &&
										mParameters.internalModelContext.getProperty("412Executed") &&
										mParameters.internalModelContext.getProperty("strictHandlingFails")?.length
									) {
										try {
											const strictHandlingFails = mParameters.internalModelContext.getProperty("strictHandlingFails");
											const aFailedContexts = [] as any;
											strictHandlingFails.forEach(function (fail: any) {
												aFailedContexts.push(fail.oAction.getContext());
											});
											mParameters.aContexts = aFailedContexts;
											const aResult = await executeAPMAction(
												oAppComponent,
												mParameters,
												oParentControl,
												messageHandler,
												aContexts,
												oDialog,
												true
											);

											mParameters.internalModelContext.setProperty("strictHandlingFails", []);
											mParameters.internalModelContext.setProperty("processedMessageIds", []);
											resolve(aResult);
										} catch {
											if (
												mParameters.internalModelContext &&
												mParameters.internalModelContext.getProperty("412Executed") &&
												mParameters.internalModelContext.getProperty("strictHandlingFails")?.length
											) {
												Core.getMessageManager().addMessages(
													mParameters.internalModelContext.getProperty("DelayMessages")
												);
											}
											await messageHandler.showMessageDialog({
												isActionParameterDialogOpen: oDialog.isOpen(),
												onBeforeShowMessage: function (aMessages: any, showMessageParametersIn: any) {
													return actionParameterShowMessageCallback(
														mParameters,
														aContexts,
														oDialog,
														aMessages,
														showMessageParametersIn
													);
												}
											});
										}
									}
									if (BusyLocker.isLocked(oDialog)) {
										BusyLocker.unlock(oDialog);
									}
								}
							} catch (oError: any) {
								let showMessageDialog = true;
								await messageHandler.showMessages({
									context: mParameters.aContexts[0],
									isActionParameterDialogOpen: oDialog.isOpen(),
									messagePageNavigationCallback: function () {
										oDialog.close();
									},
									onBeforeShowMessage: function (aMessages: any, showMessageParametersIn: any) {
										// Why is this implemented as callback? Apparently, all needed information is available beforehand
										// TODO: refactor accordingly
										const showMessageParameters = actionParameterShowMessageCallback(
											mParameters,
											aContexts,
											oDialog,
											aMessages,
											showMessageParametersIn
										);
										showMessageDialog = showMessageParameters.showMessageDialog;
										return showMessageParameters;
									}
								});

								// In case of backend validation error(s?), message shall not be shown in message dialog but next to the field on parameter dialog, which should
								// stay open in this case => in this case, we must not resolve or reject the promise controlling the parameter dialog.
								// In all other cases (e.g. other backend errors or user cancellation), the promise controlling the parameter dialog needs to be rejected to allow
								// callers to react. (Example: If creation in backend after navigation to transient context fails, back navigation needs to be triggered)
								// TODO: Refactor to separate dialog handling from backend request istead of taking decision based on message handling
								if (showMessageDialog) {
									reject(oError);
								}
							}
						} finally {
							if (BusyLocker.isLocked(oDialog)) {
								BusyLocker.unlock(oDialog);
							}
						}
					}
				}),
				endButton: new Button(generate(["fe", "APD_", sActionName, "Action", "Cancel"]), {
					text: CommonUtils.getTranslatedText("C_COMMON_ACTION_PARAMETER_DIALOG_CANCEL", oResourceBundle),
					press: function () {
						// TODO: cancel button should just close the dialog (similar to using escape). All wrap up tasks should be moved to afterClose.
						// Assumption: _validateMessages is only called to remove exisitng validation messages (is user first enters invalid parameter, and later cancels).
						// If this assumption is correct, this needs also to be done when leaving the dialog with escape, i.e. should be moved to afterClose.
						_validateMessages(aActionParameters, aFieldInvalid, true);
						oDialog.close();
						// should not be done here, but after close, as the same should happen when leaving with escape
						messageHandler.removeTransitionMessages();
						reject(Constants.CancelActionDialog);
					}
				}),
				// TODO: beforeOpen is just an event, i.e. not waiting for the Promise to be resolved. Check if tasks of this function need to be done before opening the dialog
				// - if yes, they need to be moved outside.
				// Assumption: Sometimes dialog can be seen without any fields for a short time - maybe this is caused by this asynchronity
				beforeOpen: async function (oEvent: any) {
					// clone event for actionWrapper as oEvent.oSource gets lost during processing of beforeOpen event handler
					const oCloneEvent = Object.assign({}, oEvent);

					messageHandler.removeTransitionMessages();
					const getDefaultValuesFunction = function () {
						const oMetaModel = oDialog.getModel().getMetaModel(),
							sActionPath = oActionContext.sPath && oActionContext.sPath.split("/@")[0],
							sDefaultValuesFunction = oMetaModel.getObject(
								`${sActionPath}@com.sap.vocabularies.Common.v1.DefaultValuesFunction`
							);
						return sDefaultValuesFunction;
					};
					const fnSetDefaultsAndOpenDialog = async function (sBindingParameter?: any) {
						const sBoundFunctionName = getDefaultValuesFunction();
						const prefillParameter = function (sParamName: any, vParamDefaultValue: any) {
							// eslint-disable-next-line promise/param-names
							return new Promise(async function (inResolve) {
								// Case 1: There is a ParameterDefaultValue annotation
								if (vParamDefaultValue !== undefined) {
									if (aContexts.length > 0 && vParamDefaultValue.$Path) {
										try {
											let vParamValue = await CommonUtils.requestSingletonProperty(
												vParamDefaultValue.$Path,
												oOperationBinding.getModel()
											);
											if (vParamValue === null) {
												vParamValue = await oOperationBinding
													.getParameterContext()
													.requestProperty(vParamDefaultValue.$Path);
											}
											if (aContexts.length > 1) {
												// For multi select, need to loop over aContexts (as contexts cannot be retrieved via binding parameter of the operation binding)
												let sPathForContext = vParamDefaultValue.$Path;
												if (sPathForContext.indexOf(`${sBindingParameter}/`) === 0) {
													sPathForContext = sPathForContext.replace(`${sBindingParameter}/`, "");
												}
												for (let i = 1; i < aContexts.length; i++) {
													if (aContexts[i].getProperty(sPathForContext) !== vParamValue) {
														// if the values from the contexts are not all the same, do not prefill
														inResolve({
															paramName: sParamName,
															value: undefined,
															bNoPossibleValue: true
														});
													}
												}
											}
											inResolve({ paramName: sParamName, value: vParamValue });
										} catch (oError) {
											Log.error("Error while reading default action parameter", sParamName, mParameters.actionName);
											inResolve({
												paramName: sParamName,
												value: undefined,
												bLatePropertyError: true
											});
										}
									} else {
										// Case 1.2: ParameterDefaultValue defines a fixed string value (i.e. vParamDefaultValue = 'someString')
										inResolve({ paramName: sParamName, value: vParamDefaultValue });
									}
								} else if (oParameterModel && (oParameterModel as any).oData[sParamName]) {
									// Case 2: There is no ParameterDefaultValue annotation (=> look into the FLP User Defaults)

									inResolve({
										paramName: sParamName,
										value: (oParameterModel as any).oData[sParamName]
									});
								} else {
									inResolve({ paramName: sParamName, value: undefined });
								}
							});
						};

						const getParameterDefaultValue = function (sParamName: any) {
							const oMetaModel = oDialog.getModel().getMetaModel(),
								sActionParameterAnnotationPath = CommonUtils.getParameterPath(oActionContext.getPath(), sParamName) + "@",
								oParameterAnnotations = oMetaModel.getObject(sActionParameterAnnotationPath),
								oParameterDefaultValue =
									oParameterAnnotations && oParameterAnnotations["@com.sap.vocabularies.UI.v1.ParameterDefaultValue"]; // either { $Path: 'somePath' } or 'someString'
							return oParameterDefaultValue;
						};

						const aCurrentParamDefaultValue = [];
						let sParamName, vParameterDefaultValue;
						for (const i in aActionParameters) {
							sParamName = aActionParameters[i].$Name;
							vParameterDefaultValue = getParameterDefaultValue(sParamName);
							aCurrentParamDefaultValue.push(prefillParameter(sParamName, vParameterDefaultValue));
						}

						if (oActionContext.getObject("$IsBound") && aContexts.length > 0) {
							if (sBoundFunctionName && sBoundFunctionName.length > 0 && typeof sBoundFunctionName === "string") {
								for (const i in aContexts) {
									aFunctionParams.push(callBoundFunction(sBoundFunctionName, aContexts[i], mParameters.model));
								}
							}
						}

						const aPrefillParamPromises = Promise.all(aCurrentParamDefaultValue);
						let aExecFunctionPromises: Promise<any[]> = Promise.resolve([]);
						let oExecFunctionFromManifestPromise;
						if (aFunctionParams && aFunctionParams.length > 0) {
							aExecFunctionPromises = Promise.all(aFunctionParams);
						}
						if (mParameters.defaultValuesExtensionFunction) {
							const sModule = mParameters.defaultValuesExtensionFunction
									.substring(0, mParameters.defaultValuesExtensionFunction.lastIndexOf(".") || -1)
									.replace(/\./gi, "/"),
								sFunctionName = mParameters.defaultValuesExtensionFunction.substring(
									mParameters.defaultValuesExtensionFunction.lastIndexOf(".") + 1,
									mParameters.defaultValuesExtensionFunction.length
								);
							oExecFunctionFromManifestPromise = FPMHelper.actionWrapper(oCloneEvent, sModule, sFunctionName, {
								"contexts": aContexts
							});
						}

						try {
							const aPromises = await Promise.all([
								aPrefillParamPromises,
								aExecFunctionPromises,
								oExecFunctionFromManifestPromise
							]);
							const currentParamDefaultValue: any = aPromises[0];
							const functionParams = aPromises[1];
							const oFunctionParamsFromManifest = aPromises[2];
							let sDialogParamName: string;

							// Fill the dialog with the earlier determined parameter values from the different sources
							for (const i in aActionParameters) {
								sDialogParamName = aActionParameters[i].$Name;
								// Parameter values provided in the call of invokeAction overrule other sources
								const vParameterProvidedValue = aParameterValues?.find(
									(element: any) => element.name === aActionParameters[i].$Name
								)?.value;
								if (vParameterProvidedValue) {
									oOperationBinding.setParameter(aActionParameters[i].$Name, vParameterProvidedValue);
								} else if (oFunctionParamsFromManifest && oFunctionParamsFromManifest.hasOwnProperty(sDialogParamName)) {
									oOperationBinding.setParameter(
										aActionParameters[i].$Name,
										oFunctionParamsFromManifest[sDialogParamName]
									);
								} else if (currentParamDefaultValue[i] && currentParamDefaultValue[i].value !== undefined) {
									oOperationBinding.setParameter(aActionParameters[i].$Name, currentParamDefaultValue[i].value);
									// if the default value had not been previously determined due to different contexts, we do nothing else
								} else if (sBoundFunctionName && !currentParamDefaultValue[i].bNoPossibleValue) {
									if (aContexts.length > 1) {
										// we check if the function retrieves the same param value for all the contexts:
										let j = 0;
										while (j < aContexts.length - 1) {
											if (
												functionParams[j] &&
												functionParams[j + 1] &&
												functionParams[j].getObject(sDialogParamName) ===
													functionParams[j + 1].getObject(sDialogParamName)
											) {
												j++;
											} else {
												break;
											}
										}
										//param values are all the same:
										if (j === aContexts.length - 1) {
											oOperationBinding.setParameter(
												aActionParameters[i].$Name,
												functionParams[j].getObject(sDialogParamName)
											);
										}
									} else if (functionParams[0] && functionParams[0].getObject(sDialogParamName)) {
										//Only one context, then the default param values are to be verified from the function:

										oOperationBinding.setParameter(
											aActionParameters[i].$Name,
											functionParams[0].getObject(sDialogParamName)
										);
									}
								}
							}
							const bErrorFound = currentParamDefaultValue.some(function (oValue: any) {
								if (oValue.bLatePropertyError) {
									return oValue.bLatePropertyError;
								}
							});
							// If at least one Default Property is a Late Property and an eTag error was raised.
							if (bErrorFound) {
								const sText = CommonUtils.getTranslatedText("C_APP_COMPONENT_SAPFE_ETAG_LATE_PROPERTY", oResourceBundle);
								MessageBox.warning(sText, { contentWidth: "25em" } as any);
							}
						} catch (oError: any) {
							Log.error("Error while retrieving the parameter", oError);
						}
					};
					const fnAsyncBeforeOpen = async function () {
						if (oActionContext.getObject("$IsBound") && aContexts.length > 0) {
							const aParameters = oActionContext.getObject("$Parameter");
							const sBindingParameter = aParameters[0] && aParameters[0].$Name;

							try {
								const oContextObject = await aContexts[0].requestObject();
								if (oContextObject) {
									oOperationBinding.setParameter(sBindingParameter, oContextObject);
								}
								await fnSetDefaultsAndOpenDialog(sBindingParameter);
							} catch (oError: any) {
								Log.error("Error while retrieving the parameter", oError);
							}
						} else {
							await fnSetDefaultsAndOpenDialog();
						}
					};

					await fnAsyncBeforeOpen();
				},
				afterClose: function () {
					oDialog.destroy();
				}
			});
			mParameters.oDialog = oDialog;
			aFormElements = (oDialogContent as any)
				.getAggregation("form")
				.getAggregation("formContainers")[0]
				.getAggregation("formElements");
			oDialog.setModel(oActionContext.getModel().oModel);
			oDialog.setModel(oParameterModel, "paramsModel");
			oDialog.bindElement({
				path: "/",
				model: "paramsModel"
			});
			// empty model to add elements dynamically depending on number of MVF fields defined on the dialog
			const oMVFModel = new JSONModel({});
			oDialog.setModel(oMVFModel, "mvfview");

			let sActionPath = `${sActionName}(...)`;
			if (!aContexts.length) {
				sActionPath = `/${sActionPath}`;
			}
			oDialog.bindElement({
				path: sActionPath
			});
			if (oParentControl) {
				// if there is a parent control specified add the dialog as dependent
				oParentControl.addDependent(oDialog);
			}
			if (aContexts.length > 0) {
				oDialog.setBindingContext(aContexts[0]); // use context of first selected line item
			}
			oOperationBinding = oDialog.getObjectBinding();
			oDialog.open();
		} catch (oError: any) {
			reject(oError);
		}
	});
}
function getActionParameters(oAction: any) {
	const aParameters = oAction.getObject("$Parameter") || [];
	if (aParameters && aParameters.length) {
		if (oAction.getObject("$IsBound")) {
			//in case of bound actions, ignore the first parameter and consider the rest
			return aParameters.slice(1, aParameters.length) || [];
		}
	}
	return aParameters;
}
function getIsActionCritical(oMetaModel: any, sPath: any, contexts?: any, oBoundAction?: any) {
	const vActionCritical = oMetaModel.getObject(`${sPath}@com.sap.vocabularies.Common.v1.IsActionCritical`);
	let sCriticalPath = vActionCritical && vActionCritical.$Path;
	if (!sCriticalPath) {
		// the static value scenario for isActionCritical
		return !!vActionCritical;
	}
	const aBindingParams = oBoundAction && oBoundAction.getObject("$Parameter"),
		aPaths = sCriticalPath && sCriticalPath.split("/"),
		bCondition =
			aBindingParams && aBindingParams.length && typeof aBindingParams === "object" && sCriticalPath && contexts && contexts.length;
	if (bCondition) {
		//in case binding patameters are there in path need to remove eg: - _it/isVerified => need to remove _it and the path should be isVerified
		aBindingParams.filter(function (oParams: any) {
			const index = aPaths && aPaths.indexOf(oParams.$Name);
			if (index > -1) {
				aPaths.splice(index, 1);
			}
		});
		sCriticalPath = aPaths.join("/");
		return contexts[0].getObject(sCriticalPath);
	} else if (sCriticalPath) {
		//if scenario is path based return the path value
		return contexts[0].getObject(sCriticalPath);
	}
}

function _getActionParameterActionName(oResourceBundle: ResourceBundle, sActionLabel: string, sActionName: string, sEntitySetName: string) {
	let boundActionName: any = sActionName ? sActionName : null;
	const aActionName = boundActionName.split(".");
	boundActionName = boundActionName.indexOf(".") >= 0 ? aActionName[aActionName.length - 1] : boundActionName;
	const suffixResourceKey = boundActionName && sEntitySetName ? `${sEntitySetName}|${boundActionName}` : "";
	const sKey = "ACTION_PARAMETER_DIALOG_ACTION_NAME";
	const bResourceKeyExists =
		oResourceBundle && CommonUtils.checkIfResourceKeyExists((oResourceBundle as any).aCustomBundles, `${sKey}|${suffixResourceKey}`);
	if (sActionLabel) {
		if (bResourceKeyExists) {
			return CommonUtils.getTranslatedText(sKey, oResourceBundle, null, suffixResourceKey);
		} else if (
			oResourceBundle &&
			CommonUtils.checkIfResourceKeyExists((oResourceBundle as any).aCustomBundles, `${sKey}|${sEntitySetName}`)
		) {
			return CommonUtils.getTranslatedText(sKey, oResourceBundle, null, `${sEntitySetName}`);
		} else if (oResourceBundle && CommonUtils.checkIfResourceKeyExists((oResourceBundle as any).aCustomBundles, `${sKey}`)) {
			return CommonUtils.getTranslatedText(sKey, oResourceBundle);
		} else {
			return sActionLabel;
		}
	} else {
		return CommonUtils.getTranslatedText("C_COMMON_DIALOG_OK", oResourceBundle);
	}
}

function handle412FailedTransitions(
	mParameters: any,
	oAction: any,
	sGroupId: string,
	current_context_index: number | null,
	iContextLength: number | null,
	messageHandler: MessageHandler | undefined,
	oResourceBundle: ResourceBundle
) {
	if (mParameters.aContexts.length > 1) {
		let strictHandlingFails: any;
		const messages = sap.ui.getCore().getMessageManager().getMessageModel().getData();
		const processedMessageIds = mParameters.internalModelContext.getProperty("processedMessageIds");
		const transitionMessages = messages.filter(function (message: Message) {
			const isDuplicate = processedMessageIds.find(function (id: string) {
				return message.getId() === id;
			});
			if (!isDuplicate) {
				processedMessageIds.push(message.getId());
				if (message.getType() === MessageType.Success) {
					mParameters.internalModelContext.setProperty(
						"DelayMessages",
						mParameters.internalModelContext.getProperty("DelayMessages").concat(message)
					);
				}
			}
			return message.getPersistent() === true && message.getType() !== MessageType.Success && !isDuplicate;
		});
		mParameters.internalModelContext.setProperty("processedMessageIds", processedMessageIds);
		if (transitionMessages.length) {
			if (mParameters.internalModelContext) {
				strictHandlingFails = mParameters.internalModelContext.getProperty("strictHandlingFails");
				strictHandlingFails.push({
					oAction: oAction,
					groupId: sGroupId
				});
				mParameters.internalModelContext.setProperty("strictHandlingFails", strictHandlingFails);
			}
		}
	}

	if (
		current_context_index === iContextLength &&
		mParameters.internalModelContext &&
		mParameters.internalModelContext.getProperty("412Messages")?.length
	) {
		operationsHelper.renderMessageView(
			mParameters,
			oResourceBundle,
			messageHandler,
			mParameters.internalModelContext.getProperty("412Messages"),
			true
		);
	}
}

function executeDependingOnSelectedContexts(
	oAction: any,
	mParameters: any,
	bGetBoundContext: boolean,
	sGroupId: string,
	oResourceBundle: ResourceBundle,
	messageHandler: MessageHandler | undefined,
	iContextLength: number | null,
	current_context_index: number | null
) {
	let oActionPromise,
		bEnableStrictHandling = true;
	if (bGetBoundContext) {
		const sPath = oAction.getBoundContext().getPath();
		const sMetaPath = oAction.getModel().getMetaModel().getMetaPath(sPath);
		const oProperty = oAction.getModel().getMetaModel().getObject(sMetaPath);
		if (oProperty && oProperty[0]?.$kind !== "Action") {
			//do not enable the strict handling if its not an action
			bEnableStrictHandling = false;
		}
	}

	if (!bEnableStrictHandling) {
		oActionPromise = bGetBoundContext
			? oAction.execute(sGroupId).then(function () {
					return oAction.getBoundContext();
			  })
			: oAction.execute(sGroupId);
	} else {
		oActionPromise = bGetBoundContext
			? oAction
					.execute(
						sGroupId,
						undefined,
						operationsHelper.fnOnStrictHandlingFailed.bind(
							operations,
							sGroupId,
							mParameters,
							oResourceBundle,
							current_context_index,
							oAction.getContext(),
							iContextLength,
							messageHandler
						)
					)
					.then(function () {
						handle412FailedTransitions(
							mParameters,
							oAction,
							sGroupId,
							current_context_index,
							iContextLength,
							messageHandler,
							oResourceBundle
						);
						return Promise.resolve(oAction.getBoundContext());
					})
					.catch(function () {
						handle412FailedTransitions(
							mParameters,
							oAction,
							sGroupId,
							current_context_index,
							iContextLength,
							messageHandler,
							oResourceBundle
						);
						return Promise.reject();
					})
			: oAction
					.execute(
						sGroupId,
						undefined,
						operationsHelper.fnOnStrictHandlingFailed.bind(
							operations,
							sGroupId,
							mParameters,
							oResourceBundle,
							current_context_index,
							oAction.getContext(),
							iContextLength,
							messageHandler
						)
					)
					.then(function (result: any) {
						handle412FailedTransitions(
							mParameters,
							oAction,
							sGroupId,
							current_context_index,
							iContextLength,
							messageHandler,
							oResourceBundle
						);
						return Promise.resolve(result);
					})
					.catch(function () {
						handle412FailedTransitions(
							mParameters,
							oAction,
							sGroupId,
							current_context_index,
							iContextLength,
							messageHandler,
							oResourceBundle
						);
						return Promise.reject();
					});
	}

	return oActionPromise.catch(() => {
		throw Constants.ActionExecutionFailed;
	});
}
function _executeAction(oAppComponent: any, mParameters: any, oParentControl?: any, messageHandler?: MessageHandler) {
	const aContexts = mParameters.aContexts || [];
	const oModel = mParameters.model;
	const aActionParameters = mParameters.aActionParameters || [];
	const sActionName = mParameters.actionName;
	const fnOnSubmitted = mParameters.fnOnSubmitted;
	const fnOnResponse = mParameters.fnOnResponse;
	const oResourceBundle = oParentControl && oParentControl.isA("sap.ui.core.mvc.View") && oParentControl.getController().oResourceBundle;
	let oAction: any;

	function setActionParameterDefaultValue() {
		if (aActionParameters && aActionParameters.length) {
			for (let j = 0; j < aActionParameters.length; j++) {
				if (!aActionParameters[j].value) {
					switch (aActionParameters[j].$Type) {
						case "Edm.String":
							aActionParameters[j].value = "";
							break;
						case "Edm.Boolean":
							aActionParameters[j].value = false;
							break;
						case "Edm.Byte":
						case "Edm.Int16":
						case "Edm.Int32":
						case "Edm.Int64":
							aActionParameters[j].value = 0;
							break;
						// tbc
						default:
							break;
					}
				}
				oAction.setParameter(aActionParameters[j].$Name, aActionParameters[j].value);
			}
		}
	}

	if (aContexts.length) {
		// TODO: refactor to direct use of Promise.allSettled
		return new Promise(function (resolve: (value: any) => void) {
			const mBindingParameters = mParameters.mBindingParameters;
			const bGrouped = mParameters.bGrouped;
			const bGetBoundContext = mParameters.bGetBoundContext;
			if (mParameters.internalModelContext && !mParameters.internalModelContext.getProperty("412Executed")) {
				mParameters.internalModelContext.setProperty("strictHandlingPromises", []);
				mParameters.internalModelContext.setProperty("strictHandlingFails", []);
				mParameters.internalModelContext.setProperty("412Messages", []);
				mParameters.internalModelContext.setProperty("processedMessageIds", []);
				mParameters.internalModelContext.setProperty("DelayMessages", []);
			}
			const aActionPromises: any[] = [];
			let oActionPromise;
			let i;
			let sGroupId: string;
			const fnExecuteAction = function (actionContext: any, current_context_index: any, oSideEffect: any, iContextLength: any) {
				setActionParameterDefaultValue();
				// For invocation grouping "isolated" need batch group per action call
				sGroupId = !bGrouped ? `$auto.${current_context_index}` : actionContext.getUpdateGroupId();
				mParameters.requestSideEffects = fnRequestSideEffects.bind(operations, oAppComponent, oSideEffect, mParameters);
				oActionPromise = executeDependingOnSelectedContexts(
					actionContext,
					mParameters,
					bGetBoundContext,
					sGroupId,
					oResourceBundle,
					messageHandler,
					iContextLength,
					current_context_index
				);
				aActionPromises.push(oActionPromise);
				fnRequestSideEffects(oAppComponent, oSideEffect, mParameters, sGroupId);
			};
			const fnExecuteSingleAction = function (actionContext: any, current_context_index: any, oSideEffect: any, iContextLength: any) {
				// eslint-disable-next-line promise/param-names
				return new Promise<void>((actionResolve) => {
					const aLocalPromise: any = [];
					setActionParameterDefaultValue();
					// For invocation grouping "isolated" need batch group per action call
					sGroupId = `apiMode${current_context_index}`;
					mParameters.requestSideEffects = fnRequestSideEffects.bind(
						operations,
						oAppComponent,
						oSideEffect,
						mParameters,
						sGroupId,
						aLocalPromise
					);
					oActionPromise = executeDependingOnSelectedContexts(
						actionContext,
						mParameters,
						bGetBoundContext,
						sGroupId,
						oResourceBundle,
						messageHandler,
						iContextLength,
						current_context_index
					);
					aActionPromises.push(oActionPromise);
					aLocalPromise.push(oActionPromise);
					fnRequestSideEffects(oAppComponent, oSideEffect, mParameters, sGroupId, aLocalPromise);
					oModel.submitBatch(sGroupId);
					Promise.all(aLocalPromise)
						.then(function () {
							return actionResolve();
						})
						.catch(function () {
							return actionResolve();
						});
				});
			};

			function fnExecuteSequentially(contextsToExecute: any) {
				// One action and its side effects are completed before the next action is executed
				(
					fnOnSubmitted ||
					function noop() {
						/**/
					}
				)(aActionPromises);
				function processOneAction(context: any, actionIndex: any, iContextLength: any) {
					oAction = oModel.bindContext(`${sActionName}(...)`, context, mBindingParameters);
					return fnExecuteSingleAction(
						oAction,
						actionIndex,
						{
							context: context,
							pathExpressions: mParameters.additionalSideEffect && mParameters.additionalSideEffect.pathExpressions,
							triggerActions: mParameters.additionalSideEffect && mParameters.additionalSideEffect.triggerActions
						},
						iContextLength
					);
				}

				let oActionAndSideEffectPromise = Promise.resolve();
				let j = 0;
				contextsToExecute.forEach(function (context: any) {
					const id = ++j;
					oActionAndSideEffectPromise = oActionAndSideEffectPromise.then(function () {
						return processOneAction(context, id, aContexts.length);
					});
				});

				oActionAndSideEffectPromise
					.then(function () {
						fnHandleResults();
					})
					.catch(function (oError: any) {
						Log.error(oError);
					});
			}

			if (!bGrouped) {
				// For invocation grouping "isolated", ensure that each action and matching side effects
				// are processed before the next set is submitted. Workaround until JSON batch is available.
				// Allow also for List Report.
				fnExecuteSequentially(aContexts);
			} else {
				for (i = 0; i < aContexts.length; i++) {
					oAction = oModel.bindContext(`${sActionName}(...)`, aContexts[i], mBindingParameters);
					fnExecuteAction(
						oAction,
						aContexts.length <= 1 ? null : i,
						{
							context: aContexts[i],
							pathExpressions: mParameters.additionalSideEffect && mParameters.additionalSideEffect.pathExpressions,
							triggerActions: mParameters.additionalSideEffect && mParameters.additionalSideEffect.triggerActions
						},
						aContexts.length
					);
				}
				(
					fnOnSubmitted ||
					function noop() {
						/**/
					}
				)(aActionPromises);
				fnHandleResults();
			}

			function fnHandleResults() {
				// Promise.allSettled will never be rejected. However, eslint requires either catch or return - thus we return the resulting Promise although no one will use it.
				return Promise.allSettled(aActionPromises).then(resolve);
			}
		}).finally(function () {
			(
				fnOnResponse ||
				function noop() {
					/**/
				}
			)();
		});
	} else {
		oAction = oModel.bindContext(`/${sActionName}(...)`);
		setActionParameterDefaultValue();
		const sGroupId = "actionImport";
		const oActionPromise = oAction.execute(
			sGroupId,
			undefined,
			operationsHelper.fnOnStrictHandlingFailed.bind(
				operations,
				sGroupId,
				{ label: mParameters.label, model: oModel },
				oResourceBundle,
				null,
				null,
				null,
				messageHandler
			)
		);
		oModel.submitBatch(sGroupId);
		// trigger onSubmitted "event"
		(
			fnOnSubmitted ||
			function noop() {
				/**/
			}
		)(oActionPromise);
		return oActionPromise.finally(function () {
			(
				fnOnResponse ||
				function noop() {
					/**/
				}
			)();
		});
	}
}
function _getPath(oActionContext: any, sActionName: any) {
	let sPath = oActionContext.getPath();
	sPath = oActionContext.getObject("$IsBound") ? sPath.split("@$ui5.overload")[0] : sPath.split("/0")[0];
	return sPath.split(`/${sActionName}`)[0];
}

function _valuesProvidedForAllParameters(
	isCreateAction: boolean,
	actionParameters: Record<string, any>[],
	parameterValues?: Record<string, any>[],
	startupParameters?: any
): boolean {
	if (parameterValues) {
		// If showDialog is false but there are parameters from the invokeAction call, we need to check that values have been
		// provided for all of them
		for (const actionParameter of actionParameters) {
			if (
				actionParameter.$Name !== "ResultIsActiveEntity" &&
				!parameterValues?.find((element: any) => element.name === actionParameter.$Name)
			) {
				// At least for one parameter no value has been provided, so we can't skip the dialog
				return false;
			}
		}
	} else if (isCreateAction && startupParameters) {
		// If parameters have been provided during application launch, we need to check if the set is complete
		// If not, the parameter dialog still needs to be shown.
		for (const actionParameter of actionParameters) {
			if (!startupParameters[actionParameter.$Name]) {
				// At least for one parameter no value has been provided, so we can't skip the dialog
				return false;
			}
		}
	}
	return true;
}

function fnRequestSideEffects(oAppComponent: any, oSideEffect: any, mParameters: any, sGroupId: any, aLocalPromise?: any) {
	const oSideEffectsService = oAppComponent.getSideEffectsService();
	let oLocalPromise;
	// trigger actions from side effects
	if (oSideEffect && oSideEffect.triggerActions && oSideEffect.triggerActions.length) {
		oSideEffect.triggerActions.forEach(function (sTriggerAction: any) {
			if (sTriggerAction) {
				oLocalPromise = oSideEffectsService.executeAction(sTriggerAction, oSideEffect.context, sGroupId);
				if (aLocalPromise) {
					aLocalPromise.push(oLocalPromise);
				}
			}
		});
	}
	// request side effects for this action
	// as we move the messages request to POST $select we need to be prepared for an empty array
	if (oSideEffect && oSideEffect.pathExpressions && oSideEffect.pathExpressions.length > 0) {
		oLocalPromise = oSideEffectsService.requestSideEffects(oSideEffect.pathExpressions, oSideEffect.context, sGroupId);
		if (aLocalPromise) {
			aLocalPromise.push(oLocalPromise);
		}
		oLocalPromise
			.then(function () {
				if (mParameters.operationAvailableMap && mParameters.internalModelContext) {
					ActionRuntime.setActionEnablement(
						mParameters.internalModelContext,
						JSON.parse(mParameters.operationAvailableMap),
						mParameters.selectedItems,
						"table"
					);
				}
			})
			.catch(function (oError: any) {
				Log.error("Error while requesting side effects", oError);
			});
	}
}

/**
 * Static functions to call OData actions (bound/import) and functions (bound/import)
 *
 * @namespace
 * @alias sap.fe.core.actions.operations
 * @private
 * @experimental This module is only for experimental use! <br/><b>This is only a POC and maybe deleted</b>
 * @since 1.56.0
 */
const operations = {
	callBoundAction: callBoundAction,
	callActionImport: callActionImport,
	callBoundFunction: callBoundFunction,
	callFunctionImport: callFunctionImport,
	executeDependingOnSelectedContexts: executeDependingOnSelectedContexts,
	valuesProvidedForAllParameters: _valuesProvidedForAllParameters,
	getActionParameterActionName: _getActionParameterActionName,
	actionParameterShowMessageCallback: actionParameterShowMessageCallback,
	afterActionResolution: afterActionResolution
};

export default operations;
