/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "c868990c6965635c7f8c"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
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
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
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
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
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
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
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
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
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
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
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
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
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
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
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
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
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
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
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
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
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
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "https://whoisju1.github.io/hangman/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire("./src/app.js")(__webpack_require__.s = "./src/app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/app.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("Object.defineProperty(__webpack_exports__, \"__esModule\", { value: true });\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__style_main_scss__ = __webpack_require__(\"./src/style/main.scss\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__style_main_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__style_main_scss__);\n\n//import styles\n\n\n\nconst HANGMAN = {};\n\n// -------------------------NAMESPACE -------------------------\n(namespace => {\n\t// -----------------------WORD CLASS------------------------\n\t// used to make words for game\n\tclass Word {\n\t\tconstructor(word) {\n\t\t\tthis.word = word.toLowerCase();\n\n\t\t\tthis.isMatched = this.isMatched.bind(this);\n\t\t\tthis.isIncluded = this.isIncluded.bind(this);\n\t\t}\n\n\t\t// method to test if user letter choice is present in word\n\t\tisIncluded(char) {\n\t\t\treturn this.word.includes(char.toLowerCase().trim());\n\t\t}\n\n\t\t//method to test if word is correct\n\t\tisMatched(letters) {\n\t\t\treturn this.word === letters.toLowerCase().trim() ? true : false;\n\t\t}\n\t}\n\n\t// ----------------------WORD FACTORY------------------------\n\t// make single word or an array of words and make it a property of HANGMAN\n\t// it takes an a single string, multiple stings, or an array of stings as an argument\n\tHANGMAN.wordFactory = (...word) => {\n\t\t// if argument is an array make it an array by destructuring it\n\t\tif (Array.isArray(...word)) [word] = word;\n\n\t\t// iterate through an array of strings and return an array of objects\n\t\tif (word.length > 1) return word.map(item => new Word(item));\n\n\t\t// if argument is a single string destructure the array and output a string\n\t\tconst [singleWord] = word;\n\n\t\t// make a single object\n\t\treturn new Word(singleWord);\n\t};\n\n\t// ------------------ARRAY ITERATOR ----------------------------------\n\n\t// loop through array of words and execute callback function using recursive function\n\tconst arrayIterator = (wordList, cb) => {\n\t\tconst [a, ...b] = wordList;\n\t\tcb(a);\n\t\tif (wordList.length === 1) return;\n\t\tarrayIterator(b, cb);\n\t};\n\n\tHANGMAN.arrayIterator = arrayIterator;\n\n\t// This method takes in a string and outputs a string of underscores\n\t// proportionate to the number of characters contained in the string\n\tconst makeDashes = answer => {\n\t\tlet dashed = [];\n\t\t(function looper(answer) {\n\t\t\tlet [a, ...b] = [...answer];\n\n\t\t\tdashed.push('?');\n\t\t\tif (answer.length === 1) return;\n\t\t\tlooper(b);\n\t\t})(answer);\n\t\treturn dashed.join('');\n\t};\n\n\tHANGMAN.makeDashes = makeDashes;\n\n\t// this is a method used for DOM manipulation\n\t// the names of the functions within it borrow from jQuery\n\tconst makeElem = elemName => {\n\t\tlet elem = document.createElement(elemName = 'div');\n\n\t\t// insert element into another element\n\t\telem.appendTo = parent => {\n\t\t\tparent.appendChild(elem);\n\t\t\treturn elem;\n\t\t};\n\n\t\t// add text to element\n\t\telem.text = text => {\n\t\t\telem.textContent = text;\n\t\t\treturn elem;\n\t\t};\n\n\t\t// add HTML to element\n\t\telem.html = html => {\n\t\t\telem.innerHTML = html;\n\t\t\treturn elem;\n\t\t};\n\n\t\t// empty the element of all it's content\n\t\telem.empty = () => {\n\t\t\telem.innerHTML = '';\n\t\t\treturn elem;\n\t\t};\n\n\t\t// hide the element\n\t\telem.hide = () => {\n\t\t\telem.style.visibility = 'hidden';\n\t\t\treturn elem;\n\t\t};\n\n\t\t// show element\n\t\telem.show = () => {\n\t\t\telem.style.visibility = 'visible';\n\t\t\treturn elem;\n\t\t};\n\n\t\t// add CSS class to element\n\t\telem.addClass = className => {\n\t\t\telem.classList.add(className);\n\t\t\treturn elem;\n\t\t};\n\n\t\t// remove CSS class from element\n\t\telem.removeClass = className => {\n\t\t\telem.classList.remove(className);\n\t\t\treturn elem;\n\t\t};\n\n\t\treturn elem;\n\t};\n\n\tHANGMAN.makeElem = makeElem;\n\n\t// this takes in two arguments, the answer and the user's guess\n\t// if the letter guess is present in the answer it outputs an array of objects with the\n\t// letter as a string and the index at which the letter is present in the answer string\n\tlet guesses = (answer, letterGuessed) => {\n\t\treturn (\n\t\t\t// spread the characters in the string and place them in an array\n\t\t\t// then iterate through them using the reduce function which returns a array that contains\n\t\t\t// all the letter guessed and the the index at which it is matched in the answers string\n\t\t\t[...answer].reduce((arr, letter, index) => {\n\t\t\t\tif (letterGuessed === letter) {\n\t\t\t\t\tlet obj = {\n\t\t\t\t\t\tkey: letterGuessed,\n\t\t\t\t\t\tindex: index\n\t\t\t\t\t};\n\t\t\t\t\tarr.push(obj);\n\t\t\t\t}\n\t\t\t\treturn arr;\n\t\t\t}, [])\n\t\t);\n\t};\n\n\tHANGMAN.guesses = guesses;\n\n\t// replaces characters in a string where with provided replacement character and index where it should be placed\n\t// it receives two arguments, a string and an array of objects containing a character the user guessed and it's index in the answer\n\t// all characters provided are contained in the answer\n\tconst replace = (word, input) => {\n\t\tlet resultStr = input.reduce((previous, guess) => {\n\t\t\t// insert each letter according to it's provided index\n\t\t\tif (guess.index !== -1) return previous.substring(0, guess.index) + guess.key + previous.substring(guess.index + 1, previous.length);\n\t\t}, word);\n\n\t\t// return altered string as output\n\t\treturn resultStr;\n\t};\n\n\tHANGMAN.replace = replace;\n\n\t// takes in a number increments it by one and returns the incremented number\n\tconst inc = (num = -1) => num + 1;\n\n\tHANGMAN.inc = inc;\n})(HANGMAN);\n\nconst gameWords = HANGMAN.wordFactory(['one', 'compliment', 'deliberate', 'confidence', 'dynamic', 'javascript']);\nconst { makeElem, makeDashes, guesses, replace, inc } = HANGMAN;\nconst methodsArr = [makeElem, makeDashes, guesses, replace, inc];\n\nconst gameConfig = (words, methods) => {\n\n\tconst wrapQuestMark = word => {\n\t\tconst wordArr = [...word].map(letter => {\n\t\t\tif (letter === '?') return `<span class=\"game__word-progress--unsolved\">${letter}</span>`;\n\t\t\treturn letter;\n\t\t});\n\t\treturn wordArr.join('');\n\t};\n\n\tconst [makeElem, makeDashes, guesses, replace, inc] = methods;\n\n\t// create and place elements into DOM\n\tconst game = makeElem().addClass('game').appendTo(document.body);\n\tconst scoreDiv = makeElem().addClass('game__score').appendTo(game);\n\tconst gameWordDiv = makeElem().addClass('.game__word').appendTo(game);\n\tconst wrgGuessesDiv = makeElem().addClass('.game__wrong-guesses').appendTo(game);\n\n\tconst body = document.body;\n\n\t// set initial values for game\n\n\tlet input = [];\n\n\t// this sets the count to zero\n\t// the inc function returns zero when it is passed no arguments\n\t// otherwise it takes a number as an argument and turns that number incremented by 1\n\t// inc(5) is 5 + 1, which returns 6.\n\n\tlet count = inc();\n\n\tlet { word } = words[count];\n\n\tlet wins = 0;\n\n\tlet chances = 5;\n\n\tlet guessedLetters = [];\n\n\tlet puzzleWord = makeDashes(word);\n\n\t// ############ SETTING INITIAL DOM ELEMENTS ###############\n\tlet winsDiv = makeElem().addClass('game__score--wins').html(`wins: <span class=\"game__score--tally\">${wins}</span>`).appendTo(scoreDiv);\n\tlet chancesDiv = makeElem().addClass('game__score--chances').html(`chances: <span class=\"game__score--tally\">${chances}</span>`).appendTo(scoreDiv);\n\tlet wrongGuessesDiv = makeElem().addClass('wrong-guesses').appendTo(wrgGuessesDiv);\n\tlet wordProgressDiv = makeElem().addClass('game__word-progress').html(wrapQuestMark(puzzleWord)).appendTo(gameWordDiv);\n\n\tconst modalBackdrop = makeElem().addClass('modal__backdrop').hide().appendTo(body);\n\tconst modal = makeElem().addClass('modal').appendTo(modalBackdrop);\n\t// const modalWordDisplay = makeElem('h1').addClass('modal--word').appendTo(modal);\n\tconst modalMessage = makeElem().addClass('modal--message').appendTo(modal);\n\t// let victory = false; // ~~~~~~~~ NO USE YET ~~~~~~~~~\n\n\tlet canIncScores = true;\n\tlet acknowledgeGuesses = true;\n\n\tconst softReset = () => {\n\t\tguessedLetters = [];\n\t\tcount = inc(count);\n\t\tword = words[count].word;\n\t\tpuzzleWord = makeDashes(word);\n\t\tinput = [];\n\t\tchances = 5;\n\t\twordProgressDiv.text(`Word so far: ${puzzleWord}`);\n\t\twrongGuessesDiv.empty();\n\t};\n\n\t// RESTARTS GAME -- STARTS FROM THE BEGINNING\n\tconst hardReset = () => {\n\t\tguessedLetters = [];\n\t\tcanIncScores = true;\n\t\tcount = inc();\n\t\tword = words[count].word;\n\t\tpuzzleWord = makeDashes(word);\n\t\tinput = [];\n\t\tchances = 5;\n\t\twins = 0;\n\t\twordProgressDiv.html(wrapQuestMark(puzzleWord));\n\t\twrongGuessesDiv.empty();\n\t\tconsole.log('wins: ', wins);\n\t};\n\n\t// COMMENCE GAME WHEN USER PRESSES THE ENTER KEY\n\tbody.onkeyup = e => {\n\t\tconst isAlphabet = str => /^[a-zA-Z()]$/.test(str);\n\n\t\t// capture key stroke\n\t\tlet { key } = e;\n\n\t\t// if key is a letter turn it to lower case and reassign it to back to key\n\t\tif (isAlphabet(key)) key = key.toLowerCase();\n\n\t\t//\n\t\tlet userGuess = guesses(word, key);\n\n\t\t// this function tests the key entered to find out if it is an alphabetical character\n\t\tconst alphabetTestPast = isAlphabet(key);\n\n\t\t// spread array and push them into the input array\n\t\tif (acknowledgeGuesses) input.push(...userGuess);\n\n\t\tpuzzleWord = replace(puzzleWord, input);\n\n\t\t// ############## USER GUESSED WRONG #############\n\t\tif (!words[count].isIncluded(key) && canIncScores === true && chances >= 1 && alphabetTestPast && !guessedLetters.includes(key)) {\n\t\t\tchances--;\n\t\t\tguessedLetters.push(key);\n\t\t\tmakeElem().addClass('wrong-letter').text(key).appendTo(wrongGuessesDiv);\n\t\t}\n\n\t\t// ########## USER EXHAUSTS ALL HIS GUESSES ##############\n\t\tif (!chances) {\n\t\t\tacknowledgeGuesses = false;\n\t\t\t// alert('You lost!');\n\t\t\t// count = inc();\n\t\t\tmodalMessage.html(`<span class=\"modal__heading--loss\">You lose!</span> \n            <br> \n            The word was <span class=\"modal__notable--loss\">\"${words[count].word}\"</span>\n            <br>\n            Press <span class=\"modal__notable--loss\">\"Enter\"</span> to start over.`);\n\t\t\tmodalBackdrop.show();\n\t\t\tif (key === 'Enter') {\n\t\t\t\tcount = inc();\n\t\t\t\twins = inc();\n\t\t\t\tmodalBackdrop.hide();\n\t\t\t\twrongGuessesDiv.empty();\n\t\t\t\tacknowledgeGuesses = true;\n\t\t\t\tword = words[count].word;\n\t\t\t\tpuzzleWord = makeDashes(word);\n\t\t\t\tinput = [];\n\t\t\t\tchances = 5;\n\t\t\t\twordProgressDiv.html(wrapQuestMark(puzzleWord));\n\t\t\t\twinsDiv.html(`wins: <span class=\"game__score--tally\">${wins}</span>`);\n\t\t\t}\n\t\t}\n\n\t\t// ################ USER GOT ALL THE LETTERS ###############\n\t\tif (words[count].isMatched(puzzleWord)) {\n\t\t\tif (canIncScores) wins++;\n\t\t\tcanIncScores = false;\n\t\t\twinsDiv.html(`wins: <span class=\"game__score--tally\">${wins}</span>`);\n\t\t\twordProgressDiv.text(`Word so far: ${puzzleWord}`);\n\n\t\t\t// modalWordDisplay.text(puzzleWord);\n\t\t\tmodalMessage.html(`<h2 class=\"modal__heading--win\">Congratulations!</h2> \n                \n                <p class=\"modal__notable\">You're correct. The word's <span class=\"modal__notable--win\">\"${puzzleWord}\"</span>\n                Press <span class=\"modal__notable--win\">\"Enter\"</span> to attempt the next word.</p>`);\n\t\t\tmodalBackdrop.show();\n\n\t\t\t//  player completed every word -----TODO-----\n\t\t\tif (wins === words.length) {\n\t\t\t\tmodalMessage.html(`\n                    <h1 class=\"modal__heading--win\">Congratulations</h1>\n                    <p class=\"modal--message\">You've found all the words. Press Enter to over</p>\n                 `);\n\t\t\t}\n\n\t\t\t// move to next word when the user presses enter\n\t\t\tif (key === 'Enter') {\n\t\t\t\tcanIncScores = true;\n\t\t\t\t// ###### USER GOT ALL THE WORDS ########\n\t\t\t\tif (words[count] !== words[words.length - 1]) {\n\t\t\t\t\t//  to next word and reset negative record regarding eat individual word\n\t\t\t\t\tsoftReset();\n\t\t\t\t\tmodalBackdrop.hide();\n\t\t\t\t} else {\n\t\t\t\t\t// the game resets when all the words have been solved\n\t\t\t\t\thardReset();\n\t\t\t\t\tmodalBackdrop.hide();\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\tchancesDiv.html(`chances: <span class=\"game__score--tally\">${chances}</span>`);\n\t\twinsDiv.html(`wins: <span class=\"game__score--tally\">${wins}</span>`);\n\t\twordProgressDiv.html(wrapQuestMark(puzzleWord));\n\t};\n};\n\n// =================== EVENT HANDLER FOR STARTING GAME=======================\nconst handleKeypress = e => {\n\tconst { key, target } = e;\n\n\tconst intro = document.querySelector('.intro');\n\n\tif (key === 'Enter') {\n\t\tgameConfig(gameWords, methodsArr);\n\t\tintro.classList.add('intro--remove');\n\n\t\t// remove listener so that this function is only run once, when the user initially comes to the site\n\t\ttarget.removeEventListener('keypress', handleKeypress);\n\t}\n};\n\ndocument.body.addEventListener('keypress', handleKeypress);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvYXBwLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3NyYy9hcHAuanM/YmQ5YyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG4vL2ltcG9ydCBzdHlsZXNcbmltcG9ydCAnLi9zdHlsZS9tYWluLnNjc3MnO1xuXG5jb25zdCBIQU5HTUFOID0ge307XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1OQU1FU1BBQ0UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuKG5hbWVzcGFjZSA9PiB7XG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tV09SRCBDTEFTUy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyB1c2VkIHRvIG1ha2Ugd29yZHMgZm9yIGdhbWVcblx0Y2xhc3MgV29yZCB7XG5cdFx0Y29uc3RydWN0b3Iod29yZCkge1xuXHRcdFx0dGhpcy53b3JkID0gd29yZC50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0XHR0aGlzLmlzTWF0Y2hlZCA9IHRoaXMuaXNNYXRjaGVkLmJpbmQodGhpcyk7XG5cdFx0XHR0aGlzLmlzSW5jbHVkZWQgPSB0aGlzLmlzSW5jbHVkZWQuYmluZCh0aGlzKTtcblx0XHR9XG5cblx0XHQvLyBtZXRob2QgdG8gdGVzdCBpZiB1c2VyIGxldHRlciBjaG9pY2UgaXMgcHJlc2VudCBpbiB3b3JkXG5cdFx0aXNJbmNsdWRlZChjaGFyKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy53b3JkLmluY2x1ZGVzKGNoYXIudG9Mb3dlckNhc2UoKS50cmltKCkpO1xuXHRcdH1cblxuXHRcdC8vbWV0aG9kIHRvIHRlc3QgaWYgd29yZCBpcyBjb3JyZWN0XG5cdFx0aXNNYXRjaGVkKGxldHRlcnMpIHtcblx0XHRcdHJldHVybiB0aGlzLndvcmQgPT09IGxldHRlcnMudG9Mb3dlckNhc2UoKS50cmltKCkgPyB0cnVlIDogZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVdPUkQgRkFDVE9SWS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyBtYWtlIHNpbmdsZSB3b3JkIG9yIGFuIGFycmF5IG9mIHdvcmRzIGFuZCBtYWtlIGl0IGEgcHJvcGVydHkgb2YgSEFOR01BTlxuXHQvLyBpdCB0YWtlcyBhbiBhIHNpbmdsZSBzdHJpbmcsIG11bHRpcGxlIHN0aW5ncywgb3IgYW4gYXJyYXkgb2Ygc3RpbmdzIGFzIGFuIGFyZ3VtZW50XG5cdEhBTkdNQU4ud29yZEZhY3RvcnkgPSAoLi4ud29yZCkgPT4ge1xuXHRcdC8vIGlmIGFyZ3VtZW50IGlzIGFuIGFycmF5IG1ha2UgaXQgYW4gYXJyYXkgYnkgZGVzdHJ1Y3R1cmluZyBpdFxuXHRcdGlmIChBcnJheS5pc0FycmF5KC4uLndvcmQpKSBbd29yZF0gPSB3b3JkO1xuXG5cdFx0Ly8gaXRlcmF0ZSB0aHJvdWdoIGFuIGFycmF5IG9mIHN0cmluZ3MgYW5kIHJldHVybiBhbiBhcnJheSBvZiBvYmplY3RzXG5cdFx0aWYgKHdvcmQubGVuZ3RoID4gMSkgcmV0dXJuIHdvcmQubWFwKGl0ZW0gPT4gbmV3IFdvcmQoaXRlbSkpO1xuXG5cdFx0Ly8gaWYgYXJndW1lbnQgaXMgYSBzaW5nbGUgc3RyaW5nIGRlc3RydWN0dXJlIHRoZSBhcnJheSBhbmQgb3V0cHV0IGEgc3RyaW5nXG5cdFx0Y29uc3QgW3NpbmdsZVdvcmRdID0gd29yZDtcblxuXHRcdC8vIG1ha2UgYSBzaW5nbGUgb2JqZWN0XG5cdFx0cmV0dXJuIG5ldyBXb3JkKHNpbmdsZVdvcmQpO1xuXHR9O1xuXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLUFSUkFZIElURVJBVE9SIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHQvLyBsb29wIHRocm91Z2ggYXJyYXkgb2Ygd29yZHMgYW5kIGV4ZWN1dGUgY2FsbGJhY2sgZnVuY3Rpb24gdXNpbmcgcmVjdXJzaXZlIGZ1bmN0aW9uXG5cdGNvbnN0IGFycmF5SXRlcmF0b3IgPSAod29yZExpc3QsIGNiKSA9PiB7XG5cdFx0Y29uc3QgW2EsIC4uLmJdID0gd29yZExpc3Q7XG5cdFx0Y2IoYSk7XG5cdFx0aWYgKHdvcmRMaXN0Lmxlbmd0aCA9PT0gMSkgcmV0dXJuO1xuXHRcdGFycmF5SXRlcmF0b3IoYiwgY2IpO1xuXHR9O1xuXG5cdEhBTkdNQU4uYXJyYXlJdGVyYXRvciA9IGFycmF5SXRlcmF0b3I7XG5cblx0Ly8gVGhpcyBtZXRob2QgdGFrZXMgaW4gYSBzdHJpbmcgYW5kIG91dHB1dHMgYSBzdHJpbmcgb2YgdW5kZXJzY29yZXNcblx0Ly8gcHJvcG9ydGlvbmF0ZSB0byB0aGUgbnVtYmVyIG9mIGNoYXJhY3RlcnMgY29udGFpbmVkIGluIHRoZSBzdHJpbmdcblx0Y29uc3QgbWFrZURhc2hlcyA9IGFuc3dlciA9PiB7XG5cdFx0bGV0IGRhc2hlZCA9IFtdO1xuXHRcdChmdW5jdGlvbiBsb29wZXIoYW5zd2VyKSB7XG5cdFx0XHRsZXQgW2EsIC4uLmJdID0gWy4uLmFuc3dlcl07XG5cblx0XHRcdGRhc2hlZC5wdXNoKCc/Jyk7XG5cdFx0XHRpZiAoYW5zd2VyLmxlbmd0aCA9PT0gMSkgcmV0dXJuO1xuXHRcdFx0bG9vcGVyKGIpO1xuXHRcdH0pKGFuc3dlcik7XG5cdFx0cmV0dXJuIGRhc2hlZC5qb2luKCcnKTtcblx0fTtcblxuXHRIQU5HTUFOLm1ha2VEYXNoZXMgPSBtYWtlRGFzaGVzO1xuXG5cdC8vIHRoaXMgaXMgYSBtZXRob2QgdXNlZCBmb3IgRE9NIG1hbmlwdWxhdGlvblxuXHQvLyB0aGUgbmFtZXMgb2YgdGhlIGZ1bmN0aW9ucyB3aXRoaW4gaXQgYm9ycm93IGZyb20galF1ZXJ5XG5cdGNvbnN0IG1ha2VFbGVtID0gZWxlbU5hbWUgPT4ge1xuXHRcdGxldCBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgoZWxlbU5hbWUgPSAnZGl2JykpO1xuXG5cdFx0Ly8gaW5zZXJ0IGVsZW1lbnQgaW50byBhbm90aGVyIGVsZW1lbnRcblx0XHRlbGVtLmFwcGVuZFRvID0gcGFyZW50ID0+IHtcblx0XHRcdHBhcmVudC5hcHBlbmRDaGlsZChlbGVtKTtcblx0XHRcdHJldHVybiBlbGVtO1xuXHRcdH07XG5cblx0XHQvLyBhZGQgdGV4dCB0byBlbGVtZW50XG5cdFx0ZWxlbS50ZXh0ID0gdGV4dCA9PiB7XG5cdFx0XHRlbGVtLnRleHRDb250ZW50ID0gdGV4dDtcblx0XHRcdHJldHVybiBlbGVtO1xuXHRcdH07XG5cblx0XHQvLyBhZGQgSFRNTCB0byBlbGVtZW50XG5cdFx0ZWxlbS5odG1sID0gaHRtbCA9PiB7XG5cdFx0XHRlbGVtLmlubmVySFRNTCA9IGh0bWw7XG5cdFx0XHRyZXR1cm4gZWxlbTtcblx0XHR9O1xuXG5cdFx0Ly8gZW1wdHkgdGhlIGVsZW1lbnQgb2YgYWxsIGl0J3MgY29udGVudFxuXHRcdGVsZW0uZW1wdHkgPSAoKSA9PiB7XG5cdFx0XHRlbGVtLmlubmVySFRNTCA9ICcnO1xuXHRcdFx0cmV0dXJuIGVsZW07XG5cdFx0fTtcblxuXHRcdC8vIGhpZGUgdGhlIGVsZW1lbnRcblx0XHRlbGVtLmhpZGUgPSAoKSA9PiB7XG5cdFx0XHRlbGVtLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcblx0XHRcdHJldHVybiBlbGVtO1xuXHRcdH07XG5cblx0XHQvLyBzaG93IGVsZW1lbnRcblx0XHRlbGVtLnNob3cgPSAoKSA9PiB7XG5cdFx0XHRlbGVtLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG5cdFx0XHRyZXR1cm4gZWxlbTtcblx0XHR9O1xuXG5cdFx0Ly8gYWRkIENTUyBjbGFzcyB0byBlbGVtZW50XG5cdFx0ZWxlbS5hZGRDbGFzcyA9IGNsYXNzTmFtZSA9PiB7XG5cdFx0XHRlbGVtLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcblx0XHRcdHJldHVybiBlbGVtO1xuXHRcdH07XG5cblx0XHQvLyByZW1vdmUgQ1NTIGNsYXNzIGZyb20gZWxlbWVudFxuXHRcdGVsZW0ucmVtb3ZlQ2xhc3MgPSBjbGFzc05hbWUgPT4ge1xuXHRcdFx0ZWxlbS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG5cdFx0XHRyZXR1cm4gZWxlbTtcblx0XHR9O1xuXG5cdFx0cmV0dXJuIGVsZW07XG5cdH07XG5cblx0SEFOR01BTi5tYWtlRWxlbSA9IG1ha2VFbGVtO1xuXG5cdC8vIHRoaXMgdGFrZXMgaW4gdHdvIGFyZ3VtZW50cywgdGhlIGFuc3dlciBhbmQgdGhlIHVzZXIncyBndWVzc1xuXHQvLyBpZiB0aGUgbGV0dGVyIGd1ZXNzIGlzIHByZXNlbnQgaW4gdGhlIGFuc3dlciBpdCBvdXRwdXRzIGFuIGFycmF5IG9mIG9iamVjdHMgd2l0aCB0aGVcblx0Ly8gbGV0dGVyIGFzIGEgc3RyaW5nIGFuZCB0aGUgaW5kZXggYXQgd2hpY2ggdGhlIGxldHRlciBpcyBwcmVzZW50IGluIHRoZSBhbnN3ZXIgc3RyaW5nXG5cdGxldCBndWVzc2VzID0gKGFuc3dlciwgbGV0dGVyR3Vlc3NlZCkgPT4ge1xuXHRcdHJldHVybiAoXG5cdFx0XHQvLyBzcHJlYWQgdGhlIGNoYXJhY3RlcnMgaW4gdGhlIHN0cmluZyBhbmQgcGxhY2UgdGhlbSBpbiBhbiBhcnJheVxuXHRcdFx0Ly8gdGhlbiBpdGVyYXRlIHRocm91Z2ggdGhlbSB1c2luZyB0aGUgcmVkdWNlIGZ1bmN0aW9uIHdoaWNoIHJldHVybnMgYSBhcnJheSB0aGF0IGNvbnRhaW5zXG5cdFx0XHQvLyBhbGwgdGhlIGxldHRlciBndWVzc2VkIGFuZCB0aGUgdGhlIGluZGV4IGF0IHdoaWNoIGl0IGlzIG1hdGNoZWQgaW4gdGhlIGFuc3dlcnMgc3RyaW5nXG5cdFx0XHRbLi4uYW5zd2VyXS5yZWR1Y2UoKGFyciwgbGV0dGVyLCBpbmRleCkgPT4ge1xuXHRcdFx0XHRpZiAobGV0dGVyR3Vlc3NlZCA9PT0gbGV0dGVyKSB7XG5cdFx0XHRcdFx0bGV0IG9iaiA9IHtcblx0XHRcdFx0XHRcdGtleTogbGV0dGVyR3Vlc3NlZCxcblx0XHRcdFx0XHRcdGluZGV4OiBpbmRleFxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0YXJyLnB1c2gob2JqKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gYXJyO1xuXHRcdFx0fSwgW10pXG5cdFx0KTtcblx0fTtcblxuXHRIQU5HTUFOLmd1ZXNzZXMgPSBndWVzc2VzO1xuXG5cdC8vIHJlcGxhY2VzIGNoYXJhY3RlcnMgaW4gYSBzdHJpbmcgd2hlcmUgd2l0aCBwcm92aWRlZCByZXBsYWNlbWVudCBjaGFyYWN0ZXIgYW5kIGluZGV4IHdoZXJlIGl0IHNob3VsZCBiZSBwbGFjZWRcblx0Ly8gaXQgcmVjZWl2ZXMgdHdvIGFyZ3VtZW50cywgYSBzdHJpbmcgYW5kIGFuIGFycmF5IG9mIG9iamVjdHMgY29udGFpbmluZyBhIGNoYXJhY3RlciB0aGUgdXNlciBndWVzc2VkIGFuZCBpdCdzIGluZGV4IGluIHRoZSBhbnN3ZXJcblx0Ly8gYWxsIGNoYXJhY3RlcnMgcHJvdmlkZWQgYXJlIGNvbnRhaW5lZCBpbiB0aGUgYW5zd2VyXG5cdGNvbnN0IHJlcGxhY2UgPSAod29yZCwgaW5wdXQpID0+IHtcblx0XHRsZXQgcmVzdWx0U3RyID0gaW5wdXQucmVkdWNlKChwcmV2aW91cywgZ3Vlc3MpID0+IHtcblx0XHRcdC8vIGluc2VydCBlYWNoIGxldHRlciBhY2NvcmRpbmcgdG8gaXQncyBwcm92aWRlZCBpbmRleFxuXHRcdFx0aWYgKGd1ZXNzLmluZGV4ICE9PSAtMSlcblx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHRwcmV2aW91cy5zdWJzdHJpbmcoMCwgZ3Vlc3MuaW5kZXgpICtcblx0XHRcdFx0XHRndWVzcy5rZXkgK1xuXHRcdFx0XHRcdHByZXZpb3VzLnN1YnN0cmluZyhndWVzcy5pbmRleCArIDEsIHByZXZpb3VzLmxlbmd0aClcblx0XHRcdFx0KTtcblx0XHR9LCB3b3JkKTtcblxuXHRcdC8vIHJldHVybiBhbHRlcmVkIHN0cmluZyBhcyBvdXRwdXRcblx0XHRyZXR1cm4gcmVzdWx0U3RyO1xuXHR9O1xuXG5cdEhBTkdNQU4ucmVwbGFjZSA9IHJlcGxhY2U7XG5cblx0Ly8gdGFrZXMgaW4gYSBudW1iZXIgaW5jcmVtZW50cyBpdCBieSBvbmUgYW5kIHJldHVybnMgdGhlIGluY3JlbWVudGVkIG51bWJlclxuXHRjb25zdCBpbmMgPSAobnVtID0gLTEpID0+IG51bSArIDE7XG5cblx0SEFOR01BTi5pbmMgPSBpbmM7XG59KShIQU5HTUFOKTtcblxuY29uc3QgZ2FtZVdvcmRzID0gSEFOR01BTi53b3JkRmFjdG9yeShbJ29uZScsICdjb21wbGltZW50JywgJ2RlbGliZXJhdGUnLCAnY29uZmlkZW5jZScsICdkeW5hbWljJywgJ2phdmFzY3JpcHQnXSk7XG5jb25zdCB7IG1ha2VFbGVtLCBtYWtlRGFzaGVzLCBndWVzc2VzLCByZXBsYWNlLCBpbmMgfSA9IEhBTkdNQU47XG5jb25zdCBtZXRob2RzQXJyID0gW21ha2VFbGVtLCBtYWtlRGFzaGVzLCBndWVzc2VzLCByZXBsYWNlLCBpbmNdO1xuXG5jb25zdCBnYW1lQ29uZmlnID0gKHdvcmRzLCBtZXRob2RzKSA9PiB7XG5cbiAgICBjb25zdCB3cmFwUXVlc3RNYXJrID0gKHdvcmQpID0+IHtcbiAgICAgICAgY29uc3Qgd29yZEFyciA9IFsuLi53b3JkXS5tYXAoKGxldHRlcikgPT4ge1xuICAgICAgICAgICAgaWYgKGxldHRlciA9PT0gJz8nKSByZXR1cm4gYDxzcGFuIGNsYXNzPVwiZ2FtZV9fd29yZC1wcm9ncmVzcy0tdW5zb2x2ZWRcIj4ke2xldHRlcn08L3NwYW4+YDtcbiAgICAgICAgICAgIHJldHVybiBsZXR0ZXI7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gd29yZEFyci5qb2luKCcnKTtcbiAgICB9O1xuICAgIFxuXHRjb25zdCBbbWFrZUVsZW0sIG1ha2VEYXNoZXMsIGd1ZXNzZXMsIHJlcGxhY2UsIGluY10gPSBtZXRob2RzO1xuXG5cdC8vIGNyZWF0ZSBhbmQgcGxhY2UgZWxlbWVudHMgaW50byBET01cblx0Y29uc3QgZ2FtZSA9IG1ha2VFbGVtKClcblx0XHQuYWRkQ2xhc3MoJ2dhbWUnKVxuXHRcdC5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcblx0Y29uc3Qgc2NvcmVEaXYgPSBtYWtlRWxlbSgpXG5cdFx0LmFkZENsYXNzKCdnYW1lX19zY29yZScpXG5cdFx0LmFwcGVuZFRvKGdhbWUpO1xuXHRjb25zdCBnYW1lV29yZERpdiA9IG1ha2VFbGVtKClcblx0XHQuYWRkQ2xhc3MoJy5nYW1lX193b3JkJylcblx0XHQuYXBwZW5kVG8oZ2FtZSk7XG5cdGNvbnN0IHdyZ0d1ZXNzZXNEaXYgPSBtYWtlRWxlbSgpXG5cdFx0LmFkZENsYXNzKCcuZ2FtZV9fd3JvbmctZ3Vlc3NlcycpXG5cdFx0LmFwcGVuZFRvKGdhbWUpO1xuXG5cdGNvbnN0IGJvZHkgPSBkb2N1bWVudC5ib2R5O1xuXG5cdC8vIHNldCBpbml0aWFsIHZhbHVlcyBmb3IgZ2FtZVxuXG5cdGxldCBpbnB1dCA9IFtdO1xuXG5cdC8vIHRoaXMgc2V0cyB0aGUgY291bnQgdG8gemVyb1xuXHQvLyB0aGUgaW5jIGZ1bmN0aW9uIHJldHVybnMgemVybyB3aGVuIGl0IGlzIHBhc3NlZCBubyBhcmd1bWVudHNcblx0Ly8gb3RoZXJ3aXNlIGl0IHRha2VzIGEgbnVtYmVyIGFzIGFuIGFyZ3VtZW50IGFuZCB0dXJucyB0aGF0IG51bWJlciBpbmNyZW1lbnRlZCBieSAxXG5cdC8vIGluYyg1KSBpcyA1ICsgMSwgd2hpY2ggcmV0dXJucyA2LlxuXG5cdGxldCBjb3VudCA9IGluYygpO1xuXG5cdGxldCB7IHdvcmQgfSA9IHdvcmRzW2NvdW50XTtcblxuXHRsZXQgd2lucyA9IDA7XG5cblx0bGV0IGNoYW5jZXMgPSA1O1xuXG5cdGxldCBndWVzc2VkTGV0dGVycyA9IFtdO1xuXG4gICAgbGV0IHB1enpsZVdvcmQgPSBtYWtlRGFzaGVzKHdvcmQpO1xuXG5cdC8vICMjIyMjIyMjIyMjIyBTRVRUSU5HIElOSVRJQUwgRE9NIEVMRU1FTlRTICMjIyMjIyMjIyMjIyMjI1xuXHRsZXQgd2luc0RpdiA9IG1ha2VFbGVtKClcblx0XHQuYWRkQ2xhc3MoJ2dhbWVfX3Njb3JlLS13aW5zJylcblx0XHQuaHRtbChgd2luczogPHNwYW4gY2xhc3M9XCJnYW1lX19zY29yZS0tdGFsbHlcIj4ke3dpbnN9PC9zcGFuPmApXG5cdFx0LmFwcGVuZFRvKHNjb3JlRGl2KTtcblx0bGV0IGNoYW5jZXNEaXYgPSBtYWtlRWxlbSgpXG5cdFx0LmFkZENsYXNzKCdnYW1lX19zY29yZS0tY2hhbmNlcycpXG5cdFx0Lmh0bWwoYGNoYW5jZXM6IDxzcGFuIGNsYXNzPVwiZ2FtZV9fc2NvcmUtLXRhbGx5XCI+JHtjaGFuY2VzfTwvc3Bhbj5gKVxuXHRcdC5hcHBlbmRUbyhzY29yZURpdik7XG5cdGxldCB3cm9uZ0d1ZXNzZXNEaXYgPSBtYWtlRWxlbSgpXG5cdFx0LmFkZENsYXNzKCd3cm9uZy1ndWVzc2VzJylcblx0XHQuYXBwZW5kVG8od3JnR3Vlc3Nlc0Rpdik7XG5cdGxldCB3b3JkUHJvZ3Jlc3NEaXYgPSBtYWtlRWxlbSgpXG5cdFx0LmFkZENsYXNzKCdnYW1lX193b3JkLXByb2dyZXNzJylcblx0XHQuaHRtbCh3cmFwUXVlc3RNYXJrKHB1enpsZVdvcmQpKVxuXHRcdC5hcHBlbmRUbyhnYW1lV29yZERpdik7XG5cblx0Y29uc3QgbW9kYWxCYWNrZHJvcCA9IG1ha2VFbGVtKClcblx0XHQuYWRkQ2xhc3MoJ21vZGFsX19iYWNrZHJvcCcpXG5cdFx0LmhpZGUoKVxuXHRcdC5hcHBlbmRUbyhib2R5KTtcblx0Y29uc3QgbW9kYWwgPSBtYWtlRWxlbSgpXG5cdFx0LmFkZENsYXNzKCdtb2RhbCcpXG5cdFx0LmFwcGVuZFRvKG1vZGFsQmFja2Ryb3ApO1xuXHQvLyBjb25zdCBtb2RhbFdvcmREaXNwbGF5ID0gbWFrZUVsZW0oJ2gxJykuYWRkQ2xhc3MoJ21vZGFsLS13b3JkJykuYXBwZW5kVG8obW9kYWwpO1xuXHRjb25zdCBtb2RhbE1lc3NhZ2UgPSBtYWtlRWxlbSgpXG5cdFx0LmFkZENsYXNzKCdtb2RhbC0tbWVzc2FnZScpXG5cdFx0LmFwcGVuZFRvKG1vZGFsKTtcblx0Ly8gbGV0IHZpY3RvcnkgPSBmYWxzZTsgLy8gfn5+fn5+fn4gTk8gVVNFIFlFVCB+fn5+fn5+fn5cblxuXHRsZXQgY2FuSW5jU2NvcmVzID0gdHJ1ZTtcblx0bGV0IGFja25vd2xlZGdlR3Vlc3NlcyA9IHRydWU7XG5cblx0Y29uc3Qgc29mdFJlc2V0ID0gKCkgPT4ge1xuXHRcdGd1ZXNzZWRMZXR0ZXJzID0gW107XG5cdFx0Y291bnQgPSBpbmMoY291bnQpO1xuXHRcdHdvcmQgPSB3b3Jkc1tjb3VudF0ud29yZDtcblx0XHRwdXp6bGVXb3JkID0gbWFrZURhc2hlcyh3b3JkKTtcblx0XHRpbnB1dCA9IFtdO1xuXHRcdGNoYW5jZXMgPSA1O1xuXHRcdHdvcmRQcm9ncmVzc0Rpdi50ZXh0KGBXb3JkIHNvIGZhcjogJHtwdXp6bGVXb3JkfWApO1xuXHRcdHdyb25nR3Vlc3Nlc0Rpdi5lbXB0eSgpO1xuXHR9O1xuXG5cdC8vIFJFU1RBUlRTIEdBTUUgLS0gU1RBUlRTIEZST00gVEhFIEJFR0lOTklOR1xuXHRjb25zdCBoYXJkUmVzZXQgPSAoKSA9PiB7XG5cdFx0Z3Vlc3NlZExldHRlcnMgPSBbXTtcblx0XHRjYW5JbmNTY29yZXMgPSB0cnVlO1xuXHRcdGNvdW50ID0gaW5jKCk7XG5cdFx0d29yZCA9IHdvcmRzW2NvdW50XS53b3JkO1xuXHRcdHB1enpsZVdvcmQgPSBtYWtlRGFzaGVzKHdvcmQpO1xuXHRcdGlucHV0ID0gW107XG5cdFx0Y2hhbmNlcyA9IDU7XG5cdFx0d2lucyA9IDA7XG5cdFx0d29yZFByb2dyZXNzRGl2Lmh0bWwod3JhcFF1ZXN0TWFyayhwdXp6bGVXb3JkKSk7XG4gICAgICAgIHdyb25nR3Vlc3Nlc0Rpdi5lbXB0eSgpO1xuICAgICAgICBjb25zb2xlLmxvZygnd2luczogJywgd2lucyk7XG5cdH07XG5cblx0Ly8gQ09NTUVOQ0UgR0FNRSBXSEVOIFVTRVIgUFJFU1NFUyBUSEUgRU5URVIgS0VZXG5cdGJvZHkub25rZXl1cCA9IGUgPT4ge1xuXHRcdGNvbnN0IGlzQWxwaGFiZXQgPSBzdHIgPT4gL15bYS16QS1aKCldJC8udGVzdChzdHIpO1xuXG5cdFx0Ly8gY2FwdHVyZSBrZXkgc3Ryb2tlXG5cdFx0bGV0IHsga2V5IH0gPSBlO1xuXG5cdFx0Ly8gaWYga2V5IGlzIGEgbGV0dGVyIHR1cm4gaXQgdG8gbG93ZXIgY2FzZSBhbmQgcmVhc3NpZ24gaXQgdG8gYmFjayB0byBrZXlcblx0XHRpZiAoaXNBbHBoYWJldChrZXkpKSBrZXkgPSBrZXkudG9Mb3dlckNhc2UoKTtcblxuXHRcdC8vXG5cdFx0bGV0IHVzZXJHdWVzcyA9IGd1ZXNzZXMod29yZCwga2V5KTtcblxuXHRcdC8vIHRoaXMgZnVuY3Rpb24gdGVzdHMgdGhlIGtleSBlbnRlcmVkIHRvIGZpbmQgb3V0IGlmIGl0IGlzIGFuIGFscGhhYmV0aWNhbCBjaGFyYWN0ZXJcblx0XHRjb25zdCBhbHBoYWJldFRlc3RQYXN0ID0gaXNBbHBoYWJldChrZXkpO1xuXG5cdFx0Ly8gc3ByZWFkIGFycmF5IGFuZCBwdXNoIHRoZW0gaW50byB0aGUgaW5wdXQgYXJyYXlcblx0XHRpZiAoYWNrbm93bGVkZ2VHdWVzc2VzKSBpbnB1dC5wdXNoKC4uLnVzZXJHdWVzcyk7XG5cbiAgICAgICAgcHV6emxlV29yZCA9IHJlcGxhY2UocHV6emxlV29yZCwgaW5wdXQpO1xuICAgICAgICBcblx0XHQvLyAjIyMjIyMjIyMjIyMjIyBVU0VSIEdVRVNTRUQgV1JPTkcgIyMjIyMjIyMjIyMjI1xuXHRcdGlmIChcblx0XHRcdCF3b3Jkc1tjb3VudF0uaXNJbmNsdWRlZChrZXkpICYmXG5cdFx0XHRjYW5JbmNTY29yZXMgPT09IHRydWUgJiZcblx0XHRcdGNoYW5jZXMgPj0gMSAmJlxuXHRcdFx0YWxwaGFiZXRUZXN0UGFzdCAmJlxuXHRcdFx0IWd1ZXNzZWRMZXR0ZXJzLmluY2x1ZGVzKGtleSlcblx0XHQpIHtcblx0XHRcdGNoYW5jZXMtLTtcblx0XHRcdGd1ZXNzZWRMZXR0ZXJzLnB1c2goa2V5KTtcblx0XHRcdG1ha2VFbGVtKClcblx0XHRcdFx0LmFkZENsYXNzKCd3cm9uZy1sZXR0ZXInKVxuXHRcdFx0XHQudGV4dChrZXkpXG5cdFx0XHRcdC5hcHBlbmRUbyh3cm9uZ0d1ZXNzZXNEaXYpO1xuXHRcdH1cblxuXHRcdC8vICMjIyMjIyMjIyMgVVNFUiBFWEhBVVNUUyBBTEwgSElTIEdVRVNTRVMgIyMjIyMjIyMjIyMjIyNcblx0XHRpZiAoIWNoYW5jZXMpIHtcblx0XHRcdGFja25vd2xlZGdlR3Vlc3NlcyA9IGZhbHNlO1xuXHRcdFx0Ly8gYWxlcnQoJ1lvdSBsb3N0IScpO1xuXHRcdFx0Ly8gY291bnQgPSBpbmMoKTtcblx0XHRcdG1vZGFsTWVzc2FnZS5odG1sKGA8c3BhbiBjbGFzcz1cIm1vZGFsX19oZWFkaW5nLS1sb3NzXCI+WW91IGxvc2UhPC9zcGFuPiBcbiAgICAgICAgICAgIDxicj4gXG4gICAgICAgICAgICBUaGUgd29yZCB3YXMgPHNwYW4gY2xhc3M9XCJtb2RhbF9fbm90YWJsZS0tbG9zc1wiPlwiJHt3b3Jkc1tjb3VudF0ud29yZH1cIjwvc3Bhbj5cbiAgICAgICAgICAgIDxicj5cbiAgICAgICAgICAgIFByZXNzIDxzcGFuIGNsYXNzPVwibW9kYWxfX25vdGFibGUtLWxvc3NcIj5cIkVudGVyXCI8L3NwYW4+IHRvIHN0YXJ0IG92ZXIuYCk7XG5cdFx0XHRtb2RhbEJhY2tkcm9wLnNob3coKTtcblx0XHRcdGlmIChrZXkgPT09ICdFbnRlcicpIHtcblx0XHRcdFx0Y291bnQgPSBpbmMoKTtcblx0XHRcdFx0d2lucyA9IGluYygpO1xuXHRcdFx0XHRtb2RhbEJhY2tkcm9wLmhpZGUoKTtcblx0XHRcdFx0d3JvbmdHdWVzc2VzRGl2LmVtcHR5KCk7XG5cdFx0XHRcdGFja25vd2xlZGdlR3Vlc3NlcyA9IHRydWU7XG5cdFx0XHRcdHdvcmQgPSB3b3Jkc1tjb3VudF0ud29yZDtcblx0XHRcdFx0cHV6emxlV29yZCA9IG1ha2VEYXNoZXMod29yZCk7XG5cdFx0XHRcdGlucHV0ID0gW107XG5cdFx0XHRcdGNoYW5jZXMgPSA1O1xuXHRcdFx0XHR3b3JkUHJvZ3Jlc3NEaXYuaHRtbCh3cmFwUXVlc3RNYXJrKHB1enpsZVdvcmQpKTtcblx0XHRcdFx0d2luc0Rpdi5odG1sKGB3aW5zOiA8c3BhbiBjbGFzcz1cImdhbWVfX3Njb3JlLS10YWxseVwiPiR7d2luc308L3NwYW4+YCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gIyMjIyMjIyMjIyMjIyMjIyBVU0VSIEdPVCBBTEwgVEhFIExFVFRFUlMgIyMjIyMjIyMjIyMjIyMjXG5cdFx0aWYgKHdvcmRzW2NvdW50XS5pc01hdGNoZWQocHV6emxlV29yZCkpIHtcblx0XHRcdGlmIChjYW5JbmNTY29yZXMpIHdpbnMrKztcblx0XHRcdGNhbkluY1Njb3JlcyA9IGZhbHNlO1xuXHRcdFx0d2luc0Rpdi5odG1sKGB3aW5zOiA8c3BhbiBjbGFzcz1cImdhbWVfX3Njb3JlLS10YWxseVwiPiR7d2luc308L3NwYW4+YCk7XG5cdFx0XHR3b3JkUHJvZ3Jlc3NEaXYudGV4dChgV29yZCBzbyBmYXI6ICR7cHV6emxlV29yZH1gKTtcblxuXHRcdFx0Ly8gbW9kYWxXb3JkRGlzcGxheS50ZXh0KHB1enpsZVdvcmQpO1xuXHRcdFx0bW9kYWxNZXNzYWdlLmh0bWwoYDxoMiBjbGFzcz1cIm1vZGFsX19oZWFkaW5nLS13aW5cIj5Db25ncmF0dWxhdGlvbnMhPC9oMj4gXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJtb2RhbF9fbm90YWJsZVwiPllvdSdyZSBjb3JyZWN0LiBUaGUgd29yZCdzIDxzcGFuIGNsYXNzPVwibW9kYWxfX25vdGFibGUtLXdpblwiPlwiJHtwdXp6bGVXb3JkfVwiPC9zcGFuPlxuICAgICAgICAgICAgICAgIFByZXNzIDxzcGFuIGNsYXNzPVwibW9kYWxfX25vdGFibGUtLXdpblwiPlwiRW50ZXJcIjwvc3Bhbj4gdG8gYXR0ZW1wdCB0aGUgbmV4dCB3b3JkLjwvcD5gKTtcblx0XHRcdG1vZGFsQmFja2Ryb3Auc2hvdygpO1xuXG4gICAgICAgICAgICAvLyAgcGxheWVyIGNvbXBsZXRlZCBldmVyeSB3b3JkIC0tLS0tVE9ETy0tLS0tXG4gICAgICAgICAgICBpZiAod2lucyA9PT0gd29yZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgbW9kYWxNZXNzYWdlLmh0bWwoYFxuICAgICAgICAgICAgICAgICAgICA8aDEgY2xhc3M9XCJtb2RhbF9faGVhZGluZy0td2luXCI+Q29uZ3JhdHVsYXRpb25zPC9oMT5cbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJtb2RhbC0tbWVzc2FnZVwiPllvdSd2ZSBmb3VuZCBhbGwgdGhlIHdvcmRzLiBQcmVzcyBFbnRlciB0byBvdmVyPC9wPlxuICAgICAgICAgICAgICAgICBgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuXHRcdFx0Ly8gbW92ZSB0byBuZXh0IHdvcmQgd2hlbiB0aGUgdXNlciBwcmVzc2VzIGVudGVyXG5cdFx0XHRpZiAoa2V5ID09PSAnRW50ZXInKSB7XG5cdFx0XHRcdGNhbkluY1Njb3JlcyA9IHRydWU7XG5cdFx0XHRcdC8vICMjIyMjIyBVU0VSIEdPVCBBTEwgVEhFIFdPUkRTICMjIyMjIyMjXG5cdFx0XHRcdGlmICh3b3Jkc1tjb3VudF0gIT09IHdvcmRzW3dvcmRzLmxlbmd0aCAtIDFdKSB7XG5cdFx0XHRcdFx0Ly8gIHRvIG5leHQgd29yZCBhbmQgcmVzZXQgbmVnYXRpdmUgcmVjb3JkIHJlZ2FyZGluZyBlYXQgaW5kaXZpZHVhbCB3b3JkXG5cdFx0XHRcdFx0c29mdFJlc2V0KCk7XG5cdFx0XHRcdFx0bW9kYWxCYWNrZHJvcC5oaWRlKCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gdGhlIGdhbWUgcmVzZXRzIHdoZW4gYWxsIHRoZSB3b3JkcyBoYXZlIGJlZW4gc29sdmVkXG5cdFx0XHRcdFx0aGFyZFJlc2V0KCk7XG5cdFx0XHRcdFx0bW9kYWxCYWNrZHJvcC5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cbiAgICAgICAgY2hhbmNlc0Rpdi5odG1sKGBjaGFuY2VzOiA8c3BhbiBjbGFzcz1cImdhbWVfX3Njb3JlLS10YWxseVwiPiR7Y2hhbmNlc308L3NwYW4+YCk7XG4gICAgICAgIHdpbnNEaXYuaHRtbChgd2luczogPHNwYW4gY2xhc3M9XCJnYW1lX19zY29yZS0tdGFsbHlcIj4ke3dpbnN9PC9zcGFuPmApO1xuXHRcdHdvcmRQcm9ncmVzc0Rpdi5odG1sKHdyYXBRdWVzdE1hcmsocHV6emxlV29yZCkpO1xuXHR9O1xufTtcblxuLy8gPT09PT09PT09PT09PT09PT09PSBFVkVOVCBIQU5ETEVSIEZPUiBTVEFSVElORyBHQU1FPT09PT09PT09PT09PT09PT09PT09PT1cbmNvbnN0IGhhbmRsZUtleXByZXNzID0gZSA9PiB7XG5cdGNvbnN0IHsga2V5LCB0YXJnZXQgfSA9IGU7XG5cblx0Y29uc3QgaW50cm8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaW50cm8nKTtcblxuXHRpZiAoa2V5ID09PSAnRW50ZXInKSB7XG5cdFx0Z2FtZUNvbmZpZyhnYW1lV29yZHMsIG1ldGhvZHNBcnIpO1xuXHRcdGludHJvLmNsYXNzTGlzdC5hZGQoJ2ludHJvLS1yZW1vdmUnKTtcblxuXHRcdC8vIHJlbW92ZSBsaXN0ZW5lciBzbyB0aGF0IHRoaXMgZnVuY3Rpb24gaXMgb25seSBydW4gb25jZSwgd2hlbiB0aGUgdXNlciBpbml0aWFsbHkgY29tZXMgdG8gdGhlIHNpdGVcblx0XHR0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCBoYW5kbGVLZXlwcmVzcyk7XG5cdH1cbn07XG5cbmRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCBoYW5kbGVLZXlwcmVzcyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2FwcC5qcyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFoQkE7QUFDQTtBQWtCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQWJBO0FBZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUdBO0FBR0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFJQTtBQUdBO0FBQ0E7QUFJQTtBQUlBO0FBR0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRkE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUFBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/app.js\n");

/***/ }),

/***/ "./src/style/main.scss":
/***/ (function(module, exports) {

eval("// removed by extract-text-webpack-plugin//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc3R5bGUvbWFpbi5zY3NzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL3N0eWxlL21haW4uc2Nzcz80NjA2Il0sInNvdXJjZXNDb250ZW50IjpbIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc3R5bGUvbWFpbi5zY3NzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9zdHlsZS9tYWluLnNjc3Ncbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/style/main.scss\n");

/***/ })

/******/ });