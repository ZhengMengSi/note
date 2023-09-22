/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/formatters/FPMFormatter", "sap/fe/core/formatters/StandardFormatter", "sap/fe/core/formatters/ValueFormatter", "sap/fe/core/services/AsyncComponentServiceFactory", "sap/fe/core/services/CacheHandlerServiceFactory", "sap/fe/core/services/EnvironmentServiceFactory", "sap/fe/core/services/NavigationServiceFactory", "sap/fe/core/services/ResourceModelServiceFactory", "sap/fe/core/services/RoutingServiceFactory", "sap/fe/core/services/ShellServicesFactory", "sap/fe/core/services/SideEffectsServiceFactory", "sap/fe/core/services/TemplatedViewServiceFactory", "sap/fe/core/type/DateTimeWithTimezone", "sap/fe/core/type/Email", "sap/fe/navigation/library", "sap/fe/placeholder/library", "sap/ui/base/DataType", "sap/ui/core/Core", "sap/ui/core/library", "sap/ui/core/service/ServiceFactoryRegistry", "sap/ui/fl/library", "sap/ui/mdc/library"], function (Log, _FPMFormatter, _StandardFormatter, _ValueFormatter, AsyncComponentServiceFactory, CacheHandlerServiceFactory, EnvironmentServiceFactory, NavigationService, ResourceModelServiceFactory, RoutingServiceFactory, ShellServicesFactory, SideEffectsServiceFactory, TemplatedViewServiceFactory, _DateTimeWithTimezone, _Email, _library, _library2, DataType, Core, _library3, ServiceFactoryRegistry, _library4, _library5) {
  "use strict";

  /**
   * Root namespace for all the libraries related to SAP Fiori elements.
   *
   * @namespace
   * @name sap.fe
   * @public
   */

  /**
   * Library providing the core functionality of the runtime for SAP Fiori elements for OData V4.
   *
   * @namespace
   * @name sap.fe.core
   * @public
   */

  /**
   * Collection of controller extensions used internally in SAP Fiori elements exposing a method that you can override to allow more flexibility.
   *
   * @namespace
   * @name sap.fe.core.controllerextensions
   * @public
   */

  /**
   * Collection of classes provided by SAP Fiori elements for the Flexible Programming Model
   *
   * @namespace
   * @name sap.fe.core.fpm
   * @public
   */

  /**
   * @namespace
   * @name sap.fe.core.actions
   * @private
   */

  /**
   * @namespace
   * @name sap.fe.common
   * @private
   */

  /**
   * @namespace
   * @name sap.fe.core.model
   * @private
   */

  /**
   * @namespace
   * @name sap.fe.core.navigation
   * @private
   */
  var thisLib = Core.initLibrary({
    name: "sap.fe.core",
    dependencies: ["sap.ui.core", "sap.fe.navigation", "sap.fe.placeholder", "sap.ui.fl", "sap.ui.mdc", "sap.f"],
    types: ["sap.fe.core.CreationMode", "sap.fe.core.VariantManagement"],
    interfaces: [],
    controls: [],
    elements: [],
    // eslint-disable-next-line no-template-curly-in-string
    version: "1.108.0",
    noLibraryCSS: true,
    extensions: {
      //Configuration used for rule loading of Support Assistant
      "sap.ui.support": {
        publicRules: true,
        internalRules: true
      },
      flChangeHandlers: {
        "sap.fe.core.controls.FilterBar": "sap/ui/mdc/flexibility/FilterBar"
      }
    }
  });
  /**
   * Available values for invocation grouping.
   *
   * @readonly
   * @enum {string}
   * @private
   */

  thisLib.InvocationGrouping = {
    /**
     * Isolated.
     *
     * @constant
     * @type {string}
     * @public
     */
    Isolated: "Isolated",

    /**
     * ChangeSet.
     *
     * @constant
     * @type {string}
     * @public
     */
    ChangeSet: "ChangeSet"
  };
  /**
   * Available values for creation mode.
   *
   * @readonly
   * @enum {string}
   * @private
   */

  thisLib.CreationMode = {
    /**
     * New Page.
     *
     * @constant
     * @type {string}
     * @public
     */
    NewPage: "NewPage",

    /**
     * Sync.
     *
     * @constant
     * @type {string}
     * @public
     */
    Sync: "Sync",

    /**
     * Async.
     *
     * @constant
     * @type {string}
     * @public
     */
    Async: "Async",

    /**
     * Deferred.
     *
     * @constant
     * @type {string}
     * @public
     */
    Deferred: "Deferred",

    /**
     * Inline.
     *
     * @constant
     * @type {string}
     * @public
     */
    Inline: "Inline",

    /**
     * Creation row.
     *
     * @constant
     * @type {string}
     * @public
     */
    CreationRow: "CreationRow",

    /**
     * Inline creation rows.
     *
     * @constant
     * @type {string}
     * @public
     */
    InlineCreationRows: "InlineCreationRows",

    /**
     * External (by outbound navigation).
     *
     * @constant
     * @type {string}
     * @public
     */
    External: "External"
  };
  /**
   * Available values for Variant Management.
   *
   * @readonly
   * @enum {string}
   * @private
   */

  thisLib.VariantManagement = {
    /**
     * No variant management at all.
     *
     * @constant
     * @type {string}
     * @public
     */
    None: "None",

    /**
     * One variant configuration for the whole page.
     *
     * @constant
     * @type {string}
     * @public
     */
    Page: "Page",

    /**
     * Variant management on control level.
     *
     * @constant
     * @type {string}
     * @public
     */
    Control: "Control"
  };
  /**
   * Available constants.
   *
   * @readonly
   * @enum {string}
   * @private
   */

  thisLib.Constants = {
    /*
     * Indicates cancelling of an action dialog.
     *
     * @constant
     * @type {string}
     * @public
     */
    CancelActionDialog: "cancel",

    /*
     * Indicates failure returned from backend during the execution of an action
     *
     * @constant
     * @type {string}
     * @public
     */
    ActionExecutionFailed: "actionExecutionFailed",

    /*
     * Indicates failure returned from backend during creation of a business object (via direct POST)
     *
     * @constant
     * @type {string}
     * @public
     */
    CreationFailed: "creationFailed"
  };
  /**
   * Available values for programming model.
   *
   * @readonly
   * @enum {string}
   * @private
   */

  thisLib.ProgrammingModel = {
    /*
     * Draft.
     *
     * @constant
     * @type {string}
     * @public
     */
    Draft: "Draft",

    /**
     * Sticky.
     *
     * @constant
     * @type {string}
     * @public
     */
    Sticky: "Sticky",

    /**
     * NonDraft.
     *
     * @constant
     * @type {string}
     * @public
     */
    NonDraft: "NonDraft"
  };
  /**
   * Available values for draft status.
   *
   * @readonly
   * @enum {string}
   * @private
   */

  thisLib.DraftStatus = {
    /**
     * Saving.
     *
     * @constant
     * @type {string}
     * @public
     */
    Saving: "Saving",

    /**
     * Saved.
     *
     * @constant
     * @type {string}
     * @public
     */
    Saved: "Saved",

    /**
     * Clear.
     *
     * @constant
     * @type {string}
     * @public
     */
    Clear: "Clear"
  };
  /**
   * Edit mode values.
   *
   * @readonly
   * @enum {string}
   * @private
   */

  thisLib.EditMode = {
    /**
     * View is currently displaying only.
     *
     * @constant
     * @type {string}
     * @public
     */
    Display: "Display",

    /**
     * View is currently editable.
     *
     * @constant
     * @type {string}
     * @public
     */
    Editable: "Editable"
  };
  /**
   * Template views.
   *
   * @readonly
   * @enum {string}
   * @private
   */

  thisLib.TemplateContentView = {
    /**
     * Hybrid.
     *
     * @constant
     * @type {string}
     */
    Hybrid: "Hybrid",

    /**
     * Chart.
     *
     * @constant
     * @type {string}
     */
    Chart: "Chart",

    /**
     * Table.
     *
     * @constant
     * @type {string}
     */
    Table: "Table"
  };
  /**
   * Possible initial load (first app startup) modes for a ListReport.
   *
   * @enum {string}
   * @name sap.fe.core.InitialLoadMode
   * @readonly
   * @public
   * @since 1.86.0
   */

  thisLib.InitialLoadMode = {
    /**
     * Data will be loaded initially.
     *
     * @name sap.fe.core.InitialLoadMode.Enabled
     * @public
     */
    Enabled: "Enabled",

    /**
     * Data will not be loaded initially.
     *
     * @name sap.fe.core.InitialLoadMode.Disabled
     * @public
     */
    Disabled: "Disabled",

    /**
     * Data will be loaded initially if filters are set.
     *
     * @name sap.fe.core.InitialLoadMode.Auto
     * @public
     */
    Auto: "Auto"
  };
  /**
   * Value of the startup mode
   *
   * @readonly
   * @enum {string}
   * @private
   */

  thisLib.StartupMode = {
    /**
     * App has been started normally.
     *
     * @constant
     * @type {string}
     */
    Normal: "Normal",

    /**
     * App has been started with startup keys (deeplink).
     *
     * @constant
     * @type {string}
     */
    Deeplink: "Deeplink",

    /**
     * App has been started in 'create' mode.
     *
     * @constant
     * @type {string}
     */
    Create: "Create",

    /**
     * App has been started in 'auto create' mode which means to skip any dialogs on startup
     *
     * @constant
     * @type {string}
     */
    AutoCreate: "AutoCreate"
  }; // explicit type to handle backward compatibility with boolean values

  var InitialLoadType = DataType.createType("sap.fe.core.InitialLoadMode", {
    defaultValue: thisLib.InitialLoadMode.Auto,
    isValid: function (vValue) {
      if (typeof vValue === "boolean") {
        Log.warning("DEPRECATED: boolean value not allowed for 'initialLoad' manifest setting - supported values are: Disabled|Enabled|Auto");
      }

      return vValue === undefined || vValue === null || typeof vValue === "boolean" || thisLib.InitialLoadMode.hasOwnProperty(vValue);
    }
  }); // normalize a value, taking care of boolean type

  InitialLoadType.setNormalizer(function (vValue) {
    if (!vValue) {
      // undefined, null or false
      return thisLib.InitialLoadMode.Disabled;
    }

    return vValue === true ? thisLib.InitialLoadMode.Enabled : vValue;
  });
  ServiceFactoryRegistry.register("sap.fe.core.services.TemplatedViewService", new TemplatedViewServiceFactory());
  ServiceFactoryRegistry.register("sap.fe.core.services.ResourceModelService", new ResourceModelServiceFactory());
  ServiceFactoryRegistry.register("sap.fe.core.services.CacheHandlerService", new CacheHandlerServiceFactory());
  ServiceFactoryRegistry.register("sap.fe.core.services.NavigationService", new NavigationService());
  ServiceFactoryRegistry.register("sap.fe.core.services.RoutingService", new RoutingServiceFactory());
  ServiceFactoryRegistry.register("sap.fe.core.services.SideEffectsService", new SideEffectsServiceFactory());
  ServiceFactoryRegistry.register("sap.fe.core.services.ShellServices", new ShellServicesFactory());
  ServiceFactoryRegistry.register("sap.fe.core.services.EnvironmentService", new EnvironmentServiceFactory());
  ServiceFactoryRegistry.register("sap.fe.core.services.AsyncComponentService", new AsyncComponentServiceFactory());
  return thisLib;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJ0aGlzTGliIiwiQ29yZSIsImluaXRMaWJyYXJ5IiwibmFtZSIsImRlcGVuZGVuY2llcyIsInR5cGVzIiwiaW50ZXJmYWNlcyIsImNvbnRyb2xzIiwiZWxlbWVudHMiLCJ2ZXJzaW9uIiwibm9MaWJyYXJ5Q1NTIiwiZXh0ZW5zaW9ucyIsInB1YmxpY1J1bGVzIiwiaW50ZXJuYWxSdWxlcyIsImZsQ2hhbmdlSGFuZGxlcnMiLCJJbnZvY2F0aW9uR3JvdXBpbmciLCJJc29sYXRlZCIsIkNoYW5nZVNldCIsIkNyZWF0aW9uTW9kZSIsIk5ld1BhZ2UiLCJTeW5jIiwiQXN5bmMiLCJEZWZlcnJlZCIsIklubGluZSIsIkNyZWF0aW9uUm93IiwiSW5saW5lQ3JlYXRpb25Sb3dzIiwiRXh0ZXJuYWwiLCJWYXJpYW50TWFuYWdlbWVudCIsIk5vbmUiLCJQYWdlIiwiQ29udHJvbCIsIkNvbnN0YW50cyIsIkNhbmNlbEFjdGlvbkRpYWxvZyIsIkFjdGlvbkV4ZWN1dGlvbkZhaWxlZCIsIkNyZWF0aW9uRmFpbGVkIiwiUHJvZ3JhbW1pbmdNb2RlbCIsIkRyYWZ0IiwiU3RpY2t5IiwiTm9uRHJhZnQiLCJEcmFmdFN0YXR1cyIsIlNhdmluZyIsIlNhdmVkIiwiQ2xlYXIiLCJFZGl0TW9kZSIsIkRpc3BsYXkiLCJFZGl0YWJsZSIsIlRlbXBsYXRlQ29udGVudFZpZXciLCJIeWJyaWQiLCJDaGFydCIsIlRhYmxlIiwiSW5pdGlhbExvYWRNb2RlIiwiRW5hYmxlZCIsIkRpc2FibGVkIiwiQXV0byIsIlN0YXJ0dXBNb2RlIiwiTm9ybWFsIiwiRGVlcGxpbmsiLCJDcmVhdGUiLCJBdXRvQ3JlYXRlIiwiSW5pdGlhbExvYWRUeXBlIiwiRGF0YVR5cGUiLCJjcmVhdGVUeXBlIiwiZGVmYXVsdFZhbHVlIiwiaXNWYWxpZCIsInZWYWx1ZSIsIkxvZyIsIndhcm5pbmciLCJ1bmRlZmluZWQiLCJoYXNPd25Qcm9wZXJ0eSIsInNldE5vcm1hbGl6ZXIiLCJTZXJ2aWNlRmFjdG9yeVJlZ2lzdHJ5IiwicmVnaXN0ZXIiLCJUZW1wbGF0ZWRWaWV3U2VydmljZUZhY3RvcnkiLCJSZXNvdXJjZU1vZGVsU2VydmljZUZhY3RvcnkiLCJDYWNoZUhhbmRsZXJTZXJ2aWNlRmFjdG9yeSIsIk5hdmlnYXRpb25TZXJ2aWNlIiwiUm91dGluZ1NlcnZpY2VGYWN0b3J5IiwiU2lkZUVmZmVjdHNTZXJ2aWNlRmFjdG9yeSIsIlNoZWxsU2VydmljZXNGYWN0b3J5IiwiRW52aXJvbm1lbnRTZXJ2aWNlRmFjdG9yeSIsIkFzeW5jQ29tcG9uZW50U2VydmljZUZhY3RvcnkiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbImxpYnJhcnkudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvZyBmcm9tIFwic2FwL2Jhc2UvTG9nXCI7XG5pbXBvcnQgXCJzYXAvZmUvY29yZS9mb3JtYXR0ZXJzL0ZQTUZvcm1hdHRlclwiO1xuaW1wb3J0IFwic2FwL2ZlL2NvcmUvZm9ybWF0dGVycy9TdGFuZGFyZEZvcm1hdHRlclwiO1xuaW1wb3J0IFwic2FwL2ZlL2NvcmUvZm9ybWF0dGVycy9WYWx1ZUZvcm1hdHRlclwiO1xuaW1wb3J0IEFzeW5jQ29tcG9uZW50U2VydmljZUZhY3RvcnkgZnJvbSBcInNhcC9mZS9jb3JlL3NlcnZpY2VzL0FzeW5jQ29tcG9uZW50U2VydmljZUZhY3RvcnlcIjtcbmltcG9ydCBDYWNoZUhhbmRsZXJTZXJ2aWNlRmFjdG9yeSBmcm9tIFwic2FwL2ZlL2NvcmUvc2VydmljZXMvQ2FjaGVIYW5kbGVyU2VydmljZUZhY3RvcnlcIjtcbmltcG9ydCBFbnZpcm9ubWVudFNlcnZpY2VGYWN0b3J5IGZyb20gXCJzYXAvZmUvY29yZS9zZXJ2aWNlcy9FbnZpcm9ubWVudFNlcnZpY2VGYWN0b3J5XCI7XG5pbXBvcnQgTmF2aWdhdGlvblNlcnZpY2UgZnJvbSBcInNhcC9mZS9jb3JlL3NlcnZpY2VzL05hdmlnYXRpb25TZXJ2aWNlRmFjdG9yeVwiO1xuaW1wb3J0IFJlc291cmNlTW9kZWxTZXJ2aWNlRmFjdG9yeSBmcm9tIFwic2FwL2ZlL2NvcmUvc2VydmljZXMvUmVzb3VyY2VNb2RlbFNlcnZpY2VGYWN0b3J5XCI7XG5pbXBvcnQgUm91dGluZ1NlcnZpY2VGYWN0b3J5IGZyb20gXCJzYXAvZmUvY29yZS9zZXJ2aWNlcy9Sb3V0aW5nU2VydmljZUZhY3RvcnlcIjtcbmltcG9ydCBTaGVsbFNlcnZpY2VzRmFjdG9yeSBmcm9tIFwic2FwL2ZlL2NvcmUvc2VydmljZXMvU2hlbGxTZXJ2aWNlc0ZhY3RvcnlcIjtcbmltcG9ydCBTaWRlRWZmZWN0c1NlcnZpY2VGYWN0b3J5IGZyb20gXCJzYXAvZmUvY29yZS9zZXJ2aWNlcy9TaWRlRWZmZWN0c1NlcnZpY2VGYWN0b3J5XCI7XG5pbXBvcnQgVGVtcGxhdGVkVmlld1NlcnZpY2VGYWN0b3J5IGZyb20gXCJzYXAvZmUvY29yZS9zZXJ2aWNlcy9UZW1wbGF0ZWRWaWV3U2VydmljZUZhY3RvcnlcIjtcbmltcG9ydCBcInNhcC9mZS9jb3JlL3R5cGUvRGF0ZVRpbWVXaXRoVGltZXpvbmVcIjtcbmltcG9ydCBcInNhcC9mZS9jb3JlL3R5cGUvRW1haWxcIjtcbmltcG9ydCBcInNhcC9mZS9uYXZpZ2F0aW9uL2xpYnJhcnlcIjtcbmltcG9ydCBcInNhcC9mZS9wbGFjZWhvbGRlci9saWJyYXJ5XCI7XG5pbXBvcnQgRGF0YVR5cGUgZnJvbSBcInNhcC91aS9iYXNlL0RhdGFUeXBlXCI7XG5pbXBvcnQgQ29yZSBmcm9tIFwic2FwL3VpL2NvcmUvQ29yZVwiO1xuaW1wb3J0IFwic2FwL3VpL2NvcmUvbGlicmFyeVwiO1xuaW1wb3J0IFNlcnZpY2VGYWN0b3J5UmVnaXN0cnkgZnJvbSBcInNhcC91aS9jb3JlL3NlcnZpY2UvU2VydmljZUZhY3RvcnlSZWdpc3RyeVwiO1xuaW1wb3J0IFwic2FwL3VpL2ZsL2xpYnJhcnlcIjtcbmltcG9ydCBcInNhcC91aS9tZGMvbGlicmFyeVwiO1xuLyoqXG4gKiBSb290IG5hbWVzcGFjZSBmb3IgYWxsIHRoZSBsaWJyYXJpZXMgcmVsYXRlZCB0byBTQVAgRmlvcmkgZWxlbWVudHMuXG4gKlxuICogQG5hbWVzcGFjZVxuICogQG5hbWUgc2FwLmZlXG4gKiBAcHVibGljXG4gKi9cblxuLyoqXG4gKiBMaWJyYXJ5IHByb3ZpZGluZyB0aGUgY29yZSBmdW5jdGlvbmFsaXR5IG9mIHRoZSBydW50aW1lIGZvciBTQVAgRmlvcmkgZWxlbWVudHMgZm9yIE9EYXRhIFY0LlxuICpcbiAqIEBuYW1lc3BhY2VcbiAqIEBuYW1lIHNhcC5mZS5jb3JlXG4gKiBAcHVibGljXG4gKi9cblxuLyoqXG4gKiBDb2xsZWN0aW9uIG9mIGNvbnRyb2xsZXIgZXh0ZW5zaW9ucyB1c2VkIGludGVybmFsbHkgaW4gU0FQIEZpb3JpIGVsZW1lbnRzIGV4cG9zaW5nIGEgbWV0aG9kIHRoYXQgeW91IGNhbiBvdmVycmlkZSB0byBhbGxvdyBtb3JlIGZsZXhpYmlsaXR5LlxuICpcbiAqIEBuYW1lc3BhY2VcbiAqIEBuYW1lIHNhcC5mZS5jb3JlLmNvbnRyb2xsZXJleHRlbnNpb25zXG4gKiBAcHVibGljXG4gKi9cblxuLyoqXG4gKiBDb2xsZWN0aW9uIG9mIGNsYXNzZXMgcHJvdmlkZWQgYnkgU0FQIEZpb3JpIGVsZW1lbnRzIGZvciB0aGUgRmxleGlibGUgUHJvZ3JhbW1pbmcgTW9kZWxcbiAqXG4gKiBAbmFtZXNwYWNlXG4gKiBAbmFtZSBzYXAuZmUuY29yZS5mcG1cbiAqIEBwdWJsaWNcbiAqL1xuXG4vKipcbiAqIEBuYW1lc3BhY2VcbiAqIEBuYW1lIHNhcC5mZS5jb3JlLmFjdGlvbnNcbiAqIEBwcml2YXRlXG4gKi9cblxuLyoqXG4gKiBAbmFtZXNwYWNlXG4gKiBAbmFtZSBzYXAuZmUuY29tbW9uXG4gKiBAcHJpdmF0ZVxuICovXG5cbi8qKlxuICogQG5hbWVzcGFjZVxuICogQG5hbWUgc2FwLmZlLmNvcmUubW9kZWxcbiAqIEBwcml2YXRlXG4gKi9cblxuLyoqXG4gKiBAbmFtZXNwYWNlXG4gKiBAbmFtZSBzYXAuZmUuY29yZS5uYXZpZ2F0aW9uXG4gKiBAcHJpdmF0ZVxuICovXG5jb25zdCB0aGlzTGliID0gQ29yZS5pbml0TGlicmFyeSh7XG5cdG5hbWU6IFwic2FwLmZlLmNvcmVcIixcblx0ZGVwZW5kZW5jaWVzOiBbXCJzYXAudWkuY29yZVwiLCBcInNhcC5mZS5uYXZpZ2F0aW9uXCIsIFwic2FwLmZlLnBsYWNlaG9sZGVyXCIsIFwic2FwLnVpLmZsXCIsIFwic2FwLnVpLm1kY1wiLCBcInNhcC5mXCJdLFxuXHR0eXBlczogW1wic2FwLmZlLmNvcmUuQ3JlYXRpb25Nb2RlXCIsIFwic2FwLmZlLmNvcmUuVmFyaWFudE1hbmFnZW1lbnRcIl0sXG5cdGludGVyZmFjZXM6IFtdLFxuXHRjb250cm9sczogW10sXG5cdGVsZW1lbnRzOiBbXSxcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXRlbXBsYXRlLWN1cmx5LWluLXN0cmluZ1xuXHR2ZXJzaW9uOiBcIiR7dmVyc2lvbn1cIixcblx0bm9MaWJyYXJ5Q1NTOiB0cnVlLFxuXHRleHRlbnNpb25zOiB7XG5cdFx0Ly9Db25maWd1cmF0aW9uIHVzZWQgZm9yIHJ1bGUgbG9hZGluZyBvZiBTdXBwb3J0IEFzc2lzdGFudFxuXHRcdFwic2FwLnVpLnN1cHBvcnRcIjoge1xuXHRcdFx0cHVibGljUnVsZXM6IHRydWUsXG5cdFx0XHRpbnRlcm5hbFJ1bGVzOiB0cnVlXG5cdFx0fSxcblx0XHRmbENoYW5nZUhhbmRsZXJzOiB7XG5cdFx0XHRcInNhcC5mZS5jb3JlLmNvbnRyb2xzLkZpbHRlckJhclwiOiBcInNhcC91aS9tZGMvZmxleGliaWxpdHkvRmlsdGVyQmFyXCJcblx0XHR9XG5cdH1cbn0pIGFzIGFueTtcblxuLyoqXG4gKiBBdmFpbGFibGUgdmFsdWVzIGZvciBpbnZvY2F0aW9uIGdyb3VwaW5nLlxuICpcbiAqIEByZWFkb25seVxuICogQGVudW0ge3N0cmluZ31cbiAqIEBwcml2YXRlXG4gKi9cbnRoaXNMaWIuSW52b2NhdGlvbkdyb3VwaW5nID0ge1xuXHQvKipcblx0ICogSXNvbGF0ZWQuXG5cdCAqXG5cdCAqIEBjb25zdGFudFxuXHQgKiBAdHlwZSB7c3RyaW5nfVxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRJc29sYXRlZDogXCJJc29sYXRlZFwiLFxuXHQvKipcblx0ICogQ2hhbmdlU2V0LlxuXHQgKlxuXHQgKiBAY29uc3RhbnRcblx0ICogQHR5cGUge3N0cmluZ31cblx0ICogQHB1YmxpY1xuXHQgKi9cblx0Q2hhbmdlU2V0OiBcIkNoYW5nZVNldFwiXG59O1xuLyoqXG4gKiBBdmFpbGFibGUgdmFsdWVzIGZvciBjcmVhdGlvbiBtb2RlLlxuICpcbiAqIEByZWFkb25seVxuICogQGVudW0ge3N0cmluZ31cbiAqIEBwcml2YXRlXG4gKi9cbnRoaXNMaWIuQ3JlYXRpb25Nb2RlID0ge1xuXHQvKipcblx0ICogTmV3IFBhZ2UuXG5cdCAqXG5cdCAqIEBjb25zdGFudFxuXHQgKiBAdHlwZSB7c3RyaW5nfVxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHROZXdQYWdlOiBcIk5ld1BhZ2VcIixcblx0LyoqXG5cdCAqIFN5bmMuXG5cdCAqXG5cdCAqIEBjb25zdGFudFxuXHQgKiBAdHlwZSB7c3RyaW5nfVxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRTeW5jOiBcIlN5bmNcIixcblx0LyoqXG5cdCAqIEFzeW5jLlxuXHQgKlxuXHQgKiBAY29uc3RhbnRcblx0ICogQHR5cGUge3N0cmluZ31cblx0ICogQHB1YmxpY1xuXHQgKi9cblx0QXN5bmM6IFwiQXN5bmNcIixcblx0LyoqXG5cdCAqIERlZmVycmVkLlxuXHQgKlxuXHQgKiBAY29uc3RhbnRcblx0ICogQHR5cGUge3N0cmluZ31cblx0ICogQHB1YmxpY1xuXHQgKi9cblx0RGVmZXJyZWQ6IFwiRGVmZXJyZWRcIixcblx0LyoqXG5cdCAqIElubGluZS5cblx0ICpcblx0ICogQGNvbnN0YW50XG5cdCAqIEB0eXBlIHtzdHJpbmd9XG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdElubGluZTogXCJJbmxpbmVcIixcblx0LyoqXG5cdCAqIENyZWF0aW9uIHJvdy5cblx0ICpcblx0ICogQGNvbnN0YW50XG5cdCAqIEB0eXBlIHtzdHJpbmd9XG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdENyZWF0aW9uUm93OiBcIkNyZWF0aW9uUm93XCIsXG5cdC8qKlxuXHQgKiBJbmxpbmUgY3JlYXRpb24gcm93cy5cblx0ICpcblx0ICogQGNvbnN0YW50XG5cdCAqIEB0eXBlIHtzdHJpbmd9XG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdElubGluZUNyZWF0aW9uUm93czogXCJJbmxpbmVDcmVhdGlvblJvd3NcIixcblx0LyoqXG5cdCAqIEV4dGVybmFsIChieSBvdXRib3VuZCBuYXZpZ2F0aW9uKS5cblx0ICpcblx0ICogQGNvbnN0YW50XG5cdCAqIEB0eXBlIHtzdHJpbmd9XG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdEV4dGVybmFsOiBcIkV4dGVybmFsXCJcbn07XG4vKipcbiAqIEF2YWlsYWJsZSB2YWx1ZXMgZm9yIFZhcmlhbnQgTWFuYWdlbWVudC5cbiAqXG4gKiBAcmVhZG9ubHlcbiAqIEBlbnVtIHtzdHJpbmd9XG4gKiBAcHJpdmF0ZVxuICovXG50aGlzTGliLlZhcmlhbnRNYW5hZ2VtZW50ID0ge1xuXHQvKipcblx0ICogTm8gdmFyaWFudCBtYW5hZ2VtZW50IGF0IGFsbC5cblx0ICpcblx0ICogQGNvbnN0YW50XG5cdCAqIEB0eXBlIHtzdHJpbmd9XG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdE5vbmU6IFwiTm9uZVwiLFxuXG5cdC8qKlxuXHQgKiBPbmUgdmFyaWFudCBjb25maWd1cmF0aW9uIGZvciB0aGUgd2hvbGUgcGFnZS5cblx0ICpcblx0ICogQGNvbnN0YW50XG5cdCAqIEB0eXBlIHtzdHJpbmd9XG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdFBhZ2U6IFwiUGFnZVwiLFxuXG5cdC8qKlxuXHQgKiBWYXJpYW50IG1hbmFnZW1lbnQgb24gY29udHJvbCBsZXZlbC5cblx0ICpcblx0ICogQGNvbnN0YW50XG5cdCAqIEB0eXBlIHtzdHJpbmd9XG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdENvbnRyb2w6IFwiQ29udHJvbFwiXG59O1xuLyoqXG4gKiBBdmFpbGFibGUgY29uc3RhbnRzLlxuICpcbiAqIEByZWFkb25seVxuICogQGVudW0ge3N0cmluZ31cbiAqIEBwcml2YXRlXG4gKi9cbnRoaXNMaWIuQ29uc3RhbnRzID0ge1xuXHQvKlxuXHQgKiBJbmRpY2F0ZXMgY2FuY2VsbGluZyBvZiBhbiBhY3Rpb24gZGlhbG9nLlxuXHQgKlxuXHQgKiBAY29uc3RhbnRcblx0ICogQHR5cGUge3N0cmluZ31cblx0ICogQHB1YmxpY1xuXHQgKi9cblx0Q2FuY2VsQWN0aW9uRGlhbG9nOiBcImNhbmNlbFwiLFxuXHQvKlxuXHQgKiBJbmRpY2F0ZXMgZmFpbHVyZSByZXR1cm5lZCBmcm9tIGJhY2tlbmQgZHVyaW5nIHRoZSBleGVjdXRpb24gb2YgYW4gYWN0aW9uXG5cdCAqXG5cdCAqIEBjb25zdGFudFxuXHQgKiBAdHlwZSB7c3RyaW5nfVxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRBY3Rpb25FeGVjdXRpb25GYWlsZWQ6IFwiYWN0aW9uRXhlY3V0aW9uRmFpbGVkXCIsXG5cdC8qXG5cdCAqIEluZGljYXRlcyBmYWlsdXJlIHJldHVybmVkIGZyb20gYmFja2VuZCBkdXJpbmcgY3JlYXRpb24gb2YgYSBidXNpbmVzcyBvYmplY3QgKHZpYSBkaXJlY3QgUE9TVClcblx0ICpcblx0ICogQGNvbnN0YW50XG5cdCAqIEB0eXBlIHtzdHJpbmd9XG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdENyZWF0aW9uRmFpbGVkOiBcImNyZWF0aW9uRmFpbGVkXCJcbn07XG4vKipcbiAqIEF2YWlsYWJsZSB2YWx1ZXMgZm9yIHByb2dyYW1taW5nIG1vZGVsLlxuICpcbiAqIEByZWFkb25seVxuICogQGVudW0ge3N0cmluZ31cbiAqIEBwcml2YXRlXG4gKi9cbnRoaXNMaWIuUHJvZ3JhbW1pbmdNb2RlbCA9IHtcblx0Lypcblx0ICogRHJhZnQuXG5cdCAqXG5cdCAqIEBjb25zdGFudFxuXHQgKiBAdHlwZSB7c3RyaW5nfVxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHREcmFmdDogXCJEcmFmdFwiLFxuXHQvKipcblx0ICogU3RpY2t5LlxuXHQgKlxuXHQgKiBAY29uc3RhbnRcblx0ICogQHR5cGUge3N0cmluZ31cblx0ICogQHB1YmxpY1xuXHQgKi9cblx0U3RpY2t5OiBcIlN0aWNreVwiLFxuXHQvKipcblx0ICogTm9uRHJhZnQuXG5cdCAqXG5cdCAqIEBjb25zdGFudFxuXHQgKiBAdHlwZSB7c3RyaW5nfVxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHROb25EcmFmdDogXCJOb25EcmFmdFwiXG59O1xuLyoqXG4gKiBBdmFpbGFibGUgdmFsdWVzIGZvciBkcmFmdCBzdGF0dXMuXG4gKlxuICogQHJlYWRvbmx5XG4gKiBAZW51bSB7c3RyaW5nfVxuICogQHByaXZhdGVcbiAqL1xudGhpc0xpYi5EcmFmdFN0YXR1cyA9IHtcblx0LyoqXG5cdCAqIFNhdmluZy5cblx0ICpcblx0ICogQGNvbnN0YW50XG5cdCAqIEB0eXBlIHtzdHJpbmd9XG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdFNhdmluZzogXCJTYXZpbmdcIixcblx0LyoqXG5cdCAqIFNhdmVkLlxuXHQgKlxuXHQgKiBAY29uc3RhbnRcblx0ICogQHR5cGUge3N0cmluZ31cblx0ICogQHB1YmxpY1xuXHQgKi9cblx0U2F2ZWQ6IFwiU2F2ZWRcIixcblx0LyoqXG5cdCAqIENsZWFyLlxuXHQgKlxuXHQgKiBAY29uc3RhbnRcblx0ICogQHR5cGUge3N0cmluZ31cblx0ICogQHB1YmxpY1xuXHQgKi9cblx0Q2xlYXI6IFwiQ2xlYXJcIlxufTtcbi8qKlxuICogRWRpdCBtb2RlIHZhbHVlcy5cbiAqXG4gKiBAcmVhZG9ubHlcbiAqIEBlbnVtIHtzdHJpbmd9XG4gKiBAcHJpdmF0ZVxuICovXG50aGlzTGliLkVkaXRNb2RlID0ge1xuXHQvKipcblx0ICogVmlldyBpcyBjdXJyZW50bHkgZGlzcGxheWluZyBvbmx5LlxuXHQgKlxuXHQgKiBAY29uc3RhbnRcblx0ICogQHR5cGUge3N0cmluZ31cblx0ICogQHB1YmxpY1xuXHQgKi9cblx0RGlzcGxheTogXCJEaXNwbGF5XCIsXG5cdC8qKlxuXHQgKiBWaWV3IGlzIGN1cnJlbnRseSBlZGl0YWJsZS5cblx0ICpcblx0ICogQGNvbnN0YW50XG5cdCAqIEB0eXBlIHtzdHJpbmd9XG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdEVkaXRhYmxlOiBcIkVkaXRhYmxlXCJcbn07XG4vKipcbiAqIFRlbXBsYXRlIHZpZXdzLlxuICpcbiAqIEByZWFkb25seVxuICogQGVudW0ge3N0cmluZ31cbiAqIEBwcml2YXRlXG4gKi9cbnRoaXNMaWIuVGVtcGxhdGVDb250ZW50VmlldyA9IHtcblx0LyoqXG5cdCAqIEh5YnJpZC5cblx0ICpcblx0ICogQGNvbnN0YW50XG5cdCAqIEB0eXBlIHtzdHJpbmd9XG5cdCAqL1xuXHRIeWJyaWQ6IFwiSHlicmlkXCIsXG5cdC8qKlxuXHQgKiBDaGFydC5cblx0ICpcblx0ICogQGNvbnN0YW50XG5cdCAqIEB0eXBlIHtzdHJpbmd9XG5cdCAqL1xuXHRDaGFydDogXCJDaGFydFwiLFxuXHQvKipcblx0ICogVGFibGUuXG5cdCAqXG5cdCAqIEBjb25zdGFudFxuXHQgKiBAdHlwZSB7c3RyaW5nfVxuXHQgKi9cblx0VGFibGU6IFwiVGFibGVcIlxufTtcbi8qKlxuICogUG9zc2libGUgaW5pdGlhbCBsb2FkIChmaXJzdCBhcHAgc3RhcnR1cCkgbW9kZXMgZm9yIGEgTGlzdFJlcG9ydC5cbiAqXG4gKiBAZW51bSB7c3RyaW5nfVxuICogQG5hbWUgc2FwLmZlLmNvcmUuSW5pdGlhbExvYWRNb2RlXG4gKiBAcmVhZG9ubHlcbiAqIEBwdWJsaWNcbiAqIEBzaW5jZSAxLjg2LjBcbiAqL1xudGhpc0xpYi5Jbml0aWFsTG9hZE1vZGUgPSB7XG5cdC8qKlxuXHQgKiBEYXRhIHdpbGwgYmUgbG9hZGVkIGluaXRpYWxseS5cblx0ICpcblx0ICogQG5hbWUgc2FwLmZlLmNvcmUuSW5pdGlhbExvYWRNb2RlLkVuYWJsZWRcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0RW5hYmxlZDogXCJFbmFibGVkXCIsXG5cblx0LyoqXG5cdCAqIERhdGEgd2lsbCBub3QgYmUgbG9hZGVkIGluaXRpYWxseS5cblx0ICpcblx0ICogQG5hbWUgc2FwLmZlLmNvcmUuSW5pdGlhbExvYWRNb2RlLkRpc2FibGVkXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdERpc2FibGVkOiBcIkRpc2FibGVkXCIsXG5cblx0LyoqXG5cdCAqIERhdGEgd2lsbCBiZSBsb2FkZWQgaW5pdGlhbGx5IGlmIGZpbHRlcnMgYXJlIHNldC5cblx0ICpcblx0ICogQG5hbWUgc2FwLmZlLmNvcmUuSW5pdGlhbExvYWRNb2RlLkF1dG9cblx0ICogQHB1YmxpY1xuXHQgKi9cblx0QXV0bzogXCJBdXRvXCJcbn07XG5cbi8qKlxuICogVmFsdWUgb2YgdGhlIHN0YXJ0dXAgbW9kZVxuICpcbiAqIEByZWFkb25seVxuICogQGVudW0ge3N0cmluZ31cbiAqIEBwcml2YXRlXG4gKi9cbnRoaXNMaWIuU3RhcnR1cE1vZGUgPSB7XG5cdC8qKlxuXHQgKiBBcHAgaGFzIGJlZW4gc3RhcnRlZCBub3JtYWxseS5cblx0ICpcblx0ICogQGNvbnN0YW50XG5cdCAqIEB0eXBlIHtzdHJpbmd9XG5cdCAqL1xuXHROb3JtYWw6IFwiTm9ybWFsXCIsXG5cdC8qKlxuXHQgKiBBcHAgaGFzIGJlZW4gc3RhcnRlZCB3aXRoIHN0YXJ0dXAga2V5cyAoZGVlcGxpbmspLlxuXHQgKlxuXHQgKiBAY29uc3RhbnRcblx0ICogQHR5cGUge3N0cmluZ31cblx0ICovXG5cdERlZXBsaW5rOiBcIkRlZXBsaW5rXCIsXG5cdC8qKlxuXHQgKiBBcHAgaGFzIGJlZW4gc3RhcnRlZCBpbiAnY3JlYXRlJyBtb2RlLlxuXHQgKlxuXHQgKiBAY29uc3RhbnRcblx0ICogQHR5cGUge3N0cmluZ31cblx0ICovXG5cdENyZWF0ZTogXCJDcmVhdGVcIixcblx0LyoqXG5cdCAqIEFwcCBoYXMgYmVlbiBzdGFydGVkIGluICdhdXRvIGNyZWF0ZScgbW9kZSB3aGljaCBtZWFucyB0byBza2lwIGFueSBkaWFsb2dzIG9uIHN0YXJ0dXBcblx0ICpcblx0ICogQGNvbnN0YW50XG5cdCAqIEB0eXBlIHtzdHJpbmd9XG5cdCAqL1xuXHRBdXRvQ3JlYXRlOiBcIkF1dG9DcmVhdGVcIlxufTtcbi8vIGV4cGxpY2l0IHR5cGUgdG8gaGFuZGxlIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgd2l0aCBib29sZWFuIHZhbHVlc1xuY29uc3QgSW5pdGlhbExvYWRUeXBlID0gRGF0YVR5cGUuY3JlYXRlVHlwZShcInNhcC5mZS5jb3JlLkluaXRpYWxMb2FkTW9kZVwiLCB7XG5cdGRlZmF1bHRWYWx1ZTogdGhpc0xpYi5Jbml0aWFsTG9hZE1vZGUuQXV0byxcblx0aXNWYWxpZDogZnVuY3Rpb24gKHZWYWx1ZTogYW55KSB7XG5cdFx0aWYgKHR5cGVvZiB2VmFsdWUgPT09IFwiYm9vbGVhblwiKSB7XG5cdFx0XHRMb2cud2FybmluZyhcblx0XHRcdFx0XCJERVBSRUNBVEVEOiBib29sZWFuIHZhbHVlIG5vdCBhbGxvd2VkIGZvciAnaW5pdGlhbExvYWQnIG1hbmlmZXN0IHNldHRpbmcgLSBzdXBwb3J0ZWQgdmFsdWVzIGFyZTogRGlzYWJsZWR8RW5hYmxlZHxBdXRvXCJcblx0XHRcdCk7XG5cdFx0fVxuXHRcdHJldHVybiB2VmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2VmFsdWUgPT09IG51bGwgfHwgdHlwZW9mIHZWYWx1ZSA9PT0gXCJib29sZWFuXCIgfHwgdGhpc0xpYi5Jbml0aWFsTG9hZE1vZGUuaGFzT3duUHJvcGVydHkodlZhbHVlKTtcblx0fVxufSk7XG4vLyBub3JtYWxpemUgYSB2YWx1ZSwgdGFraW5nIGNhcmUgb2YgYm9vbGVhbiB0eXBlXG5Jbml0aWFsTG9hZFR5cGUuc2V0Tm9ybWFsaXplcihmdW5jdGlvbiAodlZhbHVlOiBhbnkpIHtcblx0aWYgKCF2VmFsdWUpIHtcblx0XHQvLyB1bmRlZmluZWQsIG51bGwgb3IgZmFsc2Vcblx0XHRyZXR1cm4gdGhpc0xpYi5Jbml0aWFsTG9hZE1vZGUuRGlzYWJsZWQ7XG5cdH1cblx0cmV0dXJuIHZWYWx1ZSA9PT0gdHJ1ZSA/IHRoaXNMaWIuSW5pdGlhbExvYWRNb2RlLkVuYWJsZWQgOiB2VmFsdWU7XG59KTtcblNlcnZpY2VGYWN0b3J5UmVnaXN0cnkucmVnaXN0ZXIoXCJzYXAuZmUuY29yZS5zZXJ2aWNlcy5UZW1wbGF0ZWRWaWV3U2VydmljZVwiLCBuZXcgVGVtcGxhdGVkVmlld1NlcnZpY2VGYWN0b3J5KCkpO1xuU2VydmljZUZhY3RvcnlSZWdpc3RyeS5yZWdpc3RlcihcInNhcC5mZS5jb3JlLnNlcnZpY2VzLlJlc291cmNlTW9kZWxTZXJ2aWNlXCIsIG5ldyBSZXNvdXJjZU1vZGVsU2VydmljZUZhY3RvcnkoKSk7XG5TZXJ2aWNlRmFjdG9yeVJlZ2lzdHJ5LnJlZ2lzdGVyKFwic2FwLmZlLmNvcmUuc2VydmljZXMuQ2FjaGVIYW5kbGVyU2VydmljZVwiLCBuZXcgQ2FjaGVIYW5kbGVyU2VydmljZUZhY3RvcnkoKSk7XG5TZXJ2aWNlRmFjdG9yeVJlZ2lzdHJ5LnJlZ2lzdGVyKFwic2FwLmZlLmNvcmUuc2VydmljZXMuTmF2aWdhdGlvblNlcnZpY2VcIiwgbmV3IE5hdmlnYXRpb25TZXJ2aWNlKCkpO1xuU2VydmljZUZhY3RvcnlSZWdpc3RyeS5yZWdpc3RlcihcInNhcC5mZS5jb3JlLnNlcnZpY2VzLlJvdXRpbmdTZXJ2aWNlXCIsIG5ldyBSb3V0aW5nU2VydmljZUZhY3RvcnkoKSk7XG5TZXJ2aWNlRmFjdG9yeVJlZ2lzdHJ5LnJlZ2lzdGVyKFwic2FwLmZlLmNvcmUuc2VydmljZXMuU2lkZUVmZmVjdHNTZXJ2aWNlXCIsIG5ldyBTaWRlRWZmZWN0c1NlcnZpY2VGYWN0b3J5KCkpO1xuU2VydmljZUZhY3RvcnlSZWdpc3RyeS5yZWdpc3RlcihcInNhcC5mZS5jb3JlLnNlcnZpY2VzLlNoZWxsU2VydmljZXNcIiwgbmV3IFNoZWxsU2VydmljZXNGYWN0b3J5KCkpO1xuU2VydmljZUZhY3RvcnlSZWdpc3RyeS5yZWdpc3RlcihcInNhcC5mZS5jb3JlLnNlcnZpY2VzLkVudmlyb25tZW50U2VydmljZVwiLCBuZXcgRW52aXJvbm1lbnRTZXJ2aWNlRmFjdG9yeSgpKTtcblNlcnZpY2VGYWN0b3J5UmVnaXN0cnkucmVnaXN0ZXIoXCJzYXAuZmUuY29yZS5zZXJ2aWNlcy5Bc3luY0NvbXBvbmVudFNlcnZpY2VcIiwgbmV3IEFzeW5jQ29tcG9uZW50U2VydmljZUZhY3RvcnkoKSk7XG5cbmV4cG9ydCBkZWZhdWx0IHRoaXNMaWI7XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7RUF1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0VBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0VBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0VBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0VBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7RUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztFQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0VBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtFQUNBLElBQU1BLE9BQU8sR0FBR0MsSUFBSSxDQUFDQyxXQUFMLENBQWlCO0lBQ2hDQyxJQUFJLEVBQUUsYUFEMEI7SUFFaENDLFlBQVksRUFBRSxDQUFDLGFBQUQsRUFBZ0IsbUJBQWhCLEVBQXFDLG9CQUFyQyxFQUEyRCxXQUEzRCxFQUF3RSxZQUF4RSxFQUFzRixPQUF0RixDQUZrQjtJQUdoQ0MsS0FBSyxFQUFFLENBQUMsMEJBQUQsRUFBNkIsK0JBQTdCLENBSHlCO0lBSWhDQyxVQUFVLEVBQUUsRUFKb0I7SUFLaENDLFFBQVEsRUFBRSxFQUxzQjtJQU1oQ0MsUUFBUSxFQUFFLEVBTnNCO0lBT2hDO0lBQ0FDLE9BQU8sRUFBRSxZQVJ1QjtJQVNoQ0MsWUFBWSxFQUFFLElBVGtCO0lBVWhDQyxVQUFVLEVBQUU7TUFDWDtNQUNBLGtCQUFrQjtRQUNqQkMsV0FBVyxF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