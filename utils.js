// 工具
ap.module("utils").defines(function() {
	"use strict";
	ap.utils = {
		// 深度拷贝
		deepCopy: function(object) {
			if (!object || typeof(object) != 'object') {
				return object;
			} else if (object instanceof Array) {
				var c = [];
				for (var i = 0, l = object.length; i < l; i++) {
					c[i] = this.deepCopy(object[i]);
				}
				return c;
			} else {
				var c = {};
				for (var i in object) {
					c[i] = this.deepCopy(object[i]);
				}
				return c;
			}
		},
		// 计算2点之间的距离
		getDistance: function(a, b) {
			var ax = a.x || 0,
				ay = a.y || 0,
				bx = b.x || 0,
				by = b.y || 0;
			return Math.sqrt(Math.pow(Math.abs(ax - bx), 2) + Math.pow(Math.abs(ay - by), 2), 0.5);
		},
		// 计算实体与某位置的弧度
		getRad : function(a, b) {
			var ax = a.x || 0,
				ay = a.y || 0,
				bx = b.x || 0,
				by = b.y || 0;
			return Math.atan2(by - ay, bx - ax);
		}
	};


});