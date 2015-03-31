// 入口 所有的js都通过loader去加载
(function() {
	"use strict";
	// bind方法，以防万一。代码来自网络
	Function.prototype.bind = Function.prototype.bind || function(oThis) {
		if (typeof this !== "function") {
			throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
		}
		var aArgs = Array.prototype.slice.call(arguments, 1),
			fToBind = this,
			fNOP = function() {},
			fBound = function() {
				return fToBind.apply((this instanceof fNOP && oThis ? this : oThis), aArgs.concat(Array.prototype.slice.call(arguments)));
			};
		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();
		return fBound;
	};
	// ap为本程序使用的名空间
	window.ap = {
		// 脚本的默认路径
		lib: 'lib/',
		// 当前加载的模块
		modules: {},
		// 当前依赖的模块
		resources: [],
		// 加载模块用的指针
		_current: null,
		// 等待加载的模块队列
		_loadQueue: [],
		// 等待加载的模块数
		_waitForOnload: 0,
		// 选择器 缩写
		$: function(selector) {
			return selector.charAt(0) == '#' ? document.getElementById(selector.substr(1)) : document.getElementsByTagName(selector);
		},
		$new: function(name) {
			return document.createElement(name);
		},
		log: function(string) {
			console.log(string);
		},
		// 模块
		module: function(name) {
			if (this._current) {
				throw ("模块 '" + this._current.name + "' 未加载");
			}
			if (this.modules[name] && this.modules[name].body) {
				throw ("模块 '" + name + "' 已定义过");
			}
			this._current = {
				name: name,
				requires: [],
				loaded: false,
				body: null
			};
			this.modules[name] = this._current;
			this._loadQueue.push(this._current);
			return this;
		},
		// 模块的依赖关系
		requires: function() {
			this._current.requires = Array.prototype.slice.call(arguments);
			return this;
		},
		// 模块的内容
		defines: function(body) {
			this._current.body = body;
			// 当前模块定义完成，清空指针
			this._current = null;
			this._initDOMReady();
		},
		// 等待DOM加载完成后加载模块
		_initDOMReady: function() {
			if (this.modules['dom.ready'] && this.modules['dom.ready'].loaded) {
				this._execModules();
				return;
			}
			// Dom加载完成
			this.modules['dom.ready'] = {
				requires: [],
				loaded: false,
				body: null
			};
			this._waitForOnload++;
			if (document.readyState === 'complete') {
				this._DOMReady();
			} else {
				document.addEventListener('DOMContentLoaded', this._DOMReady.bind(this), false);
				window.addEventListener('load', this._DOMReady.bind(this), false);
			}
		},
		// 检查dom是否加载完成
		_DOMReady: function() {
			if (!this.modules['dom.ready'] || !this.modules['dom.ready'].loaded) {
				if (!document.body) {
					return setTimeout(this._DOMReady, 15);
				}
				this.modules['dom.ready'].loaded = true;
				this._waitForOnload--;
				this._execModules();
			}
			return 0;
		},
		// 顺序加载已定义的模块
		_execModules: function() {
			var modulesLoaded = false;
			for (var i = 0; i < this._loadQueue.length; i++) {
				var m = this._loadQueue[i];
				var dependenciesLoaded = true;
				// 判断依赖的模块是否加载完成
				for (var j = 0; j < m.requires.length; j++) {
					var name = m.requires[j];
					if (!this.modules[name]) {
						dependenciesLoaded = false;
						this._loadScript(name, m.name);
					} else if (!this.modules[name].loaded) {
						dependenciesLoaded = false;
					}
				}
				if (dependenciesLoaded && m.body) {
					this._loadQueue.splice(i, 1);
					m.loaded = true;
					m.body();
					modulesLoaded = true;
					i--;
				}
			}
			if (modulesLoaded) {
				this._execModules();
			} else if (this._waitForOnload === 0 && this._loadQueue.length !== 0) {
				var unresolved = [];
				for (var i = 0; i < this._loadQueue.length; i++) {
					var unloaded = [];
					var requires = this._loadQueue[i].requires;
					for (var j = 0; j < requires.length; j++) {
						var m = this.modules[requires[j]];
						if (!m || !m.loaded) {
							unloaded.push(requires[j]);
						}
					}
					unresolved.push(this._loadQueue[i].name + ' (requires: ' + unloaded.join(', ') + ')');
				}
				throw ('有无法加载的模块:' + unresolved.join('\n'));
			}
		},
		// 加载js脚本文件
		_loadScript: function(name, requiredFrom) {
			ap.modules[name] = {
				name: name,
				requires: [],
				loaded: false,
				body: null
			};
			ap._waitForOnload++;
			var path = ap.lib + name + '.js';
			var script = ap.$new('script');
			script.type = 'text/javascript';
			script.src = path;
			script.onload = function() {
				ap._execModules();
				ap._waitForOnload--;
			};
			script.onerror = function() {
				throw ('模块： ' + name + ' at ' + path + ' ' + 'required from ' + requiredFrom + '执行错误');
			};
			ap.$('head')[0].appendChild(script);
		}
	};
	// 开始顺序加载基础模块
	ap.module('loader').requires("cheat", "system").defines(function() {
		ap.log("《安妮与提伯斯》是使用LOL安妮人设的同人作品。");
		ap.log(" 素材来自饥荒，部分设定取自激战2。");
		ap.log(" 游戏代码仅使用了原生javascript，为展示代码故未压缩。");
		ap.log(" 请勿随意分享。有疑问请联系pokemonfly@outlook.com");
		ap.log(" 												--2015年3月 杨");
		// 开始初始化
		// setTimeout(ap.system.init, 5000);
		ap.system.init();
	});
})();