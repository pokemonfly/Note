// 附带伤害性质的飞行物
ap.module("flyer").requires("entity").defines(function() {
	ap.Flyer = ap.Entity.extend({
		// 伤害类型
		type: null,
		// 威力
		power: 0,

		// 自动瞄准
		autoFocus: false,
		// 目标 - 自动瞄准用
		target: null,
		// 持续时间
		duration: 0,
		// 持续时间 计时器
		durationTimer: null,

		// 释放者
		owner: null,

		// 位置
		pos: null,
		// 移动速度 
		moveSpeed: 500,
		// 角色移动方向 弧度
		moveAim: 0,
		// 本次移动的位置偏移量
		moveOffset: null,
		// 碰撞体积 半径
		radius: 30,
		// 附加异常状态
		status: [],
		// 异常附加概率
		probability: 0,
		// 爆炸威力
		explosionPower: 0,
		// 爆炸范围
		explosionRange: 100,
		// 爆炸附加异常状态
		explosionStatus: [],

		init: function(property) {
			this.durationTimer = new ap.Timer();
			this.parent(property);
			this.moveOffset = {
				x: 0,
				y: 0
			};
			this.type = this.owner.type;
		},
		move: function() {
			if (this.autoFocus) {
				// 追踪型
				this.moveAim = ap.utils.getRad(this.pos, this.target.pos);
			}
			// 计算出此次可以移动的距离
			this.lastMove = this.moveTimer.delta() * this.moveSpeed;
			this.moveByRad(this.moveAim);

			this.moveTimer.reset();
		},

		// 与目标碰撞时发生伤害
		onDamage: function(target) {
			target.onHurt(this.power);
			this.owner.onDamage(power);
			this.onKill();
		},

		// 消灭时
		onKill: function() {
			this.parent();

		},

		update: function() {
			if (this.duration > this.durationTimer.delta()) {
				this.move();
			} else {
				// 超过存在时间则消灭
				this.onKill();
			}
		}
	});
});