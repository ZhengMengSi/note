/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/Core", "sap/ui/core/service/Service", "sap/ui/core/service/ServiceFactory", "sap/ui/VersionInfo", "../converters/MetaModelConverter"], function (Core, Service, ServiceFactory, VersionInfo, MetaModelConverter) {
  "use strict";

  var _exports = {};
  var DefaultEnvironmentCapabilities = MetaModelConverter.DefaultEnvironmentCapabilities;

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var EnvironmentCapabilitiesService = /*#__PURE__*/function (_Service) {
    _inheritsLoose(EnvironmentCapabilitiesService, _Service);

    function EnvironmentCapabilitiesService() {
      return _Service.apply(this, arguments) || this;
    }

    _exports.EnvironmentCapabilitiesService = EnvironmentCapabilitiesService;
    var _proto = EnvironmentCapabilitiesService.prototype;

    // !: means that we know it will be assigned before usage
    _proto.init = function init() {
      var _this = this;

      this.initPromise = new Promise(function (resolve, reject) {
        _this.resolveFn = resolve;
        _this.rejectFn = reject;
      });
      var oContext = this.getContext();
      this.environmentCapabilities = Object.assign({}, DefaultEnvironmentCapabilities);
      VersionInfo.load().then(function (versionInfo) {
        _this.environmentCapabilities.Chart = !!versionInfo.libraries.find(function (lib) {
          return lib.name === "sap.viz";
        });
        _this.environmentCapabilities.MicroChart = !!versionInfo.libraries.find(function (lib) {
          return lib.name === "sap.suite.ui.microchart";
        });
        _this.environmentCapabilities.UShell = !!(sap && sap.ushell && sap.ushell.Container);
        _this.environmentCapabilities.IntentBasedNavigation = !!(sap && sap.ushell && sap.ushell.Container);
        _this.environmentCapabilities = Object.assign(_this.environmentCapabilities, oContext.settings);

        _this.resolveFn(_this);
      }).catch(this.rejectFn);
    };

    _proto.resolveLibrary = function resolveLibrary(libraryName) {
      return new Promise(function (resolve) {
        try {
          Core.loadLibrary("".concat(libraryName.replace(/\./g, "/")), {
            async: true
          }).then(function () {
            resolve(true);
          }).catch(function () {
            resolve(false);
          });
        } catch (e) {
          resolve(false);
        }
      });
    };

    _proto.setCapabilities = function setCapabilities(oCapabilities) {
      this.environmentCapabilities = oCapabilities;
    };

    _proto.setCapability = function setCapability(capability, value) {
      this.environmentCapabilities[capability] = value;
    };

    _proto.getCapabilities = function getCapabilities() {
      return this.environmentCapabilities;
    };

    _proto.getInterface = function getInterface() {
      return this;
    };

    return EnvironmentCapabilitiesService;
  }(Service);

  _exports.EnvironmentCapabilitiesService = EnvironmentCapabilitiesService;

  var EnvironmentServiceFactory = /*#__PURE__*/function (_ServiceFactory) {
    _inheritsLoose(EnvironmentServiceFactory, _ServiceFactory);

    function EnvironmentServiceFactory() {
      return _ServiceFactory.apply(this, arguments) || this;
    }

    var _proto2 = EnvironmentServiceFactory.prototype;

    _proto2.createInstance = function createInstance(oServiceContext) {
      var environmentCapabilitiesService = new EnvironmentCapabilitiesService(oServiceContext);
      return environmentCapabilitiesService.initPromise;
    };

    return EnvironmentServiceFactory;
  }(ServiceFactory);

  return EnvironmentServiceFactory;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJFbnZpcm9ubWVudENhcGFiaWxpdGllc1NlcnZpY2UiLCJpbml0IiwiaW5pdFByb21pc2UiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInJlc29sdmVGbiIsInJlamVjdEZuIiwib0NvbnRleHQiLCJnZXRDb250ZXh0IiwiZW52aXJvbm1lbnRDYXBhYmlsaXRpZXMiLCJPYmplY3QiLCJhc3NpZ24iLCJEZWZhdWx0RW52aXJvbm1lbnRDYXBhYmlsaXRpZXMiLCJWZXJzaW9uSW5mbyIsImxvYWQiLCJ0aGVuIiwidmVyc2lvbkluZm8iLCJDaGFydCIsImxpYnJhcmllcyIsImZpbmQiLCJsaWIiLCJuYW1lIiwiTWljcm9DaGFydCIsIlVTaGVsbCIsInNhcCIsInVzaGVsbCIsIkNvbnRhaW5lciIsIkludGVudEJhc2VkTmF2aWdhdGlvbiIsInNldHRpbmdzIiwiY2F0Y2giLCJyZXNvbHZlTGlicmFyeSIsImxpYnJhcnlOYW1lIiwiQ29yZSIsImxvYWRMaWJyYXJ5IiwicmVwbGFjZSIsImFzeW5jIiwiZSIsInNldENhcGFiaWxpdGllcyIsIm9DYXBhYmlsaXRpZXMiLCJzZXRDYXBhYmlsaXR5IiwiY2FwYWJpbGl0eSIsInZhbHVlIiwiZ2V0Q2FwYWJpbGl0aWVzIiwiZ2V0SW50ZXJmYWNlIiwiU2VydmljZSIsIkVudmlyb25tZW50U2VydmljZUZhY3RvcnkiLCJjcmVhdGVJbnN0YW5jZSIsIm9TZXJ2aWNlQ29udGV4dCIsImVudmlyb25tZW50Q2FwYWJpbGl0aWVzU2VydmljZSIsIlNlcnZpY2VGYWN0b3J5Il0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJFbnZpcm9ubWVudFNlcnZpY2VGYWN0b3J5LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb3JlIGZyb20gXCJzYXAvdWkvY29yZS9Db3JlXCI7XG5pbXBvcnQgU2VydmljZSBmcm9tIFwic2FwL3VpL2NvcmUvc2VydmljZS9TZXJ2aWNlXCI7XG5pbXBvcnQgU2VydmljZUZhY3RvcnkgZnJvbSBcInNhcC91aS9jb3JlL3NlcnZpY2UvU2VydmljZUZhY3RvcnlcIjtcbmltcG9ydCBWZXJzaW9uSW5mbyBmcm9tIFwic2FwL3VpL1ZlcnNpb25JbmZvXCI7XG5pbXBvcnQgdHlwZSB7IFNlcnZpY2VDb250ZXh0IH0gZnJvbSBcInR5cGVzL2V4dGVuc2lvbl90eXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBFbnZpcm9ubWVudENhcGFiaWxpdGllcyB9IGZyb20gXCIuLi9jb252ZXJ0ZXJzL01ldGFNb2RlbENvbnZlcnRlclwiO1xuaW1wb3J0IHsgRGVmYXVsdEVudmlyb25tZW50Q2FwYWJpbGl0aWVzIH0gZnJvbSBcIi4uL2NvbnZlcnRlcnMvTWV0YU1vZGVsQ29udmVydGVyXCI7XG5cbmV4cG9ydCBjbGFzcyBFbnZpcm9ubWVudENhcGFiaWxpdGllc1NlcnZpY2UgZXh0ZW5kcyBTZXJ2aWNlPEVudmlyb25tZW50Q2FwYWJpbGl0aWVzPiB7XG5cdHJlc29sdmVGbjogYW55O1xuXHRyZWplY3RGbjogYW55O1xuXHRpbml0UHJvbWlzZSE6IFByb21pc2U8YW55Pjtcblx0ZW52aXJvbm1lbnRDYXBhYmlsaXRpZXMhOiBFbnZpcm9ubWVudENhcGFiaWxpdGllcztcblx0Ly8gITogbWVhbnMgdGhhdCB3ZSBrbm93IGl0IHdpbGwgYmUgYXNzaWduZWQgYmVmb3JlIHVzYWdlXG5cblx0aW5pdCgpIHtcblx0XHR0aGlzLmluaXRQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0dGhpcy5yZXNvbHZlRm4gPSByZXNvbHZlO1xuXHRcdFx0dGhpcy5yZWplY3RGbiA9IHJlamVjdDtcblx0XHR9KTtcblx0XHRjb25zdCBvQ29udGV4dCA9IHRoaXMuZ2V0Q29udGV4dCgpO1xuXHRcdHRoaXMuZW52aXJvbm1lbnRDYXBhYmlsaXRpZXMgPSBPYmplY3QuYXNzaWduKHt9LCBEZWZhdWx0RW52aXJvbm1lbnRDYXBhYmlsaXRpZXMpO1xuXHRcdFZlcnNpb25JbmZvLmxvYWQoKVxuXHRcdFx0LnRoZW4oKHZlcnNpb25JbmZvOiBhbnkpID0+IHtcblx0XHRcdFx0dGhpcy5lbnZpcm9ubWVudENhcGFiaWxpdGllcy5DaGFydCA9ICEhdmVyc2lvbkluZm8ubGlicmFyaWVzLmZpbmQoKGxpYjogYW55KSA9PiBsaWIubmFtZSA9PT0gXCJzYXAudml6XCIpO1xuXHRcdFx0XHR0aGlzLmVudmlyb25tZW50Q2FwYWJpbGl0aWVzLk1pY3JvQ2hhcnQgPSAhIXZlcnNpb25JbmZvLmxpYnJhcmllcy5maW5kKFxuXHRcdFx0XHRcdChsaWI6IGFueSkgPT4gbGliLm5hbWUgPT09IFwic2FwLnN1aXRlLnVpLm1pY3JvY2hhcnRcIlxuXHRcdFx0XHQpO1xuXHRcdFx0XHR0aGlzLmVudmlyb25tZW50Q2FwYWJpbGl0aWVzLlVTaGVsbCA9ICEhKHNhcCAmJiBzYXAudXNoZWxsICYmIHNhcC51c2hlbGwuQ29udGFpbmVyKTtcblx0XHRcdFx0dGhpcy5lbnZpcm9ubWVudENhcGFiaWxpdGllcy5JbnRlbnRCYXNlZE5hdmlnYXRpb24gPSAhIShzYXAgJiYgc2FwLnVzaGVsbCAmJiBzYXAudXNoZWxsLkNvbnRhaW5lcik7XG5cdFx0XHRcdHRoaXMuZW52aXJvbm1lbnRDYXBhYmlsaXRpZXMgPSBPYmplY3QuYXNzaWduKHRoaXMuZW52aXJvbm1lbnRDYXBhYmlsaXRpZXMsIG9Db250ZXh0LnNldHRpbmdzKTtcblx0XHRcdFx0dGhpcy5yZXNvbHZlRm4odGhpcyk7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKHRoaXMucmVqZWN0Rm4pO1xuXHR9XG5cblx0cmVzb2x2ZUxpYnJhcnkobGlicmFyeU5hbWU6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0Q29yZS5sb2FkTGlicmFyeShgJHtsaWJyYXJ5TmFtZS5yZXBsYWNlKC9cXC4vZywgXCIvXCIpfWAsIHsgYXN5bmM6IHRydWUgfSlcblx0XHRcdFx0XHQudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKHRydWUpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmNhdGNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdHJlc29sdmUoZmFsc2UpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRyZXNvbHZlKGZhbHNlKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdHB1YmxpYyBzZXRDYXBhYmlsaXRpZXMob0NhcGFiaWxpdGllczogRW52aXJvbm1lbnRDYXBhYmlsaXRpZXMpIHtcblx0XHR0aGlzLmVudmlyb25tZW50Q2FwYWJpbGl0aWVzID0gb0NhcGFiaWxpdGllcztcblx0fVxuXG5cdHB1YmxpYyBzZXRDYXBhYmlsaXR5KGNhcGFiaWxpdHk6IGtleW9mIEVudmlyb25tZW50Q2FwYWJpbGl0aWVzLCB2YWx1ZTogYm9vbGVhbikge1xuXHRcdHRoaXMuZW52aXJvbm1lbnRDYXBhYmlsaXRpZXNbY2FwYWJpbGl0eV0gPSB2YWx1ZTtcblx0fVxuXG5cdHB1YmxpYyBnZXRDYXBhYmlsaXRpZXMoKSB7XG5cdFx0cmV0dXJuIHRoaXMuZW52aXJvbm1lbnRDYXBhYmlsaXRpZXM7XG5cdH1cblxuXHRnZXRJbnRlcmZhY2UoKTogYW55IHtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxufVxuXG5jbGFzcyBFbnZpcm9ubWVudFNlcnZpY2VGYWN0b3J5IGV4dGVuZHMgU2VydmljZUZhY3Rvcnk8RW52aXJvbm1lbnRDYXBhYmlsaXRpZXM+IHtcblx0Y3JlYXRlSW5zdGFuY2Uob1NlcnZpY2VDb250ZXh0OiBTZXJ2aWNlQ29udGV4dDxFbnZpcm9ubWVudENhcGFiaWxpdGllcz4pIHtcblx0XHRjb25zdCBlbnZpcm9ubWVudENhcGFiaWxpdGllc1NlcnZpY2UgPSBuZXcgRW52aXJvbm1lbnRDYXBhYmlsaXRpZXNTZXJ2aWNlKG9TZXJ2aWNlQ29udGV4dCk7XG5cdFx0cmV0dXJuIGVudmlyb25tZW50Q2FwYWJpbGl0aWVzU2VydmljZS5pbml0UHJvbWlzZTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBFbnZpcm9ubWVudFNlcnZpY2VGYWN0b3J5O1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7OztNQVFhQSw4Qjs7Ozs7Ozs7OztJQUtaO1dBRUFDLEksR0FBQSxnQkFBTztNQUFBOztNQUNOLEtBQUtDLFdBQUwsR0FBbUIsSUFBSUMsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtRQUNuRCxLQUFJLENBQUNDLFNBQUwsR0FBaUJGLE9BQWpCO1FBQ0EsS0FBSSxDQUFDRyxRQUFMLEdBQWdCRixNQUFoQjtNQUNBLENBSGtCLENBQW5CO01BSUEsSUFBTUcsUUFBUSxHQUFHLEtBQUtDLFVBQUwsRUFBakI7TUFDQSxLQUFLQyx1QkFBTCxHQUErQkMsTUFBTSxDQUFDQyxNQUFQLENBQWMsRUFBZCxFQUFrQkMsOEJBQWxCLENBQS9CO01BQ0FDLFdBQVcsQ0FBQ0MsSUFBWixHQUNFQyxJQURGLENBQ08sVUFBQ0MsV0FBRCxFQUFzQjtRQUMzQixLQUFJLENBQUNQLHVCQUFMLENBQTZCUSxLQUE3QixHQUFxQyxDQUFDLENBQUNELFdBQVcsQ0FBQ0UsU0FBWixDQUFzQkMsSUFBdEIsQ0FBMkIsVUFBQ0MsR0FBRDtVQUFBLE9BQWNBLEdBQUcsQ0FBQ0MsSUFBSixLQUFhLFNBQTNCO1FBQUEsQ0FBM0IsQ0FBdkM7UUFDQSxLQUFJLENBQUNaLHVCQUFMLENBQTZCYSxVQUE3QixHQUEwQyxDQUFDLENBQUNOLFdBQVcsQ0FBQ0UsU0FBWixDQUFzQkMsSUFBdEIsQ0FDM0MsVUFBQ0MsR0FBRDtVQUFBLE9BQWNBLEdBQUcsQ0FBQ0MsSUFBSixLQUFhLHlCQUEzQjtRQUFBLENBRDJDLENBQTVDO1FBR0EsS0FBSSxDQUFDWix1QkFBTCxDQUE2QmMsTUFBN0IsR0FBc0MsQ0FBQyxFQUFFQyxHQUFHLElBQUlBLEdBQUcsQ0FBQ0MsTUFBWCxJQUFxQkQsR0FBRyxDQUFDQyxNQUFKLENBQVdDLFNBQWxDLENBQXZDO1FBQ0EsS0FBSSxDQUFDakIsdUJBQUwsQ0FBNkJrQixxQkFBN0IsR0FBcUQsQ0FBQyxFQUFFSCxHQUFHLElBQUlBLEdBQUcsQ0FBQ0MsTUFBWCxJQUFxQkQsR0FBRyxDQUFDQyxNQUFKLENBQVdDLFNBQWxDLENBQXREO1FBQ0EsS0FBSSxDQUFDakIsdUJBQUwsR0FBK0JDLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLEtBQUksQ0FBQ0YsdUJBQW5CLEVBQTRDRixRQUFRLENBQUNxQixRQUFyRCxDQUEvQjs7UUFDQSxLQUFJLENBQUN2QixTQUFMLENBQWUsS0FBZjtNQUNBLENBVkYsRUFXRXdCLEtBWEYsQ0FXUSxLQUFLdkIsUUFYYjtJQVlBLEM7O1dBRUR3QixjLEdBQUEsd0JBQWVDLFdBQWYsRUFBc0Q7TUFDckQsT0FBTyxJQUFJN0IsT0FBSixDQUFZLFVBQVVDLE9BQVYsRUFBbUI7UUFDckMsSUFBSTtVQUNINkIsSUFBSSxDQUFDQyxXQUFMLFdBQW9CRixXQUFXLENBQUNHLE9BQVosQ0FBb0IsS0FBcEIsRUFBMkIsR0FBM0IsQ0FBcEIsR0FBdUQ7WUFBRUMsS0FBSyxFQUFFO1VBQVQsQ0FBdkQsRUFDRXBCLElBREYsQ0FDTyxZQUFZO1lBQ2pCWixPQUFPLENBQUMsSUFBRCxDQUFQO1VBQ0EsQ0FIRixFQUlFMEIsS0FKRixDQUlRLFlBQVk7WUFDbEIxQixPQUFPLENBQUMsS0FBRCxDQUFQO1VBQ0EsQ0FORjtRQU9BLENBUkQsQ0FRRSxPQUFPaUMsQ0FBUCxFQUFVO1VBQ1hqQyxPQUFPLENBQUMsS0FBRCxDQUFQO1FBQ0E7TUFDRCxDQVpNLENBQVA7SUFhQSxDOztXQUVNa0MsZSxHQUFQLHlCQUF1QkMsYUFBdkIsRUFBK0Q7TUFDOUQsS0FBSzdCLHVCQUFMLEdBQStCNkIsYUFBL0I7SUFDQSxDOztXQUVNQyxhLEdBQVAsdUJBQXFCQyxVQUFyQixFQUFnRUMsS0FBaEUsRUFBZ0Y7TUFDL0UsS0FBS2hDLHVCQUFMLENBQTZCK0IsVUFBN0IsSUFBMkNDLEtBQTNDO0lBQ0EsQzs7V0FFTUMsZSxHQUFQLDJCQUF5QjtNQUN4QixPQUFPLEtBQUtqQyx1QkFBWjtJQUNBLEM7O1dBRURrQyxZLEdBQUEsd0JBQW9CO01BQ25CLE9BQU8sSUFBUDtJQUNBLEM7OztJQTFEa0RDLE87Ozs7TUE2RDlDQyx5Qjs7Ozs7Ozs7O1lBQ0xDLGMsR0FBQSx3QkFBZUMsZUFBZixFQUF5RTtNQUN4RSxJQUFNQyw4QkFBOEIsR0FBRyxJQUFJakQsOEJBQUosQ0FBbUNnRCxlQUFuQyxDQUF2QztNQUNBLE9BQU9DLDhCQUE4QixDQUFDL0MsV0FBdEM7SUFDQSxDOzs7SUFKc0NnRCxjOztTQU96QkoseUIifQ==