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
			// 加载继承要素
			this.loadUserData(true);
			this.startLoop();
		},
		// 循环播放
		startLoop: function() {
			if (!this.running) {
				this.running = true;
				this.loopId = ap.ui.setAnimation(this.run.bind(this));
				ap.input.bindAll();
			}
		},
		// 暂停
		pause: function() {
			if (this.running) {
				ap.ui.clearAnimation(this.loopId);
				this.running = false;
				ap.input.unBindAll();
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
		// 检查是否有旧的记录
		hasLastGame: function() {
			return window.localStorage.getItem("continue") == "true";
		},
		// 保存游戏 保存当前角色的属性 场景数，选择难度，以获得的道具，本次游戏的成就
		saveGame: function() {
			var p = ap.game.player,
				g = ap.game,
				f = ap.field,
				saveData = {},
				userData = {};
			if (p.life > 0) {
				// 如果玩家血量还有的话，说明是中断，下次还可以继续读档
				window.localStorage.setItem("continue", "true");
				// 需要保存的玩家信息
				saveData.player = {
					name: p.name,
					life: p.life,
					lifeLimit: p.lifeLimit,
					power: p.power,
					attackSpeed: p.attackSpeed,
					critical: p.critical,
					drainLife: p.drainLife,
					attackRange: p.attackRange,
					skillRange: p.skillRange,
					attackCount: p.attackCount,
					moveSpeed: p.moveSpeed,
					shieldBonusRate: p.shieldBonusRate,
					level: p.level,
					exp: p.exp,
					nextLvExp: p.nextLvExp,
					expRate: p.expRate,
					dodge: p.dodge,
					cdDown: p.cdDown
				};
				saveData.field = {
					num: f.num
				};
				saveData.game = {
					difficulty: g.difficulty,
					dropRate: g.dropRate
				};
				window.localStorage.setItem("saveData", JSON.stringify(saveData));
			} else {
				// 玩家死亡，保存物品 成就信息
				window.localStorage.setItem("continue", "false");
			}
			userData.achievement = {
				rareItemCollect : ap.achievement.rareItemCollect
			};
			window.localStorage.setItem("userData", JSON.stringify(userData));
			// 游戏结束，暂停
			this.pause();
			ap.ui.showUI("main");
		},
		// 加载可继承要素的存档  isNew 是否是新开游戏
		loadUserData: function(isNew) {
			var userData = JSON.parse(window.localStorage.getItem("userData"));
			if (userData) {
				var achieve = ap.achievement;
				achieve.rareItemCollect = userData.achievement.rareItemCollect;
				// 稀有物品加载
				for (var i = 0; i < achieve.rareItemCollect.length; i ++) {
					var id = achieve.rareItemCollect[i],
					item = ap.config.items["RARE"][id];
					// 标记拥有
					item.own = true;
					if (isNew || !item.once) {
						item.effect();
					}
				}
			}
		},
		// 加载上次保存的游戏
		loadGame: function() {
			var saveData = JSON.parse(window.localStorage.getItem("saveData"));
			// 显示游戏界面
			ap.ui.showUI("gameUI");
			ap.game = new ap.Game(saveData.game.difficulty);
			ap.game.start();
			// 恢复保存的数据
			var p = ap.game.player;
			ap.game.dropRate = saveData.game.dropRate;
			for (var i in saveData.player) {
				p[i] = saveData.player[i];
			}
			ap.field.setNum(saveData.field.num);
			// 如果玩家生命过少，则恢复到一半
			if (p.life < p.lifeLimit / 2) {
				p.life = p.lifeLimit / 2;
			}
			// 刷新UI
			// 等级
			ap.ui.setLevel(p.level);
			// 血条
			ap.ui.setLife(p.life, p.lifeLimit);
			// 经验条
			ap.ui.setExpUI(p.exp, p.nextLvExp);
			// 区域特性显示内容
			ap.ui.setFeature(ap.field.num, ap.field.isRare, ap.field.features, ap.field.leaveKill);
			// 加载继承要素
			this.loadUserData(false);
			// 开始游戏
			this.startLoop();
		}
	};
});
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