// 碰撞检查相关方法
ap.module("collision").defines(function() {
	"use strict";
	ap.collision = {
		// 场地边界
		border: null,
		init: function() {
			this.border = ap.game.fieldSize;
		},
		// 找出一个随机坐标，可以放置新对象 参数 碰撞体积半径 posX posY  posRadius:指定位置的范围内
		getRandomPos: function(radius, posX, posY, posRadius) {
			var pos = null, 
				counter = 0;
			if (posX === undefined) {
				// 未指定范围的话是全屏
				pos = {
					x: ~~(Math.random() * this.border.x),
					y: ~~(Math.random() * this.border.y)
				};
			} else {
				pos = {
					x: ~~(Math.random() * posRadius * 2 + posX - posRadius),
					y: ~~(Math.random() * posRadius * 2 + posY - posRadius),
				};
			}
			while (this._checkCollision(pos, radius).length > 0 || !this._checkBorder(pos, radius)) {
				pos.x = ~~(Math.random() * this.border.x);
				pos.y = ~~(Math.random() * this.border.y);
				counter ++;
				if (counter > 1000) {
					throw new Error("目标范围无空间");
				}
			}
			return pos;
		},
		// 检查实体是否可以按照移动偏移量移动
		checkMoveAll: function() {
			var current = null;
			for (var i = 0, l = ap.game.entities.length; i < l; i++) {
				current = ap.game.entities[i];
				if (current instanceof ap.Monster || current instanceof ap.Player || current instanceof ap.Pat) {
					// 尝试去移动
					if (current.moveOffset.x !== 0 || current.moveOffset.y !== 0) {
						var offset = this._tryToMove(current);
						current.pos.x += offset.x;
						current.pos.y += offset.y;

					}
				} else if (current instanceof ap.Flyer) {
					current.pos.x += current.moveOffset.x;
					current.pos.y += current.moveOffset.y;
				}
			}
		},
		// 检查实体与伤害区域&飞行物的碰撞 计算伤害是否发生
		checkDamage: function() {
			var current = null;
			for (var i = 0, l = ap.game.entities.length; i < l; i++) {
				current = ap.game.entities[i];
				//  投射物
				if (current instanceof ap.Flyer) {
					var collisionList = this._checkCollision(current.pos, current.radius);
					// 对每个被命中的目标执行伤害
					collisionList.forEach(function(target) {
						if (target.type !== current.type) {
							ap.mediator.attack(current.owner, target, current.power, current.name, current.status);
							// 碰撞后消灭
							current.isKilled = true;
						}
					});
				}
				// 区域
				if (current instanceof ap.Area && current.isReady) {
					var collisionList = this._checkCollision(current.pos, current.radius, null, current.aimS, current.aimE);
					if (current.type != "portal") {
						// 对每个被命中的目标执行伤害 添加状态
						collisionList.forEach(function(target) {
							if (target.type !== current.type) {
								ap.mediator.attack(current.owner, target, current.power, current.name, current.status);
							}
						});
					} else {
						// 传送门
						collisionList.forEach(function(target) {
							if (target.type == "player") {
								var p = ap.game.player;
								// 重置玩家坐标
								p.pos.x = current.nextPlayerPos.x;
								p.pos.y = current.nextPlayerPos.y;
								p.moveTo.x = p.pos.x;
								p.moveTo.y = p.pos.y;
								// 移动到下一个区域
								ap.game.nextField();
							}
						});
					}
				}
			}
		},
		// 尝试移动 如果失败的话就修改角度再试 count 尝试次数
		_tryToMove: function(current, count) {
			if (count > 10) {
				// 超时， 该实体从此无法移动
				return {
					x: 0,
					y: 0
				};
			}
			var pos = {
					x: current.pos.x + current.moveOffset.x,
					y: current.pos.y + current.moveOffset.y
				},
				collisionList = this._checkCollision(pos, current.radius, current);
			count = count || 0;
			if (collisionList.length === 0 && this._checkBorder(pos, current.radius)) {
				return current.moveOffset;
			} else {
				// 移动失败，通知实体修改角度
				current.changeRad(count);
				count++;
				return this._tryToMove(current, count);
			}
		},
		// 判断指定点和半径 是否与其他实体有交集 并返回有交集的实体列表 cursor:当前正在检查的目标 aimS aimE 扇形的话，2个角度
		_checkCollision: function(pos, radius, cursor, aimS, aimE) {
			var current = null,
				distance = 0,
				result = [];
			for (var i = 0, l = ap.game.entities.length; i < l; i++) {
				current = ap.game.entities[i];
				if (current === cursor) {
					continue;
				}
				if (current instanceof ap.Monster || current instanceof ap.Player || current instanceof ap.Pat) {
					distance = ap.utils.getDistance(pos, current.pos);
					if (distance < current.radius + radius) {
						if (aimS || aimE) {
							// 如果是扇形区域的话
							var rad = ap.utils.getRad(pos, current.pos);
							if (rad < aimS || rad > aimE) {
								// 区域外的话，排除
								continue;
							}
						}
						result.push(current);
					}
				}
			}
			return result;
		},
		// 判断指定点和半径是否与边界相交 
		_checkBorder: function(pos, radius) {
			if (pos.x - radius < 0 || pos.x + radius > this.border.x || pos.y < 0 || pos.y > this.border.y) {
				return false;
			} else {
				return true;
			}
		}

	};
});