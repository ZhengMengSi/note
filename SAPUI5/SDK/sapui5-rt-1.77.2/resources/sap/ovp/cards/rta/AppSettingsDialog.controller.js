sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/core/mvc/Controller","sap/ovp/cards/AppSettingsUtils","sap/ui/model/json/JSONModel"],function(q,C,A,J){'use strict';return C.extend("sap.ovp.cards.rta.AppSettingsDialog",{onInit:function(){A.oResetButton.attachPress(this.onResetButton,this);},onAfterRendering:function(){this.setEnablePropertyForResetAndSaveButton(false);this._ovpManifestSettings=this.getView().getModel().getData();this._originalOVPManifestSettings=q.extend(true,{},this._ovpManifestSettings);},onResetButton:function(){this.setEnablePropertyForResetAndSaveButton(false);this._ovpManifestSettings=q.extend(true,{},this._originalOVPManifestSettings);var o=new J(this._ovpManifestSettings);this.getView().setModel(o);this.getView().getModel().refresh();},onChange:function(){this.setEnablePropertyForResetAndSaveButton(true);},setEnablePropertyForResetAndSaveButton:function(e){A.oResetButton.setEnabled(e);A.oSaveButton.setEnabled(e);}});});