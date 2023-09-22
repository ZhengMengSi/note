/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/converters/helpers/IssueManager","sap/ui/support/library"],function(e,t){"use strict";var r={};var a=e.IssueSeverity;var s=e.IssueCategory;var i=t.Categories,o=t.Severity,n=t.Audiences;r.Categories=i;r.Audiences=n;r.Severity=o;var u=function(e){switch(e){case a.Low:return o.Low;case a.High:return o.High;case a.Medium:return o.Medium}};r.getSeverity=u;var v=function(e,t,r,a){var i=t.getComponents();var o;Object.keys(i).forEach(function(e){var t,r;var a=i[e];if((a===null||a===void 0?void 0:(t=a.getMetadata())===null||t===void 0?void 0:(r=t.getParent())===null||r===void 0?void 0:r.getName())==="sap.fe.core.AppComponent"){o=a}});if(o){var n=o.getDiagnostics().getIssuesByCategory(s[r],a);n.forEach(function(t){e.addIssue({severity:u(t.severity),details:t.details,context:{id:t.category}})})}};r.getIssueByCategory=v;return r},false);
//# sourceMappingURL=CommonHelper.js.map