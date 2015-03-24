// 游戏对象 控制游戏整体的表现
ap.module("game").requires("class", "player", "monster", "pat", "flyer", "area", "image", "animation", "field", "collision").defines(function() {
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
		entities: null,
		// 当前场地上的活动的怪物数目
		monsterCount: 0,
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
		init: function(difficulty) {
			// 初始化 与canvas建立关联
			this.context = ap.ui.canvas.getContext('2d');
			this.width = ap.ui.canvas.width;
			this.height = ap.ui.canvas.height;
			this.entities = [];
			this.deferredKill = [];
			// 取得选择的难度取得对应的设定
			switch (difficulty) {
				case 0:
					this.config = ap.config.difficulty["EASY"];
					break;
				case 1:
					this.config = ap.config.difficulty["NORMAL"];
					break;
				case 2:
					this.config = ap.config.difficulty["HARD"];
					break;
			}
		},
		// 初始化游戏内容
		start: function() {
			// 初始化背景
			this.createBackground();
			// 初始化碰撞检查
			ap.collision.init();
			// 场景初始化设置
			ap.field.init(this.config.field);
			// 初始化玩家角色
			this.player = new ap.Player(ap.config.player["Annie"]);
			// 如果有存档则继承属性
			// TODO
			// 创建第一个场景
			this.nextField();
		},
		// 跳到下一个场景
		nextField: function() {
			// 重置场地上的实体
			this.entities = [];
			// 加入玩家实体 优先加入是为了防止怪物的坐标与玩家重复
			this.entities.push(this.player);
			// 获得怪物信息
			var monsters = ap.field.nextWave();
			this.entities = this.entities.concat(monsters);
			this.monsterCount = monsters.length;
			// 锁定当前场景
			this.isUnLock = false;
			this.leaveKillCount = ap.field.leaveKill;
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
					this.entities.splice(i, 1);
					if (entity instanceof ap.Monster) {
						// 死亡后判断是否需要掉落物品
						this.dropItem(entity.rank);
						// 更新场上怪物数
						this.monsterCount -= 1;
						this.leaveKillCount -= 1;
						// 更新UI
						ap.ui.setLeaveKill(this.leaveKillCount);
					}
					i--;
					// 如果是玩家死亡则结束游戏
					if (entity instanceof ap.Player) {
						// 触发死亡剧情
						ap.mediator.fire("gameover");
						break;
					}
				}
			}
			// 移动后碰撞检查
			ap.collision.checkMoveAll();
			// 如果击杀数够了就解锁当前区域
			if (!this.isUnLock && this.leaveKillCount <= 0) {
				this.isUnLock = true;
				ap.ui.addMessage("随着怪物的倒下，四周出现了新的道路。");
				// 添加4个出口
				this.createArea({
					// 特殊区域 传送门
					type: "portal",
					duration: 9999,
					pos: {
						x: 0,
						y: this.fieldSize.y / 2
					},
					radius: 100,
					coolDown: 0.01,
					animSheet: new ap.Image("media/ui/door.png", {
						x: 140,
						y: 140
					}),
					// 下次角色出现的位置
					nextPlayerPos: {
						x: this.fieldSize.x - 30,
						y: this.fieldSize.y / 2
					}
				});
				this.createArea({
					// 特殊区域 传送门
					type: "portal",
					duration: 9999,
					pos: {
						x: this.fieldSize.x,
						y: this.fieldSize.y / 2
					},
					radius: 100,
					coolDown: 0.01,
					animSheet: new ap.Image("media/ui/door.png", {
						x: 140,
						y: 140
					}),
					nextPlayerPos: {
						x: 30,
						y: this.fieldSize.y / 2
					}
				});
				this.createArea({
					// 特殊区域 传送门
					type: "portal",
					duration: 9999,
					pos: {
						x: this.fieldSize.x / 2,
						y: 0
					},
					radius: 100,
					coolDown: 0.01,
					animSheet: new ap.Image("media/ui/door.png", {
						x: 140,
						y: 140
					}),
					nextPlayerPos: {
						x: this.fieldSize.x / 2,
						y: this.fieldSize.y - 30
					}
				});
				this.createArea({
					// 特殊区域 传送门
					type: "portal",
					duration: 9999,
					pos: {
						x: this.fieldSize.x / 2,
						y: this.fieldSize.y
					},
					radius: 100,
					coolDown: 0.01,
					animSheet: new ap.Image("media/ui/door.png", {
						x: 140,
						y: 140
					}),
					nextPlayerPos: {
						x: this.fieldSize.x / 2,
						y: 30
					}
				});
			}
			// 场上怪物数不够的话
			if (!this.isUnLock && this.monsterCount < ap.field.monstersPlus) {
				var append = ap.field.appendMonster();
				this.entities = this.entities.concat(append);
				this.monsterCount += append.length;
				ap.ui.addMessage("怪物倒下的悲鸣吸引了更多怪物出现。");
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
		// 生成区域
		createArea: function(property) {
			var area = new ap.Area(property);
			this.entities.push(area);
		},
		// 物品掉落
		dropItem: function(rank) {
			var item = null,
				isRare = false;
			switch (rank) {
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
				ap.ui.addMessage("获得了物品<span class='pointer " + (isRare ? "rare" : "") + "' title='" + item.description + "'>[" + item.name + "]</span>");
			}
		},
		// 绘制技能预览 圆心位置 半径 扇形的2个角度
		drawPreviewCircle: function(pos, radius, aimS, aimE) {
			var aimS = aimS || 0,
				aimE = aimE || 0,
				posOffset = ap.game.getCameraPos(),
				context = this.context;
			context.save();
			// 填充颜色浅蓝色
			context.fillStyle = "#3399ff";
			context.strokeStyle = "#3399ff";
			context.globalAlpha = 0.4;
			// 位移到目标点
			context.translate(pos.x + posOffset.x, pos.y + posOffset.y);
			// 绘制区域
			context.beginPath();
			if (aimS === aimE) {
				// 角度相等的时候就是绘制圆形
				context.arc(0, 0, radius, 0, 2 * Math.PI);
			} else {
				//扇形
				context.rotate(aimE);
				context.moveTo(radius, 0);
				context.lineTo(0, 0);
				context.rotate(aimS - aimE);
				context.lineTo(radius, 0);
				context.rotate(-aimS);
				// 画出圆弧
				context.arc(0, 0, radius, aimS, aimE);
			}
			context.closePath();
			// 填充颜色
			context.fill();
			// 描边
			context.globalAlpha = 1;
			context.lineWidth = 2;
			context.stroke();
			context.restore();
		},
		// 绘制技能预览 直线
		drawPreviewArrow: function(pos, length, aim) {
			var posOffset = ap.game.getCameraPos(),
				context = this.context;

			context.save();
			// 填充颜色浅蓝色
			context.fillStyle = "#3399ff";
			context.strokeStyle = "#3399ff";
			context.globalAlpha = 0.4;
			// 位移到目标点
			context.translate(pos.x + posOffset.x, pos.y + posOffset.y);
			// 绘制区域
			context.beginPath();
			context.rotate(aim);
			context.moveTo(0, -3);
			context.lineTo(0, 3);
			context.lineTo(length, 0);
			context.closePath();
			// 填充颜色
			context.fill();
			// 描边
			context.globalAlpha = 1;
			context.lineWidth = 2;
			context.stroke();
			context.restore();
		},
		// 绘制怪物的血条
		drawLifeBar: function(monster) {
			var posOffset = ap.game.getCameraPos(),
				context = this.context,
				lifePercent = monster.life / monster.lifeLimit,
				animSheet = monster.animSheet || monster.anims.sheet[0],
				barWidth = animSheet.width + 10,
				barHeight = 5,
				barPosX = monster.pos.x - animSheet.offset.x - 5 + posOffset.x,
				barPosY = monster.pos.y - animSheet.offset.y - 10 + posOffset.y;
			context.save();
			// 血条背景： 黑色   
			context.fillStyle = "#111506";
			context.fillRect(barPosX, barPosY, barWidth, barHeight);
			// 血条内容： 绿
			context.fillStyle = "#71b871";
			context.fillRect(barPosX + 1, barPosY + 1, ~~((barWidth - 2) * lifePercent), barHeight - 2);
			context.restore();
		}

	});
});