// 玩家
ap.module("player").requires("entity", "image").defines(function() {
	"use strict";
	ap.Player = ap.Entity.extend({
		// 等级
		level: 1,
		// 经验
		exp: 0,
		// 升级需要经验
		nextLvExp: 280,
		// 类型 中介用
		type: "PLAYER",

		// 生命
		life: 512,
		// 生命上限
		lifeLimit: 512,

		// 精神
		spirit: 0,
		// 精神上限
		spiritLimit: 200,
		// 精神恢复速度 每秒恢复数值
		spiritSpeed: 2,

		// 攻击力
		power: 50,
		// 攻速 每秒攻击次数 
		attackSpeed: 0.6,
		// 暴击
		critical: 0.05,
		// 爆炸范围加成
		range: 0,
		// 生命吸取
		drainLife: 0.05,
		// 技能方向
		aim: 0,

		// 位置
		pos: {
			x: 0,
			y: 0
		},
		// 角色移动方向 弧度
		moveAim: 0,
		// 移动的目标地点
		moveTo: {
			x: 0,
			y: 0
		},
		// 移动速度 
		moveSpeed: 200,

		// 是否有护盾
		hasShield: false,
		// 护盾值
		shield: 0,
		// 护盾上限
		shieldLimit: 0,
		// 护盾上限加成
		shieldBonus: 0,
		// 护盾创建时间
		shieldCreateTime: 0,
		// 护盾持续时间
		shieldDuration: 0,

		// 是否无敌
		isInvincible: false,

		// 表示图像
		animSheet: new ap.Image("media/frames/a.jpg"),
		ready: function() {
			// 护盾状态
			if (this.hasShield) {
				if (+new Date() > this.shieldCreateTime + this.shieldDuration) {
					this.hasShield = false;
				}
			}
		},

		// 造成伤害

		// 受到伤害
		hurt: function(damage) {
			// 检查是否无敌
			if (isInvincible) {
				return;
			}

			if (this.hasShield) {
				this.shield -= damage;
				if (this.shiled < 0) {
					// 护盾被完全消耗
					this.life += this.shiled;
					this.hasShield = false;
				}
			} else {
				this.life -= damage;
			}
		},

		update: function() {
			// 角色移动
			// 是否使用键盘来移动
			var useKey = false;
			var keyAim = {
				x: this.pos.x,
				y: this.pos.y
			};
			// 鼠标点击 移动位置
			if (ap.input.pressed("Go")) {
				// 设定目标地点
				this.moveTo.x = ap.input.mouse.x;
				this.moveTo.y = ap.input.mouse.y;
			}
			if (ap.input.pressed("Up")) {
				useKey = true;
				keyAim.y--;
			}
			if (ap.input.pressed("Left")) {
				useKey = true;
				keyAim.x--;
			}
			if (ap.input.pressed("Down")) {
				useKey = true;
				keyAim.y++;
			}
			if (ap.input.pressed("Right")) {
				useKey = true;
				keyAim.x++;
			}

			// 设置移动方向
			if (useKey) {
				this.moveAim = Math.atan2(keyAim.y - this.pos.y, keyAim.x - this.pos.x);
			} else {
				this.moveAim = Math.atan2(this.moveTo.y - this.pos.y, this.moveTo.x - this.pos.x);
			}

			// 角色未定身的话开始移动
			if (!this.isImmobilize) {
				// 当前时间段可以移动的距离 像素
				// if (Math.abs(this.moveTo.x - this.pos.x) >= 1 || Math.abs(this.moveTo.y - this.pos.y) >= 1) {
				if (useKey) {
					// 当前可以移动的长度
					var distance = this.moveTimer.delta() * this.moveSpeed;
					this.pos.x += distance * Math.cos(this.moveAim);
					this.pos.y += distance * Math.sin(this.moveAim);
					this.moveTo.x = this.pos.x;
					this.moveTo.y = this.pos.y;
				} else {
					if (this.moveTo.x !== this.pos.x || this.moveTo.y !== this.pos.y) {
						// 当前可以移动的长度
						var distance = this.moveTimer.delta() * this.moveSpeed;

						// 距离目标的长度
						var current = Math.sqrt(Math.pow(Math.abs(this.moveTo.x - this.pos.x), 2) + Math.pow(Math.abs(this.moveTo.y - this.pos.y), 2), 0.5);
						if (distance < current) {
							this.pos.x += distance * Math.cos(this.moveAim);
							this.pos.y += distance * Math.sin(this.moveAim);
						} else {
							this.pos.x = this.moveTo.x;
							this.pos.y = this.moveTo.y;

						}

					}
				}
				this.moveTimer.reset();
			}

			// 普通攻击
			if (ap.input.pressed("Attack1")) {
				// 鼠标攻击
				this.aim = Math.atan2(ap.input.mouse.y - this.pos.y, ap.input.mouse.x - this.pos.x);
			}
			if (ap.input.pressed("Attack2")) {
				// 键盘攻击
				this.aim = this.moveAim;
			}
		}
	});
});