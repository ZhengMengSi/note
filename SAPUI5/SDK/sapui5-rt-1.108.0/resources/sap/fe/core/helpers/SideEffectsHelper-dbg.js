/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([], function () {
  "use strict";

  var fnGetOwnerEntityForSourceEntity = function (oSourceEntity, sEntityType, oMetaModel) {
    var sNavigationPath = oSourceEntity["$NavigationPropertyPath"];
    var pOwnerEntity; // Source entities have an empty path, that is same as the target entity type of the side effect annotation
    // or it always involves get target entity for this navigation path

    if (sNavigationPath === "") {
      pOwnerEntity = Promise.resolve(sEntityType);
    } else {
      pOwnerEntity = oMetaModel.requestObject("/" + sEntityType + "/" + sNavigationPath + "/@sapui.name");
    }

    return {
      pOwnerEntity: pOwnerEntity,
      sNavigationPath: sNavigationPath
    };
  };

  var fnGetObjectToGenerateSideEffectMap = function (sEntityType, sSideEffectAnnotation, oSideEffectAnnotation, oMetaModel) {
    var sQualifier = sSideEffectAnnotation.indexOf("#") > -1 && sSideEffectAnnotation.substr(sSideEffectAnnotation.indexOf("#")) || "",
        aSourceProperties = oSideEffectAnnotation.SourceProperties || [],
        aSourceEntities = oSideEffectAnnotation.SourceEntities || [],
        // for each source property or source entity, there could be a oMetaModel.requestObject(...) to get the target entity type of the navigation involved
    resultArray = [];
    aSourceProperties.forEach(function (oSourceProperty) {
      var _fnGetPathForSourcePr = fnGetPathForSourceProperty(oSourceProperty["$PropertyPath"], sEntityType, oMetaModel),
          sPath = _fnGetPathForSourcePr.sPath,
          pOwnerEntity = _fnGetPathForSourcePr.pOwnerEntity,
          sNavigationPath = _fnGetPathForSourcePr.sNavigationPath;

      resultArray.push({
        pOwnerEntity: pOwnerEntity,
        sQualifier: sQualifier,
        sNavigationPath: sNavigationPath,
        sPath: sPath,
        sEntityType: sEntityType,
        oSideEffectAnnotation: oSideEffectAnnotation
      });
    });
    aSourceEntities.forEach(function (oSourceEntity) {
      var _fnGetOwnerEntityForS = fnGetOwnerEntityForSourceEntity(oSourceEntity, sEntityType, oMetaModel),
          pOwnerEntity = _fnGetOwnerEntityForS.pOwnerEntity,
          sNavigationPath = _fnGetOwnerEntityForS.sNavigationPath;

      resultArray.push({
        pOwnerEntity: pOwnerEntity,
        sQualifier: sQualifier,
        sNavigationPath: sNavigationPath,
        sPath: "entity",
        sEntityType: sEntityType,
        oSideEffectAnnotation: oSideEffectAnnotation
      });
    });
    return resultArray;
  };

  var fnGetPathForSourceProperty = function (sPath, sEntityType, oMetaModel) {
    // if the property path has a navigation, get the target entity type of the navigation
    var sNavigationPath = sPath.indexOf("/") > 0 ? "/" + sEntityType + "/" + sPath.substr(0, sPath.lastIndexOf("/") + 1) + "@sapui.name" : false,
        pOwnerEntity = !sNavigationPath ? Promise.resolve(sEntityType) : oMetaModel.requestObject(sNavigationPath);
    sPath = sNavigationPath ? sPath.substr(sPath.lastIndexOf("/") + 1) : sPath;
    return {
      sPath: sPath,
      pOwnerEntity: pOwnerEntity,
      sNavigationPath: sNavigationPath
    };
  };

  var SideEffectsHelper = {
    generateSideEffectsMapFromMetaModel: function (oMetaModel) {
      var oSideEffects = {};
      var allEntityTypes = [];
      var allSideEffectsDataArray = [];
      return oMetaModel.requestObject("/$").then(function (oEverything) {
        var fnFilterEntityTypes = function (sKey) {
          return oEverything[sKey]["$kind"] === "EntityType";
        }; // get everything --> filter the entity types which have side effects annotated


        return Object.keys(oEverything).filter(fnFilterEntityTypes);
      }).then(function (mapEntityTypes) {
        allEntityTypes = mapEntityTypes;
        return Promise.allSettled(mapEntityTypes.map(function (sEntityType) {
          return oMetaModel.requestObject("/" + sEntityType + "@");
        }));
      }).then(function (entityTypesAnnotations) {
        var allSideEffectsPromises = []; // loop through all entity types and filter entities having side effect annotations
        // then generate map object for all side effects found
        // also generate the promises array out of the side effect object

        entityTypesAnnotations.forEach(function (entityTypeData, index) {
          if (entityTypeData.status === "fulfilled") {
            var sEntityType = allEntityTypes[index];
            var oAnnotations = entityTypeData.value;
            Object.keys(oAnnotations).filter(function (sAnnotation) {
              return sAnnotation.indexOf("@com.sap.vocabularies.Common.v1.SideEffects") > -1;
            }).forEach(function (sSideEffectAnnotation) {
              var sideEffectsMap = fnGetObjectToGenerateSideEffectMap(sEntityType, sSideEffectAnnotation, oAnnotations[sSideEffectAnnotation], oMetaModel);
              allSideEffectsDataArray = allSideEffectsDataArray.concat(sideEffectsMap);
              allSideEffectsPromises = allSideEffectsPromises.concat(sideEffectsMap.map(function (i) {
                return i["pOwnerEntity"];
              }));
            });
          }
        });
        return Promise.allSettled(allSideEffectsPromises);
      }).then(function (allSideEffectPromisesResult) {
        // when all the side effects promises have been settled(from source properties and ewntites), we generate side effects object based on side effect data objects values, like entity, sourceproperties
        allSideEffectPromisesResult.forEach(function (result, index) {
          if (result.status === "fulfilled") {
            var sOwnerEntityType = result.value;
            var sideeffectDataMap = allSideEffectsDataArray[index];
            var sEntityType = sideeffectDataMap.sEntityType,
                sQualifier = sideeffectDataMap.sQualifier,
                oSideEffectAnnotation = sideeffectDataMap.oSideEffectAnnotation,
                sPath = sideeffectDataMap.sPath;
            var aSourceProperties = oSideEffectAnnotation.SourceProperties;

            if (sPath === "entity") {
              // data coming from source entities
              oSideEffects[sOwnerEntityType] = oSideEffects[sOwnerEntityType] || [[], {}]; // side effects for fields referenced via source entities must always be requested immediately

              oSideEffects[sOwnerEntityType][0].push(sEntityType + sQualifier + "$$ImmediateRequest"); // --> mappingSourceEntities
            } else {
              oSideEffects[sOwnerEntityType] = oSideEffects[sOwnerEntityType] || [[], {}];
              oSideEffects[sOwnerEntityType][1][sPath] = oSideEffects[sOwnerEntityType][1][sPath] || []; // if there is only one source property, side effect request is required immediately

              oSideEffects[sOwnerEntityType][1][sPath].push(sEntityType + sQualifier + (aSourceProperties.length === 1 && "$$ImmediateRequest" || "")); // --> mappingSourceProperties
            }
          }
        });
        return oSideEffects;
      }).catch(function (e) {
        return Promise.reject(e);
      });
    }
  };
  return SideEffectsHelper;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJmbkdldE93bmVyRW50aXR5Rm9yU291cmNlRW50aXR5Iiwib1NvdXJjZUVudGl0eSIsInNFbnRpdHlUeXBlIiwib01ldGFNb2RlbCIsInNOYXZpZ2F0aW9uUGF0aCIsInBPd25lckVudGl0eSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVxdWVzdE9iamVjdCIsImZuR2V0T2JqZWN0VG9HZW5lcmF0ZVNpZGVFZmZlY3RNYXAiLCJzU2lkZUVmZmVjdEFubm90YXRpb24iLCJvU2lkZUVmZmVjdEFubm90YXRpb24iLCJzUXVhbGlmaWVyIiwiaW5kZXhPZiIsInN1YnN0ciIsImFTb3VyY2VQcm9wZXJ0aWVzIiwiU291cmNlUHJvcGVydGllcyIsImFTb3VyY2VFbnRpdGllcyIsIlNvdXJjZUVudGl0aWVzIiwicmVzdWx0QXJyYXkiLCJmb3JFYWNoIiwib1NvdXJjZVByb3BlcnR5IiwiZm5HZXRQYXRoRm9yU291cmNlUHJvcGVydHkiLCJzUGF0aCIsInB1c2giLCJsYXN0SW5kZXhPZiIsIlNpZGVFZmZlY3RzSGVscGVyIiwiZ2VuZXJhdGVTaWRlRWZmZWN0c01hcEZyb21NZXRhTW9kZWwiLCJvU2lkZUVmZmVjdHMiLCJhbGxFbnRpdHlUeXBlcyIsImFsbFNpZGVFZmZlY3RzRGF0YUFycmF5IiwidGhlbiIsIm9FdmVyeXRoaW5nIiwiZm5GaWx0ZXJFbnRpdHlUeXBlcyIsInNLZXkiLCJPYmplY3QiLCJrZXlzIiwiZmlsdGVyIiwibWFwRW50aXR5VHlwZXMiLCJhbGxTZXR0bGVkIiwibWFwIiwiZW50aXR5VHlwZXNBbm5vdGF0aW9ucyIsImFsbFNpZGVFZmZlY3RzUHJvbWlzZXMiLCJlbnRpdHlUeXBlRGF0YSIsImluZGV4Iiwic3RhdHVzIiwib0Fubm90YXRpb25zIiwidmFsdWUiLCJzQW5ub3RhdGlvbiIsInNpZGVFZmZlY3RzTWFwIiwiY29uY2F0IiwiaSIsImFsbFNpZGVFZmZlY3RQcm9taXNlc1Jlc3VsdCIsInJlc3VsdCIsInNPd25lckVudGl0eVR5cGUiLCJzaWRlZWZmZWN0RGF0YU1hcCIsImxlbmd0aCIsImNhdGNoIiwiZSIsInJlamVjdCJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiU2lkZUVmZmVjdHNIZWxwZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZm5HZXRPd25lckVudGl0eUZvclNvdXJjZUVudGl0eSA9IGZ1bmN0aW9uIChvU291cmNlRW50aXR5OiBhbnksIHNFbnRpdHlUeXBlOiBzdHJpbmcsIG9NZXRhTW9kZWw6IGFueSkge1xuXHRjb25zdCBzTmF2aWdhdGlvblBhdGggPSBvU291cmNlRW50aXR5W1wiJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIl07XG5cdGxldCBwT3duZXJFbnRpdHk7XG5cdC8vIFNvdXJjZSBlbnRpdGllcyBoYXZlIGFuIGVtcHR5IHBhdGgsIHRoYXQgaXMgc2FtZSBhcyB0aGUgdGFyZ2V0IGVudGl0eSB0eXBlIG9mIHRoZSBzaWRlIGVmZmVjdCBhbm5vdGF0aW9uXG5cdC8vIG9yIGl0IGFsd2F5cyBpbnZvbHZlcyBnZXQgdGFyZ2V0IGVudGl0eSBmb3IgdGhpcyBuYXZpZ2F0aW9uIHBhdGhcblx0aWYgKHNOYXZpZ2F0aW9uUGF0aCA9PT0gXCJcIikge1xuXHRcdHBPd25lckVudGl0eSA9IFByb21pc2UucmVzb2x2ZShzRW50aXR5VHlwZSk7XG5cdH0gZWxzZSB7XG5cdFx0cE93bmVyRW50aXR5ID0gb01ldGFNb2RlbC5yZXF1ZXN0T2JqZWN0KFwiL1wiICsgc0VudGl0eVR5cGUgKyBcIi9cIiArIHNOYXZpZ2F0aW9uUGF0aCArIFwiL0BzYXB1aS5uYW1lXCIpO1xuXHR9XG5cdHJldHVybiB7IHBPd25lckVudGl0eSwgc05hdmlnYXRpb25QYXRoIH07XG59O1xuXG5jb25zdCBmbkdldE9iamVjdFRvR2VuZXJhdGVTaWRlRWZmZWN0TWFwID0gZnVuY3Rpb24gKFxuXHRzRW50aXR5VHlwZTogc3RyaW5nLFxuXHRzU2lkZUVmZmVjdEFubm90YXRpb246IHN0cmluZyxcblx0b1NpZGVFZmZlY3RBbm5vdGF0aW9uOiBhbnksXG5cdG9NZXRhTW9kZWw6IGFueVxuKSB7XG5cdGNvbnN0IHNRdWFsaWZpZXIgPSAoc1NpZGVFZmZlY3RBbm5vdGF0aW9uLmluZGV4T2YoXCIjXCIpID4gLTEgJiYgc1NpZGVFZmZlY3RBbm5vdGF0aW9uLnN1YnN0cihzU2lkZUVmZmVjdEFubm90YXRpb24uaW5kZXhPZihcIiNcIikpKSB8fCBcIlwiLFxuXHRcdGFTb3VyY2VQcm9wZXJ0aWVzID0gb1NpZGVFZmZlY3RBbm5vdGF0aW9uLlNvdXJjZVByb3BlcnRpZXMgfHwgW10sXG5cdFx0YVNvdXJjZUVudGl0aWVzID0gb1NpZGVFZmZlY3RBbm5vdGF0aW9uLlNvdXJjZUVudGl0aWVzIHx8IFtdLFxuXHRcdC8vIGZvciBlYWNoIHNvdXJjZSBwcm9wZXJ0eSBvciBzb3VyY2UgZW50aXR5LCB0aGVyZSBjb3VsZCBiZSBhIG9NZXRhTW9kZWwucmVxdWVzdE9iamVjdCguLi4pIHRvIGdldCB0aGUgdGFyZ2V0IGVudGl0eSB0eXBlIG9mIHRoZSBuYXZpZ2F0aW9uIGludm9sdmVkXG5cdFx0cmVzdWx0QXJyYXk6IGFueVtdID0gW107XG5cdGFTb3VyY2VQcm9wZXJ0aWVzLmZvckVhY2goZnVuY3Rpb24gKG9Tb3VyY2VQcm9wZXJ0eTogYW55KSB7XG5cdFx0Y29uc3QgeyBzUGF0aCwgcE93bmVyRW50aXR5LCBzTmF2aWdhdGlvblBhdGggfSA9IGZuR2V0UGF0aEZvclNvdXJjZVByb3BlcnR5KFxuXHRcdFx0b1NvdXJjZVByb3BlcnR5W1wiJFByb3BlcnR5UGF0aFwiXSxcblx0XHRcdHNFbnRpdHlUeXBlLFxuXHRcdFx0b01ldGFNb2RlbFxuXHRcdCk7XG5cdFx0cmVzdWx0QXJyYXkucHVzaCh7IHBPd25lckVudGl0eSwgc1F1YWxpZmllciwgc05hdmlnYXRpb25QYXRoLCBzUGF0aCwgc0VudGl0eVR5cGUsIG9TaWRlRWZmZWN0QW5ub3RhdGlvbiB9KTtcblx0fSk7XG5cdGFTb3VyY2VFbnRpdGllcy5mb3JFYWNoKGZ1bmN0aW9uIChvU291cmNlRW50aXR5OiBhbnkpIHtcblx0XHRjb25zdCB7IHBPd25lckVudGl0eSwgc05hdmlnYXRpb25QYXRoIH0gPSBmbkdldE93bmVyRW50aXR5Rm9yU291cmNlRW50aXR5KG9Tb3VyY2VFbnRpdHksIHNFbnRpdHlUeXBlLCBvTWV0YU1vZGVsKTtcblx0XHRyZXN1bHRBcnJheS5wdXNoKHsgcE93bmVyRW50aXR5LCBzUXVhbGlmaWVyLCBzTmF2aWdhdGlvblBhdGgsIHNQYXRoOiBcImVudGl0eVwiLCBzRW50aXR5VHlwZSwgb1NpZGVFZmZlY3RBbm5vdGF0aW9uIH0pO1xuXHR9KTtcblx0cmV0dXJuIHJlc3VsdEFycmF5O1xufTtcblxuY29uc3QgZm5HZXRQYXRoRm9yU291cmNlUHJvcGVydHkgPSBmdW5jdGlvbiAoc1BhdGg6IGFueSwgc0VudGl0eVR5cGU6IGFueSwgb01ldGFNb2RlbDogYW55KSB7XG5cdC8vIGlmIHRoZSBwcm9wZXJ0eSBwYXRoIGhhcyBhIG5hdmlnYXRpb24sIGdldCB0aGUgdGFyZ2V0IGVudGl0eSB0eXBlIG9mIHRoZSBuYXZpZ2F0aW9uXG5cdGNvbnN0IHNOYXZpZ2F0aW9uUGF0aCA9XG5cdFx0XHRzUGF0aC5pbmRleE9mKFwiL1wiKSA+IDAgPyBcIi9cIiArIHNFbnRpdHlUeXBlICsgXCIvXCIgKyBzUGF0aC5zdWJzdHIoMCwgc1BhdGgubGFzdEluZGV4T2YoXCIvXCIpICsgMSkgKyBcIkBzYXB1aS5uYW1lXCIgOiBmYWxzZSxcblx0XHRwT3duZXJFbnRpdHkgPSAhc05hdmlnYXRpb25QYXRoID8gUHJvbWlzZS5yZXNvbHZlKHNFbnRpdHlUeXBlKSA6IG9NZXRhTW9kZWwucmVxdWVzdE9iamVjdChzTmF2aWdhdGlvblBhdGgpO1xuXHRzUGF0aCA9IHNOYXZpZ2F0aW9uUGF0aCA/IHNQYXRoLnN1YnN0cihzUGF0aC5sYXN0SW5kZXhPZihcIi9cIikgKyAxKSA6IHNQYXRoO1xuXHRyZXR1cm4geyBzUGF0aCwgcE93bmVyRW50aXR5LCBzTmF2aWdhdGlvblBhdGggfTtcbn07XG5cbmNvbnN0IFNpZGVFZmZlY3RzSGVscGVyID0ge1xuXHRnZW5lcmF0ZVNpZGVFZmZlY3RzTWFwRnJvbU1ldGFNb2RlbChvTWV0YU1vZGVsOiBhbnkpIHtcblx0XHRjb25zdCBvU2lkZUVmZmVjdHM6IGFueSA9IHt9O1xuXHRcdGxldCBhbGxFbnRpdHlUeXBlczogYW55ID0gW107XG5cdFx0bGV0IGFsbFNpZGVFZmZlY3RzRGF0YUFycmF5OiBhbnkgPSBbXTtcblx0XHRyZXR1cm4gb01ldGFNb2RlbFxuXHRcdFx0LnJlcXVlc3RPYmplY3QoXCIvJFwiKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24gKG9FdmVyeXRoaW5nOiBhbnkpIHtcblx0XHRcdFx0Y29uc3QgZm5GaWx0ZXJFbnRpdHlUeXBlcyA9IGZ1bmN0aW9uIChzS2V5OiBzdHJpbmcpIHtcblx0XHRcdFx0XHRyZXR1cm4gb0V2ZXJ5dGhpbmdbc0tleV1bXCIka2luZFwiXSA9PT0gXCJFbnRpdHlUeXBlXCI7XG5cdFx0XHRcdH07XG5cdFx0XHRcdC8vIGdldCBldmVyeXRoaW5nIC0tPiBmaWx0ZXIgdGhlIGVudGl0eSB0eXBlcyB3aGljaCBoYXZlIHNpZGUgZWZmZWN0cyBhbm5vdGF0ZWRcblx0XHRcdFx0cmV0dXJuIE9iamVjdC5rZXlzKG9FdmVyeXRoaW5nKS5maWx0ZXIoZm5GaWx0ZXJFbnRpdHlUeXBlcyk7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oKG1hcEVudGl0eVR5cGVzOiBhbnkpID0+IHtcblx0XHRcdFx0YWxsRW50aXR5VHlwZXMgPSBtYXBFbnRpdHlUeXBlcztcblx0XHRcdFx0cmV0dXJuIChQcm9taXNlIGFzIGFueSkuYWxsU2V0dGxlZChcblx0XHRcdFx0XHRtYXBFbnRpdHlUeXBlcy5tYXAoKHNFbnRpdHlUeXBlOiBzdHJpbmcpID0+IHtcblx0XHRcdFx0XHRcdHJldHVybiBvTWV0YU1vZGVsLnJlcXVlc3RPYmplY3QoXCIvXCIgKyBzRW50aXR5VHlwZSArIFwiQFwiKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHQpO1xuXHRcdFx0fSlcblx0XHRcdC50aGVuKChlbnRpdHlUeXBlc0Fubm90YXRpb25zOiBhbnkpID0+IHtcblx0XHRcdFx0bGV0IGFsbFNpZGVFZmZlY3RzUHJvbWlzZXM6IGFueSA9IFtdO1xuXHRcdFx0XHQvLyBsb29wIHRocm91Z2ggYWxsIGVudGl0eSB0eXBlcyBhbmQgZmlsdGVyIGVudGl0aWVzIGhhdmluZyBzaWRlIGVmZmVjdCBhbm5vdGF0aW9uc1xuXHRcdFx0XHQvLyB0aGVuIGdlbmVyYXRlIG1hcCBvYmplY3QgZm9yIGFsbCBzaWRlIGVmZmVjdHMgZm91bmRcblx0XHRcdFx0Ly8gYWxzbyBnZW5lcmF0ZSB0aGUgcHJvbWlzZXMgYXJyYXkgb3V0IG9mIHRoZSBzaWRlIGVmZmVjdCBvYmplY3Rcblx0XHRcdFx0ZW50aXR5VHlwZXNBbm5vdGF0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChlbnRpdHlUeXBlRGF0YTogYW55LCBpbmRleDogYW55KSB7XG5cdFx0XHRcdFx0aWYgKGVudGl0eVR5cGVEYXRhLnN0YXR1cyA9PT0gXCJmdWxmaWxsZWRcIikge1xuXHRcdFx0XHRcdFx0Y29uc3Qgc0VudGl0eVR5cGUgPSBhbGxFbnRpdHlUeXBlc1tpbmRleF07XG5cdFx0XHRcdFx0XHRjb25zdCBvQW5ub3RhdGlvbnMgPSBlbnRpdHlUeXBlRGF0YS52YWx1ZTtcblx0XHRcdFx0XHRcdE9iamVjdC5rZXlzKG9Bbm5vdGF0aW9ucylcblx0XHRcdFx0XHRcdFx0LmZpbHRlcihmdW5jdGlvbiAoc0Fubm90YXRpb24pIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gc0Fubm90YXRpb24uaW5kZXhPZihcIkBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuU2lkZUVmZmVjdHNcIikgPiAtMTtcblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0LmZvckVhY2goZnVuY3Rpb24gKHNTaWRlRWZmZWN0QW5ub3RhdGlvbikge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IHNpZGVFZmZlY3RzTWFwID0gZm5HZXRPYmplY3RUb0dlbmVyYXRlU2lkZUVmZmVjdE1hcChcblx0XHRcdFx0XHRcdFx0XHRcdHNFbnRpdHlUeXBlLFxuXHRcdFx0XHRcdFx0XHRcdFx0c1NpZGVFZmZlY3RBbm5vdGF0aW9uLFxuXHRcdFx0XHRcdFx0XHRcdFx0b0Fubm90YXRpb25zW3NTaWRlRWZmZWN0QW5ub3RhdGlvbl0sXG5cdFx0XHRcdFx0XHRcdFx0XHRvTWV0YU1vZGVsXG5cdFx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0XHRhbGxTaWRlRWZmZWN0c0RhdGFBcnJheSA9IGFsbFNpZGVFZmZlY3RzRGF0YUFycmF5LmNvbmNhdChzaWRlRWZmZWN0c01hcCk7XG5cdFx0XHRcdFx0XHRcdFx0YWxsU2lkZUVmZmVjdHNQcm9taXNlcyA9IGFsbFNpZGVFZmZlY3RzUHJvbWlzZXMuY29uY2F0KHNpZGVFZmZlY3RzTWFwLm1hcCgoaTogYW55KSA9PiBpW1wicE93bmVyRW50aXR5XCJdKSk7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJldHVybiAoUHJvbWlzZSBhcyBhbnkpLmFsbFNldHRsZWQoYWxsU2lkZUVmZmVjdHNQcm9taXNlcyk7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oKGFsbFNpZGVFZmZlY3RQcm9taXNlc1Jlc3VsdDogYW55KSA9PiB7XG5cdFx0XHRcdC8vIHdoZW4gYWxsIHRoZSBzaWRlIGVmZmVjdHMgcHJvbWlzZXMgaGF2ZSBiZWVuIHNldHRsZWQoZnJvbSBzb3VyY2UgcHJvcGVydGllcyBhbmQgZXdudGl0ZXMpLCB3ZSBnZW5lcmF0ZSBzaWRlIGVmZmVjdHMgb2JqZWN0IGJhc2VkIG9uIHNpZGUgZWZmZWN0IGRhdGEgb2JqZWN0cyB2YWx1ZXMsIGxpa2UgZW50aXR5LCBzb3VyY2Vwcm9wZXJ0aWVzXG5cblx0XHRcdFx0YWxsU2lkZUVmZmVjdFByb21pc2VzUmVzdWx0LmZvckVhY2goKHJlc3VsdDogYW55LCBpbmRleDogYW55KSA9PiB7XG5cdFx0XHRcdFx0aWYgKHJlc3VsdC5zdGF0dXMgPT09IFwiZnVsZmlsbGVkXCIpIHtcblx0XHRcdFx0XHRcdGNvbnN0IHNPd25lckVudGl0eVR5cGUgPSByZXN1bHQudmFsdWU7XG5cdFx0XHRcdFx0XHRjb25zdCBzaWRlZWZmZWN0RGF0YU1hcCA9IGFsbFNpZGVFZmZlY3RzRGF0YUFycmF5W2luZGV4XTtcblx0XHRcdFx0XHRcdGNvbnN0IHsgc0VudGl0eVR5cGUsIHNRdWFsaWZpZXIsIG9TaWRlRWZmZWN0QW5ub3RhdGlvbiwgc1BhdGggfSA9IHNpZGVlZmZlY3REYXRhTWFwO1xuXHRcdFx0XHRcdFx0Y29uc3QgYVNvdXJjZVByb3BlcnRpZXMgPSBvU2lkZUVmZmVjdEFubm90YXRpb24uU291cmNlUHJvcGVydGllcztcblx0XHRcdFx0XHRcdGlmIChzUGF0aCA9PT0gXCJlbnRpdHlcIikge1xuXHRcdFx0XHRcdFx0XHQvLyBkYXRhIGNvbWluZyBmcm9tIHNvdXJjZSBlbnRpdGllc1xuXHRcdFx0XHRcdFx0XHRvU2lkZUVmZmVjdHNbc093bmVyRW50aXR5VHlwZV0gPSBvU2lkZUVmZmVjdHNbc093bmVyRW50aXR5VHlwZV0gfHwgW1tdLCB7fV07XG5cdFx0XHRcdFx0XHRcdC8vIHNpZGUgZWZmZWN0cyBmb3IgZmllbGRzIHJlZmVyZW5jZWQgdmlhIHNvdXJjZSBlbnRpdGllcyBtdXN0IGFsd2F5cyBiZSByZXF1ZXN0ZWQgaW1tZWRpYXRlbHlcblx0XHRcdFx0XHRcdFx0b1NpZGVFZmZlY3RzW3NPd25lckVudGl0eVR5cGVdWzBdLnB1c2goc0VudGl0eVR5cGUgKyBzUXVhbGlmaWVyICsgXCIkJEltbWVkaWF0ZVJlcXVlc3RcIik7IC8vIC0tPiBtYXBwaW5nU291cmNlRW50aXRpZXNcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdG9TaWRlRWZmZWN0c1tzT3duZXJFbnRpdHlUeXBlXSA9IG9TaWRlRWZmZWN0c1tzT3duZXJFbnRpdHlUeXBlXSB8fCBbW10sIHt9XTtcblx0XHRcdFx0XHRcdFx0b1NpZGVFZmZlY3RzW3NPd25lckVudGl0eVR5cGVdWzFdW3NQYXRoXSA9IG9TaWRlRWZmZWN0c1tzT3duZXJFbnRpdHlUeXBlXVsxXVtzUGF0aF0gfHwgW107XG5cdFx0XHRcdFx0XHRcdC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lIHNvdXJjZSBwcm9wZXJ0eSwgc2lkZSBlZmZlY3QgcmVxdWVzdCBpcyByZXF1aXJlZCBpbW1lZGlhdGVseVxuXHRcdFx0XHRcdFx0XHRvU2lkZUVmZmVjdHNbc093bmVyRW50aXR5VHlwZV1bMV1bc1BhdGhdLnB1c2goXG5cdFx0XHRcdFx0XHRcdFx0c0VudGl0eVR5cGUgKyBzUXVhbGlmaWVyICsgKChhU291cmNlUHJvcGVydGllcy5sZW5ndGggPT09IDEgJiYgXCIkJEltbWVkaWF0ZVJlcXVlc3RcIikgfHwgXCJcIilcblx0XHRcdFx0XHRcdFx0KTsgLy8gLS0+IG1hcHBpbmdTb3VyY2VQcm9wZXJ0aWVzXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmV0dXJuIG9TaWRlRWZmZWN0cztcblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goKGU6IGFueSkgPT4gUHJvbWlzZS5yZWplY3QoZSkpO1xuXHR9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBTaWRlRWZmZWN0c0hlbHBlcjtcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7OztFQUFBLElBQU1BLCtCQUErQixHQUFHLFVBQVVDLGFBQVYsRUFBOEJDLFdBQTlCLEVBQW1EQyxVQUFuRCxFQUFvRTtJQUMzRyxJQUFNQyxlQUFlLEdBQUdILGFBQWEsQ0FBQyx5QkFBRCxDQUFyQztJQUNBLElBQUlJLFlBQUosQ0FGMkcsQ0FHM0c7SUFDQTs7SUFDQSxJQUFJRCxlQUFlLEtBQUssRUFBeEIsRUFBNEI7TUFDM0JDLFlBQVksR0FBR0MsT0FBTyxDQUFDQyxPQUFSLENBQWdCTCxXQUFoQixDQUFmO0lBQ0EsQ0FGRCxNQUVPO01BQ05HLFlBQVksR0FBR0YsVUFBVSxDQUFDSyxhQUFYLENBQXlCLE1BQU1O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