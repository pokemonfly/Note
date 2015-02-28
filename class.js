// 基类 用于实现继承
// 方式： 子类.原型  指向 父类
// 规定不使用子类修改原型属性
ap.module("class").defines(function() {
	ap.Class = function() {};
	// 判断是否需要进行初始化
	ap.initializing = false;
	// 参数为子类的属性
	ap.Class.extend = function(prop) {
		var parent = this.prototype;
		ap.initializing = true;
		var prototype = new this();
		ap.initializing = false;
		// 将子类属性拷贝到子类的原型中
		for (var name in prop) {
			if (typeof(prop[name]) == "function" && typeof(parent[name]) == "function") {
				// 如果父类和子类中有同名方法，则创建一个super方法
				prototype[name] = (function(name, fn) {
					return function() {
						var tmp = this.parent;
						this.parent = parent[name];
						var ret = fn.apply(this, arguments);
						this.parent = tmp;
						return ret;
					};
				})(name, prop[name]);
			} else {
				prototype[name] = prop[name];
			}
		}

		function Class() {
			if (!ap.initializing) {
				// 判断是否定义了单例
				if (this.singleton) {
					var obj = this.singleton.apply(this, arguments);
					if (obj) {
						return obj;
					}
				}			
				// 实现子类的init方法
				if (this.init) {
					this.init.apply(this, arguments);
				}
			}
			return this;
		}
		Class.prototype = prototype;
		Class.prototype.constructor = Class;
		Class.extend = ap.Class.extend;

		return Class;
	};
});