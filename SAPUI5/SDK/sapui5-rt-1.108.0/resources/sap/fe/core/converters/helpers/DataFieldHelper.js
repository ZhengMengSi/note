/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log"],function(e){"use strict";var i={};function n(i){var n,o,l,d,a,r,v,u,s,f,g,c,U,I,H;if(i){switch(i.$Type){case"com.sap.vocabularies.UI.v1.DataFieldForAnnotation":return t(i);case"com.sap.vocabularies.UI.v1.DataField":if(i.annotations&&((n=i.annotations)===null||n===void 0?void 0:(o=n.UI)===null||o===void 0?void 0:(l=o.Hidden)===null||l===void 0?void 0:l.valueOf())===true){var h,p;if(i.annotations&&((h=i.annotations.UI)===null||h===void 0?void 0:(p=h.HiddenFilter)===null||p===void 0?void 0:p.valueOf())===true){e.warning("Warning: Property "+i.Value.path+" is set with both UI.Hidden and UI.HiddenFilter - please set only one of these! UI.HiddenFilter is ignored currently!")}return true}else if(i.Value.$target&&((d=i.Value)===null||d===void 0?void 0:(a=d.$target)===null||a===void 0?void 0:(r=a.annotations)===null||r===void 0?void 0:(v=r.UI)===null||v===void 0?void 0:(u=v.Hidden)===null||u===void 0?void 0:u.valueOf())===true){var F,y,b,w,$;if(((F=i.Value)===null||F===void 0?void 0:(y=F.$target)===null||y===void 0?void 0:(b=y.annotations)===null||b===void 0?void 0:(w=b.UI)===null||w===void 0?void 0:($=w.HiddenFilter)===null||$===void 0?void 0:$.valueOf())===true)e.warning("Warning: Property "+i.Value.path+" is set with both UI.Hidden and UI.HiddenFilter - please set only one of these! UI.HiddenFilter is ignored currently!");return true}else{return false}case"com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":var O=(s=i.Value)===null||s===void 0?void 0:(f=s.$target)===null||f===void 0?void 0:f.annotations;if((O===null||O===void 0?void 0:(g=O.UI)===null||g===void 0?void 0:(c=g.Hidden)===null||c===void 0?void 0:c.valueOf())===true){var V,P;if((O===null||O===void 0?void 0:(V=O.UI)===null||V===void 0?void 0:(P=V.HiddenFilter)===null||P===void 0?void 0:P.valueOf())===true){e.warning("Warning: Property "+i.Value.path+" is set with both UI.Hidden and UI.HiddenFilter - please set only one of these! UI.HiddenFilter is ignored currently!")}return true}else{return false}case"com.sap.vocabularies.UI.v1.DataFieldWithUrl":if(((U=i.annotations)===null||U===void 0?void 0:(I=U.UI)===null||I===void 0?void 0:(H=I.Hidden)===null||H===void 0?void 0:H.valueOf())===true){var W,m;if(i.annotations&&((W=i.annotations.UI)===null||W===void 0?void 0:(m=W.HiddenFilter)===null||m===void 0?void 0:m.valueOf())===true){e.warning("Warning: Property "+i.Value.path+" is set with both UI.Hidden and UI.HiddenFilter - please set only one of these! UI.HiddenFilter is ignored currently!")}return true}else{return false}default:}}}i.isReferencePropertyStaticallyHidden=n;function t(i){var t,o,l;var d=i.Target.$target.term;switch(d){case"com.sap.vocabularies.UI.v1.Chart":var a;i.Target.$target.Measures.forEach(function(i){var n,t,o;if(((n=i.$target.annotations)===null||n===void 0?void 0:(t=n.UI)===null||t===void 0?void 0:(o=t.Hidden)===null||o===void 0?void 0:o.valueOf())===true){var l,d;e.warning("Warning: Measure attribute for Chart "+i.$target.name+" is statically hidden hence chart can't be rendered");if(i.$target.annotations&&((l=i.$target.annotations.UI)===null||l===void 0?void 0:(d=l.HiddenFilter)===null||d===void 0?void 0:d.valueOf())===true){e.warning("Warning: Property "+i.$target.name+" is set with both UI.Hidden and UI.HiddenFilter - please set only one of these! UI.HiddenFilter is ignored currently!")}a=true}});if(a===true){return true}else{return false}case"com.sap.vocabularies.UI.v1.ConnectedFields":if(i){var r,v,u;if(((r=i.annotations)===null||r===void 0?void 0:(v=r.UI)===null||v===void 0?void 0:(u=v.Hidden)===null||u===void 0?void 0:u.valueOf())===true){var s,f;if(i.annotations&&((s=i.annotations.UI)===null||s===void 0?void 0:(f=s.HiddenFilter)===null||f===void 0?void 0:f.valueOf())===true){e.warning("Warning: Property "+i.Target.$target.qualifier+" is set with both UI.Hidden and UI.HiddenFilter - please set only one of these! UI.HiddenFilter is ignored currently!")}return true}else{return false}}break;case"com.sap.vocabularies.UI.v1.FieldGroup":if(i){i.Target.$target.Data.forEach(function(e){return n(e)})}break;case"com.sap.vocabularies.UI.v1.DataPoint":var g=i.Target.$target.Value.$target;if(((t=g.annotations)===null||t===void 0?void 0:(o=t.UI)===null||o===void 0?void 0:(l=o.Hidden)===null||l===void 0?void 0:l.valueOf())===true){var c,U,I;if(((c=g.annotations)===null||c===void 0?void 0:(U=c.UI)===null||U===void 0?void 0:(I=U.HiddenFilter)===null||I===void 0?void 0:I.valueOf())===true){e.warning("Warning: Property "+i.Target.$target.Value.path+" is set with both UI.Hidden and UI.HiddenFilter - please set only one of these! UI.HiddenFilter is ignored currently!")}return true}else{return false}default:}}i.isAnnotationFieldStaticallyHidden=t;function o(i){if(i.targetObject){var n,t,o,l,d,a,r,v,u;var s=i.targetObject;if(s.annotations&&((n=s.annotations)===null||n===void 0?void 0:(t=n.UI)===null||t===void 0?void 0:(o=t.Hidden)===null||o===void 0?void 0:o.valueOf())===true){var f,g,c,U,I;if(((f=s.Value)===null||f===void 0?void 0:(g=f.$target)===null||g===void 0?void 0:(c=g.annotations)===null||c===void 0?void 0:(U=c.UI)===null||U===void 0?void 0:(I=U.HiddenFilter)===null||I===void 0?void 0:I.valueOf())===true){e.warning("Warning: Property "+s.Value.path+" is set with both UI.Hidden and UI.HiddenFilter - please set only one of these! UI.HiddenFilter is ignored currently!")}return true}else if(s!==null&&s!==void 0&&(l=s.Value)!==null&&l!==void 0&&l.$target&&(s===null||s===void 0?void 0:(d=s.Value)===null||d===void 0?void 0:(a=d.$target)===null||a===void 0?void 0:(r=a.annotations)===null||r===void 0?void 0:(v=r.UI)===null||v===void 0?void 0:(u=v.Hidden)===null||u===void 0?void 0:u.valueOf())===true){var H,h,p,F,y;if((s===null||s===void 0?void 0:(H=s.Value)===null||H===void 0?void 0:(h=H.$target)===null||h===void 0?void 0:(p=h.annotations)===null||p===void 0?void 0:(F=p.UI)===null||F===void 0?void 0:(y=F.HiddenFilter)===null||y===void 0?void 0:y.valueOf())===true){e.warning("Warning: Property "+s.Value.path+" is set with both UI.Hidden and UI.HiddenFilter - please set only one of these! UI.HiddenFilter is ignored currently!")}return true}else{return false}}}i.isHeaderStaticallyHidden=o;return i},false);
//# sourceMappingURL=DataFieldHelper.js.map