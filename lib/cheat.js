// 调试用 金手指
ap.module("cheat").requires("utils").defines(function() {
	"use strict";
	// 接收一个指令
	ap.cheat = function(cmd) {
		// 需要提升的等级
		var lvPlus = 0;
		switch (cmd) {
			case "invincible":
				ap.game.player.isInvincible = true;
				console.log("角色已经无敌了.");
				break;
			case "exp500":
				ap.game.player.getExp(500);
				break;
			case "lvUp1":
				ap.game.player.getExp(ap.game.player.nextLvExp - ap.game.player.exp + 1);
				break;
			case "buff":
				var s = ap.status.createStatus("fury", "", "", 0, 30);
				ap.game.player.getStatus(s);
				s = ap.status.createStatus("might", "", "", ap.game.player.power * 0.5, 30);
				ap.game.player.getStatus(s);
				s = ap.status.createStatus("regeneration", "", "", ap.game.player.lifeLimit * 0.02, 30, 0.5);
				ap.game.player.getStatus(s);
				s = ap.status.createStatus("retaliation", "", "", 0, 30);
				ap.game.player.getStatus(s);
				s = ap.status.createStatus("swiftness", "", "", 0, 30);
				ap.game.player.getStatus(s);
				break;
			default:
				console.log("输入的指令不正确.\n" + ap.cheat.help);
		}
	};
	ap.cheat.help = "可用的指令有: \n 无敌 invincible\n 获得500点经验 exp500\n 直接升1级 lvUp1\n 获得全套buff30秒 buff\n";
});