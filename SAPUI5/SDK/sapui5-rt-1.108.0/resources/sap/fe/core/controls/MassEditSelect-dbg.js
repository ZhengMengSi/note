/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/m/Select", "sap/m/SelectRenderer"], function (Select, SelectRenderer) {
  "use strict";

  var MassEditSelect = Select.extend("sap.fe.core.controls.MassEditSelect", {
    metadata: {
      properties: {
        showValueHelp: {
          type: "boolean"
        },
        valueHelpIconSrc: {
          type: "string"
        },
        selectValue: {
          type: "string"
        }
      },
      events: {
        valueHelpRequest: {}
      },
      interfaces: ["sap.ui.core.IFormContent"]
    },
    renderer: {
      apiVersion: 2,
      render: SelectRenderer.render
    }
  });
  return MassEditSelect;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJNYXNzRWRpdFNlbGVjdCIsIlNlbGVjdCIsImV4dGVuZCIsIm1ldGFkYXRhIiwicHJvcGVydGllcyIsInNob3dWYWx1ZUhlbHAiLCJ0eXBlIiwidmFsdWVIZWxwSWNvblNyYyIsInNlbGVjdFZhbHVlIiwiZXZlbnRzIiwidmFsdWVIZWxwUmVxdWVzdCIsImludGVyZmFjZXMiLCJyZW5kZXJlciIsImFwaVZlcnNpb24iLCJyZW5kZXIiLCJTZWxlY3RSZW5kZXJlciJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiTWFzc0VkaXRTZWxlY3QudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb25zdHJ1Y3RvciBmb3IgYSBuZXcgY3VzdG9tIGNvbWJvYm94LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBbc0lkXSBJRCBmb3IgdGhlIG5ldyBjb250cm9sLCBnZW5lcmF0ZWQgYXV0b21hdGljYWxseSBpZiBubyBJRCBpcyBnaXZlblxuICogQHBhcmFtIHtvYmplY3R9IFttU2V0dGluZ3NdIEluaXRpYWwgc2V0dGluZ3MgZm9yIHRoZSBuZXcgY29udHJvbFxuICogQGNsYXNzIFJlcHJlc2VudHMgYSBjdXN0b20gY29tYm9ib3ggb24gdGhlIFVJLlxuICogQGV4dGVuZHMgc2FwLm0uU2VsZWN0XG4gKiBAY2xhc3NcbiAqIEBwcml2YXRlXG4gKiBAc2luY2UgMS45OC4wXG4gKiBAYWxpYXMgY29udHJvbCBzYXAuZmUuY29yZS5jb250cm9scy5NYXNzRWRpdFNlbGVjdFxuICovXG5cbmltcG9ydCBTZWxlY3QgZnJvbSBcInNhcC9tL1NlbGVjdFwiO1xuaW1wb3J0IFNlbGVjdFJlbmRlcmVyIGZyb20gXCJzYXAvbS9TZWxlY3RSZW5kZXJlclwiO1xuXG5jb25zdCBNYXNzRWRpdFNlbGVjdCA9IFNlbGVjdC5leHRlbmQoXCJzYXAuZmUuY29yZS5jb250cm9scy5NYXNzRWRpdFNlbGVjdFwiLCB7XG5cdG1ldGFkYXRhOiB7XG5cdFx0cHJvcGVydGllczoge1xuXHRcdFx0c2hvd1ZhbHVlSGVscDoge1xuXHRcdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxuXHRcdFx0fSxcblx0XHRcdHZhbHVlSGVscEljb25TcmM6IHtcblx0XHRcdFx0dHlwZTogXCJzdHJpbmdcIlxuXHRcdFx0fSxcblx0XHRcdHNlbGVjdFZhbHVlOiB7XG5cdFx0XHRcdHR5cGU6IFwic3RyaW5nXCJcblx0XHRcdH1cblx0XHR9LFxuXHRcdGV2ZW50czoge1xuXHRcdFx0dmFsdWVIZWxwUmVxdWVzdDoge31cblx0XHR9LFxuXHRcdGludGVyZmFjZXM6IFtcInNhcC51aS5jb3JlLklGb3JtQ29udGVudFwiXVxuXHR9LFxuXHRyZW5kZXJlcjoge1xuXHRcdGFwaVZlcnNpb246IDIsXG5cdFx0cmVuZGVyOiBTZWxlY3RSZW5kZXJlci5yZW5kZXJcblx0fVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IE1hc3NFZGl0U2VsZWN0O1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7O0VBZ0JBLElBQU1BLGNBQWMsR0FBR0MsTUFBTSxDQUFDQyxNQUFQLENBQWMscUNBQWQsRUFBcUQ7SUFDM0VDLFFBQVEsRUFBRTtNQUNUQyxVQUFVLEVBQUU7UUFDWEMsYUFBYSxFQUFFO1VBQ2RDLElBQUksRUFBRTtRQURRLENBREo7UUFJWEMsZ0JBQWdCLEVBQUU7VUFDakJELElBQUksRUFBRTtRQURXLENBSlA7UUFPWEUsV0FBVyxFQUFFO1VBQ1pGLElBQUksRUFBRTtRQURNO01BUEYsQ0FESDtNQVlURyxNQUFNLEVBQUU7UUFDUEMsZ0JBQWdCLEVBQUU7TUFEWCxDQVpDO01BZVRDLFVBQVUsRUFBRSxDQUFDLDBCQUFEO0lBZkgsQ0FEaUU7SUFrQjNFQyxRQUFRLEVBQUU7TUFDVEMsVUFBVSxFQUFFLENBREg7TUFFVEMsTUFBTSxFQUFFQyxjQUFjLENBQUNEO0lBRmQ7RUFsQmlFLENBQXJELENBQXZCO1NBd0JlZCxjIn0=