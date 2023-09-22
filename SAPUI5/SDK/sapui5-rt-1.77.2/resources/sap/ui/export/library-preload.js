//@ui5-bundle sap/ui/export/library-preload.js
/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.predefine('sap/ui/export/library',['jquery.sap.global','sap/ui/core/library'],function(q,l){"use strict";sap.ui.getCore().initLibrary({name:"sap.ui.export",dependencies:["sap.ui.core"],types:["sap.ui.export.EdmType"],interfaces:[],controls:[],elements:[],version:"1.77.2"});sap.ui.export.EdmType={BigNumber:"BigNumber",Boolean:"Boolean",Currency:"Currency",Date:"Date",DateTime:"DateTime",Enumeration:"Enumeration",Number:"Number",String:"String",Time:"Time"};q.sap.registerModuleShims({'sap/ui/export/js/XLSXBuilder':{amd:true,exports:'XLSXBuilder'},'sap/ui/export/js/XLSXExportUtils':{amd:true,exports:'XLSXExportUtils'}});return sap.ui.export;});
/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.predefine('sap/ui/export/ExportDialog',['sap/ui/core/library','sap/m/library','sap/m/Dialog','sap/m/Button','sap/m/ProgressIndicator','sap/m/Text','sap/m/MessageBox'],function(c,M,D,B,P,T,a){'use strict';var V=c.ValueState;var b=M.DialogType;var r=sap.ui.getCore().getLibraryResourceBundle("sap.ui.export",true);
function d(){return new Promise(function(R,f){var g;r.then(function(o){var h=new B({text:o.getText("CANCEL_BUTTON"),press:function(){if(g&&g.oncancel){g.oncancel();}g.finish();}});var p=new P({showValue:false,height:"0.75rem"});p.addStyleClass("sapUiMediumMarginTop");var m=new T({text:o.getText("PROGRESS_FETCHING_MSG")});g=new D({title:o.getText("PROGRESS_TITLE"),type:b.Message,contentWidth:"500px",content:[m,p],endButton:h,ariaLabelledBy:[m]});g.updateStatus=function(n){if(n>=100){h.setEnabled(false);m.setText(o.getText("PROGRESS_BUNDLE_MSG"));}p.setPercentValue(n);};g.finish=function(){g.close();g.destroy();};R(g);});});}
function s(p){return new Promise(function(R,f){r.then(function(o){var C,w,W,g;C=false;g=p.rows?o.getText("SIZE_WARNING_MSG",[p.rows,p.columns]):o.getText("NO_COUNT_WARNING_MSG");W=new T({text:g});w=new D({title:o.getText('PROGRESS_TITLE'),type:b.Message,state:V.Warning,content:W,ariaLabelledBy:W,beginButton:new B({text:o.getText("CANCEL_BUTTON"),press:function(){w.close();}}),endButton:new B({text:o.getText("EXPORT_BUTTON"),press:function(){C=true;w.close();}}),afterClose:function(){w.destroy();C?R():f();}});w.open();});});}
function e(m){r.then(function(R){var f=m||R.getText('PROGRESS_ERROR_DEFAULT');a.error(R.getText("PROGRESS_ERROR_MSG")+"\n"+f,{title:R.getText("PROGRESS_ERROR_TITLE")});});}
return{getProgressDialog:d,showErrorMessage:e,showWarningDialog:s};},true);
sap.ui.predefine('sap/ui/export/ExportUtils',['sap/ui/core/library','sap/m/library','sap/ui/core/Core','sap/base/Log','sap/base/util/uid','sap/ui/core/Item','sap/ui/core/syncStyleClass','sap/ui/model/json/JSONModel','sap/m/Button','sap/m/CheckBox','sap/m/Dialog','sap/m/Input','sap/m/Label','sap/m/Select','sap/m/Text','sap/m/VBox'],function(c,l,C,L,u,I,s,J,B,a,D,b,d,S,T,V){'use strict';var e=l.ButtonType;var f=c.ValueState;var r=C.getLibraryResourceBundle('sap.ui.export',true);
function g(o,R){var h={fileName:'Standard',fileType:[{key:'xlsx'}],selectedFileType:'xlsx',splitCells:false,includeFilterSettings:false,addDateTime:false};var E=Object.assign({},h,o||{});for(var i=0;i<E.fileType.length;i++){var j;if(!E.fileType[i].text){E.fileType[i].text=R.getText(E.fileType[i].key.toUpperCase()+'_FILETYPE');}if(E.fileType[i].key===E.selectedFileType){j=E.fileType[i].key;}}if(!j){E.selectedFileType=E.fileType[0].key;}return E;}
var U={_INTERCEPTSERVICE:'sap/ushell/cloudServices/interceptor/InterceptService',interceptUrl:function(h){var i=sap.ui.require(U._INTERCEPTSERVICE);if(i){var o=i.getInstance();if(o&&o.interceptUrl){h=o.interceptUrl(h);}}return h;},getExportSettingsViaDialog:function(m,o,h){return new Promise(function(R,i){var E;r.then(function(j){var k=new J();k.setData(g(m,j));var n=u();E=new D({id:n,title:j.getText('EXPORT_SETTINGS_TITLE'),horizontalScrolling:false,verticalScrolling:false,content:[new V({renderType:'Bare',width:'100%',items:[new d({text:j.getText('FILE_NAME'),labelFor:n+'-fileName'}),new b({id:n+'-fileName',value:'{/fileName}',liveChange:function(p){var q=p.getSource();var F=p.getParameter('value');var t=/[\\/:|?"*<>]/;var v=C.byId(n+'-export');var w=t.test(F);if(w){q.setValueState(f.Error);q.setValueStateText(j.getText('FILENAME_ERROR'));}else if(F.length>100){q.setValueState(f.Warning);q.setValueStateText(j.getText('FILENAME_WARNING'));}else{q.setValueState(f.None);q.setValueStateText(null);}v.setEnabled(!w);}}).addStyleClass('sapUiTinyMarginBottom'),new d({text:j.getText('SELECT_FORMAT'),labelFor:n+'-fileType',visible:false}),new S({id:n+'-fileType',width:'100%',selectedKey:'{/selectedFileType}',visible:false,items:{path:'/fileType',template:new I({key:'{key}',text:'{text}'})}}),new a({id:n+'-splitCells',selected:'{/splitCells}',text:j.getText('SPLIT_CELLS')}),new a({id:n+'-includeFilterSettings',selected:'{/includeFilterSettings}',text:j.getText('INCLUDE_FILTER_SETTINGS')}),new a({id:n+'-addDateTime',selected:'{/addDateTime}',text:j.getText('ADD_DATE_TIME'),visible:false})]}).addStyleClass('sapUiExportSettingsLabel')],endButton:new B({id:n+'-cancel',text:j.getText('CANCEL_BUTTON'),press:function(){E.close();}}),beginButton:new B({id:n+'-export',text:j.getText('EXPORT_BUTTON'),type:e.Emphasized,press:function(){if(E){E._bSuccess=true;E.close();R(k.getData());}}}),afterClose:function(){if(!E._bSuccess){i(null);}E.destroy();E=null;}});E.addStyleClass('sapUiContentPadding sapUiExportSettings');E.setModel(k);if(o){s('sapUiSizeCompact',o,E);}E.open();if(h){h(E);}});});},_getReadableFilterValue:function(F){switch(F.op||F.name){case'==':return'='+F.right.value;case'>':case'<':case'!=':case'<=':case'>=':return F.op+F.right.value;case'between':return F.args[1].value+'...'+F.args[2].value;case'contains':return'*'+F.args[1].value+'*';case'endswith':return'*'+F.args[1].value;case'startswith':return F.args[1].value+'*';default:throw Error('getReadableFilter');}},_parseFilter:function(F){switch(F.type){case'Logical':return U._parseLogical(F);case'Binary':return U._parseBinary(F);case'Unary':return U._parseUnary(F);case'Call':return U._parseCall(F);default:throw Error('Filter type '+F.type+' not supported');}},_parseLogical:function(o){if(o.op=='&&'&&o.left.type==='Binary'&&o.right.type==='Binary'&&o.left.op==='>='&&o.right.op==='<='&&o.left.left.path===o.right.left.path){return U._parseCall({args:[{path:o.left.left.path,type:'Reference'},{type:'Literal',value:o.left.right.value},{type:'Literal',value:o.right.right.value}],name:'between',type:'Call'});}return U._parseFilter(o.left).concat(U._parseFilter(o.right));},_parseBinary:function(o){if(!o.left||o.left.type!='Reference'||!o.right||o.right.type!='Literal'){return[];}return[{key:o.left.path,value:U._getReadableFilterValue(o)}];},_parseUnary:function(o){var h;if(!o.arg){return[];}h=U._parseFilter(o.arg);h[0].value='!'+h[0].value;return h;},_parseCall:function(o){if(!o.args||o.args.length<2){return[];}return[{key:o.args[0].path,value:U._getReadableFilterValue(o)}];},parseFilterConfiguration:function(o,h){return new Promise(function(R,i){r.then(function(j){var F,k;F={name:j.getText('FILTER_HEADER'),items:[]};if(!o||!(o.isA('sap.ui.model.ListBinding')||o.isA('sap.ui.model.TreeBinding'))){L.error('A ListBinding is required for parsing the filter settings');i();return null;}var m=o.getFilterInfo();if(m){F.items=U._parseFilter(m);}if(typeof h==='function'){F.items.forEach(function(n){k=h(n.key);n.key=k&&typeof k==='string'?k:n.key;});}R(F);});});},getAvailableCloudExportTargets:function(){var h=U.getCloudExportService();return h.then(function(i){return i&&i.getSupportedTargets?i.getSupportedTargets():[];}).catch(function(){return[];});},getCloudExportService:function(){return sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getServiceAsync?sap.ushell.Container.getServiceAsync('ProductivityIntegration'):Promise.reject();},saveAsFile:function(o,F){var h,i,j;if(!(o instanceof Blob)){return;}h=document.createElementNS('http://www.w3.org/1999/xhtml','a');i='download'in h;if(i){j=function(k,m){h.download=m;h.href=URL.createObjectURL(k);h.dispatchEvent(new MouseEvent('click'));};}if(typeof j==='undefined'){j=function(k){var m=new FileReader();m.onloadend=function(){var n,p;p=m.result.replace(/^data:[^;]*;/,'data:attachment/file;');n=window.open(p,'_blank');if(!n){window.location.href=p;}};m.readAsDataURL(k);};}if(typeof navigator!=='undefined'&&navigator.msSaveOrOpenBlob){j=function(k,m){window.navigator.msSaveOrOpenBlob(k,m);};}j(o,F);}};return U;},true);
sap.ui.predefine('sap/ui/export/Spreadsheet',['jquery.sap.global','./library','sap/ui/core/Core','./ExportDialog','sap/ui/base/EventProvider','sap/ui/Device','sap/ui/export/SpreadsheetExport','sap/base/Log','sap/base/assert','sap/ui/export/ExportUtils'],function(q,l,C,E,a,D,S,L,b,c){'use strict';
var d=a.extend('sap.ui.export.Spreadsheet',{constructor:function(s){a.call(this,s);this._mSettings={fileName:'Export',showProgress:true,worker:true};['count','dataSource','fileName','showProgress','workbook','worker'].forEach(function(P){if(typeof s[P]!=='undefined'){this._mSettings[P]=P!=='dataSource'?s[P]:this.processDataSource(s[P]);}}.bind(this));}});
d.prototype.attachBeforeExport=function(o,h,g){return this.attachEvent('beforeExport',o,h,g);};
d.prototype.detachBeforeExport=function(h,o){return this.detachEvent('beforeExport',h,o);};
d.prototype.attachBeforeSave=function(o,h,g){return this.attachEvent('beforeSave',o,h,g);};
d.prototype.detachBeforeSave=function(h,o){return this.detachEvent('beforeSave',h,o);};
d.prototype.destroy=function(){a.prototype.destroy.apply(this,arguments);this.cancel();this.bIsDestroyed=true;};
d.prototype.cancel=function(){if(this.process){this.process.cancel();this.process=null;}return this;};
d.prototype.onprogress=function(P){L.debug('Spreadsheet export: '+P+'% loaded.');};
var e=function(B){var o=[];if(B.isA('sap.ui.model.ClientListBinding')){var g=B.getModel().getProperty(B.getPath());o=(g instanceof Array)?g:[];}if(B.isA('sap.ui.model.ClientTreeBinding')){L.error('Unable to create dataSource configuration due to not supported Binding: '+B.getMetadata().getName());}if(typeof B.getDownloadUrl=='function'){var m=B.getModel();var s=B.getDownloadUrl("json");var h=m.sServiceUrl;var V=m.isA('sap.ui.model.odata.v4.ODataModel');s=c.interceptUrl(s);h=c.interceptUrl(h);o={type:"odata",dataUrl:s,serviceUrl:h,headers:V?m.getHttpHeaders():m.getHeaders(),count:B.getTotalSize?B.getTotalSize():B.getLength(),useBatch:V||m.bUseBatch};}return o;};
d.prototype.processDataSource=function(o){var m=null;var s=typeof o;if(!o){return;}if(s=='string'){return{dataUrl:o,type:'odata',useBatch:false};}if(s!='object'){L.error('Spreadsheet#setDataSource: Unable to apply data source of type '+s);return;}if(o instanceof Array||o.dataUrl){m=o;}if(o.isA&&o.isA(['sap.ui.model.ListBinding','sap.ui.model.TreeBinding'])){m=e(o);}return m;};
var p=(function(){var r={};for(var k in l.EdmType){r[k.toLowerCase()]=k;}return r;})();var f='Spreadsheet export: ';
function v(P){var g=f;var o='odata';var s='.xlsx';var h=P.count||1;var i;P.fileName=P.fileName||'export';if(!P.fileName.endsWith(s)){P.fileName+=s;}b(P.dataSource,g+'data source is not specified.');var j=P.dataSource;if(typeof j==='string'){P.dataSource={dataUrl:j,type:o,count:h};P.count=h;}else if(Array.isArray(j)){P.dataSource={data:j,type:'array'};}else if(j&&j.dataUrl){i=(j.type||o).toLowerCase();b([o].indexOf(i)>=0,g+'unsupported data source type.');P.dataSource.type=i;if(j.useBatch){b(j.serviceUrl,g+'serviceUrl is required for OData batch requests.');b(j.headers,g+'model.headers is required for OData batch requests.');}}var k=P.dataSource.sizeLimit;if(i===o&&(!k||isNaN(k))){k=Math.round(h/1000)*200;k=Math.min(10000,Math.max(k,200));L.info(g+'dataSource.sizeLimit is not provided. sizeLimit is set to '+k);P.dataSource.sizeLimit=k;}var m=P&&P.workbook;b(m&&Array.isArray(m.columns),g+'column configuration is not provided. Export is not possible');m.columns.forEach(function(n){b(n,g+'column configuration is not provided. Export is not possible.');b(n.property,g+'column property is not provided. The column is not exported.');b(n.label,g+'column label is not provided.');n.label=n.label||(n.property instanceof Array?n.property[0]:n.property)||'';var w=n.width;if(typeof w==='string'){var W=w.toLowerCase();w=parseFloat(W);if(W.indexOf('em')>0){w=w*2;}else if(W.indexOf('px')>0){w=w/8;}}if(isNaN(w)||w<1){w=10;}if(n.label.length<30){w=Math.max(n.label.length,w);}n.width=Math.round(w);if(n.type){n.type=n.type.toLowerCase();if(!p[n.type]){L.warning(g+'unsupported column property type '+n.type+'. Type is reverted to "string".');n.type='';}if(n.type==='currency'&&!n.unitProperty){L.warning(g+'missing unit property for currency column. Type is reverted to "string".');n.type='';}}var r=n.scale;if(n.type==='number'&&isNaN(r)&&r!=='variable'){L.warning(g+'scale parameter for numerical column configuration is missing.');}if(typeof r==='string'){r=parseInt(r);}if(isNaN(r)){r=null;}n.scale=r;var t=(n.textAlign+'').toLowerCase();if(['begin','end'].indexOf(t)>-1){var u=['left','right'];t=(sap.ui.getCore().getConfiguration().getRTL()?u.reverse():u)[['begin','end'].indexOf(t)];}if(t!==''&&['left','right','center','begin','end'].indexOf(t)==-1){L.warning(g+'incorrect column alignment property: '+t+'. Default alignment is used.');t='';}n.textAlign=t;});}
function _(s,P){return new Promise(function(r,R){var g;var h=D.system.desktop?2000000:100000;var n=P.dataSource.type=='array'?P.dataSource.data.length:P.dataSource.count;var i=P.workbook.columns.length;function o(m){if(!isNaN(m.progress)){if(g){g.updateStatus(m.progress);}s.onprogress(m.progress);}if(m.finish){s.process=null;if(!m.data){R('Spreadsheet export: The process was canceled');return;}var k=s.fireEvent('beforeSave',{data:m.data},true,true);if(g){window.setTimeout(g.finish,1000);}if(k){c.saveAsFile(new Blob([m.data],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),P.fileName);}r();}if(typeof m.error!='undefined'){s.process=null;if(g){g.finish();}R(m.error);E.showErrorMessage(m.error);}}function j(){if(!P.showProgress){if(s.process){R('Cannot start export: the process is already running');return;}s.process=S.execute(P,o);return;}E.getProgressDialog().then(function(k){g=k;if(s.process){R('Cannot start export: the process is already running');return;}g.oncancel=function(){return s.process&&s.process.cancel();};g.open();s.process=S.execute(P,o);});}if(i<=0){R('No columns to export.');}else if(n*i>h||!n){E.showWarningDialog({rows:n,columns:i}).then(j).catch(function(){R('Export cancelled by the user.');});}else{j();}});}
d.prototype.build=function(){var P=this._mSettings;if(this.bIsDestroyed){var m=f+'Cannot trigger build - the object has been destroyed';L.error(m);return Promise.reject(m);}return this._setDefaultExportSettings(P).then(function(){this.fireEvent('beforeExport',{exportSettings:P},false,false);v(P);return _(this,P);}.bind(this));};
d.prototype._setDefaultExportSettings=function(P){return new Promise(function(r){var R=C.getLibraryResourceBundle('sap.ui.export',true);R.then(function(o){if(typeof P.workbook.context!=='object'){P.workbook.context={};}if(!P.workbook.context.title){P.workbook.context.title=o.getText('XLSX_DEFAULT_TITLE');}if(!P.workbook.context.sheetName){P.workbook.context.sheetName=o.getText('XLSX_DEFAULT_SHEETNAME');}r();});});};
return d;});
sap.ui.predefine('sap/ui/export/SpreadsheetExport',['jquery.sap.global','sap/base/Log','sap/ui/Device'],function(q,L,D){'use strict';var a='sap/ui/export/js/libs/JSZip3',b='sap/ui/export/js/XLSXExportUtils',c='sap/ui/export/js/XLSXBuilder';
function d(p,C){function f(m){return C&&C(m);}function o(v){f({progress:v});}function g(e){f({error:e.message||e});}function h(A){f({finish:true,data:A});}function i(){var s;var e;var t;function m(X,x){e=X.oData.getConverter(p);s=new x(p.workbook.columns,p.workbook.context,p.workbook.hierarchyLevel,p.customconfig);o(0);t=window.setTimeout(r,0);}function r(){if(s){var x=p.dataSource.data||[];var R=e(x.slice());s.append(R);o(50);t=window.setTimeout(u,0);}}function u(){if(s){s.build().then(v);}}function v(x){h(x);s=null;}function w(){window.clearTimeout(t);v();}sap.ui.require([b,c,a],m);return{cancel:w};}function n(u){if(!u){return u;}try{return new URL(u,document.baseURI).toString();}catch(e){return window.URI(u).absoluteTo(document.baseURI).toString();}}function j(){var s,r;function e(X,v){s=new v(p.workbook.columns,p.workbook.context,p.workbook.hierarchyLevel,p.customconfig);r=X.oData.fetch(p,m);o(0);}function m(M){if(M.rows){s.append(M.rows);}if(M.progress){o(M.progress);}if(M.error||typeof M.error==='string'){s=null;return g(M.error);}return M.finished&&s.build().then(t);}function t(v){h(v);s=null;}function u(){r.cancel();h();s=null;}sap.ui.require([b,c,a],e);return{cancel:u};}function k(){var s;var m=q.extend(true,{},p);var w=typeof m.worker==='object'?m.worker:{};var r=function(){s.postMessage({cancel:true});h();};function t(y){var z=new Worker(y);z.onmessage=function(e){if(e.data.status){o(e.data.status);}else if(e.data.error||typeof e.data.error==='string'){g(e.data.error);}else{h(e.data);}};z.postMessage(m);return z;}function u(){L.warning('Direct worker is not allowed. Load the worker via blob.');var e=window.URI(w.base).absoluteTo("").search("").hash("").toString();w.src=e+w.ref;var y='self.origin = "'+e+'"; '+'importScripts("'+w.src+'")';var z=new Blob([y]);var A=window.URL.createObjectURL(z);return t(A);}function v(){L.warning('Blob worker is not allowed. Use in-process export.');r=j(m).cancel;}function x(X){try{s=t(w.src);s.addEventListener('error',function(e){s=u();s.addEventListener('error',function(e){v();e.preventDefault();});e.preventDefault();});}catch(y){try{s=u();}catch(z){v();}}}m.dataSource.dataUrl=n(m.dataSource.dataUrl);m.dataSource.serviceUrl=n(m.dataSource.serviceUrl);w.base=w.base||sap.ui.require.toUrl('sap/ui/export/js/','');w.ref=w.ref||'SpreadsheetWorker.js';w.src=w.base+w.ref;sap.ui.require([b],x);return{cancel:function(){r();}};}var l=sap.ui.getCore().getConfiguration().getFormatSettings().getCustomCurrencies();if(l){p.customconfig=p.customconfig||{};p.customconfig.currencySettings={customCurrencies:l};}if(p.dataSource.type==='array'){return i();}else if(p.worker===false||sap.ui.disableExportWorkers===true||(D.browser.msie&&p.dataSource.dataUrl.indexOf('.')===0)){return j();}else{return k();}}
return{execute:d};},true);
sap.ui.require.preload({
	"sap/ui/export/manifest.json":'{"_version":"1.9.0","sap.app":{"id":"sap.ui.export","type":"library","embeds":[],"applicationVersion":{"version":"1.77.2"},"title":"UI5 library: sap.ui.export","description":"UI5 library: sap.ui.export","ach":"CA-UI5-TBL","resources":"resources.json","offline":true},"sap.ui":{"technology":"UI5","supportedThemes":["base","sap_belize","sap_belize_plus","sap_hcb"]},"sap.ui5":{"dependencies":{"minUI5Version":"1.77","libs":{"sap.ui.core":{"minVersion":"1.77.2"}}},"library":{"i18n":"messagebundle.properties","content":{"controls":[],"elements":[],"types":["sap.ui.export.EdmType"],"interfaces":[]}}}}'
},"sap/ui/export/library-preload"
);
//# sourceMappingURL=library-preload.js.map