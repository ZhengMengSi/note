/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides control sap.ui.vk.Annotation
sap.ui.define([
	"sap/ui/core/Control",
	"sap/ui/vk/AnnotationStyle",
	"sap/ui/vk/AnnotationPositionType",
	"sap/ui/vk/SafeArea",
	"sap/ui/vk/AnnotationRenderer",
	"sap/ui/vk/NodeUtils",
	"sap/ui/vk/NodeContentType",
	"sap/m/FormattedText",
	"sap/ui/richtexteditor/RichTextEditor",
	"sap/ui/richtexteditor/EditorType"
], function(
	Control,
	AnnotationStyle,
	AnnotationPositionType,
	SafeArea,
	AnnotationRenderer,
	NodeUtils,
	NodeContentType,
	FormattedText,
	RTE,
	EditorType
) {
	"use strict";

	/**
	 * Constructor for a new Annotation.
	 *
	 * @class
	 * Annotation allows applications to display custom html annotation on top of Viewport and associate it with 3D object
	 *
	 * @public
	 * @author SAP SE
	 * @version 1.77.0
	 * @extends sap.ui.core.Control
	 * @alias sap.ui.vk.Annotation
	 */

	var Annotation = Control.extend("sap.ui.vk.Annotation", /** @lends sap.ui.vk.Annotation.prototype */ {
		metadata: {
			properties: {
				/**
				 * Reference to the annotation Id
				 */
				annotationId: "string",
				/**
				 * Reference to the annotation name
				 */
				annotationName: "string",
				/**
				 * Reference to the annotation type
				 */
				annotationType: "string",
				/**
				 * Reference to the node that the annotation will be associated with
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
					defaultValue: false
				},
				/**
				 * Controls the css animate or static of the annotation
				 */
				isStatic: {
					type: "boolean",
					defaultValue: false
				},
				/**
				 * Controls the annotation is slected or unselected
				 */
				selected: {
					type: "boolean",
					defaultValue: false
				},
				/**
				 * Controls the annotation is editable or uneditable
				 */
				editable: {
					type: "boolean",
					defaultValue: false
				},
				/**
				 * Sets the X Coordinate of the annotation. This uses a scale of -0.5 to 0.5, left to right respectively. This is relative to the Viewport's safe area if present, otherwise it is relative to the Viewport.
				 */
				xCoordinate: {
					type: "float"
				},
				/**
				 * Sets the Y Coordinate of the annotation. This uses a scale of -0.5 to 0.5, top to bottom respectively. This is relative to the Viewport's safe area if present, otherwise it is relative to the Viewport.
				 */
				yCoordinate: {
					type: "float"
				},
				/**
				 * Sets the height of the annotation. This uses a scale of 0 to 1, 0% to 100% respectively. This is relative to the Viewport's safe area if present, otherwise it is relative to the Viewport. Negative values will be ignored.
				 */
				height: {
					type: "float"
				},
				/**
				 * Sets the width of the annotation. This uses a scale of 0 to 1, 0% to 100% respectively. This is relative to the Viewport's safe area if present, otherwise it is relative to the Viewport. Negative values will be ignored.
				 */
				width: {
					type: "float"
				},
				/**
				 * Defines whether the annotation is positioned Relative or Fixed. If Relative, and the annotation has a nodeRef then the annotation will be positioned based on and follow the center of the nodeRef's bounding box. If Relative, and the annotation does not have a nodeRef then the annotation will be positioned at a fixed location on the screen, which can be adjusted. If Fixed, regardless of whether the annotation has a nodeRef or not, the annotation will be positioned at a fixed location on the screen, which can be adjusted.
				 */
				positionType: {
					type: "sap.ui.vk.AnnotationPositionType",
					defaultValue: AnnotationPositionType.Relative
				}
			},

			events: {
				/**
				 * This event will be fired when the annotation text is changed on the control
				 */
				textUpdated: {
					parameters: {
						/**
						 * Returns the changed annotation text as a string
						 */
						text: {
							type: "string"
						},
						nodeRef: {
							type: "object"
						}
					}
				},
				/**
				 * This event will be fired when the annotation position is changed
				 */
				positionChanged: {
					parameters: {
						nodeRef: {
							type: "object"
						},
						x: {
							type: "float"
						},
						y: {
							type: "float"
						}
					}
				},
				/**
				 * This event will be fired when the annotation size is changed
				 */
				sizeChanged: {
					parameters: {
						nodeRef: {
							type: "object"
						},
						width: {
							type: "float"
						},
						height: {
							type: "float"
						}
					}
				},
				doubleClicked: {
					parameters: {
						nodeRef: {
							type: "sap.ui.core.control"
						}
					}
				}
			},
			aggregations: {
				textEditor: {
					type: "sap.ui.core.Control",
					multiple: false
				}
			}
		},

		constructor: function(sId, mSettings) {
			Control.apply(this, arguments);
		}
	});

	Annotation.prototype._getNodeRefScreenCenter = function(viewport, node) {
		var center = NodeUtils.centerOfNodes([ node || this.getNodeRef() ]);

		// Return object with screen coordinates in pixels and normalized z coordinate (node's depth)
		return viewport.projectToScreen(center[0], center[1], center[2], viewport.getCamera());
	};

	Annotation.prototype._getSortIndex = function(viewport) {
		this.zIndex = this.zIndex || "auto";
		if (this.getNodeRef()) {
			var center = NodeUtils.centerOfNodes([ this.getNodeRef() ]);
			var screenPoint = viewport.projectToScreen(center[0], center[1], center[2], viewport.getCamera());
			this.zIndex = Math.floor(10000 * (1 - screenPoint.depth));
		}
		return this.zIndex;
	};

	Annotation.prototype.setSceneView = function(sceneRef, viewid) {
		this._sceneRef = sceneRef;
		this._viewIds = this._viewIds || new Map();
		if (viewid) {
			this._viewIds.set(viewid, true);
		}
	};

	Annotation.prototype._getOpacity = function() {
		if (this._sceneRef) {
			var zIndex = this.zIndex;
			var annotations = [];
			this._sceneRef.getAnnotations().forEach(function(atn) {
				if (atn.getVisible() === true) {
					annotations.push(atn);
				}
			});
			if (annotations.length > 1) {
				var zIndexes = Array.from(annotations, function(atn) {
					return atn.zIndex;
				});
				var zMax = Math.max.apply(null, zIndexes);
				var zMin = Math.min.apply(null, zIndexes);
				return 0.7 + (zIndex - zMin) * 0.3 / (zMax - zMin);
			}
		}
		return 1;
	};

	Annotation.prototype.setBlocked = function(isBlocked) {
		this._isBlocked = isBlocked;
	};

	Annotation.prototype._updateBlocked = function(viewport) {
		var selectNode = this.getNodeRef();
		var viewportRect = viewport.getDomRef().getBoundingClientRect();
		var nodeScreen = this._getNodeRefScreenCenter(viewport, selectNode);
		var hitNode = viewport.hitTest(nodeScreen.x, viewportRect.height - nodeScreen.y);

		if (hitNode) {
			if ([ selectNode.uuid, selectNode.parent.uuid ].includes(hitNode.object.uuid)) {
				this._isBlocked = false;
				this.getDomRef().className = "sapUiVizKitAnnotation" + this.getStyle();
			} else {
				this._isBlocked = true;
				var vsm = sap.ui.getCore().byId(viewport.getViewStateManager());
				var worldPos = vsm.getTransformationWorld(hitNode.object).translation;
				var hitPos = viewport.projectToScreen(worldPos[0], worldPos[1], worldPos[2], viewport.getCamera());
				if (hitPos.z < nodeScreen.z) {
					this.getDomRef().className = "sapUiVizKitAnnotationHidden";
				} else {
					this.getDomRef().className = "sapUiVizKitAnnotation" + this.getStyle();
				}
			}
		}
	};

	Annotation.prototype._getDelay = function() {
		if (this._sceneRef) {
			var zIndex = this.zIndex;
			var annotations = [];
			this._sceneRef.getAnnotations().forEach(function(atn) {
				if (atn.getVisible() === true) {
					annotations.push(atn);
				}
			});
			if (annotations.length <= 1) {
				return 0;
			}
			var zIndexes = Array.from(annotations, function(atn) {
				return atn.zIndex;
			}).sort(function(a, b) {
				return b - a;
			});
			return zIndexes.indexOf(zIndex);
		}
	};

	Annotation.prototype.setTitle = function(text) {
		this.setProperty("title", text);

		this.fireTextUpdated({
			text: this.getTitle(),
			nodeRef: this.getAnnotationNode()
		});

		this.setText(text);
	};

	Annotation.prototype.setText = function(text) {
		if (this.getTextEditor()) {
			// We have editor open, set text to RTE control
			this._textDiv.value = text;
			return this;
		}

		if (this._textDiv == null) {
			this._textDiv = new FormattedText({
				htmlText: text,
				width: this._textWidth ? this._textWidth : "100px",
				height: this._textHeight ? this._textHeight : "40px"
			});
			this._textDiv.addStyleClass("sapUiVizKitAnnotationText");
			this._textDiv.onclick = this._handleSelect.bind(this);
		} else if (this.getStyle() === AnnotationStyle.Random) {
			this._setRandomText(text);
		} else {
			this._textDiv.setHtmlText(text);
		}
		return  this;
	};

	Annotation.prototype._setRandomText = function(textValue) {
		if (this.getTextEditor()) {
			// No random text while editor is open
			return this;
		}
		var newText = "";
		for (var i = 0; i < textValue.length; i++) {
			if (textValue[i] === "<") {
				newText += "<";
				while (textValue[i] !== ">") {
					i++;
					newText += textValue[i];
				}
			}
			if (textValue[i] !== ">") {
				var randomDelay = (this._getDelay() + Math.random()) + "s";
				var animationName = this.getIsStatic() ? "annotationStatic" : "annotationRandomTextSpan";
				newText += "<span style='animation: " + animationName + " 4s linear " + randomDelay + " 1 alternate both;'>";
				newText += textValue[i];
				newText += "</span>";
			}
		}
		this._textDiv.setHtmlText(newText);

		return this;
	};

	Annotation.prototype.setStyle = function(val) {
		this.setProperty("style", val);

		this.setText(this.getTitle());
	};

	Annotation.prototype.init = function() {
		this.attachBrowserEvent("dblclick", function() {
			this.fireDoubleClicked();
		});
	};

	Annotation.prototype.openEditor = function() {
		var rte = new RTE({
			editorType: EditorType.TinyMCE4,
			width: this._textDiv.getWidth(),
			height: this._textDiv.getHeight(),
			value: this.getTitle()
		});
		if (this._textDiv) {
			this._textDiv.onclick = null;
			this._textDiv.destroy();
		}
		rte.addStyleClass("sapUiVizKitAnnotationRTE");
		this._textDiv = rte;
		this.setTextEditor(rte);
		this.rerender();

		return rte;
	};

	Annotation.prototype.closeEditor = function() {
		if (this.getTextEditor() == null) {
			// Editor is not open
			return;
		}
		var text = this._textDiv.getValue();
		this.destroyTextEditor(); // Destroy editor aggregation, this wilo also destroy the editor control
		this._textDiv = null;
		this.setText(text);
	};

	Annotation.prototype.onAfterRendering = function() {
		var annotation = this.getDomRef();
		if (annotation) {
			annotation.style.display = this.getTitle() ? "block" : "none";
			this._initialOffsetWidth = annotation.offsetWidth;
			this._initialOffsetHeight = annotation.offsetHeight;
			// this.setText(this.getTitle());
			delete this._textDiv.ontouchstart;
			if (!this.getVisible()) {
				annotation.style.visibility = "hidden";
			}
		}
	};

	Annotation.prototype._handleSelect = function(evt) {
		var nodeRef = this.getAnnotationNode();

		var picked = nodeRef ? [ nodeRef ] : [];
		if (this._viewport.getSelectionMode() === sap.ui.vk.SelectionMode.Exclusive) {
			this._viewport.exclusiveSelectionHandler(picked);
		} else if (this._viewport.getSelectionMode() === sap.ui.vk.SelectionMode.Sticky) {
			this._viewport.stickySelectionHandler(picked);
		}

		evt.stopPropagation();
	};

	Annotation.prototype.setVisibleFromNode = function(vp) {
		var vsm = sap.ui.getCore().byId(vp.getViewStateManager());
		var nodeRef = this.getAnnotationNode();
		this.setProperty("visible", vsm.getVisibilityState(nodeRef));
		return this;
	};

	Annotation.prototype.setVisible = function(visible) {
		this.setProperty("visible", visible);
		var annotation = this.getDomRef();
		if (annotation) {
			var vsm = sap.ui.getCore().byId(this._viewport.getViewStateManager());
			var nodeRef = this.getAnnotationNode();
			if (vsm.getVisibilityState(nodeRef) !== visible) {
				vsm.setVisibilityState(nodeRef, visible);
			}
			var annotationNodeElement = annotation.nextSibling;
			var annotationLeaderLine = annotationNodeElement.nextSibling;
			annotation.style.visibility = visible ? "visible" : "hidden";
			annotationNodeElement.style.visibility = visible ? "visible" : "hidden";
			if (!this._moving) {
				annotationLeaderLine.style.visibility = visible ? "visible" : "hidden";
			}
		}
		return this;
	};

	Annotation.prototype.setEditable = function(editable) {
		var annotation = this.getDomRef();
		if (annotation) {
			if (editable) {
				this._previousState = this._previousState || {};
				var annotationRect = annotation.getBoundingClientRect();
				this._previousState.style = this.getStyle();
				this._previousState.positionType = this.getPositionType();
				this._previousState.x = annotationRect.x;
				this._previousState.y = annotationRect.y;
				this.setPositionType(AnnotationPositionType.Fixed);
				this.setStyle(AnnotationStyle.Editing);
			} else {
				if (!this.getEditable()) {
					return this;
				}
				var style = this._offsetTop ? AnnotationPositionType.Fixed : this._previousState.positionType;
				this.setPositionType(style);
				this.setIsStatic(true);
				this.setStyle(this._previousState.style);
			}
			this._shouldRenderVp = true;
			this.setProperty("editable", editable);
		}
		return this;
	};

	Annotation.prototype.setSelected = function(selected) {
		this.setProperty("selected", selected);
		var vsm = sap.ui.getCore().byId(this._viewport.getViewStateManager());
		var nodeRef = this.getAnnotationNode();
		if (vsm.getSelectionState(nodeRef) !== selected) {
			vsm.setSelectionState(nodeRef, selected);
		}
		return this;
	};

	Annotation.prototype.setAnnotationId = function(annotationId, scene) {
		this.setProperty("annotationId", annotationId);
		var node = this.getAnnotationNode();
		if (node) {
			node.userData.nodeId = annotationId;
			scene.setNodePersistentId(node, this.getAnnotationId());
		}
	};

	Annotation.prototype.setHeight = function(height) {
		if (height < 0) {
			return;
		}

		this.setProperty("height", height);

		if (!this._viewport) {
			return;
		}

		var annotation = this.getDomRef();
		if (this._viewport.getSafeArea()) {
			var safeArea = document.getElementById(this._viewport.getSafeArea().sId);
			var saHeight = parseFloat(safeArea.style.height);
			saHeight *= height;
			if (annotation) {
				annotation.style.height = "calc(" + saHeight + "px + 1rem)";
			}
		} else {
			var vp = this._viewport.getDomRef();
			if (vp) {
				var vpHeight = vp.getBoundingClientRect().height;
				vpHeight *= height;
				if (annotation) {
					annotation.style.height = "calc(" + vpHeight + "px + 1rem)";
				}
			}
		}
	};

	Annotation.prototype.setWidth = function(width) {
		if (width < 0) {
			return;
		}

		this.setProperty("width", width);

		if (!this._viewport) {
			return;
		}

		var annotation = this.getDomRef();
		if (this._viewport.getSafeArea()) {
			var safeArea = document.getElementById(this._viewport.getSafeArea().sId);
			var saWidth = parseFloat(safeArea.style.width);
			saWidth *= width;
			if (annotation) {
				annotation.style.width = "calc(" + saWidth + "px + 1rem)";
				annotation.style.maxWidth = "calc(" + saWidth + "px + 1rem)";
			}
		} else {
			var vp = this._viewport.getDomRef();
			if (vp) {
				var vpWidth = vp.getBoundingClientRect().width;
				vpWidth *= width;
				if (annotation) {
					annotation.style.width = "calc(" + vpWidth + "px + 1rem)";
					annotation.style.maxWidth = "calc(" + vpWidth + "px + 1rem)";
				}
			}
		}
	};

	Annotation.prototype.setXCoordinate = function(x) {
		this.setProperty("xCoordinate", x);

		if (!this._viewport) {
			return;
		}

		var annotation = this.getDomRef();
		var newX = Math.abs(x) * 2;
		var computedStyle = window.getComputedStyle(document.getElementById(this._viewport.getSafeArea().sId));
		var saWidth = parseFloat(computedStyle.width);
		var saLeft = parseFloat(computedStyle.left);
		if (this._viewport.getSafeArea() && !(saWidth === 0 && saLeft === 0)) {
			var saCenter = saLeft + (saWidth / 2);
			var saHalfWidth = saWidth / 2;
			if (x < 0) {
				newX = 1 - newX;
				saHalfWidth *= newX;
				annotation.style.left = ((saLeft + saHalfWidth) + 2) + "px";
			} else if (x > 0) {
				saHalfWidth *= newX;
				annotation.style.left = ((saCenter + saHalfWidth) + 2) + "px";
			} else {
				annotation.style.left = saCenter + "px";
			}
		} else {
			var vp = this._viewport.getDomRef();
			if (vp) {
				vp = vp.getBoundingClientRect();
				var vpWidth = parseFloat(vp.width);
				var vpCenter = vpWidth / 2;
				var vpHalfWidth = vpWidth / 2;
				if (x < 0) {
					newX = 1 - newX;
					vpHalfWidth *= newX;
					annotation.style.left = vpHalfWidth + "px";
				} else if (x > 0) {
					vpHalfWidth *= newX;
					annotation.style.left = (vpCenter + vpHalfWidth) + "px";
				} else {
					annotation.style.left = vpCenter + "px";
				}
			}
		}
	};

	Annotation.prototype.getXCoordinate = function() {
		var annotation = this.getDomRef();

		if (annotation && this._viewport) {
			var anComputedStyle = window.getComputedStyle(document.getElementById(this.sId));
			var anLeft = parseFloat(anComputedStyle.left);
			var saComputedStyle = window.getComputedStyle(document.getElementById(this._viewport.getSafeArea().sId));
			var saWidth = parseFloat(saComputedStyle.width);
			var saLeft = parseFloat(saComputedStyle.left);

			if (this._viewport.getSafeArea() && !(saWidth === 0 && saLeft === 0)) {
				anLeft -= 2;
				var xCoordinate = (((anLeft - saLeft)) / saWidth) + -0.5;
				return xCoordinate;
			} else {
				var vp = this._viewport.getDomRef();
				if (vp) {
					vp = vp.getBoundingClientRect();
					var vpWidth = parseFloat(vp.width);
					var xCoordinate2 = (anLeft / vpWidth) + -0.5;
					return xCoordinate2;
				}
			}
		} else {
			return this.getProperty("xCoordinate");
		}
	};

	Annotation.prototype.setYCoordinate = function(y) {
		this.setProperty("yCoordinate", y);

		if (!this._viewport) {
			return;
		}

		var annotation = this.getDomRef();
		var newY = Math.abs(y) * 2;
		var computedStyle = window.getComputedStyle(document.getElementById(this._viewport.getSafeArea().sId));
		var saHeight = parseFloat(computedStyle.height);
		var saTop = parseFloat(computedStyle.top);

		if (this._viewport.getSafeArea() && !(saHeight === 0 && saTop === 0)) {
			var saCenter = saTop + (saHeight / 2);
			var saHalfHeight = saHeight / 2;
			if (y < 0) {
				newY = 1 - newY;
				saHalfHeight *= newY;
				annotation.style.top = ((saTop + saHalfHeight) + 2) + "px";
			} else if (y > 0) {
				saHalfHeight *= newY;
				annotation.style.top = ((saCenter + saHalfHeight) + 2) + "px";
			} else {
				annotation.style.top = saCenter + "px";
			}
		} else {
			var vp = this._viewport.getDomRef();
			if (vp) {
				vp = vp.getBoundingClientRect();
				var vpHeight = parseFloat(vp.height);
				var vpCenter = vpHeight / 2;
				var vpHalfHeight = vpHeight / 2;
				if (y < 0) {
					newY = 1 - newY;
					vpHalfHeight *= newY;
					annotation.style.top = vpHalfHeight + "px";
				} else if (y > 0) {
					vpHalfHeight *= newY;
					annotation.style.top = (vpCenter + vpHalfHeight) + "px";
				} else {
					annotation.style.top = vpCenter + "px";
				}
			}
		}
	};

	Annotation.prototype.getYCoordinate = function() {
		var annotation = this.getDomRef();

		if (annotation && this._viewport) {
			var anComputedStyle = window.getComputedStyle(document.getElementById(this.sId));
			var anTop = parseFloat(anComputedStyle.top);
			var saComputedStyle = window.getComputedStyle(document.getElementById(this._viewport.getSafeArea().sId));
			var saHeight = parseFloat(saComputedStyle.height);
			var saTop = parseFloat(saComputedStyle.top);
			if (this._viewport.getSafeArea() && !(saHeight === 0 && saTop === 0)) {
				anTop -= 2;
				var yCoordinate = (((anTop - saTop)) / saHeight) + -0.5;
				return yCoordinate;
			} else {
				var vp = this._viewport.getDomRef();
				if (vp) {
					vp = vp.getBoundingClientRect();
					var vpHeight = parseFloat(vp.height);
					var yCoordinate2 = (anTop / vpHeight) + -0.5;
					return yCoordinate2;
				}
			}
		} else {
			return this.getProperty("yCoordinate");
		}
	};

	Annotation.prototype.getAnnotationNode = function() {
		if (this.sourceData) {
			return this.sourceData.node;
		}
		return null;
	};

	Annotation.prototype.setSelectedState = function(selected) {
		var annotation = this.getDomRef();
		if (selected && annotation) {
			annotation.style.setProperty("--border-color", "red");
		} else {
			annotation.style.setProperty("--border-color", "transparent");
		}
	};

	Annotation.prototype.setEditableState = function() {
		var that = this;
		var annotation = this.getDomRef();
		var editableAnnotations = this._sceneRef.getEditableAnnotations();
		var viewportRect = this._viewport.getDomRef().getBoundingClientRect();
		var annotationNodeElement = annotation.nextSibling;
		var currentSize = new Map();
		editableAnnotations.forEach(function(annotation) {
			var textWidth = parseInt(annotation._textDiv.getWidth().slice(0, -2), 10);
			var textHeight = parseInt(annotation._textDiv.getHeight().slice(0, -2), 10);
			currentSize.set(annotation.getAnnotationId(), {
				width: textWidth,
				height: textHeight
			});
		});
		var gripElements = annotation.childNodes;

		// move annotation
		this._textDiv.onmousedown = function(ev) {
			var oEvent = ev || event;
			if (oEvent.button === 0) {
				editableAnnotations.forEach(function(annotation) {
					annotation._moving = true;
					annotation._initialX = oEvent.clientX;
					annotation._initialY = oEvent.clientY;
				});
				document.onmousemove = function(ev) {
					oEvent = ev || event;
					that._viewport._viewportGestureHandler._gesture = false;
					editableAnnotations.forEach(function(annotation) {
						annotation._currentX = oEvent.clientX - annotation._initialX;
						annotation._currentY = oEvent.clientY - annotation._initialY;
						setTranslate(annotation._currentX, annotation._currentY, annotation.getDomRef());
					});
				};
				document.onmouseup = function() {
					editableAnnotations.forEach(function(annotation) {
						annotation._handleViewportStop();
					});
					document.onmousemove = null;
					document.onmouseup = null;
				};
			}
		};

		// move leader line arrowhead
		annotationNodeElement.onmousedown = function(ev) {
			var oEvent = ev || event;
			var hitNode;
			var annotationNode = {
				_initialX: oEvent.clientX,
				_initialY: oEvent.clientY
			};
			var currentNode = that.getNodeRef();
			document.onmousemove = function(ev) {
				that._moving = true;
				that._viewport._viewportGestureHandler._gesture = false;
				oEvent = ev || event;
				setTranslate(oEvent.clientX - annotationNode._initialX, oEvent.clientY - annotationNode._initialY, annotationNodeElement);
				hitNode = that._viewport.hitTest(oEvent.clientX - viewportRect.x, oEvent.clientY - viewportRect.y);
			};
			document.onmouseup = function() {
				that._moving = false;
				var computedStyle = window.getComputedStyle(annotationNodeElement);
				var transform = annotationNodeElement.style.transform;
				annotationNodeElement.style.transform = "";
				var x = parseFloat(transform.substring(transform.indexOf("(") + 1, transform.indexOf(",")));
				var y = parseFloat(transform.substring(transform.indexOf(",") + 1, transform.indexOf(")")));
				annotationNodeElement.style.left = parseFloat(computedStyle.left) + x + "px";
				annotationNodeElement.style.top = parseFloat(computedStyle.top) + y + "px";
				if (hitNode) {
					that.setNodeRef(hitNode.object);
				} else {
					that.setNodeRef(currentNode);
				}
				that._shouldRenderVp = true;
				document.onmousemove = null;
				document.onmouseup = null;
			};
		};

		// resize annotation
		// north west
		gripElements[0].onmousedown = function(ev) {
			var oEvent = ev || event;
			if (oEvent.button === 0) {
				var disX = oEvent.clientX - gripElements[0].offsetLeft;
				var disY = oEvent.clientY - gripElements[0].offsetTop;
				document.onmousemove = function(ev) {
					that._viewport._viewportGestureHandler._gesture = false;
					var oEvent = ev || event;
					var deltaWidth = oEvent.clientX - disX;
					var deltaHeight = oEvent.clientY - disY;
					editableAnnotations.forEach(function(annotation) {
						annotation._moving = true;
						annotation._textWidth = currentSize.get(annotation.getAnnotationId()).width - deltaWidth + "px";
						annotation._textHeight = currentSize.get(annotation.getAnnotationId()).height - deltaHeight + "px";
						annotation._textDiv.setWidth(annotation._textWidth);
						annotation._textDiv.setHeight(annotation._textHeight);
						annotation._textDiv.getDomRef().style.width = annotation._textWidth;
						annotation._textDiv.getDomRef().style.height = annotation._textHeight;
						setTranslate(deltaWidth, deltaHeight, annotation.getDomRef());
					});
				};
				document.onmouseup = function() {
					editableAnnotations.forEach(function(annotation) {
						annotation._handleViewportStop();
						var annotationRect = annotation.getDomRef().getBoundingClientRect();
						var annotationWidth = annotation.getWidth() ? annotation.getWidth() : annotationRect.width / viewportRect.width;
						var annotationHeight = annotation.getHeight() ? annotation.getHeight() : annotationRect.height / viewportRect.height;
						annotation.getAnnotationNode().scale.set(annotationWidth, annotationHeight, 1);
						annotation.fireSizeChanged({
							nodeRef: annotation.getAnnotationNode(),
							width: annotationWidth,
							height: annotationHeight
						});
					});
					document.onmousemove = null;
					document.onmouseup = null;
				};
			}
		};

		// north
		gripElements[1].onmousedown = function(ev) {
			var oEvent = ev || event;
			if (oEvent.button === 0) {
				var disY = oEvent.clientY - gripElements[0].offsetTop;
				document.onmousemove = function(ev) {
					that._viewport._viewportGestureHandler._gesture = false;
					var oEvent = ev || event;
					var deltaHeight = oEvent.clientY - disY;
					editableAnnotations.forEach(function(annotation) {
						annotation._moving = true;
						annotation._textHeight = currentSize.get(annotation.getAnnotationId()).height - deltaHeight + "px";
						annotation._textDiv.setHeight(annotation._textHeight);
						annotation._textDiv.getDomRef().style.height = annotation._textHeight;
						setTranslate(0, deltaHeight, annotation.getDomRef());
					});
				};
				document.onmouseup = function() {
					editableAnnotations.forEach(function(annotation) {
						annotation._handleViewportStop();
						var annotationRect = annotation.getDomRef().getBoundingClientRect();
						var annotationWidth = annotation.getWidth() ? annotation.getWidth() : annotationRect.width / viewportRect.width;
						var annotationHeight = annotation.getHeight() ? annotation.getHeight() : annotationRect.height / viewportRect.height;
						annotation.getAnnotationNode().scale.set(annotationWidth, annotationHeight, 1);
						annotation.fireSizeChanged({
							nodeRef: annotation.getAnnotationNode(),
							width: annotationWidth,
							height: annotationHeight
						});
					});
					document.onmousemove = null;
					document.onmouseup = null;
				};
			}
		};

		// north east
		gripElements[2].onmousedown = function(ev) {
			var oEvent = ev || event;
			if (oEvent.button === 0) {
				var disX = oEvent.clientX - gripElements[0].offsetLeft;
				var disY = oEvent.clientY - gripElements[0].offsetTop;
				document.onmousemove = function(ev) {
					that._viewport._viewportGestureHandler._gesture = false;
					var oEvent = ev || event;
					var deltaWidth = oEvent.clientX - disX;
					var deltaHeight = oEvent.clientY - disY;
					editableAnnotations.forEach(function(annotation) {
						annotation._moving = true;
						annotation._textWidth = currentSize.get(annotation.getAnnotationId()).width + deltaWidth + "px";
						annotation._textHeight = currentSize.get(annotation.getAnnotationId()).height - deltaHeight + "px";
						annotation._textDiv.setWidth(annotation._textWidth);
						annotation._textDiv.setHeight(annotation._textHeight);
						annotation._textDiv.getDomRef().style.width = annotation._textWidth;
						annotation._textDiv.getDomRef().style.height = annotation._textHeight;
						setTranslate(0, deltaHeight, annotation.getDomRef());
					});
				};
				document.onmouseup = function() {
					editableAnnotations.forEach(function(annotation) {
						annotation._handleViewportStop();
						var annotationRect = annotation.getDomRef().getBoundingClientRect();
						var annotationWidth = annotation.getWidth() ? annotation.getWidth() : annotationRect.width / viewportRect.width;
						var annotationHeight = annotation.getHeight() ? annotation.getHeight() : annotationRect.height / viewportRect.height;
						annotation.getAnnotationNode().scale.set(annotationWidth, annotationHeight, 1);
						annotation.fireSizeChanged({
							nodeRef: annotation.getAnnotationNode(),
							width: annotationWidth,
							height: annotationHeight
						});
					});
					document.onmousemove = null;
					document.onmouseup = null;
				};
			}
		};

		// east
		gripElements[3].onmousedown = function(ev) {
			var oEvent = ev || event;
			if (oEvent.button === 0) {
				var disX = oEvent.clientX - gripElements[0].offsetLeft;
				document.onmousemove = function(ev) {
					that._viewport._viewportGestureHandler._gesture = false;
					var oEvent = ev || event;
					var deltaWidth = oEvent.clientX - disX;
					editableAnnotations.forEach(function(annotation) {
						annotation._moving = true;
						annotation._textWidth = currentSize.get(annotation.getAnnotationId()).width + deltaWidth + "px";
						annotation._textDiv.setWidth(annotation._textWidth);
						annotation._textDiv.getDomRef().style.width = annotation._textWidth;
					});
				};
				document.onmouseup = function() {
					editableAnnotations.forEach(function(annotation) {
						annotation._handleViewportStop();
						var annotationRect = annotation.getDomRef().getBoundingClientRect();
						var annotationWidth = annotation.getWidth() ? annotation.getWidth() : annotationRect.width / viewportRect.width;
						var annotationHeight = annotation.getHeight() ? annotation.getHeight() : annotationRect.height / viewportRect.height;
						annotation.getAnnotationNode().scale.set(annotationWidth, annotationHeight, 1);
						annotation.fireSizeChanged({
							nodeRef: annotation.getAnnotationNode(),
							width: annotationWidth,
							height: annotationHeight
						});
					});
					document.onmousemove = null;
					document.onmouseup = null;
				};
			}
		};

		// south east
		gripElements[4].onmousedown = function(ev) {
			var oEvent = ev || event;
			if (oEvent.button === 0) {
				var disX = oEvent.clientX - gripElements[0].offsetLeft;
				var disY = oEvent.clientY - gripElements[0].offsetTop;
				document.onmousemove = function(ev) {
					that._viewport._viewportGestureHandler._gesture = false;
					var oEvent = ev || event;
					var deltaWidth = oEvent.clientX - disX;
					var deltaHeight = oEvent.clientY - disY;
					editableAnnotations.forEach(function(annotation) {
						annotation._moving = true;
						annotation._textWidth = currentSize.get(annotation.getAnnotationId()).width + deltaWidth + "px";
						annotation._textHeight = currentSize.get(annotation.getAnnotationId()).height + deltaHeight + "px";
						annotation._textDiv.setWidth(annotation._textWidth);
						annotation._textDiv.setHeight(annotation._textHeight);
						annotation._textDiv.getDomRef().style.width = annotation._textWidth;
						annotation._textDiv.getDomRef().style.height = annotation._textHeight;
					});
				};
				document.onmouseup = function() {
					editableAnnotations.forEach(function(annotation) {
						annotation._handleViewportStop();
						var annotationRect = annotation.getDomRef().getBoundingClientRect();
						var annotationWidth = annotation.getWidth() ? annotation.getWidth() : annotationRect.width / viewportRect.width;
						var annotationHeight = annotation.getHeight() ? annotation.getHeight() : annotationRect.height / viewportRect.height;
						annotation.getAnnotationNode().scale.set(annotationWidth, annotationHeight, 1);
						annotation.fireSizeChanged({
							nodeRef: annotation.getAnnotationNode(),
							width: annotationWidth,
							height: annotationHeight
						});
					});
					document.onmousemove = null;
					document.onmouseup = null;
				};
			}
		};

		// south
		gripElements[5].onmousedown = function(ev) {
			var oEvent = ev || event;
			if (oEvent.button === 0) {
				var disY = oEvent.clientY - gripElements[0].offsetTop;
				document.onmousemove = function(ev) {
					that._viewport._viewportGestureHandler._gesture = false;
					var oEvent = ev || event;
					var deltaHeight = oEvent.clientY - disY;
					editableAnnotations.forEach(function(annotation) {
						annotation._moving = true;
						annotation._textHeight = currentSize.get(annotation.getAnnotationId()).height + deltaHeight + "px";
						annotation._textDiv.setHeight(annotation._textHeight);
						annotation._textDiv.getDomRef().style.height = annotation._textHeight;
					});
				};
				document.onmouseup = function() {
					editableAnnotations.forEach(function(annotation) {
						annotation._handleViewportStop();
						var annotationRect = annotation.getDomRef().getBoundingClientRect();
						var annotationWidth = annotation.getWidth() ? annotation.getWidth() : annotationRect.width / viewportRect.width;
						var annotationHeight = annotation.getHeight() ? annotation.getHeight() : annotationRect.height / viewportRect.height;
						annotation.getAnnotationNode().scale.set(annotationWidth, annotationHeight, 1);
						annotation.fireSizeChanged({
							nodeRef: annotation.getAnnotationNode(),
							width: annotationWidth,
							height: annotationHeight
						});
					});
					document.onmousemove = null;
					document.onmouseup = null;
				};
			}
		};

		// south west
		gripElements[6].onmousedown = function(ev) {
			var oEvent = ev || event;
			if (oEvent.button === 0) {
				var disX = oEvent.clientX - gripElements[0].offsetLeft;
				var disY = oEvent.clientY - gripElements[0].offsetTop;
				document.onmousemove = function(ev) {
					that._viewport._viewportGestureHandler._gesture = false;
					var oEvent = ev || event;
					var deltaWidth = oEvent.clientX - disX;
					var deltaHeight = oEvent.clientY - disY;
					editableAnnotations.forEach(function(annotation) {
						annotation._moving = true;
						annotation._textWidth = currentSize.get(annotation.getAnnotationId()).width - deltaWidth + "px";
						annotation._textHeight = currentSize.get(annotation.getAnnotationId()).height + deltaHeight + "px";
						annotation._textDiv.setWidth(annotation._textWidth);
						annotation._textDiv.setHeight(annotation._textHeight);
						annotation._textDiv.getDomRef().style.width = annotation._textWidth;
						annotation._textDiv.getDomRef().style.height = annotation._textHeight;
						setTranslate(deltaWidth, 0, annotation.getDomRef());
					});
				};
				document.onmouseup = function() {
					editableAnnotations.forEach(function(annotation) {
						annotation._handleViewportStop();
						var annotationRect = annotation.getDomRef().getBoundingClientRect();
						var annotationWidth = annotation.getWidth() ? annotation.getWidth() : annotationRect.width / viewportRect.width;
						var annotationHeight = annotation.getHeight() ? annotation.getHeight() : annotationRect.height / viewportRect.height;
						annotation.getAnnotationNode().scale.set(annotationWidth, annotationHeight, 1);
						annotation.fireSizeChanged({
							nodeRef: annotation.getAnnotationNode(),
							width: annotationWidth,
							height: annotationHeight
						});
					});
					document.onmousemove = null;
					document.onmouseup = null;
				};
			}
		};

		// west
		gripElements[7].onmousedown = function(ev) {
			var oEvent = ev || event;
			if (oEvent.button === 0) {
				var disX = oEvent.clientX - gripElements[7].offsetLeft;
				document.onmousemove = function(ev) {
					that._viewport._viewportGestureHandler._gesture = false;
					var oEvent = ev || event;
					var deltaWidth = oEvent.clientX - disX;
					editableAnnotations.forEach(function(annotation) {
						annotation._moving = true;
						annotation._textWidth = currentSize.get(annotation.getAnnotationId()).width - deltaWidth + "px";
						annotation._textDiv.setWidth(annotation._textWidth);
						annotation._textDiv.getDomRef().style.width = annotation._textWidth;
						setTranslate(deltaWidth, 0, annotation.getDomRef());
					});
				};
				document.onmouseup = function() {
					editableAnnotations.forEach(function(annotation) {
						annotation._handleViewportStop();
						var annotationRect = annotation.getDomRef().getBoundingClientRect();
						var annotationWidth = annotation.getWidth() ? annotation.getWidth() : annotationRect.width / viewportRect.width;
						var annotationHeight = annotation.getHeight() ? annotation.getHeight() : annotationRect.height / viewportRect.height;
						annotation.getAnnotationNode().scale.set(annotationWidth, annotationHeight, 1);
						annotation.fireSizeChanged({
							nodeRef: annotation.getAnnotationNode(),
							width: annotationWidth,
							height: annotationHeight
						});
					});
					document.onmousemove = null;
					document.onmouseup = null;
				};
			}
		};
	};

	Annotation.prototype._update = function(viewport) {
		var that = this;
		this._viewport = viewport;
		if (this._shouldRenderVp) {
			viewport.invalidate();
			this._shouldRenderVp = false;
		}
		var annotation = this.getDomRef();
		if (annotation) {
			var annotationNodeElement = annotation.nextSibling;
			var annotationLeaderLine = annotationNodeElement.nextSibling;
			annotationNodeElement.style.visibility = this.getVisible() ? "visible" : "hidden";
			annotationLeaderLine.style.visibility = (!this._moving && this.getVisible()) ? "visible" : "hidden";
			var move = function() {
				that._handleViewportMove(that, event);
			};
			var touchMove = function() {
				/* eslint-disable no-use-before-define */
				that._handleViewportTouchMove(that, event, move, touchMove, that._viewport, stop);
				/* eslint-disable no-use-before-define */
			};
			var stop = function() {
				that._handleViewportStop(that, move, touchMove, that._viewport, stop);
			};
			if (this.getVisible()) {
				if (this.getWidth()) {
					this.setWidth(this.getWidth());
				}
				if (this.getHeight()) {
					this.setHeight(this.getHeight());
				}
				if (this.getIsStatic()) {
					annotation.style.setProperty("--animation-name", "annotationStatic");
				}
				this.setSelectedState(this.getSelected());
				var nodeScreen = this.getNodeRef() ? this._getNodeRefScreenCenter(viewport) : { x: 0, y: 0, depth: 0 };
				var viewportRect = viewport.getDomRef().getBoundingClientRect();
				var animationDelay =  this._getDelay();
				if (this.getEditable()) {
					this.setEditableState();
				}
				if (this.getPositionType() === AnnotationPositionType.Relative && this.getNodeRef()) {
					if (!this._isBlocked) {
						this._updateBlocked(viewport);
					}
					if (this.getStyle() !== AnnotationStyle.Fixed) {
						annotation.style.zIndex = this._getSortIndex(viewport);
						annotation.style.opacity = this._getOpacity();
						annotation.style.animationDelay = animationDelay + "s";
						annotation.style.transform = "perspective(1px) scale3d(" + annotation.style.opacity + ", " + annotation.style.opacity + ", " + annotation.style.opacity + ")";
					}
					annotationNodeElement.style.visibility = "hidden";
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
								this._position = nodeScreen.x < viewportRect.width / 2 ? leftStyle : rightStyle;
							}
							annotation.style.setProperty("--square-left", this._position.squareLeft);
							annotation.style.setProperty("--square-bottom", this._position.squareBottom);
							annotation.style.setProperty("--background-color", this.options ? this.options.backgroundColor : "#dddddd");
							annotation.style.setProperty("--div-width", this.options && this.options.width ? "calc(" + this.options.width + "px - 1rem)" : "auto");
							annotation.style.setProperty("--div-height", this.options && this.options.height ? "calc(" + this.options.height + "px - 1rem)" : "auto");
							annotation.style.transformOrigin = this._position.transformOrigin;
							annotation.style.left = "calc(" + nodeScreen.x + "px + " + this._position.leftMargin + ")";
							annotation.style.bottom = "calc(" + nodeScreen.y + "px + " + this._position.bottomMargin + ")";

							if (annotationElements[0] && this._position.connectSquare && annotationElements[2]) {
								this.setLeaderLine(annotationElements[0], this._position.connectSquare, annotationElements[2]);
							}
							if (this._prevText !== this.getTitle()) {
								this.setText(this.getTitle());
								this._prevText = this.getTitle();
							}
							break;
						case AnnotationStyle.Fixed:
							if (this.getProperty("xCoordinate") || this.getProperty("xCoordinate") === 0) {
								this.setXCoordinate(this.getProperty("xCoordinate"));
							}
							if (this.getProperty("yCoordinate") || this.getProperty("yCoordinate") === 0) {
								this.setYCoordinate(this.getProperty("yCoordinate"));
							}
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
				} else {
					annotationNodeElement.style.left = "calc(" + nodeScreen.x + "px)";
					annotationNodeElement.style.bottom = "calc(" + nodeScreen.y + "px)";
					switch (this.getStyle()) {
						case AnnotationStyle.Default:
							annotation.childNodes[0].style.visibility = "hidden";
							annotation.childNodes[1].style.visibility = "hidden";
							annotation.childNodes[2].style.visibility = "hidden";
							annotation.childNodes[3].style.visibility = "hidden";
							annotation.childNodes[4].style.visibility = "hidden";
							break;
						case AnnotationStyle.Explode:
							annotation.childNodes[0].style.visibility = "hidden";
							annotation.childNodes[1].style.visibility = "hidden";
							annotation.childNodes[2].style.visibility = "hidden";
							break;
						case AnnotationStyle.Square:
							annotation.childNodes[0].style.visibility = "hidden";
							annotation.childNodes[1].style.visibility = "hidden";
							annotation.childNodes[2].style.visibility = "hidden";
							break;
						case AnnotationStyle.Random:
							annotation.childNodes[0].style.visibility = "hidden";
							annotation.style.setProperty("--background-color", this.options ? this.options.backgroundColor : "#dddddd");
							annotation.style.setProperty("--div-width",  this.options && this.options.width ? "calc(" + this.options.width + "px - 1rem)" : "auto");
							annotation.style.setProperty("--div-height", this.options && this.options.height ? "calc(" + this.options.height + "px - 1rem)" : "auto");
							if (this.options) {
								var annotationNodeScreen = this._getNodeRefScreenCenter(viewport, this.options.annotationNode);
								if (this.options.width && this.options.height) {
									annotation.style.left = "calc(" + (annotationNodeScreen.x - this.options.width / 2) + "px)";
									annotation.style.bottom = "calc(" + (annotationNodeScreen.y - this.options.height / 2) + "px)";
								}
							}
							break;
						case AnnotationStyle.Editing:
							annotation.style.left = "calc(" + (this._previousState.x - viewportRect.x) + "px)";
							annotation.style.top = "calc(" + (this._previousState.y - viewportRect.y) + "px)";
							break;
						default:
							break;
					}
					if (this.getNodeRef()) {
						this.setLeaderLine(annotationNodeElement, annotation, annotationLeaderLine);
					} else {
						annotationNodeElement.style.visibility = "hidden";
					}
					if (this.getProperty("xCoordinate") || this.getProperty("xCoordinate") === 0) {
						this.setXCoordinate(this.getProperty("xCoordinate"));
					}
					if (this.getProperty("yCoordinate") || this.getProperty("yCoordinate") === 0) {
						this.setYCoordinate(this.getProperty("yCoordinate"));
					}
				}
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
			this.fireAnnotationMoving({
				annotationId: this.getAnnotationId()
			});
		}
		setTranslate(annotation._currentX, annotation._currentY, annotation.getDomRef());
	};

	Annotation.prototype._handleViewportMove = function(annotation, event) {
		if (annotation._moving) {
			annotation._currentX = event.clientX - annotation._initialX;
			annotation._currentY = event.clientY - annotation._initialY;
		}
		setTranslate(annotation._currentX, annotation._currentY, annotation.getDomRef());
	};

	Annotation.prototype._handleViewportStop = function(annotation, move, touchMove, viewport, stop) {
		this._moving = false;
		var domRef = this.getDomRef();
		var computedStyle = window.getComputedStyle(domRef);
		var transform = domRef.style.transform;
		domRef.style.transform = "";
		var x = parseFloat(transform.substring(transform.indexOf("(") + 1, transform.indexOf(",")));
		var y = parseFloat(transform.substring(transform.indexOf(",") + 1, transform.indexOf(")")));
		domRef.style.left = (parseFloat(computedStyle.left) + x) + "px";
		domRef.style.top = (parseFloat(computedStyle.top) + y) + "px";
		this._offsetTop = domRef.offsetTop;
		this._offsetLeft = domRef.offsetLeft;
		this.setXCoordinate(this.getXCoordinate());
		this.setYCoordinate(this.getYCoordinate());
		if (x || y) {
			this.getAnnotationNode().position.set(this.getXCoordinate(), this.getYCoordinate(), 0);
			this.firePositionChanged({
				nodeRef: this.getAnnotationNode(),
				x: this.getXCoordinate(),
				y: this.getYCoordinate()
			});
		}
		if (move && touchMove && viewport && stop) {
			viewport.detachBrowserEvent("touchmove", touchMove);
			viewport.detachBrowserEvent("mousemove", move);
			viewport.detachBrowserEvent("mouseup", stop);
		}
	};

	function setTranslate(x, y, annotation) {
		annotation.style.transform = "translate(" + x + "px, " + y + "px)";
	}

	Annotation.prototype.setLeaderLine = function(from, to, line) {
		var ot = (this.getEditable() && this._offsetTop) ? this._offsetTop : to.offsetTop;
		var ol = (this.getEditable() && this._offsetLeft) ? this._offsetLeft : to.offsetLeft;
		var fT = from.offsetTop + from.offsetHeight / 2;
		var tT = ot + to.offsetHeight / 2;
		var fL = from.offsetLeft + from.offsetWidth / 2;
		var tL = ol + to.offsetWidth / 2;
		var topSide = Math.abs(tT - fT);
		var leftSide = Math.abs(tL - fL);
		var height = Math.sqrt(topSide * topSide + leftSide * leftSide);
		var angle = 180 / Math.PI * Math.acos(topSide / height);
		var top, left;
		if (tT > fT) {
			top = (tT - fT) / 2 + fT;
		} else {
			top = (fT - tT) / 2 + tT;
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
	};

	/**
	 * Get transformation matrix from the node represent annotation
	 *
	 * @returns {number[]} The transformation matrix
	 *
	 * @public
	 */
	Annotation.prototype.getTransform = function() {
		var annotationNode = this.getAnnotationNode();
		annotationNode.updateMatrix();
		return sap.ui.vk.TransformationMatrix.convertTo4x3(annotationNode.matrix.elements);
	};

	Annotation.getStyles = function() {
		var styles = [
			{
				style: AnnotationStyle.Default,
				src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABACAYAAAGSM0KYAAAACXBIWXMAAAsTAAALEwEAmpwYAAALC2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAzLTI2VDExOjEwOjAyKzEzOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAzLTI2VDE0OjM1OjIzKzEzOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wMy0yNlQxNDozNToyMysxMzowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MmZhNTI3NDEtOGZkZi00NTM0LWE0N2UtMWRmZWMyOTc3NTliIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MDRkNjFiNzktZDUxMC01MDQwLThjNjYtYjk4ZWIyZWMxOWI0IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZWU1NTEwZjgtNmI2ZC00NDJhLTkwOTMtMzQ4NmNlNDA0ZDU0IiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmVlNTUxMGY4LTZiNmQtNDQyYS05MDkzLTM0ODZjZTQwNGQ1NCIgc3RFdnQ6d2hlbj0iMjAyMC0wMy0yNlQxMToxMDowMisxMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjEyYTg4Mjg4LWYzOWItNDU4My04M2FlLTk0NTExY2FjZGU5OCIgc3RFdnQ6d2hlbj0iMjAyMC0wMy0yNlQxNDoxNTozMisxMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjcyOWFhOWVjLTE0ZmItNDdiZS1hNTNhLTAyYzgyOWEyMjlhOCIgc3RFdnQ6d2hlbj0iMjAyMC0wMy0yNlQxNDozNToyMysxMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjJmYTUyNzQxLThmZGYtNDUzNC1hNDdlLTFkZmVjMjk3NzU5YiIgc3RFdnQ6d2hlbj0iMjAyMC0wMy0yNlQxNDozNToyMysxMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjcyOWFhOWVjLTE0ZmItNDdiZS1hNTNhLTAyYzgyOWEyMjlhOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDplZTU1MTBmOC02YjZkLTQ0MmEtOTA5My0zNDg2Y2U0MDRkNTQiIHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplZTU1MTBmOC02YjZkLTQ0MmEtOTA5My0zNDg2Y2U0MDRkNTQiLz4gPHBob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8cmRmOkJhZz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJURVhUIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJURVhUIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iVGV4dCIgcGhvdG9zaG9wOkxheWVyVGV4dD0iVGV4dCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9IlRleHQiIHBob3Rvc2hvcDpMYXllclRleHQ9IlRleHQiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJUZXh0IiBw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"
			}, {
				style: AnnotationStyle.Explode,
				src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABACAYAAAGSM0KYAAAACXBIWXMAAAsTAAALEwEAmpwYAAALC2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAzLTI2VDExOjEwOjAyKzEzOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAzLTI2VDE0OjM0OjQyKzEzOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wMy0yNlQxNDozNDo0MisxMzowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTkxNWVjMTctNGM5Mi00YzljLWE0MTUtMjA0NDFhMmQwNTFhIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZDNjNTE2ZDgtOTgxOC1hYzQwLWJiM2EtNmNiYjI5Nzg3NTcwIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZWU1NTEwZjgtNmI2ZC00NDJhLTkwOTMtMzQ4NmNlNDA0ZDU0IiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmVlNTUxMGY4LTZiNmQtNDQyYS05MDkzLTM0ODZjZTQwNGQ1NCIgc3RFdnQ6d2hlbj0iMjAyMC0wMy0yNlQxMToxMDowMisxMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjEyYTg4Mjg4LWYzOWItNDU4My04M2FlLTk0NTExY2FjZGU5OCIgc3RFdnQ6d2hlbj0iMjAyMC0wMy0yNlQxNDoxNTozMisxMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjYzNzdjM2ExLTQ0OGQtNDVmOC05YmRjLTdlZmZmZjMxM2Y5OCIgc3RFdnQ6d2hlbj0iMjAyMC0wMy0yNlQxNDozNDo0MisxMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjE5MTVlYzE3LTRjOTItNGM5Yy1hNDE1LTIwNDQxYTJkMDUxYSIgc3RFdnQ6d2hlbj0iMjAyMC0wMy0yNlQxNDozNDo0MisxMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjYzNzdjM2ExLTQ0OGQtNDVmOC05YmRjLTdlZmZmZjMxM2Y5OCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDplZTU1MTBmOC02YjZkLTQ0MmEtOTA5My0zNDg2Y2U0MDRkNTQiIHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplZTU1MTBmOC02YjZkLTQ0MmEtOTA5My0zNDg2Y2U0MDRkNTQiLz4gPHBob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8cmRmOkJhZz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJURVhUIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJURVhUIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iVGV4dCIgcGhvdG9zaG9wOkxheWVyVGV4dD0iVGV4dCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9IlRleHQiIHBob3Rvc2hvcDpMYXllclRleHQ9IlRleHQiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJUZXh0IiBw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"
			}, {
				style: AnnotationStyle.Square,
				src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABACAYAAAGSM0KYAAAACXBIWXMAAAsTAAALEwEAmpwYAAALC2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAzLTI2VDExOjEwOjAyKzEzOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAzLTI2VDE0OjM1OjA4KzEzOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wMy0yNlQxNDozNTowOCsxMzowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTk0ZjlmZWYtYzE5MS00Nzc3LWFhZjgtZDEyYTdkNjhmZWJiIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6YmUxMTFiMDktOWRjOC03YjQ4LTllYzQtMTBmNDYxNjllZTY5IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZWU1NTEwZjgtNmI2ZC00NDJhLTkwOTMtMzQ4NmNlNDA0ZDU0IiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmVlNTUxMGY4LTZiNmQtNDQyYS05MDkzLTM0ODZjZTQwNGQ1NCIgc3RFdnQ6d2hlbj0iMjAyMC0wMy0yNlQxMToxMDowMisxMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjEyYTg4Mjg4LWYzOWItNDU4My04M2FlLTk0NTExY2FjZGU5OCIgc3RFdnQ6d2hlbj0iMjAyMC0wMy0yNlQxNDoxNTozMisxMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmJlMjcwOTQwLWZlNjctNGQyMS04ZTI5LWE5MzIzMzM1YjliZCIgc3RFdnQ6d2hlbj0iMjAyMC0wMy0yNlQxNDozNTowOCsxMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjU5NGY5ZmVmLWMxOTEtNDc3Ny1hYWY4LWQxMmE3ZDY4ZmViYiIgc3RFdnQ6d2hlbj0iMjAyMC0wMy0yNlQxNDozNTowOCsxMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmJlMjcwOTQwLWZlNjctNGQyMS04ZTI5LWE5MzIzMzM1YjliZCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDplZTU1MTBmOC02YjZkLTQ0MmEtOTA5My0zNDg2Y2U0MDRkNTQiIHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplZTU1MTBmOC02YjZkLTQ0MmEtOTA5My0zNDg2Y2U0MDRkNTQiLz4gPHBob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8cmRmOkJhZz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJURVhUIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJURVhUIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iVGV4dCIgcGhvdG9zaG9wOkxheWVyVGV4dD0iVGV4dCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9IlRleHQiIHBob3Rvc2hvcDpMYXllclRleHQ9IlRleHQiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJUZXh0IiBw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"
			}, {
				style: AnnotationStyle.Random,
				src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABACAYAAAGSM0KYAAAACXBIWXMAAAsTAAALEwEAmpwYAAALC2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAzLTI2VDExOjEwOjAyKzEzOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAzLTI2VDE0OjM0OjU0KzEzOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wMy0yNlQxNDozNDo1NCsxMzowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OWZkYTc5MGItNmU4NC00ZWY1LWE0ZjEtODRlYWIwYjA1YmM4IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6OGFkNDQ1MGUtN2ZmNS1iZTQyLTlmNTAtOGE0ZDBlYTU4MmFlIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZWU1NTEwZjgtNmI2ZC00NDJhLTkwOTMtMzQ4NmNlNDA0ZDU0IiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmVlNTUxMGY4LTZiNmQtNDQyYS05MDkzLTM0ODZjZTQwNGQ1NCIgc3RFdnQ6d2hlbj0iMjAyMC0wMy0yNlQxMToxMDowMisxMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjEyYTg4Mjg4LWYzOWItNDU4My04M2FlLTk0NTExY2FjZGU5OCIgc3RFdnQ6d2hlbj0iMjAyMC0wMy0yNlQxNDoxNTozMisxMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmEwMDkzM2E5LTA4NzctNDRlYi04YThmLTZlZDYyZjA1ZDhlZCIgc3RFdnQ6d2hlbj0iMjAyMC0wMy0yNlQxNDozNDo1NCsxMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjlmZGE3OTBiLTZlODQtNGVmNS1hNGYxLTg0ZWFiMGIwNWJjOCIgc3RFdnQ6d2hlbj0iMjAyMC0wMy0yNlQxNDozNDo1NCsxMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmEwMDkzM2E5LTA4NzctNDRlYi04YThmLTZlZDYyZjA1ZDhlZCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDplZTU1MTBmOC02YjZkLTQ0MmEtOTA5My0zNDg2Y2U0MDRkNTQiIHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplZTU1MTBmOC02YjZkLTQ0MmEtOTA5My0zNDg2Y2U0MDRkNTQiLz4gPHBob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8cmRmOkJhZz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJURVhUIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJURVhUIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iVGV4dCIgcGhvdG9zaG9wOkxheWVyVGV4dD0iVGV4dCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9IlRleHQiIHBob3Rvc2hvcDpMYXllclRleHQ9IlRleHQiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJUZXh0IiBw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"
			}
		];
		return styles;
	};

	Annotation.createAnnotation = function(divAnnotation) {
		var text = "";
		if (divAnnotation.annotation.type && divAnnotation.annotation.text) {
			text = divAnnotation.annotation.text.text ? divAnnotation.annotation.text.text : divAnnotation.annotation.text.html;
		} else {
			text = divAnnotation.annotation.text;
		}
		var link = divAnnotation.annotation.link ? "<span><a href=" + divAnnotation.annotation.link + ">" + divAnnotation.annotation.link + "</a></span>" : "";
		var annotation = new Annotation({
			annotationId: divAnnotation.annotation.nodeId + "",
			annotationName: divAnnotation.node.name,
			annotationType: divAnnotation.annotation.type,
			nodeRef: divAnnotation.targetNode,
			title: text + "<br>" + link,
			style: AnnotationStyle.Random
		});
		annotation.options = {
			backgroundColor: getBackgroundColor(divAnnotation.annotation),
			annotationNode: divAnnotation.node,
			width: divAnnotation.annotation.width,
			height: divAnnotation.annotation.height
		};
		annotation._viewIds = divAnnotation.viewIds;
		annotation.sourceData = divAnnotation;
		return annotation;
	};

	Annotation.createAnnotationNode = function(annotation, scene, options) {
		// create node
		var nodeHierarchy = scene.getDefaultNodeHierarchy();
		var node = annotation.getNodeRef();
		var name = annotation.getAnnotationName()
				? annotation.getAnnotationName()
				: "2D Text " + (node ? node.parent.name : "");
		var annotationNode = nodeHierarchy.createNode(options.parent, name, null, NodeContentType.Annotation);
		scene.setNodePersistentId(annotationNode, annotation.getAnnotationId());
		annotationNode.userData.nodeId = annotation.getAnnotationId();

		if (annotation.getXCoordinate() && annotation.getYCoordinate()) {
			annotationNode.position.set(annotation.getXCoordinate(), annotation.getYCoordinate(), 0);
		}

		if (options.viewport) {
			var viewportRect = options.viewport.getDomRef().getBoundingClientRect();
			// initial textbox width 100px, height 40px
			annotationNode.scale.set(100 / viewportRect.width, 40 / viewportRect.height, 1);
		}

		scene.getViews().forEach(function(view) {
			var nodeInfos = view.getNodeInfos();
			var newNode = {
				target: annotationNode,
				visible: view.id === options.viewid
			};
			nodeInfos.push(newNode);
			view.setNodeInfos(nodeInfos);
		});
		return annotationNode;
	};

	Annotation.removeAnnotationNode = function(annotationId, scene) {
		var nodeHierarchy = scene.getDefaultNodeHierarchy();
		var annotations = scene.getAnnotations();
		var annotation = annotations.get(annotationId);
		if (annotation) {
			var node = annotation.getAnnotationNode();
			annotation.setVisible(false);
			annotation.destroy();
			annotations.delete(annotationId);
			nodeHierarchy.removeNode(node);
			return node;
		}
	};

	function getBackgroundColor(annotation) {
		var color = "#dddddd";
		if (annotation.backgroundColor) {
			color = cssColor(annotation.backgroundColor);
		} else if (annotation.backgroundColour || (annotation.label && annotation.label.colour)) {
			var colorArray = annotation.backgroundColour || annotation.label.colour;
			color = "rgba(" + colorArray[0] * 255
					+ ", " + colorArray[1] * 255
					+ ", " + colorArray[2] * 255
					+ ", " + colorArray[3]
					+ ")";
		}
		return color;
	}

	function cssColor(color) {
		var hexColor = color.toString(16);
		if (color.length >= 3){
			hexColor = (((color[0] * 255) << 16) | ((color[1] * 255) << 8) | (color[2] * 255)).toString(16);
		}
		return "#" + "000000".substring(hexColor.length) + hexColor;
	}

	return Annotation;
});
