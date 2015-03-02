// 调试用
ap.module("cheat").requires("utils").defines(function() {
	ap.setShield = function (per) {
		var shieldNum = ap.$("#shieldNum");
		var life = ap.$("#life");
		if (per > 0) {
			shieldNum.style.display = "";
			ap.utils.addClass(life, "hasShield");
		} else {
			shieldNum.style.display = "none";
			ap.utils.removeClass(life, "hasShield");
		}
	};
});