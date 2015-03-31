// 中介 负责对象之间的比较复杂的通信 
ap.module("mediator").requires("scenario", "game", "achievement").defines(function() {
	"use strict";
	ap.mediator = {
		// 装载过的剧本&事件
		events: {},
		// 剧本对象的引用
		scenario: ap.scenario,
		achieve: ap.achievement,

		// 初始化
		init: function() {
			for (var i = 0, l = this.scenario.length; i < l; i++) {
				// 剧本中的事件初始化
				var s = this.scenario[i];
				s.disabled = false;
				if (!s.trigger) {
					// 如果没有触发函数，就需要通过name手动触发
					this.events[s.name] = s.run.bind(s);
				}
			}
		},
		// 检查是否有自定义事件发生
		checkTrigger: function() {
			var s;
			for (var i = 0, l = this.scenario.length; i < l; i++) {
				s = this.scenario[i];
				if (s.trigger) {
					s.trigger();
				}
			}
		},
		// 攻击  参数：攻击者，目标，伤害值，技能id，附加异常, 是否是反射伤害
		attack: function(attacker, target, damage, skillId, status, isReflection) {
			var isDead = false,
				isCritical = false;
			damage = ~~damage;
			// 检查暴击
			if (Math.random() < attacker.critical + attacker.criticalBonus) {
				isCritical = true;
				damage = ~~(damage * 1.5);
			}
			if (!isReflection) {
				// 通知攻击者伤害成功 如果同时发生吸血和反射，优先吸血
				attacker.onDamage(damage);
				// 通知目标受伤
				isDead = target.onHurt(damage, attacker);
				if (attacker instanceof ap.Player) {
					ap.ui.addMessage(attacker.name + "的" + skillId + "对" + target.name + "造成" +
						damage + "伤害。" + (isCritical ? "(暴击）" : ""), "#fa4204");
				}
			} else {
				// 反射攻击没有吸血 并且不会再次反射
				isDead = target.onHurt(damage, attacker, false);
			}
			if (status) {
				// 判断是否附加异常
				for (var n = 0; n < status.length; n++) {
					if (Math.random() < status[0].probability) {
						var s = ap.utils.deepCopy(status[0]),
							uidCheck = true;
						// 判断目标是否已经有这个状态 同一个状态只会刷新时间
						for (var i = 0; i < target.status.length; i++) {
							if (target.status[i].uid == s.uid) {
								uidCheck = false;
								target.status[i].duration = s.duration;
								// 如果是玩家的状态，还需要刷新时间
								if (target instanceof ap.Player && s.dom) {
									// 更新状态栏
									ap.ui.showStatus(s.dom, s.duration);
								}
							}
						}
						if (uidCheck) {
							if (target instanceof ap.Player) {
								// 玩家受到异常的话
								target.getStatus(s);
							} else {
								target.status.push(s);
							}
						}
					}
				}
			}
			if (attacker.type == "player" && isDead) {
				// 如果是玩家杀死怪物，则更新成就 
				this.achieve.currentKillCount += 1;
				this.achieve.skillKillCount[skillId] += 1;
				// 给玩家经验
				ap.game.player.getExp(target.exp);
			}
		},
		// 触发自定义事件
		fire: function(event) {
			if (this.events[event]) {
				return this.events[event]();
			} else {
				console.log("事件未触发：" + event);
			}
		},
		// 物品掉落 type : NORMAL  RARE rate :获得概率
		getItem: function(type, rate) {
			var item = null;
			if (Math.random() < rate) {
				if (type == "RARE" && this.achieve.rareItemCollect.length == ap.config.items[type].length) {
					// 稀有物品已经收集完
					return item;
				}
				// 随机获得一个
				var r = ~~(Math.random() * ap.config.items[type].length),
					item = ap.config.items[type][r];
				// 稀有的话，不可以重复
				while (type == "RARE" && item.own) {
					r = ~~(Math.random() * ap.config.items[type].length);
					item = ap.config.items[type][r];
				}
				if (type == "RARE") {
					this.achieve.rareItemCollect.push(r);
					item.own = true;
				}
			}
			return item;
		}

	};
});