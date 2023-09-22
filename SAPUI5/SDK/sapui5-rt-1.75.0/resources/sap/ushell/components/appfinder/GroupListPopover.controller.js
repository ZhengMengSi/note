// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/thirdparty/jquery","sap/m/MessageToast","sap/ushell/resources","sap/ui/Device","sap/ui/model/Context","sap/ui/model/json/JSONModel"],function(q,M,r,D,C,J){"use strict";sap.ui.controller("sap.ushell.components.appfinder.GroupListPopover",{onInit:function(){var v=this.getView(),g=v.getViewData().groupData;this.oPopoverModel=new J({userGroupList:g});this.oPopoverModel.setSizeLimit(9999);v.oPopover.setModel(this.oPopoverModel);},okButtonHandler:function(e){e.preventDefault();e._bIsStopHandlers=true;var v=this.getView(),u=this.oPopoverModel.getProperty("/userGroupList"),a={addToGroups:[],removeFromGroups:[],newGroups:[],allGroups:u};u.forEach(function(g){if(g.selected===g.initiallySelected){return;}if(g.selected){a.addToGroups.push(g.oGroup);}else{a.removeFromGroups.push(g.oGroup);}});if(v.newGroupInput&&v.newGroupInput.getValue().length){a.newGroups.push(v.newGroupInput.getValue());}v.oPopover.close();v.deferred.resolve(a);},_closeButtonHandler:function(e){e._bIsStopHandlers=true;var v=this.getView();v.oPopover.close();v.deferred.reject();},_createGroupAndSaveTile:function(t,n){var c=sap.ushell.components.getCatalogsManager(),d=q.Deferred(),p=c.createGroupAndSaveTile({catalogTileContext:t,newGroupName:n});p.done(function(a){d.resolve(a);});return d;},groupListItemClickHandler:function(o){o.oSource.setSelected(!o.oSource.getSelected());var i=o.oSource.getBindingContextPath(),p=o.oSource.getModel(),s=!!o.oSource.getSelected();this.addRemoveTileFromGroup(i,p,s);},getGroupsBeforeChanges:function(p){var m=this.getView().getViewData().sourceContext.oModel;return m.getProperty(p+"/associatedGroups");},getGroupsAfterChanges:function(){var g=sap.ui.getCore().byId("groupsPopover");return g.getModel().getProperty("/userGroupList");},checkboxClickHandler:function(o){var v=this.getView(),p=v.getViewData().sourceContext.sPath,g=this.getGroupsBeforeChanges(p),G=this.getGroupsAfterChanges(),l=sap.ushell.Container.getService("LaunchPage"),P=o.oSource.getModel(),s=o.getParameter("selected"),a=0,i=0,d=false,b;while(l.isGroupLocked(G[i].oGroup.object)===true){i++;}for(i;i<G.length;i++){var e=false;if(d===true){break;}for(a=0;a<g.length;a++){if(l.getGroupId(G[i].oGroup.object)===g[a]){e=true;if(G[i].selected===false){d=true;b=("/userGroupList/"+i);this.addRemoveTileFromGroup(b,P,s);break;}}}if(G[i].selected===true&&e===false){b=("/userGroupList/"+i);this.addRemoveTileFromGroup(b,P,s);break;}}},addRemoveTileFromGroup:function(i,p,t){var v=this.getView(),c=this.getView().getViewData().catalogController,a=this.getView().getViewData().catalogModel,T=this.getView().getViewData().sourceContext,g=a.getProperty("/groups"),b=g.indexOf(p.getProperty(i).oGroup),G=new C(a,"/groups/"+b),l=sap.ushell.Container.getService("LaunchPage"),s=l.getGroupId(a.getProperty("/groups/"+b).object);if(t){var A=c._addTile(T,G);A.done(function(e){var f=v.getViewData().sourceContext,h=a.getProperty(f+"/associatedGroups");h.push(s);a.setProperty(f+"/associatedGroups",h);});}else{var d=T.getModel().getProperty(T.getPath()).id,R=c._removeTile(d,b);R.done(function(e){var f=v.getViewData().sourceContext,h=a.getProperty(f+"/associatedGroups"),j=h?Array.prototype.indexOf.call(h,s):-1;if(j>=0){h.splice(j,1);}a.setProperty(f+"/associatedGroups",h);});}},_switchGroupsPopoverButtonPress:function(){var g="groupsPopover-popover";if(D.system.phone){g="groupsPopover-dialog";}if(sap.ui.getCore().byId(g).getContent()[0].getId()==="newGroupNameInput"){var u=this.oPopoverModel.getProperty("/userGroupList"),a={addToGroups:[],removeFromGroups:[],newGroups:[],allGroups:u};if(this.getView().newGroupInput.getValue().length){a.newGroups.push(this.getView().newGroupInput.getValue());}this.getView().oPopover.close();this.getView().deferred.resolve(a);}else{this._closeButtonHandler(this);}},_navigateToCreateNewGroupPane:function(){var v=this.getView();if(!v.headBarForNewGroup){v.headBarForNewGroup=v._createHeadBarForNewGroup();}if(!v.newGroupInput){v.newGroupInput=v._createNewGroupInput();}v.oPopover.removeAllContent();v.oPopover.addContent(v.newGroupInput);v.oPopover.setCustomHeader(v.headBarForNewGroup);v.oPopover.setContentHeight("");setTimeout(function(){v.oPopover.getBeginButton().setText(r.i18n.getText("okDialogBtn"));},0);if(v.oPopover.getEndButton()){v.oPopover.getEndButton().setVisible(true);}if(sap.ui.getCore().byId("groupsPopover-popover")&&(sap.ui.getCore().byId("groupsPopover-popover").getContent()[0].getId()==="newGroupNameInput")&&!v.oPopover.getEndButton()){v.oPopover.setEndButton(v._createCancelButton());}setTimeout(function(){v.oPopover.getEndButton().setText(r.i18n.getText("cancelBtn"));},0);if(v.getViewData().singleGroupSelection){this._setFooterVisibility(true);}setTimeout(function(){v.newGroupInput.focus();},0);},setSelectedStart:function(s){this.start=s;},_afterCloseHandler:function(){var v=this.getView(),c=this.getView().getViewData().catalogModel;if(c){var s=c.getProperty(this.getView().getViewData().sourceContext+"/associatedGroups");this.showToastMessage(s,this.start);}v.oGroupsContainer.destroy();if(v.headBarForNewGroup){v.headBarForNewGroup.destroy();}if(v.newGroupInput){v.newGroupInput.destroy();}v.oPopover.destroy();v.destroy();},showToastMessage:function(e,s){var a=0,b=0,f,c,d={};e.forEach(function(g){d[g]=g;});s.forEach(function(g){if(d[g.id]){if(g.selected===false){a++;f=g.title;}}else if(g.selected===true){b++;c=g.title;}});var m=this.getView().getViewData().catalogController.prepareDetailedMessage(this.getView().getViewData().title,a,b,f,c);if(m){M.show(m,{duration:6000,width:"15em",my:"center bottom",at:"center bottom",of:window,offset:"0 -50",collision:"fit fit"});}},_backButtonHandler:function(){var v=this.getView();v.oPopover.removeAllContent();if(v.getViewData().singleGroupSelection){this._setFooterVisibility(false);}if(!D.system.phone){v.oPopover.setContentHeight(v.iPopoverDataSectionHeight+"px");}else{v.oPopover.setContentHeight("100%");}v.oPopover.setVerticalScrolling(true);v.oPopover.setHorizontalScrolling(false);v.oPopover.addContent(v.oGroupsContainer);v.oPopover.setTitle(r.i18n.getText("addTileToGroups_popoverTitle"));v.oPopover.setCustomHeader();v.newGroupInput.setValue("");if(sap.ui.getCore().byId("groupsPopover-popover")&&(sap.ui.getCore().byId("groupsPopover-popover").getContent()[0].getId()!="newGroupNameInput")){v.oPopover.getEndButton().setVisible(false);}setTimeout(function(){v.oPopover.getBeginButton().setText(r.i18n.getText("close"));},0);},_setFooterVisibility:function(v){var f=sap.ui.getCore().byId("groupsPopover-footer");if(f){f.setVisible(v);}}});});