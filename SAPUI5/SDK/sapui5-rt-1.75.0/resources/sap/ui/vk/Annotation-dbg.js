/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides control sap.ui.vk.Annoation
sap.ui.define([
	"sap/ui/core/Control",
	"sap/ui/vk/AnnotationStyle"
], function(
	Control,
	AnnotationStyle
) {
	"use strict";

/**
	 * Constructor for a new Annotation.
	 *
	 * @class
	 * Annotation allows applications to display custom html annotation on top of and associated with 3D object
	 *
	 * @public
	 * @author SAP SE
	 * @version 1.75.0
	 * @extends sap.ui.core.Control
	 * @alias sap.ui.vk.Annotation
	 */

	var Annotation = Control.extend("sap.ui.vk.Annotation", /** @lends sap.ui.vk.Annotation.prototype */ {
		metadata: {
			properties: {
				/**
				 * Refernce to the node that the annotation will be associated with
				 */
				nodeRef: "any",
				/**
				 * The text that will be displayed in the annotation
				 */
				title: "string",
				/**
				 * The style of the annotation
				 */
				style: {
					type: "sap.ui.vk.AnnotationStyle",
					defaultValue: AnnotationStyle.Default
				},
				/**
				 * Controls the visibility of the annotation
				 */
				visible: {
					type: "boolean",
					defaultValue: true
				}
			},

			events: {
				/**
				 * This event will be fired when the annotation title is changed on the control
				 */
				titleChanged: {
					parameteres: {
						/**
						 * Returns the changed annotation title as a string
						 */
						title: {
							type: "string"
						}
					}
				}

			}
		},

		constructor: function(sId, mSettings) {
			Control.apply(this, arguments);
		}
	});

	Annotation.prototype._getNodeRefCenter = function() {
		var center = new THREE.Vector3();
		if (this.getNodeRef()) {
			var node = this.getNodeRef();
			if (node.userData.lodInfo.boundingBox){
				var temp = node.userData.lodInfo.boundingBox;
				var bboxMin = new THREE.Vector3(temp[0], temp[1], temp[2]);
				var bboxMax = new THREE.Vector3(temp[3], temp[4], temp[5]);
				var bbox = new THREE.Box3(bboxMin, bboxMax);
				bbox.getCenter(center);
				center.applyMatrix4(node.matrixWorld);
			}
		}

		return center;
	};

	Annotation.prototype._getNodeRefScreenCenter = function(viewport) {
		var center = this._getNodeRefCenter();
		var camera = viewport.getCamera().getCameraRef();
		var viewportRect = viewport.getDomRef().getBoundingClientRect();

		var halfWidth = viewportRect.width / 2;
		var halfHeight = viewportRect.height / 2;
		center.project(camera);
		center.x = (center.x * halfWidth) + halfWidth;
		center.y = (center.y * halfHeight) + halfHeight;
		return center;
	};

	Annotation.prototype._getSortIndex = function(viewport) {
		if (this.getNodeRef()) {
			var center = this._getNodeRefCenter();
			var camera = viewport.getCamera().getCameraRef();
			center.project(camera);
			return Math.floor(10000 * (1 - center.z));
		}
		return "auto";
	};

	Annotation.prototype.setScene = function(sceneRef) {
		this._sceneRef = sceneRef;
	};

	Annotation.prototype._getOpacity = function() {
		if (this._sceneRef) {
			var zIndex = this.getDomRef().style.zIndex;
			var annotations = this._sceneRef.getAnnotations().filter(function(atn) {
				return atn.getVisible() === true;
			});
			var zIndexes = Array.from(annotations, function(atn) {
				return atn.getDomRef().style.zIndex;
			});
			var zMax = Math.max.apply(null, zIndexes);
			var zMin = Math.min.apply(null, zIndexes);
			return 0.7 + (zIndex - zMin) * 0.3 / (zMax - zMin);
		}
		return 1;
	};

	Annotation.prototype._getDelay = function() {
		if (this._sceneRef) {
			var zIndex = this.getDomRef().style.zIndex;
			var annotations = this._sceneRef.getAnnotations().filter(function(atn) {
				return atn.getVisible() === true;
			});
			var zIndexes = Array.from(annotations, function(atn) {
				return atn.getDomRef().style.zIndex;
			}).sort(function(a, b) {
				return b - a;
			});
			return zIndexes.indexOf(zIndex);
		}
	};

	Annotation.prototype.onAfterRendering = function() {
		var annotation = this.getDomRef();
		if (annotation) {
			annotation.style.display = this.getTitle() ? "block" : "none";
			this._initialOffsetWidth = annotation.offsetWidth;
			this._initialOffsetHeight = annotation.offsetHeight;
			this._textDiv = this._textDiv || new sap.m.TextArea({
				value: this.getTitle(),
				growing: true,
				valueLiveUpdate: true
			});
			this._textDiv.detachLiveChange(this._handleTitleChange, this);
			this._textDiv.attachLiveChange(this._handleTitleChange, this);
			this._textDiv.addStyleClass("sapUiVizKitAnnotationText");
			this._textDiv.placeAt(annotation);
			delete this._textDiv.ontouchstart;
			if (!this.getVisible()){
				annotation.style.visibility = "hidden";
			}
		}
	};

	Annotation.prototype._handleTitleChange = function() {
		this.fireTitleChanged({
			title: this._textDiv.getValue()
		});
	};

	Annotation.prototype.setVisible = function(visible) {
		this.setProperty("visible", visible);
		var annotation = this.getDomRef();
		if (annotation) {
			annotation.style.visibility = visible ? "visible" : "hidden";
		}
	};

	Annotation.prototype._update = function(viewport) {
		var that = this;
		var annotation = this.getDomRef();
		if (annotation) {
			var nodeScreen = this._getNodeRefScreenCenter(viewport);
			var viewportRect = viewport.getDomRef().getBoundingClientRect();
			if (this.getStyle() !== AnnotationStyle.Fixed) {
				annotation.style.zIndex = this._getSortIndex(viewport);
				annotation.style.opacity = this._getOpacity();
				annotation.style.animationDelay = this._getDelay() + "s";
				annotation.style.transform = "perspective(1px) scale3d(" + annotation.style.opacity + ", " + annotation.style.opacity + ", " + annotation.style.opacity + ")";
			}
			switch (this.getStyle()) {
				case AnnotationStyle.Default:
					annotation.style.transformOrigin = "bottom center";
					annotation.style.left = (nodeScreen.x - annotation.offsetWidth / 2) + "px";
					var annotationBottom = nodeScreen.y;
					annotation.style.bottom = "calc(" + (annotationBottom + (annotation.offsetHeight * 0.25)) + "px + 2.5rem)";
					break;
				case AnnotationStyle.Explode:
					annotation.style.transformOrigin = "bottom left";
					var annotationLeft = (nodeScreen.x - this._initialOffsetWidth / 2);
					annotation.style.left = "calc(" + (annotationLeft + (this._initialOffsetWidth * 0.25)) + "px - 3rem)";
					annotation.style.bottom = "calc(" + (nodeScreen.y + this._initialOffsetHeight * 0.25) + "px + 3rem)";
					break;
				case AnnotationStyle.Square:
					annotation.style.transformOrigin = "top right";
					annotation.style.right = "calc(" + (viewportRect.width - (nodeScreen.x - this._initialOffsetWidth / 2)) + "px + 3rem)";
					annotation.style.top = "calc(" + (viewportRect.height - nodeScreen.y) + "px + 3rem)";
					break;
				case AnnotationStyle.Random:
					var annotationElements = annotation.childNodes;
					if (annotationElements) {
						var rightStyle = {
							leftMargin: "5rem",
							bottomMargin: "5rem",
							squareLeft: "-6rem",
							squareBottom: "-6rem",
							transformOrigin: "bottom left",
							connectSquare: annotationElements[1]
						};
						var leftStyle = {
							leftMargin: "-15rem",
							bottomMargin: "5rem",
							squareLeft: "15rem",
							squareBottom: "-6rem",
							transformOrigin: "bottom right",
							connectSquare: annotationElements[4]
						};
						var centralStyle = {
							leftMargin: "0rem",
							bottomMargin: "0rem",
							squareLeft: "-1rem",
							squareBottom: "-1rem",
							transformOrigin: "bottom left",
							connectSquare: annotationElements[1]
						};
						this._position = nodeScreen.x < viewportRect.width / 2 ? leftStyle : rightStyle;
						if (this._isFold === true) {
							this._position = centralStyle;
						}
					}
					annotation.style.setProperty("--square-left", this._position.squareLeft);
					annotation.style.setProperty("--square-bottom", this._position.squareBottom);
					annotation.style.transformOrigin = this._position.transformOrigin;
					annotation.style.left = "calc(" + (nodeScreen.x - this._initialOffsetWidth * 0.25) + "px + " + this._position.leftMargin + ")";
					annotation.style.bottom = "calc(" + (nodeScreen.y + this._initialOffsetHeight * 0.25) + "px + " + this._position.bottomMargin + ")";

					if (annotationElements[0] && this._position.connectSquare && annotationElements[2]) {
						setLine(annotationElements[0], this._position.connectSquare, annotationElements[2]);
						annotationElements[0].onclick = function() {
							this._isFold = !this._isFold;
						}.bind(this);
					}
					if (!annotationElements[3].innerHTML || this._prevText !== this._textDiv.getValue()) {
						this._prevText = this._textDiv.getValue();
						annotationElements[3].innerHTML = "<span>" + this._prevText.split("").join("</span><span>") + "</span>";
						this._textDiv.rerender();
						Array.from(annotationElements[3].childNodes).forEach(function(span) {
							span.style.animationDelay = (this._getDelay() + Math.random()) + "s";
						}.bind(this));
					}
					break;
				case AnnotationStyle.Fixed:
						var move = function(){
							that._handleViewportMove(that, event);
						};
						var touchMove = function(){
							/* eslint-disable no-use-before-define */
							that._handleViewportTouchMove(that, event, move, touchMove, viewport, stop);
							/* eslint-disable no-use-before-define */
						};
						var stop = function(){
							that._handleViewportStop(that, move, touchMove, viewport, stop);
						};

						if (sap.ui.Device.support.touch) {
							this._textDiv.ontouchstart = function(event) {
								if (event.originalEvent.button === 0 || !event.originalEvent.button){
									delete that._textDiv.ontouchend;
									that._moving = true;
									that._initialX = event.targetTouches[0].clientX;
									that._initialY = event.targetTouches[0].clientY;
									viewport.attachBrowserEvent("touchmove", touchMove);
									viewport.attachBrowserEvent("mousemove", move);
									viewport.attachBrowserEvent("mouseup", stop);
								}
							};
						} else {
							this._textDiv.onmousedown = function(event) {
								if (event.originalEvent.button === 0) {
									that._moving = true;
									that._initialX = event.clientX;
									that._initialY = event.clientY;
									viewport.attachBrowserEvent("mousemove", move);
									viewport.attachBrowserEvent("mouseup", stop);
								}
							};
						}
					break;
				default:
					break;
			}
		}
	};

	Annotation.prototype._handleViewportTouchMove = function(annotation, event, move, touchMove, viewport, stop) {
		if (annotation._moving){
			annotation._textDiv.ontouchend = function(event) {
				annotation._handleViewportStop(annotation, move, touchMove, viewport, stop);
			};
			annotation._currentX = event.targetTouches[0].clientX - annotation._initialX;
			annotation._currentY = event.targetTouches[0].clientY - annotation._initialY;
		}
		setTranslate(annotation._currentX, annotation._currentY, annotation.getDomRef());
	};

	Annotation.prototype._handleViewportMove = function(annotation, event) {
		if (annotation._moving){
			annotation._currentX = event.clientX - annotation._initialX;
			annotation._currentY = event.clientY - annotation._initialY;
		}
		setTranslate(annotation._currentX, annotation._currentY, annotation.getDomRef());
	};

	Annotation.prototype._handleViewportStop = function(annotation, move, touchMove, viewport, stop) {
		annotation._moving = false;
		var domRef = annotation.getDomRef();
		var computedStyle = window.getComputedStyle(document.getElementById(domRef.id));
		var transform = domRef.style.transform;
		domRef.style.transform = "";
		var x = parseFloat(transform.substring(transform.indexOf("(") + 1, transform.indexOf(",")));
		var y = parseFloat(transform.substring(transform.indexOf(",") + 1, transform.indexOf(")")));
		domRef.style.left = (parseFloat(computedStyle.left) + x) + "px";
		domRef.style.top = (parseFloat(computedStyle.top) + y) + "px";
		viewport.detachBrowserEvent("touchmove", touchMove);
		viewport.detachBrowserEvent("mousemove", move);
		viewport.detachBrowserEvent("mouseup", stop);
	};

	function setTranslate(x, y, annotation) {
		annotation.style.transform = "translate(" + x + "px, " + y + "px)";
	  }

	function setLine(from, to, line) {
		var fT = from.offsetTop + from.offsetHeight / 2;
		var tT = to.offsetTop + to.offsetHeight / 2;
		var fL = from.offsetLeft + from.offsetWidth / 2;
		var tL = to.offsetLeft + to.offsetWidth / 2;

		var topSide   = Math.abs(tT - fT);
		var leftSide   = Math.abs(tL - fL);
		var height    = Math.sqrt(topSide * topSide + leftSide * leftSide);
		var angle  = 180 / Math.PI * Math.acos(topSide / height);
		var top, left;
		if (tT > fT) {
			top  = (tT - fT) / 2 + fT;
		} else {
			top  = (fT - tT) / 2 + tT;
		}
		if (tL > fL) {
			left = (tL - fL) / 2 + fL;
		} else {
			left = (fL - tL) / 2 + tL;
		}

		if ((fT < tT && fL < tL) || (tT < fT && tL < fL) || (fT > tT && fL > tL) || (tT > fT && tL > fL)) {
			angle *= -1;
		}
		top -= height / 2;

		line.style.transform = "rotate(" + angle + "deg)";
		line.style.top = top + "px";
		line.style.left = left + "px";
		line.style.height = height + "px";
	}

	return Annotation;
});
