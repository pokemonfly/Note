// 系统 唯一的
ap.module("system").defines(function() {
	"use strict";
	ap.system = {
		width: 1024,
		height: 768,
		canvas: null,
		context: null,
		running: false,

		init: function() {
			this.canvas = ap.until.$("#canvas");
			this.context = this.canvas.getContext('2d');
		},
		resize: function() {},



	};
});