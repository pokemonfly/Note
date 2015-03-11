// UI 关联DOM用
// 以防万一
window.requestAnimationFrame = window.requestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};
ap.module("ui").requires("utils").defines(function() {
	"use strict";
	ap.ui = {
		canvas: null,
		life: null,

		shield: null,
		skillList: [],
		// 战斗信息计数 最多30个
		messageCount: 0,
		// 当前播放的剧情
		script: null,
		// 当前播放到的位置
		cur: 0,
		// 剧情的返回值
		returnValue: 0,
		// 剧情播放完的回调
		callback: null,
		// 当前游戏动画循环调用用
		_anims: {},
		_next: 1,
		// =============DOM关联==================
		// loading界面
		loading: null,
		// 主界面
		main: null,
		startGame: null,
		loadGame: null,
		// 游戏界面
		gameUI: null,
		// 战斗信息
		messageList: null,
		// 剧情界面
		scenario: null,
		scenarioHasEvent: false,
		// 界面的头像		
		head: null,
		// 界面的文本
		lines: null,
		// 剧情界面的选择列表
		selecter: null,
		selectList: null,

		init: function() {
			this.loading = ap.$("#loading");
			this.main = ap.$("#main");
			this.startGame = ap.$("#newGame");
			this.loadGame = ap.$("#loadGame");
			this.gameUI = ap.$("#ui");
			this.messageList = ap.$("#messageInfo");
			this.scenario = ap.$("#scenario");
			this.head = ap.$("#head");
			this.lines = ap.$("#lines");
			this.selecter = ap.$("#selecter");
			this.selectList = ap.$("#selectList");

			this.canvas = ap.$("canvas")[0];
			this.shield = ap.$("#shield");
			this.life = ap.$("#life");

			this.canvas.height = document.body.clientHeight;
			this.canvas.width = document.body.clientWidth;

			ap.$("#close").addEventListener("click", this.skipScenario.bind(this), false);

			// 战斗信息列表的滚动事件
			ap.$("#message").addEventListener("mousewheel", function(e) {
				var w = e.wheelDelta > 0 ? 1 : -1,
					ul = this.children[0].children[0],
					height = ul.offsetHeight,
					pHeight = ul.parentNode.offsetHeight,
					top = +(ul.style.top || "0px").replace("px", ""),
					newTop = top;
				if (height > pHeight) {
					newTop += 5 * w;
					if (newTop > 0) {
						newTop = 0;
					}
					if (newTop < pHeight - height) {
						newTop = pHeight - height;
					}
					ul.style.top = newTop + "px";
				}
			}, false);
			// 清空信息内容
			if (this.messageList.children.length > 0) {
				this.messageList.innerHTML = "";
			}
			this.addMessage("谜之音：欢迎开始冒险~");
		},
		// CSS 操作
		hasClass: function(obj, cls) {
			return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
		},
		addClass: function(obj, cls) {
			if (!this.hasClass(obj, cls)) {
				obj.className += " " + cls;
			}
		},
		removeClass: function(obj, cls) {
			if (this.hasClass(obj, cls)) {
				var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
				obj.className = obj.className.replace(reg, '');
			}
		},
		setLife: function(per) {

		},
		setShield: function(per) {
			if (per > 0) {
				this.shield.style.display = "";
				this.addClass(life, "hasShield");
			} else {
				this.shield.style.display = "none";
				this.removeClass(life, "hasShield");
			}
		},
		// 添加战斗信息
		addMessage: function(message) {
			this.messageCount++;
			// 超出消除
			if (this.messageCount > 30) {
				this.messageList.removeChild(this.messageList.children[0]);
				this.messageCount--;
			}
			var m = ap.$new("li");
			m.innerHTML = (new Date()).toTimeString().substr(0, 8) + " " + message;
			this.messageList.appendChild(m);
			// 保持显示最后一行
			var height = this.messageList.offsetHeight,
				pHeight = this.messageList.parentNode.offsetHeight;
			if (height > pHeight) {
				this.messageList.style.top = pHeight - height + "px";
			}
		},
		// 动画循环播放
		setAnimation: function(callback) {
			var current = this._next++;
			this._anims[current] = true;
			var animate = function() {
				if (!ap.ui._anims[current]) {
					return;
				}
				window.requestAnimationFrame(animate);
				callback();
			};
			window.requestAnimationFrame(animate);
			return current;
		},
		// 清空当前播放的动画
		clearAnimation: function(id) {
			delete this._anims[id];
		},
		// 播放剧情
		playScenario: function(scenario) {
			this.script = scenario.script;
			if (scenario.needPause) {
				ap.system.pause();
			}
			// 显示剧情界面
			this.removeClass(this.scenario, "hidden");
			this.addClass(this.main, "hidden");
			this.addClass(this.gameUI, "hidden");

			this.callback = scenario.callback || {};
			this.cur = 0;
			this.playNext();
		},
		// 播放下一句
		playNext: function() {
			if (this.cur == this.script.length) {
				// 剧情播放完毕执行回调
				if (this.callback) {
					this.callback(this.returnValue);
				}
				this.scenarioRemoveListener();
				return;
			}
			var section = this.script[this.cur];
			this.cur++;
			// 判断当前条件是否要播放 针对选择枝
			if (section.which && !section.which(this.returnValue)) {
				this.playNext();
				return;
			}
			// 设置头像
			if (section.icon) {
				this.head.className = section.icon.toLowerCase();
			} else {
				this.head.className = "none";
			}
			// 设置台词
			if (section.words) {
				this.lines.innerHTML = section.words;
			} else {
				this.lines.innerHTML = "";
			}
			// 设置背景  设计保留 暂无合适背景Orz
			// if (section.background) {
			// } else {
			// }
			// 创建一个选择菜单 并关联监听器
			if (section.select) {
				this.removeClass(this.selecter, "hidden");
				this.selectList.innerHTML = "";
				var fr = document.createDocumentFragment();
				var i = 0;
				section.select.map(function(s) {
					var li = ap.$new("li");
					li.innerHTML = s;
					li.addEventListener("click", (function(val) {
						return function() {
							ap.ui.returnValue = val;
							ap.ui.playNext();
						};
					})(i));
					fr.appendChild(li);
					i++;
				});
				this.selectList.appendChild(fr);
				this.scenarioRemoveListener();
			} else {
				this.addClass(this.selecter, "hidden");
				// 添加动作
				if (!this.scenarioHasEvent) {
					window.addEventListener("keyup", this.playNextHandler, false);
					window.addEventListener("mouseup", this.playNextHandler, false);
					this.scenarioHasEvent = true;
				}
			}

		},
		// 跳过剧情
		skipScenario: function() {
			this.cur = this.script.length;
			ap.ui.playNext();
		},
		playNextHandler: function(e) {
			// 点击画面或者按下空格或Enter时
			if (e.type !== 'keyup' || e.keyCode === 32 || e.keyCode === 13) {
				ap.ui.playNext();
			}
		},
		// 去掉剧情绑定的事件
		scenarioRemoveListener: function() {
			if (this.scenarioHasEvent) {
				window.removeEventListener("keyup", this.playNextHandler, false);
				window.removeEventListener("mouseup", this.playNextHandler, false);
				this.scenarioHasEvent = false;
			}
		},
		// 接收画面点击的选项
		setResultValue: function(val) {
			this.returnValue = val;
			this.playNext();
		},
		// 画面点击新游戏
		newGame: function() {
			// 触发新开游戏事件
			ap.mediator.fire("NEWGAME");
		},
		showMain: function() {
			this.addClass(this.loading, "hidden");
			this.removeClass(this.main, "hidden");
			this.startGame.addEventListener("click", (function() {
				this.addClass(this.main, "hidden");
				this.removeClass(this.gameUI, "hidden");
				this.newGame();
				event.stopPropagation();
				event.preventDefault();
			}).bind(this));
		},
		showGame: function() {
			this.addClass(this.loading, "hidden");
			this.addClass(this.main, "hidden");
			this.addClass(this.scenario, "hidden");
			this.removeClass(this.gameUI, "hidden");
		}
	};
});