// 游戏设定 & 配置
ap.module("config").requires("image").defines(function() {
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
			"NORMAL": {},
			"HARD": {}
		},
		// 玩家初始属性
		player: {
			// 安妮的初始属性大多已经在player中预设
			"Annie": {
				name: "安妮",
				animSheet: new ap.Image("media/sprites/annie.png", ap.Image.OFFSET.BELOW),
				skill: ["pyromania", "disintegrate", "incinerate", "moltenShield"]
			}
		},
		// 怪物列表
		monsters: [{
			name: "杂鱼",
			skill: [],
			exp : 30,
			animSheet: new ap.Image("media/ui/1.png", ap.Image.OFFSET.BELOW)
		}],
		// 游戏中掉落的道具
		items: {
			// 普通道具，不限制次数获得
			"NORMAL": [{
				name: "活力夹心饼干",
				description: "获得额外的经验",
				effect: function() {
					ap.game.player.getExp(100);
				}
			}, {
				name: "多兰碎片",
				description: "攻击力永久提高",
				effect: function() {
					ap.game.player.power += 1;
				}
			}, {
				name: "生命宝珠",
				description: "生命上限永久提高",
				effect: function() {
					ap.game.player.lifeLimit += 5;
				}
			}, {
				name: "法力药水",
				description: "恢复一些精神能量",
				effect: function() {
					ap.game.player.spirit += 50;
					if (ap.game.player.spirit > ap.game.player.spiritLimit) {
						ap.game.player.spirit = ap.game.player.spiritLimit;
					}
				}
			}, {
				name: "狂野合剂",
				description: "获得激怒",
				effect: function() {

				}
			}, {
				name: "怒火合剂",
				description: "获得威能",
				effect: function() {

				}
			}, {
				name: "生命药水",
				description: "获得治疗",
				effect: function() {

				}
			}, {
				name: "坚韧合剂",
				description: "获得反弹",
				effect: function() {

				}
			}, {
				name: "迅捷药水",
				description: "获得迅捷",
				effect: function() {

				}
			}],
			// 稀有道具 只能获得一次，计入成就，可以继承
			"RARE": [{
				name: "蜂刺",
				description: "攻击速度增加",
				effect: function() {
					ap.game.player.attackSpeed = 1.6;
				}
			}, {
				name: "魔宗",
				description: "所有攻击射程增加",
				effect: function() {
					ap.game.player.attackRange = 1.2;
				}
			}, {
				name: "智慧末刃",
				description: "技能范围加大",
				effect: function() {
					ap.game.player.skillRange = 1.2;
				}
			}, {
				name: "黯炎火炬",
				description: "普通攻击附带爆炸",
				effect: function() {

				}
			}, {
				name: "轻灵之靴",
				description: "移动速度加快",
				effect: function() {
					ap.game.player.moveSpeed += 50;
				}
			}, {
				name: "日炎斗篷",
				description: "护盾吸收效果加强",
				effect: function() {

				}
			}, {
				name: "幽梦之灵",
				description: "物品掉落提高",
				effect: function() {
					ap.game.dropRate *= 2;
				}
			}, {
				name: "时光之杖",
				description: "击杀后恢复效果提高",
				effect: function() {

				}
			}, {
				name: "燃烧宝石",
				description: "技能冷却缩减",
				effect: function() {

				}
			}, {
				name: "冰霜之心",
				description: "精神恢复速度加快",
				effect: function() {
					ap.game.player.spiritSpeed += 3;
				}
			}, {
				name: "禁忌雕像",
				description: "提伯斯的持续时间延长",
				effect: function() {

				}
			}, {
				name: "熊灵号角",
				description: "提伯斯的伤害和血量加强",
				effect: function() {

				}
			}, {
				name: "双生暗影",
				description: "普通攻击小几率附加毒伤",
				effect: function() {

				}
			}, {
				name: "女神之泪",
				description: "经验获得速度加快",
				effect: function() {
					ap.game.player.expRate *= 1.2;
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