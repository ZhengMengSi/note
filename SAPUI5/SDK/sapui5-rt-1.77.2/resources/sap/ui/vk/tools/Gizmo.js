/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["../library","sap/m/library","sap/m/Input","sap/m/Label","sap/ui/core/library","sap/ui/core/Control","./CoordinateSystem","./AxisColours","./ToolNodeSet","../threejs/thirdparty/three","./GizmoPlacementMode","../AnimationTrackType"],function(a,L,I,b,c,C,d,A,T,t,G,e){"use strict";var f=L.InputType;var g=C.extend("sap.ui.vk.tools.Gizmo",{metadata:{library:"sap.ui.vk"}});g.prototype.hasDomElement=function(){return true;};g.prototype._createAxisTitles=function(s,h,i){s=s||32;h=h||20;function j(l,m){var n=document.createElement("canvas");n.width=n.height=s*window.devicePixelRatio;var o=n.getContext("2d");var p=n.width*0.5;o.font="Bold "+h*window.devicePixelRatio+"px Arial";o.textAlign="center";o.textBaseline="middle";o.fillStyle="#000";o.globalAlpha=0.5;o.filter="blur(3px)";o.fillText(l,p+1,p+1);o.fillStyle="#fff";o.globalAlpha=1;o.filter="blur(0px)";o.fillText(l,p,p);if(i){o.beginPath();o.arc(p,p,p-window.devicePixelRatio,0,2*Math.PI,false);o.closePath();o.lineWidth=window.devicePixelRatio*2;o.strokeStyle="#fff";o.stroke();}var q=new THREE.Texture(n);q.needsUpdate=true;var r=new THREE.MeshBasicMaterial({map:q,color:m,transparent:true,alphaTest:0.05,premultipliedAlpha:true,side:THREE.DoubleSide});var u=new THREE.Mesh(new THREE.PlaneGeometry(s,s),r);u.userData.color=m;return u;}var k=new THREE.Group();k.add(j("X",A.x));k.add(j("Y",A.y));k.add(j("Z",A.z));return k;};g.prototype._extractBasis=function(m){var h=[new THREE.Vector3(),new THREE.Vector3(),new THREE.Vector3()];m.extractBasis(h[0],h[1],h[2]);h[0].normalize();h[1].normalize();h[2].normalize();return h;};g.prototype._updateAxisTitles=function(o,h,j,k,s){var l=this._extractBasis(h.matrixWorld);o.children.forEach(function(m,i){m.position.copy(l[i]).multiplyScalar(k.constructor===THREE.Vector3?k.getComponent(i):k);m.quaternion.copy(j.quaternion);});o.position.copy(h.position);o.scale.setScalar(s);};g.prototype._updateSelection=function(h){if(h==null){return false;}var n=[];if(this._tool){if(this._tool.getNodeSet()===T.Highlight){h.enumerateSelection(function(i){n.push({node:i});});}else{h.enumerateOutlinedNodes(function(i){n.push({node:i});});}}if(this._nodes.length===n.length&&this._nodes.every(function(v,i){return n[i].node===v.node;})){return false;}this._cleanTempData();this._nodes=n;n.forEach(function(j){j.ignore=false;var p=j.node.parent;while(p&&!j.ignore){for(var i=0,l=n.length;i<l;i++){if(n[i].node===p){j.ignore=true;break;}}p=p.parent;}this._getOffsetForRestTransformation(j.node);}.bind(this));return true;};g.prototype.setPlacementMode=function(p){this._placementMode=p;};g.prototype._getAnchorPoint=function(){return this._viewport?this._viewport._anchorPoint:null;};g.prototype._getSelectionCenter=function(h){if(this._nodes.length===1){var n=this._nodes[0].node;h.setFromMatrixPosition(n.matrixWorld);var u;if(this._nodeUserDataMap){u=this._nodeUserDataMap.get(n);}if(this._placementMode===G.Rest&&u&&u.offsetWTranslation){h.x+=u.offsetWTranslation[0];h.y+=u.offsetWTranslation[1];h.z+=u.offsetWTranslation[2];}}else{h.setScalar(0);if(this._nodes.length>0){var i=new THREE.Vector3();this._nodes.forEach(function(j){var n=j.node;if(n.userData.boundingBox){n.userData.boundingBox.getCenter(i);h.add(i.applyMatrix4(n.matrixWorld));}else{h.add(i.setFromMatrixPosition(n.matrixWorld));}});h.multiplyScalar(1/this._nodes.length);}}};g.prototype._getGizmoScale=function(p){var r=this._viewport.getRenderer();var h=this._viewport.getCamera().getCameraRef();var i=new THREE.Vector4();i.copy(p).applyMatrix4(this._matViewProj);return i.w*2/(r.getSize(new THREE.Vector2()).x*h.projectionMatrix.elements[0]);};g.prototype._getEffectiveParent=function(h){if(this._viewport._viewStateManager){var j=this._viewport._viewStateManager.getJoints();if(j){for(var n=0;n<j.length;n++){var i=j[n];if(!i.node||!i.parent){continue;}if(i.node===h){return i.parent;}}}}return h.parent;};g.prototype._cleanTempData=function(){this._nodes.forEach(function(n){var h=n.node;if(h.userData){delete h.userData.skipUpdateJointNode;}});if(this._nodeUserDataMap){this._nodeUserDataMap.clear();}this._sequence=null;};g.prototype._prepareForCreatingKey=function(s){this._sequence=s;};g.prototype._getOffsetForRestTransformation=function(n){if(this._viewport._viewStateManager){if(!this._nodeUserDataMap){this._nodeUserDataMap=new Map();}var u=this._nodeUserDataMap.get(n);if(!u){u={};this._nodeUserDataMap.set(n,u);}var h=this._viewport._viewStateManager.getTransformation(n);var r=this._viewport._viewStateManager.getRestTransformation(n);var w=this._viewport._viewStateManager.getRestTransformationWorld(n);var i=this._viewport._viewStateManager.getTransformationWorld(n);if(!r||!w){return;}var p=new THREE.Vector3(r.translation[0],r.translation[1],r.translation[2]);var s=new THREE.Vector3(r.scale[0],r.scale[1],r.scale[2]);u.quatRest=new THREE.Quaternion(r.quaternion[0],r.quaternion[1],r.quaternion[2],r.quaternion[3]);u.matRest=new THREE.Matrix4().compose(p,u.quatRest,s);u.matRestInv=new THREE.Matrix4().getInverse(u.matRest);u.initialTranslation=h.translation.slice();u.initialScale=h.scale.slice();u.initialQuaternion=new THREE.Quaternion(h.quaternion[0],h.quaternion[1],h.quaternion[2],h.quaternion[3]);u.matInitial=n.matrix.clone();u.matInitialInv=new THREE.Matrix4().getInverse(n.matrix);u.quatInitialDiff=u.initialQuaternion.clone().multiply(u.quatRest.clone().inverse());u.quatInitialDiffInv=u.quatInitialDiff.clone().inverse();u.matInitialDiff=n.matrix.clone().multiply(u.matRestInv);u.offsetWTranslation=[w.translation[0]-i.translation[0],w.translation[1]-i.translation[1],w.translation[2]-i.translation[2]];var j=[0,0,0];var k=this._viewport._viewStateManager.getAnimationPlayer();if(k){var l=k.getAnimatedProperty(n,e.Rotate);if(l.offsetToPrevious){j=l.offsetToPrevious;}}u.euler=new THREE.Euler(0,0,0);u.startEuler=new THREE.Euler(0,0,0);u.eulerInParentCoors=new THREE.Euler(j[0],j[1],j[2]);u.startEulerInParentCoors=new THREE.Euler(j[0],j[1],j[2]);}};g.prototype._updateGizmoObjectTransformation=function(o,i){var h=this._viewport.getCamera().getCameraRef();var j=this._getAnchorPoint();var n,p;if(j&&this._coordinateSystem===d.Custom){o.position.copy(j.position);o.quaternion.copy(j.quaternion);}else if(this._coordinateSystem===d.Local||this._coordinateSystem===d.Parent){var k=this._nodes[i].node;var l=this._getEffectiveParent(k);if(this._coordinateSystem===d.Parent&&l){p=l.matrixWorld;}n=k.matrixWorld.clone();if(p){p.decompose(o.position,o.quaternion,o.scale);o.position.setFromMatrixPosition(n);}else{n.decompose(o.position,o.quaternion,o.scale);}var u;if(this._nodeUserDataMap){u=this._nodeUserDataMap.get(k);}if(this._placementMode===G.Rest&&u&&u.offsetWTranslation){o.position.x+=u.offsetWTranslation[0];o.position.y+=u.offsetWTranslation[1];o.position.z+=u.offsetWTranslation[2];n.setPosition(o.position);}}else if(this._nodes.length>0){this._getSelectionCenter(o.position);if(this._coordinateSystem===d.Screen){o.quaternion.copy(h.quaternion);}else{o.quaternion.set(0,0,0,1);}}var s=this._getGizmoScale(o.position);o.scale.setScalar(this._gizmoSize*s);if(n){var m=this._extractBasis(p?p:n);o.matrix.makeBasis(m[0],m[1],m[2]);o.matrix.scale(o.scale);o.matrix.copyPosition(n);o.matrixAutoUpdate=false;}else{o.matrixAutoUpdate=true;}o.updateMatrixWorld(true);return s;};g.prototype._expandBoundingBox=function(h,j,l){var k=this.getGizmoCount();if(k>0){this._matViewProj.multiplyMatrices(j.projectionMatrix,j.matrixWorldInverse);for(var i=0;i<k;i++){this._updateGizmoTransformation(i,j);this._sceneGizmo._expandBoundingBox(h,l,false);}}};g.prototype._createEditingForm=function(u,w){this._label=new sap.m.Label({}).addStyleClass("sapUiVkTransformationToolEditLabel");this._units=new sap.m.Label({text:u}).addStyleClass("sapUiVkTransformationToolEditUnits");this._input=new I({width:w+"px",type:f.Number,maxLength:10,textAlign:c.TextAlign.Right,change:function(h){this.setValue(h.getParameter("value"));}.bind(this)});this._editingForm=new sap.m.HBox({items:[this._label,this._input,this._units]}).addStyleClass("sapUiSizeCompact");this._editingForm.onkeydown=this._editingForm.ontap=this._editingForm.ontouchstart=function(h){h.setMarked();};};g.prototype._getValueLocaleOptions=function(){return{useGrouping:false};};g.prototype._updateEditingForm=function(h,i){var j=this.getDomRef();if(j){if(h&&this._tool&&this._tool.getShowEditingUI()){this._label.setText(["X","Y","Z"][i]);this._label.rerender();var l=this._label.getDomRef();if(l){l.style.color=new THREE.Color(A[["x","y","z"][i]]).getStyle();}this._input.setValue(this.getValue().toLocaleString("fullwide",this._getValueLocaleOptions()));var p=this._getEditingFormPosition();var k=this._gizmo.position.clone().applyMatrix4(this._matViewProj).sub(p);var v=this._viewport.getDomRef().getBoundingClientRect();var m=j.getBoundingClientRect();var n=k.x>-0.0001;var o=n?m.width:-m.width;var q=m.height*0.5;var x=THREE.Math.clamp(v.width*(p.x*0.5+0.5)+(n?-20:20),Math.max(o,0),v.width+Math.min(o,0));var y=THREE.Math.clamp(v.height*(p.y*-0.5+0.5),q,v.height-q);j.style.left=Math.round(x)+"px";j.style.top=Math.round(y)+"px";j.style.transform="translate("+(n?"-100%":"0%")+", -50%)";j.style.display="block";}else{j.style.display="none";}}};return g;});