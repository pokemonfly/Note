// 调试用 金手指
ap.module("cheat").requires("utils").defines(function() {
	"use strict";
	// 接收一个指令
	ap.cheat = function(cmd) {
		// 需要提升的等级
		var lvPlus = 0;
		switch (cmd) {
			case "无敌":
				ap.game.player.isInvincible = true;
				console.log("角色已经无敌了.");
				break;
			case "升级":
				lvPlus = 1;
			case "升5级":
				lvPlus = 5;
			case "升10级":
				lvPlus = 10;
				// TODO
				break;
			default:
				console.log("输入的指令不正确.\n" + ap.cheat.help);
		}
	};
	ap.cheat.help = "可用的指令有: \'无敌\' ";
});