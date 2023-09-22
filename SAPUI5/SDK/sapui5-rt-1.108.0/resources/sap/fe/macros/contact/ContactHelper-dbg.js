/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/Core"], function (Core) {
  "use strict";

  var oRB = Core.getLibraryResourceBundle("sap.ui.mdc");
  var ContactHelper = {
    // emails: first preferred, then work
    // phones : first work, then cell, then fax, then preferred
    // address : first preferred, then work
    formatUri: function (itemType, value) {
      switch (itemType) {
        case "phone":
          return "tel:".concat(value);

        case "mail":
          return "mailto:".concat(value);

        default:
          return value;
      }
    },
    formatAddress: function (street, code, locality, region, country) {
      var textToWrite = [];

      if (street) {
        textToWrite.push(street);
      }

      if (code && locality) {
        textToWrite.push("".concat(code, " ").concat(locality));
      } else {
        if (code) {
          textToWrite.push(code);
        }

        if (locality) {
          textToWrite.push(locality);
        }
      }

      if (region) {
        textToWrite.push(region);
      }

      if (country) {
        textToWrite.push(country);
      }

      return textToWrite.join(", ");
    },
    computeLabel: function (itemType, subType) {
      switch (itemType) {
        case "role":
          return oRB.getText("info.POPOVER_CONTACT_SECTION_ROLE");

        case "title":
          return oRB.getText("info.POPOVER_CONTACT_SECTION_JOBTITLE");

        case "org":
          return oRB.getText("info.POPOVER_CONTACT_SECTION_DEPARTMENT");

        case "phone":
          if (subType.indexOf("fax") > -1) {
            return oRB.getText("info.POPOVER_CONTACT_SECTION_FAX");
          } else if (subType.indexOf("work") > -1) {
            return oRB.getText("info.POPOVER_CONTACT_SECTION_PHONE");
          } else if (subType.indexOf("cell") > -1) {
            return oRB.getText("info.POPOVER_CONTACT_SECTION_MOBILE");
          } else if (subType.indexOf("preferred") > -1) {
            return oRB.getText("info.POPOVER_CONTACT_SECTION_PHONE");
          }

          break;

        case "mail":
          return oRB.getText("info.POPOVER_CONTACT_SECTION_EMAIL");

        case "address":
          return oRB.getText("info.POPOVER_CONTACT_SECTION_ADR");

        default:
          return "contactItem";
      }
    },
    getContactTitle: function () {
      return oRB.getText("info.POPOVER_CONTACT_SECTION_TITLE");
    },
    getAvatarInitials: function (oInitials) {
      return oInitials ? oInitials : "";
    }
  };
  return ContactHelper;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJvUkIiLCJDb3JlIiwiZ2V0TGlicmFyeVJlc291cmNlQnVuZGxlIiwiQ29udGFjdEhlbHBlciIsImZvcm1hdFVyaSIsIml0ZW1UeXBlIiwidmFsdWUiLCJmb3JtYXRBZGRyZXNzIiwic3RyZWV0IiwiY29kZSIsImxvY2FsaXR5IiwicmVnaW9uIiwiY291bnRyeSIsInRleHRUb1dyaXRlIiwicHVzaCIsImpvaW4iLCJjb21wdXRlTGFiZWwiLCJzdWJUeXBlIiwiZ2V0VGV4dCIsImluZGV4T2YiLCJnZXRDb250YWN0VGl0bGUiLCJnZXRBdmF0YXJJbml0aWFscyIsIm9Jbml0aWFscyJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiQ29udGFjdEhlbHBlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ29yZSBmcm9tIFwic2FwL3VpL2NvcmUvQ29yZVwiO1xuXG5jb25zdCBvUkIgPSBDb3JlLmdldExpYnJhcnlSZXNvdXJjZUJ1bmRsZShcInNhcC51aS5tZGNcIik7XG5jb25zdCBDb250YWN0SGVscGVyID0ge1xuXHQvLyBlbWFpbHM6IGZpcnN0IHByZWZlcnJlZCwgdGhlbiB3b3JrXG5cdC8vIHBob25lcyA6IGZpcnN0IHdvcmssIHRoZW4gY2VsbCwgdGhlbiBmYXgsIHRoZW4gcHJlZmVycmVkXG5cdC8vIGFkZHJlc3MgOiBmaXJzdCBwcmVmZXJyZWQsIHRoZW4gd29ya1xuXHRmb3JtYXRVcmk6IGZ1bmN0aW9uIChpdGVtVHlwZTogYW55LCB2YWx1ZTogYW55KSB7XG5cdFx0c3dpdGNoIChpdGVtVHlwZSkge1xuXHRcdFx0Y2FzZSBcInBob25lXCI6XG5cdFx0XHRcdHJldHVybiBgdGVsOiR7dmFsdWV9YDtcblx0XHRcdGNhc2UgXCJtYWlsXCI6XG5cdFx0XHRcdHJldHVybiBgbWFpbHRvOiR7dmFsdWV9YDtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9XG5cdH0sXG5cdGZvcm1hdEFkZHJlc3M6IGZ1bmN0aW9uIChzdHJlZXQ6IGFueSwgY29kZTogYW55LCBsb2NhbGl0eTogYW55LCByZWdpb246IGFueSwgY291bnRyeTogYW55KSB7XG5cdFx0Y29uc3QgdGV4dFRvV3JpdGUgPSBbXTtcblx0XHRpZiAoc3RyZWV0KSB7XG5cdFx0XHR0ZXh0VG9Xcml0ZS5wdXNoKHN0cmVldCk7XG5cdFx0fVxuXHRcdGlmIChjb2RlICYmIGxvY2FsaXR5KSB7XG5cdFx0XHR0ZXh0VG9Xcml0ZS5wdXNoKGAke2NvZGV9ICR7bG9jYWxpdHl9YCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChjb2RlKSB7XG5cdFx0XHRcdHRleHRUb1dyaXRlLnB1c2goY29kZSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAobG9jYWxpdHkpIHtcblx0XHRcdFx0dGV4dFRvV3JpdGUucHVzaChsb2NhbGl0eSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChyZWdpb24pIHtcblx0XHRcdHRleHRUb1dyaXRlLnB1c2gocmVnaW9uKTtcblx0XHR9XG5cdFx0aWYgKGNvdW50cnkpIHtcblx0XHRcdHRleHRUb1dyaXRlLnB1c2goY291bnRyeSk7XG5cdFx0fVxuXHRcdHJldHVybiB0ZXh0VG9Xcml0ZS5qb2luKFwiLCBcIik7XG5cdH0sXG5cdGNvbXB1dGVMYWJlbDogZnVuY3Rpb24gKGl0ZW1UeXBlOiBhbnksIHN1YlR5cGU6IGFueSkge1xuXHRcdHN3aXRjaCAoaXRlbVR5cGUpIHtcblx0XHRcdGNhc2UgXCJyb2xlXCI6XG5cdFx0XHRcdHJldHVybiBvUkIuZ2V0VGV4dChcImluZm8uUE9QT1ZFUl9DT05UQUNUX1NFQ1RJT05fUk9MRVwiKTtcblx0XHRcdGNhc2UgXCJ0aXRsZVwiOlxuXHRcdFx0XHRyZXR1cm4gb1JCLmdldFRleHQoXCJpbmZvLlBPUE9WRVJfQ09OVEFDVF9TRUNUSU9OX0pPQlRJVExFXCIpO1xuXHRcdFx0Y2FzZSBcIm9yZ1wiOlxuXHRcdFx0XHRyZXR1cm4gb1JCLmdldFRleHQoXCJpbmZvLlBPUE9WRVJfQ09OVEFDVF9TRUNUSU9OX0RFUEFSVE1FTlRcIik7XG5cdFx0XHRjYXNlIFwicGhvbmVcIjpcblx0XHRcdFx0aWYgKHN1YlR5cGUuaW5kZXhPZihcImZheFwiKSA+IC0xKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9SQi5nZXRUZXh0KFwiaW5mby5QT1BPVkVSX0NPTlRBQ1RfU0VDVElPTl9GQVhcIik7XG5cdFx0XHRcdH0gZWxzZSBpZiAoc3ViVHlwZS5pbmRleE9mKFwid29ya1wiKSA+IC0xKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9SQi5nZXRUZXh0KFwiaW5mby5QT1BPVkVSX0NPTlRBQ1RfU0VDVElPTl9QSE9ORVwiKTtcblx0XHRcdFx0fSBlbHNlIGlmIChzdWJUeXBlLmluZGV4T2YoXCJjZWxsXCIpID4gLTEpIHtcblx0XHRcdFx0XHRyZXR1cm4gb1JCLmdldFRleHQoXCJpbmZvLlBPUE9WRVJfQ09OVEFDVF9TRUNUSU9OX01PQklMRVwiKTtcblx0XHRcdFx0fSBlbHNlIGlmIChzdWJUeXBlLmluZGV4T2YoXCJwcmVmZXJyZWRcIikgPiAtMSkge1xuXHRcdFx0XHRcdHJldHVybiBvUkIuZ2V0VGV4dChcImluZm8uUE9QT1ZFUl9DT05UQUNUX1NFQ1RJT05fUEhPTkVcIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwibWFpbFwiOlxuXHRcdFx0XHRyZXR1cm4gb1JCLmdldFRleHQoXCJpbmZvLlBPUE9WRVJfQ09OVEFDVF9TRUNUSU9OX0VNQUlMXCIpO1xuXHRcdFx0Y2FzZSBcImFkZHJlc3NcIjpcblx0XHRcdFx0cmV0dXJuIG9SQi5nZXRUZXh0KFwiaW5mby5QT1BPVkVSX0NPTlRBQ1RfU0VDVElPTl9BRFJcIik7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRyZXR1cm4gXCJjb250YWN0SXRlbVwiO1xuXHRcdH1cblx0fSxcblx0Z2V0Q29udGFjdFRpdGxlOiBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIG9SQi5nZXRUZXh0KFwiaW5mby5QT1BPVkVSX0NPTlRBQ1RfU0VDVElPTl9USVRMRVwiKTtcblx0fSxcblx0Z2V0QXZhdGFySW5pdGlhbHM6IGZ1bmN0aW9uIChvSW5pdGlhbHM6IGFueSkge1xuXHRcdHJldHVybiBvSW5pdGlhbHMgPyBvSW5pdGlhbHMgOiBcIlwiO1xuXHR9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBDb250YWN0SGVscGVyO1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7O0VBRUEsSUFBTUEsR0FBRyxHQUFHQyxJQUFJLENBQUNDLHdCQUFMLENBQThCLFlBQTlCLENBQVo7RUFDQSxJQUFNQyxhQUFhLEdBQUc7SUFDckI7SUFDQTtJQUNBO0lBQ0FDLFNBQVMsRUFBRSxVQUFVQyxRQUFWLEVBQXlCQyxLQUF6QixFQUFxQztNQUMvQyxRQUFRRCxRQUFSO1FBQ0MsS0FBSyxPQUFMO1VBQ0MscUJBQWNDLEtBQWQ7O1FBQ0QsS0FBSyxNQUFMO1VBQ0Msd0JBQWlCQSxLQUFqQjs7UUFDRDtVQUNDLE9BQU9BLEtBQVA7TUFORjtJQVFBLENBYm9CO0lBY3JCQyxhQUFhLEVBQUUsVUFBVUMsTUFBVixFQUF1QkMsSUFBdkIsRUFBa0NDLFFBQWxDLEVBQWlEQyxNQUFqRCxFQUE4REMsT0FBOUQsRUFBNEU7TUFDMUYsSUFBTUMsV0FBVyxHQUFHLEVBQXBCOztNQUNBLElBQUlMLE1BQUosRUFBWTtRQUNYSyxXQUFXLENBQUNDLElBQVosQ0FBaUJOLE1BQWpCO01BQ0E7O01BQ0QsSUFBSUMsSUFBSSxJQUFJQyxRQUFaLEVBQXNCO1FBQ3JCRyxXQUFXLENBQUNDLElBQVosV0FBb0JMLElBQXBCLGNBQTRCQyxRQUE1QjtNQUNBLENBRkQsTUFFTztRQUNOLElBQUlELElBQUosRUFBVTtVQUNUSSxXQUFXLENBQUNDLElBQVosQ0FBaUJMLElBQWpCO1FBQ0E7O1FBQ0QsSUFBSUMsUUFBSixFQUFjO1VBQ2JHLFdBQVcsQ0FBQ0MsSUFBWixDQUFpQkosUUFBakI7UUFDQTtNQUNEOztNQUNELElBQUlDLE1BQUosRUFBWTtRQUNYRSxXQUFXLENBQUNDLElBQVosQ0FBaUJILE1BQWpCO01BQ0E7O01BQ0QsSUFBSUMsT0FBSixFQUFhO1FBQ1pDLFdBQVcsQ0FBQ0MsSUFBWixDQUFpQkYsT0FBakI7TUFDQTs7TUFDRCxPQUFPQyxXQUFXLENBQUNFLElBQVosQ0FBaUIsSUFBakIsQ0FBUDtJQUNBLENBcENvQjtJQXFDckJDLFlBQVksRUFBRSxVQUFVWCxRQUFWLEVBQXlCWSxPQUF6QixFQUF1QztNQUNwRCxRQUFRWixRQUFSO1FBQ0MsS0FBSyxNQUFMO1VBQ0MsT0FBT0wsR0FBRyxDQUFDa0IsT0FBSixDQUFZLG1DQUFaLENBQVA7O1FBQ0QsS0FBSyxPQUFMO1VBQ0MsT0FBT2xCLEdBQUcsQ0FBQ2tCLE9BQUosQ0FBWSx1Q0FBWixDQUFQOztRQUNELEtBQUssS0FBTDtVQUNDLE9BQU9sQixHQUFHLENBQUNrQixPQUFKLENBQVkseUNBQVosQ0FBUDs7UUFDRCxLQUFLLE9BQUw7VUFDQyxJQUFJRCxPQUFPLENBQUNFLE9BQVIsQ0FBZ0IsS0FBaEIsSUFBeUIsQ0FBQyxDQUE5QixFQUFpQztZQUNoQyxPQUFPbkIsR0FBRyxDQUFDa0IsT0FBSixDQUFZLGtDQUFaLENBQVA7VUFDQSxDQUZELE1BRU8sSUFBSUQsT0FBTyxDQUFDRSxPQUFSLENBQWdCLE1BQWhCLElBQTBCLENBQUMsQ0FBL0IsRUFBa0M7WUFDeEMsT0FBT25CLEdBQUcsQ0FBQ2tCLE9BQUosQ0FBWSxvQ0FBWixDQUFQO1VBQ0EsQ0FGTSxNQUVBLElBQUlELE9BQU8sQ0FBQ0UsT0FBUixDQUFnQixNQUFoQixJQUEwQixDQUFDLENBQS9CLEVBQWtDO1lBQ3hDLE9BQU9uQixHQUFHLENBQUNrQixPQUFKLENBQVkscUNBQVosQ0FBUDtVQUNBLENBRk0sTUFFQSxJQUFJRCxPQUFPLENBQUNFLE9BQVIsQ0FBZ0IsV0FBaEIsSUFBK0IsQ0FBQyxDQUFwQyxFQUF1QztZQUM3QyxPQUFPbkIsR0FBRyxDQUFDa0IsT0FBSixDQUFZLG9DQUFaLENBQVA7VUFDQTs7VUFDRDs7UUFDRCxLQUFLLE1BQUw7VUFDQyxPQUFPbEIsR0FBRyxDQUFDa0IsT0FBSixDQUFZLG9DQUFaLENBQVA7O1FBQ0QsS0FBSyxTQUFMO1VBQ0MsT0FBT2xCLEdBQUcsQ0FBQ2tCLE9BQUosQ0FBWSxrQ0FBWixDQUFQOztRQUNEO1VBQ0MsT0FBTyxhQUFQO01BdkJGO0lBeUJBLENBL0RvQjtJQWdFckJFLGVBQWUsRUFBRSxZQUFZO01BQzVCLE9BQU9wQixHQUFHLENBQUNrQixPQUFKLENBQVksb0NBQVosQ0FBUDtJQUNBLENBbEVvQjtJQW1FckJHLGlCQUFpQixFQUFFLFVBQVVDLFNBQVYsRUFBMEI7TUFDNUMsT0FBT0EsU0FBUyxHQUFHQSxTQUFILEdBQWUsRUFBL0I7SUFDQTtFQXJFb0IsQ0FBdEI7U0F3RWVuQixhIn0=