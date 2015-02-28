// 玩家
ap.module("player").defines(function() {
	"use strict";
	ap.Player = {
		// 等级
		level: 1,
		// 经验
		exp: 0,
		// 升级需要经验
		nextLvExp: 280,
		// 类型 中介用
		type: "PLAYER",

		// 生命
		life: 512,
		// 生命上限
		lifeLimit: 512,

		// 精神
		spirit: 0,
		// 精神上限
		spiritLimit: 200,
		// 精神恢复速度 每秒恢复数值
		spiritSpeed: 2,

		// 攻击力
		power: 50,
		// 攻速 每秒攻击次数 
		attackSpeed: 0.6,
		// 暴击
		critical: 0.05,
		// 爆炸范围加成
		range: 0,
		// 生命吸取
		drainLife: 0.05,

		// 位置
		pos: {},
		// 移动速度
		moveSpeed: 100,

		// 是否有护盾
		hasShield: false,
		// 护盾值
		shield: 0,
		// 护盾上限
		shieldLimit: 0,
		// 护盾上限加成
		shieldBonus: 0,
		// 护盾创建时间
		shieldCreateTime: 0,
		// 护盾持续时间
		shieldDuration: 0,

		// 是否无敌
		isInvincible: false;

		ready: function() {
			// 护盾状态
			if (this.hasShield) {
				if (+new Date() > this.shieldCreateTime + this.shieldDuration) {
					this.hasShield = false;
				}
			}
		},

		// 造成伤害

		// 受到伤害
		hurt: function(damage) {
			// 检查是否无敌
			if (isInvincible) {
				return;
			}

			if (this.hasShield) {
				this.shield -= damage;
				if (this.shiled < 0) {
					// 护盾被完全消耗
					this.life += this.shiled;
					this.hasShield = false;
				}
			} else {
				this.life -= damage;
			}
		}
	};
});