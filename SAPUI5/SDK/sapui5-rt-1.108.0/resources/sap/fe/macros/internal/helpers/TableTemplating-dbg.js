/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/helpers/BindingToolkit"], function (BindingToolkit) {
  "use strict";

  var _exports = {};
  var resolveBindingString = BindingToolkit.resolveBindingString;
  var not = BindingToolkit.not;
  var equal = BindingToolkit.equal;
  var constant = BindingToolkit.constant;
  var compileExpression = BindingToolkit.compileExpression;
  var and = BindingToolkit.and;

  /**
   * Method to compute the headerVisible property.
   *
   * @param oProps Object containing the table properties
   * @returns Expression binding for headerVisible
   */
  var buildExpressionForHeaderVisible = function (oProps) {
    var headerBindingExpression = resolveBindingString(oProps === null || oProps === void 0 ? void 0 : oProps.header);
    var tabTileBindingExpression = resolveBindingString(oProps === null || oProps === void 0 ? void 0 : oProps.tabTitle);
    var headerVisibleBindingExpression = constant(oProps.headerVisible);
    return compileExpression(and(headerVisibleBindingExpression, not(equal(headerBindingExpression, tabTileBindingExpression))));
  };

  _exports.buildExpressionForHeaderVisible = buildExpressionForHeaderVisible;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJidWlsZEV4cHJlc3Npb25Gb3JIZWFkZXJWaXNpYmxlIiwib1Byb3BzIiwiaGVhZGVyQmluZGluZ0V4cHJlc3Npb24iLCJyZXNvbHZlQmluZGluZ1N0cmluZyIsImhlYWRlciIsInRhYlRpbGVCaW5kaW5nRXhwcmVzc2lvbiIsInRhYlRpdGxlIiwiaGVhZGVyVmlzaWJsZUJpbmRpbmdFeHByZXNzaW9uIiwiY29uc3RhbnQiLCJoZWFkZXJWaXNpYmxlIiwiY29tcGlsZUV4cHJlc3Npb24iLCJhbmQiLCJub3QiLCJlcXVhbCJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiVGFibGVUZW1wbGF0aW5nLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQ29tcGlsZWRCaW5kaW5nVG9vbGtpdEV4cHJlc3Npb24gfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9CaW5kaW5nVG9vbGtpdFwiO1xuaW1wb3J0IHsgYW5kLCBjb21waWxlRXhwcmVzc2lvbiwgY29uc3RhbnQsIGVxdWFsLCBub3QsIHJlc29sdmVCaW5kaW5nU3RyaW5nIH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQmluZGluZ1Rvb2xraXRcIjtcblxuLyoqXG4gKiBNZXRob2QgdG8gY29tcHV0ZSB0aGUgaGVhZGVyVmlzaWJsZSBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0gb1Byb3BzIE9iamVjdCBjb250YWluaW5nIHRoZSB0YWJsZSBwcm9wZXJ0aWVzXG4gKiBAcmV0dXJucyBFeHByZXNzaW9uIGJpbmRpbmcgZm9yIGhlYWRlclZpc2libGVcbiAqL1xuZXhwb3J0IGNvbnN0IGJ1aWxkRXhwcmVzc2lvbkZvckhlYWRlclZpc2libGUgPSAob1Byb3BzOiBhbnkpOiBDb21waWxlZEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbiA9PiB7XG5cdGNvbnN0IGhlYWRlckJpbmRpbmdFeHByZXNzaW9uID0gcmVzb2x2ZUJpbmRpbmdTdHJpbmcob1Byb3BzPy5oZWFkZXIpO1xuXHRjb25zdCB0YWJUaWxlQmluZGluZ0V4cHJlc3Npb24gPSByZXNvbHZlQmluZGluZ1N0cmluZyhvUHJvcHM/LnRhYlRpdGxlKTtcblx0Y29uc3QgaGVhZGVyVmlzaWJsZUJpbmRpbmdFeHByZXNzaW9uID0gY29uc3RhbnQob1Byb3BzLmhlYWRlclZpc2libGUpO1xuXHRyZXR1cm4gY29tcGlsZUV4cHJlc3Npb24oYW5kKGhlYWRlclZpc2libGVCaW5kaW5nRXhwcmVzc2lvbiwgbm90KGVxdWFsKGhlYWRlckJpbmRpbmdFeHByZXNzaW9uLCB0YWJUaWxlQmluZGluZ0V4cHJlc3Npb24pKSkpO1xufTtcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7O0VBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0VBQ08sSUFBTUEsK0JBQStCLEdBQUcsVUFBQ0MsTUFBRCxFQUFtRDtJQUNqRyxJQUFNQyx1QkFBdUIsR0FBR0Msb0JBQW9CLENBQUNGLE1BQUQsYUFBQ0EsTUFBRCx1QkFBQ0EsTUFBTSxDQUFFRyxNQUFULENBQXBEO0lBQ0EsSUFBTUMsd0JBQXdCLEdBQUdGLG9CQUFvQixDQUFDRixNQUFELGFBQUNBLE1BQUQsdUJBQUNBLE1BQU0sQ0FBRUssUUFBVCxDQUFyRDtJQUNBLElBQU1DLDhCQUE4QixHQUFHQyxRQUFRLENBQUNQLE1BQU0sQ0FBQ1EsYUFBUixDQUEvQztJQUNBLE9BQU9DLGlCQUFpQixDQUFDQyxHQUFHLENBQUNKLDhCQUFELEVBQWlDSyxHQUFHLENBQUNDLEtBQUssQ0FBQ1gsdUJBQUQsRUFBMEJHLHdCQUExQixDQUFOLENBQXBDLENBQUosQ0FBeEI7RUFDQSxDQUxNIn0=