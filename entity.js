// 实体 所有的参与碰撞物体
ap.module("entity").requires("timer", "class", "skill").defines(function() {
	"use strict";
	ap.Entity = ap.Class.extend({
		// 攻击力
		power: 10,
		// 因状态而改变的
		powerBonus: 0,

		// 移动速度 每秒移动像素
		moveSpeed: 100,
		// 移动速度奖励
		moveSpeedBonus: 0,
		// 移动用计时器
		moveTimer: new ap.Timer(),

		// 是否定身
		isImmobilize: false,
		// 是否有反射Buff
		isReflection: false,
		// 是否死亡
		isKilled: false,

		// 碰撞体积 半径
		radius: 10,

		// 初始化
		init: function(property) {
			// 复制参数的属性
			for (var i in property) {
				this[i] = property[i];
			}
			// 如果当前配置指定了技能 创建技能实例
			if (property && property["skill"]) {
				for (var i = 0; i < property["skill"].length; i++) {
					var sk = ap.skill.createSkill(property["skill"][i], this);
					this.skills[property["skill"][i]] = sk;
				}
			}
		},
		// 攻击动作 技能
		attack: function(skill) {
			var s = this.skills[skill];
			// 检查Cooldown
			if (s.timer.delta() >= s.coolDown) {
				s.cast();
				// 重置冷却计时
				s.timer.reset();
			}
		},

		// 受到治疗 吸血和恢复buff
		onHeal: function(heal) {
			this.life += heal;
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
			if (this.hurt) {
				this.hurt(damage);
			} else {
				this.life -= damage;
			}

			// 检查反射Buff
			if (this.isReflection && !canReflection) {
				// 反射的伤害不会再次触发反射
				ap.Mediator.attack(this, attacker, damage * 0.5, "reflection", null, null, true);
			}

			if (this.life <= 0) {
				this.onDead();
				return true;
			} else {
				return false;
			}

		},

		// 死亡事件
		onKill: function() {
			this.isKilled = true;
		},

		update: function() {
			// 检查自带的状态 （如果自带debuff效果，优先处理）
			this.status.forEach(function(s) {
				s.effect(this);
			});
		},
		draw: function() {
			if (this.animSheet) {
				var pos = ap.game.getCameraPos();
				this.animSheet.draw(~~(this.pos.x + 0.5) + pos.x, ~~(this.pos.y + 0.5) + pos.y);
			}
		},

	});
});