// 动画效果
ap.module("animation").requires("timer").defines(function() {
	"use strict";
	// ap.AnimationSheet = ap.Class.extend({
	// 	image: null,
	// 	init: function(image) {
	// 		this.image = image;
	// 	}
	// });
	ap.Animation = ap.Class.extend({
		// 当前动画需要用的全部帧 每一帧都是一个图像
		sheet: null,
		// 当前播放的帧序号
		frame: 0,
		// 动画用计时器
		timer: null,
		// 每一帧动画需要用的时间
		frameTime: 0,
		// 循环次数
		loopCount: 0,
		// 能否被打断播放
		canBreak: true,
		// sheet image数组， frameTime 单帧时间 canBreak 能否被打断播放 默认可以
		init: function(sheet, frameTime, canBreak) {
			this.sheet = [].concat(sheet);
			this.frameTime = frameTime || 1;
			this.frame = 0;
			if (canBreak != undefined) {
				this.canBreak = canBreak;
			}
			if (this.sheet.length > 1) {
				// 有多帧的时候需要计时来控制播放
				this.timer = new ap.Timer();
			}
		},
		// 重置当前的动画 比如实体有多组动画的时候需要切换
		reset: function() {
			this.frame = 0;
			this.loopCount = 0;
			if (this.timer) {
				this.timer.reset();
			}
		},
		// 判断动画是否播放完毕
		end: function() {
			if (this.canBreak || (this.frame == this.sheet.length - 1 && this.loopCount > 0)) {
				return true;
			} else {
				return false;
			}
		},
		update: function() {
			if (this.sheet.length > 1 && this.timer.delta() > this.frameTime) {
				// 播放下一帧
				this.frame++;
				if (this.frame >= this.sheet.length) {
					// 循环播放
					this.frame = 0;
					this.loopCount++;
				}
				this.timer.reset();
			}
		},
		// 绘制坐标 角度
		draw: function(targetX, targetY, angle) {
			var angle = angle || 0;
			this.sheet[this.frame].draw(targetX, targetY, angle);
		}
	});
});