/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([], function () {
  "use strict";

  var _exports = {};

  var requireDependencies = function (dependencyNames) {
    try {
      var resolveFn;
      var awaiter = new Promise(function (resolve) {
        resolveFn = resolve;
      });

      if (dependencyNames.length > 0) {
        sap.ui.require(dependencyNames, function () {
          for (var _len = arguments.length, dependencies = new Array(_len), _key = 0; _key < _len; _key++) {
            dependencies[_key] = arguments[_key];
          }

          resolveFn(dependencies);
        });
      } else {
        resolveFn([]);
      }

      return Promise.resolve(awaiter);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _exports.requireDependencies = requireDependencies;

  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJyZXF1aXJlRGVwZW5kZW5jaWVzIiwiZGVwZW5kZW5jeU5hbWVzIiwicmVzb2x2ZUZuIiwiYXdhaXRlciIsIlByb21pc2UiLCJyZXNvbHZlIiwibGVuZ3RoIiwic2FwIiwidWkiLCJyZXF1aXJlIiwiZGVwZW5kZW5jaWVzIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJMb2FkZXJVdGlscy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVxdWlyZURlcGVuZGVuY2llcyhkZXBlbmRlbmN5TmFtZXM6IHN0cmluZ1tdKTogUHJvbWlzZTxhbnlbXT4ge1xuXHRsZXQgcmVzb2x2ZUZuITogRnVuY3Rpb247XG5cdGNvbnN0IGF3YWl0ZXIgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuXHRcdHJlc29sdmVGbiA9IHJlc29sdmU7XG5cdH0pO1xuXHRpZiAoZGVwZW5kZW5jeU5hbWVzLmxlbmd0aCA+IDApIHtcblx0XHRzYXAudWkucmVxdWlyZShkZXBlbmRlbmN5TmFtZXMsICguLi5kZXBlbmRlbmNpZXM6IGFueVtdKSA9PiB7XG5cdFx0XHRyZXNvbHZlRm4oZGVwZW5kZW5jaWVzKTtcblx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHRyZXNvbHZlRm4oW10pO1xuXHR9XG5cdHJldHVybiBhd2FpdGVyIGFzIFByb21pc2U8YW55W10+O1xufVxuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7TUFBc0JBLG1CLGFBQW9CQyxlO1FBQTJDO01BQ3BGLElBQUlDLFNBQUo7TUFDQSxJQUFNQyxPQUFPLEdBQUcsSUFBSUMsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBYTtRQUN4Q0gsU0FBUyxHQUFHRyxPQUFaO01BQ0EsQ0FGZSxDQUFoQjs7TUFHQSxJQUFJSixlQUFlLENBQUNLLE1BQWhCLEdBQXlCLENBQTdCLEVBQWdDO1FBQy9CQyxHQUFHLENBQUNDLEVBQUosQ0FBT0MsT0FBUCxDQUFlUixlQUFmLEVBQWdDLFlBQTRCO1VBQUEsa0NBQXhCUyxZQUF3QjtZQUF4QkEsWUFBd0I7VUFBQTs7VUFDM0RSLFNBQVMsQ0FBQ1EsWUFBRCxDQUFUO1FBQ0EsQ0FGRDtNQUdBLENBSkQsTUFJTztRQUNOUixTQUFTLENBQUMsRUFBRCxDQUFUO01BQ0E7O01BQ0QsdUJBQU9DLE9BQVA7SUFDQSxDIn0=