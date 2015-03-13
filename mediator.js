// 中介 负责对象之间的比较复杂的通信 
ap.module("mediator").requires("scenario", "game").defines(function() {
	"use strict";
	ap.mediator = {
		// 装载过的剧本&事件
		events: {},
		// 剧本对象的引用
		scenario: ap.scenario,
		achieve: ap.Achievement,
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
		// 攻击  参数：攻击者，目标，伤害值，技能id，附加异常, 附加概率, 是否是反射伤害
		attack: function(attacker, target, damage, skillId, status, probability, isReflection) {
			var isDead = false;
			if (!isReflection) {
				// 通知攻击者伤害成功 如果同时发生吸血和反射，优先吸血
				attacker.onDamage(damage);
				// 通知目标受伤
				isDead = target.onHurt(damage, attacker);
			} else {
				// 反射攻击没有吸血 并且不会再次反射
				isDead = target.onHurt(damage, attacker, false);
			}
			if (status !== null) {
				// 判断是否附加异常 TODO
				if (Math.random() < probability) {
					target.status.push(status);
				}
			}
			if (attacker.type == "PLAYER" && isDead) {
				// 如果是玩家杀死怪物，则更新成就 并通知玩家
				achieve.killCount += 1;
				achieve.skillKillCount[skillId] += 1;
			}
		},
		// 触发自定义事件
		fire: function(event) {
			if (this.events[event]) {
				return this.events[event]();
			} else {
				console.log("事件未触发：" + event);
			}
		}

	};
});