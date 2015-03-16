// 增益效果 & 异常效果
ap.module("status").defines(function() {
	"use strict";
	ap.status = {
		// 共同的属性
		prototype: {
			// 持续时间
			duration: 1,
			// 效果周期
			cycle: 1,
			// 效果的宿主
			target: null,
			// 效果计时器
			timer: null,
			// 状态图标在Sprites中的位置
			icon: null
		},
		fury : {
			name: "激怒",
			description: "增加暴击几率",
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
			cycle: 0.5,
			effect: function() {
				this.target.onHeal(this.intensity);
			}
		},
		retaliation : {
			name: "反弹",
			description: "将受到的伤害反弹给攻击者",
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
			effect: function() {
				this.target.moveSpeedBonus = this.target.moveSpeed * 0.3;
			},
			vanish: function() {
				this.target.moveSpeedBonus = 0;
			}
		},
		charge: {
			name: "冲锋",
			description: "冲锋，以最大速度移动"
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
			intensity: 10,
			cycle: 0.5,
			effect: function() {
				this.target.onHurt(this.intensity);
			}
		},
		// 玩家对怪物使用的dot
		burn: {
			name: "燃烧",
			description: "燃烧，持续失去体力",
			intensity: 10,
			cycle: 0.5,
			effect: function() {
				this.target.onHurt(this.intensity);
			}
		},
		slow: {
			name: "减速",
			description: "移动速度减慢",
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
			effect: function() {
				this.target.isJam = true;
			},
			vanish: function() {
				this.target.isJam = false;
			}
		}
	};
	// 创建一个状态  名称，状态宿主，持续时间，强度
	ap.status.createStatus = function(name, target, duration, intensity) {
		if (!ap.status[name]) {
			throw new Error("指定的状态不存在");
		}
		var newStatus = ap.utils.deepCopy(ap.status.prototype),
			copy = ap.status[name];
		for (var i in copy) {
			newStatus[i] = copy[i];
		}
		newStatus.timer = new ap.Timer();
		newStatus.target = target;
		// 持续时间最短1秒
		newStatus.duration = duration || 1;
		// 部分buff没有强度概念
		newStatus.intensity = intensity || 0;
		return newStatus;
	};
});