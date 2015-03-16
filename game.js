// 游戏对象 控制游戏整体的表现
ap.module("game").requires("class", "player", "monster", "pat", "flyer", "area", "image", "field", "collision").defines(function() {
	"use strict";
	ap.Game = ap.Class.extend({
		// canvas的context
		context: null,
		// 屏幕大小
		width: 1024,
		height: 768,
		// 屏幕当前的位置修改该对象的值控制背景显示的位置
		screen: {
			x: 0,
			y: 0
		},
		// =========背景显示相关=============
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
		// ==========碰撞检测相关=================
		// 场景活动区域大小 所有的实体都以此区域的左上角作为坐标原点
		// (因为右,下边界是算出来的 需要记录下)
		fieldSize: {
			x: 0,
			y: 0
		},
		// 当前活动的实体
		entities: [],
		// 当前的玩家实体
		player: null,
		// ===========游戏本身属性=========================
		difficulty: null,
		// 游戏设定 由难度决定
		config: null,
		// 击杀后物品掉率倍率
		dropRate: 1,
		// 离开前需要击杀数 如果为0则解锁当前区域
		leaveKillCount: 0,
		// 当前区域是否解锁
		isUnLock: false,

		// 初始化game对象本身
		init: function(config) {
			// 初始化 与canvas建立关联
			this.context = ap.ui.canvas.getContext('2d');
			this.width = ap.ui.canvas.width;
			this.height = ap.ui.canvas.height;
			this.entities = [];
			this.deferredKill = [];
			// 取得当前难道的设定
			this.config = ap.config.difficulty["EASY"];
		},
		// 初始化游戏内容
		start: function() {
			// 初始化背景
			this.createBackground();
			// 初始化碰撞检查
			ap.collision.init();
			// 场景初始化设置
			ap.field.init(this.config.field);
			// 创建第一个场景
			this.nextField();
			// 初始化玩家角色
			this.player = new ap.Player(ap.config.player["Annie"]);
			// 如果有存档则继承属性 TODO

			this.entities.push(this.player);

		},
		// 跳到下一个场景
		nextField: function() {
			this.entities = this.entities.concat(ap.field.nextWave());
			// 锁定当前场景
			this.isUnLock = false;
			this.leaveKillCount = ap.field.leaveKill;
			// 更新UI界面 特性区域
			// ap.ui.set
		},
		run: function() {
			this.update();
			this.draw();
		},
		update: function() {
			// 伤害区域检测
			ap.collision.checkDamage();
			// 遍历实体
			for (var i = 0; i < this.entities.length; i++) {
				var entity = this.entities[i];
				entity.update();
				// 剔除死亡的实体
				if (entity.isKilled) {
					// 死亡后判断是否需要掉落物品
					this.dropItem(entity);
					this.entities.splice(i, 1);
					i--;
				}
			}
			// 移动后碰撞检查
			ap.collision.checkMoveAll();
			// 如果击杀数够了就解锁当前区域
			if (this.leaveKillCount === 0) {
				this.isUnLock = true;
				ap.ui.addMessage("随着怪物的倒下，四周出现了新的道路。");
			}
			if (!this.isUnLock) {
				// 添加出口
			}
			// 处理死亡的对象
			if (this.deferredKill.length > 0) {

			}
		},
		draw: function() {
			// 确定背景位置
			this.moveCamera();
			// 描绘背景
			this.clear();
			this.context.drawImage(this.background, -this.screen.x, -this.screen.y,
				this.width, this.height, 0, 0, this.width, this.height);
			// 绘制实体前需要按照坐标排序 TODO

			// 逐个绘制实体
			this.entities.forEach(function(e) {
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

			// 设置背景的偏移量
			this.backgroundOffset.x = wallW;
			this.backgroundOffset.y = wallH;
			// 设置可以活动的区域
			this.fieldSize.x = Math.ceil(cache.width / wallW / v - 2) * v * wallW - wallW;
			this.fieldSize.y = Math.ceil(cache.height / wallH / v - 2) * v * wallH - wallH;
			// 区域测试用
			// context.strokeRect(wallW, wallH, this.fieldSize.x, this.fieldSize.y);
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
		// 根据当前player的坐标计算当前背景应该在的位置 角色尽量保持在屏幕中央以提高视野
		moveCamera: function() {
			var playerX = this.player.pos.x,
				playerY = this.player.pos.y;
			if (playerX < this.width / 2 - this.backgroundOffset.x) {
				this.screen.x = 0;
			} else if (this.width / 2 > this.backgroundWidth - this.backgroundOffset.x - playerX) {
				this.screen.x = -(this.backgroundWidth - this.width);
			} else {
				this.screen.x = -(this.backgroundOffset.x + playerX - this.width / 2);
			}
			if (playerY < this.height / 2 - this.backgroundOffset.y) {
				this.screen.y = 0;
			} else if (this.height / 2 > this.backgroundHeight - this.backgroundOffset.y - playerY) {
				this.screen.y = -(this.backgroundHeight - this.height);
			} else {
				this.screen.y = -(this.backgroundOffset.y + playerY - this.height / 2);
			}
		},
		getCameraPos: function() {
			return {
				x: this.backgroundOffset.x + this.screen.x,
				y: this.backgroundOffset.y + this.screen.y
			};
		},
		// 生成投射物
		createFlyer: function(property) {
			var flyer = new ap.Flyer(property);
			this.entities.push(flyer);
		},
		// 物品掉落
		dropItem: function(entity) {
			if (entity instanceof ap.Monster) {
				var item = null,
					isRare = false;
				switch (entity.rank) {
					case 0:
						item = ap.mediator.getItem("NORMAL", 0.1 * this.dropRate);
						break;
					case 1:
						item = ap.mediator.getItem("NORMAL", 0.5 * this.dropRate);
						break;
					case 2:
						isRare = true;
						item = ap.mediator.getItem("RARE", 0.2 * this.dropRate);
						break;
				}
				// 获得物品
				if (item) {
					// 使用物品
					item.effect();
					// 显示消息
					ap.ui.addMessage("获得了物品<span class='" + (isRare ? "rare" : "") + "' title='" + item.description + "'>[" + item.name + "]</span>");
				}
			}
		}

	});
});