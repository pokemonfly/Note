// 宠物
ap.module("pat").requires("monster").defines(function() {
	"use strict";
	ap.Pat = ap.Entity.extend({
		// 类型 判定用
		type: "player",
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
		// 主人
		owner: null,

		// 状态 buff & debuff
		status: [],
		// 持有技能
		skills: {},
		// 瞄准方向
		aim: 0,
		// 实体的动画效果
		anims: {},
		animSheet: null,
		// 警觉 如果警惕范围内有玩家目标，则加入仇恨列表
		vigilance: function() {
			// TODO
			// var player = ap.game.player,
			// 	d = ap.utils.getDistance(this.pos, player.pos);
			// if (d < this.hateRadius) {
			// 	if (player.redirect) {
			// 		// 仇恨转移
			// 		this.target = player.redirect;
			// 	} else {
			// 		this.target = player;
			// 	}
			// }
		},
		// 使用技能
		cast: function() {
			// 遍历技能
			this.skills.forEach(function(s) {
				if (s.timer.delta() >= s.coolDown) {
					// 瞄准当前目标
					s.aim = Math.atan2(this.target.pos.y - this.pos.y, this.target.pos.x - this.pos.x);
					// 检查技能是否准备好
					s.cast();
					// 重置冷却计时
					s.timer.reset();
					break;
				}
			});
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