// 增益效果 & 异常效果
ap.module("status").defines(function() {
	"use strict";
	ap.status = {
		// 共同的属性
		prototype: {
			// 技能id 用于统计
			id: null,
			// 持续时间
			duration: 1,
			// 效果周期
			cycle: 1,
			// 效果施放者
			caster: null,
			// 效果的宿主
			target: null,
			// 效果计时器
			timer: null,
			// 执行效果
			execute: function() {
				// 第一次执行时初始化
				if (this.timer === null) {
					this.timer = new ap.Timer();
				}
				var delta = this.timer.delta();
				if (delta > this.cycle) {
					if (this.effect) {
						this.effect();
					}
					this.timer.reset();
					this.duration -= delta;
				}
				// 效果过期 消除
				if (delta > this.duration) {
					if (this.vanish) {
						this.vanish();
					}
					return false;
				}
				return true;
			}
		},
		fury : {
			name: "激怒",
			description: "增加暴击几率",
			type: "buff",
			// 状态图标在Sprites中的位置
			icon: 0,
			// 效果
			effect: function() {
				this.target.criticalBonus = 0.2;
			},
			// 消失时动作
			vanish: function() {
				this.target.criticalBonus = 0;
			}
		},
		might : {
			name: "威能",
			description: "增加攻击伤害",
			type: "buff",
			icon: 1,
			effect: function() {
				this.target.criticalBonus = 0.2;
			},
			vanish: function() {
				this.target.criticalBonus = 0;
			}
		},
		regeneration : {
			name: "再生",
			// 强度
			intensity: 10,
			description: "持续恢复生命",
			type: "buff",
			cycle: 0.5,
			icon: 2,
			effect: function() {
				this.target.onHeal(this.intensity);
			}
		},
		retaliation : {
			name: "反弹",
			description: "将受到的伤害反弹给攻击者",
			type: "buff",
			icon: 3,
			effect: function() {
				this.target.isReflection = true;
			},
			vanish: function() {
				this.target.isReflection = false;
			}
		},
		swiftness : {
			name: "迅捷",
			description: "增加移动速度",
			type: "buff",
			icon: 4,
			effect: function() {
				this.target.moveSpeedBonus = this.target.moveSpeed * 0.3;
			},
			vanish: function() {
				this.target.moveSpeedBonus = 0;
			}
		},
		charge: {
			name: "冲锋",
			description: "冲锋，以最大速度移动",
			type: "buff",
			effect: function() {
				this.target.moveSpeedBonus = 500;
			},
			vanish: function() {
				this.target.moveSpeedBonus = 0;
			}
		},
		// 怪物对玩家使用的dot
		poison: {
			name: "中毒",
			description: "中毒，持续失去体力",
			type: "debuff",
			icon: 5,
			intensity: 10,
			cycle: 0.5,
			effect: function() {
				ap.mediator.attack(this.caster, this.target, this.intensity, this.id);
			}
		},
		// 玩家对怪物使用的dot
		burn: {
			name: "燃烧",
			description: "燃烧，持续失去体力",
			type: "debuff",
			icon: 6,
			intensity: 10,
			cycle: 0.5,
			effect: function() {
				ap.mediator.attack(this.caster, this.target, this.intensity, this.id);
			}
		},
		slow: {
			name: "减速",
			description: "移动速度减慢",
			type: "debuff",
			icon: 7,
			effect: function() {
				this.target.moveSpeedBonus = -this.target.moveSpeed * 0.4;
			},
			vanish: function() {
				this.target.moveSpeedBonus = 0;
			}
		},
		immobilize: {
			name: "定身",
			description: "无法移动",
			type: "debuff",
			icon: 8,
			effect: function() {
				this.target.isImmobilize = true;
			},
			vanish: function() {
				this.target.isImmobilize = false;
			}
		},
		jam: {
			name: "干扰",
			description: "技能冷却时间加长",
			type: "debuff",
			icon: 9,
			effect: function() {
				this.target.isJam = true;
			},
			vanish: function() {
				this.target.isJam = false;
			}
		}
	};
	// 创建一个状态  名称，状态宿主，强度，持续时间，效果周期
	ap.status.createStatus = function(name, id, caster, intensity, duration, cycle) {
		if (!ap.status[name]) {
			throw new Error("指定的状态不存在");
		}
		var newStatus = ap.utils.deepCopy(ap.status.prototype),
			copy = ap.status[name];
		for (var i in copy) {
			newStatus[i] = copy[i];
		}
		newStatus.id = id;
		newStatus.caster = caster;
		// 持续时间最短1秒
		newStatus.duration = duration || 1;
		// 每一跳的时间
		newStatus.cycle = cycle || 1;
		// 部分buff没有强度概念
		newStatus.intensity = intensity || 0;
		return newStatus;
	};
});