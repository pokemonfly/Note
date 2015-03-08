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
		}
	};


});