// 成就 与成就面板绑定
"use strict";
ap.module("achievement").requires("timer").defines(function() {
	ap.achievement = {
		// 游戏时间
		gameTime: 0,
		// 本次游戏时间
		currentGameTime: 0,
		// 杀死怪物数
		killCount: 0,
		// 本次杀死怪物数
		currentKillCount: 0,
		// 使用特定技能杀死怪物数
		skillKillCount: {
			"嗜火": 0,
			"焚烧": 0,
			"碎裂之火": 0,
			"提伯斯-爪击": 0,
			"提伯斯-灼热": 0,
			"嗜火爆炸": 0,
			"碎裂之火爆炸": 0,
			"毒焰": 0
		},
		// 稀有物品收集
		rareItemCollect: [],
		// 去过的最远的区域号
		maxFieldNum : 1,
		// 最高等级
		maxLevel: 1
	};
});