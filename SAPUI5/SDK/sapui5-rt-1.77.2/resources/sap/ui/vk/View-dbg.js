/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/ui/model/json/JSONModel",
	"./findIndexInArray",
	"./AnimationPlayback"
], function(
	ManagedObject,
	JSONModel,
	findIndexInArray,
	AnimationPlayback
) {
	"use strict";

	/**
	 * Constructor for a new View.
	 *
	 * The objects of this class contain neccessary information to reproduce current view including camera type, position and orientation as well as objects visibility property and their positions (if different from default)
	 *
	 * @class Provides the interface for the view.
	 *
	 * @public
	 * @author SAP SE
	 * @version 1.77.0
	 * @extends sap.ui.base.ManagedObject
	 * @implements sap.ui.vk.IPlaybackCollection
	 * @alias sap.ui.vk.View
	 */
	var View = ManagedObject.extend("sap.ui.vk.View", /** @lends sap.ui.vk.View.prototype */ {
		metadata: {
			library: "sap.ui.vk",
			interfaces: [
				"sap.ui.vk.IPlaybackCollection"
			],
			properties: {
				/**
				* View persistent ID (optional)
				*/
				viewId: {
				    type: "string"
				},
				/**
				* View name (optional)
				*/
				name: {
				    type: "string"
				},
				/**
				* View description (optional)
				*/
				description: {
				    type: "string"
				},
				/**
				 * Aspect ratio for Safe Area (optional). This can be 0 to 25. Values above or below this range will be ignored.
				 */
				aspectRatio: {
					type: "float"
				}
			}
		}
	});

	View.prototype.init = function() {
		this._playbacks = [];
		this._playbacksJSONData = [];
		this._model = new JSONModel({ playbacks: this._playbacksJSONData });
        this._model.setSizeLimit(1000 * 1000);
		this._highlightIdNodesMap = new Map();
	};

	View.prototype.exit = function() {
		this._playbacks = undefined;
		this._playbacksJSONData = undefined;
		this._highlightIdNodesMap = undefined;
	};

	/**
	 * Returns view camera
	 *
	 * @returns {sap.ui.vk.Camera} view camera
	 * @public
	 * @experimental Since 1.73.0 This class is experimental and might be modified or removed in future versions.
	 */
	View.prototype.getCamera = function() {
		return this._camera;
	};


	/**
	 * Set view camera.
	 *
	 * @param {sap.ui.vk.Camera} camera view camera
	 * @return {sap.ui.vk.View} return this
	 * @public
	 * @experimental Since 1.73.0 This class is experimental and might be modified or removed in future versions.
	 */
	View.prototype.setCamera = function(camera) {
		this._camera = camera;
		return this;
	};

	/*
	 * Checks if View has highlighe.
	 *
	 * @return {boolean} true if highlights are associted with nodes defined in the view
	 * @public
	 * @experimental Since 1.73.0 This class is experimental and might be modified or removed in future versions.
	 */
	View.prototype.hasHighlight = function() {
		return this._highlightIdNodesMap && this._highlightIdNodesMap.size;
	};

	/*
	 * Gets Map of highlight id and array of node referencea.
	 *
	 * @return {Map} map of highlight ids and arrays of nodes that are highlighted
	 * @public
	 * @experimental Since 1.73.0 This class is experimental and might be modified or removed in future versions.
	 */
	View.prototype.getHighlightIdNodesMap = function() {
		return this._highlightIdNodesMap;
	};

	/*
	 * Gets Map of highlight id and array of node referencea.
	 *
	 * @param {string} highlightId id of highlight
	 * @param {object | object []} nodeRefs node reference or array of node references that are highlighted
	 * @return {sap.ui.vk.View} return this
	 * @public
	 * @experimental Since 1.73.0 This class is experimental and might be modified or removed in future versions.
	 */
	View.prototype.addHighlightedNodes = function(highlightId, nodeRefs) {
		var nodes = this._highlightIdNodesMap.get(highlightId);
		if (!Array.isArray(nodeRefs)) {
			nodeRefs = [ nodeRefs ];
		}
		if (!nodes) {
			this._highlightIdNodesMap.set(highlightId, nodeRefs);
		} else {
			nodes = nodes.concat(nodeRefs.filter(function(item) { return nodes.indexOf(item) < 0; }));
			this._highlightIdNodesMap.set(highlightId, nodes);
		}
	};

	/*
	 * Checks if View is animated.
	 *
	 * @return {boolean}
	 * @public
	 * @experimental Since 1.73.0 This class is experimental and might be modified or removed in future versions.
	 */
	View.prototype.hasAnimation = function() {
		return this._playbacks && this._playbacks.length;
	};

	/*
	 * Gets all animation playbacks in the play order.
	 *
	 * @return {sap.ui.vk.AnimationPlayback []} all playbacks in view
	 * @public
	 * @experimental Since 1.73.0 This class is experimental and might be modified or removed in future versions.
	 */
	View.prototype.getPlaybacks = function() {
		return this._playbacks;
	};

	/*
	 * Gets animation playback by index.
	 *
	 * @param {int} index of playbacks
	 * @return {sap.ui.vk.AnimationPlayback}
	 * @public
	 * @experimental Since 1.73.0 This class is experimental and might be modified or removed in future versions.
	 */
	View.prototype.getPlayback = function(index) {
		if (index < 0 || index >= this._playbacks.length) {
			return undefined;
		}
		return this._playbacks[index];
	};

	/*
	 * Finds animation playback index.
	 *
	 * @param {sap.ui.vk.AnimationPlayback} playback
	 * @return {int} index
	 * @public
	 * @experimental Since 1.73.0 This class is experimental and might be modified or removed in future versions.
	 */
	View.prototype.indexOfPlayback = function(playback) {
		return findIndexInArray(this._playbacks, function(item) {
			return item === playback;
		});
	};

	/*
	 * Adds animation playback.
	 *
	 * @param {sap.ui.vk.AnimationPlayback} playback
	 * @return {sap.ui.vk.View} return this
	 * @public
	 * @experimental Since 1.73.0 This class is experimental and might be modified or removed in future versions.
	 */
	View.prototype.addPlayback = function(playback) {
		this._playbacks.push(playback);
		this._playbacksJSONData.push(playback.getJSONData());
		if (this._model) {
			this._model.updateBindings();
		}
		playback.setJSONModel(this._model);

		return this;
	};

	/*
	 * Inserts animation playback to a specified position.
	 *
	 * @param {sap.ui.vk.AnimationPlayback} playback
	 * @param {int} index
	 * @return {sap.ui.vk.View} return this
	 * @public
	 * @experimental Since 1.73.0 This class is experimental and might be modified or removed in future versions.
	 */
	View.prototype.insertPlayback = function(playback, index) {
		if (index < 0) {
			index = 0;
		} else if (index !== 0 && index >= this._playbacks.length) {
			index = this._playbacks.length;
		}

		this._playbacks.splice(index, 0, playback);
		this._playbacksJSONData.splice(index, 0, playback.getJSONData());
		if (this._model) {
			this._model.updateBindings();
		}
		return this;
	};

	/*
	 * Removes animation playback.
	 *
	 * @param {int | string | sap.ui.vk.AnimationPlayback} vObject, playback index or playback id or playback
	 * @param {int} index
	 * @return {sap.ui.vk.View} return this
	 * @public
	 * @experimental Since 1.73.0 This class is experimental and might be modified or removed in future versions.
	 */
	View.prototype.removePlayback = function(vObject) {
		var index;
		if (typeof vObject === "number") {
			index = vObject;
		} else if (typeof vObject === "string") {
			index = findIndexInArray(this._playbacks, function(item) {
				return item.getId() === vObject;
			});
		} else {
			index = findIndexInArray(this._playbacks, function(item) {
				return item === vObject;
			});
		}

		if (index != null && index >= 0 && index < this._playbacks.length) {
			this._playbacks.splice(index, 1);
			this._playbacksJSONData.splice(index, 1);
			if (this._model) {
				this._model.updateBindings();
			}
		}

		return this;
	};

	/*
	 * Removes all animation playback.
	 *
	 * @return {sap.ui.vk.View} return this
	 * @public
	 * @experimental Since 1.73.0 This class is experimental and might be modified or removed in future versions.
	 */
	View.prototype.removePlaybacks = function() {
		this._playbacks.splice(0);
		this._playbacksJSONData.splice(0);
		if (this._model) {
			this._model.updateBindings();
		}

		return this;
	};

	/*
	 * Switch positions of two playbacks
	 *
	 * @param {sap.ui.vk.AnimationPlayback} playback1 the first playback
	 * @param {sap.ui.vk.AnimationPlayback} playback2 the second playback
	 * @return {sap.ui.vk.View} return this
	 * @public
	 * @experimental Since 1.73.0 This class is experimental and might be modified or removed in future versions.
	 */
	View.prototype.switchPlaybacks = function(playback1, playback2) {
		var index1, index2;
		for (var i = 0; i < this._playbacks.length; i++) {
			if (this._playbacks[i] === playback1) {
				index1 = i;
			} else if (this._playbacks[i] === playback2) {
				index2 = i;
			}
		}

		if (index1 !== undefined && index2 !== undefined) {

			var tempPlayback = this._playbacks[index1];
			var tempPlaybackData = this._playbacksJSONData[index1];

			this._playbacks[index1] = this._playbacks[index2];
			this._playbacksJSONData[index1] = this._playbacksJSONData[index2];

			this._playbacks[index2] = tempPlayback;
			this._playbacksJSONData[index2] = tempPlaybackData;
		}
		return this;
	};

	/*
	 * Reset the start times of playbacks based on their orders and durations
	 *
	 * @return {sap.ui.vk.View} return this
	 * @public
	 * @experimental Since 1.73.0 This class is experimental and might be modified or removed in future versions.
	 */
	View.prototype.resetPlaybacksStartTimes = function() {

		if (this._playbacks.length === 0) {
			return this;
		}

		var reversed = this._playbacks[0].getReversed();

		var startTime = 0;
		var i;
		if (!reversed) {
			for (i = 0; i < this._playbacks.length; i++) {
				this._playbacks[i].setStartTime(startTime);
				startTime += this._playbacks[i].getDuration();
			}
		} else {
			for (i = this._playbacks.length - 1; i > -1; i--) {
				this._playbacks[i].setStartTime(startTime);
				startTime += this._playbacks[i].getDuration();
			}
		}

		return this;
	};

	/*
	 * Set all playbacks to reversed or not reversed
	 *
	 * @param {boolean} reversed
	 * @return {sap.ui.vk.View} return this
	 * @public
	 * @experimental Since 1.73.0 This class is experimental and might be modified or removed in future versions.
	 */
	View.prototype.setPlaybacksReversed = function(reversed) {

		for (var i = 0; i < this._playbacks.length; i++) {
			this._playbacks[i].setReversed(reversed);
		}

		this.resetPlaybacksStartTimes();

		return this;
	};

	/**
	 * Get parameters of nodes defined in view
	 *
	 * @return {object[]} array of objects containing node information, each object contains the following fields
	 * {object} target - node reference
	 * {float[]} transform - transformation matrix, array of 16 or 12
	 * {string} meshId - optional
	 * {string} materialId - optional
	 * {boolean} visiible - node visibility
	 * {float} opacity - node opacity
	 * @public
	 * @experimental Since 1.73.0 This class is experimental and might be modified or removed in future versions.
	 */
	View.prototype.getNodeInfos = function() {
		return this._nodeInfos;
	};

	/**
	 * Set parameters of nodes defined in view
	 *
	 * @param {object[]} infos array of objects containing node information, each object contains the following fields
	 * {object} target - node reference
	 * {float[]} transform - transformation matrix, array of 16 or 12
	 * {string} meshId - optional
	 * {string} materialId - optional
	 * {boolean} visiible - node visibility
	 * {float} opacity - node opacity
	 * @return {sap.ui.vk.View} return this
	 * @public
	 * @experimental Since 1.73.0 This class is experimental and might be modified or removed in future versions.
	 */
	View.prototype.setNodeInfos = function(infos) {
		this._nodeInfos = infos;
		return this;
	};

	/*
	 * Update parameters of nodes if nodes are already defined, add parameters if the node is not defined in view
	 *
	 * @param {object[]} update infos array of objects containing node information, each object contains the following fields
	 * {object} target - node reference
	 * {float[]} transform - transformation matrix, array of 16 or 12
	 * {string} meshId - optional
	 * {string} materialId - optional
	 * {boolean} visiible - node visibility
	 * {float} opacity - node opacity
	 * @return {sap.ui.vk.View} return this
	 * @public
	 * @experimental Since 1.73.0 This class is experimental and might be modified or removed in future versions.
	 */
	View.prototype.updateNodeInfos = function(update) {
		var currentData = this.getNodeInfos();
		if (!currentData) {
			return this.setNodeInfos(update);
		}

		var indices = new Map();
		currentData.forEach(function(data, idx) {
			indices.set(data.target, idx);
		});

		var mergeInfo = function(destination, source) {
			for (var property in source) {
				destination[property] = source[property];
			}
		};

		update.forEach(function(data) {
			var index = indices.get(data.target);
			if (index == null) {
				currentData.push(data);
			} else {
				mergeInfo(currentData[index], data);
			}
		});

		this.setNodeInfos(currentData);

		return this;
	};

	/*
     * Get model for data binding
     *
     * @return {sap.ui.model.Model} returns the model for this view.
     * @public
     * @experimental Since 1.76.0 This class is experimental and might be modified or removed in future versions.
     */
    View.prototype.getModel = function() {
        return this._model;
    };

	return View;
});