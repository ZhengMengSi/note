sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/AddGroup",
	"sap/suite/ui/generic/template/changeHandler/MoveGroup",
	"sap/suite/ui/generic/template/changeHandler/RemoveGroup",
	"sap/suite/ui/generic/template/changeHandler/AddSection",
	"sap/suite/ui/generic/template/changeHandler/AddGroupElement",
	"sap/suite/ui/generic/template/changeHandler/MoveGroupElement",
	"sap/suite/ui/generic/template/changeHandler/RemoveGroupElement",
	"sap/suite/ui/generic/template/changeHandler/RemoveSection",
	"sap/suite/ui/generic/template/changeHandler/MoveSection",
	"sap/suite/ui/generic/template/changeHandler/AddHeaderActionButton",
	"sap/suite/ui/generic/template/changeHandler/MoveHeaderAndFooterActionButton",
	"sap/suite/ui/generic/template/changeHandler/RemoveHeaderAndFooterActionButton",
	"sap/suite/ui/generic/template/changeHandler/AddFooterActionButton",
	"sap/suite/ui/generic/template/changeHandler/RemoveSubSection",
	"sap/suite/ui/generic/template/changeHandler/MoveSubSection",
	"sap/suite/ui/generic/template/changeHandler/AddSubSection",
	"sap/suite/ui/generic/template/changeHandler/AddHeaderFacet",
	"sap/suite/ui/generic/template/changeHandler/MoveHeaderFacet",
	"sap/suite/ui/generic/template/changeHandler/RemoveHeaderFacet",
	"sap/suite/ui/generic/template/changeHandler/RevealHeaderFacet",
	"sap/suite/ui/generic/template/changeHandler/RemoveTableColumn",
	"sap/suite/ui/generic/template/changeHandler/RevealTableColumn",
	"sap/suite/ui/generic/template/changeHandler/MoveTableColumns",
	"sap/suite/ui/generic/template/changeHandler/AddTableColumn"
],

function (AddGroup, MoveGroup, RemoveGroup, AddSection, AddGroupElement, MoveGroupElement, RemoveGroupElement, RemoveSection, MoveSection,
	AddHeaderActionButton, MoveHeaderAndFooterActionButton, RemoveHeaderAndFooterActionButton, AddFooterActionButton, RemoveSubSection,
	MoveSubSection, AddSubSection, AddHeaderFacet, MoveHeaderFacet, RemoveHeaderFacet, RevealHeaderFacet, RemoveTableColumn, RevealTableColumn,
	MoveTableColumns, AddTableColumn) {
	"use strict";
	return {
		"addGroup": AddGroup,
		"moveGroup": MoveGroup,
		"removeGroup": RemoveGroup,
		"addSection": AddSection,
		"addGroupElement": AddGroupElement,
		"moveGroupElement": MoveGroupElement,
		"removeGroupElement": RemoveGroupElement,
		"removeSection": RemoveSection,
		"moveSection": MoveSection,
		"addHeaderActionButton": AddHeaderActionButton,
		"moveHeaderAndFooterActionButton": MoveHeaderAndFooterActionButton,
		"removeHeaderAndFooterActionButton": RemoveHeaderAndFooterActionButton,
		"addFooterActionButton": AddFooterActionButton,
		"removeSubSection": RemoveSubSection,
		"moveSubSection": MoveSubSection,
		"addSubSection": AddSubSection,
		"addHeaderFacet": AddHeaderFacet,
		"moveHeaderFacet": MoveHeaderFacet,
		"removeHeaderFacet": RemoveHeaderFacet,
		"revealHeaderFacet": RevealHeaderFacet,
		"removeTableColumn": RemoveTableColumn,
		"revealTableColumn": RevealTableColumn,
		"moveTableColumns": MoveTableColumns,
		"addTableColumn": AddTableColumn
	};
}, /* bExport= */ true);