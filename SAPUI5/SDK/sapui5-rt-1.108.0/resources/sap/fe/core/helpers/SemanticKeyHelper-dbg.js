/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log"], function (Log) {
  "use strict";

  var SemanticKeyHelper = {
    getSemanticKeys: function (oMetaModel, sEntitySetName) {
      return oMetaModel.getObject("/".concat(sEntitySetName, "/@com.sap.vocabularies.Common.v1.SemanticKey"));
    },
    getSemanticObjectInformation: function (oMetaModel, sEntitySetName) {
      var oSemanticObject = oMetaModel.getObject("/".concat(sEntitySetName, "/@com.sap.vocabularies.Common.v1.SemanticObject"));
      var aSemanticKeys = this.getSemanticKeys(oMetaModel, sEntitySetName);
      return {
        semanticObject: oSemanticObject,
        semanticKeys: aSemanticKeys
      };
    },
    getSemanticPath: function (oContext) {
      var bStrict = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var oMetaModel = oContext.getModel().getMetaModel(),
          sEntitySetName = oMetaModel.getMetaContext(oContext.getPath()).getObject("@sapui.name"),
          oSemanticObjectInformation = this.getSemanticObjectInformation(oMetaModel, sEntitySetName);
      var sTechnicalPath, sSemanticPath;

      if (oContext.isA("sap.ui.model.odata.v4.ODataListBinding") && oContext.isRelative()) {
        sTechnicalPath = oContext.getHeaderContext().getPath();
      } else {
        sTechnicalPath = oContext.getPath();
      }

      if (this._isPathForSemantic(sTechnicalPath) && oSemanticObjectInformation.semanticKeys) {
        var aSemanticKeys = oSemanticObjectInformation.semanticKeys,
            oEntityType = oMetaModel.getObject("/".concat(oMetaModel.getObject("/".concat(sEntitySetName)).$Type));

        try {
          var sSemanticKeysPart = aSemanticKeys.map(function (oSemanticKey) {
            var sPropertyPath = oSemanticKey.$PropertyPath;
            var sKeyValue = oContext.getProperty(sPropertyPath);

            if (sKeyValue === undefined || sKeyValue === null) {
              throw new Error("Couldn't resolve semantic key value for ".concat(sPropertyPath));
            } else {
              if (oEntityType[sPropertyPath].$Type === "Edm.String") {
                sKeyValue = "'".concat(encodeURIComponent(sKeyValue), "'");
              }

              if (aSemanticKeys.length > 1) {
                // Several semantic keys --> path should be entitySet(key1=value1, key2=value2, ...)
                // Otherwise we keep entitySet(keyValue)
                sKeyValue = "".concat(sPropertyPath, "=").concat(sKeyValue);
              }

              return sKeyValue;
            }
          }).join(",");
          sSemanticPath = "/".concat(sEntitySetName, "(").concat(sSemanticKeysPart, ")");
        } catch (e) {
          Log.info(e);
        }
      }

      return bStrict ? sSemanticPath : sSemanticPath || sTechnicalPath;
    },
    // ==============================
    // INTERNAL METHODS
    // ==============================
    _isPathForSemantic: function (sPath) {
      // Only path on root objects allow semantic keys, i.e. sPath = xxx(yyy)
      return /^[^\(\)]+\([^\(\)]+\)$/.test(sPath);
    }
  };
  return SemanticKeyHelper;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJTZW1hbnRpY0tleUhlbHBlciIsImdldFNlbWFudGljS2V5cyIsIm9NZXRhTW9kZWwiLCJzRW50aXR5U2V0TmFtZSIsImdldE9iamVjdCIsImdldFNlbWFudGljT2JqZWN0SW5mb3JtYXRpb24iLCJvU2VtYW50aWNPYmplY3QiLCJhU2VtYW50aWNLZXlzIiwic2VtYW50aWNPYmplY3QiLCJzZW1hbnRpY0tleXMiLCJnZXRTZW1hbnRpY1BhdGgiLCJvQ29udGV4dCIsImJTdHJpY3QiLCJnZXRNb2RlbCIsImdldE1ldGFNb2RlbCIsImdldE1ldGFDb250ZXh0IiwiZ2V0UGF0aCIsIm9TZW1hbnRpY09iamVjdEluZm9ybWF0aW9uIiwic1RlY2huaWNhbFBhdGgiLCJzU2VtYW50aWNQYXRoIiwiaXNBIiwiaXNSZWxhdGl2ZSIsImdldEhlYWRlckNvbnRleHQiLCJfaXNQYXRoRm9yU2VtYW50aWMiLCJvRW50aXR5VHlwZSIsIiRUeXBlIiwic1NlbWFudGljS2V5c1BhcnQiLCJtYXAiLCJvU2VtYW50aWNLZXkiLCJzUHJvcGVydHlQYXRoIiwiJFByb3BlcnR5UGF0aCIsInNLZXlWYWx1ZSIsImdldFByb3BlcnR5IiwidW5kZWZpbmVkIiwiRXJyb3IiLCJlbmNvZGVVUklDb21wb25lbnQiLCJsZW5ndGgiLCJqb2luIiwiZSIsIkxvZyIsImluZm8iLCJzUGF0aCIsInRlc3QiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIlNlbWFudGljS2V5SGVscGVyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMb2cgZnJvbSBcInNhcC9iYXNlL0xvZ1wiO1xuaW1wb3J0IHR5cGUgT0RhdGFNZXRhTW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NC9PRGF0YU1ldGFNb2RlbFwiO1xuXG5jb25zdCBTZW1hbnRpY0tleUhlbHBlciA9IHtcblx0Z2V0U2VtYW50aWNLZXlzOiBmdW5jdGlvbiAob01ldGFNb2RlbDogT0RhdGFNZXRhTW9kZWwsIHNFbnRpdHlTZXROYW1lOiBzdHJpbmcpIHtcblx0XHRyZXR1cm4gb01ldGFNb2RlbC5nZXRPYmplY3QoYC8ke3NFbnRpdHlTZXROYW1lfS9AY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlNlbWFudGljS2V5YCk7XG5cdH0sXG5cdGdldFNlbWFudGljT2JqZWN0SW5mb3JtYXRpb246IGZ1bmN0aW9uIChvTWV0YU1vZGVsOiBPRGF0YU1ldGFNb2RlbCwgc0VudGl0eVNldE5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IG9TZW1hbnRpY09iamVjdCA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAvJHtzRW50aXR5U2V0TmFtZX0vQGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5TZW1hbnRpY09iamVjdGApO1xuXHRcdGNvbnN0IGFTZW1hbnRpY0tleXMgPSB0aGlzLmdldFNlbWFudGljS2V5cyhvTWV0YU1vZGVsLCBzRW50aXR5U2V0TmFtZSk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHNlbWFudGljT2JqZWN0OiBvU2VtYW50aWNPYmplY3QsXG5cdFx0XHRzZW1hbnRpY0tleXM6IGFTZW1hbnRpY0tleXNcblx0XHR9O1xuXHR9LFxuXHRnZXRTZW1hbnRpY1BhdGg6IGZ1bmN0aW9uIChvQ29udGV4dDogYW55LCBiU3RyaWN0OiBib29sZWFuID0gZmFsc2UpIHtcblx0XHRjb25zdCBvTWV0YU1vZGVsID0gb0NvbnRleHQuZ2V0TW9kZWwoKS5nZXRNZXRhTW9kZWwoKSxcblx0XHRcdHNFbnRpdHlTZXROYW1lID0gb01ldGFNb2RlbC5nZXRNZXRhQ29udGV4dChvQ29udGV4dC5nZXRQYXRoKCkpLmdldE9iamVjdChcIkBzYXB1aS5uYW1lXCIpLFxuXHRcdFx0b1NlbWFudGljT2JqZWN0SW5mb3JtYXRpb24gPSB0aGlzLmdldFNlbWFudGljT2JqZWN0SW5mb3JtYXRpb24ob01ldGFNb2RlbCwgc0VudGl0eVNldE5hbWUpO1xuXHRcdGxldCBzVGVjaG5pY2FsUGF0aCwgc1NlbWFudGljUGF0aDtcblxuXHRcdGlmIChvQ29udGV4dC5pc0EoXCJzYXAudWkubW9kZWwub2RhdGEudjQuT0RhdGFMaXN0QmluZGluZ1wiKSAmJiBvQ29udGV4dC5pc1JlbGF0aXZlKCkpIHtcblx0XHRcdHNUZWNobmljYWxQYXRoID0gb0NvbnRleHQuZ2V0SGVhZGVyQ29udGV4dCgpLmdldFBhdGgoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c1RlY2huaWNhbFBhdGggPSBvQ29udGV4dC5nZXRQYXRoKCk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX2lzUGF0aEZvclNlbWFudGljKHNUZWNobmljYWxQYXRoKSAmJiBvU2VtYW50aWNPYmplY3RJbmZvcm1hdGlvbi5zZW1hbnRpY0tleXMpIHtcblx0XHRcdGNvbnN0IGFTZW1hbnRpY0tleXMgPSBvU2VtYW50aWNPYmplY3RJbmZvcm1hdGlvbi5zZW1hbnRpY0tleXMsXG5cdFx0XHRcdG9FbnRpdHlUeXBlID0gb01ldGFNb2RlbC5nZXRPYmplY3QoYC8ke29NZXRhTW9kZWwuZ2V0T2JqZWN0KGAvJHtzRW50aXR5U2V0TmFtZX1gKS4kVHlwZX1gKTtcblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0Y29uc3Qgc1NlbWFudGljS2V5c1BhcnQgPSBhU2VtYW50aWNLZXlzXG5cdFx0XHRcdFx0Lm1hcChmdW5jdGlvbiAob1NlbWFudGljS2V5OiBhbnkpIHtcblx0XHRcdFx0XHRcdGNvbnN0IHNQcm9wZXJ0eVBhdGggPSBvU2VtYW50aWNLZXkuJFByb3BlcnR5UGF0aDtcblx0XHRcdFx0XHRcdGxldCBzS2V5VmFsdWUgPSBvQ29udGV4dC5nZXRQcm9wZXJ0eShzUHJvcGVydHlQYXRoKTtcblxuXHRcdFx0XHRcdFx0aWYgKHNLZXlWYWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHNLZXlWYWx1ZSA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYENvdWxkbid0IHJlc29sdmUgc2VtYW50aWMga2V5IHZhbHVlIGZvciAke3NQcm9wZXJ0eVBhdGh9YCk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRpZiAob0VudGl0eVR5cGVbc1Byb3BlcnR5UGF0aF0uJFR5cGUgPT09IFwiRWRtLlN0cmluZ1wiKSB7XG5cdFx0XHRcdFx0XHRcdFx0c0tleVZhbHVlID0gYCcke2VuY29kZVVSSUNvbXBvbmVudChzS2V5VmFsdWUpfSdgO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmIChhU2VtYW50aWNLZXlzLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0XHRcdFx0XHQvLyBTZXZlcmFsIHNlbWFudGljIGtleXMgLS0+IHBhdGggc2hvdWxkIGJlIGVudGl0eVNldChrZXkxPXZhbHVlMSwga2V5Mj12YWx1ZTIsIC4uLilcblx0XHRcdFx0XHRcdFx0XHQvLyBPdGhlcndpc2Ugd2Uga2VlcCBlbnRpdHlTZXQoa2V5VmFsdWUpXG5cdFx0XHRcdFx0XHRcdFx0c0tleVZhbHVlID0gYCR7c1Byb3BlcnR5UGF0aH09JHtzS2V5VmFsdWV9YDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gc0tleVZhbHVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmpvaW4oXCIsXCIpO1xuXG5cdFx0XHRcdHNTZW1hbnRpY1BhdGggPSBgLyR7c0VudGl0eVNldE5hbWV9KCR7c1NlbWFudGljS2V5c1BhcnR9KWA7XG5cdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdExvZy5pbmZvKGUgYXMgYW55KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gYlN0cmljdCA/IHNTZW1hbnRpY1BhdGggOiBzU2VtYW50aWNQYXRoIHx8IHNUZWNobmljYWxQYXRoO1xuXHR9LFxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQvLyBJTlRFUk5BTCBNRVRIT0RTXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdF9pc1BhdGhGb3JTZW1hbnRpYzogZnVuY3Rpb24gKHNQYXRoOiBhbnkpIHtcblx0XHQvLyBPbmx5IHBhdGggb24gcm9vdCBvYmplY3RzIGFsbG93IHNlbWFudGljIGtleXMsIGkuZS4gc1BhdGggPSB4eHgoeXl5KVxuXHRcdHJldHVybiAvXlteXFwoXFwpXStcXChbXlxcKFxcKV0rXFwpJC8udGVzdChzUGF0aCk7XG5cdH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFNlbWFudGljS2V5SGVscGVyO1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7O0VBR0EsSUFBTUEsaUJBQWlCLEdBQUc7SUFDekJDLGVBQWUsRUFBRSxVQUFVQyxVQUFWLEVBQXNDQyxjQUF0QyxFQUE4RDtNQUM5RSxPQUFPRCxVQUFVLENBQUNFLFNBQVgsWUFBeUJELGNBQXpCLGtEQUFQO0lBQ0EsQ0FId0I7SUFJekJFLDRCQUE0QixFQUFFLFVBQVVILFVBQVYsRUFBc0NDLGNBQXRDLEVBQThEO01BQzNGLElBQU1HLGVBQWUsR0FBR0osVUFBVSxDQUFDRSxTQUFYLFlBQXlCRCxjQUF6QixxREFBeEI7TUFDQSxJQUFNSSxhQUFhLEdBQUcsS0FBS04sZUFBTCxDQUFxQkMsVUFBckIsRUFBaUNDLGNBQWpDLENBQXRCO01BQ0EsT0FBTztRQUNOSyxjQUFjLEVBQUVGLGVBRFY7UUFFTkcsWUFBWSxFQUFFRjtNQUZSLENBQVA7SUFJQSxDQVh3QjtJQVl6QkcsZUFBZSxFQUFFLFVBQVVDLFFBQVYsRUFBbUQ7TUFBQSxJQUExQkMsT0FBMEIsdUVBQVAsS0FBTztNQUNuRSxJQUFNVixVQUFVLEdBQUdTLFFBQVEsQ0FBQ0UsUUFBVCxHQUFvQkMsWUFBcEIsRUFBbkI7TUFBQSxJQUNDWCxjQUFjLEdBQUdELFVBQVUsQ0FBQ2EsY0FBWCxDQUEwQkosUUFBUSxDQUFDSyxPQUFULEVBQTFCLEVBQThDWixTQUE5QyxDQUF3RCxhQUF4RCxDQURsQjtNQUFBLElBRUNhLDBCQUEwQixHQUFHLEtBQUtaLDRCQUFMLENBQWtDSCxVQUFsQyxFQUE4Q0MsY0FBOUMsQ0FGOUI7TUFHQSxJQUFJZSxjQUFKLEVBQW9CQyxhQUFwQjs7TUFFQSxJQUFJUixRQUFRLENBQUNTLEdBQVQsQ0FBYSx3Q0FBYixLQUEwRFQsUUFBUSxDQUFDVSxVQUFULEVBQTlELEVBQXFGO1FBQ3BGSCxjQUFjLEdBQUdQLFFBQVEsQ0FBQ1csZ0JBQVQsR0FBNEJOLE9BQTVCLEVBQWpCO01BQ0EsQ0FGRCxNQUVPO1FBQ05FLGNBQWMsR0FBR1AsUUFBUSxDQUFDSyxPQUFULEVBQWpCO01BQ0E7O01BRUQsSUFBSSxLQUFLTyxrQkFBTCxDQUF3QkwsY0FBeEIsS0FBMkNELDBCQUEwQixDQUFDUixZQUExRSxFQUF3RjtRQUN2RixJQUFNRixhQUFhLEdBQUdVLDBCQUEwQixDQUFDUixZQUFqRDtRQUFBLElBQ0NlLFdBQVcsR0FBR3RCLFVBQVUsQ0FBQ0UsU0FBWCxZQUF5QkYsVUFBVSxDQUFDRSxTQUFYLFlBQXlCRCxjQUF6QixHQUEyQ3NCLEtBQXBFLEVBRGY7O1FBR0EsSUFBSTtVQUNILElBQU1DLGlCQUFpQixHQUFHbkIsYUFBYSxDQUNyQ29CLEdBRHdCLENBQ3BCLFVBQVVDLFlBQVYsRUFBNkI7WUFDakMsSUFBTUMsYUFBYSxHQUFHRCxZQUFZLENBQUNFLGFBQW5DO1lBQ0EsSUFBSUMsU0FBUyxHQUFHcEIsUUFBUSxDQUFDcUIsV0FBVCxDQUFxQkgsYUFBckIsQ0FBaEI7O1lBRUEsSUFBSUUsU0FBUyxLQUFLRSxTQUFkLElBQTJCRixTQUFTLEtBQUssSUFBN0MsRUFBbUQ7Y0FDbEQsTUFBTSxJQUFJRyxLQUFKLG1EQUFxREwsYUFBckQsRUFBTjtZQUNBLENBRkQsTUFFTztjQUNOLElBQUlMLFdBQVcsQ0FBQ0ssYUFBRCxDQUFYLENBQTJCSixLQUEzQixLQUFxQyxZQUF6QyxFQUF1RDtnQkFDdERNLFNBQVMsY0FBT0ksa0JBQWtCLENBQUNKLFNBQUQsQ0FBekIsTUFBVDtjQUNBOztjQUNELElBQUl4QixhQUFhLENBQUM2QixNQUFkLEdBQXVCLENBQTNCLEVBQThCO2dCQUM3QjtnQkFDQTtnQkFDQUwsU0FBUyxhQUFNRixhQUFOLGNBQXVCRSxTQUF2QixDQUFUO2NBQ0E7O2NBQ0QsT0FBT0EsU0FBUDtZQUNBO1VBQ0QsQ0FsQndCLEVBbUJ4Qk0sSUFuQndCLENBbUJuQixHQW5CbUIsQ0FBMUI7VUFxQkFsQixhQUFhLGNBQU9oQixjQUFQLGNBQXlCdUIsaUJBQXpCLE1BQWI7UUFDQSxDQXZCRCxDQXVCRSxPQUFPWSxDQUFQLEVBQVU7VUFDWEMsR0FBRyxDQUFDQyxJQUFKLENBQVNGLENBQVQ7UUFDQTtNQUNEOztNQUVELE9BQU8xQixPQUFPLEdBQUdPLGFBQUgsR0FBbUJBLGFBQWEsSUFBSUQsY0FBbEQ7SUFDQSxDQXpEd0I7SUEyRHpCO0lBQ0E7SUFDQTtJQUVBSyxrQkFBa0IsRUFBRSxVQUFVa0IsS0FBVixFQUFzQjtNQUN6QztNQUNBLE9BQU8seUJBQXlCQyxJQUF6QixDQUE4QkQsS0FBOUIsQ0FBUDtJQUNBO0VBbEV3QixDQUExQjtTQXFFZXpDLGlCIn0=