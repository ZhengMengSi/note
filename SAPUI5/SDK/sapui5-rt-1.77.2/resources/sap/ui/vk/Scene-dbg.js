/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides the Scene class.
sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/base/util/uid",
	"./AnimationSequence",
	"./AnimationTrack",
	"./ViewGroup",
	"./View",
	"./Highlight",
	"./Annotation"
], function(
	ManagedObject,
	uid,
	AnimationSequence,
	AnimationTrack,
	ViewGroup,
	View,
	Highlight,
	Annotation
) {
	"use strict";

	/**
	 * Constructor for a new Scene.
	 *
	 * The objects of this class should not be created directly.
	 * They should be created via {@link sap.ui.vk.ContentConnector sap.ui.vk.ContentConnector}.
	 *
	 * @class Provides the interface for the 3D model.
	 *
	 * The objects of this class should not be created directly.
	 * They should be created via {@link sap.ui.vk.ContentConnector sap.ui.vk.ContentConnector}.
	 *
	 * @public
	 * @abstract
	 * @author SAP SE
	 * @version 1.77.0
	 * @extends sap.ui.base.ManagedObject
	 * @alias sap.ui.vk.Scene
	 */
	var Scene = ManagedObject.extend("sap.ui.vk.Scene", /** @lends sap.ui.vk.Scene.prototype */ {
		metadata: {
			"abstract": true,
			properties: {
				/**
				 * Enables or disables double-sided materials
				 */
				doubleSided: {
					type: "boolean",
					defaultValue: false
				},

				autoPlayAnimation: {
					type: "boolean",
					defaultValue: true

				},
				autoAdvanceView: {
					type: "boolean",
					defaultValue: false
				},
				autoAdvanceViewTimeout: {
					type: "int",
					defaultValue: 5000
				},
				enableDivAnnotations: {
					type: "boolean",
					defaultValue: false
				}
			},
			associations: {
				animationPlayer: {
					type: "sap.ui.vk.AnimationPlayer",
					multiple: false
				}
			},
			events: {
				annotationsLoaded: {
				},
				annotationAdded: {
					parameters: {
						nodeRef: {
							type: "object"
						},
						annotationId: {
							type: "string"
						}
					}
				},
				annotationUpdated: {
					parameters: {
						nodeRef: {
							type: "object"
						},
						annotationId: {
							type: "string"
						}
					}
				},
				annotationRemoved: {
					parameters: {
						nodeRef: {
							type: "object"
						},
						annotationId: {
							type: "string"
						}
					}
				},
				allAnnotationsRemoved: {
				}
			}
		}
	});

	/**
	 * Gets the unique ID of the Scene object.
	 *
	 * @function
	 * @name sap.ui.vk.Scene#getId
	 *
	 * @returns {string} The unique ID of the Scene object.
	 * @public
	 */

	/**
	 * Gets the default node hierarchy in the Scene object.
	 *
	 * @function
	 * @name sap.ui.vk.Scene#getDefaultNodeHierarchy
	 *
	 * @returns {sap.ui.vk.NodeHierarchy} The default node hierarchy in the Scene object.
	 * @public
	 */

	/**
	 * Gets the scene reference that this Scene object wraps.
	 *
	 * @function
	 * @name sap.ui.vk.Scene#getSceneRef
	 *
	 * @returns {any} The scene reference that this Scene object wraps.
	 * @public
	 */

	 /**
	 * Get initial view
	 *
	 * @function
	 * @name sap.ui.vk.Scene#getInitialView
	 *
	 * @returns {sap.ui.vk.View} initial view
	 * @public
	 */
	Scene.prototype.getInitialView = function() {
		return null;
	};

	/**
	 * Set initial view
	 *
	 * @function
	 * @name sap.ui.vk.Scene#setInitialView
	 *
	 * @param {sap.ui.vk.View} view intial view
	 *
	 * @public
	 */

	 /**
	 * Get material
	 *
	 * @function
	 * @name sap.ui.vk.Scene#getMaterial
	 *
	 * @param {string} materialId material id
	 *
	 * @return {sap.ui.vk.Material} material
	 *
	 * @private
	 */

	/**
	 * Set material
	 *
	 * @function
	 * @name sap.ui.vk.Scene#setMaterial
	 *
	 * @param {string} materialId material id
	 * @param {sap.ui.vk.Material} material to be stored
	 *
	 * @private
	 */

	 /**
	 * Clear materials
	 *
	 * @function
	 * @name sap.ui.vk.Scene#clearMaterials
	 *
	 * @private
	 */

	///////////////////////////////////////////////////////////////////////
	//
	// Sequences
	//
	///////////////////////////////////////////////////////////////////////

	/**
	 * Creates an animation sequence.
	 * @param {string} sId persistent sequence ID
	 * @param {any} parameters sequence creation parameters
	 * @param {string} parameters.name sequence name
	 * @param {float} parameters.duration sequence duration
	 *
	 * @returns {sap.ui.vk.AnimationSequence} created sequence
	 *
	 * @public
	 */
	Scene.prototype.createSequence = function(sId, parameters) {
		var sequence = new AnimationSequence(sId, parameters);
		this.addSequence(sequence);

		return sequence;
	};

	/**
	 * Gets a list of sequences
	 * @returns {sap.ui.vk.AnimationSequence[]} list of sequences
	 *
	 * @public
	 */
	Scene.prototype.getSequences = function() {
		if (!this._sequences) {
			this._sequences = [];
		}

		return this._sequences;
	};

	/**
	 * Finds sequence by ID
	 * @param {string} sequenceId sequence ID
	 * @returns {sap.ui.vk.AnimationSequence} sequence with given Id or undefined
	 *
	 * @public
	 */
	Scene.prototype.findSequence = function(sequenceId) {
		if (!this._sequences) {
			return undefined;
		}

		return this._sequences.find(function(sequence) {
			return sequence.getId() === sequenceId;
		});
	};

	/**
	 * Add a sequence to the scene
	 * @param {sap.ui.vk.AnimationSequence} sequence sequence to add
	 * @returns {sap.ui.vk.Scene} <code>this</code> to allow method chaining.
	 *
	 * @public
	 */
	Scene.prototype.addSequence = function(sequence) {
		if (!this._sequences) {
			this._sequences = [];
		}

		this._sequences.push(sequence);

		return this;
	};

	/**
	 * Inserts a sequence
	 * @param {sap.ui.vk.AnimationSequence} sequence sequence to insert
	 * @param {int} index index where to insert the sequence
	 * @returns {sap.ui.vk.Scene} <code>this</code> to allow method chaining.
	 *
	 * @public
	 */
	Scene.prototype.insertSequence = function(sequence, index) {
		if (!this._sequences) {
			this._sequences = [];
		}

		if (index < 0) {
			index = 0;
		} else if (index !== 0 && index >= this._sequences.length) {
			index = this._sequences.length;
		}

		this._sequences.splice(index, 0, sequence);

		return this;
	};

	/**
	 * Gets index of a sequence in the scene
	 * @param {sap.ui.vk.AnimationSequence} sequence sequence to locate
	 * @returns {int} sequence index of found or -1 otherwise
	 *
	 * @public
	 */
	Scene.prototype.indexOfSequence = function(sequence) {
		if (!this._sequences) {
			return -1;
		}

		return this._sequences.find(function(item) {
			return item == sequence;
		});
	};

	/**
	 * Removes a sequence from the scene
	 * @param {sap.ui.vk.AnimationSequence} sequence sequence to remove
	 * @returns {sap.ui.vk.Scene} <code>this</code> to allow method chaining.
	 *
	 * @public
	 */
	Scene.prototype.removeSequence = function(sequence) {
		if (this._sequences) {
			var index = this.indexOfSequence(sequence);
			if (index >= 0) {
				this._sequences.splice(index, 1);
			}
		}

		return this;
	};

	/**
	 * Removes all sequences from the scene
	 * @returns {sap.ui.vk.Scene} <code>this</code> to allow method chaining.
	 *
	 * @public
	 */
	Scene.prototype.removeSequences = function() {
		if (this._sequences) {
			this._sequences.splice(0);
		}

		return this;
	};

	///////////////////////////////////////////////////////////////////////
	//
	// Animation tracks
	//
	///////////////////////////////////////////////////////////////////////

	/**
	 * Creates an animation track.
	 * @param {string} sId persistent track ID
	 * @param {any} parameters track creation parameters
	 * @param {sap.ui.vk.TrackValueType} parameters.trackValueType track's value type
	 *
	 * @returns {sap.ui.vk.AnimationTrack} created track
	 *
	 * @public
	 */
	Scene.prototype.createTrack = function(sId, parameters) {
		var track = new AnimationTrack(sId, parameters);
		this.addTrack(track);

		return track;
	};

	/**
	 * Gets a list of animation tracks
	 * @returns {sap.ui.vk.AnimationTrack[]} list of animation tracks
	 *
	 * @public
	 */
	Scene.prototype.getTracks = function() {
		if (!this._tracks) {
			this._tracks = [];
		}

		return this._tracks;
	};

	/**
	 * Finds track by ID
	 * @param {string} trackId track ID
	 * @returns {sap.ui.vk.AnimationTrack} track with given Id or undefined
	 *
	 * @public
	 */
	Scene.prototype.findTrack = function(trackId) {
		if (!this._tracks) {
			return undefined;
		}

		return this._tracks.find(function(track) {
			return track.getId() === trackId;
		});
	};

	/**
	 * Add an animation track to the scene
	 * @param {sap.ui.vk.AnimationTrack} track animation track to add
	 * @returns {sap.ui.vk.Scene} <code>this</code> to allow method chaining.
	 *
	 * @public
	 */
	Scene.prototype.addTrack = function(track) {
		if (!this._tracks) {
			this._tracks = [];
		}

		this._tracks.push(track);

		return this;
	};

	/**
	 * Inserts an animation track
	 * @param {sap.ui.vk.AnimationTrack} track animation track to insert
	 * @param {int} index index where to insert the animation track
	 * @returns {sap.ui.vk.Scene} <code>this</code> to allow method chaining.
	 *
	 * @public
	 */
	Scene.prototype.insertTrack = function(track, index) {
		if (!this._tracks) {
			this._tracks = [];
		}

		if (index < 0) {
			index = 0;
		} else if (index !== 0 && index >= this._tracks.length) {
			index = this._tracks.length;
		}

		this._tracks.splice(index, 0, track);

		return this;
	};

	/**
	 * Gets index of an animation track in the scene
	 * @param {sap.ui.vk.AnimationTrack} track animation track to locate
	 * @returns {int} sequence index of found or -1 otherwise
	 *
	 * @public
	 */
	Scene.prototype.indexOfTrack = function(track) {
		if (!this._tracks) {
			return -1;
		}

		return this._tracks.findIndex(function(item) {
			return item == track;
		});
	};

	/**
	 * Removes an animation track from the scene
	 * @param {sap.ui.vk.AnimationTrack} track animation track to remove
	 * @returns {sap.ui.vk.Scene} <code>this</code> to allow method chaining.
	 *
	 * @public
	 */
	Scene.prototype.removeTrack = function(track) {
		if (this._tracks) {
			var index = this.indexOfTrack(track);
			if (index >= 0) {
				this._tracks.splice(index, 1);
			}
		}

		return this;
	};

	/**
	 * Removes all animation tracks from the scene
	 * @returns {sap.ui.vk.Scene} <code>this</code> to allow method chaining.
	 *
	 * @public
	 */
	Scene.prototype.removeTracks = function() {
		if (this._tracks) {
			this._tracks.splice(0);
		}

		return this;
	};

	////////////////////////////////////////////////////////////////
	//
	// View Groups
	//
	////////////////////////////////////////////////////////////////

	/**
	 * Provides an array of all ViewGroups
	 * @returns {sap.ui.vk.ViewGroup[]} List of ViewGroups
	 *
	 * @public
	 */
	Scene.prototype.getViewGroups = function() {
		if (!this._viewGroups) {
			this._viewGroups = [];
		}
		return this._viewGroups;
	};

	Scene.prototype.createViewGroup = function(parameters) {
		if (!this._viewGroups) {
			this._viewGroups = [];
		}

		var viewGroup = new ViewGroup(parameters);

		this._viewGroups.push(viewGroup);
		return viewGroup;
	};

	Scene.prototype.indexOfViewGroup = function(viewGroup) {
		if (!this._viewGroups) {
			return -1;
		}

		return this._viewGroups.find(function(item) {
			return item == viewGroup;
		});
	};

	Scene.prototype.insertViewGroup = function(viewGroup, index) {
		if (!this._viewGroups) {
			this._viewGroups = [];
		}

		if (index < 0) {
			index = 0;
		} else if (index !== 0 && index >= this._viewGroups.length) {
			index = this._viewGroups.length;
		}

		this._viewGroups.splice(index, 0, viewGroup);

		return this;

	};

	Scene.prototype.removeViewGroup = function(viewGroup) {
		var index = this.indexOfViewGroup(viewGroup);
		if (index >= 0) {
			this._viewGroups.splice(index, 1);
		}
		return this;
	};

	Scene.prototype.removeViewGroups = function() {
		this._viewGroups.splice(0);
		return this;
	};

	Scene.prototype.findViewGroupByView = function(view) {
		var result;

		if (this._viewGroups) {
			for (var idx = 0; idx < this._viewGroups.length; idx++) {
				if (this._viewGroups[idx].indexOfView(view) >= 0) {
					result = this._viewGroups[idx];
					break;
				}
			}
		}

		return result;
	};

	////////////////////////////////////////////////////////////////
	//
	// Views
	//
	////////////////////////////////////////////////////////////////

	/**
	 * Provides an array of all views
	 * @returns {sap.ui.vk.View[]} List of Views
	 *
	 * @public
	 */
	Scene.prototype.getViews = function() {
		if (!this._views) {
			this._views = [];
		}

		return this._views;
	};

	Scene.prototype.createView = function(parameters) {
		if (!this._views) {
			this._views = [];
		}

		var view = new View(parameters);
		this._views.push(view);
		return view;
	};

	Scene.prototype.removeView = function(view) {
		if (!this._views) {
			return this;
		}

		var viewGroups = this.getViewGroups();
		if (Array.isArray(viewGroups)) {
			viewGroups.forEach(function(viewGroup) {
				viewGroup.removeView(view);
			});
		}

		var index = this._views.indexOf(view);
		if (index >= 0) {
			this._views.splice(index, 1);
		}

		return this;
	};

	/**
	 * Creates a highlight.
	 * @param {string} sId persistent highlight ID
	 * @param {any} parameters highlight creation parameters
	 * @param {string} parameters.name highlight name
	 * @param {float} parameters.duration higlight duration - 0 means static highlight
	 * @param {int} parameters.cycles higlight cycles - 0 with duration > o means infinite highlight
	 * @param {float[]} [parameters.opacities] higlight opacities - optional, can be empty
	 * @param {array[]} [parameters.colours] higlight colours - optional, can be empty, in form of [[r1, g1, b1, a1], [r2, g2, b2, a2], ...]
	 *
	 * @returns {sap.ui.vk.Highlight} created highlight
	 *
	 * @public
	 */
	Scene.prototype.createHighlight = function(sId, parameters) {
		var highlight = new Highlight(sId, parameters);

		if (!this._highlights) {
			this._highlights = new Map();
		}

		this._highlights.set(sId, highlight);

		return highlight;
	};

	/**
	 * get highlight according to ID
	 * @param {string} sId persistent highlight ID
	 *
	 * @returns {sap.ui.vk.Highlight} highlight
	 *
	 * @public
	 */
	Scene.prototype.getHighlight = function(sId) {
		var highlight;

		if (this._highlights) {
			highlight = this._highlights.get(sId);
		}

		return highlight;
	};

	/**
	 * remove highlight according to ID
	 * @param {string} sId persistent highlight ID
	 *
	 * @returns {sap.ui.vk.Scene} <code>this</code> to allow method chaining.
	 *
	 * @public
	 */
	Scene.prototype.removeHighlight = function(sId) {

		if (this._highlights) {
			this._highlights.delete(sId);
		}

		return this;
	};

	////////////////////////////////////////////////////////////////
	//
	// Annotations
	//
	////////////////////////////////////////////////////////////////

	/**
	 * Enable HTML annotations on scene
	 * @param {boolean} enableAnnotations if true, enable HTML annotations on scene
	 *
	 * @returns {sap.ui.vk.Scene} <code>this</code> to allow method chaining.
	 *
	 * @private
	 */
	Scene.prototype.setEnableDivAnnotations = function(enableAnnotations) {
		this.setProperty("enableDivAnnotations", enableAnnotations);
		if (this.loaders) {
			this.loaders.forEach(function(loader) {
				if (enableAnnotations) {
					loader.attachSceneCompleted(this.createAnnotations, this);
				} else {
					loader.detachSceneCompleted(this.createAnnotations, this);
				}
			}, this);
		}
		return this;
	};

	Scene.prototype.addAnnotation = function(annotation, viewid) {
		if (!this._annotations) {
			this._annotations = new Map();
		}
		this._annotations.forEach(function(annotation) {
			annotation.setProperty("isStatic", true);
		});
		var annotationId = annotation.getAnnotationId();
		if (!this._annotations.has(annotationId)) {
			this._annotations.set(annotationId, annotation);
		}
		if (viewid) {
			annotation.setSceneView(this, viewid);
		}
		if (!annotation._viewIds) {
			annotation._viewIds = new Map([ [ null, true ] ]);
		}
		annotation._shouldRenderVp = true;
		return annotation;
	};

	Scene.prototype.getAnnotationStyles = function() {
		return Annotation.getStyles();
	};

	/**
	 * Create new annotation on scene
	 * @param {object} options An object options for annotation constructing
	 *
	 * @returns {sap.ui.vk.Annotation} <code>annotation</code> The new created annotation.
	 *
	 * @private
	 */
	Scene.prototype.createNewAnnotation = function(options) {
		var annotation = new Annotation({
			nodeRef: options.nodeRef,
			title: options.title,
			style: options.style,
			visible: options.visible ? options.visible : true,
			annotationId: uid(),
			annotationName: options.name,
			annotationType: options.type,
			xCoordinate: options.x,
			yCoordinate: options.y,
			isStatic: options.isStatic,
			positionType: options.nodeRef && options.x !== undefined && options.y !== undefined
						? sap.ui.vk.AnnotationPositionType.Fixed
						: sap.ui.vk.AnnotationPositionType.Relative
		});

		this.addAnnotation(annotation, options.viewid);
		annotation.sourceData = {
			node: Annotation.createAnnotationNode(annotation, this, options)
		};
		annotation._sceneRef = this;
		this.fireAnnotationAdded({
			nodeRef: annotation.sourceData.node,
			annotationId: annotation.getAnnotationId()
		});
		return annotation;
	};

	Scene.prototype._updateAnnotationId = function(oldId, newId) {
		var annotation = this.getAnnotation(oldId);
		if (annotation) {
			annotation.setAnnotationId(newId, this);
			this._annotations.delete(oldId);
			this._annotations.set(newId, annotation);
		}
		return this;
	};

	/**
	 * Update annotation on scene
	 * @param {object} options An object options for annotation updating
	 *
	 * @returns {sap.ui.vk.Scene} <code>this</code> to allow method chaining.
	 *
	 * @private
	 */
	Scene.prototype.updateAnnotation = function(options) {
		var annotation = this.getAnnotation(options.annotationId);
		if (!options.annotationId || !annotation) {
			return this;
		}

		if (options.newAnnotationId && options.newAnnotationId !== options.annotationId) {
			this._updateAnnotationId(options.annotationId, options.newAnnotationId);
		}
		if (options.name && options.name !== annotation.getAnnotationName()) {
			annotation.setProperty("annotationName", options.name);
		}
		if (options.type && options.type !== annotation.getAnnotationType()) {
			annotation.setProperty("annotationType", options.type);
		}
		if (options.title && options.title !== annotation.getTitle()) {
			annotation.setProperty("title", options.title);
		}
		if (options.style && options.style !== annotation.getStyle()) {
			annotation.setProperty("style", options.style);
		}
		if (options.nodeRef && options.nodeRef !== annotation.getNodeRef()) {
			annotation.setProperty("nodeRef", options.nodeRef);
		}
		annotation._shouldRenderVp = true;
		this.fireAnnotationUpdated({
			nodeRef: annotation.sourceData.node,
			annotationId: options.annotationId
		});
		return this;
	};

	Scene.prototype.createAnnotations = function() {
		this.annotations.forEach(function(annotation) {
			annotation.viewIds = this.annotationViews.get(annotation.annotation.id)
								? this.annotationViews.get(annotation.annotation.id).viewIds
								: new Map([ [ null, true ] ]);
			var oAnnotation = Annotation.createAnnotation(annotation);
			oAnnotation._sceneRef = this;
			this.addAnnotation(oAnnotation);
		}, this);
		this.fireAnnotationsLoaded();
		return this._annotations;
	};

	/**
	 * If in editmode:
	 * - Set all selected annotations on scene be editable
	 * - Set all unselected annotations on scene be not editable
	 * If not in editmode:
	 * - Set all annotations on scene be not editable
	 * @param {boolean} editmode A boolean indicating if scene is in edit mode
	 * @returns {sap.ui.vk.Scene} <code>this</code> to allow method chaining.
	 * @private
	 */
	Scene.prototype.setAllAnnotationsEditable = function(editmode) {
		if (editmode) {
			this.getAnnotations().forEach(function(annotation) {
				annotation.setEditable(false);
			});
			this.getSelectedAnnotations().forEach(function(annotation) {
				annotation.setEditable(true);
			});
		} else {
			this.getAnnotations().forEach(function(annotation) {
				annotation.setEditable(false);
			});
		}
		return this;
	};

	/**
	 * Retrieve an array of all Annotations in Scene
	 *
	 * @returns {Map} Map of all annotations in Scene
	 *
	 * @private
	 */
	Scene.prototype.getAnnotations = function() {
		if (!this._annotations) {
			this._annotations = new Map();
		}

		return this._annotations;
	};
	/**
	 * Retrieve an annotation of a node in Scene
	 *
	 * @param {object} node The node represent annotation in scene tree
	 *
	 * @returns {sap.ui.vk.Annotation} <code>annotation</code> The annotation for the node.
	 *
	 * @private
	 */
	Scene.prototype.getNodeAnnotation = function(node) {
		if (!node.userData.nodeId) {
			return null;
		}
		return this.getAnnotations().get(node.userData.nodeId);
	};

	Scene.prototype.getSelectedAnnotations = function() {
		var selectedAnnotations = new Map();
		if (this._annotations) {
			this._annotations.forEach(function(annotation, id) {
				if (annotation.getSelected()) {
					selectedAnnotations.set(id, annotation);
				}
			});
		}
		return selectedAnnotations;
	};

	Scene.prototype.getEditableAnnotations = function() {
		var editableAnnotations = new Map();
		if (this._annotations) {
			this._annotations.forEach(function(annotation, id) {
				if (annotation.getEditable()) {
					editableAnnotations.set(id, annotation);
				}
			});
		}
		return editableAnnotations;
	};

	Scene.prototype.getAnnotationsByViewId = function(viewId) {
		var annotationsByViewId = new Map();
		if (this._annotations) {
			this._annotations.forEach(function(annotation, id) {
				if (annotation._viewIds.get(viewId)) {
					annotationsByViewId.set(id, annotation);
				}
			});
		}
		return annotationsByViewId;
	};

	Scene.prototype.getAnnotation = function(id) {
		if (!this._annotations) {
			this._annotations = new Map();
		}
		return this._annotations.get(id);
	};

	Scene.prototype.getAnnotationsByNodeId = function(targetNodeId) {
		var annotations = [];
		this.getAnnotations().forEach(function(atn) {
			if (atn.getNodeRef()
				&& (atn.getNodeRef().userData.nodeId === targetNodeId
				|| atn.getNodeRef().parent.userData.nodeId === targetNodeId)) {
				annotations.push(atn);
			}
		});
		return annotations;
	};

	/**
	 * Remove all Annotations from Scene
	 *
	 * @returns {sap.ui.vk.Scene} <code>this</code> to allow method chaining.
	 *
	 * @private
	 */
	Scene.prototype.removeAllAnnotations = function() {
		if (this._annotations) {
			var annotationIds = this._annotations.keys();
			var annotationId = annotationIds.next().value;
			while (annotationId) {
				this.removeAnnotation(annotationId);
				annotationId = annotationIds.next().value;
			}
			this._annotations.clear();
		}
		this.fireAllAnnotationsRemoved();
		return this;
	};

	/**
	 * Remove a specific Annotation from Scene
	 * @param {string} annotationId annotationId you wish to remove
	 *
	 * @returns {sap.ui.vk.Scene} <code>this</code> to allow method chaining.
	 *
	 * @private
	 */
	Scene.prototype.removeAnnotation = function(annotationId) {
		var node = Annotation.removeAnnotationNode(annotationId, this);
		this.fireAnnotationRemoved({
			nodeRef: node,
			annotationId: annotationId
		});
		return this;
	};

	Scene.prototype.updateNodeAnnotations = function(nodeRefs, titles, styles, viewid, vp) {
		nodeRefs.forEach(function(nodeRef, i) {
			var node;
			if (nodeRef.children.length === 0) {
				node = nodeRef;
			} else {
				node = nodeRef.children.filter(function(n) { return n.type === "Mesh"; })[0];
			}
			var nodeId = node.userData.nodeId || node.parent.userData.nodeId;
			var matchNodes = this.getAnnotationsByNodeId(nodeId);
			if (matchNodes.length === 0) {
				var title = titles && titles[i] ? titles[i] : "<cite style='color:red;'>" + nodeRef.name + "</cite>";
				this.createNewAnnotation({
					nodeRef: node,
					title: title,
					visible: true,
					viewid: viewid,
					style: styles[i],
					viewport: vp
				});
			}
		}.bind(this));
	};

	Scene.prototype.updateSceneAnnotation = function(annotationId, annotationText, annotationStyle, annotationPositionType) {
		var annotation = this.getAnnotation(annotationId);
		if (annotation) {
			if (annotationPositionType && annotationPositionType !== annotation.getPositionType()) {
				annotation.setProperty("positionType", annotationPositionType);
			}
			if (annotationText === annotation.getTitle()
				&& (!annotationStyle || annotationStyle === annotation.getStyle())) {
				return;
			}
			if (annotationText && annotationText !== annotation.getTitle()) {
				annotation.setProperty("title", annotationText);
			}
			if (annotationStyle && annotationStyle !== annotation.getStyle()) {
				annotation.setProperty("style", annotationText);
			}
		}
	};

	Scene.prototype.checkBlockedAnnotations = function() {
		if (!this._annotations) {
			return this;
		}
		this._annotations.forEach(function(annotation) {
			annotation.setBlocked(false);
		});
		return this;
	};

	/**
	 * Hides all Annotations in Scene
	 *
	 * @returns {sap.ui.vk.Scene} <code>this</code> to allow method chaining.
	 *
	 * @private
	 */
	Scene.prototype.hideAllAnnotations = function() {
		if (!this._annotations) {
			return this;
		}

		this._annotations.forEach(function(annotation) {
			annotation.setVisible(false);
		});

		return this;
	};

	Scene.prototype.hideAnnotation = function(annotationId) {
		if (this._annotations.has(annotationId)) {
			this._annotations.get(annotationId).setVisible(false);
		}
		return this;
	};

	/**
	 * Shows all Annotations in Scene
	 *
	 * @returns {sap.ui.vk.Scene} <code>this</code> to allow method chaining.
	 *
	 * @private
	 */
	Scene.prototype.showAllAnnotations = function() {
		if (!this._annotations) {
			return this;
		}

		this._annotations.forEach(function(annotation) {
			annotation.setVisible(true);
		});

		return this;
	};

	return Scene;
});
