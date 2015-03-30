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
		// 新开游戏
		newGame: function(difficulty) {
			// 显示游戏界面
			ap.ui.showUI("gameUI");
			ap.game = new ap.Game(difficulty);
			ap.game.start();
			// 加载继承要素
			this.loadUserData(true);
			this.startLoop();
			// 重置游戏剧本
			for (var i = 0; i < ap.scenario.length; i++) {
				var s = ap.scenario[i]
				if (s.disabled) {
					s.disabled = false;
				}
			}
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
			return this._getStorage("continue") == "true";
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
				this._setStorage("continue", "true");
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
				// 已经触发过的事件记录
				saveData.scenario = {};
				for (var i in ap.scenario) {
					if (ap.scenario[i].disabled) {
						saveData.scenario[i] = {
							disabled: true
						};
					}
				}
				// 需要特殊处理的技能特性
				saveData.skill = {
					"tibbers": {
						isLock: ap.game.player.skills["tibbers"].isLock
					}
				};
				this._setStorage("saveData", JSON.stringify(saveData));
			} else {
				// 玩家死亡，保存物品 成就信息
				this._setStorage("continue", "false");
			}
			userData.achievement = {
				gameTime: ap.achievement.gameTime + ap.achievement.currentGameTime,
				killCount: ap.achievement.killCount + ap.achievement.currentKillCount,
				rareItemCollect: ap.achievement.rareItemCollect,
				maxLevel: (ap.game.player.level > ap.achievement.maxLevel ? ap.game.player.level : ap.achievement.maxLevel),
				maxFieldNum: (ap.field.num > ap.achievement.maxFieldNum ? ap.field.num : ap.achievement.maxFieldNum)
			};
			this._setStorage("userData", JSON.stringify(userData));
			// 游戏结束，暂停
			this.pause();
			ap.ui.showUI("main");
		},
		// 加载可继承要素的存档  isNew 是否是新开游戏
		loadUserData: function(isNew) {
			var userData = JSON.parse(this._getStorage("userData"));
			if (userData) {
				var achieve = ap.achievement;
				for (var i in userData.achievement) {
					achieve[i] = userData.achievement[i];
				}
				// 稀有物品加载
				for (var i = 0; i < achieve.rareItemCollect.length; i++) {
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
			var saveData = JSON.parse(this._getStorage("saveData"));
			// 显示游戏界面
			ap.ui.showUI("gameUI");
			ap.game = new ap.Game(saveData.game.difficulty);
			ap.game.start();
			// 恢复保存的数据
			ap.game.dropRate = saveData.game.dropRate;
			var p = ap.game.player;
			for (var i in saveData.player) {
				p[i] = saveData.player[i];
			}
			// 区域位置恢复
			ap.field.setNum(saveData.field.num - 1);
			// 剧情进度恢复
			for (var i in saveData.scenario) {
				ap.scenario[i].disabled = true;
			}
			// 技能状态恢复
			for (var i in saveData.skill) {
				ap.game.player.skills[i].isLock = saveData.skill[i].isLock;
				ap.ui.setSkillStatus(ap.game.player.skills[i].dom, !saveData.skill[i].isLock);
			}
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
			// 为了应用上面的要素 需要重新生成对象
			ap.game.nextField();
			// FIX 防止玩家意外中断导致无法获得技能
			if (ap.game.player.skills["tibbers"].isLock) {
				for (var i = 0; i < ap.scenario.length; i++) {
					var s = ap.scenario[i]
					if (s.name == "meetBear") {
						s.disabled = false;
					}
				}
			}
			// 开始游戏
			this.startLoop();
		},
		// IE11本地文件无法使用localStorage ，暂用cookie代替
		_setStorage: function(key, val) {
			if (window.localStorage) {
				window.localStorage.setItem(key, val);
			} else {
				ap.utils.cookie.setItem(key, val);
			}
		},
		_getStorage: function(key) {
			if (window.localStorage) {
				return window.localStorage.getItem(key);
			} else {
				return ap.utils.cookie.getItem(key);
			}
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