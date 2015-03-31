// 实体 所有的参与碰撞物体
ap.module("entity").requires("timer", "class", "skill", "status", "animation").defines(function() {
	"use strict";
	ap.Entity = ap.Class.extend({
		// 实体的名字
		name: null,
		// 攻击力
		power: 0,
		// 因状态而改变的
		powerBonus: 0,
		// 暴击加成
		criticalBonus: 0,
		// 冷却缩短比例
		cdDown: 0,
		// 移动速度 每秒移动像素
		moveSpeed: 100,
		// 移动速度奖励
		moveSpeedBonus: 0,
		// 移动用计时器
		moveTimer: null,
		// 上次移动的距离用于再计算方向
		lastMove: 0,

		// 是否定身
		isImmobilize: false,
		// 是否有反射Buff
		isReflection: false,
		// 是否死亡
		isKilled: false,

		// 初始化
		init: function(property) {
			// 复制参数的属性
			for (var i in property) {
				this[i] = property[i];
			}
			if (!this.skills) {
				this.skills = {};
			}
			// 如果当前配置指定了技能 创建技能实例
			if (property && property["skill"]) {
				for (var i = 0; i < property["skill"].length; i++) {
					var sk = ap.skill.createSkill(property["skill"][i], this);
					this.skills[property["skill"][i]] = sk;
				}
			}
		},
		// 计算指定的角度移动的偏移量 具体移动在collision中实现
		moveByRad: function(rad) {
			this.moveOffset.x = this.lastMove * Math.cos(rad);
			this.moveOffset.y = this.lastMove * Math.sin(rad);
		},
		// 修改角度，再移动一次
		changeRad: function(num) {
			// 按照次数修正方向
			var f = num % 2 ? -1 : 1,
				// 按照次数修正度数
				rad = Math.round(num / 2) * 15 * Math.PI / 180,
				moveAim = this.moveAim || this.aim;
			this.moveByRad(moveAim + rad * f);
		},
		// 更新技能冷却时间
		setCD: function() {
			if (this.cdDown > 0.5) {
				// 冷却时间减少上限
				this.cdDown = 0.5;
			}
			for (var skillId in this.skills) {
				var s = this.skills[skillId];
				if (s._cd) {
					s.coolDown = s._cd * (1 - this.cdDown);
				} else {
					s.coolDown = 1 / this.attackSpeed;
				}
			}
		},
		// 受到治疗 吸血和恢复buff
		onHeal: function(heal) {
			this.life += ~~heal;
			if (this.life > this.lifeLimit) {
				this.life = this.lifeLimit;
			}
		},

		// 造成伤害
		onDamage: function(damage) {
			// 吸血判定
			if (this.drainLife > 0) {
				this.onHeal(damage * this.drainLife);
			}
		},

		// 受到伤害  canReflection: 伤害能否反射
		onHurt: function(damage, attacker, canReflection) {
			if (damage == 0) {
				return;
			}
			if (this.hurt) {
				this.hurt(damage);
			} else {
				this.life -= damage;
			}

			// 检查反射Buff 就算是玩家闪避了攻击也需要反射伤害
			if (this.isReflection && !canReflection) {
				var reflectDamage = damage - (this.life < 0 ? this.life : 0);
				if (attacker.type == "player") {
					// 如果是玩家攻击的话，反弹减少。
					reflectDamage = reflectDamage * 0.1;
				}
				// 反射的伤害不会再次触发反射
				ap.mediator.attack(this, attacker, reflectDamage, "reflection", null, true);
			}

			if (this.life <= 0) {
				this.onKill();
				return true;
			} else {
				return false;
			}

		},

		// 死亡事件
		onKill: function() {
			this.isKilled = true;
		},
		// 向目标移动 并指向目标 
		move: function() {
			// 因为怪物是发现目标后才移动，所以移动时再初始化
			if (!this.moveTimer) {
				this.moveTimer = new ap.Timer();
			}
			this.aim = ap.utils.getRad(this.pos, this.target.pos);
			// 当前可以移动的长度   未定身的话
			if (this.needMove && !this.isImmobilize) {
				this.lastMove = this.moveTimer.delta() * (this.moveSpeed + this.moveSpeedBonus);
			} else {
				this.lastMove = 0;
			}
			this.moveByRad(this.aim);
			this.moveTimer.reset();
		},
		update: function() {
			// 检查自带的状态 （如果自带debuff效果，优先处理）
			for (var i = 0; i < this.status.length; i++) {
				var s = this.status[i];
				// 状态目标设为自身
				if (!s.target) {
					s.target = this;
				}
				// 执行状态的效果
				var durationFlg = s.execute();
				// 剔除失效的状态
				if (!durationFlg) {
					this.status.splice(i, 1);
					i--;
				}
			}
		},
		draw: function() {
			var pos = ap.game.getCameraPos();
			if (this.animSheet) {
				this.animSheet.draw(~~(this.pos.x + 0.5) + pos.x, ~~(this.pos.y + 0.5) + pos.y, this.angle);
			}
			if (this.anims) {
				this.anims.draw(~~(this.pos.x + 0.5) + pos.x, ~~(this.pos.y + 0.5) + pos.y, this.angle);
			}
			// 测试用 锚点
			// ap.game.context.fillRect(~~(this.pos.x + 0.5) + pos.x - 2, ~~(this.pos.y + 0.5) + pos.y - 2, 4, 4);
		},

	});
});