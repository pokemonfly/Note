// 技能 所有的攻击效果
ap.module("skill").requires("utils").defines(function() {
	"use strict";
	ap.skill = {
		// 玩家技能
		pyromania: {
			id: "pyromania",
			name: "嗜火",
			icon: "media/ui/Pyromania.png",
			description: "普通攻击。\n被动效果：每进行4个攻击后，安妮的下一次伤害就会对目标造成短暂的定身效果。",
			coolDown: 0,
			caster: null,
			// 技能范围
			radius: 900,
			// 需要技能指向预览
			hasPreview: false,
			// 施法 参数：方向
			cast: function() {
				var status = [];
				this.caster.attackCount += 1;
				if (this.caster.attackCount >= 5) {
					this.caster.attackCount = 0;
				}
				// 创造火球投射物
				ap.game.createFlyer({
					// 技能伤害
					power: this.caster.power + this.caster.powerBonus,
					// 火球持续时间 s
					duration: 3,
					owner: this.caster,
					// 火球大小
					radius: 30,
					status: status,
					pos: ap.utils.getSkillPos(this.caster.pos, this.caster.radius, this.caster.aim, 30),
					moveAim: this.caster.aim,
					animSheet: new ap.Image("media/item/fireball.png", ap.Image.OFFSET.LOWER_LEFT)
				});
			}
		},
		disintegrate: {
			id: "disintegrate",
			name: "碎裂之火",
			icon: "media/ui/Disintegrate.png",
			description: "安妮向前方施放巨大的魔法火球并造成伤害。",
			coolDown: 3,
			caster: null,
			// 技能范围
			radius: 900,
			// 需要技能指向预览
			hasPreview: true,
			// 施法 参数：方向
			cast: function() {
				var status = [];
				this.caster.attackCount += 1;
				if (this.caster.attackCount >= 5) {
					this.caster.attackCount = 0;
				}
				// 创造火球投射物
				ap.game.createFlyer({
					// 技能伤害
					power: this.caster.power + this.caster.powerBonus,
					// 火球持续时间 s
					duration: 3,
					owner: this.caster,
					// 火球大小
					radius: 30,
					status: status,
					pos: ap.utils.getSkillPos(this.caster.pos, this.caster.radius, this.caster.aim, 30),
					moveAim: this.caster.aim,
					animSheet: new ap.Image("media/item/fireball.png", ap.Image.OFFSET.LOWER_LEFT)
				});
			}
		},
		incinerate: {
			id: "incinerate",
			name: "焚烧",
			icon: "media/ui/Incinerate.png",
			description: "安妮向锥形区域施放一道烈焰，引燃区域内的所有敌人。",
			coolDown: 2,
			caster: null,
			// 技能施法角度
			rad: 75 * Math.PI / 180,
			// 技能伤害倍率
			scale: 3,
			// 技能范围
			radius: 450,
			hasPreview: true,
			// 抬起按键时释放
			cast: function() {
				var status = [];
				// 创造一个在0.1s内只有一跳伤害的dot
				status.push(ap.status.createStatus("burn", "incinerate", this.caster, (this.caster.power + this.caster.powerBonus) * this.scale,
					0.1, 0.1));
				// 区域也是只存在0.1s 在0.06s后，区域的目标将被附加dot
				ap.game.createArea({
					duration: 0.1,
					owner: this.caster,
					pos: {
						x: this.caster.pos.x,
						y: this.caster.pos.y
					},
					radius: this.radius,
					status: status,
					aimS: this.caster.aim - this.caster.aimmingRad / 2,
					aimE: this.caster.aim + this.caster.aimmingRad / 2,
					coolDown: 0.06
				});
			}
		},
		moltenShield: {
			id: "moltenShield",
			name: "熔岩护盾",
			icon: "media/ui/MoltenShield.png",
			description: "安妮施放一个火焰护盾来保护自己。任何对安妮的攻击都将消耗护盾，在护盾消耗尽之前，安妮本身不会受到伤害。",
			coolDown: 30,
			caster: null,
			// 护盾吸收比例
			scale: 0.3,
			// 抬起按键时释放
			cast: function() {
				// 为施法者添加护盾
				this.caster.hasShield = true;
				this.caster.shield = ~~(this.caster.lifeLimit * this.scale);
				this.caster.shieldLimit = this.caster.shield;
				this.caster.shieldDuration = 15;
				this.caster.shieldCreateTimer = new ap.Timer();
			}
		},
		// 怪物技能列表
		charge: {
			id: "charge",
			name: "冲锋",
			description: null,
			coolDown: 10,
			caster: null,
			cast: function() {
				// 移动速度加大
				this.caster.status.push(ap.status.createStatus("charge", "", this.caster, 0,
					2, 0.5));
			}
		},
		fire: {
			id: "fire",
			name: "连射",
			description: null,
			coolDown: 10,
			cost: 0,
			caster: null,
			cast: function() {
				// 同时向5个方向发射投射物

			}
		},
		miasma: {
			id: "miasma",
			name: "毒沼",
			description: null,
			coolDown: 15,
			cost: 0,
			caster: null,
			scale: 0.3,
			cast: function() {
				var status = [];
				// 毒Dot
				status.push(ap.status.createStatus("poison", "", this.caster, (this.caster.power + this.caster.powerBonus) * this.scale,
					8, 0.5));
				// 毒区域
				ap.game.createArea({
					duration: 12,
					owner: this.caster,
					pos: {
						x: ap.game.player.pos.x,
						y: ap.game.player.pos.y
					},
					radius: 60,
					status: status,
					coolDown: 0.1
				});
			}
		}


	};
	// 生成新的技能对象
	ap.skill.createSkill = function(name, caster) {
		if (!ap.skill[name]) {
			throw new Error("技能对象未找到");
		}
		var newSkill = ap.utils.deepCopy(ap.skill[name]);
		newSkill.caster = caster;
		// 如果冷却未设定，则用未角色的攻击速度来设定
		if (newSkill.coolDown === 0) {
			newSkill.coolDown = 1 / caster.attackSpeed;
		}
		// 初始化时，追加属性 冷却用的计时器
		newSkill.timer = new ap.Timer(newSkill.coolDown);
		return newSkill;
	};
});