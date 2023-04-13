sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel'
], function (Controller, JSONModel) {
    return Controller.extend('zms.App', {
        onInit: function () {
            var dateFrom = new Date(),
                dateTo = new Date(),
                oModel = new JSONModel();
            oModel.setData({
                delimiterDRS1: "@",
                dateValueDRS1: dateFrom,
                secondDateValueDRS1: dateTo,
                dateFormatDRS1: "yyyy/MM",
                arr: [
                    {
                        delimiterDRS1: "@",
                        dateValueDRS1: dateFrom,
                        secondDateValueDRS1: dateTo,
                        dateFormatDRS1: "yyyy/MM",
                    }
                ]
            })
            this.getView().setModel(oModel);

            var oControlEvent = new sap.ui.base.Event('11', new sap.ui.base.EventProvider(), {})
            console.log(oControlEvent)
            var x = {
                "sId": "11",
                "oSource": {
                    "mEventRegistry": {}
                },
                "mParameters": {},
                "bCancelBubble": false,
                "bPreventDefault": false
            }
            console.log(oControlEvent.getId())
            console.log(sap.ui.base.Event.getMetadata())
            console.log(oControlEvent.getParameter('x'))
            console.log(oControlEvent.getParameters())
            console.log(oControlEvent.getSource())
        },
        handleChange: function (oControlEvent) {
            console.log(oControlEvent)
            // console.log(oControlEvent.getParameters())
            console.log(oControlEvent.getSource())
            console.log(oControlEvent.getSource().toString())
            console.log(Object.keys(oControlEvent.getSource()))
            console.log(oControlEvent.getSource().getBindingContext())
            console.log(oControlEvent.getSource().getBindingInfo())
            var x = [
                "bAllowTextSelection",
                "mEventRegistry",
                "sId",
                "mProperties",
                "mAggregations",
                "mAssociations",
                "oParent",
                "aDelegates",
                "aBeforeDelegates",
                "iSuppressInvalidate",
                "oPropagatedProperties",
                "mSkipPropagation",
                "_bIsOwnerActive",
                "oModels",
                "aPropagationListeners",
                "oBindingContexts",
                "mElementBindingContexts",
                "mBindingInfos",
                "mObjectBindingInfos",
                "_oContextualSettings",
                "_sOwnerId",
                "_lastValue",
                "bRenderingPhase",
                "_oValueStateMessage",
                "_bIsComposingCharacter",
                "_sLastValueStateText",
                "_bErrorStateShouldBeAnnounced",
                "fnCloseValueStateOnClick",
                "_bIntervalSelection",
                "_bOnlyCalendar",
                "_bValid",
                "_oMinDate",
                "_oMaxDate",
                "_bNeedsRendering",
                "_iInvalidateCalendar",
                "_bShouldClosePicker",
                "_iRenderingDelegateCount",
                "bOutput",
                "_bOnBeforeRenderingPhase",
                "sParentAggregationName",
                "_sUsedDisplayPattern",
                "_sUsedDisplayCalendarType",
                "_oDisplayFormat",
                "_bCheckDomValue",
                "_oInvisibleMessage",
                "aCustomStyleClasses",
                "mCustomStyleClassMap",
                "_sPreviousValue",
                "_bFocusNoPopup",
                "_oPopup",
                "_oCalendar",
                "_oDateRange",
                "_oValueStateHeader",
                "_oCalendarAfterRenderDelegate",
                "_renderedDays",
                "_curpos"
            ]
        }
    })
})