ap.module("game").requires("class").defines(function() {
	ap.Game = ap.Class.extend({
		init : function (config) {

		},
		// 跳到下一个场景
		nextField: function() {

		},
		run: function() {
			this.update();
			this.draw();
		},
	});
});