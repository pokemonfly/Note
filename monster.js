// 怪兽
ap.module("monster").requires("entity", "image").defines(function() {
	"use strict";
	ap.Monster = ap.Entity.extend({
		// 类型 判定用
		type: "monster",
		// 生命
		life: 100,
		// 生命上限
		lifeLimit: 100,
		// 攻速 每秒攻击次数 
		attackSpeed: 1,
		// 暴击
		critical: 0,
		// 生命吸取
		drainLife: 0,
		// 仇恨
		target: null,
		// 警觉范围 px
		hateRadius: 500,
		// 强度
		strength: 1,

		// 状态 buff & debuff
		status: [],
		// 持有技能
		skills: {},
		// 位置
		pos: {
			x: 0,
			y: 0
		},
		// 瞄准方向
		aim: 0,
		// 实体的动画效果
		anims: {},
		animSheet: null,
		init: function(property) {
			this.parent(property);
			// 强化怪兽
			this.buff();
		},
		// 用强度强化怪兽
		buff: function() {
			// 强度大于1才需要强化
			if (this.strength > 1) {
				this.lifeLimit = ~~(this.lifeLimit * this.strength);
				this.life = this.lifeLimit;
				this.power = ~~(this.power * this.strength);
			}
		},
		// 警觉 如果警惕范围内有玩家目标，则加入仇恨列表
		vigilance: function() {
			var player = ap.game.player,
				d = ap.utils.getDistance(this.pos, player.pos);
			if (d < this.hateRadius) {
				if (player.redirect) {
					// 仇恨转移
					this.target = player.redirect;
				} else {
					this.target = player;
				}
			}
		},
		// 使用技能
		cast: function() {
			if (Math.random() > this.strength - 0.8) {
				// 设定：根据怪物的强度来判读，如果强度越大，攻击的积极性越高
				return;
			}
			// 遍历技能
			for (var i in this.skills) {
				var s = this.skills[i];
				if (s.timer.delta() >= s.coolDown) {
					// 瞄准当前目标
					s.aim = Math.atan2(this.target.pos.y - this.pos.y, this.target.pos.x - this.pos.x);
					// 检查技能是否准备好
					s.cast();
					// 重置冷却计时
					s.timer.reset();
					break;
				}
			}
		},
		// 向目标移动
		move: function() {

		},
		update: function() {
			// 执行超类
			this.parent();
			// 检索附近的目标
			this.vigilance();
			if (this.target) {
				// 执行移动
				this.move();
				// 开始攻击
				this.cast();
			}

		}
	});
});