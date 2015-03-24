// 游戏用输入监听（基于ap.system.run)  DOM元素监听在ap.ui中定义
ap.module("input").defines(function() {
	"use strict";
	ap.KEY = {
		'MOUSE1': -1,
		'MOUSE2': -3,
		'ESC': 27,
		'Q': 81,
		'W': 87,
		'E': 69,
		'R': 82,
		'B': 66,
		'Y': 89,
		'C': 67,
		'SPACE': 32,
		'LEFT': 37,
		'UP': 38,
		'RIGHT': 39,
		'DOWN': 40
	};
	ap.input = {
		// 当前已经绑定的按键
		bindings: {},
		// 当前按下的按钮
		presses: {},
		// 当前准备抬起的按钮
		release: {},
		mouse: {
			x: 0,
			y: 0
		},
		// 使用鼠标标识
		useMouse: true,
		init: function() {
			this.bindings = {};
			this.presses = {};
			// 为键盘添加监听
			window.addEventListener('keydown', this.keydown.bind(this), false);
			window.addEventListener('keyup', this.keyup.bind(this), false);
			// 为鼠标添加监听
			window.addEventListener('contextmenu', this.contextmenu.bind(this), false);
			window.addEventListener('mousedown', this.keydown.bind(this), false);
			window.addEventListener('mouseup', this.keyup.bind(this), false);
			window.addEventListener('mousemove', this.mousemove.bind(this), false);

			this.bindKey();
		},
		keydown: function() {
			var code = event.type == 'keydown' ? event.keyCode : (event.button == 2 ? ap.KEY.MOUSE2 : ap.KEY.MOUSE1);
			if (event.type == 'touchstart' || event.type == 'mousedown') {
				this.mousemove(event);
			}
			var action = this.bindings[code];
			if (action) {
				this.presses[action] = true;
				event.stopPropagation();
				event.preventDefault();
			}
			// 如果使用了键盘方向的话，就标记为键盘操作
			if (action === "Left" || action === "Up" || action === "Right" || action === "Down") {
				this.useMouse = false;
			}
		},
		keyup: function() {
			var tag = event.target.tagName;
			var code = event.type == 'keyup' ? event.keyCode : (event.button == 2 ? ap.KEY.MOUSE2 : ap.KEY.MOUSE1);
			var action = this.bindings[code];
			if (action) {
				this.presses[action] = false;
				this.release[action] = true;
				event.stopPropagation();
				event.preventDefault();
			}
		},
		// 外部调用，判断某动作是否按下
		pressed: function(action) {
			return this.presses[action];
		},
		// 按键抬起动作
		released: function(action) {
			return this.release[action];
		},
		// 画面刷新后，清空按键抬起列表
		clearReleased: function() {
			this.release = {};
		},
		contextmenu: function() {
			// 绑定过鼠标右键的话，就不需要弹菜单了
			if (this.bindings[ap.KEY.MOUSE2]) {
				event.stopPropagation();
				event.preventDefault();
			}
		},
		mousemove: function(event) {
			var pos = {
				x: 0,
				y: 0
			};
			if (ap.game) {
				pos = ap.game.getCameraPos();
			}
			this.mouse.x = event.clientX - pos.x;
			this.mouse.y = event.clientY - pos.y;
			this.useMouse = true;
		},
		// 读取按键设定并加载
		bindKey: function() {
			if (!this.config) {
				throw new Exception("按键设定未加载");
			}
			for (var i in this.config) {
				this.bindings[ap.KEY[i]] = this.config[i];
			}
		}
	};
	// 按键设定
	ap.input.config = {
		// 左键普通攻击 
		'MOUSE1': 'attack1',
		// 右键点击移动
		'MOUSE2': 'go',
		// 技能：碎裂之火
		'Q': 'disintegrate',
		// 技能：焚烧
		'W': 'incinerate',
		// 技能：熔岩护盾
		'E': 'moltenShield',
		// 技能：提伯斯之怒
		'R': 'tibbers',
		// 功能：精神爆发，解锁当前区域的出口
		'B': 'Break',
		// 面板：成就
		'Y': 'achievement',
		// 面板：角色
		'C': 'character',
		// 面板：中断退出
		'ESC': 'escape',
		// 不使用鼠标的操作
		'SPACE': 'attack2',
		// 角色移动
		'LEFT': 'left',
		'UP': 'up',
		'RIGHT': 'right',
		'DOWN': 'down'
	};
});