// 中介 
"use strict";
ap.Mediator = {
	achieve : ap.Achievement,
	// 攻击  攻击者，目标，伤害值，技能id，附加异常, 附加概率, 是否是反射伤害
	attack : function (attacker, target, damage, skillId, status, probability, isReflection) {
		var isDead = false;
		if (! isReflection) {
			// 通知攻击者伤害成功 如果同时发生吸血和反射，优先吸血
			attacker.onDamage(damage);
			// 通知目标受伤
			isDead = target.onHurt(damage, attacker);
		} else {
			// 反射攻击没有吸血 并且不会再次反射
			isDead = target.onHurt(damage, attacker, false);
		}
		if (status != null) {
			// 判断是否附加异常
			if (Math.random() < probability) {
				target.status.push(status);
			}
		}
		if (attacker.type == "PLAYER" && isDead) {
			// 如果是玩家杀死怪物，则更新成就 并通知玩家
			achieve.killCount += 1;
			achieve.skillKillCount[skillId] += 1;
		}
	}
};