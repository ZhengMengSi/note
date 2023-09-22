export enum Placement {
	Before = "Before",
	After = "After"
}

export enum SectionType {
	Annotation = "Annotation",
	XMLFragment = "XMLFragment",
	Default = "Default" // TBD
}

export type BindingExpression<T> = T | string | undefined;

export interface ManifestSettings {
	entitySet: string;
}

export type Position = {
	placement?: Placement;
	anchor: string;
};

export interface Positioning {
	position?: Position;
}

export interface BaseSection extends Positioning {
	controlId: string;
	title: BindingExpression<string>;
	type: SectionType;
	showTitle?: boolean;
	visible: BindingExpression<boolean>;
	annotationRef?: string;
	name?: string;
}

export interface Section extends BaseSection {
	subSections: SubSection[];
}

export interface ManifestSection extends BaseSection {
	subSections: Record<string, SubSection>;
}

export interface SubSection extends BaseSection {}

export interface ObjectPageManifestSettings extends ManifestSettings {
	content?: {
		body?: {
			sections?: Record<string, ManifestSection>;
		};
	};
}
