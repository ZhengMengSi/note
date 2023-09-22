// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/resources","sap/ushell/ui/launchpad/ActionItem","sap/base/Log","sap/ushell/ui/launchpad/LoadingDialog","sap/m/MessageBox","sap/ui/core/ElementMetadata","./LogoutButtonRenderer"],function(r,A,L,a,M,E){"use strict";var b=M.Action;var I=M.Icon;var c=A.extend("sap.ushell.ui.footerbar.LogoutButton",{metadata:{library:"sap.ushell"}});c.prototype.init=function(){if(A.prototype.init){A.prototype.init.apply(this,arguments);}this.setIcon("sap-icon://log");this.setTooltip(r.i18n.getText("signoutBtn_tooltip"));this.setText(r.i18n.getText("signoutBtn_title"));this.attachPress(this.logout);this.setEnabled();};c.prototype.logout=function(){sap.ui.require(["sap/m/MessageBox"],function(M){var s=true,i=false,l,o=new a({text:""});sap.ushell.Container.getGlobalDirty().done(function(d){s=false;if(i===true){o.exit();o=new a({text:""});}var _=function(d){var l={},R=r.i18n;if(d===sap.ushell.Container.DirtyState.DIRTY){l.message=R.getText("unsaved_data_warning_popup_message");l.icon=I.WARNING;l.messageTitle=R.getText("unsaved_data_warning_popup_title");}else{l.message=R.getText("signoutConfirmationMsg");l.icon=I.QUESTION;l.messageTitle=R.getText("signoutMsgTitle");}return l;};l=_(d);M.show(l.message,l.icon,l.messageTitle,[b.OK,b.CANCEL],function(e){if(e===b.OK){o.openLoadingScreen();o.showAppInfo(r.i18n.getText("beforeLogoutMsg"),null);sap.ushell.Container.logout();}},E.uid("confirm"));});if(s===true){o.openLoadingScreen();i=true;}});};c.prototype.setEnabled=function(e){if(!sap.ushell.Container){if(this.getEnabled()){L.warning("Disabling 'Logout' button: unified shell container not initialized",null,"sap.ushell.ui.footerbar.LogoutButton");}e=false;}A.prototype.setEnabled.call(this,e);};return c;});