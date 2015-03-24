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
			// 初始化完毕后 显示主界面
			ap.ui.showUI("main");
		},
		resize: function() {},
		// 新开游戏
		newGame: function(difficulty) {
			// 显示游戏界面
			ap.ui.showUI("gameUI");
			ap.game = new ap.Game(difficulty);
			ap.game.start();
			this.startLoop();
		},
		// 循环播放
		startLoop: function() {
			// FIX 防止进入游戏前的输入
			ap.input.clearReleased();
			this.running = true;
			this.loopId = ap.ui.setAnimation(this.run.bind(this));
		},
		// 暂停
		pause: function() {
			if (this.running) {
				ap.ui.clearAnimation(this.loopId);
				this.running = false;
			}
		},
		// 运行中
		run: function() {
			// 游戏时间前进
			ap.Timer.tick();
			// 执行当前游戏的run
			ap.game.run();
			// 清空当前释放过的按钮
			ap.input.clearReleased();

			// 测试代码
			// this.fps();
		},
		// 读取中断的游戏
		loadGame: function() {
			ap.game = new ap.Game({});
		},
		// 保存游戏 保存当前角色的属性 场景数，选择难度，以获得的道具，本次游戏的成就
		saveGame: function() {

		},
		// 保存游戏 保存总的成就，可继承物品信息
		gameOver: function() {
			ap.ui.showUI("main");
		}
			// 测试代码 显示帧数
			// _fps: 0,
			// _fpsCount : 0,
			// _fpsTimer: new ap.Timer(),
			// fps : function() {
			// 	if (this._fpsTimer.delta() > 1) {
			// 		this._fps = this._fpsCount;
			// 		this._fpsCount = 0;
			// 		this._fpsTimer.reset();
			// 	} else {
			// 		this._fpsCount ++;
			// 	}
			// }
	};
});