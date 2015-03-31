// 游戏设定 & 配置
ap.module("config").requires("image", "animation").defines(function() {
	"use strict";
	ap.config = {
		// 难度影响的设定
		// 难度影响范围：怪物的初始强度、强度增加速度，数目，
		// 场地的大小、特性数（特性决定怪物的技能）、离开前的击杀数，同时存在的怪物数目上限
		// 物品的掉率，稀有场景出现频率，
		// 角色的等级上限、结局，技能消耗，经验获得速度
		// 部分成就
		difficulty: {
			"EASY": {
				// 场景设定 区域越深，难度越大，若干个区域后强化一次
				field: {
					// 场上预留怪物数目
					monstersAmount: 10,
					// 场上预留boss数目
					bossAmount: 1,
					// 场景特性数目
					featureAmount: 2,
					// 援军增加数目
					monstersPlus: 5,
					// 离开前必须击杀数目
					leaveKill: 15,
					// 每次强化需要击杀数目增加
					leaveKillUpd: 3,
					// 每次强化boss数目增加幅度
					bossUpd: 0.1,
					// 每次强化特性数目增加幅度
					featureUpd: 0.2,
					// 每次强化援军数目增加幅度
					monstersPlusUpd: 0.5,
					// 怪物强度
					strength: 1,
					// 区域强化间隔数
					updateNum: 5,
					// 稀有区域概率
					rare: 0.1
				}
			},
			"NORMAL": {
				field: {
					// 场上预留怪物数目
					monstersAmount: 15,
					// 场上预留boss数目
					bossAmount: 2,
					// 场景特性数目
					featureAmount: 2,
					// 援军增加数目
					monstersPlus: 6,
					// 离开前必须击杀数目
					leaveKill: 18,
					// 每次强化需要击杀数目增加
					leaveKillUpd: 4,
					// 每次强化boss数目增加幅度
					bossUpd: 0.15,
					// 每次强化特性数目增加幅度
					featureUpd: 0.2,
					// 每次强化援军数目增加幅度
					monstersPlusUpd: 0.8,
					// 怪物强度
					strength: 1.5,
					// 区域强化间隔数
					updateNum: 6,
					// 稀有区域概率
					rare: 0.2
				}
			},
			"HARD": {
				field: {
					// 场上预留怪物数目
					monstersAmount: 20,
					// 场上预留boss数目
					bossAmount: 3,
					// 场景特性数目
					featureAmount: 2,
					// 援军增加数目
					monstersPlus: 8,
					// 离开前必须击杀数目
					leaveKill: 20,
					// 每次强化需要击杀数目增加
					leaveKillUpd: 5,
					// 每次强化boss数目增加幅度
					bossUpd: 0.2,
					// 每次强化特性数目增加幅度
					featureUpd: 0.2,
					// 每次强化援军数目增加幅度
					monstersPlusUpd: 1,
					// 怪物强度
					strength: 2,
					// 区域强化间隔数
					updateNum: 7,
					// 稀有区域概率
					rare: 0.4
				}
			}
		},
		// 玩家初始属性
		player: {
			// 安妮的初始属性大多已经在player中预设
			"Annie": {
				name: "安妮",
				skill: ["pyromania", "disintegrate", "incinerate", "moltenShield", "tibbers"],
				animsSet: {
					"stand": new ap.Animation(
						new ap.Image("media/entity/annieStand.png", {
							x: 77,
							y: 195
						})
					),
					"move": new ap.Animation(
						[new ap.Image("media/entity/annieStand.png", {
								x: 77,
								y: 195
							}),
							new ap.Image("media/entity/annieMove1.png", {
								x: 92,
								y: 195
							}),
							new ap.Image("media/entity/annieStand.png", {
								x: 77,
								y: 195
							}),
							new ap.Image("media/entity/annieMove2.png", {
								x: 75,
								y: 195
							})
						], 0.2),
					"attack": new ap.Animation(
						[new ap.Image("media/entity/annieStand.png", {
								x: 77,
								y: 195
							}),
							new ap.Image("media/entity/annieAttack.png", {
								x: 75,
								y: 195
							})
						], 0.2, false)
				}
			}
		},
		// 宠物
		pat: {
			"Tibbers": {
				name: "提伯斯",
				skill: ["bearAttack", "bearBurn"],
				radius: 80,
				animSheet: new ap.Image("media/entity/petBear.png")
			}
		},
		// 怪物列表
		monsters: [{
			name: "投掷型杂草·I",
			skill: ["throwing"],
			breed: "plant",
			life: 80,
			exp: 30,
			power: 10,
			attackRadius: 400,
			hateRadius: 800,
			attackSpeed: 0.5,
			radius: 30,
			lifeUp: 40,
			powerUp: 5,
			animSheet: new ap.Image("media/entity/plant1.png")
		}, {
			name: "投掷型杂草·II",
			skill: ["throwing"],
			breed: "plant",
			life: 85,
			exp: 35,
			power: 10,
			attackRadius: 400,
			hateRadius: 800,
			attackSpeed: 0.25,
			radius: 25,
			lifeUp: 40,
			powerUp: 4,
			animSheet: new ap.Image("media/entity/plant2.png")
		}, {
			name: "格斗型杂草·I",
			skill: ["fight"],
			breed: "plant",
			life: 110,
			exp: 35,
			power: 15,
			attackRadius: 15,
			hateRadius: 800,
			attackSpeed: 0.5,
			radius: 30,
			lifeUp: 50,
			powerUp: 8,
			animSheet: new ap.Image("media/entity/plant3.png")
		}, {
			name: "格斗型杂草·II",
			skill: ["fight"],
			breed: "plant",
			life: 130,
			exp: 35,
			power: 15,
			attackRadius: 15,
			hateRadius: 800,
			attackSpeed: 0.75,
			radius: 30,
			lifeUp: 45,
			powerUp: 7,
			animSheet: new ap.Image("media/entity/plant4.png")
		}],
		bosses: [{
			name: "精锐投掷型杂草·I",
			skill: ["throwing"],
			breed: "plant",
			life: 400,
			exp: 120,
			power: 20,
			attackRadius: 400,
			hateRadius: 800,
			attackSpeed: 0.5,
			radius: 30,
			lifeUp: 50,
			powerUp: 7,
			animSheet: new ap.Image("media/entity/plant1G.png")
		}, {
			name: "精锐投掷型杂草·II",
			skill: ["throwing"],
			breed: "plant",
			life: 420,
			exp: 130,
			power: 20,
			attackRadius: 400,
			hateRadius: 800,
			attackSpeed: 0.25,
			radius: 25,
			lifeUp: 40,
			powerUp: 7,
			animSheet: new ap.Image("media/entity/plant2G.png")
		}, {
			name: "精锐格斗型杂草·I",
			skill: ["fight"],
			breed: "plant",
			life: 450,
			exp: 150,
			power: 30,
			attackRadius: 15,
			hateRadius: 800,
			attackSpeed: 0.5,
			radius: 30,
			lifeUp: 80,
			powerUp: 10,
			animSheet: new ap.Image("media/entity/plant3G.png")
		}, {
			name: "精锐格斗型杂草·II",
			skill: ["fight"],
			breed: "plant",
			life: 500,
			exp: 200,
			power: 40,
			attackRadius: 15,
			hateRadius: 800,
			attackSpeed: 0.75,
			radius: 30,
			lifeUp: 60,
			powerUp: 7,
			animSheet: new ap.Image("media/entity/plant4G.png")
		}],
		// 专属怪物
		rareMonster: [{
			name: "时空奇点",
			skill: ["portal"],
			breed: "portal",
			life: 2500,
			exp: 1,
			power: 0,
			// 不需要移动
			attackRadius: 9999,
			hateRadius: 400,
			attackSpeed: 0.08,
			radius: 80,
			lifeUp: 300,
			animSheet: new ap.Image("media/entity/portal.png", {
				x: 84,
				y: 187
			})
		}, {
			name: "狂暴的暗影熊",
			skill: ["bearAttack"],
			breed: "bearAttack",
			life: 3500,
			exp: 100,
			power: 60,
			attackRadius: 250,
			hateRadius: 9999,
			attackSpeed: 1,
			radius: 70,
			powerUp: 10,
			lifeUp: 10,
			animSheet: new ap.Image("media/entity/crazyBear.png", {
				x: 130,
				y: 250
			})
		}],
		// 游戏中掉落的道具
		items: {
			// 普通道具，不限制次数获得
			"NORMAL": [{
				name: "活力夹心饼干",
				description: "获得额外的100经验",
				effect: function() {
					ap.game.player.getExp(100);
				}
			}, {
				name: "多兰碎片",
				description: "攻击力永久提高1点",
				effect: function() {
					ap.game.player.power += 1;
				}
			}, {
				name: "生命宝珠",
				description: "生命上限永久提高5点",
				effect: function() {
						ap.game.player.lifeLimit += 5;
					}
					// }, {
					// 	name: "法力药水",
					// 	description: "恢复一些精神能量",
					// 	effect: function() {
					// 		ap.game.player.spirit += 50;
					// 		if (ap.game.player.spirit > ap.game.player.spiritLimit) {
					// 			ap.game.player.spirit = ap.game.player.spiritLimit;
					// 		}
					// 	}
			}, {
				name: "狂野合剂",
				description: "获得激怒",
				effect: function() {
					var s = ap.status.createStatus("fury", "", "", 0, 30);
					ap.game.player.getStatus(s);
				}
			}, {
				name: "怒火合剂",
				description: "获得威能",
				effect: function() {
					var s = ap.status.createStatus("might", "", "", ap.game.player.power * 0.2, 20);
					ap.game.player.getStatus(s);
				}
			}, {
				name: "生命药水",
				description: "获得治疗，5秒内30%生命回复",
				effect: function() {
					var s = ap.status.createStatus("regeneration", "", "", ap.game.player.lifeLimit * 0.03, 5, 0.5);
					ap.game.player.getStatus(s);
				}
			}, {
				name: "坚韧合剂",
				description: "获得反弹",
				effect: function() {
					var s = ap.status.createStatus("retaliation", "", "", 0, 30);
					ap.game.player.getStatus(s);
				}
			}, {
				name: "迅捷药水",
				description: "获得迅捷",
				effect: function() {
					var s = ap.status.createStatus("swiftness", "", "", 0, 15);
					ap.game.player.getStatus(s);
				}
			}],
			// 稀有道具 只能获得一次，计入成就，可以继承
			"RARE": [{
				name: "蜂刺",
				description: "攻击速度增加50%",
				// 恢复游戏时属性已经被修改过，不需要重复设置
				once: true,
				effect: function() {
					ap.game.player.attackSpeed += 0.5;
					ap.game.player.setCD();
				}
			}, {
				name: "魔宗",
				description: "所有攻击射程增加30%",
				once: true,
				effect: function() {
					ap.game.player.attackRange += 0.3;
				}
			}, {
				name: "智慧末刃",
				description: "技能范围加大50%",
				once: true,
				effect: function() {
					ap.game.player.skillRange += 0.5;
				}
			}, {
				name: "黯炎火炬",
				description: "火球攻击附带爆炸效果",
				effect: function() {
					var s = ap.game.player.skills["pyromania"];
					s.status = ["explosion"];
					s = ap.game.player.skills["disintegrate"];
					s.status = ["explosion"];
				}
			}, {
				name: "轻灵之靴",
				description: "移动速度提高50",
				once: true,
				effect: function() {
					ap.game.player.moveSpeed += 50;
				}
			}, {
				name: "日炎斗篷",
				description: "护盾吸收效果提高50%",
				once: true,
				effect: function() {
					ap.game.player.shieldBonusRate += 0.5;
				}
			}, {
				name: "幽梦之灵",
				description: "物品掉落提高一倍",
				once: true,
				effect: function() {
					ap.game.dropRate *= 2;
				}
			}, {
				name: "时光之杖",
				description: "攻击的生命吸取效果提高20%",
				once: true,
				effect: function() {
					ap.game.player.drainLife += 0.2;
				}
			}, {
				name: "燃烧宝石",
				description: "技能冷却缩减20%",
				once: true,
				effect: function() {
						ap.game.player.cdDown += 0.2;
						ap.game.player.setCD();
					}
					// }, {
					// 	name: "冰霜之心",
					// 	description: "精神恢复速度加快",
					// 	effect: function() {
					// 		ap.game.player.spiritSpeed += 3;
					// 	}
			}, {
				name: "禁忌雕像",
				description: "提伯斯的持续时间延长",
				effect: function() {
					var s = ap.game.player.skills["tibbers"];
					s.duration = 40;
				}
			}, {
				name: "熊灵号角",
				description: "提伯斯的伤害和血量加强",
				effect: function() {
					var s = ap.game.player.skills["tibbers"];
					s.scale = 3;
				}
			}, {
				name: "双生暗影",
				description: "普通攻击小几率附加毒焰伤害",
				effect: function() {
					var s = ap.game.player.skills["pyromania"];
					s.status = ["poison"];
				}
			}, {
				name: "女神之泪",
				description: "经验获得速度提高50%",
				once: true,
				effect: function() {
					ap.game.player.expRate += 0.5;
				}
			}, {
				name: "启示灵药",
				description: "升级奖励 + 1",
				effect: function() {
					ap.game.player.levelUpBonusCount += 1;
				}
			}, {
				name: "狂怒灵药",
				description: "升级奖励 + 1",
				effect: function() {
					ap.game.player.levelUpBonusCount += 1;
				}
			}, {
				name: "神谕精粹",
				description: "升级奖励 + 1",
				effect: function() {
					ap.game.player.levelUpBonusCount += 1;
				}
			}]
		}
	};
});