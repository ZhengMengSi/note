sap.ui.define(["sap/ui/thirdparty/jquery","./library","./CalculationBuilderItem","sap/ui/core/Control","sap/ui/core/ValueState","sap/ui/core/Popup","sap/ui/core/TextAlign","sap/ui/core/delegate/ItemNavigation","sap/m/MessageBox","sap/m/OverflowToolbar","sap/m/OverflowToolbarToggleButton","sap/m/OverflowToolbarButton","sap/m/ToolbarSpacer","sap/m/Title","sap/m/ButtonType","sap/m/Button","sap/m/FlexBox","sap/m/FlexRendertype","sap/m/FlexAlignItems","sap/m/library","sap/m/SegmentedButton","sap/m/SegmentedButtonItem","sap/m/StepInput","sap/m/Input","sap/m/InputType","sap/m/Page","sap/m/List","sap/m/ListMode","sap/m/ListType","sap/m/StandardListItem","sap/m/NavContainer","sap/m/SearchField","sap/m/Label","sap/m/Panel","sap/m/ResponsivePopover","sap/m/PlacementType","sap/m/Toolbar","sap/m/MessageStrip","./CalculationBuilderValidationResult","sap/suite/ui/commons/ControlProxy","sap/ui/core/Icon","sap/ui/thirdparty/jqueryui/jquery-ui-core","sap/ui/thirdparty/jqueryui/jquery-ui-widget","sap/ui/thirdparty/jqueryui/jquery-ui-mouse","sap/ui/thirdparty/jqueryui/jquery-ui-draggable","sap/ui/thirdparty/jqueryui/jquery-ui-droppable","sap/ui/thirdparty/jqueryui/jquery-ui-selectable"],function(q,l,C,a,V,P,T,I,M,O,b,c,d,e,B,f,F,g,h,j,S,m,n,o,p,r,L,s,t,u,N,v,w,x,R,y,z,A,D,E,G){"use strict";var H=l.CalculationBuilderItemType,J=l.CalculationBuilderOperatorType,K=l.CalculationBuilderComparisonOperatorType,Q=l.CalculationBuilderLogicalOperatorType,U=l.CalculationBuilderLayoutType,W=j.FlexDirection;var X=Object.freeze({PAGE_MAIN:"-pagemain",PAGE_OPERATORS:"-pageoperators",PAGE_CONSTANT:"-pageconstant",PAGE_VARIABLE:"-pagevariable",PAGE_FUNCTIONS:"-pagefunctions"});var Y=Object.freeze({OPERATORS_CATEGORY:"sap-icon://attachment-html",CONSTANTS_CATEGORY:"sap-icon://grid",VARIABLES_CATEGORY:"sap-icon://notes",FUNCTIONS_CATEGORY:"sap-icon://chalkboard",DELETE:"sap-icon://delete"});var Z=Object.freeze({KEY_PREVIOUS:"previous",KEY_NEXT:"next",MOUSE:"mouse"});var $="##DEFAULT##";var _=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");var a1=a.extend("sap.suite.ui.commons.CalculationBuilderExpression",{metadata:{library:"sap.suite.ui.commons",defaultAggregation:"items",aggregations:{items:{type:"sap.suite.ui.commons.CalculationBuilderItem",multiple:true,singularName:"item",bindable:"bindable"},variables:{type:"sap.suite.ui.commons.CalculationBuilderVariable",multiple:true,singularName:"Variable"},functions:{type:"sap.suite.ui.commons.CalculationBuilderFunction",multiple:true,singularName:"Function"},operators:{type:"sap.ui.core.Item",multiple:true,singularName:"operator"},groups:{type:"sap.suite.ui.commons.CalculationBuilderGroup",multiple:true,singularName:"Group"}},events:{change:{}}},renderer:function(k,b1){k.write("<div");k.writeControlData(b1);k.addClass("sapCalculationBuilderInner");k.writeClasses(b1);k.write(">");k.write(b1._renderDelimiter(0));b1.getItems().forEach(function(c1,i){c1._iIndex=i;c1._bReadOnly=b1._bReadOnly;k.renderControl(c1);k.write(b1._renderDelimiter(i+1));},this);if(!b1._bReadOnly){k.renderControl(b1._getNewItem());}k.write("<div class=\"sapCalculationBuilderSelected\"></div>");k.write("</div>");k.write("<div id=\""+b1.getId()+"-erroricon\"  class=\"sapCalculationBuilderExpressionErrorIcon\">");k.renderControl(b1._getErrorIcon());k.write("</div>");}});a1.prototype.init=function(){this._aErrors=[];this._bAreSelectedItemsDeleting=false;this._bDragging=false;this._bIsCalculationBuilderRendering=false;};a1.prototype._renderDelimiter=function(i){var k="";k+="<div class=\"sapCalculationBuilderDelimiter sapCalculationBuilderDroppable\" index=\""+i+"\">";k+="<div class=\"sapCalculationBuilderDroppableLine\"></div>";k+="<div class=\"sapCalculationBuilderDroppableCircle\"></div>";k+="<div class=\"sapCalculationBuilderDelimiterNewButton\">";k+="<span role=\"presentation\" aria-hidden=\"true\" data-sap-ui-icon-content=\"\""+"class=\"sapUiIcon sapUiIconMirrorInRTL sapCalculationBuilderDelimiterNewButtonIcon\" style=\"font-family:'SAP-icons'\"></span>";k+="</div>";k+="</div>";return k;};a1.prototype.onBeforeRendering=function(){this._reset();this._createPopup();this.getParent()._enableOrDisableExpandAllButton();this._aErrors=this._validateSyntax();this._fireAfterValidation();this._bIsCalculationBuilderRendering=true;this._bRendered=false;};a1.prototype.onAfterRendering=function(){this._bIsCalculationBuilderRendering=false;if(!this._bReadOnly){this._setupDroppable();this._setupSelectable();this._setupNewButtonEvents();}this._setupKeyboard();this._bRendered=true;var i=this.getParent();if(i._bRendered){i._setExpression(i._oInput._itemsToString({items:this.getItems(),errors:this._aErrors}));i._oInput._displayError(this._aErrors.length!==0);}};a1.prototype.onsapfocusleave=function(){if(!this._bAreSelectedItemsDeleting){this._deselect();}};a1.prototype.onsapenter=function(i){this._handleEnter(i);};a1.prototype.onsapspace=function(i){if(q(i.target).hasClass("sapCalculationBuilderItem")){this._handleSpace(i);}};a1.prototype.onsappreviousmodifiers=function(i){if(i.ctrlKey){this._handleCtrlPrevious(i);}};a1.prototype.onsapnextmodifiers=function(i){if(i.ctrlKey){this._handleCtrlNext(i);}};a1.prototype.onsapdelete=function(i){this._handleDelete(i);};a1.prototype.exit=function(){if(this._oPopover){this._oPopover.destroy();}if(this._oItemNavigation){this.removeDelegate(this._oItemNavigation);this._oItemNavigation.destroy();}if(this._oErrorIcon){this._oErrorIcon.destroy();this._oErrorIcon=null;}};a1.prototype._getErrorIcon=function(){if(!this._oErrorIcon){this._oErrorIcon=new G({src:"sap-icon://message-error",useIconTooltip:false,size:"20px"});}return this._oErrorIcon;};a1.prototype._createPopup=function(){var i={};this._createPopoverLayout(i);this._createPopoverConstantsItems(i);this._createPopoverFunctionsItems(i);this._createPopoverOperatorsItems(i);this._createPopoverNavContainer(i);this._createPopover(i);};a1.prototype._reset=function(){this.getItems().forEach(function(i){i._reset();});if(this._oPopover){this._oPopover.destroy();this._oPopover=null;}};a1.prototype._createPopoverLayout=function(i){var k=function(c1){return new f({text:c1==="*"?"x":c1,press:this._updateOrCreateItem.bind(this,{type:H.Operator,key:c1})}).addStyleClass("sapUiTinyMarginEnd");}.bind(this);var b1=new F({renderType:g.Div});b1.addStyleClass("sapCalculationBuilderItemPopupOperators");Object.keys(J).forEach(function(c1){if(this.getParent()._isTokenAllowed(c1)){var d1=k(J[c1]);if(c1===J[","]){this._attachAriaLabelToButton(d1,_.getText("CALCULATION_BUILDER_COMMA_ARIA_LABEL"));}else if(c1===J["-"]){this._attachAriaLabelToButton(d1,_.getText("CALCULATION_BUILDER_MINUS_ARIA_LABEL"));}b1.addItem(d1);}}.bind(this));i.layout=b1.getItems().length>0?b1:null;};a1.prototype._createPopoverConstantsItems=function(i){if(this.getParent().getAllowStringConstants()){i.constantInput=new o({width:"100%",placeholder:_.getText("CALCULATION_BUILDER_ADD_CONSTANT_FIELD_PLACEHOLDER_ANY_STRING"),valueStateText:_.getText("CALCULATION_BUILDER_ADD_CONSTANT_FIELD_PLACEHOLDER_ERROR"),liveChange:function(k){var b1=k.getSource(),c1=k.getParameter("value"),d1=c1.indexOf("\"")===-1;b1.setValueState(d1?V.None:V.Error);i.constantInput.okButton.setEnabled(d1);}});}else{i.constantInput=new n({width:"100%",placeholder:_.getText("CALCULATION_BUILDER_ADD_CONSTANT_FIELD_PLACEHOLDER"),textAlign:T.Right,valueStateText:_.getText("CALCULATION_BUILDER_ADD_CONSTANT_FIELD_ERROR_TEXT"),displayValuePrecision:3});}};a1.prototype._createPopoverVariablesItems=function(i){if(!i){return[];}var k=[];i.forEach(function(d1){var e1=new u({title:d1._getLabel()});e1._calculationBuilderKey=d1.getKey();k.push(e1);},this);k=k.sort(function(o1,o2){return o1.getTitle().localeCompare(o2.getTitle());});var b1=new L({mode:s.SingleSelectMaster,selectionChange:function(d1){this._updateOrCreateItem({type:H.Variable,key:d1.getParameter("listItem")._calculationBuilderKey});}.bind(this),items:k});var c1=new v({placeholder:_.getText("CALCULATION_BUILDER_SEARCH_VARIABLE"),liveChange:function(d1){var e1=d1.getSource().getValue();if(e1||e1===""){b1.removeAllItems();k.forEach(function(f1){if(f1.getTitle().toLowerCase().indexOf(e1.toLowerCase())!==-1){b1.addItem(f1);}});}}});this._aVariableLists.push(b1);return[c1,b1];};a1.prototype._createPopoverFunctionsItems=function(i){var k=this,b1=this.getParent();var c1=function(d1){return new u({title:d1.title,description:d1.description,type:t.Active,customData:[{key:"functionKey",value:d1.key}],press:d1.press});};i.functionList=new L({mode:s.SingleSelectMaster,itemPress:function(){this.getSelectedItem().firePress();}});b1._getAllFunctions().forEach(function(d1){i.functionList.addItem(c1({key:d1.key,title:d1.title,description:d1.description,press:k._updateOrCreateItem.bind(k,{key:d1.key,type:d1.type,functionObject:d1.functionObject})}));});};a1.prototype._createPopoverOperatorsItems=function(i){var k=this.getParent();var b1=function(g1,h1){var i1=[];Object.keys(g1).forEach(function(j1){var k1,l1,m1=g1[j1];if(k._isTokenAllowed(j1)){if(typeof m1==="object"){l1=m1.getText();k1=m1.getKey();}else{k1=l1=m1;}var n1=new f({text:l1,press:this._updateOrCreateItem.bind(this,{type:h1,key:k1})}).addStyleClass("sapCalculationBuilderPopoverOperatorsButton").addStyleClass("sapUiTinyMarginEnd");if(j1===K["!="]){this._attachAriaLabelToButton(n1,_.getText("CALCULATION_BUILDER_NOT_EQUAL_ARIA_LABEL"));}i1.push(n1);}}.bind(this));return i1;}.bind(this);var c1=function(g1,h1,i1){var j1=b1(h1,i1);if(j1.length>0){return new x({content:[new w({width:"100%",text:g1}).addStyleClass("sapUiTinyMarginBottom"),j1]});}return null;};i.operatorsItems=[];if(this.getParent().getAllowComparisonOperators()){var d1=c1(_.getText("CALCULATION_BUILDER_COMPARISON_TITLE_SELECT"),K,H.Operator);d1&&i.operatorsItems.push(d1);}if(this.getParent().getAllowLogicalOperators()){var e1=c1(_.getText("CALCULATION_BUILDER_LOGICAL_TITLE_SELECT"),Q,H.Operator);e1&&i.operatorsItems.push(e1);}var f1=this.getParent().getOperators();if(f1.length>0){i.operatorsItems.push(c1(_.getText("CALCULATION_BUILDER_OPERATORS_TITLE"),f1,H.CustomOperator));}};a1.prototype._createPopoverNavContainer=function(i){var k=function(g1){var h1=f1.getPage(g1);f1.to(h1);};var b1=function(){var g1=new A({type:"Error",showIcon:true}).addStyleClass("sapUiTinyMarginBegin sapUiTinyMarginEnd sapUiTinyMarginTop");this._aStrips.push(g1);return g1;}.bind(this);this._aStrips=[];var c1=[new u({title:_.getText("CALCULATION_BUILDER_CONSTANTS_TITLE"),type:t.Active,description:_.getText("CALCULATION_BUILDER_CONSTANTS_CATEGORY_DESCRIPTION"),icon:Y.CONSTANTS_CATEGORY,press:k.bind(this,this.getId()+X.PAGE_CONSTANT)})];var d1=this._createPopoverVariablesItems(this._mGroups[$]);if(d1.length>0){c1.push(new u({title:_.getText("CALCULATION_BUILDER_VARIABLES_TITLE"),description:_.getText("CALCULATION_BUILDER_VARIABLES_CATEGORY_DESCRIPTION"),icon:Y.VARIABLES_CATEGORY,press:k.bind(this,this.getId()+X.PAGE_VARIABLE),type:t.Active}));}var e1=i.functionList.getItems();if(e1.length>0){c1.push(new u({title:_.getText("CALCULATION_BUILDER_FUNCTIONS_TITLE"),type:t.Active,description:_.getText("CALCULATION_BUILDER_FUNCTIONS_CATEGORY_DESCRIPTION"),icon:Y.FUNCTIONS_CATEGORY,press:k.bind(this,this.getId()+X.PAGE_FUNCTIONS)}));}if(i.operatorsItems.length>0){c1.unshift(new u({title:_.getText("CALCULATION_BUILDER_OPERATORS_TITLE"),type:t.Active,description:_.getText("CALCULATION_BUILDER_OPERATORS_CATEGORY_DESCRIPTION"),icon:Y.OPERATORS_CATEGORY,press:k.bind(this,this.getId()+X.PAGE_OPERATORS)}));}this.getGroups().forEach(function(g1){c1.push(new u({title:g1._getTitle(),type:t.Active,description:g1.getDescription(),icon:g1.getIcon(),press:k.bind(this,this.getId()+g1.getKey())}));}.bind(this));var f1=new N({defaultTransitionName:"show",navigate:function(g1){var h1=g1.getParameters().to;h1.setFooter(this._getPageFooter(h1.getId(),i));}.bind(this),pages:[new r({id:this.getId()+X.PAGE_MAIN,title:_.getText("CALCULATION_BUILDER_DIALOG_TITLE"),content:[b1(),i.layout,new F({direction:W.Column,items:[new L({items:c1})]}).addStyleClass("sapUiSmallMarginBeginEnd").addStyleClass("sapUiTinyMarginTop").addStyleClass("sapCalculationBuilderNavMainPage")]})]});if(i.operatorsItems.length>0){f1.addPage(new r({id:this.getId()+X.PAGE_OPERATORS,content:[b1(),new F({direction:W.Column,items:[i.operatorsItems]}).addStyleClass("sapUiSmallMarginBeginEnd").addStyleClass("sapUiTinyMarginTop")],showNavButton:true,title:_.getText("CALCULATION_BUILDER_OPERATORS_PAGE_TITLE"),navButtonPress:k.bind(this,this.getId()+X.PAGE_MAIN)}));}f1.addPage(new r({id:this.getId()+X.PAGE_CONSTANT,content:[b1(),new F({direction:W.Column,items:[i.constantInput]}).addStyleClass("sapUiSmallMarginBeginEnd").addStyleClass("sapUiTinyMarginTop")],showNavButton:true,title:_.getText("CALCULATION_BUILDER_CONSTANTS_PAGE_TITLE"),navButtonPress:k.bind(this,this.getId()+X.PAGE_MAIN)}));if(d1.length>0){f1.addPage(new r({id:this.getId()+X.PAGE_VARIABLE,content:[b1(),new F({direction:W.Column,items:d1}).addStyleClass("sapUiSmallMarginBeginEnd").addStyleClass("sapUiTinyMarginTop")],showNavButton:true,title:_.getText("CALCULATION_BUILDER_VARIABLES_PAGE_TITLE"),navButtonPress:k.bind(this,this.getId()+X.PAGE_MAIN)}));}if(e1.length>0){f1.addPage(new r({id:this.getId()+X.PAGE_FUNCTIONS,content:[b1(),new F({direction:W.Column,items:[i.functionList]}).addStyleClass("sapUiSmallMarginBeginEnd").addStyleClass("sapUiTinyMarginTop")],showNavButton:true,title:_.getText("CALCULATION_BUILDER_FUNCTIONS_PAGE_TITLE"),navButtonPress:k.bind(this,this.getId()+X.PAGE_MAIN)}));}this.getGroups().forEach(function(g1){var h1=new r({id:this.getId()+g1.getKey(),showNavButton:true,title:g1._getTitle(),navButtonPress:k.bind(this,this.getId()+X.PAGE_MAIN),content:b1()});var i1=g1.getCustomView();if(i1){var j1=new E();j1.setAssociation("control",i1);h1.addContent(j1);}else{h1.addContent(new F({direction:W.Column,items:this._createPopoverVariablesItems(this._mGroups[g1.getKey()])}).addStyleClass("sapUiSmallMarginBeginEnd").addStyleClass("sapUiTinyMarginTop"));}f1.addPage(h1);}.bind(this));i.navContainer=f1;};a1.prototype._callFunctionFireSelection=function(k){this.getGroups().forEach(function(i){if(i.getCustomView()){i.fireSetSelection({key:k});}});};a1.prototype._clearVariableLists=function(){this._aVariableLists.forEach(function(i){var k=i.getSelectedItem();if(k){i.setSelectedItem(k,false);}});this._callFunctionFireSelection();};a1.prototype._setVariableListSelection=function(b1){for(var i=0;i<this._aVariableLists.length;i++){var c1=this._aVariableLists[i],d1=this._aVariableLists[i].getItems();for(var k=0;k<d1.length;k++){if(d1[k]._calculationBuilderKey===b1){c1.setSelectedItem(d1[k],true);return;}}}this._callFunctionFireSelection(b1);};a1.prototype._sanitizeStringConstant=function(i){if(this.getParent()._isStringConstant(i)){i=i.substring(1,i.length-1);}return i;};a1.prototype._createPopover=function(k){var b1=function(){var c1=this._oCurrentItem,d1=k.navContainer.getCurrentPage().getId(),e1=k.functionList.getSelectedItem(),f1,g1,h1;k.constantInput.setValue(this.getParent().getAllowStringConstants()?"":0);this._clearVariableLists();if(e1){k.functionList.setSelectedItem(e1,false);}if(!c1){f1=this.getId()+X.PAGE_MAIN;}else{if(c1._isFunction()){h1=c1.getKey();f1=this.getId()+X.PAGE_FUNCTIONS;g1=k.functionList.getItems();for(var i=0;i<g1.length;i++){var i1=g1[i].data("functionKey");if((i1&&i1.toLowerCase())===h1.toLowerCase()){k.functionList.setSelectedItem(g1[i],true);break;}}}else if(c1._isConstant()){var j1=this._sanitizeStringConstant(c1.getKey());k.constantInput.setValue(j1);f1=this.getId()+X.PAGE_CONSTANT;}else if(c1._isVariable()){this._setVariableListSelection(c1.getKey());var k1=c1._oVariable||c1.getVariable(),l1=(k1&&k1.getGroup())||X.PAGE_VARIABLE;f1=this.getId()+l1;}else if(c1._isSecondaryOperator()){f1=this.getId()+X.PAGE_OPERATORS;}else{f1=this.getId()+X.PAGE_MAIN;}}if(f1!==d1){if(f1!==this.getId()+X.PAGE_MAIN){k.navContainer.backToPage(this.getId()+X.PAGE_MAIN);}k.navContainer.to(k.navContainer.getPage(f1),"show");}else{k.navContainer.getCurrentPage().setFooter(this._getPageFooter(d1,k));}var m1=this._oCurrentItem&&this._oCurrentItem._getItemError(),n1=m1&&(" "+m1.title);this._aStrips.forEach(function(o1){o1.setVisible(!!m1);o1.setText(n1?_.getText("CALCULATION_BUILDER_INCORRECT_SYNTAX")+n1:"");});}.bind(this);this._oPopover=new R({showHeader:false,resizable:true,placement:y.PreferredBottomOrFlip,contentWidth:"400px",contentHeight:"450px",content:[k.navContainer],beforeOpen:b1,afterClose:function(){this._bDragging=false;this._clearNewButtonPositions();}.bind(this)});};a1.prototype._getPageFooter=function(i,k){var b1=false,c1=false,d1=function(){};if(this._oCurrentItem&&!this._oCurrentItem._bIsNew){c1=true;}if(i===(this.getId()+X.PAGE_CONSTANT)){b1=k.constantInput.getValueState()===V.None;d1=function(){var e1=k.constantInput.getValue();if(this.getParent()&&this.getParent().getAllowStringConstants()&&!q.isNumeric(e1)){e1="\""+e1+"\"";}this._updateOrCreateItem({type:H.Constant,key:e1});k.constantInput.setValueState(V.None);}.bind(this);}k.constantInput.okButton=new f({enabled:b1,text:_.getText("CALCULATION_BUILDER_CONFIRM_BUTTON"),press:d1});return new z({content:[new d(),k.constantInput.okButton,new f({enabled:c1,text:_.getText("CALCULATION_BUILDER_DELETE_BUTTON"),press:this._deleteItem.bind(this)}),new f({text:_.getText("CALCULATION_BUILDER_CLOSE_BUTTON"),press:this._instantClose.bind(this)})]});};a1.prototype._insertFunctionItems=function(i,k){var b1=function(c1){i.push(c1);};if(k&&k.length>0){k.forEach(function(c1){b1(c1);});}else{b1("");}b1(")");};a1.prototype._updateOrCreateItem=function(k){var b1=!this._oCurrentItem||this._oCurrentItem._bIsNew,c1=this._oCurrentItem&&!this._oCurrentItem.getKey(),d1=this.getParent(),e1=k.functionObject,f1=this.getItems();var g1=function(){var f1=k.type===H.Function?e1.template:d1._convertToTemplate(e1.getItems());this._insertFunctionItems(j1,f1);}.bind(this);var h1=function(){var i=isNaN(this._iCurrentIndex)?this.getItems().length:this._iCurrentIndex,k1=this._getKeys();this._smartRender(k1.slice(0,i).concat(j1,k1.slice(i)));}.bind(this);var i1=function(){for(var i=0;i<f1.length;i++){if(f1[i]===this._oCurrentItem){return i+1;}}return null;}.bind(this);if(b1){var j1=[k.key];if(e1){g1();}h1();}else{this._oCurrentItem.setKey(k.key);if(k.type){this._oCurrentItem._sType=k.type;}if(c1&&e1){var j1=[];this._iCurrentIndex=i1();g1();h1();}}this._instantClose();this._fireChange();};a1.prototype._expandAllVariables=function(){this.getItems().forEach(function(i){if(i.isExpandable()){i._expandVariable(false);}});this._fireChange();};a1.prototype._handleDelete=function(i){if(this._isEmptySelected()){return;}this._bAreSelectedItemsDeleting=true;M.show(_.getText("CALCULATION_BUILDER_DELETE_MESSAGE_TEXT"),{icon:M.Icon.WARNING,title:_.getText("CALCULATION_BUILDER_DELETE_MESSAGE_TITLE"),actions:[M.Action.YES,M.Action.CANCEL],onClose:function(k){if(k===M.Action.YES){var b1=this.$().find(".sapCalculationBuilderSelected .sapCalculationBuilderItem"),c1=b1.length,d1=b1.first(),e1=sap.ui.getCore().byId(d1.attr("id"));if(e1){var f1=this._getKeys();f1.splice(e1._iIndex,c1);this._smartRender(f1);this._fireChange();}}this._bAreSelectedItemsDeleting=false;}.bind(this)});};a1.prototype._handleEnter=function(i){var k=q(i.target),b1;if(this._oItemNavigation&&!this._bReadOnly){if(k.hasClass("sapCalculationBuilderNewItem")){b1=this._getNewItem();if(b1){b1._buttonPress(i);}}else if(k.hasClass("sapCalculationBuilderItem")){b1=this._getItemById(k[0].id);if(b1){b1._buttonPress(i);}}else if(k.hasClass("sapCalculationBuilderItemExpandButton")){b1=this._getItemById(k.closest(".sapCalculationBuilderItem")[0].id);if(b1){b1._expandButtonPress(i);}}}};a1.prototype._createVariablesMap=function(){this._mGroups={};this._aVariableLists=[];this.getVariables().forEach(function(i){var k=i.getGroup()||$;if(!this._mGroups[k]){this._mGroups[k]=[];}this._mGroups[k].push(i);}.bind(this));};a1.prototype._handleSpace=function(i){this._selectItem(i.target);};a1.prototype._handleCtrlNext=function(i){this._moveItems(Z.KEY_NEXT);};a1.prototype._handleCtrlPrevious=function(i){this._moveItems(Z.KEY_PREVIOUS);};a1.prototype._getVariableByKey=function(k){var b1=this.getVariables();if(!k){return null;}k=k.toLowerCase();for(var i=0;i<b1.length;i++){if(b1[i].getKey().toLowerCase()===k){return b1[i];}}return null;};a1.prototype.setTitle=function(i){var k=this._oToolbarTitle;if(k){k.setText(i);k.setVisible(!!i);}this.setProperty("title",i);};a1.prototype._getKeys=function(){return this.getItems().map(function(i){return i.getKey();});};a1.prototype._deleteItem=function(){var k=this._getKeys();k.splice(this._oCurrentItem._iIndex,1);this._smartRender(k);this._instantClose();this._fireChange();};a1.prototype._openDialog=function(i){this._oCurrentItem=i.currentItem;this._iCurrentIndex=i.index;this._oPopover.openBy(i.opener);};a1.prototype._setupDroppable=function(i){var k=this;i=i||this.$().find(".sapCalculationBuilderDroppable");i.droppable({scope:k.getId()+"-scope",tolerance:"pointer",activeClass:"sapCalculationBuilderDroppableActive",hoverClass:"sapCalculationBuilderDroppableActive",drop:function(b1,ui){if(!ui.draggable.hasClass("sapCalculationBuilderSelected")){k._selectItem(ui.draggable[0]);}k._moveItems(Z.MOUSE,parseInt(q(this).attr("index"),10));k._bDragging=false;},over:function(b1,ui){k._bDragging=true;}});};a1.prototype._clearNewButtonPositions=function(){var i=this.$();i.find(".sapCalculationBuilderDelimiterNewButton").hide(200);i.find(".sapCalculationBuilderItem").animate({"left":0},300);};a1.prototype._setupNewButtonEvents=function(){var i=13,k=300;var b1=this.$().find(".sapCalculationBuilderDelimiter[data-events!='bound']"),c1=this.$().find(".sapCalculationBuilderDelimiterNewButton[data-events!='bound']"),d1=this,e1,f1;var g1=function(h1,i1){h1.prev().animate({"left":-i1},k);h1.next().animate({"left":i1},k);};c1.click(function(ev){var h1=q(this),i1=parseInt(h1.parent().attr("index"),10);h1.css("opacity",1);d1._oCurrentItem=null;d1._iCurrentIndex=i1;d1._openDialog({opener:this,index:i1});});c1.attr("data-events","bound");b1.mouseover(function(ev){var h1=q(this);if(!d1._bDragging&&!d1._oPopover.isOpen()){e1=true;f1=setTimeout(function(){if(e1){e1=false;g1(h1,i);h1.find(".sapCalculationBuilderDelimiterNewButton").show(200);}},400);}});b1.mouseout(function(ev){var h1=q(this).find(".sapCalculationBuilderDelimiterNewButton"),i1=q(this);e1=false;clearTimeout(f1);if(d1._bDragging||d1._oPopover.isOpen()){return;}if(!h1.is(':hover')){g1(i1,0);h1.hide(200);}});b1.attr("data-events","bound");};a1.prototype._setupSelectable=function(){this.$().selectable({cancel:".sapCalculationBuilderCancelSelectable",distance:5,start:function(){this._deselect();this._instantClose();}.bind(this),stop:function(){this._selectItems(this.$().find(".sapCalculationBuilderItem.ui-selected"));}.bind(this)});};a1.prototype._selectItemsTo=function(i){var k=q(i.next(".sapCalculationBuilderDelimiter")[0]),b1=k.attr("index")-1,c1=this.$(),d1,e1,f1,g1,h1;if(i.parent().hasClass("sapCalculationBuilderSelected")||this._isEmptySelected()){this._selectItem(i);return;}if(b1>this._iLastSelectedIndex){d1=this._iFirstSelectedIndex;e1=b1+1;}else{d1=b1;e1=this._iLastSelectedIndex+1;}this._deselect();g1=c1.find(".sapCalculationBuilderDelimiter[index=\""+d1+"\"]");h1=c1.find(".sapCalculationBuilderDelimiter[index=\""+e1+"\"]");f1=g1.nextUntil(h1,".sapCalculationBuilderItem");this._selectItems(f1);};a1.prototype._selectItems=function(k){for(var i=0;i<k.length;i++){this._selectItem(k[i]);}};a1.prototype._selectItem=function(i){var k=this.$().find(".sapCalculationBuilderSelected"),b1=q(i),c1=q(b1.next(".sapCalculationBuilderDelimiter")[0]),d1=k[0].children.length,e1=c1.attr("index")-1,f1=true;if(!this._oItemNavigation||!this._getItemById(b1[0].id)||this._bReadOnly){return;}if(d1===0){this._iFirstSelectedIndex=e1;this._iLastSelectedIndex=e1;}else{if(b1.parent().hasClass("sapCalculationBuilderSelected")){if(this._iFirstSelectedIndex===e1){this._iFirstSelectedIndex++;this._deselectItem(b1,false);}else if(this._iLastSelectedIndex===e1){this._iLastSelectedIndex--;this._deselectItem(b1,true);}else{this._deselect();}this._setCorrectFocus();return;}if((this._iFirstSelectedIndex-e1)===1){this._iFirstSelectedIndex=e1;f1=false;}else if((e1-this._iLastSelectedIndex)===1){this._iLastSelectedIndex=e1;f1=true;}else{this._iFirstSelectedIndex=e1;this._iLastSelectedIndex=e1;this._deselect();}}var g1=this.$();if(this._isEmptySelected()){k.detach().insertBefore(b1);k.draggable({revert:"invalid",cursor:"move",axis:"x",scope:this.getId()+"-scope",helper:function(h1){var i1=k.clone();i1.removeClass("sapCalculationBuilderSelected");i1.addClass("sapCalculationBuilderDraggingSelectedClone");return i1;},start:function(){k.addClass("sapCalculationBuilderDragging");g1.find(".sapCalculationBuilderItemContent").css("cursor","move");},stop:function(){k.removeClass("sapCalculationBuilderDragging");g1.find(".sapCalculationBuilderItemContent").css("cursor","pointer");}});}if(f1){b1.detach().appendTo(k);c1.detach().appendTo(k);}else{c1.detach().prependTo(k);b1.detach().prependTo(k);}if(b1.hasClass("sapCalculationBuilderItem")){b1.draggable("disable");b1.addClass("ui-selected");}this._setCorrectFocus();};a1.prototype._isEmptySelected=function(){var i=this.$().find(".sapCalculationBuilderSelected");if(i){return i.is(":empty");}return true;};a1.prototype._deselectItem=function(i,k){var b1=this.$().find(".sapCalculationBuilderSelected"),c1=q(i.next(".sapCalculationBuilderDelimiter")[0]);if(!i.hasClass("ui-selected")){return;}if(k){c1.detach().insertAfter(b1);i.detach().insertAfter(b1);}else{i.detach().insertBefore(b1);c1.detach().insertBefore(b1);}i.draggable("enable");i.removeClass("ui-selected");};a1.prototype._deselect=function(){var i=this.$().find(".sapCalculationBuilderSelected");if(this._isEmptySelected()){return;}this.$().find(".sapCalculationBuilderSelected .ui-selected").removeClass("ui-selected");i.children().each(function(){var k=q(this);if(k.hasClass("sapCalculationBuilderItem")){k.draggable("enable");}k.detach().insertBefore(i);});};a1.prototype._setupKeyboard=function(){var i=this.getDomRef(),k=[];this.getItems().forEach(function(b1){k.push(b1.getFocusDomRef());if(b1.isExpandable()){k.push(b1.$("expandbutton"));}});k.push(this._getNewItem().getFocusDomRef());if(!this._oItemNavigation){this._oItemNavigation=new I();this.addDelegate(this._oItemNavigation);}this._oItemNavigation.setRootDomRef(i);this._oItemNavigation.setItemDomRefs(k);this._oItemNavigation.setCycling(true);this._oItemNavigation.setPageSize(250);};a1.prototype._setCorrectFocus=function(){q(this._oItemNavigation.getFocusedDomRef()).focus();};a1.prototype._getItemById=function(i){return this.getItems().filter(function(k){return k.getId()===i;})[0];};a1.prototype._getNewItem=function(){if(!this._oNewItem){this._oNewItem=new C();this._oNewItem._bIsNew=true;this._oNewItem.setParent(this,null,true);}return this._oNewItem;};a1.prototype._instantClose=function(){var i=this._oPopover.getAggregation("_popup");if(i&&i.oPopup&&i.oPopup.close){i.oPopup.close(0);this._setCorrectFocus();}};a1.prototype._attachAriaLabelToButton=function(i,k){i.addEventDelegate({onAfterRendering:function(b1){b1.srcControl.$("content").attr("aria-label",k);}});};a1.prototype._printErrors=function(){this.getItems().forEach(function(i){var k=i._getItemError(),b1=i.$(),c1=!!k?"addClass":"removeClass";b1[c1]("sapCalculationBuilderItemErrorSyntax");});if(this.getParent().getLayoutType()===U.VisualOnly){this._showErrorIcon();}};a1.prototype._validateSyntax=function(k){var b1=function(){var A1=this.getItems()[q1],B1=A1.getKey();return!A1._isOperator()||B1==="("||B1==="+"||B1==="-"||B1.toLowerCase()==="not";}.bind(this);var c1=function(){var k1=this.getItems(),A1=k1[r1-1];return!A1._isOperator()||A1.getKey()===")";}.bind(this);var d1=function(n1){var A1=n1.getKey().toLowerCase();if(n1._isOperator()){return A1==="not"||A1==="("||A1===")"?A1:"#op#";}return n1._isFunction()?"#fun#":"#col#";};var e1=function(n1){return{index:i,item:n1,items:[],text:n1.getKey()+(n1._isFunction()?"(":"")};};var f1=function(w1){var A1=1,B1=i;i++;for(;i<k1.length;i++){var n1=k1[i],C1=n1.getKey(),D1=e1(n1);w1.items.push(D1);switch(C1){case")":A1--;break;case"(":A1++;break;case",":A1=1;break;}if(n1._isFunction()){f1(D1);w1.text+=D1.text;}else{w1.text+=C1;}if(A1===0){return w1;}}u1.push({index:B1,title:_.getText("CALCULATION_BUILDER_CLOSING_BRACKET_ERROR_TEXT")});return w1;};var g1=function(w1){var A1=this.getParent()._getFunctionAllowParametersCount(w1.item.getKey()),B1=[],C1=[];w1.items.forEach(function(n1){if(n1.item._isComma()){B1.push(C1);C1=[];}else{C1.push(n1);}});if(C1.length>0&&C1[C1.length-1].text===")"){C1.pop();}B1.push(C1);if(B1.length!==A1){u1.push({index:w1.index,title:_.getText(B1.length<A1?"CALCULATION_BUILDER_TOO_LITTLE_PARAMETERS":"CALCULATION_BUILDER_TOO_MANY_PARAMETERS")});}if(B1.length>0){B1.forEach(function(D1){if(D1.length>0){q.merge(u1,this._validateSyntax({from:D1[0].index,to:D1[D1.length-1].index+1}));}else{u1.push({index:w1.index,title:_.getText("CALCULATION_BUILDER_EMPTY_PARAMETER")});}}.bind(this));}}.bind(this);var h1=0;var i1=function(){var A1=n1.getKey()==="+"||n1.getKey()==="-";if(A1){h1++;if(h1>2){u1.push({index:i,title:_.getText("CALCULATION_BUILDER_SYNTAX_ERROR_TEXT")});}}else{h1=0;}};var j1={"#op#":["(","#col#","#fun#","not","+","-"],"(":["(","+","-","#col#","#fun#","not"],")":["#op#",")"],"#col#":["#op#",")"],"#fun#":["(","+","-","#col#","#fun#"],"not":["#col#","#fun#","not","("]};k=k||{};var k1=k.items||this.getItems(),l1,m1,n1,o1,p1,q1=k.from||0,r1=k.to||k1.length,s1=(q1===0&&r1===k1.length),t1=[],u1=[];if(k1.length>0){if(!b1()){u1.push({index:q1,title:_.getText("CALCULATION_BUILDER_FIRST_CHAR_ERROR_TEXT")});}if(!c1()){u1.push({index:r1-1,title:_.getText("CALCULATION_BUILDER_LAST_CHAR_ERROR_TEXT")});}}for(var i=q1;i<r1;i++){n1=k1[i];if(n1._getType()===H.Error){u1.push({index:i,title:_.getText("CALCULATION_BUILDER_SYNTAX_ERROR_TEXT")});continue;}i1();if(!k.skipCustomValidation&&n1._isFunction()){var v1=n1._getCustomFunction(),w1=f1(e1(n1));if(v1&&!v1.getUseDefaultValidation()){var x1=new D();this.getParent().fireValidateFunction({definition:w1,customFunction:v1,result:x1});q.merge(u1,x1.getErrors());}else{g1(w1);}}if(i<r1-1){o1=k1[i+1];l1=d1(k1[i]);m1=d1(o1);p1=o1?o1.getKey().toLowerCase():"";var y1=o1._isCustomOperator()||n1._isCustomOperator();if(j1[l1].indexOf(m1)===-1&&j1[l1].indexOf(p1)===-1&&!y1){var z1={index:i+1};if(n1._isOperator()&&o1._isOperator()){z1.title=_.getText("CALCULATION_BUILDER_BEFORE_OPERATOR_ERROR_TEXT",o1.getKey());}else if(!n1._isOperator()&&!o1._isOperator()){z1.title=_.getText("CALCULATION_BUILDER_BETWEEN_NOT_OPERATORS_ERROR_TEXT",[n1.getKey(),o1.getKey()]);}else if(n1.getKey()===")"&&!o1._isOperator()){z1.title=_.getText("CALCULATION_BUILDER_AFTER_CLOSING_BRACKET_ERROR_TEXT");}else if(!n1._isOperator()&&(o1.getKey()==="(")){z1.title=_.getText("CALCULATION_BUILDER_BEFORE_OPENING_BRACKET_ERROR_TEXT");}else{z1.title=_.getText("CALCULATION_BUILDER_CHAR_ERROR_TEXT");}u1.push(z1);}}if(n1._isFunction()){continue;}if(s1&&n1.getKey()===","){u1.push({index:i,title:_.getText("CALCULATION_BUILDER_WRONG_PARAMETER_MARK")});}if((n1._isOperator()&&n1.getKey()==="(")||n1._isFunction()){t1.push(i);}if(n1._isOperator()&&n1.getKey()===")"){if(t1.length===0){u1.push({index:i,title:_.getText("CALCULATION_BUILDER_OPENING_BRACKET_ERROR_TEXT")});}else{t1.pop();}}}for(i=0;i<t1.length;i++){u1.push({index:t1[i],title:_.getText("CALCULATION_BUILDER_CLOSING_BRACKET_ERROR_TEXT")});}return u1;};a1.prototype._getType=function(k){return this.getParent()&&this.getParent()._getType(k);};a1.prototype._moveItems=function(k,b1){var c1=[],d1=this.$(),e1=this.getItems(),f1=d1.find(".sapCalculationBuilderSelected"),g1,h1,i1,j1;if(this._isEmptySelected()){return;}j1=(f1.length>1)?q(f1[0]).children():f1.children();if(k===Z.KEY_PREVIOUS){h1=this._iFirstSelectedIndex-1;}else if(k===Z.KEY_NEXT){h1=this._iLastSelectedIndex+2;}else if(k===Z.MOUSE){h1=b1;}if(h1<0||h1===(e1.length+1)){return;}g1=this.$().find(".sapCalculationBuilderDelimiter[index=\""+h1+"\"]");for(var i=0;i<e1.length+1;i++){i1=e1[i];if(h1===i){j1.each(function(){var d1=q(this),i1;if(d1.hasClass("sapCalculationBuilderItem")){i1=sap.ui.getCore().byId(q(this)[0].id);c1.push(i1);i1._bMovingItem=true;d1.draggable("enable");}d1.css("left",0);d1.detach().insertAfter(g1).removeClass("");g1=d1;});}if(i1&&!i1.$().parent().hasClass("sapCalculationBuilderSelected")&&!i1._bMovingItem){c1.push(i1);}}f1.css("left","");d1.find(".sapCalculationBuilderDelimiter").each(function(i){q(this).attr("index",i);});this.removeAllAggregation("items",true);c1.forEach(function(i1,i){i1._bMovingItem=false;i1._iIndex=i;this.addAggregation("items",i1,true);}.bind(this));this._setupKeyboard();this._selectItems(j1.filter(function(i,el){return q(el).hasClass("sapCalculationBuilderItem");}));this._fireChange();};a1.prototype._fireAfterValidation=function(){this.getParent().fireAfterValidation();};a1.prototype._setItems=function(i){this.removeAllAggregation("items",true);(i||[]).forEach(function(k){this.addAggregation("items",this._convertFromNewItem(k),true);}.bind(this));};a1.prototype._getKeyFromCreatedItem=function(i){return typeof i==="object"?i.getKey():i;};a1.prototype._convertFromNewItem=function(i){return typeof i==="object"?i:new C({key:i});};a1.prototype._showErrorIcon=function(){var i=this.$("erroricon"),k=this.getParent(),b1=k._createErrorText(null,true);if(b1){i.show();i.attr("title",k._createErrorText(null,true));}else{i.hide();}};a1.prototype._smartRender=function(k){var b1="",c1=this.$(),d1=[],e1=this.getItems(),f1=e1.length;var g1=function(i1){i1=this._convertFromNewItem(i1);this.addAggregation("items",i1,true);i1._iIndex=i;if(c1[0]){b1+=i1._render();b1+=this._renderDelimiter(i+1);}i1.bOutput=true;d1.push(i1);}.bind(this);if(!this.getParent()._isExpressionVisible()){this._setItems(k);return;}this._bRendered=false;this._bIsCalculationBuilderRendering=true;this._deselect();for(var i=0;i<k.length;i++){var h1=e1[i],i1=k[i],j1=typeof i1==="object"&&i1.getKey?i1.getKey():i1,k1=i1._sType?i1._sType:"";if(!h1){g1(k[i]);}else if(h1.getKey()!==j1||h1._sType!==k1){h1.setKey(j1,true);h1._sType=k1;var l1=h1.$();l1[0].innerHTML=h1._innerRender();l1.attr("class",h1._getClass());l1.attr("title",h1._getTooltip());h1._setEvents();}}if(k.length<f1){for(var i=k.length;i<e1.length;i++){var l1=e1[i].$();l1.next().remove();l1.remove();this.removeAggregation("items",e1[i],true);}}if(c1[0]&&d1.length>0){c1.find(".sapCalculationBuilderDelimiter").last().after(b1);d1.forEach(function(h1){h1._afterRendering();});this._setupDroppable(c1.find(".sapCalculationBuilderDroppable").filter(function(){return parseInt(q(this).attr("index"),10)>f1;}));}this._bRendered=true;this._setupKeyboard();this._setupNewButtonEvents();this._bIsCalculationBuilderRendering=false;};a1.prototype._fireChange=function(){this.fireEvent("change");};return a1;});