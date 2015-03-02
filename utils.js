// 工具
ap.module("utils").defines(function() {
	ap.utils = {
		// CSS 操作
		hasClass: function(obj, cls) {
			return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
		},
		addClass: function(obj, cls) {
			if (!this.hasClass(obj, cls)) {
				obj.className += " " + cls;
			}
		},
		removeClass: function(obj, cls) {
			if (this.hasClass(obj, cls)) {
				var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
				obj.className = obj.className.replace(reg, '');
			}
		},
		// 深度拷贝
		deepCopy: function(obj) {
			return obj;
		},
		// 播放剧情
		playScenario: function() {

		}
	};


});