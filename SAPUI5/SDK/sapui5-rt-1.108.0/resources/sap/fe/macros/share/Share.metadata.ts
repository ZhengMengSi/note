import ObjectPath from "sap/base/util/ObjectPath";
import AppComponent from "sap/fe/core/AppComponent";
import { BuildingBlockBase, defineBuildingBlock, xmlAttribute } from "sap/fe/core/buildingBlocks/BuildingBlock";
import { xml } from "sap/fe/core/buildingBlocks/BuildingBlockRuntime";
import type { PropertiesOf } from "sap/fe/core/helpers/ClassSupport";
import Core from "sap/ui/core/Core";
import AddBookmarkButton from "sap/ushell/ui/footerbar/AddBookmarkButton";

type ShareOptionType = {
	type: string;
	icon: string;
	text: string;
	press?: string;
	subOptions?: Array<object>;
};
/**
 * @classdesc
 * Building block used to create the ‘Share’ functionality.
 * <br>
 * Please note that the 'Share in SAP Jam' option is only available on platforms that are integrated with SAP Jam.
 * <br>
 * If you are consuming this macro in an environment where the SAP Fiori launchpad is not available, then the 'Save as Tile' option is not visible.
 *
 *
 * Usage example:
 * <pre>
 * &lt;macro:Share
 * 	id="someID"
 *	visible="true"
 * /&gt;
 * </pre>
 * @class sap.fe.macros.Share
 * @hideconstructor
 * @public
 * @since 1.93.0
 */
@defineBuildingBlock({
	name: "Share",
	namespace: "sap.fe.macros.internal",
	publicNamespace: "sap.fe.macros"
})
export default class ShareBuildingBlock extends BuildingBlockBase {
	@xmlAttribute({
		type: "string",
		required: true,
		isPublic: true
	})
	id!: string;

	@xmlAttribute({
		type: "boolean",
		defaultValue: true,
		isPublic: true
	})
	visible!: string;
	_appComponent!: AppComponent;
	_defaultShareOptions!: Array<ShareOptionType>;
	constructor(oProps: PropertiesOf<ShareBuildingBlock>, configuration: any, mSettings: any) {
		super(oProps, configuration, mSettings);
		this._appComponent = mSettings.appComponent;

		// get share options
		this._defaultShareOptions = this._getDefaultShareOptions();
	}
	_createMenuButton() {
		// Ctrl+Shift+S is needed for the time being but this needs to be removed after backlog from menu button
		return xml`
			<MenuButton 
				xmlns="sap.m"
				icon="sap-icon://action"
				visible="${this.visible}"
				tooltip="{sap.fe.i18n>M_COMMON_SAPFE_ACTION_SHARE} (Ctrl+Shift+S)"
			>
				<menu>
					${this._createMenu()}
				</menu>
			</MenuButton>
		`;
	}

	_createMenu() {
		return xml`
			<Menu>
				${this._createMenuItems()}
			</Menu>		
		`;
	}

	_createMenuItems() {
		let menuItems = "";
		this._defaultShareOptions.forEach((shareOption: ShareOptionType) => {
			menuItems += this._createMenuItem(shareOption);
		});
		return menuItems;
	}

	_createMenuItem(shareOption: ShareOptionType) {
		return xml`
			<MenuItem text="${shareOption.text}" icon="${shareOption.icon}" press="${shareOption.press}">
				${this._addMenuItemDependents(shareOption.type)}
			</MenuItem>
		`;
	}

	_addMenuItemDependents(itemType: string) {
		if (itemType === "saveAsTile") {
			return xml`
				<dependents>
					<footerbar:AddBookmarkButton 
						xmlns:footerbar="sap.ushell.ui.footerbar"
						visible="false"
					/>
				</dependents>
			`;
		} else {
			return xml``;
		}
	}
	_getDefaultShareOptions(): Array<ShareOptionType> {
		const appComponent: AppComponent = this._appComponent;
		// logic to get default share options
		const coreResource = Core.getLibraryResourceBundle("sap.fe.core");
		// set email
		const shareOptions: Array<ShareOptionType> = [
			{
				type: "email",
				text: coreResource.getText("T_SEMANTIC_CONTROL_SEND_EMAIL"),
				icon: "sap-icon://email",
				press: ".share._triggerEmail()"
			}
		];

		const fnGetUser = ObjectPath.get("sap.ushell.Container.getUser");

		// set share to jam
		if (!!fnGetUser && fnGetUser().isJamActive()) {
			shareOptions.push({
				type: "jam",
				text: coreResource.getText("T_COMMON_SAPFE_SHARE_JAM"),
				icon: "sap-icon://share-2",
				press: ".share._triggerShareToJam()"
			});
		}

		// set save as tile
		// for now we need to create addBookmarkButton to use the save as tile feature.
		// In the future save as tile should be available as a API or a MenuItem so that it can be added to the Menu button.
		// This needs to be discussed with AddBookmarkButton team.
		const addBookmarkButton = new AddBookmarkButton();
		const oShellServices = appComponent.getShellServices();
		if (oShellServices.hasUShell() && addBookmarkButton.getEnabled()) {
			shareOptions.push({
				type: "saveAsTile",
				text: addBookmarkButton.getText(),
				icon: addBookmarkButton.getIcon(),
				press: ".share._saveAsTile(${$source>})"
			});
		}
		addBookmarkButton.destroy();
		return shareOptions;
	}

	getTemplate() {
		return xml`
			<macro:ShareAPI
				xmlns:macro="sap.fe.macros.share"
				id="${this.id}"
			>
				 ${this._createMenuButton()}
			</macro:ShareAPI>
		`;
	}
}
