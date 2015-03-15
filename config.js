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
					rare : 0.1
				}
			},
			"NORMAL": {},
			"HARD": {}
		},
		// 玩家初始属性
		player: {
			// 安妮的初始属性大多已经在player中预设
			"Annie": {
				animSheet: new ap.Image("media/sprites/annie.png", ap.Image.OFFSET.BELOW),
				skill: ["Pyromania"]
			}
		},
		// 怪物列表
		monsters: [{
			name: "杂鱼",
			skill: null,
			animSheet: new ap.Image("media/ui/1.png", ap.Image.OFFSET.BELOW)
		}],
		// 游戏中掉落的道具
		items: {
			// 普通道具，不限制次数获得
			"NORMAL": {

			},
			// 稀有道具， 只能获得一次，计入成就，可以继承
			"RARE": {

			}
		}
	};
});