import { AnnotationTerm, ApplyAnnotationExpression, EntityType, FacetTypes, PathAnnotationExpression } from "@sap-ux/vocabularies-types";
import { StableIdHelper } from "sap/fe/macros";
import { AnnotationHelper, Context } from "sap/ui/model/odata/v4";
import {
	BindingExpression,
	ObjectPageManifestSettings,
	Placement,
	ManifestSection,
	SectionType,
	SubSection,
	Section
} from "./ManifestSettings";
import ConverterUtil from "./ConverterUtil";

export type ObjectPageDefinition = {
	sections?: ManifestSection[];
};

const isPathExpression = function<T>(expression: any): expression is PathAnnotationExpression<T> {
	return expression.type !== undefined && expression.type === "Path";
};

const getBindingExpression = function<T>(
	annotationValue: T | PathAnnotationExpression<T> | ApplyAnnotationExpression<T> | undefined,
	currentContext: Context,
	defaultValue?: T
): BindingExpression<T> {
	if (!annotationValue) {
		return defaultValue;
	} else if (isPathExpression(annotationValue)) {
		return AnnotationHelper.format({ $Path: annotationValue.path }, { context: currentContext });
	} else {
		return AnnotationHelper.format(annotationValue, { context: currentContext });
	}
};

const getInverseBindingExpression = function<T>(
	annotationValue: T | PathAnnotationExpression<T> | ApplyAnnotationExpression<T> | undefined,
	currentContext: Context,
	defaultValue?: T
): BindingExpression<T> {
	if (!annotationValue) {
		return defaultValue;
	}
	const bindingExpression = getBindingExpression(annotationValue, currentContext, defaultValue);
	return `{= !$${bindingExpression}}`;
};

const getFacetID = (stableIdParts: string[], facetDefinition: FacetTypes, currentTarget: string): string => {
	let idParts: string[] = stableIdParts.concat();
	if (facetDefinition.ID) {
		idParts.push(facetDefinition.ID as string);
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

const getFacetRefKey = (facetDefinition: FacetTypes, fallback: string): string => {
	return facetDefinition.ID?.toString() || facetDefinition.Label?.toString() || fallback;
};

const prepareSection = (section: ManifestSection | undefined | null, key: string): ManifestSection => {
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
	if (
		(section.type === SectionType.XMLFragment || section.type === SectionType.Default) &&
		(!section.subSections || !Object.keys(section.subSections).length)
	) {
		section.subSections = {
			"default": {
				...section,
				...{ showTitle: false, position: undefined, controlId: StableIdHelper.generate(["fe", "opss", key]) }
			}
		};
	}
	return section;
};

const convertFacet = (
	facetDefinition: FacetTypes,
	oMetaModelContext: Context,
	stableIdParts: string[],
	currentTarget: string
): ManifestSection => {
	const section: ManifestSection = {
		controlId: getFacetID(stableIdParts, facetDefinition, currentTarget),
		title: getBindingExpression<string>(facetDefinition.Label, oMetaModelContext),
		visible: getInverseBindingExpression<boolean>(facetDefinition.annotations?.UI?.Hidden, oMetaModelContext, true),
		annotationRef: oMetaModelContext.getPath(`@${currentTarget}`),
		subSections: {},
		type: SectionType.Annotation
	};

	section.showTitle = section.title !== undefined;
	switch (facetDefinition.$Type) {
		case "com.sap.vocabularies.UI.v1.CollectionFacet":
			// Two possibilities, either we have a Collection of Collection or collection of reference facets
			const collectionChild = facetDefinition.Facets.find(
				facetDefinition => facetDefinition.$Type === "com.sap.vocabularies.UI.v1.CollectionFacet"
			);
			if (collectionChild) {
				let sectionKey: string;

				facetDefinition.Facets.forEach((facetDefinition: AnnotationTerm<FacetTypes>, subFacetIndex: number) => {
					const subSection = convertFacet(
						facetDefinition,
						oMetaModelContext,
						["fe", "opss"],
						`${currentTarget}/Facets/${subFacetIndex}`
					);

					if (sectionKey !== undefined) {
						subSection.position = { anchor: sectionKey, placement: Placement.After };
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

export default {
	convertPage(
		entityType: EntityType,
		oMetaModelContext: Context,
		oManifestSettings: ObjectPageManifestSettings,
		unaliasFn: Function
	): ObjectPageDefinition {
		const sections: Record<string, ManifestSection> = {};
		let sectionKey: string;

		entityType.annotations.UI?.Facets?.forEach((facetDefinition: FacetTypes, facetIndex: number) => {
			const section = convertFacet(facetDefinition, oMetaModelContext, ["fe", "ops"], `${unaliasFn("UI.Facets")}/${facetIndex}`);
			if (sectionKey != null) {
				section.position = { anchor: sectionKey, placement: Placement.After };
			}
			sectionKey = getFacetRefKey(facetDefinition, facetIndex.toString());
			sections[sectionKey] = section;
		});

		for (let key in oManifestSettings.content?.body?.sections) {
			let customSection: ManifestSection | undefined = oManifestSettings.content?.body?.sections[key];
			sections[key] = prepareSection(
				{ ...{ controlId: StableIdHelper.generate(["fe", "ops", key]) }, ...sections[key], ...customSection },
				key
			);
		}

		// the "final" structure is different, e.g. resolve before/after ordering into arrays
		// TODO the final transform mechanism from the human readable form to "template ready" should happen at the very end, not here
		let parsedSections: ManifestSection[] = ConverterUtil.orderByPosition(sections)
			.filter(section => section.visible)
			.map(section => {
				((section as unknown) as Section).subSections = ConverterUtil.orderByPosition(section.subSections) as SubSection[];
				return section;
			});

		return {
			sections: parsedSections
		};
	}
};
