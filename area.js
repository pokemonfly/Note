// 区域 治疗或伤害
ap.module("area").requires("entity", "image").defines(function() {
	"use strict";
	ap.Area = ap.Entity.extend({
		pos: {
			x: 0,
			y: 0
		},
		update: function() {
		
		}
	});
});