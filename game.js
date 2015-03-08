// 游戏对象 控制游戏整体的表现
ap.module("game").requires("class", "player", "flyer").defines(function() {
	"use strict";
	ap.Game = ap.Class.extend({
		// canvas的context
		context: null,
		// 屏幕大小
		width: 1024,
		height: 768,
		// 屏幕当前的位置
		screen: {
			x: -285,
			y: -300
		},
		// 缓存背景 离屏canvas
		background: null,
		// 背景用的贴图 ground.png为4 * 2 共8个小片，随机拼接组成地面
		tile: new ap.Image("media/sprites/ground.png"),
		// 背景用的边框
		treewall: new ap.Image("media/item/treewall.png"),
		// 背景大小
		backgroundWidth: 3000,
		backgroundHeight: 2000,
		// 背景偏移量
		backgroundOffset: {
			x: 0,
			y: 0
		},
		// 场景活动区域大小
		fieldSize: {
			x: 0,
			y: 0
		},
		// 当前活动的实体
		entities: [],
		player: null,
		difficulty: null,
		init: function(config) {
			// 与canvas建立关联
			this.context = ap.system.context;
			this.width = ap.ui.canvas.width;
			this.height = ap.ui.canvas.height;
			this.entities = [];
			// 初始化背景
			this.createBackground();
			// 创建第一个场景
			this.nextField();
			// 初始化玩家角色
			this.player = new ap.Player(ap.config.player["Annie"]);
			this.entities.push(this.player);
			// 与中介建立引用
			ap.mediator.game = this;

		},
		// 跳到下一个场景
		nextField: function() {

		},
		run: function() {
			this.update();
			this.draw();
		},
		update: function() {
			this.entities.map(function(e) {
				e.update();
			});
		},
		draw: function() {
			// 描绘背景
			this.clear();
			this.context.drawImage(this.background, this.screen.x - this.backgroundOffset.x, this.screen.y - this.backgroundOffset.y,
				this.width, this.height, 0, 0, this.width, this.height);
			// 逐个绘制实体
			this.entities.map(function(e) {
				e.draw();
			});
		},
		// 绘制背景 使用缓存 
		createBackground: function() {
			var cache = ap.$new('canvas'),
				context = cache.getContext("2d"),
				// 地图贴图
				tileW = this.tile.width / 4,
				tileH = this.tile.height / 2,
				// 边框图案
				wallW = this.treewall.width,
				wallH = this.treewall.height,
				// 图像交错比例
				v = 0.6;
			cache.width = this.backgroundWidth;
			// this.backgroundWidth + 2 * wallW + (this.backgroundWidth + 1.6 * wallW) % (0.6 * wallW);
			cache.height = this.backgroundHeight;
			// 平铺地面 
			for (var i = 0, x = Math.ceil(cache.width / tileW); i < x; i++) {
				for (var j = 0, y = Math.ceil(cache.height / tileH); j < y; j++) {
					var w = (i * tileW + tileW > cache.width) ? cache.width - i * tileW : tileW,
						h = (j * tileH + tileH > cache.height) ? cache.height - j * tileH : tileH;
					context.drawImage(this.tile.data, ~~(Math.random() * 4) * tileW, ~~(Math.random() * 2) * tileH, w,
						h, i * tileW, j * tileH, w, h);
				}
			}
			// 添加边框
			for (var i = -v, x = cache.width / wallW; i < x; i += v) {
				for (var j = -v, y = cache.height / wallH; j < y; j += v) {
					// 只描绘固定行
					if (i === -v || i === 0 || i + 2 * v >= x || i + v >= x ||
						j === -v || j === 0 || j + 2 * v >= y || j + v >= y) {
						var w = (i * wallW + wallW > cache.width) ? cache.width - i * wallW : wallW,
							h = (j * wallH + wallH > cache.height) ? cache.height - j * wallH : wallH;
						context.drawImage(this.treewall.data, 0, 0, w,
							h, i * wallW, j * wallH, w, h);
					}
				}
			}
			// 区域测试用
			// context.strokeRect(wallW, wallH, Math.ceil(cache.width / wallW / v - 2) * v * wallW - wallW, 
			// 	Math.ceil(cache.height / wallH / v - 2) * v * wallH - wallH);
			//document.body.appendChild(cache);

			// 设置背景的偏移量
			this.backgroundOffset.x = -wallW;
			this.backgroundOffset.y = -wallH;
			// 设置可以活动的区域
			this.fieldSize.x = Math.ceil(cache.width / wallW / v - 2) * v * wallW - wallW;
			this.fieldSize.y = Math.ceil(cache.width / wallW / v - 2) * v * wallW - wallW;
			// 保存缓存
			this.background = cache;
		},
		// 清空当前的画布
		clear: function(color) {
			// 默认背景黑色
			color = color || "#000";
			this.context.fillStyle = color;
			this.context.fillRect(0, 0, this.width, this.height);
		},
		createFlyer : function(property) {
			var flyer = new ap.Flyer(property);
			this.entities.push(flyer);		
		}
	});
});