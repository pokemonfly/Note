// 玩家
ap.module("player").requires("entity", "image").defines(function() {
	"use strict";
	ap.Player = ap.Entity.extend({
		// 类型 判定用
		type: "player",
		// 玩家角色名
		name: "",
		// 生命
		life: 512,
		// 生命上限
		lifeLimit: 512,

		// 攻击力
		power: 50,
		// 攻速 每秒攻击次数 
		attackSpeed: 1,
		// 暴击
		critical: 0.05,
		// 生命吸取
		drainLife: 0.05,
		// 攻击射程加成
		attackRange: 1,
		// 技能范围加成
		skillRange: 1,
		// 冷却缩短比例
		cdDown: 0,
		// 技能方向
		aim: 0,
		// 攻击计数
		attackCount: 0,

		// 移动速度 
		moveSpeed: 200,
		// 角色移动方向 弧度
		moveAim: 0,
		// 移动的目标地点
		moveTo: null,

		// 等级
		level: 1,
		// 经验
		exp: 0,
		// 升级需要经验
		nextLvExp: 280,
		// 经验获得速度
		expRate: 1,
		// 升级时可以获得的奖励属性个数
		levelUpBonusCount: 3,

		// 精神 玩家独有属性
		spirit: 0,
		// 精神上限
		spiritLimit: 200,
		// 精神恢复速度 每秒恢复数值
		spiritSpeed: 2,

		// 是否有护盾 玩家独有属性
		hasShield: false,
		// 护盾值
		shield: 0,
		// 护盾上限
		shieldLimit: 0,
		// 护盾上限加成比例
		shieldBonusRate: 1,
		// 护盾创建时间
		shieldCreateTimer: null,
		// 护盾持续时间
		shieldDuration: 0,
		// 护盾效果
		shieldImage: new ap.Image("media/ui/shield.png", {
			x: 93,
			y: 90
		}),

		// 闪避 玩家自带10%闪避
		dodge: 0.1,
		// 是否无敌
		isInvincible: false,
		// 技能消耗体力 比例
		skillCost: 0,
		// 仇恨转移目标
		redirect: null,
		// 是否在瞄准中
		isAimming: false,
		// 瞄准区域的角度
		aimmingRad: 0,
		// 瞄准区域的半径
		aimmingRadius: 0,
		// 状态 buff & debuff
		status: null,
		// 持有技能
		skills: null,

		// 位置
		pos: null,
		// // 上次移动的距离用于再计算方向
		// lastMove: 0,
		// 本次移动的位置偏移量
		moveOffset: null,
		// 碰撞体积 半径
		radius: 30,
		// 当前动画效果
		anims: null,
		// 当前玩家动作
		action: null,
		// 动画设定
		animsSet: null,
		init: function(property) {
			this.parent(property);
			// 初始化UI
			// 等级
			ap.ui.setLevel(this.level);
			// 血条
			ap.ui.setLife(this.life, this.lifeLimit);
			// 经验条
			ap.ui.setExpUI(this.exp, this.nextLvExp);
			// 技能栏
			ap.ui.initSkillUI(this);
			// 状态栏
			ap.ui.initStatusUI();
			// 初始化移动用计时器
			this.moveTimer = new ap.Timer();
			// 初始化动作
			this.action = "stand";
			this.status = [];
			this.moveTo = {
				x: 100,
				y: 100
			};
			this.pos = {
				x: 100,
				y: 100
			};
			this.moveOffset = {
				x: 0,
				y: 0
			};
		},
		// 受到治疗 吸血和恢复buff
		onHeal: function(heal) {
			this.parent(heal);
			// 刷新UI
			ap.ui.setLife(this.life, this.lifeLimit);
		},
		// 受到伤害
		hurt: function(damage) {
			// 检查是否无敌
			if (this.isInvincible) {
				return;
			}
			// 检查闪避
			if (Math.random() < this.dodge) {
				ap.ui.addMessage(this.name + "闪避" + damage + "伤害。", "#fa4204");
				return;
			}
			// 检查护盾
			var guardDamage = 0;
			if (this.hasShield) {
				if (this.shield <= damage) {
					guardDamage = this.shield;
					// 护盾被完全消耗
					this.life -= damage - this.shield;
					this.hasShield = false;
					ap.ui.setShield(0);
					ap.ui.setLife(this.life, this.lifeLimit);
				} else {
					guardDamage = damage;
					this.shield -= damage;
					ap.ui.setShield(this.shield, this.shieldLimit);
				}
			} else {
				this.life -= damage;
				ap.ui.setLife(this.life, this.lifeLimit);
			}
			ap.ui.addMessage(this.name + "受到" + damage + "伤害。" + (guardDamage > 0 ? "（" + guardDamage + "吸收)" : ""), "#fa4204");
		},

		// 检查角色护盾的状态
		_checkShield: function() {
			if (this.hasShield) {
				if (this.shieldCreateTimer.delta() > this.shieldDuration) {
					// 护盾时间到， 消灭当前护盾
					this.hasShield = false;
					this.shieldCreateTimer = null;
					ap.ui.setShield(0);
				} else {
					// 有护盾的话，刷新护盾UI显示
					ap.ui.setShield(this.shield, this.shieldLimit);
				}
			}
		},

		// 角色移动
		_move: function() {
			// 是否使用键盘来移动
			var useKey = false;
			var keyAim = {
				x: this.pos.x,
				y: this.pos.y
			};
			// 鼠标点击 移动位置
			if (ap.input.pressed("go")) {
				// 设定目标地点
				this.moveTo.x = ap.input.mouse.x;
				this.moveTo.y = ap.input.mouse.y;
			}
			if (ap.input.pressed("up")) {
				useKey = true;
				keyAim.y--;
			}
			if (ap.input.pressed("left")) {
				useKey = true;
				keyAim.x--;
			}
			if (ap.input.pressed("down")) {
				useKey = true;
				keyAim.y++;
			}
			if (ap.input.pressed("right")) {
				useKey = true;
				keyAim.x++;
			}

			// 设置移动方向
			if (useKey) {
				this.moveAim = ap.utils.getRad(this.pos, keyAim);
				if (keyAim.x != this.pos.x || keyAim != this.pos.y) {
					// 键盘瞄准
					this.aim = this.moveAim;
				}
			} else {
				this.moveAim = ap.utils.getRad(this.pos, this.moveTo);
			}

			// 角色未定身的话开始移动
			if (!this.isImmobilize) {
				// 当前时间段可以移动的距离 像素
				if (useKey) {
					// 当前可以移动的长度
					this.lastMove = this.moveTimer.delta() * (this.moveSpeed + this.moveSpeedBonus);
					this.moveOffset.x = this.lastMove * Math.cos(this.moveAim);
					this.moveOffset.y = this.lastMove * Math.sin(this.moveAim);
					this.moveTo.x = this.pos.x;
					this.moveTo.y = this.pos.y;
				} else {
					if (this.moveTo.x !== this.pos.x || this.moveTo.y !== this.pos.y) {
						// 当前可以移动的长度
						this.lastMove = this.moveTimer.delta() * (this.moveSpeed + this.moveSpeedBonus);
						// 距离目标的长度
						var current = ap.utils.getDistance(this.moveTo, this.pos);
						if (this.lastMove < current) {
							this.moveOffset.x = this.lastMove * Math.cos(this.moveAim);
							this.moveOffset.y = this.lastMove * Math.sin(this.moveAim);
						} else {
							this.lastMove = current;
							this.moveOffset.x = this.moveTo.x - this.pos.x;
							this.moveOffset.y = this.moveTo.y - this.pos.y;
						}

					} else {
						this.moveOffset.x = 0;
						this.moveOffset.y = 0;
					}
				}
			} else {
				this.lastMove = 0;
				this.moveOffset.x = 0;
				this.moveOffset.y = 0;
			}
			this.moveTimer.reset();
			// 判断玩家动作
			if (this.moveAim === 0) {
				this.action = "stand";
			} else {
				this.action = "move";
			}
		},
		// 攻击意向判定
		_decision: function() {
			// 使用鼠标的话即时瞄准
			if (ap.input.useMouse) {
				this.aim = Math.atan2(ap.input.mouse.y - this.pos.y, ap.input.mouse.x - this.pos.x);
			}
			// 普通攻击
			if (ap.input.pressed("attack1")) {
				// 鼠标攻击
				// this.aim = Math.atan2(ap.input.mouse.y - this.pos.y, ap.input.mouse.x - this.pos.x);
				this._useSkill("pyromania");
			}
			if (ap.input.pressed("attack2")) {
				// 键盘攻击
				// this.aim = this.moveAim;
				this._useSkill("pyromania");
			}
			// this.aim = ap.input.useMouse ? Math.atan2(ap.input.mouse.y - this.pos.y, ap.input.mouse.x - this.pos.x) : this.moveAim;
			// 技能攻击 
			this.isAimming = false;
			for (var skillId in this.skills) {
				if (ap.input.pressed(skillId)) {
					this._showSkillPreview(skillId);
				}
				if (ap.input.released(skillId)) {
					this._useSkill(skillId);
				}
			}
			// 面板相关
			if (ap.input.released("character")) {
				// 角色面板
				ap.ui.showRolePanel();
			}
			if (ap.input.released("achievement")) {
				// 统计面板
				ap.ui.showAchievement();
			}
			if (ap.input.released("escape")) {
				// 暂停
				ap.ui.showPause();
			}
			if (ap.input.released("help")) {
				// 显示帮助
				ap.ui.showHelp();
			}

		},
		// 攻击 使用技能
		_useSkill: function(skill) {
			var s = this.skills[skill];
			// 检查Cooldown
			if (s.isReady && !s.isLock && s.timer.delta() >= s.coolDown) {
				s.cast();
				// 重置冷却计时
				s.timer.reset();
				// 只有玩家的技能会关联DOM
				if (s.dom) {
					// 如果是玩家的技能话，设置冷却时间动画
					ap.ui.setCoolDown(s.dom, s.coolDown);
				}
				// 设置角色动作
				this.action = "attack";
			}
		},
		// 准备描绘技能方向
		_showSkillPreview: function(skillId) {
			var s = this.skills[skillId];
			if (s) {
				// 检查技能是否可用 
				if (s.timer.delta() >= s.coolDown && s.hasPreview && s.isReady) {
					this.isAimming = true;
					this.aimmingRad = s.rad;
					this.aimmingRadius = s.radius * this.attackRange;
				}
			} else {
				throw new Error("_checkSkillAvailable参数不正:" + skillId);
			}
		},
		// 获得经验
		getExp: function(num) {
			num = ~~(num * this.expRate);
			this.exp += num;
			ap.ui.addMessage("获得" + num + "经验。", "#f0ff00");
			while (this.exp > this.nextLvExp) {
				this.exp -= this.nextLvExp;
				// 升级
				this.levelUp();
				// 更新UI
				ap.ui.setLevel(this.level);
				ap.ui.setLife(this.life, this.lifeLimit);
			}
			// 刷新角色面板
			ap.ui.refreshRoleJoho();
			// 刷新统计面板
			ap.ui.refreshAchievement();
			// 更新界面上的经验条
			ap.ui.setExpUI(this.exp, this.nextLvExp);
		},
		// 玩家获得状态
		getStatus: function(s) {
			this.status.push(s);
			if (s.dom) {
				// 更新状态栏
				ap.ui.showStatus(s.dom, s.duration);
			}
		},
		// 升级 获得属性加成
		levelUp: function() {
			this.level += 1;
			ap.ui.addMessage("升级！ " + this.level, "#f0ff00");
			ap.ui.addMessage("属性提升：", "#f0ff00");
			this.lifeLimit += 50;
			ap.ui.addMessage("生命上限提高： 50", "#6db7f6");
			this.power += 10;
			ap.ui.addMessage("攻击力提高： 10", "#6db7f6");
			// 获得额外的升级奖励
			var i = this.levelUpBonusCount;
			ap.ui.addMessage("额外属性提升：", "#f0ff00");
			while (i--) {
				var select = ~~(Math.random() * 12);
				switch (select) {
					case 0:
						// 攻速奖励
						this.attackSpeed += 0.05;
						ap.ui.addMessage("攻速提升5%", "#6db7f6");
						this.setCD();
						break;
					case 1:
						// 技能CD减少
						ap.ui.addMessage("技能冷却时间减少5%", "#6db7f6");
						this.cdDown += 0.05;
						this.setCD();
						break;
					case 2:
						// 攻击力提高
						this.power += 10;
						ap.ui.addMessage("攻击力提高：10", "#6db7f6");
						break;
					case 3:
						// 生命上限提高
						this.lifeLimit += 50;
						ap.ui.addMessage("生命上限提高：50", "#6db7f6");
						break;
					case 4:
						// 暴击
						this.critical += 0.03;
						ap.ui.addMessage("暴击几率提升：3%", "#6db7f6");
						break;
					case 5:
						// 生命吸取
						this.drainLife += 0.01;
						ap.ui.addMessage("生命吸取提升：1%", "#6db7f6");
						break;
					case 6:
						// 攻击射程加成
						this.attackRange += 0.05;
						ap.ui.addMessage("攻击射程增加5%", "#6db7f6");
						break;
					case 7:
						// 技能范围加成
						this.skillRange += 0.05;
						ap.ui.addMessage("技能范围扩大5%", "#6db7f6");
						break;
					case 8:
						// 移动速度
						this.moveSpeed *= 1.05;
						ap.ui.addMessage("移动速度提升5%", "#6db7f6");
						break;
					case 9:
						// 经验获得速度
						this.expRate += 0.05;
						ap.ui.addMessage("经验获得速度提高5%", "#6db7f6");
						break;
					case 10:
						// 闪避
						this.dodge += 0.03;
						ap.ui.addMessage("闪避几率提高3%", "#6db7f6");
						break;
					case 11:
						// 护盾上限加成
						this.shieldBonus += 0.05;
						ap.ui.addMessage("护盾加成5%", "#6db7f6");
						break;
				}
			}
			// 提高下一次升级需要的经验
			this.nextLvExp += 50;
		},

		// 根据当前动作更新动画
		_setAnimes: function() {
			if (!this.anims || (this.action != this.anims.name && this.anims.end())) {
				// 当前动画未设定 或 当前动作需要改变
				this.anims = this.animsSet[this.action];
				this.anims.name = this.action;
				this.anims.reset();
			}
			this.anims.update();
		},
		update: function() {
			this.parent();
			// 角色移动
			this._move();
			// 攻击意向判定
			this._decision();
			// 判断护盾的变化
			this._checkShield();
			// 更新动画
			this._setAnimes();
		},
		draw: function() {
			this.parent();
			// 如果使用技能瞄准的话，描绘技能范围
			if (this.isAimming) {
				if (this.aimmingRad) {
					ap.game.drawPreviewCircle(this.pos, this.aimmingRadius, this.aim - this.aimmingRad / 2, this.aim + this.aimmingRad / 2);
				} else {
					ap.game.drawPreviewArrow(this.pos, this.aimmingRadius, this.aim);
				}
			}
			// 如果有护盾，绘制护盾效果
			if (this.hasShield) {
				var pos = ap.game.getCameraPos();
				this.shieldImage.draw(~~(this.pos.x + 0.5) + pos.x, ~~(this.pos.y + 0.5) + pos.y);
			}
		}
	});
});