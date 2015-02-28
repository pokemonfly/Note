// 成就 与成就面板绑定
"use strict";
ap.module("achievement").defines(function() {
	ap.Achievement = {
		// 杀死怪物数
		killCount : 0,
		// 使用特定技能杀死怪物数
		skillKillCount : {
			pyromania : 0,
			disintegrate : 0,
			incinerate : 0,
			tibbers : 0,
			reflection : 0,
			burn : 0
		},
		healingCount : 0,
	};
});