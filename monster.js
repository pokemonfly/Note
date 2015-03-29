// 怪兽
ap.module("monster").requires("entity", "image").defines(function() {
	"use strict";
	ap.Monster = ap.Entity.extend({
		// 类型 判定用
		type: "monster",
		// 怪物的品种 成就统计用 幽灵，野兽，植物
		breed: null,
		// 精英标识 0 普通 1 稀有 2 特殊
		rank: 0,
		// 生命
		life: 100,
		// 生命上限
		lifeLimit: 100,
		// 生命成长
		lifeUp: 40,
		// 攻击力
		power: 10,
		// 攻击成长
		powerUp: 5,
		// 攻速 每秒攻击次数 
		attackSpeed: 1,
		// 暴击
		critical: 0,
		// 生命吸取
		drainLife: 0,
		// 瞄准方向
		aim: 0,
		// 仇恨
		target: null,
		// 强度
		strength: 1,
		// 杀死后的经验
		exp: 0,
		// 警觉范围 px
		hateRadius: 500,
		// 攻击距离
		attackRadius: 300,
		// 移动速度 每秒移动像素
		moveSpeed: 100,
		// 移动速度奖励
		moveSpeedBonus: 0,
		// 碰撞体积 半径
		radius: 30,
		// 位置
		pos: null,
		// 本次移动的位置偏移量
		moveOffset: null,
		// 是否需要移动
		needMove: false,
		// 状态 buff & debuff
		status: null,
		// 持有技能
		skills: null,
		// 实体的动画效果
		anims: null,
		// 静态画
		animSheet: null,
		init: function(property) {
			// 初始化引用类型属性
			this.status = [];
			this.skills = {};
			this.pos = {
				x: 0,
				y: 0
			};
			this.moveOffset = {
				x: 0,
				y: 0
			};
			this.parent(property);
			this.lifeLimit = this.life;
			// 强化怪兽
			this.buff();
		},
		// 用强度强化怪兽
		buff: function() {
			// 匹配玩家等级
			this.lifeLimit += ap.game.player.level * this.lifeUp;
			this.life = this.lifeLimit;
			this.power += ap.game.player.level * this.powerUp;
			// 强度大于1才需要强化
			if (this.strength > 1) {
				this.lifeLimit = ~~(this.lifeLimit * this.strength);
				this.life = this.lifeLimit;
				this.power = ~~(this.power * this.strength);
				this.hateRadius = this.hateRadius * this.strength;
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
				// FIX 怪物近身后就取消冲锋效果
				if (d < this.radius + player.radius + 10) {
					this.moveSpeedBonus = 0;
				}
			}
			// 判断是否需要移动
			if (this.target && d > this.attackRadius) {
				this.needMove = true;
			} else {
				this.needMove = false;
			}
		},
		// 使用技能
		cast: function() {
			// 遍历技能
			for (var i in this.skills) {
				var s = this.skills[i];
				if (s.timer.delta() >= s.coolDown) {
					if (s.radius && s.radius <= ap.utils.getDistance(this.pos, this.target.pos)) {
						// 攻击范围不够
						return;
					}
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
		},
		draw: function() {
			this.parent();
			// 绘制血条
			ap.game.drawLifeBar(this);
		}
	});
});