// 增益效果 & 异常效果
ap.module("status").defines(function() {
	"use strict";
	ap.Status = {
		prototype: {
			// 持续时间
			duration: 1,
			// 效果周期
			cycle: 1,
			// 计时器
			timer: ap.Timer.init()
		},
		charge： {
			name: "冲锋",
			duration: 1,
			effect: function(target) {
				target.moveSpeedBonus = 500;
			},
			vanish: function(target) {
				target.moveSpeedBonus = 0;
			}
		},
		regeneration : {
			name: "再生",
			intensity: 10,
			description: "每0.5秒恢复" + this.intensity + "点生命"

				cycle: 0.5,
			effect: function(target) {
				target.onHeal(this.intensity);
			},
			vanish: function() {}
		}
		// 创建一个状态  名称，持续时间，强度
		createStatus: function(name, duration, intensity) {
			return {};
		}
	};
});