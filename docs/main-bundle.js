/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = // eslint-disable-next-line no-unused-vars
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) {
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		if (null) script.crossOrigin = null;
/******/ 		head.appendChild(script);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest(requestTimeout) {
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if (typeof XMLHttpRequest === "undefined") {
/******/ 				return reject(new Error("No browser support"));
/******/ 			}
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch (err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if (request.readyState !== 4) return;
/******/ 				if (request.status === 0) {
/******/ 					// timeout
/******/ 					reject(
/******/ 						new Error("Manifest request to " + requestPath + " timed out.")
/******/ 					);
/******/ 				} else if (request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if (request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch (e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "93f7a7a1017cdb03f703";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire("./src/app.js")(__webpack_require__.s = "./src/app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var g;\n\n// This works in non-strict mode\ng = (function() {\n\treturn this;\n})();\n\ntry {\n\t// This works if eval is allowed (see CSP)\n\tg = g || Function(\"return this\")() || (1, eval)(\"this\");\n} catch (e) {\n\t// This works if the window reference is available\n\tif (typeof window === \"object\") g = window;\n}\n\n// g can still be undefined, but nothing to do about it...\n// We return undefined, instead of nothing here, so it's\n// easier to handle this case. if(!global) { ...}\n\nmodule.exports = g;\n\n\n//# sourceURL=webpack:///(webpack)/buildin/global.js?");

/***/ }),

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(global) {/* harmony import */ var _components_gameConfig__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/gameConfig */ \"./src/components/gameConfig.js\");\n/* harmony import */ var _style_main_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style/main.scss */ \"./src/style/main.scss\");\n/* harmony import */ var _style_main_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_style_main_scss__WEBPACK_IMPORTED_MODULE_1__);\nfunction _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }\n\nfunction isNativeReflectConstruct() { if (typeof Reflect === \"undefined\" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === \"function\") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }\n\nfunction _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nfunction _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }\n\nfunction _nonIterableRest() { throw new TypeError(\"Invalid attempt to destructure non-iterable instance\"); }\n\nfunction _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i[\"return\"] != null) _i[\"return\"](); } finally { if (_d) throw _e; } } return _arr; }\n\nfunction _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }\n\nfunction _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }\n\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance\"); }\n\nfunction _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === \"[object Arguments]\") return Array.from(iter); }\n\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n// import styles\n\n\nvar HANGMAN = {}; // -------------------------NAMESPACE -------------------------\n\n(function (namespace) {\n  // -----------------------WORD CLASS------------------------\n  // used to make words for game\n  var Word =\n  /*#__PURE__*/\n  function () {\n    function Word(word, hint) {\n      _classCallCheck(this, Word);\n\n      this.word = word.toLowerCase();\n      this.hint = hint;\n      this.isMatched = this.isMatched.bind(this);\n      this.isIncluded = this.isIncluded.bind(this);\n    } // method to test if user letter choice is present in word\n\n\n    _createClass(Word, [{\n      key: \"isIncluded\",\n      value: function isIncluded(char) {\n        return this.word.includes(char.toLowerCase().trim());\n      } // method to test if word is correct\n\n    }, {\n      key: \"isMatched\",\n      value: function isMatched(letters) {\n        return this.word === letters.toLowerCase().trim();\n      }\n    }]);\n\n    return Word;\n  }(); // ----------------------WORD FACTORY------------------------\n  // make single word or an array of words and make it a property of HANGMAN\n  // it takes an a single string, multiple stings, or an array of stings as an argument\n\n\n  namespace.wordFactory = function () {\n    for (var _len = arguments.length, word = new Array(_len), _key = 0; _key < _len; _key++) {\n      word[_key] = arguments[_key];\n    }\n\n    // if argument is an array make it an array by destructuring it\n    if (Array.isArray.apply(Array, _toConsumableArray(word))) {\n      var _word = word;\n\n      var _word2 = _slicedToArray(_word, 1);\n\n      word = _word2[0];\n    } // iterate through an array of strings and return an array of objects\n\n\n    if (word.length) return word.map(function (item) {\n      return _construct(Word, _toConsumableArray(item));\n    }); // if argument is a single string destructure the array and output a string\n\n    var _word3 = word,\n        _word4 = _slicedToArray(_word3, 1),\n        singleWord = _word4[0]; // make a single object\n\n\n    return new Word(singleWord);\n  }; // ------------------ARRAY ITERATOR ----------------------------------\n  // loop through array of words and execute callback function using recursive function\n\n\n  var arrayIterator = function arrayIterator(wordList, cb) {\n    var _wordList = _toArray(wordList),\n        a = _wordList[0],\n        b = _wordList.slice(1);\n\n    cb(a);\n    if (wordList.length === 1) return;\n    arrayIterator(b, cb);\n  };\n\n  namespace.arrayIterator = arrayIterator; // This method takes in a string and outputs a string of underscores\n  // proportionate to the number of characters contained in the string\n\n  var makeDashes = function makeDashes(answer) {\n    var dashed = [];\n\n    (function looper(answer) {\n      var _ref = _toConsumableArray(answer),\n          a = _ref[0],\n          b = _ref.slice(1);\n\n      dashed.push('_');\n      if (answer.length === 1) return;\n      looper(b);\n    })(answer);\n\n    return dashed.join('');\n  };\n\n  namespace.makeDashes = makeDashes; // this is a method used for DOM manipulation\n  // the names of the functions within it borrow from jQuery\n\n  var makeElem = function makeElem() {\n    var elemName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'div';\n    var elem = global.document.createElement(elemName); // insert element into another element\n\n    elem.appendTo = function (parent) {\n      parent.appendChild(elem);\n      return elem;\n    }; // add text to element\n\n\n    elem.text = function (text) {\n      elem.textContent = text;\n      return elem;\n    }; // add HTML to element\n\n\n    elem.html = function (html) {\n      elem.innerHTML = html;\n      return elem;\n    }; // empty the element of all it's content\n\n\n    elem.empty = function () {\n      elem.innerHTML = '';\n      return elem;\n    }; // hide the element\n\n\n    elem.hide = function () {\n      elem.style.visibility = 'hidden';\n      return elem;\n    }; // show element\n\n\n    elem.show = function () {\n      elem.style.visibility = 'visible';\n      return elem;\n    }; // add CSS class to element\n\n\n    elem.addClass = function (className) {\n      elem.classList.add(className);\n      return elem;\n    }; // remove CSS class from element\n\n\n    elem.removeClass = function (className) {\n      elem.classList.remove(className);\n      return elem;\n    };\n\n    return elem;\n  };\n\n  namespace.makeElem = makeElem; // this takes in two arguments, the answer and the user's guess\n  // if the letter guess is present in the answer it outputs an array of objects with the\n  // letter as a string and the index at which the letter is present in the answer string\n\n  var guesses = function guesses(answer, letterGuessed) {\n    return (// spread the characters in the string and place them in an array\n      // then iterate through them using the reduce function which returns a array that contains\n      // all the letter guessed and the the index at which it is matched in the answers string\n      _toConsumableArray(answer).reduce(function (arr, letter, index) {\n        if (letterGuessed === letter) {\n          var obj = {\n            key: letterGuessed,\n            index: index\n          };\n          arr.push(obj);\n        }\n\n        return arr;\n      }, [])\n    );\n  };\n\n  namespace.guesses = guesses; // replaces characters in a string where with provided replacement character\n  // and index where it should be placed\n  // it receives two arguments, a string and an array of objects containing\n  // a character the user guessed and it's index in the answer\n  // all characters provided are contained in the answer\n\n  var replace = function replace(word, input) {\n    var resultStr = input.reduce(function (previous, guess) {\n      // insert each letter according to it's provided index\n      if (guess.index !== -1) {\n        return previous.substring(0, guess.index) + guess.key + previous.substring(guess.index + 1, previous.length);\n      }\n    }, word); // return altered string as output\n\n    return resultStr;\n  };\n\n  namespace.replace = replace; // takes in a number increments it by one and returns the incremented number\n\n  var inc = function inc() {\n    var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;\n    return num + 1;\n  };\n\n  namespace.inc = inc;\n})(HANGMAN);\n\nvar gameWords = HANGMAN.wordFactory([['hibernate', 'I can bear the cold.'], ['luxury', 'Not many can afford this.'], ['jigsaw', 'This one is very puzzling.'], ['short', 'It becomes shorter when you add two letters to it.'], ['basketball', 'Nothing but net.'], ['boxer', 'It could be a man or a dog.'], ['silence', 'Saying it\\'s name will break it.'], ['incomplete', 'This sentence is'], ['compliment', 'Say something to make me smile.'], ['Coffin', 'The man who invented it doesn\\'t want it. The man who bought it doesn\\'t need it. The man who needs it doesn\\'t know it.'], ['library', 'This building has the most stories. What is it?']]);\nvar makeElem = HANGMAN.makeElem,\n    makeDashes = HANGMAN.makeDashes,\n    guesses = HANGMAN.guesses,\n    replace = HANGMAN.replace,\n    inc = HANGMAN.inc;\nvar methodsArr = [makeElem, makeDashes, guesses, replace, inc]; // =================== EVENT HANDLER FOR STARTING GAME=======================\n\nvar handleKeypress = function handleKeypress(e) {\n  var key = e.key,\n      target = e.target;\n  var intro = global.document.querySelector('.intro');\n\n  if (key === 'Enter') {\n    Object(_components_gameConfig__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(gameWords, methodsArr);\n    intro.parentElement.removeChild(intro); // remove listener so that this function is only run once...\n    // when the user initially comes to the site\n\n    target.removeEventListener('keypress', handleKeypress);\n    target.removeEventListener('click', handleKeypress);\n  }\n};\n\nfunction handleClick(e) {\n  var target = e.target;\n  var intro = global.document.querySelector('.intro');\n  intro.parentElement.removeChild(intro);\n  Object(_components_gameConfig__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(gameWords, methodsArr);\n  target.removeEventListener('click', handleClick);\n  global.document.body.removeEventListener('keypress', handleKeypress);\n}\n\nglobal.document.body.addEventListener('keypress', handleKeypress);\nvar introText = global.document.querySelector('.intro--text');\nintroText.onclick = handleClick;\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/global.js */ \"./node_modules/webpack/buildin/global.js\")))\n\n//# sourceURL=webpack:///./src/app.js?");

/***/ }),

/***/ "./src/components/GameStats.js":
/*!*************************************!*\
  !*** ./src/components/GameStats.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar GameStats =\n/*#__PURE__*/\nfunction () {\n  function GameStats(wins, guessesLeft) {\n    _classCallCheck(this, GameStats);\n\n    this.wins = wins;\n    this.guessesLeft = guessesLeft;\n    this.decrementGuesses = this.decrementGuesses.bind(this);\n    this.resetWins = this.resetWins.bind(this);\n    this.incrementWins = this.incrementWins.bind(this);\n    this.resetGuesses = this.resetGuesses.bind(this);\n  }\n\n  _createClass(GameStats, [{\n    key: \"resetWins\",\n    value: function resetWins() {\n      var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;\n      this.wins = num;\n    }\n  }, {\n    key: \"resetGuesses\",\n    value: function resetGuesses() {\n      var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;\n      this.guessesLeft = num;\n    }\n  }, {\n    key: \"incrementWins\",\n    value: function incrementWins() {\n      var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;\n      this.wins = this.wins + num;\n      return this;\n    }\n  }, {\n    key: \"decrementGuesses\",\n    value: function decrementGuesses() {\n      var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;\n      this.guessesLeft = this.guessesLeft - num;\n      return this;\n    }\n  }, {\n    key: \"resetAllStats\",\n    value: function resetAllStats() {\n      this.resetGuesses();\n      this.resetWins();\n    }\n  }]);\n\n  return GameStats;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (GameStats);\n\n//# sourceURL=webpack:///./src/components/GameStats.js?");

/***/ }),

/***/ "./src/components/gameConfig.js":
/*!**************************************!*\
  !*** ./src/components/gameConfig.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(global) {/* harmony import */ var _GameStats__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GameStats */ \"./src/components/GameStats.js\");\nfunction _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }\n\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance\"); }\n\nfunction _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === \"[object Arguments]\") return Array.from(iter); }\n\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }\n\nfunction _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }\n\nfunction _nonIterableRest() { throw new TypeError(\"Invalid attempt to destructure non-iterable instance\"); }\n\nfunction _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i[\"return\"] != null) _i[\"return\"](); } finally { if (_d) throw _e; } } return _arr; }\n\nfunction _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }\n\n\n\nvar gameConfig = function gameConfig(words, methods) {\n  var _methods = _slicedToArray(methods, 5),\n      makeElem = _methods[0],\n      makeDashes = _methods[1],\n      guesses = _methods[2],\n      replace = _methods[3],\n      inc = _methods[4]; // set game stats: wins = 0 and chances = 5\n\n\n  var stats = new _GameStats__WEBPACK_IMPORTED_MODULE_0__[\"default\"](0, 5); // create and place elements into DOM when game initially starts\n\n  var game = makeElem().addClass('game').appendTo(global.document.body);\n  var displayHeadScore = makeElem().addClass('display__heading').addClass('display__heading--score').appendTo(game);\n  var displayContentWord = makeElem().addClass('display__content').addClass('display__content--word').appendTo(game);\n  var wrongGuessesDiv = makeElem().addClass('wrong-guesses').appendTo(game); // display hint heading\n\n  makeElem().addClass('game__hint-head').addClass('display__heading').addClass('display__heading--hint').text('Hint').appendTo(game);\n  var displayContentHint = makeElem().addClass('display__content').addClass('display__content--hint').html(\"<p class=\\\"game-text hint-text\\\">\".concat(words[0].hint, \"</p>\")).appendTo(game);\n  var body = global.document.body; // set initial values for game\n\n  var input = [];\n  var userGuesses = new Set(); // this sets the count to zero\n  // the inc function returns zero when it is passed no arguments\n  // otherwise it takes a number as an argument and turns that number incremented by 1\n  // inc(5) is 5 + 1, which returns 6.\n\n  var count = inc();\n  var word = words[count].word;\n  var puzzleWord = makeDashes(word); // ############ SETTING INITIAL DOM ELEMENTS ###############\n\n  var winsDiv = makeElem().addClass('game__score--wins').html(\"wins: <span class=\\\"game__score--tally\\\">\".concat(stats.wins, \"</span>\")).appendTo(displayHeadScore);\n  var chancesDiv = makeElem().addClass('game__score--chances').html(\"chances: <span class=\\\"game__score--tally\\\">\".concat(stats.guessesLeft, \"</span>\")).appendTo(displayHeadScore);\n  var wordProgressDiv = makeElem().addClass('game-text').addClass('display__content--text').html(puzzleWord).appendTo(displayContentWord);\n  var modalBackdrop = makeElem().addClass('modal__backdrop').hide().appendTo(body);\n  var modal = makeElem().addClass('modal').appendTo(modalBackdrop);\n  var modalMessage = makeElem().addClass('modal--message').appendTo(modal);\n  var mobileInput = makeElem().addClass('mobile-input');\n  mobileInput.appendTo(game);\n  var canIncScores = true;\n  var acknowledgeGuesses = true; // GAME IS PROGRESSES OR RESTARTS BASED ON THE ARGUMENTS PASSED\n\n  var resetWord = function resetWord() {\n    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};\n    var startOver = words[count] === words[words.length - 1];\n    return function () {\n      if (startOver) {\n        count = 0;\n        stats.resetWins();\n      } else {\n        count = inc(count);\n      }\n\n      word = words[count].word;\n      acknowledgeGuesses = true;\n      puzzleWord = makeDashes(word);\n      canIncScores = true;\n      stats.resetGuesses();\n      input = [];\n      userGuesses.clear();\n      wordProgressDiv.text(puzzleWord); // print hint to screen\n\n      displayContentHint.html(\"<p class=\\\"game-text hint-text\\\">\".concat(words[count].hint, \"</p>\")).addClass('display__content');\n      winsDiv.html(\"wins: <span class=\\\"game__score--tally\\\">\".concat(stats.wins, \"</span>\"));\n      chancesDiv.html(\"chances: <span class=\\\"game__score--tally\\\">\".concat(stats.guessesLeft, \"</span>\")); // empty the wrong guesses div\n\n      wrongGuessesDiv.empty();\n      callback();\n    };\n  }; // THE FUNCTION THAT RUNS UPON USER GUESS\n\n\n  var onGuess = function onGuess(e) {\n    var _input;\n\n    // this function tests the user input to find out if it is an alphabetical character\n    var isAlphabet = function isAlphabet(str) {\n      return /^[a-zA-Z()]$/.test(str);\n    };\n\n    var userInput = function (event, alphabetTest) {\n      // capture key stroke\n      var _event$key = event.key,\n          key = _event$key === void 0 ? event.target.innerText : _event$key; // if use input is a letter make it lower case and return it\n\n      return alphabetTest(key) ? key.toLowerCase() : key;\n    }(e, isAlphabet);\n\n    var _e$ctrlKey = e.ctrlKey,\n        ctrlKey = _e$ctrlKey === void 0 ? false : _e$ctrlKey; // only precede if CTRL isn't pressed along with alphabet key\n\n    if (ctrlKey) return; //\n\n    var userGuess = guesses(word, userInput);\n    var letterElements = Array.from(document.querySelectorAll('.mobile-input__letter'));\n\n    var isGuessWrong = function () {\n      return !words[count].isIncluded(userInput) && canIncScores && stats.guessesLeft >= 1 && isAlphabet(userInput) && !userGuesses.has(userInput);\n    }();\n\n    var isGuessCorrect = function () {\n      return words[count].isIncluded(userInput) && canIncScores && stats.guessesLeft >= 1 && isAlphabet(userInput) && !userGuesses.has(userInput);\n    }(); // if letter is not found highlight letter in red\n\n\n    letterElements.forEach(function (el) {\n      return el.highLight(isGuessWrong, function (element) {\n        if (userInput === element.textContent) {\n          element.style.color = '#e74c3c';\n          element.style.border = '.5px solid #e74c3c';\n          element.addClass('wiggle-animation');\n        }\n      });\n    }); // if letter is found highlight letter in green\n\n    letterElements.forEach(function (el) {\n      return el.highLight(isGuessCorrect, function (element) {\n        // console.log('element -- right: ', element);\n        if (userInput === element.textContent) {\n          element.style.color = '#2ecc71';\n          element.style.border = '.5px solid #2ecc71';\n        }\n      });\n    }); // spread array and push them into the input array\n\n    if (acknowledgeGuesses) (_input = input).push.apply(_input, _toConsumableArray(userGuess));\n    puzzleWord = replace(puzzleWord, input); // ############## USER GUESSED WRONG #############\n\n    if (isGuessWrong) {\n      stats.decrementGuesses();\n      userGuesses.add(userInput);\n    }\n\n    var reset = resetWord(function () {\n      modalBackdrop.hide();\n      letterElements.forEach(function (el) {\n        return el.highLight(true, function (element) {\n          element.style.color = 'transparent';\n          element.style.border = 'none';\n          element.removeClass('wiggle-animation');\n        });\n      });\n    });\n    modal.onclick = reset; // ########## USER EXHAUSTS ALL HIS GUESSES ##############\n\n    if (!stats.guessesLeft) {\n      acknowledgeGuesses = false;\n      modalMessage.html(\"<span class=\\\"modal__heading--loss\\\">You lose!</span> \\n            <br> \\n            The word was <span class=\\\"modal__notable--loss\\\">\\\"\".concat(words[count].word, \"\\\"</span>\\n            <br>\\n            Press <span class=\\\"modal__notable--loss\\\">\\\"Enter\\\"</span> to start over.\"));\n      modalBackdrop.show(); // if enter id pressed move on to the next word\n\n      if (userInput === 'Enter') reset();\n      modal.onclick = reset;\n    } // print hint to screen\n\n\n    displayContentHint.html(\"<p class=\\\"game-text hint-text\\\">\".concat(words[count].hint, \"</p>\")); // ################ USER GOT ALL THE LETTERS ###############\n\n    if (words[count].isMatched(puzzleWord)) {\n      if (canIncScores) stats.incrementWins();\n      canIncScores = false;\n      winsDiv.html(\"wins: <span class=\\\"game__score--tally\\\">\".concat(stats.wins, \"</span>\"));\n      wordProgressDiv.text(\"Word so far: \".concat(puzzleWord)); // print hint to screen\n\n      displayContentHint.html(\"<p class=\\\"game-text hint-text\\\">\".concat(words[count].hint, \"</p>\")); // modalWordDisplay.text(puzzleWord);\n\n      modalMessage.html(\"<h2 class=\\\"modal__heading--win\\\">Congratulations!</h2> \\n                <p class=\\\"modal__notable\\\">You're correct. The word's <span class=\\\"modal__notable--win\\\">\\\"\".concat(puzzleWord, \"\\\"</span>\\n                Press <span class=\\\"modal__notable--win\\\">\\\"Enter\\\"</span> to attempt the next word.</p>\"));\n      modalBackdrop.show(); //  player completed every word -----TODO-----\n\n      if (stats.wins === words.length) {\n        modalMessage.html(\"\\n                    <h1 class=\\\"modal__heading--win\\\">Congratulations</h1>\\n                    <p class=\\\"modal--message\\\">You've found all the words. Press Enter to over</p>\\n                 \");\n      } // move to next word when the user presses enter\n\n\n      if (userInput === 'Enter') reset();\n    }\n\n    chancesDiv.html(\"chances: <span class=\\\"game__score--tally\\\">\".concat(stats.guessesLeft, \"</span>\"));\n    winsDiv.html(\"wins: <span class=\\\"game__score--tally\\\">\".concat(stats.wins, \"</span>\"));\n    wordProgressDiv.text(puzzleWord);\n  }; // create buttons and assign letters to them\n\n\n  (function () {\n    var mobileInputChoices = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];\n    mobileInputChoices.forEach(function (letter) {\n      var letterDiv = makeElem('a'); // attach event listener to each button\n\n      letterDiv.onclick = onGuess; // give highlight function to each element which accepts a ...\n      // condition and a callback function as an argument\n\n      letterDiv.highLight = function highlight(condition, callback) {\n        // if the condition is truthy then the callback function will be executed\n        if (condition) callback(this);\n      }; // add a class, content, and styling to each element\n\n\n      letterDiv.addClass('mobile-input__letter').html(letter).appendTo(mobileInput);\n    });\n  })();\n\n  body.onkeyup = onGuess;\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (gameConfig);\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/global.js */ \"./node_modules/webpack/buildin/global.js\")))\n\n//# sourceURL=webpack:///./src/components/gameConfig.js?");

/***/ }),

/***/ "./src/style/main.scss":
/*!*****************************!*\
  !*** ./src/style/main.scss ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/style/main.scss?");

/***/ })

/******/ });