import {
	Annotation,
	AnnotationList,
	AnnotationRecord,
	EntityType,
	Expression,
	ParserOutput,
	Property,
	ReferentialConstraint,
	V4NavigationProperty
} from "@sap-ux/vocabularies-types";
import ObjectPageConverter from "./ObjectPageConverter";
// This file is retrieved from @sap-ux/annotation-converter, shared code with tool suite
import { AnnotationConverter } from "sap/fe/core/converters/common";
import { ManifestSettings, ObjectPageManifestSettings } from "./ManifestSettings";

const VOCABULARY_ALIAS: any = {
	"Org.OData.Capabilities.V1": "Capabilities",
	"Org.OData.Core.V1": "Core",
	"Org.OData.Measures.V1": "Measures",
	"com.sap.vocabularies.Common.v1": "Common",
	"com.sap.vocabularies.UI.v1": "UI",
	"com.sap.vocabularies.Analytics.v1": "Analytics",
	"com.sap.vocabularies.PersonalData.v1": "PersonalData",
	"com.sap.vocabularies.Communication.v1": "Communication"
};

const MetaModelConverter = {
	parsePropertyValue(annotationObject: any, propertyKey: string, currentTarget: string, annotationsLists: any[]): any {
		let value;
		let currentPropertyTarget: string = currentTarget + "/" + propertyKey;
		if (typeof annotationObject === "string") {
			value = { type: "String", String: annotationObject };
		} else if (typeof annotationObject === "boolean") {
			value = { type: "Bool", Bool: annotationObject };
		} else if (typeof annotationObject === "number") {
			value = { type: "Int", Int: annotationObject };
		} else if (Array.isArray(annotationObject)) {
			value = {
				type: "Collection",
				Collection: annotationObject.map((subAnnotationObject, subAnnotationObjectIndex) =>
					this.parseAnnotationObject(
						subAnnotationObject,
						currentPropertyTarget + "/" + subAnnotationObjectIndex,
						annotationsLists
					)
				)
			};
			if (annotationObject[0].$PropertyPath) {
				(value.Collection as any).type = "PropertyPath";
			} else if (annotationObject[0].$NavigationPropertyPath) {
				(value.Collection as any).type = "NavigationPropertyPath";
			} else if (annotationObject[0].$AnnotationPath) {
				(value.Collection as any).type = "AnnotationPath";
			} else if (annotationObject[0].$Type) {
				(value.Collection as any).type = "Record";
			} else {
				(value.Collection as any).type = "String";
			}
		} else if (annotationObject.$Path !== undefined) {
			value = { type: "Path", Path: annotationObject.$Path };
		} else if (annotationObject.$Decimal !== undefined) {
			value = { type: "Decimal", Decimal: parseFloat(annotationObject.$Decimal) };
		} else if (annotationObject.$PropertyPath !== undefined) {
			value = { type: "PropertyPath", PropertyPath: annotationObject.$PropertyPath };
		} else if (annotationObject.$NavigationPropertyPath !== undefined) {
			value = {
				type: "NavigationPropertyPath",
				NavigationPropertyPath: annotationObject.$NavigationPropertyPath
			};
		} else if (annotationObject.$AnnotationPath !== undefined) {
			value = { type: "AnnotationPath", AnnotationPath: annotationObject.$AnnotationPath };
		} else if (annotationObject.$EnumMember !== undefined) {
			value = {
				type: "EnumMember",
				EnumMember:
					this.mapNameToAlias(annotationObject.$EnumMember.split("/")[0]) + "/" + annotationObject.$EnumMember.split("/")[1]
			};
		} else if (annotationObject.$Type) {
			value = {
				type: "Record",
				Record: this.parseAnnotationObject(annotationObject, currentTarget, annotationsLists)
			};
		}
		return {
			name: propertyKey,
			value
		};
	},
	mapNameToAlias(annotationName: string): string {
		let [pathPart, annoPart] = annotationName.split("@");
		if (!annoPart) {
			annoPart = pathPart;
			pathPart = "";
		} else {
			pathPart += "@";
		}
		const lastDot = annoPart.lastIndexOf(".");
		return pathPart + VOCABULARY_ALIAS[annoPart.substr(0, lastDot)] + "." + annoPart.substr(lastDot + 1);
	},
	parseAnnotationObject(
		annotationObject: any,
		currentObjectTarget: string,
		annotationsLists: any[]
	): Expression | AnnotationRecord | Annotation {
		let parsedAnnotationObject: any = {};
		let isCollection = false;
		if (typeof annotationObject === "string") {
			parsedAnnotationObject = { type: "String", String: annotationObject };
		} else if (typeof annotationObject === "boolean") {
			parsedAnnotationObject = { type: "Bool", Bool: annotationObject };
		} else if (typeof annotationObject === "number") {
			parsedAnnotationObject = { type: "Int", Int: annotationObject };
		} else if (annotationObject.$AnnotationPath !== undefined) {
			parsedAnnotationObject = { type: "AnnotationPath", AnnotationPath: annotationObject.$AnnotationPath };
		} else if (annotationObject.$Path !== undefined) {
			parsedAnnotationObject = { type: "Path", Path: annotationObject.$Path };
		} else if (annotationObject.$Decimal !== undefined) {
			parsedAnnotationObject = { type: "Decimal", Decimal: parseFloat(annotationObject.$Decimal) };
		} else if (annotationObject.$PropertyPath !== undefined) {
			parsedAnnotationObject = { type: "PropertyPath", PropertyPath: annotationObject.$PropertyPath };
		} else if (annotationObject.$NavigationPropertyPath !== undefined) {
			parsedAnnotationObject = {
				type: "NavigationPropertyPath",
				NavigationPropertyPath: annotationObject.$NavigationPropertyPath
			};
		} else if (annotationObject.$EnumMember !== undefined) {
			parsedAnnotationObject = {
				type: "EnumMember",
				EnumMember:
					this.mapNameToAlias(annotationObject.$EnumMember.split("/")[0]) + "/" + annotationObject.$EnumMember.split("/")[1]
			};
		} else if (Array.isArray(annotationObject)) {
			isCollection = true;
			const parsedAnnotationCollection = parsedAnnotationObject as any;
			parsedAnnotationCollection.collection = annotationObject.map((subAnnotationObject, subAnnotationIndex) =>
				this.parseAnnotationObject(subAnnotationObject, currentObjectTarget + "/" + subAnnotationIndex, annotationsLists)
			);
			if (annotationObject[0].$PropertyPath) {
				(parsedAnnotationCollection.collection as any).type = "PropertyPath";
			} else if (annotationObject[0].$NavigationPropertyPath) {
				(parsedAnnotationCollection.collection as any).type = "NavigationPropertyPath";
			} else if (annotationObject[0].$AnnotationPath) {
				(parsedAnnotationCollection.collection as any).type = "AnnotationPath";
			} else if (annotationObject[0].$Type) {
				(parsedAnnotationCollection.collection as any).type = "Record";
			} else {
				(parsedAnnotationCollection.collection as any).type = "String";
			}
		} else {
			if (annotationObject.$Type) {
				const typeValue = annotationObject.$Type;
				const typeAlias = VOCABULARY_ALIAS[typeValue.substr(0, typeValue.lastIndexOf("."))];
				const typeTerm = typeValue.substr(typeValue.lastIndexOf(".") + 1);
				parsedAnnotationObject.type = `${typeAlias}.${typeTerm}`;
			}
			const propertyValues: any = [];
			Object.keys(annotationObject).forEach(propertyKey => {
				if (propertyKey !== "$Type" && !propertyKey.startsWith("@")) {
					propertyValues.push(
						this.parsePropertyValue(annotationObject[propertyKey], propertyKey, currentObjectTarget, annotationsLists)
					);
				} else if (propertyKey.startsWith("@")) {
					// Annotation of annotation
					const annotationQualifierSplit = propertyKey.split("#");
					const qualifier = annotationQualifierSplit[1];
					let annotationKey = annotationQualifierSplit[0];
					// Check for annotation of annotation
					let currentOutAnnotationObject = this.getOrCreateAnnotationList(currentObjectTarget, annotationsLists);
					currentOutAnnotationObject.annotations.push({
						term: this.mapNameToAlias(annotationKey.substr(1)),
						qualifier: qualifier,
						value: this.parseAnnotationObject(
							annotationObject[propertyKey],
							currentObjectTarget,
							annotationsLists
						) as Expression,
						isCollection: false
					} as Annotation);
				}
			});
			parsedAnnotationObject.propertyValues = propertyValues;
		}
		return parsedAnnotationObject;
	},
	getOrCreateAnnotationList(target: string, annotationsLists: AnnotationList[]): AnnotationList {
		let potentialTarget = annotationsLists.find(annotationList => annotationList.target === target);
		if (!potentialTarget) {
			potentialTarget = {
				target: target,
				annotations: []
			};
			annotationsLists.push(potentialTarget);
		}
		return potentialTarget;
	},

	createAnnotationLists(
		oMetaModel: typeof sap.ui.model.odata.v4.ODataMetaModel,
		annotationObjects: any,
		annotationTarget: string,
		annotationLists: any[]
	) {
		const outAnnotationObject: any = {
			target: annotationTarget,
			annotations: []
		};
		Object.keys(annotationObjects).forEach(annotationKey => {
			let currentOutAnnotationObject = outAnnotationObject;
			const annotationObject = annotationObjects[annotationKey];
			const annotationQualifierSplit = annotationKey.split("#");
			const qualifier = annotationQualifierSplit[1];
			annotationKey = annotationQualifierSplit[0];
			// Check for annotation of annotation
			const annotationOfAnnotationSplit = annotationKey.split("@");
			if (annotationOfAnnotationSplit.length > 2) {
				currentOutAnnotationObject = this.getOrCreateAnnotationList(
					annotationTarget + "@" + this.mapNameToAlias(annotationOfAnnotationSplit[1]),
					annotationLists
				);
				annotationKey = annotationOfAnnotationSplit[2];
			} else {
				annotationKey = annotationOfAnnotationSplit[1];
			}

			const annotationAlias = VOCABULARY_ALIAS[annotationKey.substr(0, annotationKey.lastIndexOf("."))];
			const annotationTerm = annotationKey.substr(annotationKey.lastIndexOf(".") + 1);
			const parsedAnnotationObject: any = {
				term: `${annotationAlias}.${annotationTerm}`,
				qualifier: qualifier
			};
			let currentAnnotationTarget = annotationTarget + "@" + parsedAnnotationObject.term;
			if (qualifier) {
				currentAnnotationTarget += "#" + qualifier;
			}
			let isCollection = false;
			if (typeof annotationObject === "string") {
				parsedAnnotationObject.value = { type: "String", String: annotationObject };
			} else if (typeof annotationObject === "boolean") {
				parsedAnnotationObject.value = { type: "Bool", Bool: annotationObject };
			} else if (typeof annotationObject === "number") {
				parsedAnnotationObject.value = { type: "Int", Int: annotationObject };
			} else if (annotationObject.$Path !== undefined) {
				parsedAnnotationObject.value = { type: "Path", Path: annotationObject.$Path };
			} else if (annotationObject.$AnnotationPath !== undefined) {
				parsedAnnotationObject.value = { type: "AnnotationPath", AnnotationPath: annotationObject.$AnnotationPath };
			} else if (annotationObject.$Decimal !== undefined) {
				parsedAnnotationObject.value = { type: "Decimal", Decimal: parseFloat(annotationObject.$Decimal) };
			} else if (annotationObject.$EnumMember !== undefined) {
				parsedAnnotationObject.value = {
					type: "EnumMember",
					EnumMember:
						this.mapNameToAlias(annotationObject.$EnumMember.split("/")[0]) + "/" + annotationObject.$EnumMember.split("/")[1]
				};
			} else if (Array.isArray(annotationObject)) {
				isCollection = true;
				parsedAnnotationObject.collection = annotationObject.map((subAnnotationObject, subAnnotationIndex) =>
					this.parseAnnotationObject(subAnnotationObject, currentAnnotationTarget + "/" + subAnnotationIndex, annotationLists)
				);
				if (annotationObject[0].$PropertyPath) {
					(parsedAnnotationObject.collection as any).type = "PropertyPath";
				} else if (annotationObject[0].$NavigationPropertyPath) {
					(parsedAnnotationObject.collection as any).type = "NavigationPropertyPath";
				} else if (annotationObject[0].$AnnotationPath) {
					(parsedAnnotationObject.collection as any).type = "AnnotationPath";
				} else if (annotationObject[0].$Type) {
					(parsedAnnotationObject.collection as any).type = "Record";
				} else {
					(parsedAnnotationObject.collection as any).type = "String";
				}
			} else {
				const record: AnnotationRecord = {
					propertyValues: []
				};
				if (annotationObject.$Type) {
					const typeValue = annotationObject.$Type;
					const typeAlias = VOCABULARY_ALIAS[typeValue.substr(0, typeValue.lastIndexOf("."))];
					const typeTerm = typeValue.substr(typeValue.lastIndexOf(".") + 1);
					record.type = `${typeAlias}.${typeTerm}`;
				}
				const propertyValues: any[] = [];
				Object.keys(annotationObject).forEach(propertyKey => {
					if (propertyKey !== "$Type" && !propertyKey.startsWith("@")) {
						propertyValues.push(
							this.parsePropertyValue(annotationObject[propertyKey], propertyKey, currentAnnotationTarget, annotationLists)
						);
					} else if (propertyKey.startsWith("@")) {
						// Annotation of record
						annotationLists.push({
							target: currentAnnotationTarget,
							annotations: [
								{
									value: this.parseAnnotationObject(
										annotationObject[propertyKey],
										currentAnnotationTarget,
										annotationLists
									)
								}
							]
						});
					}
				});
				record.propertyValues = propertyValues;
				parsedAnnotationObject.record = record;
			}
			parsedAnnotationObject.isCollection = isCollection;
			currentOutAnnotationObject.annotations.push(parsedAnnotationObject);
		});
		if (outAnnotationObject.annotations.length > 0) {
			annotationLists.push(outAnnotationObject);
		}
	},
	parseProperty(oMetaModel: any, entityTypeObject: EntityType, propertyName: string, annotationLists: AnnotationList[]): Property {
		const propertyAnnotation = oMetaModel.getObject(`/${entityTypeObject.name}/${propertyName}@`);
		const propertyDefinition = oMetaModel.getObject(`/${entityTypeObject.name}/${propertyName}`);

		const propertyObject: Property = {
			_type: "Property",
			name: propertyName,
			fullyQualifiedName: `${entityTypeObject.fullyQualifiedName}/${propertyName}`,
			type: propertyDefinition.$Type,
			maxLength: propertyDefinition.$MaxLength,
			precision: propertyDefinition.$Precision,
			scale: propertyDefinition.$Scale,
			nullable: propertyDefinition.$Nullable,
			annotations: {}
		};

		this.createAnnotationLists(oMetaModel, propertyAnnotation, propertyObject.fullyQualifiedName, annotationLists);

		return propertyObject;
	},
	parseNavigationProperty(
		oMetaModel: any,
		entityTypeObject: EntityType,
		navPropertyName: string,
		annotationLists: AnnotationList[]
	): V4NavigationProperty {
		const navPropertyAnnotation = oMetaModel.getObject(`/${entityTypeObject.name}/${navPropertyName}@`);
		const navPropertyDefinition = oMetaModel.getObject(`/${entityTypeObject.name}/${navPropertyName}`);

		let referentialConstraint: ReferentialConstraint[] = [];
		if (navPropertyDefinition.$ReferentialConstraint) {
			referentialConstraint = Object.keys(navPropertyDefinition.$ReferentialConstraint).map(sourcePropertyName => {
				return {
					sourceTypeName: entityTypeObject.name,
					sourceProperty: sourcePropertyName,
					targetTypeName: navPropertyDefinition.$Type,
					targetProperty: navPropertyDefinition.$ReferentialConstraint[sourcePropertyName]
				};
			});
		}
		const navigationProperty: V4NavigationProperty = {
			_type: "NavigationProperty",
			name: navPropertyName,
			fullyQualifiedName: `${entityTypeObject.fullyQualifiedName}/${navPropertyName}`,
			partner: navPropertyDefinition.$Partner,
			isCollection: navPropertyDefinition.$isCollection ? navPropertyDefinition.$isCollection : false,
			targetTypeName: navPropertyDefinition.$Type,
			referentialConstraint,
			annotations: {}
		};

		this.createAnnotationLists(oMetaModel, navPropertyAnnotation, navigationProperty.fullyQualifiedName, annotationLists);

		return navigationProperty;
	},
	parseEntityType(oMetaModel: any, entitySetName: string, annotationLists: AnnotationList[]): EntityType {
		const entitySetDefinition = oMetaModel.getObject(`/${entitySetName}`);
		const entitySetAnnotation = oMetaModel.getObject(`/${entitySetName}@`);
		const entityTypeAnnotation = oMetaModel.getObject(`/${entitySetName}/@`);
		const entityTypeDefinition = oMetaModel.getObject(`/${entitySetName}/`);
		const entityKeys = entityTypeDefinition.$Key;
		const entityTypeObject: EntityType = {
			_type: "EntityType",
			name: entitySetName,
			fullyQualifiedName: entitySetDefinition.$Type,
			keys: [],
			entityProperties: [],
			navigationProperties: [],
			annotations: {
				getAnnotation(annotationName: string) {
					return (entityTypeObject.annotations as any)[annotationName];
				}
			}
		};
		this.createAnnotationLists(oMetaModel, entityTypeAnnotation, entityTypeObject.fullyQualifiedName, annotationLists);
		this.createAnnotationLists(oMetaModel, entitySetAnnotation, `EntityContainer/${entitySetName}`, annotationLists);
		const entityProperties = Object.keys(entityTypeDefinition)
			.filter(propertyNameOrNot => {
				if (propertyNameOrNot != "$Key" && propertyNameOrNot != "$kind") {
					return entityTypeDefinition[propertyNameOrNot].$kind === "Property";
				}
			})
			.map(propertyName => {
				return this.parseProperty(oMetaModel, entityTypeObject, propertyName, annotationLists);
			});

		const navigationProperties = Object.keys(entityTypeDefinition)
			.filter(propertyNameOrNot => {
				if (propertyNameOrNot != "$Key" && propertyNameOrNot != "$kind") {
					return entityTypeDefinition[propertyNameOrNot].$kind === "NavigationProperty";
				}
			})
			.map(navPropertyName => {
				return this.parseNavigationProperty(oMetaModel, entityTypeObject, navPropertyName, annotationLists);
			});

		entityTypeObject.keys = entityKeys.map((entityKey: string) =>
			entityProperties.find((property: Property) => property.name === entityKey)
		);
		entityTypeObject.entityProperties = entityProperties;
		entityTypeObject.navigationProperties = navigationProperties;

		return entityTypeObject;
	},
	parseEntityTypes(oMetaModel: any): ParserOutput {
		const oEntitySets = oMetaModel.getObject("/");
		const annotationLists: AnnotationList[] = [];
		const entityTypes = Object.keys(oEntitySets)
			.filter(entitySetName => {
				return entitySetName !== "$kind" && oEntitySets[entitySetName].$kind === "EntitySet";
			})
			.map(entitySetName => {
				return this.parseEntityType(oMetaModel, entitySetName, annotationLists);
			});

		const unaliasFn = (aliasedValue: string): string => {
			if (!aliasedValue) {
				return aliasedValue;
			}
			const [alias, value] = aliasedValue.split(".");
			const namespace = Object.keys(VOCABULARY_ALIAS).find(originalName => {
				return VOCABULARY_ALIAS[originalName] === alias;
			});
			if (namespace) {
				return `${namespace}.${value}`;
			} else {
				if (aliasedValue.indexOf("@") !== -1) {
					const [preAlias, postAlias] = aliasedValue.split("@");
					return `${preAlias}@${unaliasFn(postAlias)}`;
				} else {
					return aliasedValue;
				}
			}
		};
		return {
			identification: "metamodelResult",
			version: "4.0",
			schema: {
				entityContainer: {},
				entitySets: [],
				entityTypes,
				associations: [],
				actions: [],
				namespace: "",
				annotations: {
					"metamodelResult": annotationLists
				}
			},
			references: [],
			unalias: unaliasFn
		};
	},
	convertTypes(oMetaModel: any) {
		const parsedOutput = this.parseEntityTypes(oMetaModel);

		return AnnotationConverter.convertTypes(parsedOutput);
	},
	convertPage(oMetaModel: any, oManifestSettings: ManifestSettings) {
		const serviceObject = this.convertTypes(oMetaModel);
		const sEntitySet = oManifestSettings.entitySet;
		const targetEntityType: EntityType | undefined = serviceObject.schema.entityTypes.find(
			(entityType: EntityType) => entityType.name === sEntitySet
		);
		if (targetEntityType) {
			const oContext = oMetaModel.createBindingContext("/" + sEntitySet);
			return {
				[sEntitySet]: ObjectPageConverter.convertPage(
					targetEntityType,
					oContext,
					oManifestSettings as ObjectPageManifestSettings,
					serviceObject.unalias
				)
			};
		}
	}
};

export default MetaModelConverter;
