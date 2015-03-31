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
		// 攻击力
		power: 10,
		// 攻速 每秒攻击次数 
		attackSpeed: 1,
		// 暴击
		critical: 0,
		// 生命吸取
		drainLife: 0,
		// 仇恨
		target: null,
		// 警觉范围 px
		hateRadius: 600,
		// 攻击距离
		attackRadius: 200,
		// 主人
		owner: null,
		// 碰撞体积 半径
		radius: 30,
		// 持续时间
		duration: 0,
		// 持续时间 计时器
		durationTimer: null,

		// 状态 buff & debuff
		status: null,
		// 持有技能
		skills: null,
		// 本次移动的位置偏移量
		moveOffset: null,
		// 瞄准方向
		aim: 0,
		// 实体的动画效果
		anims: null,
		animSheet: null,
		// 初始化 owner : 主人 scale：pat属性倍率
		init: function(property, owner, scale, duration) {
			this.parent(property);
			// 初始化引用类型属性
			this.status = [];
			this.pos = {
				x: 0,
				y: 0
			};
			this.moveOffset = {
				x: 0,
				y: 0
			};
			// 熊的属性由主人决定
			this.owner = owner;
			this.life = ~~(this.owner.lifeLimit * scale);
			this.lifeLimit = this.life;
			this.power = ~~((this.owner.power + this.owner.powerBonus) * scale / 2);
			this.moveSpeed = ~~((this.owner.moveSpeed + this.owner.moveSpeedBonus) * scale / 2);
			this.owner.redirect = this;
			// 宠物的持续时间
			this.duration = duration;
			this.durationTimer = new ap.Timer();
		},
		// 警觉 
		vigilance: function() {
			var entities = ap.game.entities,
				entity = null,
				d = ap.utils.getDistance(this.pos, this.owner.pos),
				min = this.hateRadius,
				target = null;
			for (var i = 0; i < entities.length; i++) {
				entity = entities[i];
				if (entity instanceof ap.Monster) {
					d = ap.utils.getDistance(this.pos, entity.pos);
					if (d < this.hateRadius && d < min) {
						// 如果范围内有敌对生物，则攻击最近的
						min = d;
						target = entity;
					}
				}
			}
			if (target) {
				this.target = target;
			} else {
				this.target = this.owner;
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
					if ((s.radius && s.radius <= ap.utils.getDistance(this.pos, this.target.pos) - this.radius) || this.target.type == this.type) {
						// 攻击范围不够
						continue;
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
		// 死亡事件
		onKill: function() {
			this.isKilled = true;
			this.owner.redirect = null;
			ap.mediator.fire("patDead");
			// 回馈主人buff
			var s = ap.status.createStatus("fury", "", "", 0, 30);
			this.owner.getStatus(s);
			s = ap.status.createStatus("might", "", "", this.owner.power * 0.8, 20);
			this.owner.getStatus(s);
			s = ap.status.createStatus("regeneration", "", "", this.owner.lifeLimit * 0.08, 5, 0.5);
			this.owner.getStatus(s);
			s = ap.status.createStatus("retaliation", "", "", 0, 30);
			this.owner.getStatus(s);
			s = ap.status.createStatus("swiftness", "", "", 0, 15);
			this.owner.getStatus(s);
		},
		update: function() {
			// 执行超类
			this.parent();
			if (this.duration > this.durationTimer.delta()) {
				// 检索附近的目标
				this.vigilance();
				// 执行移动
				this.move();
				if (this.target) {
					// 开始攻击
					this.cast();
				}
			} else {
				// 超过存在时间则消灭
				this.isKilled = true;
				this.owner.redirect = null;
				ap.ui.addMessage(this.name + "消失了。");
			}
		},
		draw: function() {
			this.parent();
			// 绘制血条
			ap.game.drawLifeBar(this);
		}
	});
});