// UI 关联DOM用
// 以防万一
window.requestAnimationFrame = window.requestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};
ap.module("ui").requires("utils").defines(function() {
	"use strict";
	ap.ui = {
		_: ap.utils,
		canvas: null,
		life: null,

		shield: null,
		skillList: [],
		messageField: null,
		// 缓存最近30条信息
		messages: [],
		// 当前播放的剧情
		script: null,
		// 当前播放到的位置
		cur: 0,
		// 剧情的返回值
		returnValue: null,
		// 剧情播放完的回调
		callback: null,
		// 当前动画循环调用用
		_anims : {},
		_next : 1,
		init: function() {
			this.canvas = ap.$("canvas")[0];
			this.shield = ap.$("#shield");
			this.life = ap.$("#life");

			this.canvas.height = document.body.clientHeight;
			this.canvas.width = document.body.clientWidth;


		},
		setLife: function(per) {

		},
		setShield: function(per) {
			if (per > 0) {
				this.shield.style.display = "";
				_.addClass(life, "hasShield");
			} else {
				this.shield.style.display = "none";
				_.removeClass(life, "hasShield");
			}
		},
		setMessage: function(message) {
			this.messages.push(message);
			// 超出消除
			if (this.messages.length > 30) {
				this.messages.shift();
			}
			this.messagesField.innerHTML = this.messages.join("\n");
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
			this.callback = scenario.callback || {};
			this.cur = 0;
			this.playNext();
		},
		// 播放下一句
		playNext: function() {
			this.cur++;
			if (this.cur == this.script.length) {
				// 剧情播放完毕执行回调
				if (this.callback) {
					this.callback(this.returnValue);
				}
			}
			var section = this.script[this.cur];
			// 判断当前条件是否要播放 针对选择枝
			if (section.which && !section.which(this.returnValue)) {
				this.playNext();
				return;
			}
			// 设置头像
			if (section.icon) {

			} else {

			}
			// 设置台词
			if (section.words) {

			} else {

			}
			// 设置背景 
			if (section.background) {

			} else {

			}
			// 创建一个选择菜单 并关联监听器
			if (section.select) {

			} else {

			}
		},
		// 接收画面点击的选项
		setResultValue: function(val) {
			this.returnValue = val;
			this.playNext();
		},
		// 画面点击新游戏
		newGame: function() {
			ap.mediator.fire("NEWGAME");
		}
	};
});