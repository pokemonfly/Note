// 差值计时器 （考虑到有暂停）
ap.module("timer").requires("class").defines(function() {
	"use strict";
	ap.Timer = ap.Class.extend({
		// 计时器实例用
		base: 0,
		// 初始化计时器 自动执行方法
		init: function(basetime) {
			var basetime = basetime || 0;
			this.base = ap.Timer.time - basetime;
		},
		// 时间差值
		delta: function() {
			var d = ap.Timer.time - this.base;
			return d;
		},
		// 重置当前的计时器
		reset: function() {
			this.base = ap.Timer.time;
		}
	});
	// 当前累计的时间 秒
	ap.Timer.time = 0;
	// 记录上一次执行的时间，用于差值计算
	ap.Timer._last = 0;
	// 最小时间间隔 30ms （暂停也就算20ms）
	ap.Timer._minTick = 0.03;
	// 画面每次刷新都执行一次，累计时间
	ap.Timer.tick = function() {
		var current = +new Date();
		this.time += Math.min(this._minTick, (current - this._last) / 1000);
		this._last = current;
	};
});