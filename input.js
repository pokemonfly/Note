// 输入监听
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
	};
	ap.input = {
		// 当前已经绑定的按键
		bindings: {},
		actions: {},
		presses: {},
		mouse: {
			x: 0,
			y: 0
		},
		init: function() {
			// 为键盘添加监听
			window.addEventListener('keydown', this.keydown.bind(this), false);
			window.addEventListener('keyup', this.keyup.bind(this), false);
			// 为鼠标添加监听
			window.addEventListener('contextmenu', this.contextmenu.bind(this), false);
			window.addEventListener('mousedown', this.keydown.bind(this), false);
			windowaddEventListener('mouseup', this.keyup.bind(this), false);
			window.addEventListener('mousemove', this.mousemove.bind(this), false);
		},
		keydown: function() {

		},
		keyup: function() {

		},
		contextmenu: function() {
			// 绑定过鼠标右键的话，就不需要弹菜单了
			if (this.bindings[ig.KEY.MOUSE2]) {
				event.stopPropagation();
				event.preventDefault();
			}
		},
		mousemove: function(event) {
			// TODO
			var internalWidth = parseInt(ig.system.canvas.offsetWidth) || ig.system.realWidth;
			var scale = ig.system.scale * (internalWidth / ig.system.realWidth);
			var pos = {
				left: 0,
				top: 0
			};
			if (ig.system.canvas.getBoundingClientRect) {
				pos = ig.system.canvas.getBoundingClientRect();
			}
			var ev = event.touches ? event.touches[0] : event;
			this.mouse.x = (ev.clientX - pos.left) / scale;
			this.mouse.y = (ev.clientY - pos.top) / scale;
		},
		// 读取按键设定并加载
		bindKey: function(key, action) {
			if (!this.config) {
				throw new Exception("按键设定未加载");
			}
			for (var i in this.config) {
				this.bindings[i] = this.config[i];
			}
		}
	};
	// 按键设定
	ap.input.config = {
		// 左键普通攻击 
		"MOUSE1": "Attack",
		// 右键点击移动
		"MOUSE2": "Go",
		// 技能：碎裂之火
		"Q": "Disintegrate",
		// 技能：焚烧
		"W": "Incinerate",
		// 技能：熔岩护盾
		"E": "MoltenShield",
		// 技能：提伯斯之怒
		"R": "Tibbers",
		// 功能：精神爆发，解锁当前区域的出口
		"B": "Break",
		// 面板：成就
		"Y": "Achievement",
		// 面板：角色
		"C": "Character",
		// 面板：中断退出
		"ESC": "Escape"
	};
});