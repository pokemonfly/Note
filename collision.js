// 碰撞检查相关方法
ap.module("collision").defines(function() {
	"use strict";
	ap.collision = {
		// 当前需要检查的实体列表
		entities: null,
		// 场地边界
		border: null,
		init: function() {
			this.entities = ap.game.entities;
			this.border = ap.game.fieldSize;
		},
		// 找出一个随机坐标，可以放置新对象 参数 碰撞体积半径
		getRandomPos: function(radius) {
			var pos = {
				x: ~~(Math.random() * this.border.x),
				y: ~~(Math.random() * this.border.y)
			};
			while (this._checkCollision(pos, radius)) {
				pos.x = ~~(Math.random() * this.border.x);
				pos.y = ~~(Math.random() * this.border.y);
			}
			return pos;
		},

		// 检查实体是否可以按照移动偏移量移动
		checkMoveAll: function() {
			var current = null;
			for (var i = 0, l = this.entities.length; i < l; i++) {
				current = this.entities[i];
				if (current instanceof ap.Monster || current instanceof ap.Player || current instanceof ap.Pat) {
					// 尝试去移动
					var offset = this._tryToMove(current);
					current.pos.x += moveOffset.x;
					current.pos.y += moveOffset.y;
				}
			}
		},
		// 检查实体与伤害区域&飞行物的碰撞 计算伤害是否发生
		checkDamage: function() {
			var current = null;
			for (var i = 0, l = this.entities.length; i < l; i++) {
				current = this.entities[i];
				if (current instanceof ap.Flyer || current instanceof ap.Area) {
					var collisionList = this._checkCollision(current.pos, current.radius);
					// 对每个被命中的目标执行伤害
					collisionList.forEach(function(target) {
						ap.mediator.attack(current.owner, target, current.power, current.name, current.status, current.probability);
					});
					// 碰撞后消灭
					current.isKilled = true;
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
			var collisionList = this._checkCollision({
				x: current.pos.x + current.moveOffset.x,
				y: current.pos.y + current.moveOffset.y
			}, current.radius, current)，
			count = count || 0;
			if (collisionList.length === 0) {
				return current.moveOffset;
			} else {
				// 移动失败，通知实体修改角度
				current.changeRad(count);
				return this._tryToMove(current, ++count);
			}
		},
		// 判断指定点和半径 是否与其他实体有交集 并返回有交集的实体列表 cursor:当前正在检查的目标
		_checkCollision: function(pos, radius, cursor) {
			var current = null,
				distance = 0,
				result = [];
			for (var i = 0, l = this.entities.length; i < l; i++) {
				current = this.entities[i];
				if (current === cursor) {
					continue;
				}
				if (current instanceof ap.Monster || current instanceof ap.Player || current instanceof ap.Pat) {
					distance = ap.utils.getDistance(pos, current.pos);
					if (distance < current.radius + radius) {
						result.push(current);
					}
				}
			}
			return result;
		}

	};
});