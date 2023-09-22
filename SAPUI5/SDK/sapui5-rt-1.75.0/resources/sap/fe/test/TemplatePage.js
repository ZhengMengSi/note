sap.ui.define(["sap/ui/test/OpaBuilder","sap/ui/test/Opa5","sap/ui/table/library","sap/ui/core/util/ShortcutHelper","sap/fe/test/Utils","sap/fe/test/builder/FEBuilder","sap/fe/test/builder/FieldBuilder","sap/fe/test/builder/TableBuilder"],function(O,a,G,S,U,F,b,T){"use strict";var R=G.RowActionType;function _(r,v){if(arguments.length===2){var p={};p[r]=v;return p;}return r;}function g(r){var o=r.getRowAction();return o.getItems().reduce(function(i,A,I){if(!i&&A.getType()===R.Navigation){i=o.getAggregation("_icons")[I];}return i;},null);}function c(s){return function(r){return F.Matchers.states(s)(r.getMetadata().getName()==="sap.ui.table.Row"?g(r):r);};}function d(t){return t+"-settings";}function e(f,v){return O.Matchers.aggregationMatcher("cells",function(C){var h=false;if(C.getItems){var i=C.getItems();if(i&&i.length===2){h=i[0].getProperty("text")===f;if(v!==undefined){if(!Array.isArray(v)){v=[v];}v=v.join(" > ");h=h&&i[1].getProperty("text")===v;}}}return h;});}return{create:function(v,E){var r=sap.ui.getCore().getLibraryResourceBundle("sap.fe.templates"),o=sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");return{viewId:v,actions:{_iSelectRowWithCellValue:function(t,f,V){f=_(f,V);return T.create(this).hasId(t).doSelect(f).description(U.formatMessage("Selecting row(s) on table '{0}' having '{1}'",t,f)).execute(this);},_iActOnRowWithCellValue:function(t,f,V){f=_(f,V);return T.create(this).hasId(t).doNavigate(f).description(U.formatMessage("Pressing row on table '{0}' having '{1}'",t,f)).execute(this);},_iEditCellValueForRowWithCellValue:function(t,f,V,i){if(arguments.length===4){f=_(f,V);}else{i=V;V=undefined;}return T.create(this).hasId(t).doEditValues(f,i).description(U.formatMessage("Editing table '{0}' setting values '{1}' for row(s) having '{2}'",t,i,f)).execute(this);},iCloseMessageErrorDialog:function(){return O.create(this).isDialogElement().hasType("sap.m.Bar").hasAggregation("contentMiddle",O.Matchers.resourceBundle("text","sap.fe","Error")).do(O.create(this).isDialogElement().hasType("sap.m.Dialog").doOnAggregation("beginButton",O.Matchers.resourceBundle("text","sap.fe.core","SAPFE_CLOSE"),O.Actions.press())).description("Closing message error dialog").execute();},_iDeleteSelected:function(t){return O.create(this).hasId(t+"::Delete").mustBeEnabled(false).doPress().doConditional(O.Matchers.properties({enabled:true}),O.create(this).hasType("sap.m.Button").isDialogElement().hasProperties({text:r.getText("OBJECT_PAGE_DELETE")}).doPress()).description("Deleting selected rows").execute();},_iExecuteBoundAction:function(t,s,A){return O.create(this).hasId(t+"::"+s+"."+A).doPress().description("Executing bound action '"+s+"."+A+"'").execute();},iOpenVHOnActionDialog:function(f){var s="APD_::"+f+"-inner-vhi";return O.create(this).hasId(s).isDialogElement().doPress().description("Opening value help for '"+f+"'").execute();},_iSwitchItem:function(n){var i=n?{icon:"sap-icon://navigation-down-arrow"}:{icon:"sap-icon://navigation-up-arrow"};return O.create(this).hasType("sap.fe.templates.controls.Paginator").doOnChildren(O.create(this).hasType("sap.uxap.ObjectPageHeaderActionButton").hasProperties(i).doPress()).description("Paginator button "+(n?"Up":"Down")+" pressed").execute();},_iPressKeyboardShortcut:function(i,s){return O.create(this).hasId(i).do(function(f){var n=S.parseShortcut(s);n.type="keydown";f.$().trigger(n);}).description("Execute keyboard shortcut "+s).execute();},iCancelActionDialog:function(){return O.create(this).hasType("sap.m.Button").isDialogElement().hasProperties({text:o.getText("SAPFE_ACTION_PARAMETER_DIALOG_CANCEL")}).doPress().description("Cancelling Action dialog").execute();},iConfirmActionVHDialog:function(s,A,f){return O.create(this).hasId(s+"."+A+"::"+f+"-ok").isDialogElement().doPress().description("Confirming value help dialog for action "+A).execute();},iCancelActionVHDialog:function(s,A,f){return O.create(this).hasId(s+"."+A+"::"+f+"-cancel").isDialogElement().doPress().description("Cancelling value help dialog for action "+A).execute();},iCollapseExpandPageHeader:function(C){return O.create(this).hasType("sap.m.Button").has(O.Matchers.resourceBundle("tooltip","sap.f",C?"COLLAPSE_HEADER_BUTTON_TOOLTIP":"EXPAND_HEADER_BUTTON_TOOLTIP")).doPress().description("Resizing of the Page Header").execute();},_iOpenTableSortSettings:function(t){return T.create(this).hasId(t).doPress("sort").description("Opening sort settings for table "+t).execute();},_iAddColumnInTableSettings:function(f,h){return this._iModifyFilterInTableSettings(f,h,false,"Adding column");},_iSortTableByColumn:function(t,C){return this._iOpenTableSortSettings(t).and._iAddColumnInTableSettings(C);},_iModifyFilterInTableSettings:function(f,h,i,D){return O.create(this).hasType("sap.m.ColumnListItem").isDialogElement().hasProperties({selected:i}).has(e(f,h)).doOnChildren(O.create(this).hasType("sap.m.CheckBox").doPress()).description(D+" '"+f+"'").execute();}},assertions:{_iCanAccessColumnInTableSettings:function(t,f,h,s){var i=O.create(this).hasType("sap.m.ColumnListItem").isDialogElement().has(e(f,h)).description("Column '"+f+"' is available in table settings");if(arguments.length>3){i.hasProperties({selected:s});}return O.create(this).hasId(d(t)).do(i).execute();},_iCannotAccessColumnInTableSettings:function(t,f,h){var i=O.create(this).isDialogElement().hasType("sap.m.Table").has(F.Matchers.not(O.Matchers.aggregationMatcher("items",e(f,h)))).description("Column '"+f+"' is not available in table settings");return O.create(this).hasId(d(t)).do(i).execute();},iSeeThisPage:function(){return O.create(this).hasId(v).viewId(null).viewName(null).description(U.formatMessage("Seeing the page '{0}'",v)).execute();},iSeeFilterDefinedOnActionDialogValueHelp:function(A,V,f,s){return O.create(this).hasId(A+"::"+V+"::FilterBar::FF::"+f+"-inner").isDialogElement().hasAggregationProperties("tokens",{text:s}).description("Seeing filter for '"+f+"' set to '"+s+"'").execute();},_iSeeTheMessageToast:function(t){return O.create(this).has(function(){return!!a.getJQuery()(".sapMMessageToast").length;}).check(function(){return a.getJQuery()(".sapMMessageToast").getEncodedText()===t;}).description("Toast message '"+t+"' is displayed").execute();},_iSeeTableRows:function(t,n){return O.create(this).hasId(t).has(function(f){var h=f.getRowBinding();return((h&&(n===undefined?h.getLength()!==0:h.getLength()===n))||(!h&&n===0));}).mustBeEnabled(false).description("Seeing table with "+(n===undefined?"> 0":n)+" rows").execute();},_iSeeSelectedTableRows:function(t,n){return O.create(this).hasId(t).has(function(f){var s=f.getSelectedContexts().length;return n===undefined?s!==0:s===n;}).description("Seeing table with "+(n===undefined?"> 0":n)+" rows").execute();},iSeeMessageErrorDialog:function(){return O.create(this).isDialogElement().hasType("sap.m.Bar").hasAggregation("contentMiddle",O.Matchers.resourceBundle("text","sap.fe","Error")).description("Seeing message error dialog").execute();},_iSeeTableRowWithCellValues:function(t,C,f){return T.create(this).hasId(t).hasRows([T.Row.Matchers.cellValues(C),c(f)]).description(U.formatMessage("Seeing table '{0}' having values '{1}'"+(f?" with state: '{2}'":""),t,C,f)).execute(this);},_iSeeButtonWithText:function(t,B){return O.create(this).hasType("sap.m.Button").hasProperties({text:t}).has(F.Matchers.states(B)).checkNumberOfMatches(1).description(U.formatMessage("Seeing Button with text '{0}'"+(B?" with state: '{1}'":""),t,B)).execute();},_iSeeElement:function(i,f){return O.create(this).hasId(i).has(F.Matchers.states(f)).description(U.formatMessage("Seeing Element '{0}'"+(f?" with state: '{1}'":""),i,f)).execute();},_checkTableActionButtonEnablement:function(t,s,A,f,B){var h=B===false?"::":".";return O.create(this).hasId(t+"::"+s+(s===""?"":h)+A).hasProperties({enabled:f}).mustBeEnabled(false).description("Table action button "+A+" is "+(f?"enabled":"disabled")).execute();},_checkPaginatorButtonEnablement:function(n,f){var m=n?{icon:"sap-icon://navigation-down-arrow"}:{icon:"sap-icon://navigation-up-arrow"};m.enabled=f;return O.create(this).hasType("sap.fe.templates.controls.Paginator").doOnChildren(O.create(this).hasType("sap.uxap.ObjectPageHeaderActionButton").hasProperties(m).mustBeEnabled(false)).description("Paginator button "+(n?"Up":"Down")+" is "+(f?"enabled":"disabled")).execute();},iSeeActionParameterDialog:function(D){return O.create(this).hasType("sap.m.Dialog").hasProperties({title:D}).isDialogElement().description("Seeing Action Parameter Dialog with title '"+D+"'").execute();},iSeeActionParameterContent:function(f,C){var s="APD_::"+f+"-inner";return O.create(this).hasId(s).isDialogElement().hasProperties({value:C}).description("Seeing Action parameter '"+f+"' with content '"+C+"'").execute();},iSeeActionVHDialog:function(s,A,f){return O.create(this).hasId(s+"."+A+"::"+f+"-dialog").isDialogElement().description("Seeing Action Value Help dialog for field "+f).execute();},iSeeActionVHDialogFilterBar:function(s,A,f){return O.create(this).hasId(s+"."+A+"::"+f+"::FilterBar").isDialogElement().description("Seeing Action Value Help FilterBar for field "+f).execute();},iSeeActionVHDialogTable:function(s,A,f){return O.create(this).hasId(s+"."+A+"::"+f+"::Table").isDialogElement().description("Seeing Action Value Help Table for field "+f).execute();},iSeePageHeaderButton:function(C){return O.create(this).hasType("sap.m.Button").has(O.Matchers.resourceBundle("tooltip","sap.f",C?"COLLAPSE_HEADER_BUTTON_TOOLTIP":"EXPAND_HEADER_BUTTON_TOOLTIP")).description("Seeing the "+(C?"Collapse":"Expand")+" Page Header Button").execute();},_iSeeSortedColumn:function(t,C,p){var f={};f[p]="Ascending";return O.create(this).hasId(t+"::C::"+C+"-innerColumn").hasProperties(f).description("Seeing column "+C+" with sortOrder property").execute();},_iSeeTableP13nMode:function(t,m){return O.create(this).hasId(t).check(function(f){var p=f.getP13nMode();if((p===undefined||p.length===0)&&(m===undefined||m.length===0)){return true;}if(p===undefined||m===undefined||p.length!==m.length){return false;}return!m.some(function(h){return!p.includes(h);});}).description("Seeing "+m.toString()+"-P13n Mode for Table "+t).execute();}}};}};});