// 附带伤害性质的飞行物
ap.module("flyer").requires("entity").defines(function() {
	ap.Flyer = ap.Entity.extend({
		// 威力
		power: 0,

		// 自动瞄准
		autoFocus: false,
		// 目标 - 自动瞄准用
		target: null,
		// 持续时间
		duration: 0,
		// 持续时间 计时器
		durationTimer: null ,

		// 释放者
		owner: null,

		// 伤害范围
		range: 0,
		// 附加异常状态
		status: [],
		// 爆炸威力
		explosionPower: 0,
		// 爆炸范围
		explosionRange: 100,
		// 爆炸附加异常状态
		explosionStatus: [],

		init: function(property) {
			this.durationTimer = new ap.Timer();
			this.parent(property);
		},
		// 移动时
		onMove: function() {

		},

		// 与目标碰撞时发生伤害
		onDamage: function(target) {
			target.onHurt(this.power);
			this.owner.onDamage(power);
			this.onKilled();
		},

		// 消灭时
		onKilled: function() {

		},

		update: function() {
			if(this.duration < this.durationTimer.delta()) {

			}
		}
	});
});