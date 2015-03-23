// 治疗或伤害区域  可以为圆形或者扇形 不可以移动 与其他实体碰撞时造成效果
ap.module("area").requires("entity", "image").defines(function() {
	"use strict";
	ap.Area = ap.Entity.extend({
		// 伤害类型
		type: null,
		// 唯一码 防止效果重复
		uid: 0,
		// 威力
		power: 0,
		// 持续时间
		duration: 0,
		// 持续时间 计时器
		durationTimer: null,
		// 释放者
		owner: null,
		// 位置
		pos: null,
		//  半径
		radius: 30,
		// 如果是扇形的话，需要2个角度
		aimS: null,
		aimE: null,
		// 附加异常状态
		status: [],
		// 异常附加概率
		probability: 0,
		// 触发判断用 计时器
		coolDownTimer: null,
		// 触发判断用 效果冷却时间
		coolDown: 0,
		// 触发判断用 能否有效果
		isReady: true,
		// 显示图案
		animSheet: null,
		// 图像角度
		angle: 0,

		init: function(property) {
			this.parent(property);
			this.durationTimer = new ap.Timer();
			this.coolDownTimer = new ap.Timer();
			if (this.owner) {
				this.type = this.owner.type;
			}
			// 随机一个数作为唯一标识
			this.uid = +new Date();
			this.angle = this.aimS ? (this.aimS + this.aimE) / 2 : 0;
		},
		update: function() {
			// 超时后消失
			if (this.duration < this.durationTimer.delta()) {
				this.onKill();
			}
			if (this.coolDown < this.coolDownTimer.delta()) {
				this.isReady = true;
				this.coolDownTimer.reset();
			} else {
				this.isReady = false;
			}
		}
	});
});