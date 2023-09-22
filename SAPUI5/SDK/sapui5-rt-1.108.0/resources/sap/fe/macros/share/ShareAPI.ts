import ObjectPath from "sap/base/util/ObjectPath";
import CommonUtils from "sap/fe/core/CommonUtils";
import { defineUI5Class, PropertiesOf, property, xmlEventHandler } from "sap/fe/core/helpers/ClassSupport";
import type PageController from "sap/fe/core/PageController";
import Button from "sap/m/Button";
import Menu from "sap/m/Menu";
import MenuButton from "sap/m/MenuButton";
import MenuItem, { $MenuItemSettings } from "sap/m/MenuItem";
import ServiceContainer from "sap/suite/ui/commons/collaboration/ServiceContainer";
import TeamsHelperService, { CollaborationOptions } from "sap/suite/ui/commons/collaboration/TeamsHelperService";
import UI5Event from "sap/ui/base/Event";
import Core from "sap/ui/core/Core";
import CustomData from "sap/ui/core/CustomData";
import View from "sap/ui/core/mvc/View";
import JSONModel from "sap/ui/model/json/JSONModel";
import MacroAPI from "../MacroAPI";

/**
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
 *
 * @alias sap.fe.macros.ShareAPI
 * @private
 * @since 1.108.0
 */
@defineUI5Class("sap.fe.macros.ShareAPI", {
	interfaces: ["sap.m.IOverflowToolbarContent"]
})
class ShareAPI extends MacroAPI {
	_internalMenuButton?: Button;
	constructor(mSettings?: PropertiesOf<ShareAPI>, ...others: any[]) {
		super(mSettings as any, ...others);

		if (this.content) {
			// attach to press event of internal button in menu button as menu button does not provide a press event
			// This is needed so that collaboration options can be added runtime to the share options
			// The collaboration options are fetched from an flp plugin and it is not gauranteed that is FLP plugin will always be loaded before the app loads.
			// For example, when the app is directly loaded via a URL the app is loaded first and the FLP plugin is loaded so we will not get the collaboration options at template time.
			const menuButtonId: string = this.content.getId();
			const internalMenuButtonId: string = menuButtonId + "-internalBtn";
			this._internalMenuButton = Core.byId(internalMenuButtonId) as Button;
			this._internalMenuButton.attachEventOnce("press", {}, this.onMenuButtonPressed, this);
		}
	}
	/**
	 * The identifier of the share control.
	 *
	 * @private
	 */
	@property({ type: "string" })
	id!: string;

	/**
	 * Whether the share macro is visible or not.
	 *
	 * @private
	 */
	@property({ type: "boolean", defaultValue: true })
	visible!: boolean;
	/**
	 * Returns properties for the interface IOverflowToolbarContent.
	 *
	 * @returns {Object} Returns the configuration of IOverflowToolbarContent
	 */
	getOverflowToolbarConfig() {
		return {
			canOverflow: true
		};
	}
	@xmlEventHandler()
	async onMenuButtonPressed() {
		const menuItems: Array<MenuItem> = [];
		const collaborationTeamsHelper: TeamsHelperService = await ServiceContainer.getServiceAsync();

		const ShareCollaborationOptions: Array<CollaborationOptions> = collaborationTeamsHelper.getOptions();
		// create menu items
		ShareCollaborationOptions.forEach((collaborationOption: CollaborationOptions) => {
			const menuItemSettings: $MenuItemSettings = {
				text: collaborationOption.text,
				icon: collaborationOption.icon
			};

			if (collaborationOption?.subOptions && collaborationOption?.subOptions?.length > 0) {
				menuItemSettings["items"] = [];
				collaborationOption.subOptions.forEach((subOption: CollaborationOptions) => {
					const subMenuItem = new MenuItem({
						text: subOption.text,
						icon: subOption.icon,
						press: this.menuItemPress,
						customData: new CustomData({
							key: "collaborationData",
							value: subOption
						})
					});
					(menuItemSettings["items"] as Array<MenuItem>)?.push(subMenuItem);
				});
			} else {
				// if there are no sub option then the main option should be clickable
				// so add a press handler.
				menuItemSettings["press"] = this.menuItemPress;
				menuItemSettings["customData"] = new CustomData({
					key: "collaborationData",
					value: collaborationOption
				});
			}
			const menuItem = new MenuItem(menuItemSettings);
			menuItems.push(menuItem);
		});

		//insert menu items
		if (menuItems) {
			const ShareMenuButton = this.content as MenuButton;
			const ShareMenu: Menu = ShareMenuButton.getMenu();

			const fnGetUser = ObjectPath.get("sap.ushell.Container.getUser");
			let defaultInsertionIndex = 0;
			// check where to insert the collaboration options
			if (!!fnGetUser && fnGetUser().isJamActive()) {
				// if JAM is active then teams option should be inserted after JAM (index = 2)
				defaultInsertionIndex = 2;
			} else {
				// if JAM is not active then the teams options should be inserted after Send as Email (index = 1)
				defaultInsertionIndex = 1;
			}
			menuItems.forEach(function (menuItem) {
				// as per UX the teams menu item should come after send as email
				// so we insert it at index 1 for now.
				// if there are more changes from UX needed with newer options then we can change it
				//if (menuItem.data('collaborationData')?.key === '')
				ShareMenu.insertItem(menuItem, defaultInsertionIndex);
				defaultInsertionIndex++;
			});
		}
	}

	async menuItemPress(event: UI5Event) {
		const clickedMenuItem = event.getSource() as MenuItem;
		const collaborationTeamsHelper: TeamsHelperService = await ServiceContainer.getServiceAsync();
		const view: View = CommonUtils.getTargetView(clickedMenuItem);
		const controller: PageController = view.getController() as PageController;
		// call adapt share metadata so that the collaboration info model is updated with the required info
		await controller.share._adaptShareMetadata();
		const collaborationInfo = (view.getModel("collaborationInfo") as JSONModel).getData();
		collaborationTeamsHelper.share(clickedMenuItem.data("collaborationData"), collaborationInfo);
	}

	openMenu() {
		this._internalMenuButton?.firePress();
	}
}

export default ShareAPI;
