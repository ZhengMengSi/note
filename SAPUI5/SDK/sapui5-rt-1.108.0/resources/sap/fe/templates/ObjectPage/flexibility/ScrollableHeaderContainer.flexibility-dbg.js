/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/fl/changeHandler/MoveControls"], function (MoveControls) {
  "use strict";

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var ScrollableHeaderContainerFlexibility = {
    moveControls: {
      changeHandler: {
        applyChange: function (change, control, propertyBag) {
          return MoveControls.applyChange(change, control, _objectSpread(_objectSpread({}, propertyBag), {}, {
            sourceAggregation: "content",
            targetAggregation: "content"
          }));
        },
        // all 3 changeHandlers have to be implemented
        // if variant managemant should be relevant for the object page header in future,
        // it might be necessary to override also the revertChange handler
        revertChange: MoveControls.revertChange,
        completeChangeContent: MoveControls.completeChangeContent
      }
    }
  };
  return ScrollableHeaderContainerFlexibility;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJTY3JvbGxhYmxlSGVhZGVyQ29udGFpbmVyRmxleGliaWxpdHkiLCJtb3ZlQ29udHJvbHMiLCJjaGFuZ2VIYW5kbGVyIiwiYXBwbHlDaGFuZ2UiLCJjaGFuZ2UiLCJjb250cm9sIiwicHJvcGVydHlCYWciLCJNb3ZlQ29udHJvbHMiLCJzb3VyY2VBZ2dyZWdhdGlvbiIsInRhcmdldEFnZ3JlZ2F0aW9uIiwicmV2ZXJ0Q2hhbmdlIiwiY29tcGxldGVDaGFuZ2VDb250ZW50Il0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJTY3JvbGxhYmxlSGVhZGVyQ29udGFpbmVyLmZsZXhpYmlsaXR5LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIENvbnRyb2wgZnJvbSBcInNhcC91aS9jb3JlL0NvbnRyb2xcIjtcbmltcG9ydCB0eXBlIENoYW5nZSBmcm9tIFwic2FwL3VpL2ZsL0NoYW5nZVwiO1xuaW1wb3J0IE1vdmVDb250cm9scyBmcm9tIFwic2FwL3VpL2ZsL2NoYW5nZUhhbmRsZXIvTW92ZUNvbnRyb2xzXCI7XG5cbmNvbnN0IFNjcm9sbGFibGVIZWFkZXJDb250YWluZXJGbGV4aWJpbGl0eSA9IHtcblx0bW92ZUNvbnRyb2xzOiB7XG5cdFx0Y2hhbmdlSGFuZGxlcjoge1xuXHRcdFx0YXBwbHlDaGFuZ2U6IGZ1bmN0aW9uIChjaGFuZ2U6IENoYW5nZSwgY29udHJvbDogQ29udHJvbCwgcHJvcGVydHlCYWc6IG9iamVjdCkge1xuXHRcdFx0XHRyZXR1cm4gTW92ZUNvbnRyb2xzLmFwcGx5Q2hhbmdlKGNoYW5nZSwgY29udHJvbCwge1xuXHRcdFx0XHRcdC4uLnByb3BlcnR5QmFnLFxuXHRcdFx0XHRcdHNvdXJjZUFnZ3JlZ2F0aW9uOiBcImNvbnRlbnRcIixcblx0XHRcdFx0XHR0YXJnZXRBZ2dyZWdhdGlvbjogXCJjb250ZW50XCJcblx0XHRcdFx0fSk7XG5cdFx0XHR9LFxuXHRcdFx0Ly8gYWxsIDMgY2hhbmdlSGFuZGxlcnMgaGF2ZSB0byBiZSBpbXBsZW1lbnRlZFxuXHRcdFx0Ly8gaWYgdmFyaWFudCBtYW5hZ2VtYW50IHNob3VsZCBiZSByZWxldmFudCBmb3IgdGhlIG9iamVjdCBwYWdlIGhlYWRlciBpbiBmdXR1cmUsXG5cdFx0XHQvLyBpdCBtaWdodCBiZSBuZWNlc3NhcnkgdG8gb3ZlcnJpZGUgYWxzbyB0aGUgcmV2ZXJ0Q2hhbmdlIGhhbmRsZXJcblx0XHRcdHJldmVydENoYW5nZTogTW92ZUNvbnRyb2xzLnJldmVydENoYW5nZSxcblx0XHRcdGNvbXBsZXRlQ2hhbmdlQ29udGVudDogTW92ZUNvbnRyb2xzLmNvbXBsZXRlQ2hhbmdlQ29udGVudFxuXHRcdH1cblx0fVxufTtcbmV4cG9ydCBkZWZhdWx0IFNjcm9sbGFibGVIZWFkZXJDb250YWluZXJGbGV4aWJpbGl0eTtcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7OztFQUlBLElBQU1BLG9DQUFvQyxHQUFHO0lBQzVDQyxZQUFZLEVBQUU7TUFDYkMsYUFBYSxFQUFFO1FBQ2RDLFdBQVcsRUFBRSxVQUFVQyxNQUFWLEVBQTBCQyxPQUExQixFQUE0Q0MsV0FBNUMsRUFBaUU7VUFDN0UsT0FBT0MsWUFBWSxDQUFDSixXQUFiLENBQXlCQyxNQUF6QixFQUFpQ0MsT0FBakMsa0NBQ0hDLFdBREc7WUFFTkUsaUJBQWlCLEVBQUUsU0FGYjtZQUdOQyxpQkFBaUIsRUFBRTtVQUhiLEdBQVA7UUFLQSxDQVBhO1FBUWQ7UUFDQTtRQUNBO1FBQ0FDLFlBQVksRUFBRUgsWUFBWSxDQUFDRyxZQVhiO1FBWWRDLHFCQUFxQixFQUFFSixZQUFZLENBQUNJO01BWnRCO0lBREY7RUFEOEIsQ0FBN0M7U0FrQmVYLG9DIn0=