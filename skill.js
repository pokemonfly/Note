// 技能 所有的攻击效果
ap.module("skill").requires("utils").defines(function() {
	"use strict";
	ap.skill = {
		// 玩家技能
		pyromania: {
			id: "pyromania",
			name: "嗜火",
			icon: "media/ui/Pyromania.png",
			description: "普通攻击。\n被动效果：每4次攻击后，安妮的下一次伤害就会对目标造成短暂的定身效果。",
			coolDown: 0,
			caster: null,
			// 技能范围
			radius: 900,
			// 需要技能指向预览
			hasPreview: false,
			// 无法沉默标识 基础技能
			cannotSilence: true,
			// 施法 参数：方向
			cast: function() {
				var status = [],
					power = this.caster.power + this.caster.powerBonus,
					explosionPower = 0;

				if (this.status) {
					for (var i = 0; i < this.status.length; i++) {
						if (this.status[i] == "poison") {
							status.push(ap.status.createStatus("poison", "毒焰", this.caster, (this.caster.power + this.caster.powerBonus) * 0.1,
								4, 1, 0.2));
						}
						if (this.status[i] == "explosion") {
							explosionPower = power * 0.3;
						}
					}
				}
				this.caster.attackCount += 1;
				if (this.caster.attackCount >= 5) {
					this.caster.attackCount = 0;
					status.push(ap.status.createStatus("immobilize", "被动效果", this.caster, 0,
						2, 0.1));
				}
				// 创造火球投射物
				ap.game.createFlyer({
					name: "嗜火",
					// 技能伤害
					power: power,
					// 火球持续时间 s
					duration: 3,
					owner: this.caster,
					// 火球大小
					radius: 30,
					status: status,
					pos: ap.utils.getSkillPos(this.caster.pos, this.caster.radius, this.caster.aim, 30),
					moveAim: this.caster.aim,
					// 爆炸效果
					explosionPower: explosionPower,
					explosionRange: 80 * this.caster.skillRange,
					moveSpeed: 500,
					anims: new ap.Animation([
						new ap.Image("media/sprites/fireball.png", {
							x: 65,
							y: 24
						}, 0, 0, 90, 50),
						new ap.Image("media/sprites/fireball.png", {
							x: 65,
							y: 24
						}, 0, 50, 90, 50),
						new ap.Image("media/sprites/fireball.png", {
							x: 65,
							y: 24
						}, 0, 100, 90, 50),
						new ap.Image("media/sprites/fireball.png", {
							x: 65,
							y: 24
						}, 0, 150, 90, 50)
					], 0.2)
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
			scale: 1.5,
			// 需要技能指向预览
			hasPreview: true,
			// 施法 参数：方向
			cast: function() {
				var status = [],
					power = (this.caster.power + this.caster.powerBonus) * this.scale,
					explosionPower = 0;
				this.caster.attackCount += 1;
				if (this.caster.attackCount >= 5) {
					this.caster.attackCount = 0;
					status.push(ap.status.createStatus("immobilize", "被动效果", this.caster, 0,
						2, 0.1));
				}
				if (this.status) {
					for (var i = 0; i < this.status.length; i++) {
						if (this.status[i] == "explosion") {
							explosionPower = power * 0.3;
						}
					}
				}
				// 创造火球投射物
				ap.game.createFlyer({
					name: "碎裂之火",
					// 技能伤害
					power: power,
					// 火球持续时间 s
					duration: 3,
					owner: this.caster,
					// 火球大小
					radius: 45,
					status: status,
					pos: ap.utils.getSkillPos(this.caster.pos, this.caster.radius, this.caster.aim, 30),
					moveAim: this.caster.aim,
					// 爆炸效果
					explosionPower: explosionPower,
					explosionRange: 100 * this.caster.skillRange,
					moveSpeed: 500,
					anims: new ap.Animation([
						new ap.Image("media/sprites/fireballBig.png", {
							x: 130,
							y: 48
						}, 0, 0, 180, 100),
						new ap.Image("media/sprites/fireballBig.png", {
							x: 130,
							y: 48
						}, 0, 100, 180, 100),
						new ap.Image("media/sprites/fireballBig.png", {
							x: 130,
							y: 48
						}, 0, 200, 180, 100),
						new ap.Image("media/sprites/fireballBig.png", {
							x: 130,
							y: 48
						}, 0, 300, 180, 100)
					], 0.2)
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
			scale: 2,
			// 技能范围
			radius: 450,
			hasPreview: true,
			// 抬起按键时释放
			cast: function() {
				var status = [];
				this.caster.attackCount += 1;
				if (this.caster.attackCount >= 5) {
					this.caster.attackCount = 0;
					status.push(ap.status.createStatus("immobilize", "被动效果", this.caster, 0,
						2, 0.1));
				}
				ap.game.createArea({
					name: "焚烧",
					power: (this.caster.power + this.caster.powerBonus) * this.scale,
					duration: 0.3,
					owner: this.caster,
					pos: {
						x: this.caster.pos.x,
						y: this.caster.pos.y
					},
					radius: this.radius * this.caster.attackRange,
					status: status,
					aimS: this.caster.aim - this.caster.aimmingRad / 2,
					aimE: this.caster.aim + this.caster.aimmingRad / 2,
					coolDown: 0.16,
					anims: new ap.Animation([new ap.Image("media/ui/flame.png", {
						x: 0,
						y: 105
					})])
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
				this.caster.attackCount += 1;
				// 为施法者添加护盾
				this.caster.hasShield = true;
				this.caster.shield = ~~(this.caster.lifeLimit * this.scale * this.caster.shieldBonusRate);
				this.caster.shieldLimit = this.caster.shield;
				this.caster.shieldDuration = 15;
				this.caster.shieldCreateTimer = new ap.Timer();
			}
		},
		tibbers: {
			id: "tibbers",
			name: "提伯斯之怒",
			icon: "media/ui/InfernalGuardian.png",
			description: "安妮召唤伙伴提伯斯为其作战。提伯斯将会追赶并攻击敌人，同时会对身边的敌人造成伤害，在它倒下前，敌人会优先瞄准提伯斯。",
			coolDown: 60,
			duration: 20,
			scale: 1.5,
			caster: null,
			// 初期不可用
			isLock :true,
			// 抬起按键时释放
			cast: function() {
				ap.ui.addMessage("安妮:出来吧，我的小熊~");
				ap.ui.addMessage("提伯斯:吼~~~~");
				var m = new ap.Pat(ap.config.pat["Tibbers"], this.caster, this.scale);
				m.pos = ap.collision.getRandomPosInArea(m.radius, this.caster.pos.x, this.caster.pos.y, 300);
				// 加入到画面
				ap.game.entities = ap.game.entities.concat(m);
			}
		},
		// 怪物技能列表
		throwing: {
			id: "throwing",
			name: "普通远程攻击",
			description: null,
			coolDown: 0,
			cost: 0,
			caster: null,
			cast: function() {
				var status = [];
				if (this.status) {
					for (var i = 0; i < this.status.length; i++) {
						if (this.status[i] == "poison") {
							status.push(ap.status.createStatus("poison", "", this.caster, (this.caster.power + this.caster.powerBonus) * 0.1,
								4, 1, 0.5));
						}
					}
				}
				ap.game.createFlyer({
					// 技能伤害
					power: (this.caster.power + this.caster.powerBonus),
					// 持续时间 s
					duration: 8,
					moveSpeed: 350,
					owner: this.caster,
					radius: 10,
					status: status,
					pos: ap.utils.getSkillPos(this.caster.pos, this.caster.radius, this.caster.aim, 30),
					moveAim: this.caster.aim,
					anims: new ap.Animation([
						new ap.Image("media/ui/throwing.png", {
							x: 13,
							y: 15
						})
					])
				});
			}
		},
		fight: {
			id: "fight",
			name: "普通近战攻击",
			description: null,
			coolDown: 0,
			cost: 0,
			caster: null,
			// 技能施法角度
			rad: 30 * Math.PI / 180,
			cast: function() {
				var status = [];
				if (this.status) {
					for (var i = 0; i < this.status.length; i++) {
						if (this.status[i] == "poison") {
							status.push(ap.status.createStatus("poison", "", this.caster, (this.caster.power + this.caster.powerBonus) * 0.1,
								4, 1, 0.5));
						}
					}
				}
				ap.game.createArea({
					power: (this.caster.power + this.caster.powerBonus),
					duration: 0.2,
					owner: this.caster,
					pos: ap.utils.getSkillPos(this.caster.pos, this.caster.radius, this.caster.aim, 15),
					radius: 60,
					status: status,
					aimS: this.caster.aim - this.rad / 2,
					aimE: this.caster.aim + this.rad / 2,
					coolDown: 0.15,
					anims: new ap.Animation([new ap.Image("media/ui/fight.png", {
						x: 0,
						y: 10
					})])
				});
			}
		},
		portal: {
			id: "portal",
			name: "时空奇点专属攻击",
			description: null,
			coolDown: 0,
			cost: 0,
			caster: null,
			cast: function() {
				// 持续性的召唤生物
				var append = ap.field.portalMonster(this.caster.pos.x, this.caster.pos.y, 800, 4, 1);
				ap.game.entities = ap.game.entities.concat(append);
				ap.game.monsterCount += append.length;
				ap.ui.addMessage("时空奇点闪烁着诡异的光芒，不远处的怪物被刺激的发狂了。更多怪物冲过来了！");
			}
		},
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
			coolDown: 15,
			cost: 0,
			caster: null,
			cast: function() {
				// 同时向5个方向发射投射物
				for (var i = 0; i < 5; i++) {
					ap.game.createFlyer({
						// 技能伤害
						power: (this.caster.power + this.caster.powerBonus),
						// 持续时间 s
						duration: 10,
						moveSpeed: 300,
						owner: this.caster,
						radius: 15,
						status: null,
						pos: ap.utils.getSkillPos(this.caster.pos, this.caster.radius, this.caster.aim, 30),
						moveAim: this.caster.aim + (i * 15 - 30) / 180 * Math.PI,
						anims: new ap.Animation([
							new ap.Image("media/ui/fire.png", {
								x: 84,
								y: 16
							})
						])
					});
				}
			}
		},
		track: {
			id: "track",
			name: "追踪火球",
			description: null,
			coolDown: 15,
			cost: 0,
			caster: null,
			cast: function() {
				ap.game.createFlyer({
					// 技能伤害
					power: (this.caster.power + this.caster.powerBonus),
					// 持续时间 s
					duration: 5,
					moveSpeed: 250,
					owner: this.caster,
					radius: 15,
					status: null,
					// 自动瞄准
					autoFocus: true,
					target: ap.game.player,
					pos: ap.utils.getSkillPos(this.caster.pos, this.caster.radius, this.caster.aim, 30),
					moveAim: this.caster.aim,
					anims: new ap.Animation([
						new ap.Image("media/ui/fire.png", {
							x: 84,
							y: 16
						})
					])
				});
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
					4, 0.5));
				// 毒区域
				ap.game.createArea({
					duration: 8,
					owner: this.caster,
					pos: {
						x: ap.game.player.pos.x,
						y: ap.game.player.pos.y
					},
					radius: 150,
					status: status,
					coolDown: 0.1,
					animSheet: new ap.Image("media/ui/miasma.png", {
						x: 150,
						y: 150
					})
				});
			}
		},
		prison: {
			id: "prison",
			name: "监禁",
			description: null,
			coolDown: 20,
			cost: 0,
			caster: null,
			cast: function() {
				var status = [];
				// 定身debuff 过于强力，不可多放
				status.push(ap.status.createStatus("immobilize", "", this.caster, null,
					2, 0.1));
				ap.game.createArea({
					duration: 0.2,
					owner: this.caster,
					pos: {
						x: ap.game.player.pos.x,
						y: ap.game.player.pos.y
					},
					radius: 20,
					status: status,
					coolDown: 0.1,
					once: true,
					animSheet: new ap.Image("media/ui/prison.png", {
						x: 25,
						y: 20
					})
				});
				// 额外放置一个陷阱
				var pos = ap.collision.getRandomPosInArea(20, this.caster.pos.x, this.caster.pos.y, 600);
				ap.game.createArea({
					duration: this.coolDown,
					owner: this.caster,
					pos: {
						x: pos.x,
						y: pos.y
					},
					radius: 20,
					status: status,
					coolDown: 0.1,
					once: true,
					animSheet: new ap.Image("media/ui/prison.png", {
						x: 25,
						y: 20
					})
				});
			}
		},
		cold: {
			id: "cold",
			name: "寒气",
			description: null,
			coolDown: 15,
			cost: 0,
			caster: null,
			cast: function() {
				var status = [];
				// 减速debuff
				status.push(ap.status.createStatus("slow", "", this.caster, null,
					3, 0.1));
				ap.game.createArea({
					duration: 0.2,
					owner: this.caster,
					pos: {
						x: ap.game.player.pos.x,
						y: ap.game.player.pos.y
					},
					radius: 20,
					status: status,
					coolDown: 0.1,
					once: true,
					animSheet: new ap.Image("media/ui/cold.png", {
						x: 25,
						y: 20
					})
				});
				// 额外放置一个陷阱
				var pos = ap.collision.getRandomPosInArea(20, this.caster.pos.x, this.caster.pos.y, 600);
				ap.game.createArea({
					duration: this.coolDown,
					owner: this.caster,
					pos: {
						x: pos.x,
						y: pos.y
					},
					radius: 20,
					status: status,
					coolDown: 0.1,
					once: true,
					animSheet: new ap.Image("media/ui/cold.png", {
						x: 25,
						y: 20
					})
				});
			}
		},
		silence: {
			id: "silence",
			name: "沉默",
			description: null,
			coolDown: 15,
			cost: 0,
			caster: null,
			cast: function() {
				var status = [];
				// 沉默debuff
				status.push(ap.status.createStatus("silence", "", this.caster, null,
					5, 0.1));
				ap.game.createArea({
					duration: 0.2,
					owner: this.caster,
					pos: {
						x: ap.game.player.pos.x,
						y: ap.game.player.pos.y
					},
					radius: 20,
					status: status,
					coolDown: 0.1,
					once: true
				});
			}
		},
		growth: {
			id: "growth",
			name: "生长",
			description: null,
			coolDown: 20,
			cost: 0,
			caster: null,
			cast: function() {
				ap.ui.addMessage("精英怪物治疗了全体怪物！");
				var bosses = ap.game.getCurrentMonster(1);
				bosses.forEach(function(boss) {
					// 回复buff
					var s = ap.status.createStatus("regeneration", "", "", boss.lifeLimit * 0.01, 3, 0.5);
					boss.status.push(s);
				});
				var monsters = ap.game.getCurrentMonster(0);
				monsters.forEach(function(monster) {
					// 回复buff
					var s = ap.status.createStatus("regeneration", "", "", monster.lifeLimit * 0.05, 3, 0.5);
					monster.status.push(s);
				});
			}
		},
		summon: {
			id: "summon",
			name: "召唤",
			description: null,
			coolDown: 20,
			cost: 0,
			caster: null,
			cast: function() {
				ap.ui.addMessage("精英怪物召唤了一批手下！");
				var append = ap.field.appendMonster();
				ap.game.addMonster(append);
			}
		},
		annihilation: {
			id: "annihilation",
			name: "歼灭",
			description: null,
			coolDown: 20,
			cost: 0,
			caster: null,
			radius: 600,
			// 技能施法角度
			rad: 60 * Math.PI / 180,
			cast: function() {
				// 怪物需要停下来释放技能
				var s = ap.status.createStatus("immobilize", "", "", "", 1, 0.1);
				this.caster.status.push(s);
				ap.game.createArea({
					power: (this.caster.power + this.caster.powerBonus) * 3,
					duration: 1.5,
					owner: this.caster,
					pos: ap.utils.getSkillPos(this.caster.pos, this.caster.radius, this.caster.aim, 15),
					radius: this.radius,
					status: status,
					aimS: this.caster.aim - this.rad / 2,
					aimE: this.caster.aim + this.rad / 2,
					coolDown: 1.4,
					anims: new ap.Animation([new ap.Image("media/ui/Annihilation.png", {
						x: 0,
						y: 300
					}), new ap.Image("media/ui/Annihilation1.png", {
						x: 0,
						y: 300
					})], 1.4)
				});
			}
		},
		bearAttack: {
			id: "bearAttack",
			name: "爪击",
			description: null,
			coolDown: 4,
			cost: 0,
			caster: null,
			// 技能施法角度
			rad: 45 * Math.PI / 180,
			radius: 300,
			cast: function() {
				ap.game.createArea({
					power: (this.caster.power + this.caster.powerBonus),
					duration: 0.3,
					owner: this.caster,
					pos: ap.utils.getSkillPos(this.caster.pos, this.caster.radius, this.caster.aim, 15),
					radius: this.radius,
					status: null,
					aimS: this.caster.aim - this.rad / 2,
					aimE: this.caster.aim + this.rad / 2,
					coolDown: 0.2,
					anims: new ap.Animation([new ap.Image("media/ui/bearAttack.png", {
						x: 0,
						y: 100
					})])
				});
			}
		},
		bearBurn: {
			id: "bearBurn",
			name: "灼热",
			description: null,
			coolDown: 1,
			cost: 0,
			caster: null,
			// 技能施法角度
			rad: 45 * Math.PI / 180,
			radius: 250,
			cast: function() {
				ap.game.createArea({
					power: (this.caster.power + this.caster.powerBonus) * 0.5,
					duration: 0.2,
					owner: this.caster,
					pos: this.caster.pos,
					radius: this.radius,
					coolDown: 0.15
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
			newSkill._cd = 0;
		} else {
			// _cd 记录技能本来的冷却时间
			newSkill._cd = newSkill.coolDown;
		}
		// 初始化时，追加属性 冷却用的计时器
		newSkill.timer = new ap.Timer(newSkill.coolDown);
		// 技能冷却准备完成
		newSkill.isReady = true;
		return newSkill;
	};
});