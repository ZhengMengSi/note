sap.ui.define(["sap/fe/macros/StableIdHelper", "sap/ui/model/odata/v4/AnnotationHelper", "./ManifestSettings", "./ConverterUtil"], function (StableIdHelper, AnnotationHelper, ManifestSettings, ConverterUtil) {
  "use strict";

  var SectionType = ManifestSettings.SectionType;
  var Placement = ManifestSettings.Placement;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var isPathExpression = function (expression) {
    return expression.type !== undefined && expression.type === "Path";
  };

  var getBindingExpression = function (annotationValue, currentContext, defaultValue) {
    if (!annotationValue) {
      return defaultValue;
    } else if (isPathExpression(annotationValue)) {
      return AnnotationHelper.format({
        $Path: annotationValue.path
      }, {
        context: currentContext
      });
    } else {
      return AnnotationHelper.format(annotationValue, {
        context: currentContext
      });
    }
  };

  var getInverseBindingExpression = function (annotationValue, currentContext, defaultValue) {
    if (!annotationValue) {
      return defaultValue;
    }

    var bindingExpression = getBindingExpression(annotationValue, currentContext, defaultValue);
    return "{= !$".concat(bindingExpression, "}");
  };

  var getFacetID = function (stableIdParts, facetDefinition, currentTarget) {
    var idParts = stableIdParts.concat();

    if (facetDefinition.ID) {
      idParts.push(facetDefinition.ID);
    } else {
      switch (facetDefinition.$Type) {
        case "com.sap.vocabularies.UI.v1.ReferenceURLFacet":
          idParts.push(currentTarget);
          break;

        case "com.sap.vocabularies.UI.v1.ReferenceFacet":
          idParts.push(facetDefinition.Target.value);
          break;

        case "com.sap.vocabularies.UI.v1.CollectionFacet":
          idParts.push(currentTarget);
          break;
      }
    }

    return StableIdHelper.generate(idParts);
  };

  var getFacetRefKey = function (facetDefinition, fallback) {
    var _facetDefinition$ID, _facetDefinition$Labe;

    return ((_facetDefinition$ID = facetDefinition.ID) === null || _facetDefinition$ID === void 0 ? void 0 : _facetDefinition$ID.toString()) || ((_facetDefinition$Labe = facetDefinition.Label) === null || _facetDefinition$Labe === void 0 ? void 0 : _facetDefinition$Labe.toString()) || fallback;
  };

  var prepareSection = function (section, key) {
    if (!section) {
      throw new Error("undefined section");
    }

    if (section.visible === undefined || section.visible === null) {
      section.visible = true;
    }

    section.showTitle = section.title !== undefined;

    if (!section.type) {
      section.type = SectionType.Default;
    }

    if ((section.type === SectionType.XMLFragment || section.type === SectionType.Default) && (!section.subSections || !Object.keys(section.subSections).length)) {
      section.subSections = {
        "default": _objectSpread({}, section, {}, {
          showTitle: false,
          position: undefined,
          controlId: StableIdHelper.generate(["fe", "opss", key])
        })
      };
    }

    return section;
  };

  var convertFacet = function (facetDefinition, oMetaModelContext, stableIdParts, currentTarget) {
    var _facetDefinition$anno, _facetDefinition$anno2;

    var section = {
      controlId: getFacetID(stableIdParts, facetDefinition, currentTarget),
      title: getBindingExpression(facetDefinition.Label, oMetaModelContext),
      visible: getInverseBindingExpression((_facetDefinition$anno = facetDefinition.annotations) === null || _facetDefinition$anno === void 0 ? void 0 : (_facetDefinition$anno2 = _facetDefinition$anno.UI) === null || _facetDefinition$anno2 === void 0 ? void 0 : _facetDefinition$anno2.Hidden, oMetaModelContext, true),
      annotationRef: oMetaModelContext.getPath("@".concat(currentTarget)),
      subSections: {},
      type: SectionType.Annotation
    };
    section.showTitle = section.title !== undefined;

    switch (facetDefinition.$Type) {
      case "com.sap.vocabularies.UI.v1.CollectionFacet":
        // Two possibilities, either we have a Collection of Collection or collection of reference facets
        var collectionChild = facetDefinition.Facets.find(function (facetDefinition) {
          return facetDefinition.$Type === "com.sap.vocabularies.UI.v1.CollectionFacet";
        });

        if (collectionChild) {
          var sectionKey;
          facetDefinition.Facets.forEach(function (facetDefinition, subFacetIndex) {
            var subSection = convertFacet(facetDefinition, oMetaModelContext, ["fe", "opss"], "".concat(currentTarget, "/Facets/").concat(subFacetIndex));

            if (sectionKey !== undefined) {
              subSection.position = {
                anchor: sectionKey,
                placement: Placement.After
              };
            }

            sectionKey = getFacetRefKey(facetDefinition, subFacetIndex.toString());
            section.subSections[sectionKey] = subSection;
          });
        } else {
          section.subSections[getFacetRefKey(facetDefinition, getFacetID(["fe", "opss"], facetDefinition, currentTarget))] = {
            controlId: getFacetID(["fe", "opss"], facetDefinition, currentTarget),
            title: section.title,
            type: SectionType.Annotation,
            visible: section.visible,
            annotationRef: section.annotationRef
          };
        }

        break;

      case "com.sap.vocabularies.UI.v1.ReferenceFacet":
        section.subSections[getFacetRefKey(facetDefinition, getFacetID(["fe", "opss"], facetDefinition, currentTarget))] = {
          controlId: getFacetID(["fe", "opss"], facetDefinition, currentTarget),
          title: section.title,
          type: SectionType.Annotation,
          visible: section.visible,
          annotationRef: section.annotationRef
        };
        break;

      case "com.sap.vocabularies.UI.v1.ReferenceURLFacet":
        break;
    }

    return section;
  };

  return {
    convertPage: function (entityType, oMetaModelContext, oManifestSettings, unaliasFn) {
      var _entityType$annotatio, _entityType$annotatio2;

      var sections = {};
      var sectionKey;
      (_entityType$annotatio = entityType.annotations.UI) === null || _entityType$annotatio === void 0 ? void 0 : (_entityType$annotatio2 = _entityType$annotatio.Facets) === null || _entityType$annotatio2 === void 0 ? void 0 : _entityType$annotatio2.forEach(function (facetDefinition, facetIndex) {
        var section = convertFacet(facetDefinition, oMetaModelContext, ["fe", "ops"], "".concat(unaliasFn("UI.Facets"), "/").concat(facetIndex));

        if (sectionKey != null) {
          section.position = {
            anchor: sectionKey,
            placement: Placement.After
          };
        }

        sectionKey = getFacetRefKey(facetDefinition, facetIndex.toString());
        sections[sectionKey] = section;
      });

      for (var key in (_oManifestSettings$co = oManifestSettings.content) === null || _oManifestSettings$co === void 0 ? void 0 : (_oManifestSettings$co2 = _oManifestSettings$co.body) === null || _oManifestSettings$co2 === void 0 ? void 0 : _oManifestSettings$co2.sections) {
        var _oManifestSettings$co, _oManifestSettings$co2, _oManifestSettings$co3, _oManifestSettings$co4;

        var customSection = (_oManifestSettings$co3 = oManifestSettings.content) === null || _oManifestSettings$co3 === void 0 ? void 0 : (_oManifestSettings$co4 = _oManifestSettings$co3.body) === null || _oManifestSettings$co4 === void 0 ? void 0 : _oManifestSettings$co4.sections[key];
        sections[key] = prepareSection(_objectSpread({}, {
          controlId: StableIdHelper.generate(["fe", "ops", key])
        }, {}, sections[key], {}, customSection), key);
      } // the "final" structure is different, e.g. resolve before/after ordering into arrays
      // TODO the final transform mechanism from the human readable form to "template ready" should happen at the very end, not here


      var parsedSections = ConverterUtil.orderByPosition(sections).filter(function (section) {
        return section.visible;
      }).map(function (section) {
        section.subSections = ConverterUtil.orderByPosition(section.subSections);
        return section;
      });
      return {
        sections: parsedSections
      };
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk9iamVjdFBhZ2VDb252ZXJ0ZXIudHMiXSwibmFtZXMiOlsiaXNQYXRoRXhwcmVzc2lvbiIsImV4cHJlc3Npb24iLCJ0eXBlIiwidW5kZWZpbmVkIiwiZ2V0QmluZGluZ0V4cHJlc3Npb24iLCJhbm5vdGF0aW9uVmFsdWUiLCJjdXJyZW50Q29udGV4dCIsImRlZmF1bHRWYWx1ZSIsIkFubm90YXRpb25IZWxwZXIiLCJmb3JtYXQiLCIkUGF0aCIsInBhdGgiLCJjb250ZXh0IiwiZ2V0SW52ZXJzZUJpbmRpbmdFeHByZXNzaW9uIiwiYmluZGluZ0V4cHJlc3Npb24iLCJnZXRGYWNldElEIiwic3RhYmxlSWRQYXJ0cyIsImZhY2V0RGVmaW5pdGlvbiIsImN1cnJlbnRUYXJnZXQiLCJpZFBhcnRzIiwiY29uY2F0IiwiSUQiLCJwdXNoIiwiJFR5cGUiLCJUYXJnZXQiLCJ2YWx1ZSIsIlN0YWJsZUlkSGVscGVyIiwiZ2VuZXJhdGUiLCJnZXRGYWNldFJlZktleSIsImZhbGxiYWNrIiwidG9TdHJpbmciLCJMYWJlbCIsInByZXBhcmVTZWN0aW9uIiwic2VjdGlvbiIsImtleSIsIkVycm9yIiwidmlzaWJsZSIsInNob3dUaXRsZSIsInRpdGxlIiwiU2VjdGlvblR5cGUiLCJEZWZhdWx0IiwiWE1MRnJhZ21lbnQiLCJzdWJTZWN0aW9ucyIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJwb3NpdGlvbiIsImNvbnRyb2xJZCIsImNvbnZlcnRGYWNldCIsIm9NZXRhTW9kZWxDb250ZXh0IiwiYW5ub3RhdGlvbnMiLCJVSSIsIkhpZGRlbiIsImFubm90YXRpb25SZWYiLCJnZXRQYXRoIiwiQW5ub3RhdGlvbiIsImNvbGxlY3Rpb25DaGlsZCIsIkZhY2V0cyIsImZpbmQiLCJzZWN0aW9uS2V5IiwiZm9yRWFjaCIsInN1YkZhY2V0SW5kZXgiLCJzdWJTZWN0aW9uIiwiYW5jaG9yIiwicGxhY2VtZW50IiwiUGxhY2VtZW50IiwiQWZ0ZXIiLCJjb252ZXJ0UGFnZSIsImVudGl0eVR5cGUiLCJvTWFuaWZlc3RTZXR0aW5ncyIsInVuYWxpYXNGbiIsInNlY3Rpb25zIiwiZmFjZXRJbmRleCIsImNvbnRlbnQiLCJib2R5IiwiY3VzdG9tU2VjdGlvbiIsInBhcnNlZFNlY3Rpb25zIiwiQ29udmVydGVyVXRpbCIsIm9yZGVyQnlQb3NpdGlvbiIsImZpbHRlciIsIm1hcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBa0JBLE1BQU1BLGdCQUFnQixHQUFHLFVBQVlDLFVBQVosRUFBd0U7QUFDaEcsV0FBT0EsVUFBVSxDQUFDQyxJQUFYLEtBQW9CQyxTQUFwQixJQUFpQ0YsVUFBVSxDQUFDQyxJQUFYLEtBQW9CLE1BQTVEO0FBQ0EsR0FGRDs7QUFJQSxNQUFNRSxvQkFBb0IsR0FBRyxVQUM1QkMsZUFENEIsRUFFNUJDLGNBRjRCLEVBRzVCQyxZQUg0QixFQUlMO0FBQ3ZCLFFBQUksQ0FBQ0YsZUFBTCxFQUFzQjtBQUNyQixhQUFPRSxZQUFQO0FBQ0EsS0FGRCxNQUVPLElBQUlQLGdCQUFnQixDQUFDSyxlQUFELENBQXBCLEVBQXVDO0FBQzdDLGFBQU9HLGdCQUFnQixDQUFDQyxNQUFqQixDQUF3QjtBQUFFQyxRQUFBQSxLQUFLLEVBQUVMLGVBQWUsQ0FBQ007QUFBekIsT0FBeEIsRUFBeUQ7QUFBRUMsUUFBQUEsT0FBTyxFQUFFTjtBQUFYLE9BQXpELENBQVA7QUFDQSxLQUZNLE1BRUE7QUFDTixhQUFPRSxnQkFBZ0IsQ0FBQ0MsTUFBakIsQ0FBd0JKLGVBQXhCLEVBQXlDO0FBQUVPLFFBQUFBLE9BQU8sRUFBRU47QUFBWCxPQUF6QyxDQUFQO0FBQ0E7QUFDRCxHQVpEOztBQWNBLE1BQU1PLDJCQUEyQixHQUFHLFVBQ25DUixlQURtQyxFQUVuQ0MsY0FGbUMsRUFHbkNDLFlBSG1DLEVBSVo7QUFDdkIsUUFBSSxDQUFDRixlQUFMLEVBQXNCO0FBQ3JCLGFBQU9FLFlBQVA7QUFDQTs7QUFDRCxRQUFNTyxpQkFBaUIsR0FBR1Ysb0JBQW9CLENBQUNDLGVBQUQsRUFBa0JDLGNBQWxCLEVB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WixVQUFELENBQVIsR0FBdUIxQixPQUF2QjtBQUNBLE9BUEQ7O0FBU0EsV0FBSyxJQUFJQyxHQUFULDZCQUFnQm1DLGlCQUFpQixDQUFDSSxPQUFsQyxvRkFBZ0Isc0JBQTJCQyxJQUEzQywyREFBZ0IsdUJBQWlDSCxRQUFqRCxFQUEyRDtBQUFBOztBQUMxRCxZQUFJSSxhQUEwQyw2QkFBR04saUJBQWlCLENBQUNJLE9BQXJCLHFGQUFHLHVCQUEyQkMsSUFBOUIsMkRBQUcsdUJBQWlDSCxRQUFqQyxDQUEwQ3JDLEdBQTFDLENBQWpEO0FBQ0FxQyxRQUFBQSxRQUFRLENBQUNyQyxHQUFELENBQVIsR0FBZ0JGLGNBQWMsbUJBQ3hCO0FBQUVlLFVBQUFBLFNBQVMsRUFBRXJCLGNBQWMsQ0FBQ0MsUUFBZixDQUF3QixDQUFDLElBQUQsRUFBTyxLQUFQLEVBQWNPLEdBQWQsQ0FBeEI7QUFBYixTQUR3QixNQUN1Q3FDLFFBQVEsQ0FBQ3JDLEdBQUQsQ0FEL0MsTUFDeUR5QyxhQUR6RCxHQUU3QnpDLEdBRjZCLENBQTlCO0FBSUEsT0FuQnNCLENBcUJ2QjtBQUNBOzs7QUFDQSxVQUFJMEMsY0FBaUMsR0FBR0MsYUFBYSxDQUFDQyxlQUFkLENBQThCUCxRQUE5QixFQUN0Q1EsTUFEc0MsQ0FDL0IsVUFBQTlDLE9BQU87QUFBQSxlQUFJQSxPQUFPLENBQUNHLE9BQVo7QUFBQSxPQUR3QixFQUV0QzRDLEdBRnNDLENBRWxDLFVBQUEvQyxPQUFPLEVBQUk7QUFDYkEsUUFBQUEsT0FBRixDQUFrQ1MsV0FBbEMsR0FBZ0RtQyxhQUFhLENBQUNDLGVBQWQsQ0FBOEI3QyxPQUFPLENBQUNTLFdBQXRDLENBQWhEO0FBQ0EsZUFBT1QsT0FBUDtBQUNBLE9BTHNDLENBQXhDO0FBT0EsYUFBTztBQUNOc0MsUUFBQUEsUUFBUSxFQUFFSztBQURKLE9BQVA7QUFHQTtBQXZDYSxHIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBbm5vdGF0aW9uVGVybSwgQXBwbHlBbm5vdGF0aW9uRXhwcmVzc2lvbiwgRW50aXR5VHlwZSwgRmFjZXRUeXBlcywgUGF0aEFubm90YXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzXCI7XG5pbXBvcnQgeyBTdGFibGVJZEhlbHBlciB9IGZyb20gXCJzYXAvZmUvbWFjcm9zXCI7XG5pbXBvcnQgeyBBbm5vdGF0aW9uSGVscGVyLCBDb250ZXh0IH0gZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NFwiO1xuaW1wb3J0IHtcblx0QmluZGluZ0V4cHJlc3Npb24sXG5cdE9iamVjdFBhZ2VNYW5pZmVzdFNldHRpbmdzLFxuXHRQbGFjZW1lbnQsXG5cdE1hbmlmZXN0U2VjdGlvbixcblx0U2VjdGlvblR5cGUsXG5cdFN1YlNlY3Rpb24sXG5cdFNlY3Rpb25cbn0gZnJvbSBcIi4vTWFuaWZlc3RTZXR0aW5nc1wiO1xuaW1wb3J0IENvbnZlcnRlclV0aWwgZnJvbSBcIi4vQ29udmVydGVyVXRpbFwiO1xuXG5leHBvcnQgdHlwZSBPYmplY3RQYWdlRGVmaW5pdGlvbiA9IHtcblx0c2VjdGlvbnM/OiBNYW5pZmVzdFNlY3Rpb25bXTtcbn07XG5cbmNvbnN0IGlzUGF0aEV4cHJlc3Npb24gPSBmdW5jdGlvbjxUPihleHByZXNzaW9uOiBhbnkpOiBleHByZXNzaW9uIGlzIFBhdGhBbm5vdGF0aW9uRXhwcmVzc2lvbjxUPiB7XG5cdHJldHVybiBleHByZXNzaW9uLnR5cGUgIT09IHVuZGVmaW5lZCAmJiBleHByZXNzaW9uLnR5cGUgPT09IFwiUGF0aFwiO1xufTtcblxuY29uc3QgZ2V0QmluZGluZ0V4cHJlc3Npb24gPSBmdW5jdGlvbjxUPihcblx0YW5ub3RhdGlvblZhbHVlOiBUIHwgUGF0aEFubm90YXRpb25FeHByZXNzaW9uPFQ+IHwgQXBwbHlBbm5vdGF0aW9uRXhwcmVzc2lvbjxUPiB8IHVuZGVmaW5lZCxcblx0Y3VycmVudENvbnRleHQ6IENvbnRleHQsXG5cdGRlZmF1bHRWYWx1ZT86IFRcbik6IEJpbmRpbmdFeHByZXNzaW9uPFQ+IHtcblx0aWYgKCFhbm5vdGF0aW9uVmFsdWUpIHtcblx0XHRyZXR1cm4gZGVmYXVsdFZhbHVlO1xuXHR9IGVsc2UgaWYgKGlzUGF0aEV4cHJlc3Npb24oYW5ub3RhdGlvblZhbHVlKSkge1xuXHRcdHJldHVybiBBbm5vdGF0aW9uSGVscGVyLmZvcm1hdCh7ICRQYXRoOiBhbm5vdGF0aW9uVmFsdWUucGF0aCB9LCB7IGNvbnRleHQ6IGN1cnJlbnRDb250ZXh0IH0pO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBBbm5vdGF0aW9uSGVscGVyLmZvcm1hdChhbm5vdGF0aW9uVmFsdWUsIHsgY29udGV4dDogY3VycmVudENvbnRleHQgfSk7XG5cdH1cbn07XG5cbmNvbnN0IGdldEludmVyc2VCaW5kaW5nRXhwcmVzc2lvbiA9IGZ1bmN0aW9uPFQ+KFxuXHRhbm5vdGF0aW9uVmFsdWU6IFQgfCBQYXRoQW5ub3RhdGlvbkV4cHJlc3Npb248VD4gfCBBcHBseUFubm90YXRpb25FeHByZXNzaW9uPFQ+IHwgdW5kZWZpbmVkLFxuXHRjdXJyZW50Q29udGV4dDogQ29udGV4dCxcblx0ZGVmYXVsdFZhbHVlPzogVFxuKTogQmluZGluZ0V4cHJlc3Npb248VD4ge1xuXHRpZiAoIWFubm90YXRpb25WYWx1ZSkge1xuXHRcdHJldHVybiBkZWZhdWx0VmFsdWU7XG5cdH1cblx0Y29uc3QgYmluZGluZ0V4cHJlc3Npb24gPSBnZXRCaW5kaW5nRXhwcmVzc2lvbihhbm5vdGF0aW9uVmFsdWUsIGN1cnJlbnRDb250ZXh0LCBkZWZhdWx0VmFsdWUpO1xuXHRyZXR1cm4gYHs9ICEkJHtiaW5kaW5nRXhwcmVzc2lvbn19YDtcbn07XG5cbmNvbnN0IGdldEZhY2V0SUQgPSAoc3RhYmxlSWRQYXJ0czogc3RyaW5nW10sIGZhY2V0RGVmaW5pdGlvbjogRmFjZXRUeXBlcywgY3VycmVudFRhcmdldDogc3RyaW5nKTogc3RyaW5nID0+IHtcblx0bGV0IGlkUGFydHM6IHN0cmluZ1tdID0gc3RhYmxlSWRQYXJ0cy5jb25jYXQoKTtcblx0aWYgKGZhY2V0RGVmaW5pdGlvbi5JRCkge1xuXHRcdGlkUGFydHMucHVzaChmYWNldERlZmluaXRpb24uSUQgYXMgc3RyaW5nKTtcblx0fSBlbHNlIHtcblx0XHRzd2l0Y2ggKGZhY2V0RGVmaW5pdGlvbi4kVHlwZSkge1xuXHRcdFx0Y2FzZSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlJlZmVyZW5jZVVSTEZhY2V0XCI6XG5cdFx0XHRcdGlkUGFydHMucHVzaChjdXJyZW50VGFyZ2V0KTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuUmVmZXJlbmNlRmFjZXRcIjpcblx0XHRcdFx0aWRQYXJ0cy5wdXNoKGZhY2V0RGVmaW5pdGlvbi5UYXJnZXQudmFsdWUpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5Db2xsZWN0aW9uRmFjZXRcIjpcblx0XHRcdFx0aWRQYXJ0cy5wdXNoKGN1cnJlbnRUYXJnZXQpO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblx0cmV0dXJuIFN0YWJsZUlkSGVscGVyLmdlbmVyYXRlKGlkUGFydHMpO1xufTtcblxuY29uc3QgZ2V0RmFjZXRSZWZLZXkgPSAoZmFjZXREZWZpbml0aW9uOiBGYWNldFR5cGVzLCBmYWxsYmFjazogc3RyaW5nKTogc3RyaW5nID0+IHtcblx0cmV0dXJuIGZhY2V0RGVmaW5pdGlvbi5JRD8udG9TdHJpbmcoKSB8fCBmYWNldERlZmluaXRpb24uTGFiZWw/LnRvU3RyaW5nKCkgfHwgZmFsbGJhY2s7XG59O1xuXG5jb25zdCBwcmVwYXJlU2VjdGlvbiA9IChzZWN0aW9uOiBNYW5pZmVzdFNlY3Rpb24gfCB1bmRlZmluZWQgfCBudWxsLCBrZXk6IHN0cmluZyk6IE1hbmlmZXN0U2VjdGlvbiA9PiB7XG5cdGlmICghc2VjdGlvbikge1xuXHRcdHRocm93IG5ldyBFcnJvcihcInVuZGVmaW5lZCBzZWN0aW9uXCIpO1xuXHR9XG5cdGlmIChzZWN0aW9uLnZpc2libGUgPT09IHVuZGVmaW5lZCB8fCBzZWN0aW9uLnZpc2libGUgPT09IG51bGwpIHtcblx0XHRzZWN0aW9uLnZpc2libGUgPSB0cnVlO1xuXHR9XG5cdHNlY3Rpb24uc2hvd1RpdGxlID0gc2VjdGlvbi50aXRsZSAhPT0gdW5kZWZpbmVkO1xuXHRpZiAoIXNlY3Rpb24udHlwZSkge1xuXHRcdHNlY3Rpb24udHlwZSA9IFNlY3Rpb25UeXBlLkRlZmF1bHQ7XG5cdH1cblx0aWYgKFxuXHRcdChzZWN0aW9uLnR5cGUgPT09IFNlY3Rpb25UeXBlLlhNTEZyYWdtZW50IHx8IHNlY3Rpb24udHlwZSA9PT0gU2VjdGlvblR5cGUuRGVmYXVsdCkgJiZcblx0XHQoIXNlY3Rpb24uc3ViU2VjdGlvbnMgfHwgIU9iamVjdC5rZXlzKHNlY3Rpb24uc3ViU2VjdGlvbnMpLmxlbmd0aClcblx0KSB7XG5cdFx0c2VjdGlvbi5zdWJTZWN0aW9ucyA9IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdC4uLnNlY3Rpb24sXG5cdFx0XHRcdC4uLnsgc2hvd1RpdGxlOiBmYWxzZSwgcG9zaXRpb246IHVuZGVmaW5lZCwgY29udHJvbElkOiBTdGFibGVJZEhlbHBlci5nZW5lcmF0ZShbXCJmZVwiLCBcIm9wc3NcIiwga2V5XSkgfVxuXHRcdFx0fVxuXHRcdH07XG5cdH1cblx0cmV0dXJuIHNlY3Rpb247XG59O1xuXG5jb25zdCBjb252ZXJ0RmFjZXQgPSAoXG5cdGZhY2V0RGVmaW5pdGlvbjogRmFjZXRUeXBlcyxcblx0b01ldGFNb2RlbENvbnRleHQ6IENvbnRleHQsXG5cdHN0YWJsZUlkUGFydHM6IHN0cmluZ1tdLFxuXHRjdXJyZW50VGFyZ2V0OiBzdHJpbmdcbik6IE1hbmlmZXN0U2VjdGlvbiA9PiB7XG5cdGNvbnN0IHNlY3Rpb246IE1hbmlmZXN0U2VjdGlvbiA9IHtcblx0XHRjb250cm9sSWQ6IGdldEZhY2V0SUQoc3RhYmxlSWRQYXJ0cywgZmFjZXREZWZpbml0aW9uLCBjdXJyZW50VGFyZ2V0KSxcblx0XHR0aXRsZTogZ2V0QmluZGluZ0V4cHJlc3Npb248c3RyaW5nPihmYWNldERlZmluaXRpb24uTGFiZWwsIG9NZXRhTW9kZWxDb250ZXh0KSxcblx0XHR2aXNpYmxlOiBnZXRJbnZlcnNlQmluZGluZ0V4cHJlc3Npb248Ym9vbGVhbj4oZmFjZXREZWZpbml0aW9uLmFubm90YXRpb25zPy5VST8uSGlkZGVuLCBvTWV0YU1vZGVsQ29udGV4dCwgdHJ1ZSksXG5cdFx0YW5ub3RhdGlvblJlZjogb01ldGFNb2RlbENvbnRleHQuZ2V0UGF0aChgQCR7Y3VycmVudFRhcmdldH1gKSxcblx0XHRzdWJTZWN0aW9uczoge30sXG5cdFx0dHlwZTogU2VjdGlvblR5cGUuQW5ub3RhdGlvblxuXHR9O1xuXG5cdHNlY3Rpb24uc2hvd1RpdGxlID0gc2VjdGlvbi50aXRsZSAhPT0gdW5kZWZpbmVkO1xuXHRzd2l0Y2ggKGZhY2V0RGVmaW5pdGlvbi4kVHlwZSkge1xuXHRcdGNhc2UgXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5Db2xsZWN0aW9uRmFjZXRcIjpcblx0XHRcdC8vIFR3byBwb3NzaWJpbGl0aWVzLCBlaXRoZXIgd2UgaGF2ZSBhIENvbGxlY3Rpb24gb2YgQ29sbGVjdGlvbiBvciBjb2xsZWN0aW9uIG9mIHJlZmVyZW5jZSBmYWNldHNcblx0XHRcdGNvbnN0IGNvbGxlY3Rpb25DaGlsZCA9IGZhY2V0RGVmaW5pdGlvbi5GYWNldHMuZmluZChcblx0XHRcdFx0ZmFjZXREZWZpbml0aW9uID0+IGZhY2V0RGVmaW5pdGlvbi4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5Db2xsZWN0aW9uRmFjZXRcIlxuXHRcdFx0KTtcblx0XHRcdGlmIChjb2xsZWN0aW9uQ2hpbGQpIHtcblx0XHRcdFx0bGV0IHNlY3Rpb25LZXk6IHN0cmluZztcblxuXHRcdFx0XHRmYWNldERlZmluaXRpb24uRmFjZXRzLmZvckVhY2goKGZhY2V0RGVmaW5pdGlvbjogQW5ub3RhdGlvblRlcm08RmFjZXRUeXBlcz4sIHN1YkZhY2V0SW5kZXg6IG51bWJlcikgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IHN1YlNlY3Rpb24gPSBjb252ZXJ0RmFjZXQoXG5cdFx0XHRcdFx0XHRmYWNldERlZmluaXRpb24sXG5cdFx0XHRcdFx0XHRvTWV0YU1vZGVsQ29udGV4dCxcblx0XHRcdFx0XHRcdFtcImZlXCIsIFwib3Bzc1wiXSxcblx0XHRcdFx0XHRcdGAke2N1cnJlbnRUYXJnZXR9L0ZhY2V0cy8ke3N1YkZhY2V0SW5kZXh9YFxuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRpZiAoc2VjdGlvbktleSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRzdWJTZWN0aW9uLnBvc2l0aW9uID0geyBhbmNob3I6IHNlY3Rpb25LZXksIHBsYWNlbWVudDogUGxhY2VtZW50LkFmdGVyIH07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHNlY3Rpb25LZXkgPSBnZXRGYWNldFJlZktleShmYWNldERlZmluaXRpb24sIHN1YkZhY2V0SW5kZXgudG9TdHJpbmcoKSk7XG5cdFx0XHRcdFx0c2VjdGlvbi5zdWJTZWN0aW9uc1tzZWN0aW9uS2V5XSA9IHN1YlNlY3Rpb247XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2VjdGlvbi5zdWJTZWN0aW9uc1tnZXRGYWNldFJlZktleShmYWNldERlZmluaXRpb24sIGdldEZhY2V0SUQoW1wiZmVcIiwgXCJvcHNzXCJdLCBmYWNldERlZmluaXRpb24sIGN1cnJlbnRUYXJnZXQpKV0gPSB7XG5cdFx0XHRcdFx0Y29udHJvbElkOiBnZXRGYWNldElEKFtcImZlXCIsIFwib3Bzc1wiXSwgZmFjZXREZWZpbml0aW9uLCBjdXJyZW50VGFyZ2V0KSxcblx0XHRcdFx0XHR0aXRsZTogc2VjdGlvbi50aXRsZSxcblx0XHRcdFx0XHR0eXBlOiBTZWN0aW9uVHlwZS5Bbm5vdGF0aW9uLFxuXHRcdFx0XHRcdHZpc2libGU6IHNlY3Rpb24udmlzaWJsZSxcblx0XHRcdFx0XHRhbm5vdGF0aW9uUmVmOiBzZWN0aW9uLmFubm90YXRpb25SZWZcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5SZWZlcmVuY2VGYWNldFwiOlxuXHRcdFx0c2VjdGlvbi5zdWJTZWN0aW9uc1tnZXRGYWNldFJlZktleShmYWNldERlZmluaXRpb24sIGdldEZhY2V0SUQoW1wiZmVcIiwgXCJvcHNzXCJdLCBmYWNldERlZmluaXRpb24sIGN1cnJlbnRUYXJnZXQpKV0gPSB7XG5cdFx0XHRcdGNvbnRyb2xJZDogZ2V0RmFjZXRJRChbXCJmZVwiLCBcIm9wc3NcIl0sIGZhY2V0RGVmaW5pdGlvbiwgY3VycmVudFRhcmdldCksXG5cdFx0XHRcdHRpdGxlOiBzZWN0aW9uLnRpdGxlLFxuXHRcdFx0XHR0eXBlOiBTZWN0aW9uVHlwZS5Bbm5vdGF0aW9uLFxuXHRcdFx0XHR2aXNpYmxlOiBzZWN0aW9uLnZpc2libGUsXG5cdFx0XHRcdGFubm90YXRpb25SZWY6IHNlY3Rpb24uYW5ub3RhdGlvblJlZlxuXHRcdFx0fTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5SZWZlcmVuY2VVUkxGYWNldFwiOlxuXHRcdFx0YnJlYWs7XG5cdH1cblx0cmV0dXJuIHNlY3Rpb247XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGNvbnZlcnRQYWdlKFxuXHRcdGVudGl0eVR5cGU6IEVudGl0eVR5cGUsXG5cdFx0b01ldGFNb2RlbENvbnRleHQ6IENvbnRleHQsXG5cdFx0b01hbmlmZXN0U2V0dGluZ3M6IE9iamVjdFBhZ2VNYW5pZmVzdFNldHRpbmdzLFxuXHRcdHVuYWxpYXNGbjogRnVuY3Rpb25cblx0KTogT2JqZWN0UGFnZURlZmluaXRpb24ge1xuXHRcdGNvbnN0IHNlY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCBNYW5pZmVzdFNlY3Rpb24+ID0ge307XG5cdFx0bGV0IHNlY3Rpb25LZXk6IHN0cmluZztcblxuXHRcdGVudGl0eVR5cGUuYW5ub3RhdGlvbnMuVUk/LkZhY2V0cz8uZm9yRWFjaCgoZmFjZXREZWZpbml0aW9uOiBGYWNldFR5cGVzLCBmYWNldEluZGV4OiBudW1iZXIpID0+IHtcblx0XHRcdGNvbnN0IHNlY3Rpb24gPSBjb252ZXJ0RmFjZXQoZmFjZXREZWZpbml0aW9uLCBvTWV0YU1vZGVsQ29udGV4dCwgW1wiZmVcIiwgXCJvcHNcIl0sIGAke3VuYWxpYXNGbihcIlVJLkZhY2V0c1wiKX0vJHtmYWNldEluZGV4fWApO1xuXHRcdFx0aWYgKHNlY3Rpb25LZXkgIT0gbnVsbCkge1xuXHRcdFx0XHRzZWN0aW9uLnBvc2l0aW9uID0geyBhbmNob3I6IHNlY3Rpb25LZXksIHBsYWNlbWVudDogUGxhY2VtZW50LkFmdGVyIH07XG5cdFx0XHR9XG5cdFx0XHRzZWN0aW9uS2V5ID0gZ2V0RmFjZXRSZWZLZXkoZmFjZXREZWZpbml0aW9uLCBmYWNldEluZGV4LnRvU3RyaW5nKCkpO1xuXHRcdFx0c2VjdGlvbnNbc2VjdGlvbktleV0gPSBzZWN0aW9uO1xuXHRcdH0pO1xuXG5cdFx0Zm9yIChsZXQga2V5IGluIG9NYW5pZmVzdFNldHRpbmdzLmNvbnRlbnQ/LmJvZHk/LnNlY3Rpb25zKSB7XG5cdFx0XHRsZXQgY3VzdG9tU2VjdGlvbjogTWFuaWZlc3RTZWN0aW9uIHwgdW5kZWZpbmVkID0gb01hbmlmZXN0U2V0dGluZ3MuY29udGVudD8uYm9keT8uc2VjdGlvbnNba2V5XTtcblx0XHRcdHNlY3Rpb25zW2tleV0gPSBwcmVwYXJlU2VjdGlvbihcblx0XHRcdFx0eyAuLi57IGNvbnRyb2xJZDogU3RhYmxlSWRIZWxwZXIuZ2VuZXJhdGUoW1wiZmVcIiwgXCJvcHNcIiwga2V5XSkgfSwgLi4uc2VjdGlvbnNba2V5XSwgLi4uY3VzdG9tU2VjdGlvbiB9LFxuXHRcdFx0XHRrZXlcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0Ly8gdGhlIFwiZmluYWxcIiBzdHJ1Y3R1cmUgaXMgZGlmZmVyZW50LCBlLmcuIHJlc29sdmUgYmVmb3JlL2FmdGVyIG9yZGVyaW5nIGludG8gYXJyYXlzXG5cdFx0Ly8gVE9ETyB0aGUgZmluYWwgdHJhbnNmb3JtIG1lY2hhbmlzbSBmcm9tIHRoZSBodW1hbiByZWFkYWJsZSBmb3JtIHRvIFwidGVtcGxhdGUgcmVhZHlcIiBzaG91bGQgaGFwcGVuIGF0IHRoZSB2ZXJ5IGVuZCwgbm90IGhlcmVcblx0XHRsZXQgcGFyc2VkU2VjdGlvbnM6IE1hbmlmZXN0U2VjdGlvbltdID0gQ29udmVydGVyVXRpbC5vcmRlckJ5UG9zaXRpb24oc2VjdGlvbnMpXG5cdFx0XHQuZmlsdGVyKHNlY3Rpb24gPT4gc2VjdGlvbi52aXNpYmxlKVxuXHRcdFx0Lm1hcChzZWN0aW9uID0+IHtcblx0XHRcdFx0KChzZWN0aW9uIGFzIHVua25vd24pIGFzIFNlY3Rpb24pLnN1YlNlY3Rpb25zID0gQ29udmVydGVyVXRpbC5vcmRlckJ5UG9zaXRpb24oc2VjdGlvbi5zdWJTZWN0aW9ucykgYXMgU3ViU2VjdGlvbltdO1xuXHRcdFx0XHRyZXR1cm4gc2VjdGlvbjtcblx0XHRcdH0pO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHNlY3Rpb25zOiBwYXJzZWRTZWN0aW9uc1xuXHRcdH07XG5cdH1cbn07XG4iXX0=