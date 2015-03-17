// 工具
ap.module("utils").defines(function() {
	"use strict";
	ap.utils = {
		// 深度拷贝
		deepCopy: function(object) {
			if (!object || typeof(object) != 'object' || object instanceof HTMLElement || object instanceof ap.Class) {
				// 此处如果不加HTMLElement的话，可能因拷贝DOM发生浏览器崩溃
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
		getRad: function(a, b) {
			var ax = a.x || 0,
				ay = a.y || 0,
				bx = b.x || 0,
				by = b.y || 0;
			return Math.atan2(by - ay, bx - ax);
		},
		// 计算技能初始时的位置  施法者位置 施法者半径 技能碰撞半径 
		getSkillPos: function(casterPos, casterRadius, aim, radius) {
			return {
				x: Math.round((casterRadius + radius) * Math.cos(aim) + casterPos.x),
				y: Math.round((casterRadius + radius) * Math.sin(aim) + casterPos.y)
			};
		}
	};


});