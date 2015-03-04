// 游戏对象 控制游戏整体的表现
ap.module("game").requires("class", "player").defines(function() {
	"use strict";
	ap.Game = ap.Class.extend({
		// canvas的context
        context: null,
		// 屏幕大小
		width: 1024,
		height: 768,
		// 屏幕当前的位置
		screen: {
            x: 0,
            y: 0
        },
        // 缓存背景
        background: null,
        // 当前活动的实体
		entities: [],
		player : null,
		difficulty : null,
		init : function (config) {
			// 与canvas建立关联
			this.context = ap.system.context;
			this.width = ap.ui.canvas.width;
			this.height = ap.ui.canvas.height;
			this.entities = [],

			// 创建第一个场景
			this.nextField();
			// 初始化玩家角色
			this.player = new ap.Player();
			this.entities.push(this.player);
		},
		// 跳到下一个场景
		nextField: function() {

		},
		run: function() {
			this.clear();
			this.update();
			this.draw();
		},
		update : function() {

		},
		draw: function () {
			this.entities.map(function(e) {
				e.draw();
			});
		},
		// 绘制背景
		createBackground: function() {

		},
		// 清空当前的画布
		clear: function(color) {
			// 默认背景黑色
			color = color || "#000";
            this.context.fillStyle = color;
            this.context.fillRect(0, 0, this.width, this.height);
        },
	});
});
