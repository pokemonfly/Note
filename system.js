// 系统对象 （创建游戏实例，运行游戏实例，不影响游戏实例本身）
ap.module("system").requires("ui", "mediator", "config", "input", "timer").defines(function() {
	"use strict";
	ap.system = {
		// 当前游戏是否运行中
		running: false,
		// 系统刷新用定时器的id
		loopId: null,
		// context: null,
		init: function() {
			// DOM绑定 初始
			ap.ui.init();
			// 中介初始化
			ap.mediator.init();
			// 输入组件 初始化
			ap.input.init();
			// this.context = ap.ui.canvas.getContext('2d');
			// 初始化完毕后 显示主界面
			ap.ui.showMain();
		},
		resize: function() {},
		// 新开游戏
		newGame: function(val) {
			// console.log(val);
			ap.ui.showGame();
			ap.game = new ap.Game();
			this.startLoop();
		},
		// 循环播放
		startLoop : function () {
			this.running = true;
			this.loopId = ap.ui.setAnimation(this.run.bind(this));
		},
		// 暂停
		pause : function () {
			if (this.running) {
				ap.ui.clearAnimation(this.loopId);
				this.running = false;
			}
		},
		// 运行中
		run: function() {
			ap.Timer.tick();
			// 执行当前游戏的run
			ap.game.run();
			// 清空当前释放过的按钮
			ap.input.clearReleased();
			this.fps();
		},
		_fps: 0,
		_fpsCount : 0,
		_fpsTimer: new ap.Timer(),
		fps : function() {
			if (this._fpsTimer.delta() > 1) {
				this._fps = this._fpsCount;
				this._fpsCount = 0;
				this._fpsTimer.reset();
			} else {
				this._fpsCount ++;
			}
		},
		// 读取中断的游戏
		loadGame: function() {
			ap.game = new ap.Game({});
		},
		// 保存游戏
		saveGame : function() {

		}
	};
});